alter table public.commerce_email_outbox
 add column provider text check(provider in ('smtp','resend')),
 add column provider_message_id uuid,
 add column first_attempt_at timestamptz,
 add column recipient_override text,
 add column message_payload jsonb,
 add column delivery_status text check(delivery_status in ('accepted','delayed','delivered','bounced','complained','failed','suppressed')),
 alter column order_id drop not null,
 drop constraint commerce_email_outbox_kind_check,
 add constraint commerce_email_outbox_kind_check check(kind in ('payment_received','order_cancelled','delivery_probe')),
 add constraint commerce_email_probe_scope check(
  (kind='delivery_probe' and order_id is null and provider is not null and provider='resend' and recipient_override is not null and length(recipient_override)<=254)
  or (kind<>'delivery_probe' and order_id is not null and recipient_override is null)
 );
update public.commerce_email_outbox set provider='smtp',first_attempt_at=case when attempts>0 then created_at else null end,delivery_status=case when state='sent' then 'accepted' else null end;

create table public.commerce_email_provider_events (
 event_id text primary key check(length(event_id) between 1 and 200),
 email_id uuid not null,
 event_type text not null check(event_type in ('email.sent','email.delivered','email.delivery_delayed','email.bounced','email.complained','email.failed','email.suppressed')),
 body_hash text not null check(body_hash ~ '^[a-f0-9]{64}$'),created_at timestamptz not null default now()
);
alter table public.commerce_email_provider_events enable row level security;
revoke all on public.commerce_email_provider_events from public,anon,authenticated;
grant select,insert on public.commerce_email_provider_events to service_role;
create index commerce_email_provider_message on public.commerce_email_outbox(provider_message_id) where provider='resend';
create unique index commerce_email_provider_message_unique on public.commerce_email_outbox(provider,provider_message_id) where provider_message_id is not null;

create function public.commerce_claim_provider_emails(p_provider text,p_include_new boolean)
returns table(id uuid,order_id uuid,kind text,lease_token uuid,recipient text,total integer,product_names text,provider text,first_attempt_at timestamptz,created_at timestamptz,message_payload jsonb)
language plpgsql security invoker set search_path='' as $$
declare job public.commerce_email_outbox; o public.commerce_orders; token uuid;
begin
 if p_provider is null or p_provider not in ('smtp','resend') or p_include_new is null then raise exception 'Invalid email provider'; end if;
 insert into public.commerce_email_attempts(outbox_id,attempt,outcome,error_class)
 select q.id,q.attempts,case when q.attempts>=5 then 'failed' else 'retry' end,case when p_provider='smtp' then 'SMTP_TIMEOUT' else 'RESEND_UNKNOWN' end
 from public.commerce_email_outbox q where q.provider=p_provider and q.state='sending' and q.lease_until<=now()
 on conflict(outbox_id,attempt) do nothing;
 update public.commerce_email_outbox q set state='failed',last_error_class=case when q.provider='resend' and q.attempts<5 then 'RESEND_RETRY_WINDOW_EXPIRED' else 'ATTEMPTS_EXHAUSTED' end,
  lease_token=null,lease_until=null,updated_at=now()
 where q.provider=p_provider and q.state in ('queued','sending') and coalesce(q.lease_until,'epoch')<=now()
  and (q.attempts>=5 or (q.provider='resend' and q.first_attempt_at<now()-interval '23 hours'));
 for job in select q.* from public.commerce_email_outbox q where q.state in ('queued','sending') and q.attempts<5
  and (q.provider=p_provider or (p_include_new and q.provider is null))
  and q.next_attempt_at<=now() and coalesce(q.lease_until,'epoch')<=now() order by q.created_at for update skip locked limit 3
 loop
  if job.kind<>'delivery_probe' then
   select * into o from public.commerce_orders where commerce_orders.id=job.order_id;
   if (job.kind='payment_received' and o.status<>'paid') or (job.kind='order_cancelled' and o.status<>'cancelled') then
    update public.commerce_email_outbox q set state='skipped',lease_token=null,lease_until=null,updated_at=now() where q.id=job.id;
    continue;
   end if;
  end if;
  token:=gen_random_uuid();
  update public.commerce_email_outbox q set provider=p_provider,state='sending',attempts=q.attempts+1,first_attempt_at=coalesce(q.first_attempt_at,now()),
   lease_token=token,lease_until=now()+interval '10 minutes',updated_at=now() where q.id=job.id returning * into job;
  return query select job.id,job.order_id,job.kind,token,case when job.kind='delivery_probe' then job.recipient_override else o.customer_email end,
   case when job.kind='delivery_probe' then 0 else o.total end,
   (select string_agg(i.product_name,', ' order by i.id) from public.commerce_order_items i where i.order_id=job.order_id),job.provider,job.first_attempt_at,job.created_at,job.message_payload;
 end loop;
end $$;

-- Existing deployed Gmail workers keep their interface but also pin their jobs.
create or replace function public.commerce_claim_transaction_emails()
returns table(id uuid,order_id uuid,kind text,lease_token uuid,recipient text,total integer,product_names text)
language sql security invoker set search_path='' as $$
 select id,order_id,kind,lease_token,recipient,total,product_names from public.commerce_claim_provider_emails('smtp',true)
$$;

