"use client";
import { useSearchParams } from "next/navigation";
import { FreelanceExploreLibrary } from "./FreelanceExploreLibrary";
import { SEARCH_CATEGORIES, type FilterCategory } from "@/content/freelance-search";
export function SearchResults({ initialQuery, initialCategory }: { initialQuery: string; initialCategory: FilterCategory }) {
  const params = useSearchParams();
  const query = params.get("q") ?? initialQuery;
  const candidate = params.get("category") as FilterCategory | null;
  const category = candidate && SEARCH_CATEGORIES.includes(candidate) ? candidate : initialCategory;
  const updateQuery = (value: string) => {
    const next = new URLSearchParams(window.location.search); next.set("q", value);
    window.history.replaceState(null, "", `/freelance/cari?${next}`);
  };
  const updateCategory = (value: FilterCategory) => {
    const next = new URLSearchParams(window.location.search); next.set("category", value);
    window.history.replaceState(null, "", `/freelance/cari?${next}`);
  };
  return <FreelanceExploreLibrary full searchQuery={query} onSearchChange={updateQuery} selectedCategory={category} onCategoryChange={updateCategory} />;
}
