-- Apply after supabase_blog_studio.sql, supabase_commerce.sql and supabase_freelance.sql.
-- Reuses the existing allowlist and subscriber table. No new account system.
begin;

create or replace function private.is_blog_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.blog_admin_emails a
    join auth.users u on lower(u.email) = a.email
    where u.id = (select auth.uid()) and u.email_confirmed_at is not null
      and coalesce(u.is_anonymous, false) = false
  );
$$;
revoke all on function private.is_blog_admin() from public;
grant execute on function private.is_blog_admin() to anon, authenticated;

create or replace function public.studio_access()
returns boolean language sql stable security invoker set search_path = '' as $$
  select private.is_blog_admin();
$$;
revoke all on function public.studio_access() from public, anon;
grant execute on function public.studio_access() to authenticated;

alter table public.freelance_leads drop constraint if exists freelance_leads_source_check;
alter table public.freelance_leads add constraint freelance_leads_source_check
  check (source in ('homepage','freelance_hub','freelance_jobs'));

create or replace function private.subscribe_freelance(p_secret text, p_payload jsonb, p_client_hash text, p_token_hash text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  attempts_count integer;
  inserted_id uuid;
  bucket_start timestamptz := date_trunc('hour', now());
begin
  if p_secret is null or not exists (
    select 1 from private.freelance_server_config
    where secret_hash = encode(sha256(convert_to(p_secret,'UTF8')),'hex')
  ) then raise exception 'Unauthorized' using errcode = '42501'; end if;
  if p_client_hash is null or p_client_hash !~ '^[a-f0-9]{64}$' or p_token_hash is null or p_token_hash !~ '^[a-f0-9]{64}$'
    or coalesce(p_payload->>'consent','') <> 'true'
    or char_length(trim(coalesce(p_payload->>'name',''))) not between 2 and 100
    or char_length(coalesce(p_payload->>'email','')) not between 3 and 254
    or coalesce(p_payload->>'email','') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or coalesce(p_payload->>'source','') not in ('homepage','freelance_hub','freelance_jobs')
    or char_length(coalesce(p_payload->>'utm_source','')) > 120
    or char_length(coalesce(p_payload->>'utm_campaign','')) > 120
    then raise exception 'Invalid signup' using errcode = '22023'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_client_hash,0));
  delete from private.freelance_rate_limits where bucket < now() - interval '1 day';
  insert into private.freelance_rate_limits(client_hash,bucket) values(p_client_hash,bucket_start)
    on conflict(client_hash,bucket) do update set attempts = private.freelance_rate_limits.attempts + 1
    returning attempts into attempts_count;
  if attempts_count > 5 then return 'limited'; end if;
  insert into public.freelance_leads(name,email,source,consent_version,utm_source,utm_campaign,unsubscribe_token_hash)
    values(trim(p_payload->>'name'),lower(trim(p_payload->>'email')),p_payload->>'source',
      case when p_payload->>'source'='homepage' then 'khadafi-updates-v1' else 'field-notes-v1' end,
      nullif(p_payload->>'utm_source',''),nullif(p_payload->>'utm_campaign',''),p_token_hash)
    on conflict(email) do nothing returning id into inserted_id;
  if inserted_id is not null then return 'inserted'; end if;
  return case when exists (select 1 from public.freelance_leads where email=lower(trim(p_payload->>'email')) and status='unsubscribed') then 'unsubscribed' else 'existing' end;
end;
$$;
revoke all on function private.subscribe_freelance(text,jsonb,text,text) from public;
grant execute on function private.subscribe_freelance(text,jsonb,text,text) to anon, authenticated;
commit;
