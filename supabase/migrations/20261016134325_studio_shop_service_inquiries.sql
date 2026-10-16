-- Prepared locally for review. Apply only with explicit production-migration approval.
create table public.service_inquiries (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  service text not null check (service in ('website-landing-page','product-prototyping','content-marketing-strategy')),
  description text not null check (char_length(description) between 20 and 3000),
  budget text not null default '' check (budget in ('','Belum ditentukan','Di bawah Rp5 juta','Rp5–15 juta','Rp15–30 juta','Di atas Rp30 juta')),
  timeline text not null default '' check (timeline in ('','Fleksibel','Dalam 1 bulan','1–3 bulan','Lebih dari 3 bulan')),
  consent_version text not null check (consent_version = 'studio-shop-inquiry-v1'),
  client_hash text not null check (client_hash ~ '^[a-f0-9]{64}$'),
  payload_hash text not null check (payload_hash ~ '^[a-f0-9]{64}$'),
  status text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now()
);
alter table public.service_inquiries enable row level security;
revoke all on public.service_inquiries from public, anon, authenticated;
grant select on public.service_inquiries to authenticated;
grant update(status) on public.service_inquiries to authenticated;
grant select, insert on public.service_inquiries to service_role;
create policy service_inquiries_owner_read on public.service_inquiries for select to authenticated using ((select private.is_blog_admin()));
create policy service_inquiries_owner_status on public.service_inquiries for update to authenticated using ((select private.is_blog_admin())) with check ((select private.is_blog_admin()));
create index service_inquiries_created_at_idx on public.service_inquiries (created_at desc);
create index service_inquiries_client_created_idx on public.service_inquiries (client_hash,created_at desc);
create index service_inquiries_email_created_idx on public.service_inquiries (email,created_at desc);
create index service_inquiries_status_created_idx on public.service_inquiries (status,created_at desc);
create function public.submit_service_inquiry(p_request_id uuid,p_payload jsonb,p_client_hash text,p_payload_hash text) returns jsonb
language plpgsql security invoker set search_path = public, pg_temp as $$
declare previous public.service_inquiries%rowtype; normalized_email text;
begin
  if p_payload->'consent' is distinct from 'true'::jsonb or p_payload->>'consent_version' is distinct from 'studio-shop-inquiry-v1' then raise exception 'Consent required'; end if;
  if p_client_hash is null or p_payload_hash is null or p_client_hash !~ '^[a-f0-9]{64}$' or p_payload_hash !~ '^[a-f0-9]{64}$' then raise exception 'Invalid fingerprint'; end if;
  normalized_email := lower(trim(p_payload->>'email'));
  perform pg_advisory_xact_lock(hashtextextended(p_request_id::text,5));
  select * into previous from public.service_inquiries where request_id = p_request_id;
  if found then
    if previous.payload_hash <> p_payload_hash then return jsonb_build_object('status','conflict'); end if;
    return jsonb_build_object('status','accepted');
  end if;
  perform pg_advisory_xact_lock(hashtextextended(p_client_hash,7));
  perform pg_advisory_xact_lock(hashtextextended(normalized_email,9));
  if (select count(*) from public.service_inquiries where client_hash=p_client_hash and created_at > now()-interval '1 hour') >= 3 or
     (select count(*) from public.service_inquiries where email=normalized_email and created_at > now()-interval '1 hour') >= 3 then
    return jsonb_build_object('status','limited');
  end if;
  insert into public.service_inquiries(request_id,name,email,service,description,budget,timeline,consent_version,client_hash,payload_hash)
  values(p_request_id,trim(p_payload->>'name'),normalized_email,p_payload->>'service',trim(p_payload->>'description'),coalesce(p_payload->>'budget',''),coalesce(p_payload->>'timeline',''),p_payload->>'consent_version',p_client_hash,p_payload_hash);
  return jsonb_build_object('status','accepted');
end $$;
revoke all on function public.submit_service_inquiry(uuid,jsonb,text,text) from public, anon, authenticated;
grant execute on function public.submit_service_inquiry(uuid,jsonb,text,text) to service_role;
comment on table public.service_inquiries is 'Private project briefs; no newsletter subscription; status-only owner updates; server-only insert.';
