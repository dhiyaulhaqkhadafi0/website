-- Additive preparation only. Applying this to production requires approval.
alter table public.commerce_products add column is_payment_qa boolean not null default false;
-- Test records must remain drafts, even if an editor attempts publishing one.
alter table public.commerce_products add constraint commerce_qa_private check(not is_payment_qa or status='draft');
create table public.commerce_doku_state (
 order_id uuid primary key references public.commerce_orders(id),
 environment text not null check(environment in ('sandbox','production')),
 invoice text not null unique check(invoice ~ '^KS[0-9A-Z]{1,25}$'),
 checkout_request_id uuid not null default gen_random_uuid(),
 checkout_state text not null default 'new' check(checkout_state in ('new','creating','ready','unknown')),
 checkout_lease uuid, checkout_lease_until timestamptz,
 attempts integer not null default 0, last_checked_at timestamptz,
 next_check_at timestamptz not null default now()+interval '3 minutes',
 lease_token uuid, lease_until timestamptz, error_class text,
 updated_at timestamptz not null default now()
);
create table public.commerce_doku_events (
 environment text not null check(environment in ('sandbox','production')),
 event_id text not null check(length(event_id) between 1 and 128),
 body_hash text not null check(body_hash ~ '^[a-f0-9]{64}$'),
 order_id uuid not null references public.commerce_orders(id),
 status text not null, channel text not null,
 received_at timestamptz not null default now(),
 primary key(environment,event_id)
);
alter table public.commerce_doku_state enable row level security;
alter table public.commerce_doku_events enable row level security;
revoke all on public.commerce_doku_state,public.commerce_doku_events from public,anon,authenticated;
grant all on public.commerce_doku_state,public.commerce_doku_events to service_role;
create index commerce_doku_due on public.commerce_doku_state(environment,next_check_at);

create or replace function public.commerce_claim_doku_checkout(p_order uuid,p_environment text,p_invoice text)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare o public.commerce_orders; s public.commerce_doku_state; token uuid:=gen_random_uuid();
begin
 select * into o from public.commerce_orders where id=p_order for update;
 if not found or o.provider<>'doku' or o.status<>'pending' or o.total<=0 or o.currency<>'IDR'
 then raise exception 'Order unavailable'; end if;
 insert into public.commerce_doku_state(order_id,environment,invoice) values(p_order,p_environment,p_invoice)
 on conflict(order_id) do nothing;
 select * into s from public.commerce_doku_state where order_id=p_order for update;
 if s.environment is distinct from p_environment or s.invoice is distinct from p_invoice then raise exception 'Environment or invoice mismatch'; end if;
 if o.payment_url is not null then return jsonb_build_object('url',o.payment_url); end if;
 -- Unknown outcomes are checked by reconciliation, never blindly recreated.
 if s.checkout_state<>'new' then return jsonb_build_object('busy',true); end if;
 update public.commerce_doku_state set checkout_state='creating',checkout_lease=token,
 checkout_lease_until=now()+interval '1 minute',updated_at=now() where order_id=p_order;
 return jsonb_build_object('token',token,'request_id',s.checkout_request_id);
end $$;
create or replace function public.commerce_finish_doku_checkout(p_order uuid,p_token uuid,p_url text)
returns void language plpgsql security invoker set search_path='' as $$
declare s public.commerce_doku_state;
begin
 select * into s from public.commerce_doku_state where order_id=p_order for update;
 if not found or s.checkout_lease is distinct from p_token then raise exception 'Lease mismatch'; end if;
 if p_url is not null and not (
  (s.environment='sandbox' and p_url ~ '^https://(staging|sandbox)\.doku\.com/') or
  (s.environment='production' and p_url ~ '^https://jokul\.doku\.com/')
 ) then raise exception 'Invalid checkout host'; end if;
 update public.commerce_orders set payment_url=coalesce(p_url,payment_url),updated_at=now()
 where id=p_order and provider='doku';
 update public.commerce_doku_state set checkout_state=case when p_url is null then 'unknown' else 'ready' end,
 checkout_lease=null,checkout_lease_until=null,updated_at=now() where order_id=p_order;
end $$;

-- Repair entitlements even when an earlier successful transaction already marked paid.
create or replace function public.commerce_set_payment_doku(p_order uuid,p_total integer,p_reference text)
returns void language plpgsql security invoker set search_path='' as $$
declare o public.commerce_orders;
begin
 select * into o from public.commerce_orders where id=p_order for update;
 if not found or o.provider<>'doku' or o.total is distinct from p_total or o.currency<>'IDR'
 or o.status in ('refunded','cancelled','failed') then raise exception 'Payment mismatch'; end if;
 if not exists(select 1 from public.commerce_doku_state where order_id=p_order and invoice=p_reference)
 or (o.payment_reference is not null and o.payment_reference<>p_reference) then raise exception 'Invoice mismatch'; end if;
 update public.commerce_orders set status='paid',payment_reference=p_reference,updated_at=now() where id=p_order;
 insert into public.commerce_entitlements(user_id,resource_id,order_id)
 select o.user_id,i.product_id,o.id from public.commerce_order_items i where i.order_id=o.id
 on conflict(user_id,resource_type,resource_id,order_id) do nothing;
