-- Khadafi commerce v1. Additive schema; existing blog/auth remain intact.
create table public.commerce_products (
 id uuid primary key default gen_random_uuid(), name text not null check (length(name) between 1 and 180),
 slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 short_description text not null default '', description text not null default '',
 category text not null default 'Ebook' check(category in ('Ebook','Guide','Template','Toolkit','Resource','Digital Product')),
 price integer not null default 0 check(price >= 0 and price <= 100000000), currency text not null default 'IDR' check(currency='IDR'),
 cover_url text not null default '', status text not null default 'draft' check(status in ('draft','published','archived')),
 featured boolean not null default false, included text[] not null default '{}', audience text not null default '',
 preview text not null default '', seo_title text not null default '', seo_description text not null default '',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.commerce_product_files (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.commerce_products(id) on delete cascade,
 storage_path text not null unique, name text not null, version text not null default '1',
 created_at timestamptz not null default now()
);
create table public.commerce_orders (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id),
 customer_name text not null, customer_email text not null, total integer not null check(total >= 0),
 currency text not null default 'IDR' check(currency='IDR'),
 status text not null default 'pending' check(status in ('pending','paid','failed','expired','cancelled','refunded')),
 provider text not null check(provider in ('midtrans','free')), payment_reference text, payment_url text,
 idempotency_key uuid not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(user_id,idempotency_key)
);
create table public.commerce_order_items (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.commerce_orders(id) on delete cascade,
 product_id uuid not null references public.commerce_products(id), product_name text not null, price integer not null check(price >= 0),
 unique(order_id,product_id)
);
create table public.commerce_entitlements (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id),
 resource_type text not null default 'product', resource_id uuid not null references public.commerce_products(id),
 order_id uuid not null references public.commerce_orders(id), status text not null default 'active' check(status in ('active','revoked')),
 granted_at timestamptz not null default now(), expires_at timestamptz,
 unique(user_id,resource_type,resource_id,order_id)
);
create index commerce_products_status_idx on public.commerce_products(status);
create index commerce_files_product_idx on public.commerce_product_files(product_id);
create index commerce_orders_user_idx on public.commerce_orders(user_id,created_at desc);
create index commerce_items_product_idx on public.commerce_order_items(product_id);
create index commerce_entitlements_user_idx on public.commerce_entitlements(user_id,status);
create index commerce_entitlements_resource_idx on public.commerce_entitlements(resource_id);
create index commerce_entitlements_order_idx on public.commerce_entitlements(order_id);

alter table public.commerce_products enable row level security;
alter table public.commerce_product_files enable row level security;
alter table public.commerce_orders enable row level security;
alter table public.commerce_order_items enable row level security;
alter table public.commerce_entitlements enable row level security;
-- Supabase default privileges may include TRUNCATE, which bypasses RLS.
revoke all on public.commerce_products,public.commerce_product_files,public.commerce_orders,public.commerce_order_items,public.commerce_entitlements from anon,authenticated;
grant select on public.commerce_products to anon, authenticated;
grant insert,update,delete on public.commerce_products to authenticated;
grant select,insert,update,delete on public.commerce_product_files to authenticated;
grant select on public.commerce_orders,public.commerce_order_items,public.commerce_entitlements to authenticated;
grant all on public.commerce_products,public.commerce_product_files,public.commerce_orders,public.commerce_order_items,public.commerce_entitlements to service_role;
create policy "Published products" on public.commerce_products for select to anon,authenticated using(status='published');
create policy "Studio products" on public.commerce_products for all to authenticated using((select private.is_blog_admin())) with check((select private.is_blog_admin()));
create policy "Studio files" on public.commerce_product_files for all to authenticated using((select private.is_blog_admin())) with check((select private.is_blog_admin()));
create policy "Own orders or studio" on public.commerce_orders for select to authenticated using(user_id=(select auth.uid()) or (select private.is_blog_admin()));
create policy "Own order items or studio" on public.commerce_order_items for select to authenticated using(exists(select 1 from public.commerce_orders o where o.id=order_id and (o.user_id=(select auth.uid()) or (select private.is_blog_admin()))));
create policy "Own entitlements or studio" on public.commerce_entitlements for select to authenticated using(user_id=(select auth.uid()) or (select private.is_blog_admin()));
create policy "Owned products" on public.commerce_products for select to authenticated using(exists(select 1 from public.commerce_entitlements e where e.resource_id=commerce_products.id and e.user_id=(select auth.uid()) and e.status='active' and (e.expires_at is null or e.expires_at>now())));

