import { FREELANCE_PLATFORMS } from "./freelance-directory";
import { RESOURCES_DATA } from "./resources-data";
export const SEARCH_CATEGORIES = ["Semua", "Panduan", "Lowongan", "Direktori", "Tools", "Sumber Daya"] as const;
export type FilterCategory = typeof SEARCH_CATEGORIES[number];
export interface SearchEntry { title: string; description: string; href: string; category: FilterCategory; categories: FilterCategory[]; keywords: string; logo?: { path: string }; }
export const SEARCH_INDEX: SearchEntry[] = [
  { title: "Mulai Freelance dari Nol", description: "WWF 01 · Skill, niche, portfolio, harga, peluang, dan client pertama.", href: "/freelance/belajar/mulai-freelance", category: "Panduan", categories: ["Panduan"], keywords: "freelance pemula belajar skill portfolio portofolio menulis writer design pricing client offer" },
  ...FREELANCE_PLATFORMS.map(p => ({ title: p.name, description: p.description, logo: p.logo, href: `/freelance/direktori/${p.slug}`, category: "Direktori" as const, categories: (p.type.includes("Job Board") ? ["Direktori", "Lowongan"] : ["Direktori"]) as FilterCategory[], keywords: `${p.type} ${p.categories.join(" ")} ${p.opportunityTypes.join(" ")} ${p.regions.join(" ")} freelance platform kerja remote ${p.pricing}` })),
  ...RESOURCES_DATA.map(r => ({ title: r.title, description: r.tagline, href: `/resources/${r.slug}`, category: (r.type === "mini-tool" || r.type === "prompt-pack" ? "Tools" : "Sumber Daya") as FilterCategory, categories: (r.type === "mini-tool" || r.type === "prompt-pack" ? ["Tools", "Sumber Daya"] : ["Sumber Daya"]) as FilterCategory[], keywords: `${r.topic} ${r.type} ${r.bestFor.join(" ")} ${r.topic === "ai" || r.type === "prompt-pack" || r.title.toLowerCase().includes("ai") ? "AI tools" : ""}` })),
];
const aliases: Record<string, string> = { menulis: "writing", writer: "writing", penulis: "writing", desain: "design", portofolio: "portfolio", pemula: "freelance", lowongan: "job", gratis: "gratis", coding: "development", developer: "development", worldwide: "internasional", jobs: "job" };
export function searchFreelance(query: string, category: FilterCategory = "Semua") {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return SEARCH_INDEX.filter(item => (category === "Semua" || item.categories.includes(category)) && tokens.every(token => {
    const haystack = `${item.title} ${item.description} ${item.keywords}`.toLowerCase();
    return haystack.includes(token) || Boolean(aliases[token] && haystack.includes(aliases[token]));
  }));
}