-- Freeze the exact provider body before network I/O. Retries remain byte-for-byte
-- identical even if a product name or Reply-To configuration changes meanwhile.
create function public.commerce_prepare_resend_email(p_id uuid,p_token uuid,p_payload jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare job public.commerce_email_outbox; recipient text;
begin
 select * into job from public.commerce_email_outbox where id=p_id for update;
 if not found or job.lease_token is distinct from p_token or job.state<>'sending' or job.provider is distinct from 'resend' then raise exception 'Email lease mismatch'; end if;
 if job.message_payload is not null then return job.message_payload; end if;
 recipient:=case when job.kind='delivery_probe' then job.recipient_override else (select customer_email from public.commerce_orders where id=job.order_id) end;
 if p_payload is null or jsonb_typeof(p_payload)<>'object' or length(p_payload::text)>32768
  or (p_payload->>'from') is distinct from 'Khadafi <notifications@khadafidaffa.com>'
  or (p_payload->'to') is distinct from jsonb_build_array(recipient)
  or coalesce(length(p_payload->>'subject'),0) not between 1 and 200
  or coalesce(length(p_payload->>'text'),0) not between 1 and 20000 then raise exception 'Invalid email payload'; end if;
 update public.commerce_email_outbox set message_payload=p_payload where id=job.id;
 return p_payload;
end $$;

create function public.commerce_finish_provider_email(p_id uuid,p_token uuid,p_provider text,p_accepted boolean,p_error text,p_provider_id uuid)
returns void language plpgsql security invoker set search_path='' as $$
declare job public.commerce_email_outbox; code text; permanent boolean;
begin
 if p_accepted is null then raise exception 'Invalid email outcome'; end if;
 select * into job from public.commerce_email_outbox where id=p_id for update;
 if not found or job.lease_token is distinct from p_token or job.state<>'sending' or job.provider is distinct from p_provider then raise exception 'Email lease mismatch'; end if;
 if p_accepted and p_provider='resend' and p_provider_id is null then raise exception 'Provider message ID missing'; end if;
 code:=case when p_accepted then null when p_error in ('SMTP_AUTH','SMTP_TIMEOUT','SMTP_CONNECTION','SMTP_RECIPIENT','SMTP_SEND_FAILED','INVALID_RECIPIENT','RESEND_AUTH','RESEND_RATE_LIMITED','RESEND_REJECTED','RESEND_UNKNOWN','RESEND_KEY_CONFLICT') then p_error else 'EMAIL_SEND_FAILED' end;
 permanent:=code in ('INVALID_RECIPIENT','RESEND_AUTH','RESEND_REJECTED','RESEND_KEY_CONFLICT');
 insert into public.commerce_email_attempts(outbox_id,attempt,outcome,error_class)
 values(job.id,job.attempts,case when p_accepted then 'accepted' when job.attempts>=5 or permanent then 'failed' else 'retry' end,code);
 update public.commerce_email_outbox set state=case when p_accepted then 'sent' when job.attempts>=5 or permanent then 'failed' else 'queued' end,
  accepted_at=case when p_accepted then now() else null end,provider_message_id=case when p_accepted then p_provider_id else provider_message_id end,
  delivery_status=case when p_accepted then 'accepted' else delivery_status end,last_error_class=code,lease_token=null,lease_until=null,
  next_attempt_at=now()+make_interval(mins=>least(120,power(3,job.attempts)::integer)),updated_at=now() where id=job.id;
 if p_provider_id is not null then
  update public.commerce_email_outbox q set delivery_status=coalesce((select case when e.event_type='email.delivery_delayed' then 'delayed' when e.event_type='email.sent' then 'accepted' else replace(e.event_type,'email.','') end from public.commerce_email_provider_events e
   where e.email_id=p_provider_id order by case e.event_type when 'email.complained' then 7 when 'email.bounced' then 6 when 'email.suppressed' then 5 when 'email.failed' then 4 when 'email.delivered' then 3 when 'email.delivery_delayed' then 2 else 1 end desc limit 1),'accepted') where q.id=job.id;
 end if;
end $$;

create function public.commerce_record_resend_email_event(p_event text,p_email uuid,p_type text,p_hash text)
returns void language plpgsql security invoker set search_path='' as $$
declare previous public.commerce_email_provider_events;
begin
 insert into public.commerce_email_provider_events(event_id,email_id,event_type,body_hash) values(p_event,p_email,p_type,p_hash) on conflict(event_id) do nothing;
 select * into previous from public.commerce_email_provider_events where event_id=p_event;
 if previous.email_id is distinct from p_email or previous.event_type is distinct from p_type or previous.body_hash is distinct from p_hash then raise exception 'Conflicting email event replay'; end if;
 update public.commerce_email_outbox q set delivery_status=(select case when e.event_type='email.delivery_delayed' then 'delayed' when e.event_type='email.sent' then 'accepted' else replace(e.event_type,'email.','') end
  from public.commerce_email_provider_events e where e.email_id=p_email order by case e.event_type when 'email.complained' then 7 when 'email.bounced' then 6 when 'email.suppressed' then 5 when 'email.failed' then 4 when 'email.delivered' then 3 when 'email.delivery_delayed' then 2 else 1 end desc limit 1),updated_at=now()
 where q.provider='resend' and q.provider_message_id=p_email;
end $$;
revoke all on function public.commerce_claim_provider_emails(text,boolean),public.commerce_prepare_resend_email(uuid,uuid,jsonb),public.commerce_finish_provider_email(uuid,uuid,text,boolean,text,uuid),public.commerce_record_resend_email_event(text,uuid,text,text) from public,anon,authenticated;
grant execute on function public.commerce_claim_provider_emails(text,boolean),public.commerce_prepare_resend_email(uuid,uuid,jsonb),public.commerce_finish_provider_email(uuid,uuid,text,boolean,text,uuid),public.commerce_record_resend_email_event(text,uuid,text,text) to service_role;
