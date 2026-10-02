"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Wrench, Sparkles, Check, DollarSign, ExternalLink, Lightbulb } from "lucide-react";
import { FREELANCER_TOOLKIT, ToolkitItem } from "@/content/freelance-data";

export function FreelanceToolkit() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Find Work", "Build", "Productivity", "Business"];

  const filteredItems = FREELANCER_TOOLKIT.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tip.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const getBadgeStyle = (badge: ToolkitItem["badge"]) => {
    switch (badge) {
      case "I Use":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Recommended":
        return "bg-brand-accent/10 text-brand-accent border-brand-accent/30";
      case "Testing":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      default:
        return "bg-white/5 text-white/60 border-white/10";
    }
  };

  const getCostStyle = (cost: ToolkitItem["cost"]) => {
    switch (cost) {
      case "Free":
        return "text-teal-400";
      case "Freemium":
        return "text-indigo-300";
      case "Paid":
        return "text-amber-400";
    }
  };

  return (
    <section id="toolkit" className="py-20 md:py-28 relative border-t border-white/[0.08] bg-[#030409]">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-mono uppercase tracking-wider text-teal-400">
            <span>06 // CURATED STACK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            My Freelancer Toolkit
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            Bukan sekadar daftar nama software. Ini adalah kurasi sistem, tools AI, platform akuisisi klien, dan perlengkapan bisnis yang benar-benar kupakai setiap hari untuk meningkatkan output kerja.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                  selectedCategory === cat
                    ? "bg-teal-500 text-black border-teal-500 font-bold shadow-[0_0_15px_rgba(20,184,166,0.35)]"
                    : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tool atau tips..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-teal-400 transition-colors"
            />
          </div>

        </div>

        {/* Toolkit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header: Name, Badge, Cost */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-teal-400 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[10px] font-mono text-white/40 uppercase">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle(
                        item.badge
                      )}`}
                    >
                      {item.badge}
                    </span>
                    <span className={`text-[10px] font-mono font-semibold ${getCostStyle(item.cost)}`}>
                      {item.cost}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-white/60 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Actionable Practical Tip Box */}
              <div className="mt-2 p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-teal-400 font-semibold">
                  <Lightbulb className="w-3 h-3" />
                  <span>HOW I USE THIS</span>
                </div>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  {item.tip}
                </p>
              </div>

            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-16 text-center text-white/40 text-sm">
            Tidak ada tool yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.
          </div>
        )}

      </div>
    </section>
  );
}
