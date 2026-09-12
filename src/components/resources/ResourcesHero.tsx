"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  CornerDownLeft,
  ShieldCheck,
  SlidersHorizontal,
  ArrowLeft,
  Layers,
  Terminal,
  FileText,
  Workflow,
  Database,
  Compass,
} from "lucide-react";

interface ResourcesHeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit?: () => void;
}

export function ResourcesHero({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}: ResourcesHeroProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const el = document.getElementById("explorer");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      onSearchSubmit?.();
    }
  };

  return (
    <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Back to Home Button - unobtrusive, elegant */}
      <div className="relative z-20 mb-8 flex items-center justify-start">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161B26]/80 hover:bg-[#1E2433] border border-white/10 hover:border-white/20 text-xs font-mono tracking-wider text-slate-300 hover:text-white transition-all group shadow-sm backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-slate-400 group-hover:text-white" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Atmospheric Multi-toned Dark Charcoal & Silver Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-slate-400/[0.07] via-sky-500/[0.04] to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-28 left-4 w-[320px] h-[320px] bg-sky-500/[0.05] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-24 right-4 w-[350px] h-[350px] bg-indigo-500/[0.04] rounded-full blur-[110px] pointer-events-none" />

      {/* Subtle Architectural Dot Grid for Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Ambient Floating Resource & Productivity Icons (Periphery of Hero) */}
      <div className="hidden lg:block pointer-events-none select-none">
        {/* Top Left: Spec & Framework */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-12 p-3.5 rounded-2xl bg-[#141824]/70 border border-white/[0.08] backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.4)] flex items-center gap-2.5"
        >
          <Layers className="w-4 h-4 text-sky-400" />
          <span className="text-[11px] font-mono text-slate-300">Frameworks</span>
        </motion.div>

        {/* Mid Left: Terminal & Vibe Coding */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-52 left-6 p-3.5 rounded-2xl bg-[#141824]/70 border border-white/[0.08] backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.4)] flex items-center gap-2.5"
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-mono text-slate-300">Playbooks</span>
        </motion.div>

        {/* Lower Left: Database & Schema */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-16 left-16 p-3 rounded-2xl bg-[#141824]/60 border border-white/[0.07] backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.3)] flex items-center gap-2"
        >
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="text-[11px] font-mono text-slate-400">Schemas</span>
        </motion.div>

        {/* Top Right: Workflow & Distribution */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-20 right-12 p-3.5 rounded-2xl bg-[#141824]/70 border border-white/[0.08] backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.4)] flex items-center gap-2.5"
        >
          <Workflow className="w-4 h-4 text-purple-400" />
          <span className="text-[11px] font-mono text-slate-300">Systems</span>
        </motion.div>

        {/* Mid Right: PRD & Documentation */}
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute top-52 right-6 p-3.5 rounded-2xl bg-[#141824]/70 border border-white/[0.08] backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.4)] flex items-center gap-2.5"
        >
          <FileText className="w-4 h-4 text-indigo-400" />
          <span className="text-[11px] font-mono text-slate-300">Templates</span>
        </motion.div>

        {/* Lower Right: Strategy & Compass */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="absolute bottom-16 right-16 p-3 rounded-2xl bg-[#141824]/60 border border-white/[0.07] backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.3)] flex items-center gap-2"
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] font-mono text-slate-400">Prompts</span>
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Main Headline in Apple Premium Silver Metallic Sheen */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.12]"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-[#ECEFF4] to-[#A0AEC0]">
            Semua Sumber Daya Gratis
          </span>
          <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-b from-white via-[#E2E8F0] to-[#718096]">
            Yang Kamu Butuhkan, di Sini.
          </span>
        </motion.h1>

        {/* Narrative Deck */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
          className="mt-6 text-base sm:text-lg md:text-xl text-slate-300/80 max-w-2xl font-light leading-relaxed"
        >
          Kumpulan framework, blueprint PRD, prompt presisi, dan sistem kerja nyata yang saya gunakan sehari-hari untuk merancang produk, konten, dan bisnis digital bersama AI.
        </motion.p>

        {/* High-Intent Search Bar with Looping Traveling Beam (Blog-style Conic Gradient) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="mt-12 w-full max-w-3xl relative group"
        >
          {/* Animated Traveling Conic Gradient Looping Border (Silver & Ice-Cyan) */}
          <div className="absolute -inset-[1.5px] rounded-2xl overflow-hidden pointer-events-none p-[1.5px]">
            <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_240deg,#38BDF8_300deg,transparent_360deg)] animate-[spin_4.5s_linear_infinite] opacity-60 group-hover:opacity-90 transition-opacity blur-[2px]" />
            <div className="absolute inset-[-50%] bg-[conic-gradient(from_180deg,transparent_0_240deg,#CBD5E1_300deg,transparent_360deg)] animate-[spin_4.5s_linear_infinite] opacity-50 group-hover:opacity-80 transition-opacity blur-[3px]" />
          </div>

          {/* Inner Search Box */}
          <div className="relative flex items-center rounded-2xl bg-[#0F131D]/95 border border-[#232A3B] shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
            <Search className="absolute left-5 w-6 h-6 text-slate-400 group-focus-within:text-sky-400 transition-colors pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Cari sistem, PRD, vibe coding, prompt pack, template..."
              className="w-full pl-14 pr-24 py-5 rounded-2xl bg-transparent text-white placeholder-slate-500 text-base sm:text-lg outline-none font-normal"
            />

            <div className="absolute right-4 flex items-center gap-2">
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Clear
                </button>
              )}

              {/* Animated Alive Enter Keycap Button */}
              <button
                onClick={() => {
                  const el = document.getElementById("explorer");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                  onSearchSubmit?.();
                }}
                title="Tekan Enter untuk mencari"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1B2232] hover:bg-[#252E44] active:scale-95 border border-white/10 hover:border-sky-400/50 text-slate-300 hover:text-white transition-all shadow-md group/key"
              >
                <CornerDownLeft className="w-4 h-4 text-sky-400 group-hover/key:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Clean Indonesian Badges with Professional Icons (No Sparkles) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400 font-mono"
        >
          <span className="flex items-center gap-2 text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Akses Gratis</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          <span className="flex items-center gap-2 text-slate-300">
            <SlidersHorizontal className="w-4 h-4 text-sky-400" />
            <span>Dikurasi Dengan Khusus</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
