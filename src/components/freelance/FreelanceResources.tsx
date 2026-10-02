"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { FREELANCE_RESOURCES, FreelanceResource } from "@/content/freelance-data";
import Link from "next/link";

export function FreelanceResources() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filters = ["All", "Starting", "Clients", "Pricing", "AI Tools", "Remote"];

  const filteredResources = FREELANCE_RESOURCES.filter((res) => {
    if (activeFilter === "All") return true;
    return res.category === activeFilter;
  });

  return (
    <section id="resources" className="py-20 md:py-28 relative border-t border-white/[0.08] bg-[#020306]">
      {/* Glows */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono uppercase tracking-wider text-purple-400">
            <span>07 // KNOWLEDGE HUB & GUIDES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Resources for Freelancers
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            Kumpulan panduan praktis, sistem penentuan harga, dan template kerja yang dirancang untuk membantumu melompati kesalahan-kesalahan umum di awal karier independen.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filters.map((fil) => (
            <button
              key={fil}
              onClick={() => setActiveFilter(fil)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                activeFilter === fil
                  ? "bg-purple-500 text-white border-purple-500 font-semibold shadow-[0_0_15px_rgba(168,85,247,0.35)]"
                  : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {fil}
            </button>
          ))}
        </div>

        {/* Library Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                {/* Meta */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
                    {res.badge}
                  </span>
                  <span className="text-[11px] font-mono text-white/40 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{res.readTime}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-300 transition-colors leading-snug">
                  {res.title}
                </h3>

                <p className="text-xs text-white/60 leading-relaxed mb-5">
                  {res.summary}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 pt-3 border-t border-white/5 mb-6">
                  {res.highlights.map((hl, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-[11px] text-white/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Read Action */}
              <div className="pt-2">
                <Link
                  href={res.link || "/blog"}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-purple-300 hover:text-white transition-colors group/link"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Pelajari Panduan Ini</span>
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Extended Library CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold border border-white/10 transition-all hover:scale-105"
          >
            <span>Jelajahi Sumber Daya Gratis Lainnya di Ekosistem Khadafi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
