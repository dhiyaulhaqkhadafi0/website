export type FreelanceLead = {
  id: string; name: string; email: string; source: string; status: string;
  created_at: string; utm_source: string | null; utm_campaign: string | null;
  consent_at: string; consent_version: string;
};
export type FreelanceLeadStats = {
  total: number; active: number; unsubscribed: number; this_month: number;
  months: { month: string; subscribers: number }[];
  sources: { source: string; subscribers: number }[];
};
export type FreelanceLeadReport = {
  leads: FreelanceLead[]; stats: FreelanceLeadStats; count: number;
};
