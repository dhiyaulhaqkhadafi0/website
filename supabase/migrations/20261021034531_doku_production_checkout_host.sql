-- DOKU production Checkout emails now use checkout.doku.com/checkout-link-v2/.
-- Preserve the legacy production host, sandbox isolation, lease and role guards.
-- Saving a checkout URL never marks an order paid or issues an entitlement.
create or replace function public.commerce_finish_doku_checkout(p_order uuid,p_token uuid,p_url text)
returns void language plpgsql security invoker set search_path='' as $$
declare s public.commerce_doku_state;
begin
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
revoke all on function public.commerce_finish_doku_checkout(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.commerce_finish_doku_checkout(uuid,uuid,text) to service_role;
