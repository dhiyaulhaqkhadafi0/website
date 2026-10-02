"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp, Clock, CheckCircle2, CircleDashed, Sparkles, BookOpen, Lightbulb } from "lucide-react";
import { JOURNEY_TIMELINE, JourneyMilestone } from "@/content/freelance-data";
import Link from "next/link";

export function FreelanceJourneyTimeline() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>("m1");

  const categories = ["All", "Foundations", "Services", "Client Work", "Expansion"];

  const filteredMilestones = JOURNEY_TIMELINE.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="the-journey" className="py-20 md:py-28 relative border-t border-white/[0.08] bg-[#020307]">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono uppercase tracking-wider text-indigo-400">
            <span>03 // BUILD IN PUBLIC TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            The Journey
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            Dokumentasi berkala perjalanan karier independen. Setiap pencapaian, eksperimen, dan catatan refleksi dibagikan secara terbuka.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                selectedCategory === cat
                  ? "bg-brand-accent text-white border-brand-accent font-semibold shadow-[0_0_15px_rgba(129,140,248,0.3)]"
                  : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Timeline Stream */}
        <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-[11px] sm:before:left-[19px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-brand-accent before:via-indigo-500/30 before:to-transparent">
          {filteredMilestones.map((milestone) => {
            const isExpanded = expandedId === milestone.id;
            const isCompleted = milestone.status === "completed";
            const isInProgress = milestone.status === "in-progress";

            return (
              <div key={milestone.id} className="relative group">
                {/* Node Dot */}
                <div
                  className={`absolute -left-[30px] sm:-left-[38px] top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-[#090D16] border-emerald-400 text-emerald-400 ring-4 ring-emerald-500/10"
                      : isInProgress
                      ? "bg-[#090D16] border-brand-accent text-brand-accent ring-4 ring-brand-accent/20 animate-pulse"
                      : "bg-[#090D16] border-white/30 text-white/30"
                  }`}
                >
                  {isCompleted ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  ) : isInProgress ? (
                    <span className="w-2 h-2 rounded-full bg-brand-accent" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                  )}
                </div>

                {/* Milestone Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">

                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-brand-accent uppercase tracking-wider">
                        {milestone.date}
                      </span>
                      <span className="text-white/20">•</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-white/60">
                        {milestone.category}
                      </span>
                    </div>

                    <div>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Tercapai</span>
                        </span>
                      )}
                      {isInProgress && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                          <CircleDashed className="w-3 h-3 animate-spin" />
                          <span>Sedang Berjalan</span>
                        </span>
                      )}
                      {milestone.status === "planned" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-white/40 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span>Tahap Rencana</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-white/60 font-medium mb-4">
                    {milestone.tagline}
                  </p>

                  {/* Collapsible Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden space-y-4 pt-3 border-t border-white/10"
                      >
                        <p className="text-sm text-white/70 leading-relaxed">
                          {milestone.description}
                        </p>

                        {/* Lessons Learned Box */}
                        {milestone.lessons.length > 0 && (
                          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-accent">
                              <Lightbulb className="w-3.5 h-3.5" />
                              <span>Catatan & Pelajaran:</span>
                            </div>
                            <ul className="space-y-1.5 text-xs text-white/60">
                              {milestone.lessons.map((lesson, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-brand-accent mt-0.5">✦</span>
                                  <span>{lesson}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {milestone.articleSlug && (
                          <div className="pt-1">
                            <Link
                              href={milestone.articleSlug}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-accent hover:underline"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Baca Catatan Lengkap di Blog →</span>
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Toggle Button */}
                  <div className="mt-4 pt-2">
                    <button
                      type="button"
                      onClick={() => toggleExpand(milestone.id)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-white/50 hover:text-white transition-colors"
                    >
                      <span>{isExpanded ? "Sembunyikan Detail" : "Baca Detail & Pelajaran"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
