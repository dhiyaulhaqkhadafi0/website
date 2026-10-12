-- Additive V1. Reuses the existing private.is_blog_admin() Studio allowlist.
-- No existing tables, accounts, policies, or provider credentials are changed.
begin;
create table public.affiliate_programs (
  id uuid primary key default gen_random_uuid(), name text not null check(length(name) between 1 and 120),
  slug text unique not null check(length(slug)<=80 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  provider text not null check(length(provider) between 1 and 120),
  official_website text not null check(length(official_website)<=2048 and official_website ~ '^https://'),
  type text not null check(length(type) between 1 and 80),
  status text not null default 'draft' check(status in ('draft','active','paused','archived')),
  notes text not null default '' check(length(notes)<=2000), last_verified_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table private.affiliate_allowed_hosts (hostname text primary key check(hostname ~ '^[a-z0-9.-]+$'));
insert into private.affiliate_allowed_hosts values('refer.micro1.ai');
alter table private.affiliate_allowed_hosts enable row level security;
revoke all on private.affiliate_allowed_hosts from public,anon,authenticated;
create function private.affiliate_destination_allowed(value text) returns boolean
language sql stable security definer set search_path='' as $$
  select length(value)<=2048 and value !~ '[[:space:]\\#]' and exists (
    select 1 from private.affiliate_allowed_hosts h where value like 'https://' || h.hostname || '/%'
  );
$$;
revoke all on function private.affiliate_destination_allowed(text) from public,anon;
grant execute on function private.affiliate_destination_allowed(text) to authenticated;
create table public.affiliate_links (
  id uuid primary key default gen_random_uuid(), program_id uuid not null references public.affiliate_programs(id),
  name text not null check(length(name) between 1 and 120),
  slug text unique not null check(length(slug)<=80 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  type text not null check(length(type) between 1 and 80),
  destination_url text not null check(private.affiliate_destination_allowed(destination_url)),
  owner text not null default 'Website Admin' check(length(owner) between 1 and 120),
  status text not null default 'paused' check(status in ('active','paused','archived')),
  notes text not null default '' check(length(notes)<=2000),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(id,program_id)
);
create index affiliate_links_program_idx on public.affiliate_links(program_id);
create table public.affiliate_campaigns (
  id uuid primary key default gen_random_uuid(), program_id uuid not null references public.affiliate_programs(id),
  link_id uuid not null, foreign key(link_id,program_id) references public.affiliate_links(id,program_id),
  name text not null check(length(name) between 1 and 120),
  slug text not null check(length(slug)<=80 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  source text not null check(length(source)<=64 and source ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  medium text not null check(length(medium)<=64 and medium ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status text not null default 'draft' check(status in ('draft','active','paused','archived')),
  starts_at timestamptz, ends_at timestamptz, check(starts_at is null or ends_at is null or starts_at<ends_at),
  notes text not null default '' check(length(notes)<=2000),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(link_id,slug), unique(id,program_id), unique(id,link_id)
);
create index affiliate_campaigns_program_idx on public.affiliate_campaigns(program_id);
create table public.affiliate_click_events (
  id uuid primary key, link_id uuid not null references public.affiliate_links(id),
  campaign_id uuid, foreign key(campaign_id,link_id) references public.affiliate_campaigns(id,link_id),
  occurred_at timestamptz not null default now(), source text not null check(length(source)<=64 and source ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  event_type text not null default 'outbound_click' check(event_type='outbound_click'),
  environment text not null check(environment in ('preview','production'))
);
create index affiliate_clicks_time_idx on public.affiliate_click_events(environment,occurred_at desc);
create index affiliate_clicks_link_idx on public.affiliate_click_events(link_id,occurred_at desc);
create index affiliate_clicks_campaign_idx on public.affiliate_click_events(campaign_id,occurred_at desc);
create table public.affiliate_commissions (
  id uuid primary key default gen_random_uuid(), program_id uuid not null references public.affiliate_programs(id),
  campaign_id uuid, foreign key(campaign_id,program_id) references public.affiliate_campaigns(id,program_id),
  external_reference text check(length(external_reference) between 1 and 160),
  referral_status text not null default 'reported' check(referral_status in ('reported','qualified','earned','paid','rejected')),
  amount numeric(14,2) check(amount>=0 and amount<=999999999999),
  currency text not null check(currency ~ '^[A-Z]{3}$'),
  payout_status text not null default 'pending' check(payout_status in ('pending','confirmed','paid','rejected')),
  confirmed_at timestamptz, paid_at timestamptz, evidence_reference text check(length(evidence_reference) between 1 and 500),
  notes text not null default '' check(length(notes)<=2000),
  environment text not null check(environment in ('preview','production')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check((referral_status='paid')=(payout_status='paid')),
  check((referral_status='earned')=(payout_status='confirmed')),
  check((referral_status='rejected')=(payout_status='rejected')),
  check((payout_status in ('confirmed','paid'))=(confirmed_at is not null)),
  check((payout_status='paid')=(paid_at is not null)),
  check(payout_status not in ('confirmed','paid') or (amount is not null and external_reference is not null and evidence_reference is not null)),
  check(paid_at is null or paid_at>=confirmed_at),
  unique(program_id,external_reference,environment)
);
create index affiliate_commissions_campaign_idx on public.affiliate_commissions(campaign_id);
create index affiliate_commissions_time_idx on public.affiliate_commissions(environment,created_at desc);
create table public.affiliate_audit_log (
  id uuid primary key default gen_random_uuid(), entity text not null, record_id uuid not null,
  action text not null, actor_id uuid, occurred_at timestamptz not null default now(), before_data jsonb, after_data jsonb
);
create index affiliate_audit_record_idx on public.affiliate_audit_log(record_id,occurred_at desc);
create index affiliate_audit_time_idx on public.affiliate_audit_log(occurred_at desc);
create function private.affiliate_stamp() returns trigger language plpgsql set search_path='' as $$
begin new.updated_at=clock_timestamp(); return new; end; $$;
create function private.affiliate_audit() returns trigger language plpgsql security definer set search_path='' as $$
begin
  insert into public.affiliate_audit_log(entity,record_id,action,actor_id,before_data,after_data)
  values(tg_table_name,new.id,lower(tg_op),auth.uid(),case when tg_op='UPDATE' then to_jsonb(old) else null end,to_jsonb(new));
  return new;
end; $$;
revoke all on function private.affiliate_stamp(),private.affiliate_audit() from public,anon,authenticated;
do $$ declare t text; begin
  foreach t in array array['affiliate_programs','affiliate_links','affiliate_campaigns','affiliate_commissions'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('revoke all on public.%I from public,anon,authenticated',t);
    execute format('grant select,insert,update on public.%I to authenticated',t);
    execute format('create policy affiliate_admin_read on public.%I for select to authenticated using ((select private.is_blog_admin()))',t);
    execute format('create policy affiliate_admin_insert on public.%I for insert to authenticated with check ((select private.is_blog_admin()))',t);
    execute format('create policy affiliate_admin_update on public.%I for update to authenticated using ((select private.is_blog_admin())) with check ((select private.is_blog_admin()))',t);
    execute format('create trigger affiliate_stamp before update on public.%I for each row execute function private.affiliate_stamp()',t);
    execute format('create trigger affiliate_audit after insert or update on public.%I for each row execute function private.affiliate_audit()',t);
  end loop;
  foreach t in array array['affiliate_click_events','affiliate_audit_log'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('revoke all on public.%I from public,anon,authenticated',t);
    execute format('grant select on public.%I to authenticated',t);
    execute format('create policy affiliate_admin_read on public.%I for select to authenticated using ((select private.is_blog_admin()))',t);
  end loop;
end; $$;
-- The public tracker can only resolve active links and append minimal events.
-- It cannot select reports, mutate configuration, or read the credential hashes.
create table private.affiliate_tracking_config (
  secret_hash text primary key check(secret_hash ~ '^[a-f0-9]{64}$'),
  environment text not null unique check(environment in ('preview','production'))
);
alter table private.affiliate_tracking_config enable row level security;
revoke all on private.affiliate_tracking_config from public,anon,authenticated;
create function private.affiliate_track(p_secret text,p_slug text,p_campaign text,p_event_id uuid,p_source text,p_record boolean)
returns jsonb language plpgsql security definer set search_path='' as $$
declare l public.affiliate_links; c public.affiliate_campaigns; env text; inserted_count integer:=0; limited boolean:=false;
begin
  select environment into env from private.affiliate_tracking_config where secret_hash=encode(sha256(convert_to(p_secret,'UTF8')),'hex');
  if env is null then raise exception 'Unauthorized' using errcode='42501'; end if;
  if length(p_slug)>80 or p_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or length(coalesce(p_campaign,''))>80
    or length(p_source)>64 or p_source !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then raise exception 'Invalid request' using errcode='22023'; end if;
  select x.* into l from public.affiliate_links x join public.affiliate_programs p on p.id=x.program_id
    where x.slug=p_slug and x.status='active' and p.status='active';
  if l.id is null or not private.affiliate_destination_allowed(l.destination_url) then return jsonb_build_object('status','unavailable'); end if;
  if nullif(p_campaign,'') is not null then
    select * into c from public.affiliate_campaigns where link_id=l.id and slug=p_campaign and status='active'
      and (starts_at is null or starts_at<=now()) and (ends_at is null or ends_at>now());
    if c.id is null then return jsonb_build_object('status','campaign_unavailable'); end if;
  end if;
  if p_record then
    if p_event_id is null then raise exception 'Invalid event' using errcode='22023'; end if;
    perform pg_advisory_xact_lock(hashtextextended('affiliate:'||env,0));
    -- Global ceiling, no IP, fingerprint, cookies, or visitor identifiers.
    select count(*)>=600 into limited from public.affiliate_click_events where environment=env and occurred_at>=now()-interval '1 minute';
    if not limited then
      insert into public.affiliate_click_events(id,link_id,campaign_id,source,environment)
      values(p_event_id,l.id,c.id,coalesce(c.source,p_source),env) on conflict(id) do nothing;
      get diagnostics inserted_count=row_count;
    end if;
  end if;
  return jsonb_build_object('status','ok','destination',l.destination_url,'name',l.name,'recorded',inserted_count=1,'limited',limited,'environment',env);
end; $$;
revoke all on function private.affiliate_track(text,text,text,uuid,text,boolean) from public,authenticated;
grant execute on function private.affiliate_track(text,text,text,uuid,text,boolean) to anon;
create function public.affiliate_track(p_secret text,p_slug text,p_campaign text,p_event_id uuid,p_source text,p_record boolean)
returns jsonb language sql security invoker set search_path='' as $$
 select private.affiliate_track(p_secret,p_slug,p_campaign,p_event_id,p_source,p_record);
$$;
revoke all on function public.affiliate_track(text,text,text,uuid,text,boolean) from public,authenticated;
grant execute on function public.affiliate_track(text,text,text,uuid,text,boolean) to anon;
create function public.affiliate_stats(p_since timestamptz,p_until timestamptz,p_environment text,p_program uuid default null)
returns jsonb language plpgsql stable security invoker set search_path='' as $$
declare result jsonb;
begin
  if not private.is_blog_admin() then raise exception 'Forbidden' using errcode='42501'; end if;
  if p_since>=p_until or p_until-p_since>interval '367 days' or p_environment not in ('preview','production') then raise exception 'Invalid range' using errcode='22023'; end if;
  with events as (
    select e.*,l.name link,p.name program,l.program_id,c.name campaign from public.affiliate_click_events e
    join public.affiliate_links l on l.id=e.link_id join public.affiliate_programs p on p.id=l.program_id
    left join public.affiliate_campaigns c on c.id=e.campaign_id
    where e.environment=p_environment and e.occurred_at>=p_since and e.occurred_at<p_until and (p_program is null or l.program_id=p_program)
  ), commissions as (
    select * from public.affiliate_commissions where environment=p_environment and created_at>=p_since and created_at<p_until
      and (p_program is null or program_id=p_program)
  ) select jsonb_build_object(
    'active_programs',(select count(*) from public.affiliate_programs where status='active' and (p_program is null or id=p_program)),
    'active_links',(select count(*) from public.affiliate_links where status='active' and (p_program is null or program_id=p_program)),
    'clicks',(select count(*) from events),'last_activity',(select max(occurred_at) from events),
    'programs',(select coalesce(jsonb_agg(x),'[]') from (select program_id id,program label,count(*) clicks from events group by 1,2 order by 3 desc) x),
    'campaigns',(select coalesce(jsonb_agg(x),'[]') from (select campaign_id id,coalesce(campaign,'Tanpa campaign') label,count(*) clicks from events group by 1,2 order by 3 desc) x),
    'sources',(select coalesce(jsonb_agg(x),'[]') from (select source label,count(*) clicks from events group by 1 order by 2 desc) x),
    'daily',(select coalesce(jsonb_agg(x),'[]') from (select to_char(occurred_at at time zone 'Asia/Jakarta','YYYY-MM-DD') as "day",count(*) clicks from events group by 1 order by 1) x),
    'recent',(select coalesce(jsonb_agg(x),'[]') from (select id,link,campaign,source,occurred_at from events order by occurred_at desc limit 15) x),
    'commissions',(select coalesce(jsonb_agg(x),'[]') from (select currency,
      coalesce(sum(amount) filter(where payout_status in ('confirmed','paid')),0) confirmed,
      coalesce(sum(amount) filter(where payout_status='pending'),0) pending,
      coalesce(sum(amount) filter(where payout_status='paid'),0) paid from commissions group by currency) x)
  ) into result;
  return result;
end; $$;
revoke all on function public.affiliate_stats(timestamptz,timestamptz,text,uuid) from public,anon;
grant execute on function public.affiliate_stats(timestamptz,timestamptz,text,uuid) to authenticated;
-- Real configuration only; no seeded clicks, conversions, commissions, or income.
insert into public.affiliate_programs(name,slug,provider,official_website,type,status,last_verified_at,notes)
values('Micro1 Expert Referral','micro1','Micro1','https://www.micro1.ai','Expert Referral','active','2026-10-12','Rekonsiliasi manual melalui dashboard provider. Komisi sesuai ketentuan tiap referral.');
insert into public.affiliate_links(program_id,name,slug,type,destination_url,owner,status)
select id,'All Expert Opportunities','micro1','All Expert Opportunities','https://refer.micro1.ai/referral/jobs?referralCode=b22f58a9-d462-4389-ab54-34e45d361215&utm_source=referral&utm_medium=share&utm_campaign=job_referral','Website Admin','active'
from public.affiliate_programs where slug='micro1';
insert into public.affiliate_campaigns(program_id,link_id,name,slug,source,medium,status)
select program_id,id,'Website Directory','website-directory','website','directory','active' from public.affiliate_links where slug='micro1';
commit;
