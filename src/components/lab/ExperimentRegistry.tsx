"use client";

import { Lock } from "lucide-react";

export function ExperimentRegistry() {
  return (
    <section id="registry" className="py-24 md:py-40 relative bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 pb-12 border-b border-white/[0.04] gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6 font-mono text-[10px] tracking-[0.25em] text-[#7DD3FC]/60 uppercase">
              <span className="w-6 h-px bg-[#7DD3FC]/30" />
              <span>HCFTL // Section 08 — Experiment Registry</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-medium text-[#F4F7FA] tracking-tight leading-[1.05]">
              Experiment<br />Registry
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-base md:text-lg text-[#8899A6] font-light leading-relaxed mb-4">
              Buku besar eksperimen kriptografis. Tidak ada pengujian hipotesis tanpa registrasi.
            </p>
            <span className="inline-block text-[10px] font-mono text-amber-400 uppercase tracking-widest bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
              Status: Foundation Lock
            </span>
          </div>
        </div>

        {/* Vault Surface */}
        <div
          className="relative w-full rounded-3xl overflow-hidden"
          style={{
            background: "rgba(4,8,15,0.6)",
            border: "1px solid rgba(255,255,255,0.04)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {/* Ghost EXP-001 background text */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
            aria-hidden="true"
          >
            <span
              className="font-mono font-bold text-white whitespace-nowrap"
              style={{ fontSize: "clamp(80px, 15vw, 180px)", opacity: 0.025, letterSpacing: "-0.02em" }}
            >
              EXP-001
            </span>
          </div>

          {/* Scanning light sweep */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            aria-hidden="true"
            style={{ animation: "scan-sweep 12s linear infinite" }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "25%",
                background: "linear-gradient(90deg, transparent, rgba(125,211,252,0.04), transparent)",
                transform: "skewX(-15deg)",
                left: "-30%",
                animation: "inherit",
              }}
            />
          </div>
          <style>{`
            @keyframes scan-sweep {
              0% { transform: translateX(0%); }
              100% { transform: translateX(560%); }
            }
          `}</style>

          {/* Vault header */}
          <div className="relative z-10 p-8 md:p-10 border-b border-white/[0.04] font-mono">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/[0.03] text-[10px]">
              <span className="tracking-[0.25em] text-[#7DD3FC]/70 uppercase">
                HCFTL / Formal Experiment Registry
              </span>
              <span className="text-[#66717F] tracking-widest uppercase">Vault Revision: 2026.01</span>
            </div>

            {/* Registry metrics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
              {[
                { label: "Registry State", value: "Foundation Lock", accent: "text-amber-400" },
                { label: "Formal Entries", value: "000", accent: "text-[#F4F7FA]" },
                { label: "Last Authorized", value: "—", accent: "text-[#66717F]" },
                { label: "Safety Queue", value: "—", accent: "text-[#66717F]" },
                { label: "Publication Queue", value: "—", accent: "text-[#66717F]" },
              ].map((item) => (
                <div key={item.label}>
                  <span className="text-[#66717F] text-[10px] block mb-2 uppercase tracking-widest">
                    {item.label}
                  </span>
                  <span className={`font-bold tracking-widest ${item.accent}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ledger header */}
          <div className="hidden md:grid grid-cols-12 gap-6 relative z-10 px-10 py-5 border-b border-white/[0.03] text-[10px] text-[#66717F] tracking-widest uppercase font-mono">
            <div className="col-span-2">ID</div>
            <div className="col-span-4">Frontier</div>
            <div className="col-span-2">Safety</div>
            <div className="col-span-2">Evidence</div>
            <div className="col-span-2 text-right">State</div>
          </div>

          {/* Reserved row */}
          <div className="hidden md:grid grid-cols-12 gap-6 relative z-10 px-10 py-6 border-b border-white/[0.02] text-xs text-[#A2ACB9] items-center font-mono">
            <div className="col-span-2 text-[#7DD3FC] font-bold flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
              EXP-001
            </div>
            <div className="col-span-4 text-[#66717F] opacity-40 tracking-widest">───────────────</div>
            <div className="col-span-2 text-[#66717F] opacity-40 tracking-widest">───────</div>
            <div className="col-span-2 text-[#66717F] opacity-40 tracking-widest">───────</div>
            <div className="col-span-2 text-right">
              <span className="px-3 py-1.5 rounded-full border border-amber-500/20 text-amber-400 bg-amber-500/10 text-[10px] tracking-widest uppercase">
                LOCKED
              </span>
            </div>
          </div>

          {/* Cinematic empty state */}
          <div className="relative z-10 py-32 md:py-40 px-8 flex flex-col items-center justify-center text-center">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8 text-amber-400/80"
              style={{
                background: "rgba(4,8,15,0.8)",
                border: "1px solid rgba(245,158,11,0.15)",
                boxShadow: "0 0 40px rgba(245,158,11,0.08)",
              }}
            >
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium text-[#F4F7FA] mb-6 tracking-tight">
              Belum ada eksperimen yang secara<br className="hidden md:block" />
              formal diotorisasi
            </h3>

            <p className="text-base md:text-lg text-[#8899A6] max-w-2xl leading-relaxed font-light mb-12">
              Fondasi institusi, piagam riset, batasan keselamatan, dan kriteria verifikasi harus diselesaikan secara formal sebelum registri dibuka. Seluruh eksperimen masa depan akan diindeks secara permanen di sini dengan telemetri yang dapat direproduksi.
            </p>

            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-[#03050A] border border-white/[0.04] text-[10px] md:text-[11px] text-[#66717F] uppercase tracking-widest font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400/60" style={{ boxShadow: "0 0 8px rgba(245,158,11,0.5)" }} />
              <span>Foundation Lock // HCFTL-2026</span>
              <span className="hidden sm:inline w-px h-4 bg-white/10" />
              <span className="hidden sm:inline">Zero Premature Disclosure</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
