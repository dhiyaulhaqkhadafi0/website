-- Freelance Field Notes. Public writes go through a server-secret-gated RPC;
-- personal data has no anonymous SELECT/INSERT/UPDATE/DELETE permission.
create schema if not exists private;

create table public.freelance_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null unique check (email = lower(trim(email)) and char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  source text not null default 'freelance_hub' check (source in ('freelance_hub','freelance_jobs')),
  status text not null default 'active' check (status in ('active','unsubscribed')),
  consent_at timestamptz not null default now(),
  consent_version text not null default 'field-notes-v1',
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  utm_source text check (char_length(utm_source) <= 120),
  utm_campaign text check (char_length(utm_campaign) <= 120),
  unsubscribe_token_hash text not null unique check (char_length(unsubscribe_token_hash) = 64)
);
create index freelance_leads_created_at_idx on public.freelance_leads(created_at desc);
alter table public.freelance_leads enable row level security;
revoke all on public.freelance_leads from anon, authenticated;
grant select on public.freelance_leads to authenticated;
grant all on public.freelance_leads to service_role;
create policy "Blog admins can read freelance subscribers" on public.freelance_leads
  for select to authenticated using ((select private.is_blog_admin()));

create table private.freelance_server_config (
  singleton boolean primary key default true check (singleton),
  secret_hash text not null check (char_length(secret_hash) = 64)
);
create table private.freelance_rate_limits (
  client_hash text not null,
  bucket timestamptz not null,
  attempts integer not null default 1,
  primary key (client_hash,bucket)
);
alter table private.freelance_server_config enable row level security;
alter table private.freelance_rate_limits enable row level security;
revoke all on private.freelance_server_config, private.freelance_rate_limits from public, anon, authenticated;

-- This definer is intentionally in an unexposed schema. Signup has no user
-- session: authorization is the server credential, checked before any write.
create function private.subscribe_freelance(p_secret text, p_payload jsonb, p_client_hash text, p_token_hash text)
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
    or char_length(coalesce(p_payload->>'name','')) not between 2 and 100
    or char_length(coalesce(p_payload->>'email','')) not between 3 and 254
    or coalesce(p_payload->>'email','') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or coalesce(p_payload->>'source','') not in ('freelance_hub','freelance_jobs')
    or char_length(coalesce(p_payload->>'utm_source','')) > 120
    or char_length(coalesce(p_payload->>'utm_campaign','')) > 120
    then raise exception 'Invalid signup' using errcode = '22023'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_client_hash,0));
  delete from private.freelance_rate_limits where bucket < now() - interval '1 day';
  insert into private.freelance_rate_limits(client_hash,bucket) values(p_client_hash,bucket_start)
    on conflict(client_hash,bucket) do update set attempts = private.freelance_rate_limits.attempts + 1
    returning attempts into attempts_count;
  if attempts_count > 5 then return 'limited'; end if;
  insert into public.freelance_leads(name,email,source,utm_source,utm_campaign,unsubscribe_token_hash)
    values(trim(p_payload->>'name'),lower(trim(p_payload->>'email')),p_payload->>'source',
      nullif(p_payload->>'utm_source',''),nullif(p_payload->>'utm_campaign',''),p_token_hash)
    on conflict(email) do nothing returning id into inserted_id;
  -- Duplicate requests never overwrite consent, attribution, or unsubscribe.
  return case when inserted_id is null then 'existing' else 'inserted' end;
end;
$$;
revoke all on function private.subscribe_freelance(text,jsonb,text,text) from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.subscribe_freelance(text,jsonb,text,text) to anon, authenticated;

create function public.subscribe_freelance(p_secret text, p_payload jsonb, p_client_hash text, p_token_hash text)
returns text language sql security invoker set search_path = '' as $$
  select private.subscribe_freelance(p_secret,p_payload,p_client_hash,p_token_hash);
$$;
revoke all on function public.subscribe_freelance(text,jsonb,text,text) from public;
grant execute on function public.subscribe_freelance(text,jsonb,text,text) to anon, authenticated;

create function private.unsubscribe_freelance(p_token_hash text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_token_hash is null or p_token_hash !~ '^[a-f0-9]{64}$' then return false; end if;
  update public.freelance_leads set status='unsubscribed',unsubscribed_at=coalesce(unsubscribed_at,now())
    where unsubscribe_token_hash=p_token_hash;
  return found;
end;
$$;
revoke all on function private.unsubscribe_freelance(text) from public;
grant execute on function private.unsubscribe_freelance(text) to anon, authenticated;
create function public.unsubscribe_freelance(p_token_hash text)
returns boolean language sql security invoker set search_path = '' as $$
  select private.unsubscribe_freelance(p_token_hash);
$$;
revoke all on function public.unsubscribe_freelance(text) from public;
grant execute on function public.unsubscribe_freelance(text) to anon, authenticated;

-- Configure private.freelance_server_config separately with SHA-256 of the
-- server-only FREELANCE_SIGNUP_SECRET (or existing ENGAGEMENT_SIGNING_SECRET).
-- Never commit the credential or export unsubscribe_token_hash to the browser.

create function public.freelance_lead_stats()
returns jsonb language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'total',count(*),'active',count(*) filter(where status='active'),
    'unsubscribed',count(*) filter(where status='unsubscribed'),
    'this_month',count(*) filter(where created_at >= date_trunc('month',now() at time zone 'Asia/Jakarta') at time zone 'Asia/Jakarta'),
    'months',(select coalesce(jsonb_agg(x order by x.month desc),'[]'::jsonb) from (
      select to_char(created_at at time zone 'Asia/Jakarta','YYYY-MM') as "month",count(*) subscribers
      from public.freelance_leads group by 1 order by 1 desc limit 12) x),
    'sources',(select coalesce(jsonb_agg(x),'[]'::jsonb) from (
      select source,count(*) subscribers from public.freelance_leads group by 1) x)
  ) from public.freelance_leads;
$$;
revoke all on function public.freelance_lead_stats() from public,anon;
grant execute on function public.freelance_lead_stats() to authenticated;
