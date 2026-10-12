begin;
create or replace function public.affiliate_stats(p_since timestamptz,p_until timestamptz,p_environment text,p_program uuid default null)
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
    'links',(select coalesce(jsonb_agg(x),'[]') from (select link_id id,link label,count(*) clicks from events group by 1,2 order by 3 desc) x),
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
commit;
