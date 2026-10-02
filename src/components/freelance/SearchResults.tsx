"use client";
import { useSearchParams } from "next/navigation";
import { FreelanceExploreLibrary } from "./FreelanceExploreLibrary";
import { SEARCH_CATEGORIES, type FilterCategory } from "@/content/freelance-search";
export function SearchResults({ initialQuery, initialCategory }: { initialQuery: string; initialCategory: FilterCategory }) {
  const params = useSearchParams();
  const query = params.get("q") ?? initialQuery;
  const candidate = params.get("category") as FilterCategory | null;
  const category = candidate && SEARCH_CATEGORIES.includes(candidate) ? candidate : initialCategory;
  const updateQuery = (value: string) => window.history.replaceState(null, "", `/freelance/cari?q=${encodeURIComponent(value)}&category=${encodeURIComponent(category)}`);
  const updateCategory = (value: FilterCategory) => window.history.replaceState(null, "", `/freelance/cari?q=${encodeURIComponent(query)}&category=${encodeURIComponent(value)}`);
  return <FreelanceExploreLibrary full searchQuery={query} onSearchChange={updateQuery} selectedCategory={category} onCategoryChange={updateCategory} />;
}
