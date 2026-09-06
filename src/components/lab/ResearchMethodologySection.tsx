"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Lora } from "next/font/google";
import { RESEARCH_STAGES, EVIDENCE_LADDER } from "@/lib/hcftl";
import { LabSectionHeader } from "./LabSectionHeader";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });
const CUBIC_EASE = [0.16, 1, 0.3, 1] as const;

const PIPELINE_PHASES = [
  {
    id: "fase-1",
    phaseNumber: "Fase I",
    phaseTitle: "Perumusan & Batasan",
    phaseTagline: "Formulasi hipotesis dan asesmen risiko sebelum kode ditulis",
    stages: RESEARCH_STAGES.slice(0, 3), // R01, R02, R03
    color: "#B5E1E7",
  },
  {
    id: "fase-2",
    phaseNumber: "Fase II",
    phaseTitle: "Simulasi & Eksperimen",
    phaseTagline: "Isolasi digital kembar dan verifikasi telemetri berulang",
    stages: RESEARCH_STAGES.slice(3, 6), // R04, R05, R06
    color: "#ADBAC5",
  },
  {
    id: "fase-3",
    phaseNumber: "Fase III",
    phaseTitle: "Replikasi & Rilis Terkendali",
    phaseTagline: "Telaah independen dan publikasi terbuka yang bertanggung jawab",
    stages: RESEARCH_STAGES.slice(6, 9), // R07, R08, R09
    color: "#F0F2ED",
  },
];

