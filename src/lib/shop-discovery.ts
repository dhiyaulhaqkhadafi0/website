import type { ShopItem, OfferingType } from "@/content/shop";
export type ShopFilters = {
  q: string;
  type: "all" | OfferingType;
  topic: string;
  format: string;
  price: string;
  sort: string;
};
export const EMPTY_FILTERS: ShopFilters = {
  q: "",
  type: "all",
  topic: "all",
  format: "all",
  price: "all",
  sort: "recommended",
};
export function normalizeFilters(
  filters: ShopFilters,
  items: ShopItem[],
): ShopFilters {
  const next = { ...filters, q: filters.q.slice(0, 120) };
  if (!["all", "original", "recommended", "service"].includes(next.type))
    next.type = "all";
  const scope = items.filter(
    (i) => next.type === "all" || i.type === next.type,
  );
  if (next.topic !== "all" && !scope.some((i) => i.topic === next.topic))
    next.topic = "all";
  if (next.format !== "all" && !scope.some((i) => i.format === next.format))
    next.format = "all";
  const comparable =
    next.type === "original" && scope.some((i) => i.price !== null);
  if (!comparable || !["all", "free", "paid"].includes(next.price))
    next.price = "all";
  if (
    ![
      "recommended",
      "newest",
      ...(comparable ? ["price-asc", "price-desc"] : []),
    ].includes(next.sort)
  )
    next.sort = "recommended";
  return next;
}
export function readFilters(
  params: URLSearchParams,
  items: ShopItem[],
  defaultType: ShopFilters["type"] = "all",
) {
  return normalizeFilters(
    {
      q: params.get("q") || "",
      type: (params.get("type") || defaultType) as ShopFilters["type"],
      topic: params.get("topic") || "all",
      format: params.get("format") || "all",
      price: params.get("price") || "all",
      sort: params.get("sort") || "recommended",
    },
    items,
  );
}
export function queryFor(
  filters: ShopFilters,
  defaultType: ShopFilters["type"] = "all",
) {
  const result = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    const fallback =
      key === "type" ? defaultType : EMPTY_FILTERS[key as keyof ShopFilters];
    if (value !== fallback && value !== "") result.set(key, value);
  }
  return result.toString();
}
export function discover(items: ShopItem[], f: ShopFilters) {
  const words = f.q
    .toLocaleLowerCase("id-ID")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const result = items.filter((i) => {
    const haystack = [
      i.title,
      i.description,
      i.provider,
      i.topic,
      i.format,
      ...i.tags,
    ]
      .join(" ")
      .toLocaleLowerCase("id-ID");
    return (
      (f.type === "all" || i.type === f.type) &&
      (f.topic === "all" || i.topic === f.topic) &&
      (f.format === "all" || i.format === f.format) &&
      (f.price === "all" ||
        (i.price !== null &&
          (f.price === "free" ? i.price === 0 : i.price > 0))) &&
      words.every((w) => haystack.includes(w))
    );
  });
  return result.sort((a, b) =>
    f.sort === "newest"
      ? b.updatedAt.localeCompare(a.updatedAt)
      : f.sort.startsWith("price-")
        ? ((a.price ?? 0) - (b.price ?? 0)) * (f.sort === "price-desc" ? -1 : 1)
        : 0,
  );
}
