"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Lora } from "next/font/google";
import { AUTONOMY_LEVELS } from "@/lib/hcftl";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

export function AutonomyScale() {
  const horizonRef = useRef<HTMLDivElement>(null);
  const isHorizonInView = useInView(horizonRef, { once: true, margin: "-20%" });

  const defaultEnvelope = AUTONOMY_LEVELS.filter((lvl) =>
    ["A0", "A1", "A2", "A3"].includes(lvl.code)
  );
  const elevatedReview = AUTONOMY_LEVELS.find((lvl) => lvl.code === "A4")!;
  const outsideTarget = AUTONOMY_LEVELS.find((lvl) => lvl.code === "A5")!;

  return (
    <section className="py-24 md:py-40 relative bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 pb-12 border-b border-white/[0.04] gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6 font-mono text-[10px] tracking-[0.25em] text-[#7DD3FC]/60 uppercase">
              <span className="w-6 h-px bg-[#7DD3FC]/30" />
              <span>HCFTL // Section 07B — Autonomy Scale</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-medium text-[#F4F7FA] tracking-tight leading-[1.05]">
              Skala Otonomi
            </h2>
          </div>
          <p className="max-w-sm text-base md:text-lg text-[#8899A6] font-light leading-relaxed">
            Otonomi dilacak secara terpisah dari kecerdasan. Agensi sistem tidak boleh lepas dari tata kelola manusia.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">

          {/* DEFAULT RESEARCH ENVELOPE — A0 to A3 */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-12 text-[10px] font-mono text-[#4ADE80] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
              <span>Zona Riset Utama — A0 → A3</span>
            </div>

            <div className="relative pl-8 md:pl-10">
              {/* Vertical guide line */}
              <div className="absolute left-2.5 md:left-3.5 top-6 bottom-6 w-px bg-gradient-to-b from-[#4ADE80]/50 via-[#4ADE80]/20 to-[#4ADE80]/10" />

              <div className="space-y-16">
                {defaultEnvelope.map((lvl) => (
                  <div key={lvl.code} className="relative group flex flex-col md:flex-row md:items-start gap-6 md:gap-12">
                    {/* Anchor node */}
                    <div className="absolute -left-[30px] md:-left-[38px] top-1.5 w-5 h-5 rounded-full bg-[#03050A] border border-[#4ADE80]/40 flex items-center justify-center group-hover:border-[#4ADE80] transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]/60 group-hover:bg-[#4ADE80] transition-colors" />
                    </div>

                    <div className="w-16 shrink-0 pt-1">
                      <span className="text-2xl font-mono font-medium text-[#4ADE80]/80 group-hover:text-[#4ADE80] transition-colors">
                        {lvl.code}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-2xl md:text-3xl font-medium text-[#F4F7FA] mb-3 leading-tight">
                        {lvl.name}
                      </h4>
                      <p className="text-base md:text-lg text-[#8899A6] font-light leading-relaxed mb-3 max-w-xl">
                        {lvl.description}
                      </p>
                      <span className="text-[10px] font-mono text-[#66717F] uppercase tracking-widest">
                        {lvl.postureLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── HUMAN AUTHORITY HORIZON ───────────────────────────────── */}
          <div ref={horizonRef} className="relative py-20">

            {/* Ambient glow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isHorizonInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(245,158,11,0.08) 0%, transparent 70%)",
              }}
            />

            {/* The Horizon Line */}
            <div className="relative">
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={isHorizonInView ? { scaleX: 1, opacity: 1 } : {}}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-px origin-left"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.6) 20%, rgba(245,158,11,0.8) 50%, rgba(245,158,11,0.6) 80%, transparent 100%)",
                  boxShadow: "0 0 20px rgba(245,158,11,0.3)",
                }}
              />

              {/* Horizon label */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={isHorizonInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
              >
                <span className="text-[10px] font-mono tracking-[0.3em] text-amber-400 uppercase">
                  Human Authority Horizon
                </span>
                <span className="block text-[9px] font-mono text-amber-400/60 mt-1 tracking-widest">
                  Batas Otoritas Manusia
                </span>
              </motion.div>
            </div>

            {/* The Signature Statement */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isHorizonInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-20 text-center"
            >
              <blockquote
                className={`${lora.className} text-[32px] sm:text-[42px] md:text-[52px] font-medium text-[#F4F7FA] leading-[1.15] tracking-tight`}
              >
                &ldquo;Otonomi tidak boleh menghapus<br className="hidden md:block" />
                akuntabilitas manusia.&rdquo;
              </blockquote>
            </motion.div>
          </div>

          {/* ELEVATED REVIEW — A4 */}
          <div className="mt-16 mb-16 relative pl-8 md:pl-10">
            <div className="absolute left-2.5 md:left-3.5 top-4 h-24 w-px bg-gradient-to-b from-amber-500/30 to-amber-500/10" />
            <div className="absolute -left-[30px] md:-left-[38px] top-1.5 w-5 h-5 rounded-full bg-[#03050A] border border-amber-500/50 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
            </div>

            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12">
              <div className="w-16 shrink-0 pt-1">
                <span className="text-2xl font-mono font-medium text-amber-400/80">{elevatedReview.code}</span>
              </div>
              <div>
                <h4 className="text-2xl md:text-3xl font-medium text-[#F4F7FA] mb-3">{elevatedReview.name}</h4>
                <p className="text-base md:text-lg text-[#8899A6] font-light leading-relaxed mb-3 max-w-xl">
                  {elevatedReview.description}
                </p>
                <span className="inline-block text-[10px] font-mono px-4 py-1.5 rounded-full border border-amber-500/20 text-amber-400 uppercase tracking-widest">
                  {elevatedReview.postureLabel}
                </span>
              </div>
            </div>
          </div>

          {/* OUTSIDE DEFAULT TARGET — A5 */}
          <div className="relative pl-8 md:pl-10 opacity-60">
            <div className="absolute -left-[30px] md:-left-[38px] top-1.5 w-5 h-5 rounded-full bg-[#03050A] border border-red-500/30 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400/40" />
            </div>

            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12">
              <div className="w-16 shrink-0 pt-1">
                <span className="text-2xl font-mono font-medium text-red-400/70">{outsideTarget.code}</span>
              </div>
              <div>
                <h4 className="text-2xl md:text-3xl font-medium text-[#F4F7FA] mb-3">{outsideTarget.name}</h4>
                <p className="text-base md:text-lg text-[#8899A6] font-light leading-relaxed mb-3 max-w-xl">
                  {outsideTarget.description}
                </p>
                <span className="inline-block text-[10px] font-mono px-4 py-1.5 rounded-full border border-red-500/20 text-red-400 uppercase tracking-widest">
                  {outsideTarget.postureLabel}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
