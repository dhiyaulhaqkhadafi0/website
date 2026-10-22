-- Durable transaction mail. No buyer or anonymous Data API access.
create table public.commerce_email_outbox (
 id uuid primary key default gen_random_uuid(),
 order_id uuid not null references public.commerce_orders(id) on delete cascade,
 kind text not null check(kind in ('payment_received','order_cancelled')),
 state text not null default 'queued' check(state in ('queued','sending','sent','failed','skipped')),
 attempts integer not null default 0 check(attempts between 0 and 5),
 next_attempt_at timestamptz not null default now(),
 lease_token uuid, lease_until timestamptz,
 last_error_class text, accepted_at timestamptz,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 unique(order_id,kind)
);
alter table public.commerce_email_outbox enable row level security;
revoke all on public.commerce_email_outbox from public,anon,authenticated;
grant select,insert,update,delete on public.commerce_email_outbox to service_role;
create index commerce_email_due on public.commerce_email_outbox(next_attempt_at) where state in ('queued','sending');

create table public.commerce_email_attempts (
 id uuid primary key default gen_random_uuid(),
 outbox_id uuid not null references public.commerce_email_outbox(id) on delete cascade,
 attempt integer not null,
 outcome text not null check(outcome in ('accepted','retry','failed')),
 error_class text,created_at timestamptz not null default now(),unique(outbox_id,attempt)
);
alter table public.commerce_email_attempts enable row level security;
revoke all on public.commerce_email_attempts from public,anon,authenticated;
grant select,insert on public.commerce_email_attempts to service_role;

create function public.commerce_queue_transaction_email()
returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if new.provider='doku' and old.status is distinct from new.status then
  if new.status='paid' then
   insert into public.commerce_email_outbox(order_id,kind) values(new.id,'payment_received') on conflict(order_id,kind) do nothing;
  elsif new.status='cancelled' then
   insert into public.commerce_email_outbox(order_id,kind) values(new.id,'order_cancelled') on conflict(order_id,kind) do nothing;
  end if;
 end if;
 return new;
end $$;
revoke all on function public.commerce_queue_transaction_email() from public,anon,authenticated;
grant execute on function public.commerce_queue_transaction_email() to service_role;
create trigger commerce_transaction_email after update of status on public.commerce_orders for each row execute function public.commerce_queue_transaction_email();

create function public.commerce_claim_transaction_emails()
returns table(id uuid,order_id uuid,kind text,lease_token uuid,recipient text,total integer,product_names text)
language plpgsql security invoker set search_path='' as $$
declare job public.commerce_email_outbox; o public.commerce_orders; token uuid;
begin
 -- A crashed sender may have received an SMTP acknowledgement before it could
 -- persist it. Keep a stable Message-ID and record the expired attempt safely.
 insert into public.commerce_email_attempts(outbox_id,attempt,outcome,error_class)
 select q.id,q.attempts,case when q.attempts>=5 then 'failed' else 'retry' end,'SMTP_TIMEOUT'
 from public.commerce_email_outbox q where q.state='sending' and q.lease_until<=now()
 on conflict(outbox_id,attempt) do nothing;
 update public.commerce_email_outbox q set state='failed',last_error_class='SMTP_TIMEOUT',lease_token=null,lease_until=null,updated_at=now()
 where q.state='sending' and q.attempts>=5 and q.lease_until<=now();
 for job in select q.* from public.commerce_email_outbox q where q.state in ('queued','sending') and q.attempts<5
  and q.next_attempt_at<=now() and coalesce(q.lease_until,'epoch')<=now() order by q.created_at for update skip locked limit 3
 loop
  select * into o from public.commerce_orders where commerce_orders.id=job.order_id;
  if (job.kind='payment_received' and o.status<>'paid') or (job.kind='order_cancelled' and o.status<>'cancelled') then
   update public.commerce_email_outbox q set state='skipped',lease_token=null,lease_until=null,updated_at=now() where q.id=job.id;
   continue;
  end if;
  token:=gen_random_uuid();
  update public.commerce_email_outbox q set state='sending',attempts=q.attempts+1,lease_token=token,lease_until=now()+interval '10 minutes',updated_at=now() where q.id=job.id;
  return query select job.id,job.order_id,job.kind,token,o.customer_email,o.total,
   (select string_agg(i.product_name,', ' order by i.id) from public.commerce_order_items i where i.order_id=job.order_id);
 end loop;
end $$;

create function public.commerce_finish_transaction_email(p_id uuid,p_token uuid,p_accepted boolean,p_error text)
returns void language plpgsql security invoker set search_path='' as $$
declare job public.commerce_email_outbox; code text;
begin
 select * into job from public.commerce_email_outbox where id=p_id for update;
 if not found or job.lease_token is distinct from p_token or job.state<>'sending' then raise exception 'Email lease mismatch'; end if;
 code:=case when p_accepted then null when p_error in ('SMTP_AUTH','SMTP_TIMEOUT','SMTP_CONNECTION','SMTP_RECIPIENT','SMTP_SEND_FAILED','INVALID_RECIPIENT') then p_error else 'SMTP_SEND_FAILED' end;
 insert into public.commerce_email_attempts(outbox_id,attempt,outcome,error_class)
 values(job.id,job.attempts,case when p_accepted then 'accepted' when job.attempts>=5 then 'failed' else 'retry' end,code);
 update public.commerce_email_outbox set state=case when p_accepted then 'sent' when job.attempts>=5 then 'failed' else 'queued' end,
 accepted_at=case when p_accepted then now() else null end,last_error_class=code,lease_token=null,lease_until=null,
 next_attempt_at=now()+make_interval(mins=>least(120,power(3,job.attempts)::integer)),updated_at=now() where id=job.id;
end $$;
revoke all on function public.commerce_claim_transaction_emails(),public.commerce_finish_transaction_email(uuid,uuid,boolean,text) from public,anon,authenticated;
grant execute on function public.commerce_claim_transaction_emails(),public.commerce_finish_transaction_email(uuid,uuid,boolean,text) to service_role;
