-- DOKU Sandbox adapter for existing commerce schema; deliberately NOT applied to production.
-- Keep Midtrans in the constraint for historical orders and legacy callback safety.
alter table public.commerce_orders
  drop constraint if exists commerce_orders_provider_check;
alter table public.commerce_orders
  add constraint commerce_orders_provider_check
  check (provider in ('midtrans', 'doku', 'free'));

-- New RPC instead of changing the historical Midtrans create-order RPC.
-- Service-role only, no anonymous execution privilege.
create or replace function public.commerce_create_order_doku(
  p_user uuid, p_product uuid, p_name text, p_email text, p_key uuid
)
returns public.commerce_orders
language plpgsql security invoker set search_path=''
as $$
declare product public.commerce_products; result public.commerce_orders;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_user::text || p_product::text,0));
 select * into result from public.commerce_orders
 where user_id=p_user and idempotency_key=p_key;
 if found then
  if result.provider<>'doku' or not exists(
    select 1 from public.commerce_order_items
    where order_id=result.id and product_id=p_product
  ) then raise exception 'Idempotency conflict'; end if;
  return result;
 end if;
 if (select count(*) from public.commerce_orders
     where user_id=p_user and created_at>now()-interval '1 hour') >= 5
 then raise exception 'Too many orders. Please try again later.'; end if;
 select * into product from public.commerce_products
 where id=p_product and status='published' for share;
 if not found or product.price <= 0 or not exists(
   select 1 from public.commerce_product_files where product_id=p_product
 ) then raise exception 'Paid product unavailable'; end if;
 insert into public.commerce_orders(
  user_id,customer_name,customer_email,total,provider,idempotency_key,status
 ) values (p_user,p_name,p_email,product.price,'doku',p_key,'pending')
 returning * into result;
 insert into public.commerce_order_items(order_id,product_id,product_name,price)
 values(result.id,product.id,product.name,product.price);
 return result;
end $$;
revoke all on function public.commerce_create_order_doku(uuid,uuid,text,text,uuid) from public,anon,authenticated;
grant execute on function public.commerce_create_order_doku(uuid,uuid,text,text,uuid) to service_role;

-- DOKU sends signed SUCCESS notifications. Only this trusted RPC grants access.
-- Keep separate from Midtrans RPC so a DOKU event cannot mutate legacy orders.
create or replace function public.commerce_set_payment_doku(
  p_order uuid, p_total integer, p_reference text
)
returns void language plpgsql security invoker set search_path=''
as $$
declare existing public.commerce_orders;
begin
 select * into existing from public.commerce_orders where id=p_order for update;
 if not found or existing.provider<>'doku' or existing.total<>p_total
 then raise exception 'Payment mismatch'; end if;
 if p_reference is null or length(p_reference)>30 or p_reference !~ '^KS[0-9A-Z]+$'
 then raise exception 'Invalid payment reference'; end if;
 if existing.payment_reference is not null and existing.payment_reference<>p_reference
 then raise exception 'Transaction mismatch'; end if;
 if existing.status='refunded' or existing.status='cancelled'
 then raise exception 'Terminal order'; end if;
 if existing.status='paid' then return; end if;
 update public.commerce_orders
 set status='paid',payment_reference=p_reference,updated_at=now()
 where id=p_order;
 insert into public.commerce_entitlements(user_id,resource_id,order_id)
 select existing.user_id,i.product_id,existing.id
 from public.commerce_order_items i where i.order_id=existing.id
 on conflict(user_id,resource_type,resource_id,order_id) do nothing;
end $$;
revoke all on function public.commerce_set_payment_doku(uuid,integer,text) from public,anon,authenticated;
grant execute on function public.commerce_set_payment_doku(uuid,integer,text) to service_role;
