"use client";

import { motion } from "framer-motion";
import { Briefcase, Users, ArrowRight, MessageSquare, Sparkles, Mail, Compass } from "lucide-react";
import Link from "next/link";

interface FreelanceDualCTAProps {
  onOpenInquiry: (service?: string) => void;
}

export function FreelanceDualCTA({ onOpenInquiry }: FreelanceDualCTAProps) {
  return (
    <section id="cta" className="py-20 md:py-28 relative border-t border-white/[0.08] bg-[#020204] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[400px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[400px] bg-brand-accent/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/60">
            <span>10 // TWO CONVERGING PATHS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Pilih Jalur Kolaborasi
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            Halaman ini didesain untuk dua audiens utama: klien yang membutuhkan kecepatan eksekusi produk, dan sesama builder yang sedang merintis jalur kemandirian.
          </p>
        </div>

        {/* Dual Split Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

          {/* Card A: Potential Client */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-500/[0.08] via-white/[0.02] to-transparent border border-emerald-500/25 flex flex-col justify-between relative group hover:border-emerald-500/40 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>

              <div className="inline-block text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-2">
                PATH 01 // CLIENTS & FOUNDERS
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight">
                Building something?
              </h3>

              <p className="text-sm text-white/70 leading-relaxed mb-6">
                Kalau kamu punya ide produk menarik, butuh prototipe MVP berkecepatan tinggi, atau ingin merombak landing page dengan sistem AI modern—mari berkolaborasi.
              </p>

              <div className="space-y-2 mb-8 text-xs text-white/60">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Komunikasi asinkron & sprint mingguan transparan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Bebas risiko over-engineering & fokus pada delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Fixed-price milestones tanpa biaya tak terduga</span>
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => onOpenInquiry()}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Work With Me</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[11px] text-white/40 mt-3">
                Discovery call 15 menit santai tanpa kewajiban apa pun.
              </p>
            </div>
          </motion.div>

          {/* Card B: Fellow Freelancer / Community */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-brand-accent/[0.08] via-white/[0.02] to-transparent border border-brand-accent/25 flex flex-col justify-between relative group hover:border-brand-accent/40 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 text-brand-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>

              <div className="inline-block text-[11px] font-mono uppercase tracking-wider text-brand-accent font-semibold mb-2">
                PATH 02 // BUILDERS & NOMADS
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight">
                On the same journey?
              </h3>

              <p className="text-sm text-white/70 leading-relaxed mb-6">
                Kalau kamu juga sedang membangun karier freelance, belajar vibe coding, atau mengejar impian bekerja remote dari mana saja, jangan berjalan sendirian.
              </p>

              <div className="space-y-2 mb-8 text-xs text-white/60">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                  <span>Update mingguan seputar tools AI & sistem kerja remote</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                  <span>Wadah diskusi terbuka dengan sesama kreator Indonesia</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                  <span>Akses template gratis & studi kasus eksperimen nyata</span>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/komunitas"
                className="w-full py-4 px-6 rounded-2xl bg-brand-accent hover:bg-brand-accent/90 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(129,140,248,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Follow My Journey & Gabung Komunitas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-center text-[11px] text-white/40 mt-3">
                100% gratis • Berbagi insight tanpa basa-basi teori kosong.
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
