-- All fixtures and mutations are rolled back; no customer data persists.
begin;
do $test$
declare
 ua uuid:=gen_random_uuid(); ub uuid:=gen_random_uuid(); pid uuid:=gen_random_uuid(); freepid uuid:=gen_random_uuid(); k uuid:=gen_random_uuid();
 oa public.commerce_orders; repeat_order public.commerce_orders; ob public.commerce_orders; freeorder public.commerce_orders; n integer;
begin
 insert into auth.users(id,email) values(ua,'commerce-a@example.invalid'),(ub,'commerce-b@example.invalid');
 insert into public.commerce_products(id,name,slug,price) values(pid,'QA paid','qa-paid-'||pid,59000),(freepid,'QA free','qa-free-'||freepid,0);
 insert into public.commerce_product_files(product_id,storage_path,name) values(pid,pid||'/fixture.pdf','fixture.pdf'),(freepid,freepid||'/fixture.pdf','fixture.pdf');
 update public.commerce_products set status='published' where id in (pid,freepid);
 oa:=public.commerce_create_order(ua,pid,'QA A','commerce-a@example.invalid',k);
 repeat_order:=public.commerce_create_order(ua,pid,'QA A','commerce-a@example.invalid',k);
 if oa.id<>repeat_order.id or oa.total<>59000 then raise exception 'order idempotency/price failed'; end if;
 if (select count(*) from public.commerce_order_items where order_id=oa.id)<>1 then raise exception 'duplicate item'; end if;
 if exists(select 1 from public.commerce_entitlements where order_id=oa.id) then raise exception 'pending order granted access'; end if;
 perform public.commerce_set_payment(oa.id,59000,'paid','qa-txn-a');
 perform public.commerce_set_payment(oa.id,59000,'paid','qa-txn-a');
 perform public.commerce_set_payment(oa.id,59000,'pending','qa-txn-a');
 if (select status from public.commerce_orders where id=oa.id)<>'paid' then raise exception 'paid downgrade'; end if;
 if (select count(*) from public.commerce_entitlements where order_id=oa.id)<>1 then raise exception 'duplicate entitlement'; end if;
 begin
  perform public.commerce_set_payment(oa.id,1,'paid','qa-txn-a');
  raise exception 'amount mismatch accepted';
 exception when others then
  if sqlerrm='amount mismatch accepted' then raise; end if;
 end;
 perform public.commerce_set_payment(oa.id,59000,'refunded','qa-txn-a');
 perform public.commerce_set_payment(oa.id,59000,'paid','qa-txn-a');
 if exists(select 1 from public.commerce_entitlements where order_id=oa.id and status='active') then raise exception 'refunded access still active'; end if;
 ob:=public.commerce_create_order(ub,pid,'QA B','commerce-b@example.invalid',gen_random_uuid());
 perform public.commerce_set_payment(ob.id,59000,'paid','qa-txn-b');
 freeorder:=public.commerce_create_order(ua,freepid,'QA A','commerce-a@example.invalid',gen_random_uuid());
 if freeorder.status<>'paid' or not exists(select 1 from public.commerce_entitlements where order_id=freeorder.id and status='active') then raise exception 'free fulfillment failed'; end if;
 update public.commerce_products set status='archived' where id=pid;
 perform set_config('request.jwt.claims',json_build_object('sub',ua,'role','authenticated','email','commerce-a@example.invalid')::text,true);
 execute 'set local role authenticated';
 if (select count(*) from public.commerce_orders where id=oa.id)<>1 or exists(select 1 from public.commerce_orders where id=ob.id) then raise exception 'order ownership isolation failed'; end if;
 if exists(select 1 from public.commerce_entitlements where user_id=ub) then raise exception 'entitlement isolation failed'; end if;
 if exists(select 1 from public.commerce_product_files) then raise exception 'private paths visible to customer'; end if;
 if exists(select 1 from public.commerce_products where id=pid) then raise exception 'revoked owner sees archived product'; end if;
 update public.commerce_products set price=1 where id=freepid;
 get diagnostics n=row_count;
 if n<>0 then raise exception 'customer can edit price'; end if;
 if has_function_privilege('authenticated','public.commerce_set_payment(uuid,integer,text,text)','execute') or has_function_privilege('authenticated','public.commerce_create_order(uuid,uuid,text,text,uuid)','execute') then raise exception 'customer can call trusted functions'; end if;
 if has_table_privilege('authenticated','public.commerce_orders','insert') or has_table_privilege('authenticated','public.commerce_orders','truncate') then raise exception 'customer has excessive privileges'; end if;
 execute 'reset role';
 perform set_config('request.jwt.claims',json_build_object('sub',ub,'role','authenticated','email','commerce-b@example.invalid')::text,true);
 execute 'set local role authenticated';
 if (select count(*) from public.commerce_products where id=pid)<>1 then raise exception 'owned archived product unavailable'; end if;
 execute 'reset role';
 perform set_config('request.jwt.claims','{"role":"anon"}',true);
 execute 'set local role anon';
 if exists(select 1 from public.commerce_products where status<>'published') then raise exception 'draft visible publicly'; end if;
 if has_table_privilege('anon','public.commerce_product_files','select') or has_table_privilege('anon','public.commerce_products','truncate') or has_function_privilege('anon','public.commerce_set_payment(uuid,integer,text,text)','execute') then raise exception 'anonymous excessive privileges'; end if;
 execute 'reset role';
end $test$;
rollback;
select 'PASS: order price, idempotency, free fulfillment, payment transitions, refund, ownership RLS, private files, RPC and table privileges' as result;