create function public.commerce_product_guard() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 new.updated_at=now();
 if new.status='published' and not exists(select 1 from public.commerce_product_files f where f.product_id=new.id) then
  raise exception 'Upload a private product file before publishing.';
 end if;
 return new;
end $$;
create trigger commerce_product_guard before insert or update on public.commerce_products for each row execute function public.commerce_product_guard();
revoke all on function public.commerce_product_guard() from public,anon,authenticated;

-- These transaction functions are callable ONLY by the server service role.
create function public.commerce_create_order(p_user uuid,p_product uuid,p_name text,p_email text,p_key uuid)
returns public.commerce_orders language plpgsql security invoker set search_path='' as $$
declare product public.commerce_products; result public.commerce_orders;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_user::text || p_product::text,0));
 select * into result from public.commerce_orders where user_id=p_user and idempotency_key=p_key;
 if found then
  if not exists(select 1 from public.commerce_order_items where order_id=result.id and product_id=p_product) then raise exception 'Idempotency conflict'; end if;
  return result;
 end if;
 if (select count(*) from public.commerce_orders where user_id=p_user and created_at>now()-interval '1 hour') >= 5 then raise exception 'Too many orders. Please try again later.'; end if;
 select * into product from public.commerce_products where id=p_product and status='published' for share;
 if not found or not exists(select 1 from public.commerce_product_files where product_id=p_product) then raise exception 'Product unavailable'; end if;
 insert into public.commerce_orders(user_id,customer_name,customer_email,total,provider,idempotency_key,status)
 values(p_user,p_name,p_email,product.price,case when product.price=0 then 'free' else 'midtrans' end,p_key,case when product.price=0 then 'paid' else 'pending' end) returning * into result;
 insert into public.commerce_order_items(order_id,product_id,product_name,price) values(result.id,product.id,product.name,product.price);
 if product.price=0 then
  insert into public.commerce_entitlements(user_id,resource_id,order_id) values(p_user,product.id,result.id);
 end if;
 return result;
end $$;
revoke all on function public.commerce_create_order(uuid,uuid,text,text,uuid) from public,anon,authenticated;
grant execute on function public.commerce_create_order(uuid,uuid,text,text,uuid) to service_role;

create function public.commerce_set_payment(p_order uuid,p_total integer,p_status text,p_reference text)
returns void language plpgsql security invoker set search_path='' as $$
declare existing public.commerce_orders;
begin
 select * into existing from public.commerce_orders where id=p_order for update;
 if not found or existing.provider<>'midtrans' or existing.total<>p_total then raise exception 'Payment mismatch'; end if;
 if p_status not in ('pending','paid','failed','expired','cancelled','refunded') then raise exception 'Invalid payment status'; end if;
 if existing.payment_reference is not null and existing.payment_reference<>p_reference then raise exception 'Transaction mismatch'; end if;
 if existing.status='refunded' then return; end if;
 if existing.status='paid' and p_status<>'refunded' then return; end if;
 update public.commerce_orders set status=p_status,payment_reference=p_reference,updated_at=now() where id=p_order;
 if p_status='paid' then
  insert into public.commerce_entitlements(user_id,resource_id,order_id)
  select existing.user_id,i.product_id,existing.id from public.commerce_order_items i where i.order_id=existing.id
  on conflict(user_id,resource_type,resource_id,order_id) do nothing;
 elsif p_status='refunded' then
  update public.commerce_entitlements set status='revoked' where order_id=existing.id;
 end if;
end $$;
revoke all on function public.commerce_set_payment(uuid,integer,text,text) from public,anon,authenticated;
grant execute on function public.commerce_set_payment(uuid,integer,text,text) to service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('commerce-files','commerce-files',false,52428800,array['application/pdf','application/zip','application/x-zip-compressed'])
on conflict(id) do nothing;
create policy "Studio private uploads" on storage.objects for insert to authenticated with check(bucket_id='commerce-files' and (select private.is_blog_admin()));
create policy "Studio private reads" on storage.objects for select to authenticated using(bucket_id='commerce-files' and (select private.is_blog_admin()));
create policy "Studio private deletes" on storage.objects for delete to authenticated using(bucket_id='commerce-files' and (select private.is_blog_admin()));
