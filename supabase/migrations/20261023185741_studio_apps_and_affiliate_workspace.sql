-- Additive Studio 2.0 foundation. No customer records, payment functions, or redirects changed.
begin;
create table public.app_categories (
 id uuid primary key default gen_random_uuid(), slug text unique not null check(length(slug)<=80 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 name text not null check(length(name) between 1 and 100), name_en text not null default '' check(length(name_en)<=100),
 description text not null default '' check(length(description)<=500), description_en text not null default '' check(length(description_en)<=500),
 icon text not null default '' check(length(icon)<=40), sort_order integer not null default 0, updated_at timestamptz not null default now()
);
insert into public.app_categories(slug,name,name_en,description,description_en,icon,sort_order) values
 ('kalkulator','Kalkulator','Calculators','Hitung dan simulasikan keputusan spesifik.','Calculate and simulate specific decisions.','calculator',10),
 ('ai-generators','AI Generators','AI Generators','Buat materi dengan bantuan AI dan batas penggunaan yang jelas.','Create with AI and clear usage limits.','sparkles',20),
 ('analyzers','Analyzers','Analyzers','Pahami data dan temukan bagian yang perlu diperbaiki.','Understand data and find room for improvement.','chart',30),
 ('converters','Converters','Converters','Ubah format, satuan, dan data untuk pekerjaan Anda.','Convert formats, units, and data for your work.','arrows',40),
 ('business-tools','Business Tools','Business Tools','Alat untuk operasional bisnis mandiri.','Tools for independent business operations.','briefcase',50),
 ('productivity','Productivity','Productivity','Sederhanakan workflow dan rencanakan pekerjaan.','Simplify workflows and plan your work.','check',60);
create table public.apps_registry (
 id uuid primary key default gen_random_uuid(), category_id uuid not null references public.app_categories(id),
 name text not null check(length(name) between 1 and 120), slug text unique not null check(length(slug)<=80 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 short_description text not null check(length(short_description) between 1 and 240), description text not null default '' check(length(description)<=12000),
 name_en text not null default '' check(length(name_en)<=120), short_description_en text not null default '' check(length(short_description_en)<=240), description_en text not null default '' check(length(description_en)<=12000),
 tags text[] not null default '{}' check(cardinality(tags)<=12), icon_url text not null default '', cover_url text not null default '', preview_url text not null default '',
 deployment text not null check(deployment in ('internal','external')), destination text not null default '',
 pricing_model text not null default 'free' check(pricing_model in ('free','freemium','one_time','subscription','credits')),
 price integer not null default 0 check(price between 0 and 100000000), currency text not null default 'IDR' check(currency='IDR'),
 access_terms text not null default '' check(length(access_terms)<=1500), free_allowance integer not null default 0 check(free_allowance between 0 and 1000000),
 featured boolean not null default false, status text not null default 'draft' check(status in ('draft','published','maintenance','archived')),
 version text not null default '1.0.0' check(length(version) between 1 and 40), seo_title text not null default '' check(length(seo_title)<=160), seo_description text not null default '' check(length(seo_description)<=300),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check((pricing_model='free' and price=0) or (pricing_model<>'free' and price>0 and length(access_terms)>0)),
 check(length(destination)<=2048 and (destination='' or (deployment='external' and destination ~ '^https://[^/@[:space:]\\]+(/|$)' and destination !~ '[[:space:]\\]') or (deployment='internal' and destination ~ '^/apps/run/[a-z0-9-]+$'))),
 check(status not in ('published','maintenance') or destination<>''),
 check(icon_url='' or (length(icon_url)<=2048 and icon_url ~ '^https://')),
 check(cover_url='' or (length(cover_url)<=2048 and cover_url ~ '^https://')),
 check(preview_url='' or (length(preview_url)<=2048 and preview_url ~ '^https://'))
);
create index apps_registry_category_idx on public.apps_registry(category_id,status,created_at desc);
create index apps_registry_public_idx on public.apps_registry(status,featured,created_at desc);
-- commerce_entitlements.resource_id references commerce_products; do not repurpose that FK.
create table public.app_entitlements (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), app_id uuid not null references public.apps_registry(id),
 order_id uuid not null references public.commerce_orders(id), status text not null check(status in ('active','revoked','expired')),
 access_terms text not null, version_scope text not null, expires_at timestamptz, created_at timestamptz not null default now(), unique(order_id,app_id)
);
create index app_entitlements_owner_idx on public.app_entitlements(user_id,app_id,status);
create index app_entitlements_app_idx on public.app_entitlements(app_id);
create table public.app_usage_events (
 id uuid primary key, app_id uuid not null references public.apps_registry(id), event_type text not null check(event_type='app_used'),
 feature text not null check(length(feature) between 1 and 80), environment text not null check(environment in ('preview','production')), created_at timestamptz not null default now()
);
create index app_usage_app_time_idx on public.app_usage_events(app_id,environment,created_at desc);
create table public.apps_audit_log (
 id uuid primary key default gen_random_uuid(), entity text not null, record_id uuid not null, actor_id uuid,
 action text not null, before_data jsonb, after_data jsonb, occurred_at timestamptz not null default now()
);
create index apps_audit_time_idx on public.apps_audit_log(occurred_at desc);
create function private.apps_audit() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.apps_audit_log(entity,record_id,actor_id,action,before_data,after_data) values(tg_table_name,new.id,auth.uid(),lower(tg_op),case when tg_op='UPDATE' then to_jsonb(old) else null end,to_jsonb(new)); return new;
end; $$;
revoke all on function private.apps_audit() from public,anon,authenticated;
do $$ declare t text; begin
 foreach t in array array['app_categories','apps_registry'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from public,anon,authenticated',t);
  execute format('grant select on public.%I to anon,authenticated',t);
  execute format('grant insert,update on public.%I to authenticated',t);
  execute format('create policy studio_read on public.%I for select to authenticated using ((select private.is_blog_admin()))',t);
  execute format('create policy studio_insert on public.%I for insert to authenticated with check ((select private.is_blog_admin()))',t);
  execute format('create policy studio_update on public.%I for update to authenticated using ((select private.is_blog_admin())) with check ((select private.is_blog_admin()))',t);
  execute format('create trigger stamp before update on public.%I for each row execute function private.affiliate_stamp()',t);
  execute format('create trigger audit after insert or update on public.%I for each row execute function private.apps_audit()',t);
 end loop;
end; $$;
create policy public_categories on public.app_categories for select to anon,authenticated using(true);
create policy public_apps on public.apps_registry for select to anon,authenticated using(status in ('published','maintenance'));
do $$ declare t text; begin
 foreach t in array array['app_entitlements','app_usage_events','apps_audit_log'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from public,anon,authenticated',t);
  execute format('grant select on public.%I to authenticated',t);
  execute format('create policy studio_read on public.%I for select to authenticated using ((select private.is_blog_admin()))',t);
 end loop;
end; $$;
create policy own_entitlements on public.app_entitlements for select to authenticated using(user_id=(select auth.uid()));
grant select,insert,update on public.app_entitlements,public.app_usage_events to service_role;

create table public.affiliate_categories (
 id uuid primary key default gen_random_uuid(), name text not null check(length(name) between 1 and 120),
 slug text unique not null check(length(slug)<=80 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), description text not null default '' check(length(description)<=2000),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
insert into public.affiliate_categories(name,slug) values ('AI & Automation','ai-automation'),('Creator & Editing Tools','creator-editing'),('Remote Work & Freelance','remote-freelance'),('Marketing & Growth','marketing-growth'),('Developer Tools','developer-tools'),('Business & SaaS','business-saas'),('Learning & Education','learning-education'),('Digital Resources','digital-resources');
alter table public.affiliate_programs add column category_id uuid references public.affiliate_categories(id), add column description text not null default '' check(length(description)<=2000), add column affiliate_portal text not null default '' check(length(affiliate_portal)<=2048 and (affiliate_portal='' or affiliate_portal ~ '^https://')), add column commission_terms text not null default '' check(length(commission_terms)<=2000), add column payout_terms text not null default '' check(length(payout_terms)<=2000), add column geography text not null default '' check(length(geography)<=120);
create index affiliate_program_category_idx on public.affiliate_programs(category_id);
create table public.affiliate_opportunities (
 id uuid primary key default gen_random_uuid(), name text not null check(length(name) between 1 and 120),provider text not null check(length(provider) between 1 and 500),
 official_website text not null check(length(official_website)<=2048 and official_website ~ '^https://'),program_url text not null check(length(program_url)<=2048 and program_url ~ '^https://'),
 category_id uuid references public.affiliate_categories(id),description text not null default '' check(length(description)<=2000),
 commission_model text not null default 'unknown' check(commission_model in ('unknown','CPA','CPL','revenue_share','recurring','one_time')),
 advertised_terms text not null default '' check(length(advertised_terms)<=2000),cookie_days integer check(cookie_days between 0 and 3650),
 payout_terms text not null default '' check(length(payout_terms)<=2000),geography text not null default '' check(length(geography)<=500),eligibility text not null default '' check(length(eligibility)<=2000),
 last_verified_at timestamptz,status text not null default 'researching' check(status in ('researching','interested','applied','pending','approved','rejected','inactive')),
 notes text not null default '' check(length(notes)<=2000),promoted_program_id uuid references public.affiliate_programs(id),created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index affiliate_opportunity_category_idx on public.affiliate_opportunities(category_id);
create index affiliate_opportunity_program_idx on public.affiliate_opportunities(promoted_program_id);
create table public.affiliate_placements (
 id uuid primary key default gen_random_uuid(),name text not null check(length(name) between 1 and 120), program_id uuid not null references public.affiliate_programs(id),
 link_id uuid not null, foreign key(link_id,program_id) references public.affiliate_links(id,program_id), campaign_id uuid,
 foreign key(campaign_id,link_id) references public.affiliate_campaigns(id,link_id),
 placement_type text not null check(placement_type in ('blog','directory','resource','recommendation','apps','homepage','cta','newsletter','video','social')),
 public_url text not null check(length(public_url)<=2048 and public_url ~ '^https://'),disclosure text not null check(length(disclosure) between 1 and 2000),
 status text not null check(status in ('draft','active','paused','archived')), notes text not null default '' check(length(notes)<=2000),created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index affiliate_placement_link_idx on public.affiliate_placements(link_id,program_id);
create index affiliate_placement_program_idx on public.affiliate_placements(program_id);
create index affiliate_placement_campaign_idx on public.affiliate_placements(campaign_id,link_id);
create table public.affiliate_experiments (
 id uuid primary key default gen_random_uuid(),name text not null check(length(name) between 1 and 120),placement_id uuid not null references public.affiliate_placements(id),
 hypothesis text not null check(length(hypothesis) between 1 and 2000),cta_a text not null check(length(cta_a) between 1 and 500),cta_b text not null check(length(cta_b) between 1 and 500),
 kpi text not null check(length(kpi) between 1 and 500),starts_at timestamptz,ends_at timestamptz,check(starts_at is null or ends_at is null or starts_at<=ends_at),
 status text not null check(status in ('draft','running','completed','archived')),result_notes text not null default '' check(length(result_notes)<=2000),created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index affiliate_experiment_placement_idx on public.affiliate_experiments(placement_id);
do $$ declare t text; begin
 foreach t in array array['affiliate_categories','affiliate_opportunities','affiliate_placements','affiliate_experiments'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from public,anon,authenticated',t);
  execute format('grant select,insert,update on public.%I to authenticated',t);
  execute format('create policy studio_read on public.%I for select to authenticated using ((select private.is_blog_admin()))',t);
  execute format('create policy studio_insert on public.%I for insert to authenticated with check ((select private.is_blog_admin()))',t);
  execute format('create policy studio_update on public.%I for update to authenticated using ((select private.is_blog_admin())) with check ((select private.is_blog_admin()))',t);
  execute format('create trigger stamp before update on public.%I for each row execute function private.affiliate_stamp()',t);
  execute format('create trigger audit after insert or update on public.%I for each row execute function private.affiliate_audit()',t);
 end loop;
end; $$;
create function public.promote_affiliate_opportunity(p_id uuid,p_updated_at timestamptz) returns uuid language plpgsql security invoker set search_path='' as $$
declare o public.affiliate_opportunities; result uuid;
begin
 if not private.is_blog_admin() then raise exception 'Forbidden' using errcode='42501'; end if;
 select * into o from public.affiliate_opportunities where id=p_id and updated_at=p_updated_at for update;
 if not found or o.status<>'approved' then raise exception 'Reload approved opportunity' using errcode='40001'; end if;
 if o.promoted_program_id is not null then return o.promoted_program_id; end if;
 insert into public.affiliate_programs(name,slug,provider,official_website,type,status,category_id,description,affiliate_portal,commission_terms,payout_terms,notes,last_verified_at)
 values(o.name,'program-'||o.id::text,o.provider,o.official_website,o.commission_model,'draft',o.category_id,o.description,o.program_url,o.advertised_terms,o.payout_terms,o.notes,o.last_verified_at) returning id into result;
 update public.affiliate_opportunities set promoted_program_id=result where id=o.id; return result;
end; $$;
revoke all on function public.promote_affiliate_opportunity(uuid,timestamptz) from public,anon;
grant execute on function public.promote_affiliate_opportunity(uuid,timestamptz) to authenticated;
create function public.affiliate_revenue_breakdown(p_since timestamptz,p_until timestamptz,p_environment text,p_program uuid default null) returns jsonb language plpgsql stable security invoker set search_path='' as $$
declare result jsonb;
begin
 if not private.is_blog_admin() then raise exception 'Forbidden' using errcode='42501'; end if;
 if p_since>=p_until or p_until-p_since>interval '367 days' or p_environment not in ('preview','production') then raise exception 'Invalid range'; end if;
 with ledger as (
  select c.*,p.name program,coalesce(k.name,'Belum dikategorikan') category from public.affiliate_commissions c join public.affiliate_programs p on p.id=c.program_id left join public.affiliate_categories k on k.id=p.category_id
  where c.environment=p_environment and c.created_at>=p_since and c.created_at<p_until and c.payout_status in ('confirmed','paid') and (p_program is null or c.program_id=p_program)
 ), grouped as (
  select 'program' as "group",program as label,currency,sum(amount) confirmed,coalesce(sum(amount) filter(where payout_status='paid'),0) paid from ledger group by program,currency
  union all select 'category',category,currency,sum(amount),coalesce(sum(amount) filter(where payout_status='paid'),0) from ledger group by category,currency
  union all select 'history',to_char(confirmed_at at time zone 'Asia/Jakarta','YYYY-MM-DD'),currency,sum(amount),coalesce(sum(amount) filter(where payout_status='paid'),0) from ledger group by 2,currency
 ) select coalesce(jsonb_agg(grouped order by "group",label,currency),'[]') into result from grouped;
 return result;
end; $$;
revoke all on function public.affiliate_revenue_breakdown(timestamptz,timestamptz,text,uuid) from public,anon;
grant execute on function public.affiliate_revenue_breakdown(timestamptz,timestamptz,text,uuid) to authenticated;
create function public.import_affiliate_commissions(p_rows jsonb,p_environment text) returns integer language plpgsql security invoker set search_path='' as $$
declare imported integer;
begin
 if not private.is_blog_admin() then raise exception 'Forbidden' using errcode='42501'; end if;
 if jsonb_typeof(p_rows)<>'array' or jsonb_array_length(p_rows) not between 1 and 200 or p_environment not in ('preview','production') then raise exception 'Invalid import'; end if;
 if exists(select 1 from jsonb_array_elements(p_rows) x where nullif(x->>'external_reference','') is null) then raise exception 'Provider reference required'; end if;
 insert into public.affiliate_commissions(program_id,campaign_id,external_reference,referral_status,amount,currency,payout_status,confirmed_at,paid_at,evidence_reference,notes,environment)
 select x.program_id,x.campaign_id,x.external_reference,x.referral_status,x.amount,x.currency,x.payout_status,x.confirmed_at,x.paid_at,x.evidence_reference,coalesce(x.notes,''),p_environment
 from jsonb_to_recordset(p_rows) x(program_id uuid,campaign_id uuid,external_reference text,referral_status text,amount numeric,currency text,payout_status text,confirmed_at timestamptz,paid_at timestamptz,evidence_reference text,notes text);
 get diagnostics imported=row_count; return imported;
end; $$;
revoke all on function public.import_affiliate_commissions(jsonb,text) from public,anon;
grant execute on function public.import_affiliate_commissions(jsonb,text) to authenticated;
commit;
