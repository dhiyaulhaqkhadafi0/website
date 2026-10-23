export const APP_MODELS = [
  "free",
  "freemium",
  "one_time",
  "subscription",
  "credits",
] as const;
export const APP_STATES = [
  "draft",
  "published",
  "maintenance",
  "archived",
] as const;
export type AppCategory = {
  id: string;
  slug: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  icon: string;
  sort_order: number;
  updated_at: string;
};
export type AppRecord = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  short_description: string;
  description: string;
  name_en: string;
  short_description_en: string;
  description_en: string;
  tags: string[];
  icon_url: string;
  cover_url: string;
  deployment: "internal" | "external";
  destination: string;
  preview_url: string;
  pricing_model: (typeof APP_MODELS)[number];
  price: number;
  currency: "IDR";
  access_terms: string;
  free_allowance: number;
  featured: boolean;
  status: (typeof APP_STATES)[number];
  version: string;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
};
export const appHref = (app: AppRecord, categories: AppCategory[]) =>
  `/apps/${categories.find((c) => c.id === app.category_id)?.slug || "uncategorized"}/${app.slug}`;
export function appPrice(app: AppRecord) {
  if (app.pricing_model === "free") return "Gratis";
  const value = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: app.currency,
    maximumFractionDigits: 0,
  }).format(app.price);
  return `${value}${app.pricing_model === "subscription" ? " / bulan" : app.pricing_model === "credits" ? " / paket kredit" : app.pricing_model === "one_time" ? " · sekali beli" : " · freemium"}`;
}
