"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Lora } from "next/font/google";
import { motion } from "framer-motion";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

export function LabFounder() {
  return (
    <>
      {/* Founder Note — editorial, above the cinematic close */}
      <section className="py-24 md:py-32 relative bg-transparent">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-16 border-b border-white/[0.04]">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-8 font-mono text-[10px] tracking-[0.25em] text-[#7DD3FC]/60 uppercase">
                <span className="w-6 h-px bg-[#7DD3FC]/30" />
                <span>Institution // Founder Note</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-medium text-[#F4F7FA] tracking-tight leading-snug mb-8">
                HCFTL saat ini adalah inisiatif riset independen yang dipimpin oleh founder.
              </h3>
              <div className="pt-6 border-t border-white/[0.04]">
                <div className="text-xl font-medium text-[#F4F7FA] mb-1">Daffa Dhiyaulhaq Khadafi</div>
                <div className="text-[10px] font-mono text-[#7DD3FC]/70 tracking-[0.2em] uppercase mb-6">
                  Founder & Research Director
                </div>
                <p className="text-base md:text-lg text-[#8899A6] font-light leading-relaxed max-w-lg">
                  AI-Assisted Product Engineer yang mengeksplorasi bagaimana tim kecil dengan augmentasi AI dapat berpartisipasi secara bermakna dalam pengembangan teknologi frontier — beroperasi dengan keketatan institusional yang biasanya hanya dimiliki oleh organisasi riset besar.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <Link
                href="/"
                className="group inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.18] transition-all text-sm font-medium text-[#F4F7FA] tracking-wide"
              >
                <ArrowLeft className="w-4 h-4 text-[#7DD3FC] group-hover:-translate-x-1 transition-transform" />
                Kembali ke Beranda Personal
              </Link>
            </div>
          </div>

          {/* Institutional metadata */}
          <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[10px] text-[#66717F] tracking-widest uppercase">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <span className="text-[#A2ACB9]">HCFTL / Human Centered Frontier Technology Lab</span>
              <span className="hidden md:inline text-white/10">|</span>
              <span>Est. 2026</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                <span className="text-[#4ADE80]">Signal Core Active</span>
              </span>
              <span className="text-white/10">|</span>
              <span>STATION ID: HCFTL-JKT-HQ-01</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Closing Payoff */}
      <section
        className="relative min-h-[70vh] flex flex-col items-center justify-center py-24 overflow-hidden"
      >
        {/* Soft white/cyan central halo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 50% 60% at 50% 55%, rgba(186,230,253,0.05) 0%, transparent 60%),
              radial-gradient(ellipse 30% 40% at 50% 50%, rgba(125,211,252,0.04) 0%, transparent 50%)
            `,
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

          {/* Primary statement */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <blockquote
              className={`${lora.className} text-[40px] sm:text-[52px] md:text-[64px] lg:text-[72px] font-medium text-[#F4F7FA] leading-[1.1] tracking-tight mb-0`}
              style={{ letterSpacing: "-0.025em" }}
            >
              &ldquo;Masa depan teknologi tidak seharusnya berjalan meninggalkan manusia.&rdquo;
            </blockquote>
          </motion.div>

          {/* Secondary statement — delayed */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <p
              className={`${lora.className} text-[32px] sm:text-[40px] md:text-[52px] font-medium text-[#7DD3FC] leading-tight`}
              style={{ letterSpacing: "-0.02em" }}
            >
              &ldquo;Ia harus tumbuh bersama manusia.&rdquo;
            </p>
          </motion.div>

          {/* Institutional identity — very minimal */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-20 flex flex-col items-center gap-2"
          >
            <div className="w-px h-12 bg-gradient-to-b from-[#7DD3FC]/30 to-transparent mb-6" />
            <div className="text-xl font-medium text-[#F4F7FA] tracking-wide">HCFTL</div>
            <div className="text-[10px] font-mono text-[#66717F] tracking-[0.3em] uppercase">
              Human Centered Frontier Technology Lab
            </div>
            <div className="text-[10px] font-mono text-[#66717F]/60 tracking-[0.2em] mt-1">
              EST. 2026
            </div>
          </motion.div>

        </div>

        {/* Copyright line — very quiet */}
        <div className="absolute bottom-6 left-0 right-0 text-center text-[10px] font-mono text-[#66717F]/40 tracking-widest">
          © 2026 HCFTL. Non-commercial scientific citation permitted with attribution.
        </div>
      </section>
    </>
  );
}
