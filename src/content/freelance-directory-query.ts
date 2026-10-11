import type { FreelancePlatform } from "./freelance-directory";
export const DIRECTORY_PAGE_SIZE = 9;
export const DIRECTORY_FIELDS = [
  { key: "region", label: "Lokasi platform", short: "Semua lokasi", values: (p: FreelancePlatform) => p.regions },
  { key: "field", label: "Bidang", short: "Semua bidang", values: (p: FreelancePlatform) => p.categories },
  { key: "level", label: "Tingkatan", short: "Semua tingkatan", values: (p: FreelancePlatform) => p.experienceLevels },
  { key: "pricing", label: "Biaya", short: "Semua biaya", values: (p: FreelancePlatform) => [p.pricing] },
  { key: "type", label: "Jenis platform", short: "Semua jenis", values: (p: FreelancePlatform) => [p.type] },
  { key: "opportunity", label: "Tipe peluang", short: "Semua peluang", values: (p: FreelancePlatform) => p.opportunityTypes },
];
const aliases: Record<string, string> = { menulis: "writing", writer: "writing", penulis: "writing", desain: "design", developer: "development", coding: "development", worldwide: "internasional", global: "internasional", jobs: "job", lowongan: "job" };
const normalize = (s: string) => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function directoryResults(platforms: FreelancePlatform[], params: URLSearchParams) {
  const tokens = normalize(params.get("q") ?? "").trim().split(/\s+/).filter(Boolean);
  const active = DIRECTORY_FIELDS.flatMap(f => {
    const value = params.get(f.key);
    return value && platforms.some(p => f.values(p).includes(value)) ? [{ key: f.key, label: f.label, value }] : [];
  });
  const filtered = platforms.filter(p => {
    const text = normalize(`${p.name} ${p.description} ${p.type} ${p.categories.join(" ")} ${p.opportunityTypes.join(" ")} ${p.regions.join(" ")} ${p.pricing} ${p.model}`);
    return tokens.every(t => text.includes(t) || (aliases[t] && text.includes(aliases[t]))) && active.every(f => DIRECTORY_FIELDS.find(field => field.key === f.key)!.values(p).includes(f.value));
  });
  const sort = params.get("sort") ?? "relevant";
  const priceOrder = ["Gratis", "Freemium", "Berbayar", "Periksa ketentuan"];
  const relevance = (p: FreelancePlatform) => tokens.reduce((n, t) => n + (normalize(p.name).includes(t) ? 3 : 0), 0);
  filtered.sort((a, b) => sort === "az" ? a.name.localeCompare(b.name) : sort === "checked" ? b.lastCheckedAt.localeCompare(a.lastCheckedAt) : sort === "free" ? priceOrder.indexOf(a.pricing) - priceOrder.indexOf(b.pricing) : relevance(b) - relevance(a));
  const pages = Math.max(1, Math.ceil(filtered.length / DIRECTORY_PAGE_SIZE));
  const requested = Number(params.get("page"));
  const page = Number.isFinite(requested) ? Math.min(pages, Math.max(1, Math.floor(requested))) : 1;
  return { filtered, active, pages, page, rows: filtered.slice((page - 1) * DIRECTORY_PAGE_SIZE, page * DIRECTORY_PAGE_SIZE) };
}
