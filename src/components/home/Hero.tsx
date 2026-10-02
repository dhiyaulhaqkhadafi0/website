"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles, Terminal, Layers, Cpu, Activity } from "lucide-react";

interface HeroProps {
  onOpenInquiry: () => void;
}

export function Hero({ onOpenInquiry }: HeroProps) {
  const scrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("selected-work");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute -top-10 right-10 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column: Heading, Subtitle & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Micro Status / Availability Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md mb-6 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[11px] font-mono tracking-wider text-emerald-300">
              Available for selected freelance & product collaborations
            </span>
          </motion.div>

          {/* Primary Statement */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[62px] font-black tracking-tight text-white leading-[1.08] mb-6"
          >
            I build digital products,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300">
              AI systems
            </span>{" "}
            & independent internet businesses.
          </motion.h1>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal max-w-xl mb-10"
          >
            <strong className="text-white font-semibold">AI-Assisted Product Engineer</strong>{" "}
            building products from idea, strategy, and design to production-ready software.
          </motion.p>

          {/* Primary & Secondary Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
          >
            <button
              type="button"
              onClick={scrollToWork}
              className="w-full sm:w-auto px-7 py-3.5 bg-white text-black hover:bg-slate-100 rounded-xl font-bold text-sm transition-all duration-200 shadow-[0_4px_20px_rgba(255,255,255,0.12)] hover:shadow-[0_6px_28px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>Explore My Work</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onOpenInquiry}
              className="w-full sm:w-auto px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold text-sm border border-white/15 hover:border-white/30 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Start a Project</span>
            </button>
          </motion.div>
        </div>

        {/* Right Column: Signature Builder Visual (Interactive System Architecture Canvas) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="lg:col-span-5 relative w-full"
        >
          <div className="relative rounded-3xl border border-white/10 bg-[#0c0d13]/90 backdrop-blur-xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden">
            {/* Window Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-white/50 text-[11px]">khadafi.engine // v2.0</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>ONLINE</span>
              </div>
            </div>

            {/* Architecture Node 1: Product Core */}
            <div className="space-y-3.5 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="flex items-center gap-2 text-white font-semibold">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    01. Product Engineering
                  </span>
                  <span className="text-[10px] text-emerald-400">PRODUCTION</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Next.js 16 · Supabase RLS · Turbopack · TipTap Editor
                </p>
              </div>

              {/* Architecture Node 2: AI Workflows */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="flex items-center gap-2 text-white font-semibold">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    02. AI Inference & Context
                  </span>
                  <span className="text-[10px] text-indigo-400">OPTIMIZED</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Context Priming · Agent Pipelines · Multi-Format Repurposing
                </p>
              </div>

              {/* Architecture Node 3: Ecosystem Hub */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-teal-500/30 transition-colors">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="flex items-center gap-2 text-white font-semibold">
                    <Terminal className="w-3.5 h-3.5 text-teal-400" />
                    03. Live Ventures & Knowledge
                  </span>
                  <span className="text-[10px] text-teal-400">ACTIVE</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Chikki Studio · Freelance Hub · Digital Grimoire · Blueprint Vault
                </p>
              </div>
            </div>

            {/* Footer Terminal Metric */}
            <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between text-[10.5px] font-mono text-slate-500">
              <span>Stack: Zero-to-One Defensible</span>
              <span className="text-emerald-400">Latency &lt; 85ms</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
