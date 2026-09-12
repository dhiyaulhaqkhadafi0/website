"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, RotateCcw, Compass } from "lucide-react";
import { ResourceItem, ResourceTopic } from "@/lib/resource-types";
import { TOPIC_FILTERS, TYPE_FILTERS } from "@/content/resources-data";
import { ResourceCard } from "./ResourceCard";

interface ResourceExplorerProps {
  resources: ResourceItem[];
  initialTopic?: ResourceTopic;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function ResourceExplorer({
  resources,
  initialTopic = "all",
  searchQuery,
  onSearchChange,
}: ResourceExplorerProps) {
  const [selectedTopic, setSelectedTopic] = useState<ResourceTopic>(initialTopic);
  const [selectedType, setSelectedType] = useState<string>("all");

  // Filter logic
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      // Topic filter
      if (selectedTopic !== "all" && item.topic !== selectedTopic) {
        return false;
      }
      // Type filter
      if (selectedType !== "all" && item.type !== selectedType) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(query);
        const inTagline = item.tagline.toLowerCase().includes(query);
        const inDescription = item.description.toLowerCase().includes(query);
        const inTakeaways = item.whatYouGet.some((w) =>
          w.toLowerCase().includes(query)
        );
        return inTitle || inTagline || inDescription || inTakeaways;
      }
      return true;
    });
  }, [resources, selectedTopic, selectedType, searchQuery]);

  const hasActiveFilters =
    selectedTopic !== "all" || selectedType !== "all" || searchQuery.trim() !== "";

  const handleResetFilters = () => {
    setSelectedTopic("all");
    setSelectedType("all");
    onSearchChange("");
  };

  return (
    <section id="explorer" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Atmosphere - Soft Silver & Slate Radiant Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-slate-400/[0.05] via-sky-500/[0.03] to-transparent rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10">
        {/* Centered Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#151A27] border border-white/10 text-xs font-mono uppercase tracking-widest text-sky-400 mb-4 shadow-inner">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Katalog Lengkap & Kurasi</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-[#E2E8F0] to-[#94A3B8]">
              Explore Semuanya.
            </span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-300/80 font-light leading-relaxed">
            Temukan blueprint, framework, prompt pack, dan checklist sesuai topik yang ingin kamu bangun hari ini.
          </p>

          {/* Active Filter Counter & Reset Button */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="text-xs font-mono text-slate-400">
              Menampilkan <strong className="text-white font-semibold">{filteredResources.length}</strong> dari {resources.length} resource
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-sky-300 hover:text-white bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-lg transition-colors shadow-sm"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>

        {/* Centered & Enlarged Category Filter Controls */}
        <div className="space-y-4 mb-14 flex flex-col items-center">
          {/* Main Topic Pills - Large, Beautiful, Apple Glass Inspired */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-5xl">
            {TOPIC_FILTERS.map((topic) => {
              const isSelected = selectedTopic === topic.value;
              return (
                <button
                  key={topic.value}
                  onClick={() => setSelectedTopic(topic.value)}
                  className={`px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 border cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-b from-white to-[#E2E8F0] text-black border-white shadow-[0_4px_25px_rgba(255,255,255,0.3)] scale-[1.03]"
                      : "bg-[#111623]/90 text-slate-300 hover:text-white hover:bg-[#192032] border-[#252E42] shadow-sm hover:scale-[1.01]"
                  }`}
                >
                  {topic.label}
                </button>
              );
            })}
          </div>

          {/* Format Sub-Pills - Centered & Clean */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl pt-2">
            {TYPE_FILTERS.map((type) => {
              const isSelected = selectedType === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono transition-all duration-200 border cursor-pointer ${
                    isSelected
                      ? "bg-sky-500/20 text-sky-200 border-sky-400/50 font-bold shadow-sm"
                      : "bg-[#0E131E]/80 text-slate-400 hover:text-slate-200 hover:bg-white/5 border-white/10"
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resource Cards Grid - 3 Columns with Spacious Gap */}
        {filteredResources.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredResources.map((item) => (
                <ResourceCard key={item.id} resource={item} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="py-20 text-center rounded-3xl bg-[#101522]/80 border border-[#252E42] p-8 max-w-lg mx-auto backdrop-blur-xl shadow-xl">
            <Compass className="w-8 h-8 text-sky-400/60 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">Tidak ada resource yang cocok</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
              Coba sesuaikan kata kunci pencarian atau bersihkan filter untuk melihat semua koleksi sistem.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-slate-200 text-xs font-bold transition-all shadow-md"
            >
              Bersihkan Filter
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
