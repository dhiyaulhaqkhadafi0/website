export type AffiliateEntity = "programs" | "links" | "campaigns" | "commissions";
export type AffiliateRow = {
  id: string; name?: string; slug?: string; status?: string; program_id?: string; link_id?: string;
  campaign_id?: string | null; provider?: string; official_website?: string; type?: string; notes?: string;
  last_verified_at?: string | null; destination_url?: string; owner?: string; source?: string; medium?: string;
  starts_at?: string | null; ends_at?: string | null; external_reference?: string | null;
  referral_status?: string; amount?: number | null; currency?: string; payout_status?: string;
  confirmed_at?: string | null; paid_at?: string | null; evidence_reference?: string | null;
  created_at: string; updated_at: string;
};
export type AffiliateStats = {
  active_programs: number; active_links: number; clicks: number; last_activity: string | null;
  programs: { id: string; label: string; clicks: number }[];
  links: { id: string; label: string; clicks: number }[];
  campaigns: { id: string | null; label: string; clicks: number }[];
  sources: { label: string; clicks: number }[];
  daily: { day: string; clicks: number }[];
  recent: { id: string; link: string; campaign: string | null; source: string; occurred_at: string }[];
  commissions: { currency: string; confirmed: number; pending: number; paid: number }[];
};
export type AffiliateReport = {
  rows: AffiliateRow[]; count: number; page: number; stats: AffiliateStats;
  programs: AffiliateRow[]; links: AffiliateRow[]; campaigns: AffiliateRow[];
  environment: "preview" | "production";
  tracking_origin: string;
  audit: { id: string; entity: string; action: string; occurred_at: string; record_id: string; before_data?: Record<string,unknown>|null; after_data?: Record<string,unknown>|null }[];
};
