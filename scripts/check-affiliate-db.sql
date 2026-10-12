-- Execute against the configured Supabase project. ALL test writes roll back.
begin;
select set_config('request.jwt.claims',jsonb_build_object('sub','00000000-0000-4000-8000-000000000003','role','authenticated','email',(select email from public.blog_admin_emails limit 1))::text,true);
set local role authenticated;
do $$ declare p uuid; l uuid; c uuid; commission uuid; before_count bigint; payload jsonb; begin
  if not private.is_blog_admin() then raise exception 'Existing Studio allowlist failed'; end if;
  insert into public.affiliate_programs(name,slug,provider,official_website,type,status)
    values('Transactional QA','qa-micro1-integrity','QA','https://www.micro1.ai','QA','active') returning id into p;
  insert into public.affiliate_links(program_id,name,slug,type,destination_url,status)
    values(p,'QA link','qa-micro1-integrity','QA','https://refer.micro1.ai/referral/jobs?referralCode=qa-transaction-only','active') returning id into l;
  insert into public.affiliate_campaigns(program_id,link_id,name,slug,source,medium,status)
    values(p,l,'QA campaign','qa-organic','threads','organic','active') returning id into c;
  update public.affiliate_campaigns set name='QA campaign edited' where id=c;
  if not exists(select 1 from public.affiliate_campaigns where id=c and name='QA campaign edited') then raise exception 'CRUD persistence failed'; end if;
  begin
    insert into public.affiliate_links(program_id,name,slug,type,destination_url,status) values(p,'Evil','qa-evil','QA','https://evil.example/','active');
    raise exception 'Unsafe URL accepted';
  exception when check_violation then null; end;
  begin
    insert into public.affiliate_campaigns(program_id,link_id,name,slug,source,medium) select id,l,'Wrong parent','wrong-parent','website','directory' from public.affiliate_programs where slug='micro1';
    raise exception 'Cross-program campaign accepted';
  exception when foreign_key_violation then null; end;
  insert into public.affiliate_commissions(program_id,campaign_id,external_reference,referral_status,currency,payout_status,environment)
    values(p,c,'qa-provider-reference','reported','USD','pending','preview') returning id into commission;
  begin
    update public.affiliate_commissions set referral_status='earned',payout_status='confirmed',amount=100,confirmed_at=now() where id=commission;
    raise exception 'Unproven commission accepted';
  exception when check_violation then null; end;
  update public.affiliate_commissions set referral_status='earned',payout_status='confirmed',amount=100,confirmed_at=now(),evidence_reference='QA rollback provider statement' where id=commission;
  payload=public.affiliate_stats(now()-interval '1 day',now()+interval '1 hour','preview',p);
  if (payload->'commissions'->0->>'confirmed')::numeric<>100 then raise exception 'Commission aggregation failed'; end if;
  update public.affiliate_commissions set referral_status='paid',payout_status='paid',paid_at=now() where id=commission;
  payload=public.affiliate_stats(now()-interval '1 day',now()+interval '1 hour','preview',p);
  if (payload->'commissions'->0->>'paid')::numeric<>100 then raise exception 'Paid aggregation failed'; end if;
  begin
    insert into public.affiliate_commissions(program_id,external_reference,referral_status,currency,payout_status,environment) values(p,'qa-provider-reference','reported','USD','pending','preview');
    raise exception 'Duplicate provider reference accepted';
  exception when unique_violation then null; end;
  begin update public.affiliate_commissions set amount=-1 where id=commission; raise exception 'Negative amount accepted'; exception when check_violation then null; end;
  begin update public.affiliate_commissions set currency='BAD!' where id=commission; raise exception 'Invalid currency accepted'; exception when check_violation then null; end;
  if (select count(*) from public.affiliate_audit_log where record_id=commission)<3 then raise exception 'Audit trail failed'; end if;
  update public.affiliate_links set status='paused' where id=l;
  if not exists(select 1 from public.affiliate_links where id=l and status='paused') then raise exception 'Pause failed'; end if;
  update public.affiliate_links set status='active' where id=l;
end; $$;
reset role;
-- Temporary test credential exists only inside this rolled-back transaction.
insert into private.affiliate_tracking_config(secret_hash,environment)
 values(encode(sha256(convert_to(repeat('q',64),'UTF8')),'hex'),'production');
