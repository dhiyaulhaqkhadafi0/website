"use client";

import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

export type FilterCategory =
  | "Semua"
  | "Panduan"
  | "Lowongan"
  | "Direktori"
  | "Tools"
  | "Sumber Daya";

interface FreelanceExploreLibraryProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: FilterCategory;
  onCategoryChange: (category: FilterCategory) => void;
  matchCount?: number;
}

const CATEGORIES: { label: FilterCategory }[] = [
  { label: "Semua" },
  { label: "Panduan" },
  { label: "Lowongan" },
  { label: "Direktori" },
  { label: "Tools" },
  { label: "Sumber Daya" },
];

const POPULAR_SEARCHES = [
  "kerja remote",
  "freelance pemula",
  "menulis",
  "portfolio",
  "AI tools",
];

export function FreelanceExploreLibrary({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  matchCount,
}: FreelanceExploreLibraryProps) {
  return (
    <section id="explore-library" className="relative w-full py-12 md:py-16 bg-[#2E2F2B] scroll-mt-24 border-b border-[rgba(255,255,255,0.07)]">
      <div className="container mx-auto px-6 max-w-[1240px] relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-[36px] sm:text-[44px] md:text-[52px] font-black tracking-[-0.03em] text-[#ECEDE7] leading-tight">
            Mau cari apa?
          </h2>
          <p className="mt-3 text-[15px] md:text-[16px] text-[#898B84] font-normal max-w-md mx-auto leading-relaxed">
            Cari apa pun yang kamu butuhkan untuk membangun karier freelance dan remote.
          </p>
        </motion.div>

        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="relative w-full max-w-3xl mx-auto mb-6"
        >
          <div className="relative flex items-center group">
            <Search className="absolute left-5 w-[18px] h-[18px] text-[#A1A39B] group-focus-within:text-[#A5AC91] transition-colors pointer-events-none" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari lowongan, platform, panduan, tools, atau sumber daya..."
              className="w-full pl-[52px] pr-12 py-4 rounded-[8px] bg-[#33342F] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.14)] focus:border-[#A5AC91]/50 text-[#ECEDE7] placeholder-[#A1A39B] text-[14px] sm:text-[15px] outline-none transition-all duration-300"
            />

            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                type="button"
                className="absolute right-4 p-1.5 rounded-md text-[#898B84] hover:text-[#ECEDE7] hover:bg-white/[0.05] transition-colors"
                aria-label="Bersihkan pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {searchQuery && typeof matchCount === "number" && (
            <div className="mt-2.5 text-left px-1">
              <span className="text-[12px] text-[#A1A39B]">
                Ditemukan <strong className="text-[#ECEDE7]">{matchCount}</strong> hasil untuk &ldquo;{searchQuery}&rdquo;
              </span>
            </div>
          )}
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.14 }}
          className="flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none py-1 mb-6"
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => onCategoryChange(cat.label)}
                type="button"
                className={`shrink-0 px-4 py-2 rounded-[6px] text-[12px] sm:text-[13px] font-semibold tracking-wide transition-all duration-200 ${
                  isSelected
                    ? "bg-[#ECEDE7] text-[#242521]"
                    : "bg-transparent text-[#A1A39B] border border-[rgba(255,255,255,0.07)] hover:text-[#C3C5BD] hover:border-[rgba(255,255,255,0.14)]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* Popular searches */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1"
        >
          <span className="text-[11px] text-[#A1A39B] font-medium uppercase tracking-wider">Populer:</span>
          {POPULAR_SEARCHES.map((term) => (
            <button
              key={term}
              onClick={() => onSearchChange(term)}
              type="button"
              className="text-[12px] text-[#C3C5BD] hover:text-[#ECEDE7] transition-colors underline underline-offset-2 decoration-[rgba(255,255,255,0.15)] hover:decoration-[rgba(255,255,255,0.4)]"
            >
              {term}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
