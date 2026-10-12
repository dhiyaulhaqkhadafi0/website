begin;
create index affiliate_campaigns_link_program_idx on public.affiliate_campaigns(link_id,program_id);
create index affiliate_clicks_campaign_link_idx on public.affiliate_click_events(campaign_id,link_id);
create index affiliate_commissions_campaign_program_idx on public.affiliate_commissions(campaign_id,program_id);
commit;
