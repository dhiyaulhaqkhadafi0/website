"use client";

import { Sparkles, ArrowDown } from "lucide-react";

interface FinalCTAProps {
  onOpenInquiry: () => void;
}

export function FinalCTA({ onOpenInquiry }: FinalCTAProps) {
  const scrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("selected-work");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-28 px-4 sm:px-6 bg-[#040407] border-t border-white/5 overflow-hidden">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold mb-3 block">
          Ready to Build
        </span>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.08] mb-6">
          Have something worth building?
        </h2>

        <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-xl mx-auto mb-10">
          Let&apos;s turn your idea into a working digital product. Terbuka untuk selected freelance projects, MVP development sprints, dan konsultasi produk AI.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onOpenInquiry}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-slate-100 rounded-xl font-bold text-sm transition-all duration-200 shadow-[0_4px_24px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_32px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Start a Project</span>
          </button>

          <button
            type="button"
            onClick={scrollToWork}
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold text-sm border border-white/15 hover:border-white/30 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Explore My Work</span>
            <ArrowDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