end $$;

create or replace function public.commerce_record_doku_event(
 p_order uuid,p_total integer,p_reference text,p_environment text,p_event text,p_hash text,p_status text,p_channel text
) returns void language plpgsql security invoker set search_path='' as $$
declare o public.commerce_orders; s public.commerce_doku_state; previous public.commerce_doku_events;
begin
 select * into o from public.commerce_orders where id=p_order for update;
 select * into s from public.commerce_doku_state where order_id=p_order for update;
 if o.id is null or s.order_id is null or o.provider<>'doku' or o.total is distinct from p_total or o.currency<>'IDR'
 or s.environment is distinct from p_environment or s.invoice is distinct from p_reference
 or p_channel not in ('VIRTUAL_ACCOUNT_BANK_MANDIRI','QRIS_DOKU')
 or p_status not in ('SUCCESS','PENDING','FAILED','EXPIRED','TIMEOUT','REFUNDED','DISPUTED')
 then raise exception 'Event mismatch'; end if;
 insert into public.commerce_doku_events(environment,event_id,body_hash,order_id,status,channel)
 values(p_environment,p_event,p_hash,p_order,p_status,p_channel) on conflict do nothing;
 select * into previous from public.commerce_doku_events where environment=p_environment and event_id=p_event;
 if previous.body_hash<>p_hash or previous.order_id<>p_order then raise exception 'Conflicting event replay'; end if;
 if p_status='SUCCESS' then
  perform public.commerce_set_payment_doku(p_order,p_total,p_reference);
 elsif p_status in ('REFUNDED','DISPUTED') then
  -- Revoke only this order's grants. Keep other purchases intact.
  update public.commerce_entitlements set status='revoked' where order_id=p_order;
  if o.status='paid' then update public.commerce_orders set status='refunded',updated_at=now() where id=p_order; end if;
 end if;
 -- FAILED/EXPIRED are attempt observations, never regress a paid order.
 update public.commerce_doku_state set error_class=case when p_status in ('REFUNDED','DISPUTED') then 'REVIEW_REQUIRED' else null end,
 updated_at=now() where order_id=p_order;
end $$;

create or replace function public.commerce_claim_doku_reconciliation(p_environment text)
returns setof public.commerce_doku_state language plpgsql security invoker set search_path='' as $$
begin
 return query with due as (
  select s.order_id from public.commerce_doku_state s join public.commerce_orders o on o.id=s.order_id
  where s.environment=p_environment and s.next_check_at<=now() and coalesce(s.lease_until,'epoch')<now()
  and o.created_at<now()-interval '3 minutes' and o.created_at>now()-interval '7 days'
  and (o.status='pending' or (o.status='paid' and exists(
    select 1 from public.commerce_order_items i where i.order_id=o.id and not exists(
     select 1 from public.commerce_entitlements e where e.order_id=o.id and e.resource_id=i.product_id))))
  order by s.next_check_at limit 10 for update of s skip locked
 ) update public.commerce_doku_state s set lease_token=gen_random_uuid(),lease_until=now()+interval '5 minutes',
 attempts=s.attempts+1,last_checked_at=now(),updated_at=now() from due where s.order_id=due.order_id returning s.*;
end $$;
create or replace function public.commerce_finish_doku_reconciliation(p_order uuid,p_token uuid,p_error text)
returns void language plpgsql security invoker set search_path='' as $$
begin
 update public.commerce_doku_state set lease_token=null,lease_until=null,error_class=p_error,
 next_check_at=now()+make_interval(secs=>least(3600,60*power(2,least(attempts,6)))::integer),updated_at=now()
 where order_id=p_order and lease_token=p_token;
 if not found then raise exception 'Lease mismatch'; end if;
end $$;

