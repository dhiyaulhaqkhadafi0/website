-- Close the merchant's stale intent, not an asserted provider cancellation.
-- Called only after the owner requests cancellation and Check Status returns 404.
-- Keep provider state unknown and continue checking for a late real payment.
create function public.commerce_close_unregistered_doku_intent(p_order uuid,p_user uuid,p_token uuid,p_environment text)
returns boolean language plpgsql security invoker set search_path='' as $$
declare o public.commerce_orders; s public.commerce_doku_state;
begin
 select * into o from public.commerce_orders where id=p_order and user_id=p_user for update;
 select * into s from public.commerce_doku_state where order_id=p_order for update;
 if o.id is null or s.order_id is null or o.provider<>'doku' or o.status<>'pending' or o.payment_url is not null
  or o.created_at>now()-interval '24 hours' or s.environment is distinct from p_environment
  or s.cancel_lease is distinct from p_token or s.cancel_requested_at is null or s.checkout_state<>'unknown'
  or exists(select 1 from public.commerce_doku_events e where e.order_id=p_order and e.status='SUCCESS')
 then return false; end if;
 update public.commerce_orders set status='cancelled',updated_at=now() where id=p_order;
 update public.commerce_doku_state set cancel_state='unknown',error_class='LOCAL_CLOSED_UNREGISTERED',next_check_at=now(),updated_at=now() where order_id=p_order;
 return true;
end $$;
revoke all on function public.commerce_close_unregistered_doku_intent(uuid,uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.commerce_close_unregistered_doku_intent(uuid,uuid,uuid,text) to service_role;

create or replace function public.commerce_claim_doku_reconciliation(p_environment text)
returns setof public.commerce_doku_state language plpgsql security invoker set search_path='' as $$
begin
 return query with due as (
  select s.order_id from public.commerce_doku_state s join public.commerce_orders o on o.id=s.order_id
  where s.environment=p_environment and s.next_check_at<=now() and coalesce(s.lease_until,'epoch')<now()
  and o.created_at<now()-interval '3 minutes' and o.created_at>now()-interval '7 days'
  and (o.status='pending' or (o.status='cancelled' and s.cancel_state='unknown' and s.cancel_requested_at is not null) or (o.status='paid' and exists(
    select 1 from public.commerce_order_items i where i.order_id=o.id and not exists(
     select 1 from public.commerce_entitlements e where e.order_id=o.id and e.resource_id=i.product_id))))
  order by s.next_check_at limit 10 for update of s skip locked
 ) update public.commerce_doku_state s set lease_token=gen_random_uuid(),lease_until=now()+interval '5 minutes',
 attempts=s.attempts+1,last_checked_at=now(),updated_at=now() from due where s.order_id=due.order_id returning s.*;
end $$;

create or replace function public.commerce_confirm_doku_cancel(p_order uuid,p_environment text,p_invoice text,p_total integer,p_outcome text)
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
 if o.status not in ('pending','cancelled','expired') then return false; end if;
 if o.status='pending' then
  update public.commerce_orders set status=case when p_outcome='EXPIRED' then 'expired' else 'cancelled' end,updated_at=now() where id=p_order;
 end if;
 update public.commerce_doku_state set cancel_state='confirmed',cancel_lease=null,cancel_lease_until=null,updated_at=now() where order_id=p_order;
 return true;
end $$;
