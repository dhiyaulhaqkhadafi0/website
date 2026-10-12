import { FREELANCE_PLATFORMS } from "./freelance-directory";
import { PUBLISHED_RESOURCES, resourceHref } from "./freelance-resources";
import { activeRemoteJobs } from "./freelance-jobs";
export const SEARCH_CATEGORIES = ["Semua", "Panduan", "Lowongan", "Direktori", "Tools", "Sumber Daya"] as const;
export type FilterCategory = typeof SEARCH_CATEGORIES[number];
export interface SearchEntry { title: string; description: string; href: string; category: FilterCategory; categories: FilterCategory[]; keywords: string; logo?: { path: string }; }
export const SEARCH_INDEX: SearchEntry[] = [
  ...FREELANCE_PLATFORMS.map(p => ({ title: p.name, description: p.description, logo: p.logo, href: `/freelance/direktori/${p.slug}`, category: "Direktori" as const, categories: ["Direktori"] as FilterCategory[], keywords: `${p.type} ${p.categories.join(" ")} ${p.opportunityTypes.join(" ")} ${p.regions.join(" ")} freelance platform kerja remote ${p.pricing}` })),
  ...PUBLISHED_RESOURCES.map(r => ({ title:r.title, description:r.description, href:resourceHref(r), category:(r.type === "guide" ? "Panduan" : r.type === "tool" || r.type === "calculator" ? "Tools" : "Sumber Daya") as FilterCategory, categories:(r.type === "guide" ? ["Panduan"] : r.type === "tool" || r.type === "calculator" ? ["Tools", "Sumber Daya"] : ["Sumber Daya"]) as FilterCategory[], keywords:r.keywords.join(" ") })),
];
const aliases: Record<string, string> = { menulis: "writing", writer: "writing", penulis: "writing", desain: "design", portofolio: "portfolio", pemula: "freelance", lowongan: "job", gratis: "gratis", coding: "development", developer: "development", worldwide: "internasional", jobs: "job" };
export function searchFreelance(query: string, category: FilterCategory = "Semua", now = new Date()) {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const jobs: SearchEntry[] = activeRemoteJobs(now).map(job => ({ title: job.title, description: `${job.company} · ${job.employment} · ${job.level}. ${job.summary}`, href: `/freelance/jobs?q=${encodeURIComponent(job.title)}`, category: "Lowongan", categories: ["Lowongan"], keywords: `${job.field} ${job.locations.join(" ")} kerja remote job ${job.requirements}` }));
  return [...SEARCH_INDEX, ...jobs].filter(item => (category === "Semua" || item.categories.includes(category)) && tokens.every(token => {
    const haystack = `${item.title} ${item.description} ${item.keywords}`.toLowerCase();
    return haystack.includes(token) || Boolean(aliases[token] && haystack.includes(aliases[token]));
  }));
}
