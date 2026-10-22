-- Studio uploads digital files beneath <product UUID>/, never payment-qa/.
-- A metadata row alone cannot enable QA: require its real private storage object.
create or replace function public.commerce_create_doku_qa_order(p_user uuid,p_product uuid,p_key uuid,p_free boolean)
returns public.commerce_orders language plpgsql security invoker set search_path='' as $$
declare p public.commerce_products; qa_email text; o public.commerce_orders;
begin
 select private.commerce_payment_qa_email(p_user) into qa_email;
 if qa_email is null then raise exception 'QA owner required'; end if;
 select * into p from public.commerce_products where id=p_product and status='draft' and is_payment_qa and price=1000 and currency='IDR' for share;
 if p.id is null or not exists(
   select 1 from public.commerce_product_files f
   join storage.objects obj on obj.bucket_id='commerce-files' and obj.name=f.storage_path
   join storage.buckets b on b.id=obj.bucket_id and not b.public
   where f.product_id=p.id and f.storage_path like p.id::text||'/%'
     and position('..' in f.storage_path)=0
 ) then raise exception 'Private test file required'; end if;
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

revoke all on function public.commerce_create_doku_qa_order(uuid,uuid,uuid,boolean) from public,anon,authenticated;
grant execute on function public.commerce_create_doku_qa_order(uuid,uuid,uuid,boolean) to service_role;