/* ─────────────────────────────────────────────────────────────
   ILUSTRASI EVIDENCE LADDER: 6 Platform Bertingkat
   Menyala mengikuti level yang sedang dibaca pengunjung
───────────────────────────────────────────────────────────── */
function TieredPlatformLadderIllustration({ activeLevel }: { activeLevel: number | null }) {
  // Platform isometric coordinates (ascending left to right)
  const platforms = [
    { level: 1, name: "Concept", cx: 60, cy: 230, w: 70, h: 26 },
    { level: 2, name: "Prototype", cx: 125, cy: 195, w: 70, h: 26 },
    { level: 3, name: "Controlled Experiment", cx: 190, cy: 160, w: 70, h: 26 },
    { level: 4, name: "Reproducible Result", cx: 255, cy: 125, w: 70, h: 26 },
    { level: 5, name: "Real-World Validation", cx: 320, cy: 90, w: 70, h: 26 },
    { level: 6, name: "Production System", cx: 385, cy: 55, w: 70, h: 26 },
  ];

  const activePlatform = platforms.find((p) => p.level === activeLevel);

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 rounded-2xl border border-white/[0.08] bg-[#070C12]/90 backdrop-blur-md shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
      <div className="w-full max-w-[460px] aspect-[16/10] relative flex items-center justify-center">
        <svg viewBox="0 0 460 280" className="w-full h-full drop-shadow-md" fill="none" aria-hidden="true">
          <defs>
            <filter id="platGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Stepped Connector Ascent Line */}
          <path
            d="M 60 230 L 125 195 L 190 160 L 255 125 L 320 90 L 385 55"
            stroke="rgba(181,225,231,0.15)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {platforms.map((p) => {
            const isActive = activeLevel === p.level;

            // Isometric diamond polygon
            const topPolygon = `
              ${p.cx},${p.cy - p.h / 2} 
              ${p.cx + p.w / 2},${p.cy} 
              ${p.cx},${p.cy + p.h / 2} 
              ${p.cx - p.w / 2},${p.cy}
            `;

            // Isometric thickness
            const frontPolygon = `
              ${p.cx - p.w / 2},${p.cy} 
              ${p.cx},${p.cy + p.h / 2} 
              ${p.cx},${p.cy + p.h / 2 + 8} 
              ${p.cx - p.w / 2},${p.cy + 8}
            `;
            const sidePolygon = `
              ${p.cx},${p.cy + p.h / 2} 
              ${p.cx + p.w / 2},${p.cy} 
              ${p.cx + p.w / 2},${p.cy + 8} 
              ${p.cx},${p.cy + p.h / 2 + 8}
            `;

            return (
              <g key={p.level} className="transition-all duration-300">
                {/* Side Faces */}
                <polygon
                  points={frontPolygon}
                  fill={isActive ? "rgba(14,35,64,0.9)" : "#05080C"}
                  stroke={isActive ? "rgba(181,225,231,0.4)" : "rgba(255,255,255,0.06)"}
                  strokeWidth="0.8"
                />
                <polygon
                  points={sidePolygon}
                  fill={isActive ? "rgba(10,24,44,0.9)" : "#030508"}
                  stroke={isActive ? "rgba(181,225,231,0.3)" : "rgba(255,255,255,0.04)"}
                  strokeWidth="0.8"
                />

                {/* Top Platform Face */}
                <polygon
                  points={topPolygon}
                  fill={isActive ? "rgba(56,189,248,0.22)" : "rgba(10,16,24,0.7)"}
                  stroke={isActive ? "#B5E1E7" : "rgba(181,225,231,0.2)"}
                  strokeWidth={isActive ? "1.8" : "1"}
                  filter={isActive ? "url(#platGlow)" : "none"}
                />

                {/* Platform Label / Marker */}
                <text
                  x={p.cx}
                  y={p.cy + 3}
                  textAnchor="middle"
                  fill={isActive ? "#F0F2ED" : "#ADBAC5"}
                  fontSize="9"
                  fontWeight={isActive ? "bold" : "normal"}
                  fontFamily="monospace"
                  opacity={isActive ? 1 : 0.6}
                >
                  0{p.level}
                </text>

                {/* Active Light Pillar */}
                {isActive && (
                  <circle cx={p.cx} cy={p.cy - p.h / 2 - 8} r="3" fill="#38BDF8" filter="url(#platGlow)" />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Caption showing currently inspected level */}
      <div className="mt-3 text-center min-h-[38px] flex flex-col justify-center">
        {activePlatform ? (
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#B5E1E7]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B5E1E7] animate-pulse" />
            <span>Level yang sedang dibaca: 0{activePlatform.level} — {activePlatform.name}</span>
          </div>
        ) : (
          <span className="text-xs font-mono text-[#ADBAC5]/60">
            Pilih salah satu tingkatan pada daftar untuk menyorot platform pembuktian.
          </span>
        )}
      </div>
    </div>
  );
}

export function ResearchMethodologySection() {
  // Phase disclosure states (independent, default: all closed)
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

  // Evidence ladder single-open state (null = all closed initially)
  const [activeLadderLevel, setActiveLadderLevel] = useState<number | null>(null);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId],
    }));
  };

  const toggleLadderLevel = (level: number) => {
    // Single-open accordion rule: opening one closes others
    setActiveLadderLevel((prev) => (prev === level ? null : level));
  };

  return (
    <section id="metode" className="py-24 sm:py-32 md:py-40 relative overflow-hidden scroll-mt-24">
      <div id="process" className="sr-only" aria-hidden="true" />

      {/* Background connecting guide line motif */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="gridCoordinates" width="160" height="160" patternUnits="userSpaceOnUse">
              <circle cx="80" cy="80" r="1" fill="#F0F2ED" />
              <line x1="75" y1="80" x2="85" y2="80" stroke="#F0F2ED" strokeWidth="0.5" />
              <line x1="80" y1="75" x2="80" y2="85" stroke="#F0F2ED" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridCoordinates)" />
        </svg>
      </div>

      <div className="max-w-[1360px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

        {/* Section Header with Staggered Entrance */}
        <LabSectionHeader
          number="04"
          label="Dari Pertanyaan Menjadi Bukti"
          title="Metodologi Sembilan Gerbang"
          description="Sebuah protokol tanpa kompromi. Klaim tidak akan pernah melampaui status verifikasi eksperimental nyata."
          className="mb-20 sm:mb-24"
        />

        {/* ── 3-Column Desktop Flow: 3 Phases & 9 Stages ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 mb-32 relative">
          
          {/* Subtle Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-6 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

          {PIPELINE_PHASES.map((phase, pIdx) => {
            const isPhaseExpanded = Boolean(expandedPhases[phase.id]);

            return (
              <div key={phase.id} className="relative z-10 flex flex-col">
                
                {/* Phase Header Node (Always Visible) */}
                <div className="flex flex-col mb-8">
                  <div className="w-12 h-12 rounded-full bg-[#070C12] border border-white/[0.1] flex items-center justify-center mb-6 relative z-10 shadow-[0_0_20px_#070C12]">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: phase.color }} />
                  </div>
                  <span className="font-mono text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: phase.color }}>
                    {phase.phaseNumber}
                  </span>
                  <h3 className="text-2xl font-normal text-[#F0F2ED] mb-3">
                    {phase.phaseTitle}
                  </h3>
                  <p className="text-sm text-[#ADBAC5] font-light leading-relaxed max-w-[300px]">
                    {phase.phaseTagline}
                  </p>
                </div>

                {/* Stages List (Always Visible: Gates & Names) */}
                <div className="space-y-6 pl-4 border-l border-white/[0.08] flex-grow">
                  {phase.stages.map((stage, sIdx) => {
                    const globalIdx = pIdx * 3 + sIdx + 1;
                    return (
                      <div key={stage.code} className="relative group">
                        {/* Sub-node connector */}
                        <div className="absolute -left-[21px] top-2 w-[9px] h-[9px] rounded-full bg-[#070C12] border border-white/20 group-hover:border-[#B5E1E7] transition-colors" />
                        
                        <div className="flex items-center gap-2 mb-1.5 font-mono text-[10px] tracking-widest uppercase text-[#ADBAC5]/60">
                          <span>Gerbang 0{globalIdx}</span>
                          <span>·</span>
                          <span className="text-[#B5E1E7]/80">{stage.code}</span>
                        </div>
                        <h4 className="text-base sm:text-lg font-medium text-[#F0F2ED]">
                          {stage.name}
                        </h4>

                        {/* Detailed summary opened via phase disclosure */}
                        <AnimatePresence>
                          {isPhaseExpanded && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="text-xs sm:text-sm text-[#ADBAC5]/80 font-light leading-relaxed mt-2 overflow-hidden"
                            >
                              {stage.summary}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Phase Disclosure Trigger */}
                <div className="pt-6 mt-6 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => togglePhase(phase.id)}
                    aria-expanded={isPhaseExpanded}
                    aria-controls={`phase-detail-${phase.id}`}
                    className="group inline-flex items-center gap-2.5 text-xs font-mono text-[#ADBAC5] hover:text-[#F0F2ED] transition-colors focus:outline-none cursor-pointer py-1"
                  >
                    <span className="w-5 h-5 rounded-full border border-white/10 bg-white/[0.02] group-hover:border-white/25 flex items-center justify-center transition-colors">
                      {isPhaseExpanded ? (
                        <Minus className="w-3 h-3 text-[#B5E1E7]" />
                      ) : (
                        <Plus className="w-3 h-3 text-[#ADBAC5] group-hover:text-[#F0F2ED]" />
                      )}
                    </span>
                    <span>{isPhaseExpanded ? "Tutup rincian gerbang" : "Lihat rincian fase"}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* ── The Evidence Ladder: List + Tiered Platform Illustration ── */}
        <div className="border-t border-white/[0.08] pt-16">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#ADBAC5]/70 uppercase tracking-widest mb-3">
                <span>Standar Validasi Empiris</span>
              </div>
              <h3 className={`${lora.className} text-3xl sm:text-4xl font-normal text-[#F0F2ED] mb-3`}>
                The Evidence Ladder
              </h3>
              <p className="text-base text-[#ADBAC5] font-light leading-relaxed max-w-xl">
                Kami membedakan secara tegas antara konsep teoretis dan sistem produksi nyata. Posisi HCFTL saat ini berada pada tahap awal pembuktian.
              </p>
            </div>
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#B5E1E7]/30 bg-[#B5E1E7]/5 text-xs font-mono text-[#B5E1E7] whitespace-nowrap shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B5E1E7] animate-pulse" />
                Posisi Saat Ini: Level 01
              </span>
            </div>
          </div>

          {/* 2-Column Balanced Layout: Accordion List (Left) + Stepped Platform Illustration (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Left Column: Level Accordion List */}
            <div className="lg:col-span-7 space-y-3" role="region" aria-label="Tingkatan Bukti Evidence Ladder">
              {EVIDENCE_LADDER.map((item) => {
                const isOpen = activeLadderLevel === item.level;
                const isCurrent = item.level === 1;

                return (
                  <div
                    key={item.level}
                    className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "bg-[#0A1018] border-[#B5E1E7]/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                        : isCurrent
                        ? "bg-white/[0.03] border-white/[0.1] hover:border-white/20"
                        : "bg-transparent border-white/[0.06] hover:border-white/15 hover:bg-white/[0.02]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleLadderLevel(item.level)}
                      aria-expanded={isOpen}
                      aria-controls={`ladder-level-${item.level}`}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none min-h-[44px]"
                    >
                      <div className="flex items-center gap-4 sm:gap-6 flex-grow">
                        <span className={`font-mono text-xs sm:text-sm font-semibold w-8 shrink-0 ${isCurrent ? "text-[#B5E1E7]" : "text-[#ADBAC5]/60"}`}>
                          0{item.level}
                        </span>
                        <span className={`text-base sm:text-lg font-medium transition-colors ${isOpen || isCurrent ? "text-[#F0F2ED]" : "text-[#ADBAC5]"}`}>
                          {item.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5E1E7] border border-[#B5E1E7]/30 px-2 py-0.5 rounded-full hidden sm:inline">
                            Fokus Aktif
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono text-[#ADBAC5]/60 hidden sm:inline">
                          {isOpen ? "Tutup detail" : "Lihat detail"}
                        </span>
                        <span className="w-6 h-6 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center transition-colors">
                          {isOpen ? (
                            <Minus className="w-3.5 h-3.5 text-[#B5E1E7]" />
                          ) : (
                            <Plus className="w-3.5 h-3.5 text-[#ADBAC5]" />
                          )}
                        </span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          id={`ladder-level-${item.level}`}
                          role="region"
                          aria-label={`Rincian Level 0${item.level} ${item.name}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28, ease: CUBIC_EASE }}
                          className="overflow-hidden border-t border-white/[0.06] bg-[#06090F]"
                        >
                          <div className="p-5 sm:p-6 pl-16 sm:pl-20 text-left">
                            <p className="text-sm sm:text-base text-[#ADBAC5] font-light leading-relaxed mb-3">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] font-mono text-[#ADBAC5]/60">
                              <span>Status Verifikasi:</span>
                              <span className={isCurrent ? "text-[#B5E1E7]" : "text-[#ADBAC5]/80"}>
                                {isCurrent ? "Tahap Aktif Riset HCFTL" : "Tahap Evaluasi Lanjutan"}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Right Column: 6 Stepped Platform Isometric Illustration */}
            <div className="lg:col-span-5 sticky top-28">
              <TieredPlatformLadderIllustration activeLevel={activeLadderLevel} />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
