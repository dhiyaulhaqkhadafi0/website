"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Layers, FileCode, PenTool, TrendingUp } from "lucide-react";
import { SIGNATURE_SYSTEMS } from "@/content/resources-data";

export function ResourcesPreview() {
  const iconMap: Record<string, React.ReactNode> = {
    "product-system": <Layers className="w-5 h-5 text-sky-400" />,
    "creator-system": <PenTool className="w-5 h-5 text-indigo-400" />,
    "ai-work-system": <FileCode className="w-5 h-5 text-emerald-400" />,
    "business-system": <TrendingUp className="w-5 h-5 text-amber-400" />,
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 bg-[#05060a] border-t border-white/5">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="max-w-xl">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold mb-2 block">
              Knowledge Engine
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Systems worth sharing.
            </h2>
            <p className="text-base text-slate-400 mt-3 font-normal leading-relaxed">
              Empat kerangka sistem kerja yang dirancang untuk membantu Anda memvalidasi ide, memprogram AI dengan presisi, dan membangun aset digital defensible.
            </p>
          </div>

          <Link
            href="/resources"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-semibold text-xs sm:text-sm border border-white/15 transition-all"
          >
            <span>Explore All Resources</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Systems Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SIGNATURE_SYSTEMS.map((sys, idx) => (
            <motion.div
              key={sys.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="p-6 rounded-3xl bg-[#0b0c12] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {sys.num} · System
                  </span>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    {iconMap[sys.id] || <Layers className="w-5 h-5 text-emerald-400" />}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {sys.name}
                </h3>
                <p className="text-xs font-mono text-slate-400 mb-3 leading-snug">
                  {sys.tagline}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed font-normal mb-5">
                  {sys.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <Link
                  href={`/resources/${sys.primaryResourceSlug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Buka Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
