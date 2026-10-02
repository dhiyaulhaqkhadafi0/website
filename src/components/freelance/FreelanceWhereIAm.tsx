"use client";

import { motion } from "framer-motion";
import { Check, Flame, MapPin, Target, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";
import { JOURNEY_STAGES, FREELANCE_STATUS, FREELANCE_STATS } from "@/content/freelance-data";

export function FreelanceWhereIAm() {
  return (
    <section id="where-i-am" className="py-20 md:py-28 relative border-t border-white/[0.08] bg-[#030509]">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-brand-accent">
            <span>02 // CURRENT POSITION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Where I Am Now
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            Peta evolusi dari nol menuju kemandirian penuh. Transparansi adalah mata uang terbesar dalam membangun personal brand yang defensibel.
          </p>
        </div>

        {/* 5-Step Pipeline Visual Stepper */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
          <div className="text-xs font-mono uppercase tracking-wider text-white/40 mb-6 flex items-center justify-between">
            <span>CAREER TRAJECTORY PIPELINE</span>
            <span className="text-brand-accent font-bold">STATUS: PHASE 02</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {JOURNEY_STAGES.map((stg, idx) => {
              const isPassed = stg.isPassed;
              const isCurrent = stg.isCurrent;

              return (
                <div
                  key={stg.name}
                  className={`relative p-4 sm:p-5 rounded-2xl border transition-all ${
                    isCurrent
                      ? "bg-brand-accent/10 border-brand-accent shadow-[0_0_30px_rgba(129,140,248,0.25)] ring-1 ring-brand-accent/50"
                      : isPassed
                      ? "bg-white/[0.04] border-white/15 text-white/80"
                      : "bg-white/[0.01] border-white/5 text-white/30"
                  }`}
                >
                  {/* Step Number & Marker */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-white/40">
                      0{idx + 1}
                    </span>
                    {isCurrent ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono uppercase font-bold text-brand-accent bg-brand-accent/20 px-2 py-0.5 rounded-full animate-pulse">
                        ● YOU ARE HERE
                      </span>
                    ) : isPassed ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-white/20" />
                    )}
                  </div>

                  <h3
                    className={`font-bold text-sm sm:text-base mb-1 ${
                      isCurrent ? "text-white" : isPassed ? "text-white/90" : "text-white/40"
                    }`}
                  >
                    {stg.name}
                  </h3>
                  <p
                    className={`text-xs leading-relaxed ${
                      isCurrent ? "text-white/70" : isPassed ? "text-white/50" : "text-white/25"
                    }`}
                  >
                    {stg.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Current Focus Highlight Box */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider block">
                  FOCUS SAAT INI
                </span>
                <p className="text-sm font-semibold text-white">
                  {FREELANCE_STATUS.headline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-white/50 sm:text-right">
              <MapPin className="w-4 h-4 text-brand-accent" />
              <span>{FREELANCE_STATUS.currentLocation}</span>
            </div>
          </div>
        </div>

        {/* Big Statement Hook & From Zero to Remote */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
              <Flame className="w-4 h-4" />
              <span>THE BUILD IN PUBLIC MANIFESTO</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              &ldquo;Jangan menunggu sukses baru halaman ini dibuat. Justru progress dari nol adalah nilainya.&rdquo;
            </h3>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed">
              Banyak orang baru berani membuat halaman portofolio ketika sudah memiliki belasan klien korporat. Tapi di sini, aku memilih mendokumentasikan setiap langkah saat prosesnya sedang berlangsung. Dari menyusun tawaran pertama, menghadapi penolakan, mengasah sistem AI, hingga nanti saat berhasil mendapatkan klien remote yang berkelanjutan.
            </p>
          </div>

          {/* Mini Stats Card Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div className="text-3xl sm:text-4xl font-black text-brand-accent mb-1">
                {String(FREELANCE_STATS.projectsBuilt).padStart(2, "0")}
              </div>
              <div className="text-xs font-medium text-white/70">
                Projects Built
              </div>
              <div className="text-[10px] text-white/40 mt-1">
                Chikki, Gerakasa, HCFTL
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div className="text-3xl sm:text-4xl font-black text-indigo-400 mb-1">
                {String(FREELANCE_STATS.skillsDeveloping).padStart(2, "0")}
              </div>
              <div className="text-xs font-medium text-white/70">
                High-Value Skills
              </div>
              <div className="text-[10px] text-white/40 mt-1">
                AI, Fullstack, UI Systems
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div className="text-3xl sm:text-4xl font-black text-teal-400 mb-1">
                {FREELANCE_STATS.placesToWork}
              </div>
              <div className="text-xs font-medium text-white/70">
                Places to Work From
              </div>
              <div className="text-[10px] text-white/40 mt-1">
                Location Sovereignty
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-1">
                {FREELANCE_STATS.weeklyFocusHours}
              </div>
              <div className="text-xs font-medium text-white/70">
                Weekly Deep Work
              </div>
              <div className="text-[10px] text-white/40 mt-1">
                Focused Sprint Time
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
