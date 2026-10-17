-- Additive extension: preserve existing products, orders, RLS, and private files.
alter table public.commerce_products
  add column creator_name text not null default 'Daffa Dhiyaulhaq Khadafi' check (length(creator_name) between 1 and 180),
  add column gallery jsonb not null default '[]'::jsonb check (jsonb_typeof(gallery) = 'array' and jsonb_array_length(gallery) <= 12);

-- Exact repair for the known broken cover, without replacing other uploaded media.
update public.commerce_products set cover_url='/products/formula-profitable-blueprint-cover.webp'
where slug='ebook-formula-profitable-blueprint' and cover_url in ('/products/ebook-formula-profitable-blueprint-cover','ebook/products/ebook-formula-profitable-blueprint-cover');

create table public.commerce_guest_limits (
 fingerprint text primary key check (fingerprint ~ '^[0-9a-f]{64}$'),
 hour_start timestamptz not null default now(), hour_count integer not null default 1,
 day_start timestamptz not null default now(), day_count integer not null default 1
);
alter table public.commerce_guest_limits enable row level security;
revoke all on public.commerce_guest_limits from public, anon, authenticated;
grant select,insert,update,delete on public.commerce_guest_limits to service_role;
create policy "Service role guest rate limiting" on public.commerce_guest_limits to service_role using (true) with check (true);
create function public.commerce_guest_attempt(p_fingerprint text) returns void
language plpgsql security invoker set search_path='' as $$
begin
 insert into public.commerce_guest_limits(fingerprint) values(p_fingerprint)
 on conflict(fingerprint) do update set
 hour_start=case when commerce_guest_limits.hour_start < now()-interval '1 hour' then now() else commerce_guest_limits.hour_start end,
 hour_count=case when commerce_guest_limits.hour_start < now()-interval '1 hour' then 1 else commerce_guest_limits.hour_count+1 end,
 day_start=case when commerce_guest_limits.day_start < now()-interval '1 day' then now() else commerce_guest_limits.day_start end,
 day_count=case when commerce_guest_limits.day_start < now()-interval '1 day' then 1 else commerce_guest_limits.day_count+1 end
 where (commerce_guest_limits.hour_start < now()-interval '1 hour' or commerce_guest_limits.hour_count < 12)
 and (commerce_guest_limits.day_start < now()-interval '1 day' or commerce_guest_limits.day_count < 60);
 if not found then raise exception 'Guest checkout rate limit'; end if;
 -- Keep only one recent row per fingerprint; no raw IP or email is stored here.
 delete from public.commerce_guest_limits where day_start < now()-interval '7 days';
end $$;
revoke all on function public.commerce_guest_attempt(text) from public,anon,authenticated;
grant execute on function public.commerce_guest_attempt(text) to service_role;
