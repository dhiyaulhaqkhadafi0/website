import sbs from "./sbs.json";
import assets from "./assets.json";
import monetization from "./monetization.json";
import monetizationAssets from "./monetization-assets.json";
import publicAssets from "./public-assets.json";
export { sbs, assets, monetization };
export const SBS_PATH = "/freelance/tools/service-business-system";
export const MONETIZATION_PATH = "/freelance/tools/monetisasi";
export const RATE_PATH = "/freelance/tools/freelance-rate-calculator";
export const monetizationPdf = monetizationAssets.assets[0];
export const coreArchive = publicAssets.find(
  (f) => f.path === "release/Service_Business_System_V2_Inti_Gratis.zip",
)!;
export const fullArchive = publicAssets.find(
  (f) => f.path === "release/Service_Business_System_V2_Lengkap_Gratis.zip",
)!;
export type Pathway = (typeof monetization.items)[number];
export type Asset = (typeof assets)[number];
export const money = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
export const chapterHref = (slug: string, anchor?: string) =>
  `${SBS_PATH}/${slug}${anchor ? "#" + anchor : ""}`;
export const pathwayHref = (slug: string) => `${MONETIZATION_PATH}/${slug}`;
export const assetGuide = (id: string) => {
  const chapter = sbs.chapters.find((c) =>
    c.components.some((x) => x.downloads.includes(id)),
  );
  const component = chapter?.components.find((x) => x.downloads.includes(id));
  return chapter ? chapterHref(chapter.slug, component?.anchor) : SBS_PATH;
};
export const fileSize = (n: number) =>
  n >= 1048576
    ? `${(n / 1048576).toLocaleString("id-ID", { maximumFractionDigits: 1 })} MB`
    : `${Math.ceil(n / 1024)} KB`;
export type PathQuery = {
  q: string;
  category: string;
  mechanisms: string[];
  page: number;
  saved: boolean;
  sort: string;
};
export function parsePathQuery(params: URLSearchParams): PathQuery {
  const category = params.get("category") || "";
  return {
    q: (params.get("q") || "").slice(0, 200),
    category: monetization.categories.some((c) => c.id === category)
      ? category
      : "",
    mechanisms: [
      ...new Set(params.getAll("mechanism").flatMap((x) => x.split(","))),
    ].filter((m) => m in monetization.mechanism_labels),
    page: Math.max(1, Math.min(7, Math.floor(Number(params.get("page")) || 1))),
    saved: params.get("saved") === "1",
    sort: params.get("sort") === "az" ? "az" : "number",
  };
}
export function pathQueryString(query: PathQuery) {
  const p = new URLSearchParams();
  if (query.q) p.set("q", query.q);
  if (query.category) p.set("category", query.category);
  query.mechanisms.forEach((m) => p.append("mechanism", m));
  if (query.page > 1) p.set("page", String(query.page));
  if (query.saved) p.set("saved", "1");
  if (query.sort === "az") p.set("sort", "az");
  return p.toString();
}
export function filterPathways(query: PathQuery, saved: string[] = []) {
  const tokens = query.q
    .toLocaleLowerCase("id")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const found = monetization.items.filter(
    (i) =>
      (!query.category || i.category_id === query.category) &&
      (!query.mechanisms.length ||
        query.mechanisms.some((m) => i.mechanisms.includes(m))) &&
      (!query.saved || saved.includes(i.id)) &&
      tokens.every((t) =>
        `${i.title} ${i.definition} ${i.buyer_example} ${i.editorial_tags.join(" ")} ${i.mechanisms.map((m) => monetization.mechanism_labels[m as keyof typeof monetization.mechanism_labels]).join(" ")}`
          .toLocaleLowerCase("id")
          .includes(t),
      ),
  );
  return query.sort === "az"
    ? [...found].sort((a, b) => a.title.localeCompare(b.title, "id"))
    : found;
}
