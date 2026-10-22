-- Match authenticated Checkout Non-SNAP notifications for available methods.
-- This changes no orders or entitlements and preserves the service-only RPC.
create or replace function public.commerce_record_doku_event(
 p_order uuid,p_total integer,p_reference text,p_environment text,p_event text,p_hash text,p_status text,p_channel text
) returns void language plpgsql security invoker set search_path='' as $$
declare o public.commerce_orders; s public.commerce_doku_state; previous public.commerce_doku_events;
begin
 select * into o from public.commerce_orders where id=p_order for update;
 select * into s from public.commerce_doku_state where order_id=p_order for update;
 if o.id is null or s.order_id is null or o.provider<>'doku' or o.total is distinct from p_total or o.currency<>'IDR'
 or s.environment is distinct from p_environment or s.invoice is distinct from p_reference
 or p_channel is null or p_channel not in (
  'QRIS_DOKU',
  'VIRTUAL_ACCOUNT_BCA','VIRTUAL_ACCOUNT_BANK_MANDIRI','VIRTUAL_ACCOUNT_BANK_SYARIAH_MANDIRI',
  'VIRTUAL_ACCOUNT_BRI','VIRTUAL_ACCOUNT_BNI','VIRTUAL_ACCOUNT_DOKU',
  'VIRTUAL_ACCOUNT_BANK_PERMATA','VIRTUAL_ACCOUNT_BANK_CIMB','VIRTUAL_ACCOUNT_BANK_DANAMON',
  'VIRTUAL_ACCOUNT_BTN','VIRTUAL_ACCOUNT_BNC','VIRTUAL_ACCOUNT_BSS','VIRTUAL_ACCOUNT_BJB',
  'VIRTUAL_ACCOUNT_SINARMAS','VIRTUAL_ACCOUNT_Sinarmas',
  'ONLINE_TO_OFFLINE_ALFA','ONLINE_TO_OFFLINE_INDOMARET',
  'EMONEY_OVO','EMONEY_SHOPEE_PAY','EMONEY_DOKU','EMONEY_LINKAJA','EMONEY_DANA',
  'PEER_TO_PEER_AKULAKU','PEER_TO_PEER_KREDIVO','PEER_TO_PEER_INDODANA',
  'DIRECT_DEBIT_BRI','JENIUS_PAY','CREDIT_CARD','GOOGLE_PAY','KARTU_KREDIT_INDONESIA'
 )
 or p_status is null or p_status not in ('SUCCESS','PENDING','FAILED','EXPIRED','TIMEOUT','REFUNDED','DISPUTED')
 then raise exception 'Event mismatch'; end if;
 insert into public.commerce_doku_events(environment,event_id,body_hash,order_id,status,channel)
 values(p_environment,p_event,p_hash,p_order,p_status,p_channel) on conflict do nothing;
 select * into previous from public.commerce_doku_events where environment=p_environment and event_id=p_event;
 if previous.body_hash<>p_hash or previous.order_id<>p_order then raise exception 'Conflicting event replay'; end if;
 if p_status='SUCCESS' then
  perform public.commerce_set_payment_doku(p_order,p_total,p_reference);
 elsif p_status in ('REFUNDED','DISPUTED') then
  update public.commerce_entitlements set status='revoked' where order_id=p_order;
  if o.status='paid' then update public.commerce_orders set status='refunded',updated_at=now() where id=p_order; end if;
 end if;
 update public.commerce_doku_state set error_class=case when p_status in ('REFUNDED','DISPUTED') then 'REVIEW_REQUIRED' else null end,
 updated_at=now() where order_id=p_order;
end $$;
revoke all on function public.commerce_record_doku_event(uuid,integer,text,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.commerce_record_doku_event(uuid,integer,text,text,text,text,text,text) to service_role;