set local role anon;
do $$ declare x jsonb; event_id uuid=gen_random_uuid(); begin
  begin perform public.affiliate_track('wrong','qa-micro1-integrity','',null,'direct',false); raise exception 'Wrong secret accepted'; exception when insufficient_privilege then null; end;
  x=public.affiliate_track(repeat('q',64),'qa-micro1-integrity','qa-organic',event_id,'other',true);
  if x->>'status'<>'ok' or x->>'recorded'<>'true' then raise exception 'Event recording failed: %',x; end if;
  x=public.affiliate_track(repeat('q',64),'qa-micro1-integrity','qa-organic',event_id,'other',true);
  if x->>'recorded'<>'false' then raise exception 'Retry double-counted'; end if;
  x=public.affiliate_track(repeat('q',64),'qa-micro1-integrity','unknown',gen_random_uuid(),'direct',true);
  if x->>'status'<>'campaign_unavailable' then raise exception 'Unknown campaign accepted'; end if;
  x=public.affiliate_track(repeat('q',64),'missing-link','',null,'direct',false);
  if x->>'status'<>'unavailable' then raise exception 'Missing link accepted'; end if;
  begin perform count(*) from public.affiliate_commissions; raise exception 'Anon read allowed'; exception when insufficient_privilege then null; end;
  begin insert into public.affiliate_click_events(id,link_id,source,environment) values(gen_random_uuid(),gen_random_uuid(),'direct','preview'); raise exception 'Anon direct insert allowed'; exception when insufficient_privilege then null; end;
  begin perform public.affiliate_stats(now()-interval '1 day',now(),'preview',null); raise exception 'Anon analytics allowed'; exception when insufficient_privilege then null; end;
end; $$;
reset role;
select set_config('request.jwt.claims',jsonb_build_object('sub','00000000-0000-4000-8000-000000000003','role','authenticated','email',(select email from public.blog_admin_emails limit 1))::text,true);
set local role authenticated;
do $$ declare x jsonb; begin
  x=public.affiliate_stats(now()-interval '1 day',now()+interval '1 hour','production',(select id from public.affiliate_programs where slug='qa-micro1-integrity'));
  if (x->>'clicks')::int<>1 or x->'sources'->0->>'label'<>'threads' then raise exception 'Real event analytics/attribution failed'; end if;
  update public.affiliate_links set status='paused' where slug='qa-micro1-integrity';
end; $$;
reset role;
set local role anon;
do $$ begin
  if public.affiliate_track(repeat('q',64),'qa-micro1-integrity','',null,'direct',false)->>'status'<>'unavailable' then raise exception 'Paused link redirected'; end if;
end; $$;
reset role;
update public.affiliate_links set status='active' where slug='qa-micro1-integrity';
update public.affiliate_programs set status='paused' where slug='qa-micro1-integrity';
set local role anon;
do $$ begin
  if public.affiliate_track(repeat('q',64),'qa-micro1-integrity','',null,'direct',false)->>'status'<>'unavailable' then raise exception 'Paused program redirected'; end if;
end; $$;
reset role;
update public.affiliate_programs set status='active' where slug='qa-micro1-integrity';
update public.affiliate_campaigns set status='paused' where slug='qa-organic';
set local role anon;
do $$ begin
  if public.affiliate_track(repeat('q',64),'qa-micro1-integrity','qa-organic',null,'direct',false)->>'status'<>'campaign_unavailable' then raise exception 'Paused campaign redirected'; end if;
end; $$;
reset role;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000099","role":"authenticated","email":"qa-not-an-admin@example.invalid"}',true);
set local role authenticated;
do $$ begin
  if exists(select 1 from public.affiliate_programs) or exists(select 1 from public.affiliate_click_events) or exists(select 1 from public.affiliate_commissions) or exists(select 1 from public.affiliate_audit_log) then raise exception 'Nonadmin data leak'; end if;
  begin insert into public.affiliate_programs(name,slug,provider,official_website,type) values('Denied','qa-denied','QA','https://www.micro1.ai','QA'); raise exception 'Nonadmin write allowed'; exception when insufficient_privilege then null; end;
  begin perform public.affiliate_stats(now()-interval '1 day',now(),'preview',null); raise exception 'Nonadmin analytics allowed'; exception when insufficient_privilege then null; end;
end; $$;
reset role;
select 'PASS: real Postgres CRUD, audit, FK/URL/amount/status constraints, commissions, exact event idempotency, attribution/aggregation, paused link/program/campaign, anon and nonadmin RLS. All QA writes rolled back.' as result;
rollback;