-- Prepared private QA only: no automatic production insertion/activation.
create or replace function public.commerce_create_doku_qa_order(p_user uuid,p_product uuid,p_key uuid,p_free boolean)
returns public.commerce_orders language plpgsql security invoker set search_path='' as $$
declare p public.commerce_products; qa_email text; o public.commerce_orders;
begin
 select private.commerce_payment_qa_email(p_user) into qa_email;
 if qa_email is null then raise exception 'QA owner required'; end if;
 select * into p from public.commerce_products where id=p_product and status='draft' and is_payment_qa and price=1000;
 if p.id is null or not exists(select 1 from public.commerce_product_files where product_id=p.id and storage_path like 'payment-qa/%') then raise exception 'Private test file required'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_user::text||p_product::text,0));
 select * into o from public.commerce_orders where user_id=p_user and idempotency_key=p_key;
 if found then
  if o.provider<>(case when p_free then 'free' else 'doku' end) or not exists(select 1 from public.commerce_order_items where order_id=o.id and product_id=p.id) then raise exception 'Idempotency conflict'; end if;
  return o;
 end if;
 insert into public.commerce_orders(user_id,customer_name,customer_email,total,provider,idempotency_key,status)
 values(p_user,'Payment QA',qa_email,case when p_free then 0 else 1000 end,case when p_free then 'free' else 'doku' end,p_key,case when p_free then 'paid' else 'pending' end) returning * into o;
 insert into public.commerce_order_items(order_id,product_id,product_name,price) values(o.id,p.id,p.name,o.total);
 if p_free then insert into public.commerce_entitlements(user_id,resource_id,order_id) values(p_user,p.id,o.id) on conflict do nothing; end if;
 return o;
end $$;

revoke all on function public.commerce_claim_doku_checkout(uuid,text,text),public.commerce_finish_doku_checkout(uuid,uuid,text),public.commerce_record_doku_event(uuid,integer,text,text,text,text,text,text),public.commerce_claim_doku_reconciliation(text),public.commerce_finish_doku_reconciliation(uuid,uuid,text),public.commerce_create_doku_qa_order(uuid,uuid,uuid,boolean) from public,anon,authenticated;
grant execute on function public.commerce_claim_doku_checkout(uuid,text,text),public.commerce_finish_doku_checkout(uuid,uuid,text),public.commerce_record_doku_event(uuid,integer,text,text,text,text,text,text),public.commerce_claim_doku_reconciliation(text),public.commerce_finish_doku_reconciliation(uuid,uuid,text),public.commerce_create_doku_qa_order(uuid,uuid,uuid,boolean) to service_role;




-- Preserve the price snapshot/idempotency rules and avoid repeat purchase charges.
create or replace function public.commerce_create_order_doku(p_user uuid,p_product uuid,p_name text,p_email text,p_key uuid)
returns public.commerce_orders language plpgsql security invoker set search_path='' as $$
declare product public.commerce_products; result public.commerce_orders;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_user::text||p_product::text,0));
 select * into result from public.commerce_orders where user_id=p_user and idempotency_key=p_key;
 if found then
  if result.provider<>'doku' or not exists(select 1 from public.commerce_order_items where order_id=result.id and product_id=p_product)
  then raise exception 'Idempotency conflict'; end if;
  return result;
 end if;
 select o.* into result from public.commerce_orders o join public.commerce_entitlements e on e.order_id=o.id
 where e.user_id=p_user and e.resource_type='product' and e.resource_id=p_product and e.status='active'
 and (e.expires_at is null or e.expires_at>now()) and o.status='paid' limit 1;
 if found then return result; end if;
 -- Also reuse a recent pending intent for this product across tabs/new keys.
 select o.* into result from public.commerce_orders o join public.commerce_order_items i on i.order_id=o.id
 where o.user_id=p_user and i.product_id=p_product and o.provider='doku' and o.status='pending'
 and o.created_at>now()-interval '1 hour' order by o.created_at desc limit 1;
 if found then return result; end if;
 if (select count(*) from public.commerce_orders where user_id=p_user and created_at>now()-interval '1 hour')>=5 then raise exception 'Order rate limit'; end if;
 select * into product from public.commerce_products where id=p_product and status='published' and not is_payment_qa for share;
 if not found or product.price<=0 or product.currency<>'IDR' or not exists(select 1 from public.commerce_product_files where product_id=p_product) then raise exception 'Paid product unavailable'; end if;
 insert into public.commerce_orders(user_id,customer_name,customer_email,total,provider,idempotency_key,status)
 values(p_user,p_name,p_email,product.price,'doku',p_key,'pending') returning * into result;
 insert into public.commerce_order_items(order_id,product_id,product_name,price) values(result.id,product.id,product.name,product.price);
 return result;
end $$;

-- Narrow service-only predicate: service_role cannot SELECT auth.users/admin list.
-- Keep the elevated lookup in private, outside the Data API, with fixed search_path.
create or replace function private.commerce_payment_qa_email(p_user uuid)
returns text language sql stable security definer set search_path='' as $$
 select u.email from auth.users u join public.blog_admin_emails a on a.email=lower(u.email)
 where u.id=p_user and u.email_confirmed_at is not null and not coalesce(u.is_anonymous,true)
$$;
revoke all on function private.commerce_payment_qa_email(uuid) from public,anon,authenticated;
grant usage on schema private to service_role;
grant execute on function private.commerce_payment_qa_email(uuid) to service_role;
