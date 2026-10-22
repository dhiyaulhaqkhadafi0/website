alter table public.commerce_products
 add column compare_at_price integer,
 add column promotion_enabled boolean not null default false,
 add column promotion_label text not null default 'Harga spesial',
 add constraint commerce_promotion_price check (
  (compare_at_price is null or compare_at_price between 1 and 100000000)
  and length(promotion_label)<=60
  and (not promotion_enabled or (price>0 and compare_at_price is not null and compare_at_price>price))
 );

alter table public.commerce_doku_state
 add column cancel_state text not null default 'none' check(cancel_state in ('none','requesting','unknown','rejected','confirmed')),
 add column cancel_request_id uuid,
 add column cancel_lease uuid,
 add column cancel_lease_until timestamptz,
 add column cancel_requested_at timestamptz;

create function public.commerce_claim_doku_cancel(p_order uuid,p_user uuid,p_environment text)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare o public.commerce_orders; s public.commerce_doku_state; token uuid:=gen_random_uuid(); check_only boolean;
begin
 select * into o from public.commerce_orders where id=p_order and user_id=p_user for update;
 if not found or o.provider<>'doku' then raise exception 'Order unavailable'; end if;
 if o.status='paid' then return jsonb_build_object('paid',true); end if;
 if o.status in ('cancelled','expired') then return jsonb_build_object('closed',true); end if;
 if o.status<>'pending' then raise exception 'Order unavailable'; end if;
 select * into s from public.commerce_doku_state where order_id=p_order for update;
 if not found or s.checkout_state='new' then
  update public.commerce_orders set status='cancelled',updated_at=now() where id=p_order;
  update public.commerce_doku_state set cancel_state='confirmed',cancel_requested_at=now(),updated_at=now() where order_id=p_order;
  return jsonb_build_object('closed',true);
 end if;
 if s.environment<>p_environment then raise exception 'Environment mismatch'; end if;
 if coalesce(s.cancel_lease_until,'epoch')>now() or (s.checkout_state='creating' and coalesce(s.checkout_lease_until,'epoch')>now()) then return jsonb_build_object('busy',true); end if;
 check_only:=s.cancel_state in ('unknown','requesting');
 update public.commerce_doku_state set cancel_state='requesting',cancel_request_id=coalesce(cancel_request_id,gen_random_uuid()),
  cancel_lease=token,cancel_lease_until=now()+interval '1 minute',cancel_requested_at=coalesce(cancel_requested_at,now()),updated_at=now()
  where order_id=p_order returning * into s;
 return jsonb_build_object('token',token,'invoice',s.invoice,'original_request_id',s.checkout_request_id,
  'request_id',s.cancel_request_id,'total',o.total,'check_only',check_only);
end $$;

create function public.commerce_finish_doku_cancel(p_order uuid,p_token uuid,p_rejected boolean)
returns void language plpgsql security invoker set search_path='' as $$
begin
 update public.commerce_doku_state set cancel_state=case when cancel_state='confirmed' then 'confirmed' when p_rejected then 'rejected' else 'unknown' end,
  cancel_request_id=case when p_rejected then null else cancel_request_id end,
  cancel_lease=null,cancel_lease_until=null,next_check_at=now(),updated_at=now()
 where order_id=p_order and (cancel_lease=p_token or cancel_state='confirmed');
 if not found then raise exception 'Lease mismatch'; end if;
end $$;

-- Only call after signed provider status has matched invoice, amount and environment.
create function public.commerce_confirm_doku_cancel(p_order uuid,p_environment text,p_invoice text,p_total integer,p_outcome text)
returns boolean language plpgsql security invoker set search_path='' as $$
declare o public.commerce_orders; s public.commerce_doku_state;
begin
 if p_outcome not in ('CANCELLED','EXPIRED') or p_outcome is null then raise exception 'Invalid cancellation outcome'; end if;
 select * into o from public.commerce_orders where id=p_order for update;
 select * into s from public.commerce_doku_state where order_id=p_order for update;
 if o.id is null or o.provider<>'doku' or o.currency<>'IDR' or o.total is distinct from p_total
  or s.environment is distinct from p_environment or s.invoice is distinct from p_invoice or s.cancel_requested_at is null
 then raise exception 'Cancellation mismatch'; end if;
 if o.status='paid' then return false; end if;
 if o.status in ('cancelled','expired') then return true; end if;
 if o.status<>'pending' then return false; end if;
 update public.commerce_orders set status=case when p_outcome='EXPIRED' then 'expired' else 'cancelled' end,updated_at=now() where id=p_order;
 update public.commerce_doku_state set cancel_state='confirmed',cancel_lease=null,cancel_lease_until=null,updated_at=now() where order_id=p_order;
 return true;
end $$;

-- A verified payment wins a simultaneous buyer cancellation. Never lose real funds.
create or replace function public.commerce_set_payment_doku(p_order uuid,p_total integer,p_reference text)
returns void language plpgsql security invoker set search_path='' as $$
declare o public.commerce_orders;
begin
 select * into o from public.commerce_orders where id=p_order for update;
 if not found or o.provider<>'doku' or o.total is distinct from p_total or o.currency<>'IDR'
  or o.status in ('refunded','failed') then raise exception 'Payment mismatch'; end if;
 if o.status='cancelled' and not exists(select 1 from public.commerce_doku_state where order_id=p_order and cancel_requested_at is not null) then raise exception 'Payment mismatch'; end if;
 if not exists(select 1 from public.commerce_doku_state where order_id=p_order and invoice=p_reference)
  or (o.payment_reference is not null and o.payment_reference<>p_reference) then raise exception 'Invoice mismatch'; end if;
 update public.commerce_orders set status='paid',payment_reference=p_reference,updated_at=now() where id=p_order;
 insert into public.commerce_entitlements(user_id,resource_id,order_id)
 select o.user_id,i.product_id,o.id from public.commerce_order_items i where i.order_id=o.id
 on conflict(user_id,resource_type,resource_id,order_id) do nothing;
end $$;

revoke all on function public.commerce_claim_doku_cancel(uuid,uuid,text),public.commerce_finish_doku_cancel(uuid,uuid,boolean),public.commerce_confirm_doku_cancel(uuid,text,text,integer,text) from public,anon,authenticated;
grant execute on function public.commerce_claim_doku_cancel(uuid,uuid,text),public.commerce_finish_doku_cancel(uuid,uuid,boolean),public.commerce_confirm_doku_cancel(uuid,text,text,integer,text) to service_role;

-- Use the same order -> provider-state lock order as checkout claims and settlement.
create or replace function public.commerce_finish_doku_checkout(p_order uuid,p_token uuid,p_url text)
returns void language plpgsql security invoker set search_path='' as $$
declare s public.commerce_doku_state;
begin
 perform 1 from public.commerce_orders where id=p_order for update;
 select * into s from public.commerce_doku_state where order_id=p_order for update;
 if not found or s.checkout_lease is distinct from p_token then raise exception 'Lease mismatch'; end if;
 if p_url is not null and not (
  (s.environment='sandbox' and p_url ~ '^https://(staging|sandbox)\.doku\.com/') or
  (s.environment='production' and p_url ~ '^https://(jokul|checkout)\.doku\.com/')
 ) then raise exception 'Invalid checkout host'; end if;
 update public.commerce_orders set payment_url=coalesce(p_url,payment_url),updated_at=now()
 where id=p_order and provider='doku';
 update public.commerce_doku_state set checkout_state=case when p_url is null then 'unknown' else 'ready' end,
 checkout_lease=null,checkout_lease_until=null,updated_at=now() where order_id=p_order;
end $$;
