"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SIGNATURE_SYSTEMS } from "@/content/resources-data";
import { ArrowRight, ChevronRight, Workflow, Sparkles, Layers, Box, Cpu, ChevronDown } from "lucide-react";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

const PILLAR_COLOR_MAP: Record<string, {
  accent: string;
  border: string;
  badge: string;
  glow: string;
  stepBorder: string;
}> = {
  "product-system": {
    accent: "text-sky-400",
    border: "border-sky-500/40 bg-[#071322]/90",
    badge: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    glow: "rgba(56, 189, 248, 0.15)",
    stepBorder: "hover:border-sky-400/40",
  },
  "creator-system": {
    accent: "text-purple-400",
    border: "border-purple-500/40 bg-[#160B24]/90",
    badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    glow: "rgba(168, 85, 247, 0.15)",
    stepBorder: "hover:border-purple-400/40",
  },
  "ai-work-system": {
    accent: "text-emerald-400",
    border: "border-emerald-500/40 bg-[#061812]/90",
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    glow: "rgba(16, 185, 129, 0.15)",
    stepBorder: "hover:border-emerald-400/40",
  },
  "business-system": {
    accent: "text-amber-400",
    border: "border-amber-500/40 bg-[#1A1006]/90",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    glow: "rgba(245, 158, 11, 0.15)",
    stepBorder: "hover:border-amber-400/40",
  },
};

export function SystemsMatrixSection() {
  const [selectedPillarId, setSelectedPillarId] = useState<string>(
    SIGNATURE_SYSTEMS[0].id
  );
  const [activeStepDetail, setActiveStepDetail] = useState<number | null>(null);

  const activePillar =
    SIGNATURE_SYSTEMS.find((p) => p.id === selectedPillarId) ||
    SIGNATURE_SYSTEMS[0];

  const theme = PILLAR_COLOR_MAP[activePillar.id] || PILLAR_COLOR_MAP["product-system"];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Distinct Background Atmosphere - Deep emerald & violet connector waves */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-gradient-to-r from-emerald-500/10 via-sky-500/5 to-purple-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-3">
              <Workflow className="w-3.5 h-3.5" />
              <span>Signature Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              The Systems Library{" "}
              <span className={`${lora.className} italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-sky-200 to-indigo-200`}>
                Matrix.
              </span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/65 max-w-2xl font-light">
              Empat pilar sistem kerja mandiri untuk mengubah ide kabur menjadi software, konten, dan bisnis digital terukur bersama AI.
            </p>
          </div>
          <span className="text-xs font-mono text-white/40 hidden md:block">
            Klik pilar untuk membuka alur eksekusi
          </span>
        </div>

        {/* 4 Pillars Tab Header with Distinct Vivid Identity */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
          {SIGNATURE_SYSTEMS.map((pillar) => {
            const isActive = pillar.id === selectedPillarId;
            const pTheme = PILLAR_COLOR_MAP[pillar.id] || PILLAR_COLOR_MAP["product-system"];

            return (
              <button
                key={pillar.id}
                onClick={() => {
                  setSelectedPillarId(pillar.id);
                  setActiveStepDetail(null);
                }}
                className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 relative group overflow-hidden ${
                  isActive
                    ? `${pTheme.border} shadow-[0_4px_30px_${pTheme.glow}] ring-1 ring-white/20`
                    : "bg-[#090C16]/70 hover:bg-white/[0.04] border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border ${
                    isActive ? pTheme.badge : "text-white/40 border-white/10 bg-white/5"
                  }`}>
                    PILLAR {pillar.num}
                  </span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1">
                  {pillar.name}
                </h3>
                <p className="mt-1 text-xs text-white/50 line-clamp-1 font-light">
                  {pillar.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Interactive Expandable Pillar Flow Visualizer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className={`p-6 sm:p-10 rounded-3xl border shadow-2xl relative overflow-hidden backdrop-blur-2xl transition-colors duration-500 ${theme.border}`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-1.5">
                  <span className={`px-2.5 py-0.5 rounded border ${theme.badge}`}>
                    Spesifikasi Pilar {activePillar.num}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {activePillar.name}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-white/70 max-w-2xl font-light leading-relaxed">
                  {activePillar.description}
                </p>
              </div>

              <Link
                href={`/resources/${activePillar.primaryResourceSlug}`}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white text-black hover:bg-slate-200 text-sm font-bold transition-all shrink-0 self-start lg:self-center shadow-lg group hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Buka Template Sistem Ini</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 text-black transition-transform" />
              </Link>
            </div>

            {/* Sequential Step Flow with Clickable Inspector ("Bisa dibuka tutup") */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-white/50 block">
                  Tahapan Alur Kerja (Klik step untuk inspect detail):
                </span>
                <span className="text-[11px] font-mono text-white/40 hidden sm:inline">
                  5 Steps Linear Pipeline
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {activePillar.flow.map((step, idx) => {
                  const isStepActive = activeStepDetail === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveStepDetail(isStepActive ? null : idx)}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 relative flex flex-col justify-between ${
                        isStepActive
                          ? "bg-white/15 border-white/50 shadow-md ring-1 ring-white/30"
                          : `bg-white/[0.03] border-white/5 ${theme.stepBorder}`
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-white/40 mb-2">
                        <span>STEP 0{idx + 1}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isStepActive ? "rotate-180 text-white" : "text-white/20"}`} />
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {step}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Step Detail Expandable Panel */}
              <AnimatePresence>
                {activeStepDetail !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-4 p-5 rounded-2xl bg-black/40 border border-white/10 overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-white/60 mb-2">
                      <span className="text-white font-semibold">
                        Detail Step 0{activeStepDetail + 1}: {activePillar.flow[activeStepDetail]}
                      </span>
                      <button
                        onClick={() => setActiveStepDetail(null)}
                        className="text-white/40 hover:text-white"
                      >
                        ✕ Tutup
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
                      Fase ini memastikan output pada tahap {activePillar.flow[activeStepDetail]} terverifikasi sebelum masuk ke langkah berikutnya, meminimalkan rework dan menjaga efisiensi kolaborasi dengan agent AI.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Key Deliverables Matrix */}
            <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2.5 text-xs">
              <span className="font-mono text-white/50 mr-2 uppercase tracking-wider">
                Output Nyata:
              </span>
              {activePillar.keyOutputs.map((output, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/90 font-mono text-xs shadow-inner"
                >
                  {output}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
