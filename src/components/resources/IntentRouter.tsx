"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Terminal, PenTool, ShieldCheck, ArrowRight, ChevronDown, CheckCircle2 } from "lucide-react";
import { INTENT_PATHS } from "@/content/resources-data";
import { ResourceTopic } from "@/lib/resource-types";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

interface IntentRouterProps {
  activeTopic: ResourceTopic;
  onSelectIntent: (topic: ResourceTopic) => void;
}

const BOX_THEMES = [
  {
    topic: "product",
    icon: Rocket,
    tag: "PRODUCT ROADMAP",
    borderDefault: "border-sky-500/25 hover:border-sky-400/60",
    borderActive: "border-sky-400 shadow-[0_0_35px_rgba(56,189,248,0.25)] ring-1 ring-sky-400/50",
    bgGradient: "bg-gradient-to-b from-[#111A2C] via-[#0E1624] to-[#0A0F1A]",
    accentGlow: "rgba(56, 189, 248, 0.18)",
    iconBg: "bg-sky-500/15 text-sky-300 group-hover:bg-sky-500/30",
    badgeColor: "text-sky-300 bg-sky-500/10 border-sky-500/30",
    included: ["PRD 1-Pager Master", "AI Context Primer", "MVP Milestone Matrix"],
  },
  {
    topic: "vibe-coding",
    icon: Terminal,
    tag: "ENGINEERING PLAYBOOK",
    borderDefault: "border-emerald-500/25 hover:border-emerald-400/60",
    borderActive: "border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/50",
    bgGradient: "bg-gradient-to-b from-[#0B1E19] via-[#091814] to-[#06110E]",
    accentGlow: "rgba(16, 185, 129, 0.18)",
    iconBg: "bg-emerald-500/15 text-emerald-300 group-hover:bg-emerald-500/30",
    badgeColor: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    included: ["7 Golden Rules AI Coding", "AGENTS.md Anti-Hallucination", "Atomic Diff Discipline"],
  },
  {
    topic: "content",
    icon: PenTool,
    tag: "DISTRIBUTION OS",
    borderDefault: "border-purple-500/25 hover:border-purple-400/60",
    borderActive: "border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.25)] ring-1 ring-purple-400/50",
    bgGradient: "bg-gradient-to-b from-[#1B122E] via-[#150E24] to-[#0E0919]",
    accentGlow: "rgba(168, 85, 247, 0.18)",
    iconBg: "bg-purple-500/15 text-purple-300 group-hover:bg-purple-500/30",
    badgeColor: "text-purple-300 bg-purple-500/10 border-purple-500/30",
    included: ["1 Idea to 20 Micro-Assets", "Notion Content Pipeline", "Authority Hook Vault"],
  },
  {
    topic: "business",
    icon: ShieldCheck,
    tag: "AUTHORITY & ASSETS",
    borderDefault: "border-amber-500/25 hover:border-amber-400/60",
    borderActive: "border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50",
    bgGradient: "bg-gradient-to-b from-[#24180A] via-[#1B1207] to-[#120B04]",
    accentGlow: "rgba(245, 158, 11, 0.18)",
    iconBg: "bg-amber-500/15 text-amber-300 group-hover:bg-amber-500/30",
    badgeColor: "text-amber-300 bg-amber-500/10 border-amber-500/30",
    included: ["Personal Brand Positioning", "Creator-to-Founder Ladder", "Offer Pricing Architecture"],
  },
];

export function IntentRouter({
  activeTopic,
  onSelectIntent,
}: IntentRouterProps) {
  const [expandedBox, setExpandedBox] = useState<string | null>(null);

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedBox(prev => prev === id ? null : id);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <div className="relative z-10 p-6 sm:p-10 rounded-3xl bg-[#0E121D]/90 border border-[#232B3E] backdrop-blur-2xl shadow-[0_12px_45px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Subtle decorative edge lights */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-sky-500/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-purple-500/[0.08] rounded-full blur-3xl pointer-events-none" />

        {/* Expressive Editorial Heading */}
        <div className="mb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-sky-400 block mb-1">
            Start Here
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Bingung mulai dari mana?{" "}
            <span className={`${lora.className} italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-200 to-slate-200`}>
              Pilih fokus kebutuhanmu:
            </span>
          </h2>
        </div>

        {/* Small separated hint - clean & isolated */}
        <div className="mb-8 pb-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>Petunjuk: Setiap kotak membawa arsitektur dan sistem yang siap diaplikasikan langsung.</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 hidden md:block">
            Pilih jalur di bawah
          </span>
        </div>

        {/* 4 Distinct Dimensional Character Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INTENT_PATHS.map((intent, idx) => {
            const theme = BOX_THEMES[idx % BOX_THEMES.length];
            const Icon = theme.icon;
            const isSelected = activeTopic === intent.topic;
            const isExpanded = expandedBox === intent.id;

            return (
              <motion.div
                key={intent.id}
                onClick={() => onSelectIntent(intent.topic)}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.25 }}
                className={`text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300 relative group cursor-pointer flex flex-col justify-between overflow-hidden backdrop-blur-xl ${
                  theme.bgGradient
                } ${isSelected ? theme.borderActive : theme.borderDefault}`}
                style={{
                  boxShadow: isSelected
                    ? `0 12px 35px ${theme.accentGlow}`
                    : `0 4px 20px rgba(0,0,0,0.3)`,
                }}
              >
                {/* Glow aura inside box */}
                <div
                  className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: theme.accentGlow }}
                />

                <div>
                  {/* Top metadata pill & status dot */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider border uppercase ${theme.badgeColor}`}>
                      {theme.tag}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono ${
                      isSelected ? "text-emerald-300 font-bold" : "text-slate-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                      {isSelected ? "AKTIF" : `TRACK 0${idx + 1}`}
                    </span>
                  </div>

                  {/* Icon with bespoke theme */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 transition-transform group-hover:scale-105 ${theme.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors leading-snug">
                    {intent.label}
                  </h3>

                  <p className="mt-2 text-xs text-slate-300/80 leading-relaxed font-light">
                    {intent.description}
                  </p>
                </div>

                {/* Collapsible preview peek ("Bisa buka tutup") */}
                <div className="mt-6 pt-3 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={(e) => toggleExpand(e, intent.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
                    >
                      <span>{isExpanded ? "Tutup Inti" : "Lihat Inti"}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>

                    <span className={`inline-flex items-center gap-1 font-semibold text-xs transition-transform ${
                      isSelected ? "text-white" : "text-slate-300 group-hover:text-white group-hover:translate-x-1"
                    }`}>
                      <span>{isSelected ? "Terpilih" : "Pilih Jalur"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 pt-3 border-t border-white/5 space-y-1.5 overflow-hidden"
                      >
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                          Termasuk dalam jalur ini:
                        </span>
                        {theme.included.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-1.5 text-[11px] text-slate-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="line-clamp-1">{item}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
