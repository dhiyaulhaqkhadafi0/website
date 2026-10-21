-- Persist a single method selection with the existing checkout lease. This
-- never creates an extra provider request or marks an order paid.
alter table public.commerce_doku_state add column checkout_method text;
create function public.commerce_claim_doku_checkout_method(p_order uuid,p_environment text,p_invoice text,p_method text)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare s public.commerce_doku_state; result jsonb;
begin
 if p_method is null or p_method not in ('all','QRIS',
  'VIRTUAL_ACCOUNT_BCA','VIRTUAL_ACCOUNT_BANK_MANDIRI','VIRTUAL_ACCOUNT_BNI','VIRTUAL_ACCOUNT_BRI',
  'VIRTUAL_ACCOUNT_BANK_SYARIAH_MANDIRI','VIRTUAL_ACCOUNT_BANK_PERMATA','VIRTUAL_ACCOUNT_BANK_CIMB',
  'VIRTUAL_ACCOUNT_BANK_DANAMON','VIRTUAL_ACCOUNT_BTN','VIRTUAL_ACCOUNT_BNC','VIRTUAL_ACCOUNT_BJB',
  'VIRTUAL_ACCOUNT_BSS','VIRTUAL_ACCOUNT_Sinarmas','VIRTUAL_ACCOUNT_DOKU',
  'ONLINE_TO_OFFLINE_ALFA','ONLINE_TO_OFFLINE_INDOMARET') then raise exception 'Invalid checkout method'; end if;
 perform 1 from public.commerce_orders where id=p_order for update;
 select * into s from public.commerce_doku_state where order_id=p_order for update;
 if found and s.checkout_method is not null and s.checkout_method<>p_method and s.checkout_state<>'new'
 then return jsonb_build_object('method_locked',true); end if;
 result:=public.commerce_claim_doku_checkout(p_order,p_environment,p_invoice);
 if result ? 'token' then
  update public.commerce_doku_state set checkout_method=p_method where order_id=p_order;
 end if;
 return result;
end $$;
revoke all on function public.commerce_claim_doku_checkout_method(uuid,text,text,text) from public,anon,authenticated;
grant execute on function public.commerce_claim_doku_checkout_method(uuid,text,text,text) to service_role;
