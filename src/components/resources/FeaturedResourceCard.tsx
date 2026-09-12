"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Terminal, Sparkles, Layers, Cpu, Code2 } from "lucide-react";
import { ResourceItem } from "@/lib/resource-types";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

interface FeaturedResourceCardProps {
  resource: ResourceItem;
}

export function FeaturedResourceCard({ resource }: FeaturedResourceCardProps) {
  const [activeTab, setActiveTab] = useState<"spec" | "prompt" | "gate">("spec");

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Background Atmosphere - Distinct deep twilight indigo & cyan glow */}
      <div className="absolute -top-10 left-1/3 w-[600px] h-[300px] bg-gradient-to-r from-sky-500/15 via-indigo-600/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-[#0B1324]/90 via-[#070D1A]/85 to-[#040810]/95 border border-sky-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden group backdrop-blur-2xl"
      >
        {/* Subtle decorative glowing corner accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Narrative Pitch & Value */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/40 text-xs font-mono tracking-wider text-sky-300 uppercase shadow-inner">
                <Layers className="w-3.5 h-3.5 text-sky-300" />
                Featured Signature System
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">
                {resource.readTimeOrEffort}
              </span>
              {resource.stats?.usersOrDownloads && (
                <span className="text-xs font-mono text-sky-200/60 hidden sm:inline">
                  • {resource.stats.usersOrDownloads}
                </span>
              )}
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              AI Product Blueprint &{" "}
              <span className={`${lora.className} italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-indigo-200 to-white`}>
                PRD Engine
              </span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-white/70 font-light leading-relaxed">
              {resource.tagline}
            </p>

            {/* Key Deliverables Chips */}
            <div className="mt-6 space-y-2.5 w-full">
              <span className="text-xs font-mono uppercase tracking-wider text-sky-400/80 block">
                Deliverables Siap Pakai:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {resource.whatYouGet.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-white/85 font-normal"
                  >
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons with alive hover physics */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={`/resources/${resource.slug}`}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-black hover:bg-slate-200 font-bold text-sm transition-all duration-200 shadow-[0_4px_25px_rgba(255,255,255,0.2)] hover:shadow-[0_6px_30px_rgba(255,255,255,0.35)] group/btn hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Buka Blueprint Lengkap</span>
                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </Link>

              {resource.actionUrl && (
                <a
                  href={resource.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40 text-white/80 hover:text-white text-sm font-medium transition-all"
                >
                  <span>{resource.actionLabel}</span>
                  <ArrowUpRight className="w-4 h-4 text-white/50" />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Interactive Blueprint Simulator */}
          <div className="lg:col-span-5 w-full">
            <div className="p-5 rounded-2xl bg-[#060A12]/95 border border-sky-500/25 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              {/* Simulator Tabs (Bisa ganti preview) */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-white/50">blueprint.spec.ts</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono">
                  <button
                    onClick={() => setActiveTab("spec")}
                    className={`px-2 py-0.5 rounded transition-colors ${activeTab === "spec" ? "bg-sky-500/30 text-sky-200" : "text-white/40 hover:text-white"}`}
                  >
                    Spec
                  </button>
                  <button
                    onClick={() => setActiveTab("prompt")}
                    className={`px-2 py-0.5 rounded transition-colors ${activeTab === "prompt" ? "bg-indigo-500/30 text-indigo-200" : "text-white/40 hover:text-white"}`}
                  >
                    Prompt
                  </button>
                  <button
                    onClick={() => setActiveTab("gate")}
                    className={`px-2 py-0.5 rounded transition-colors ${activeTab === "gate" ? "bg-emerald-500/30 text-emerald-200" : "text-white/40 hover:text-white"}`}
                  >
                    Gate
                  </button>
                </div>
              </div>

              {/* Dynamic Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === "spec" && (
                  <motion.div
                    key="spec"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="space-y-2.5 font-mono text-xs"
                  >
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="flex items-center justify-between text-white/90 font-medium">
                        <span className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-sky-400" />
                          01. Problem Space Isolation
                        </span>
                        <span className="text-[10px] text-emerald-400">PASSED</span>
                      </div>
                      <p className="mt-1 text-[11px] text-white/50 font-sans">
                        Fokus pada 1 core job-to-be-done tanpa scope creep artifisial.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="flex items-center justify-between text-white/90 font-medium">
                        <span className="flex items-center gap-2">
                          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                          02. AI Architecture Mapping
                        </span>
                        <span className="text-[10px] text-sky-400">OPTIMIZED</span>
                      </div>
                      <p className="mt-1 text-[11px] text-white/50 font-sans">
                        Pemisahan state deterministik vs generatif berbasis token.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="flex items-center justify-between text-white/90 font-medium">
                        <span className="flex items-center gap-2">
                          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                          03. 3-Day MVP Release Gate
                        </span>
                        <span className="text-[10px] text-amber-400">VERIFIED</span>
                      </div>
                      <p className="mt-1 text-[11px] text-white/50 font-sans">
                        Acceptance testing matrix siap uji dengan pengguna awal.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "prompt" && (
                  <motion.div
                    key="prompt"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="p-3.5 rounded-xl bg-black/50 border border-indigo-500/20 text-xs font-mono text-indigo-200/90 leading-relaxed overflow-x-auto"
                  >
                    <div className="text-white/40 mb-1.5">// Context Priming for Cursor/Claude</div>
                    <span className="text-sky-300">system_role</span>: &quot;Principal Architect&quot;;<br />
                    <span className="text-sky-300">stack_boundary</span>: [&quot;Next.js 16&quot;, &quot;Tailwind&quot;, &quot;Cloudflare&quot;];<br />
                    <span className="text-emerald-300">constraint</span>: &quot;Zero bundle leakage, atomic PRD step&quot;;
                  </motion.div>
                )}

                {activeTab === "gate" && (
                  <motion.div
                    key="gate"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="space-y-2 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <span>✓ Typecheck Strictness</span>
                      <span>100%</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300">
                      <span>✓ First Byte Latency</span>
                      <span>&lt; 50ms (Edge)</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer status */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40 font-mono">
                <span>Status: Production Verified</span>
                <span className="text-sky-400 font-semibold">Khadafi System IP</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
