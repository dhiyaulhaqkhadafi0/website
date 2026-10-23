import { analyticsConsent, safePage } from "./analytics-policy.mjs";
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-P6D1E895XB";
export type AnalyticsEvents = {
  page_view: {
    page_location: string;
    page_title: string;
    page_referrer: string;
  };
  select_content: { content_type: string; item_id: string };
  search: { search_term: "apps_catalog"; result_count: number };
  generate_lead: { method: string };
  view_item: {
    currency: string;
    value: number;
    items: { item_id: string; item_name: string }[];
  };
  begin_checkout: {
    currency: string;
    value: number;
    items: { item_id: string; item_name: string }[];
  };
  affiliate_click: { link_id: string; campaign_id?: string };
  app_open: { app_id: string; deployment: string };
  app_used: { app_id: string; feature: string };
  app_paywall_viewed: { app_id: string; pricing_model: string };
  language_changed: { language: string };
};
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    khadafiGaReady?: boolean;
  }
}
// Public metadata only. Never pass search text, email, tokens or provider URLs.
export function trackEvent<K extends keyof AnalyticsEvents>(
  event: K,
  parameters: AnalyticsEvents[K],
) {
  if (
    typeof window === "undefined" ||
    !window.khadafiGaReady ||
    !analyticsConsent() ||
    !safePage(location.pathname)
  )
    return;
  window.gtag?.("event", event, {
    ...parameters,
    page_location: safePage(location.pathname),
    page_referrer: "",
  });
}
// Purchase reporting is deliberately server-only and is not exposed by this utility.
// Wire a consented Measurement Protocol outbox to verified DOKU payment events before enabling it.
