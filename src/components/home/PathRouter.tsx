"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowDown, Sparkles, BookOpen, Compass } from "lucide-react";

interface PathRouterProps {
  onOpenInquiry: () => void;
}

export function PathRouter({ onOpenInquiry }: PathRouterProps) {
  const scrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("selected-work");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 border-t border-white/5 bg-[#07080c]">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold mb-2 block">
            Navigation Intent
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            What brings you here?
          </h2>
          <p className="text-base text-slate-400 leading-relaxed font-normal">
            Pilih jalur eksplorasi yang paling relevan dengan tujuan Anda. Halaman ini berfungsi sebagai router ke seluruh ekosistem bisnis digital saya.
          </p>
        </div>

        {/* 3 Main Path Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Path 1: Work With Me */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="group relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-[#0e0f16] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-emerald-500/15 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-xs font-bold tracking-widest text-emerald-400 uppercase">
                  Path 01
                </span>
                <span className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                Work With Me
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                Punya ide proyek atau butuh percepatan produk? Bangun MVP siap rilis, arsitektur AI, dan sistem web berkecepatan tinggi bersama saya.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-4 border-t border-white/5">
              <Link
                href="/about#jasa"
                className="inline-flex items-center justify-between text-sm font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={onOpenInquiry}
                className="text-left text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Atau langsung mulai konsultasi proyek →
              </button>
            </div>
          </motion.div>

          {/* Path 2: Learn */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-[#0e0f16] border border-white/10 hover:border-indigo-500/40 transition-all duration-300 shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-indigo-500/15 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-xs font-bold tracking-widest text-indigo-400 uppercase">
                  Path 02
                </span>
                <span className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                Learn
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                Pelajari sistem yang saya gunakan: blueprint PRD, panduan taktis vibe coding, metodologi arsitektur produk, dan prompt engineering presisi.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5">
              <Link
                href="/resources"
                className="inline-flex items-center justify-between w-full text-sm font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform"
              >
                <span>Browse Resources</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Path 3: Explore */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-[#0e0f16] border border-white/10 hover:border-teal-500/40 transition-all duration-300 shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-teal-500/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-teal-500/15 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-xs font-bold tracking-widest text-teal-400 uppercase">
                  Path 03
                </span>
                <span className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                Explore
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                Lihat langsung produk live, platform penulisan Chikki Studio, direktori kerja mandiri global, dan catatan riwayat rilis sistem.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={scrollToWork}
                className="inline-flex items-center justify-between w-full text-sm font-semibold text-teal-400 group-hover:translate-x-1 transition-transform text-left"
              >
                <span>Explore My Work</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
