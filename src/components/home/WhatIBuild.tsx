"use client";

import { motion } from "framer-motion";
import { Sparkles, Code2, Cpu, Compass, ArrowRight } from "lucide-react";
import Link from "next/link";

interface WhatIBuildProps {
  onOpenInquiry: () => void;
}

export function WhatIBuild({ onOpenInquiry }: WhatIBuildProps) {
  const capabilities = [
    {
      num: "01",
      title: "AI-Assisted Product Development",
      subtitle: "Idea → Research → PRD → Architecture → Production Launch",
      description:
        "Mengeksekusi siklus pengembangan produk secara menyeluruh. Memanfaatkan context engineering untuk memprogram coding agents membangun software dengan kecepatan tinggi tanpa mengorbankan kualitas kode.",
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      tag: "End-to-End",
    },
    {
      num: "02",
      title: "Web & MVP Development",
      subtitle: "Production-ready digital products built for scale",
      description:
        "Membangun MVP fungsional dalam hitungan hari, bukan bulan. Menggunakan stack modern (Next.js 16, Supabase, Tailwind, Cloudflare) dengan database terisolasi dan response time sub-100ms.",
      icon: <Code2 className="w-5 h-5 text-indigo-400" />,
      tag: "Speed & Reliability",
    },
    {
      num: "03",
      title: "AI Workflow & Automation",
      subtitle: "Custom agentic systems that eliminate repetitive tasks",
      description:
        "Merancang alur kerja agen AI otonom: dari context priming, prompt engineering presisi, hingga otomasi repurposing aset konten multi-format yang menghemat puluhan jam kerja per minggu.",
      icon: <Sparkles className="w-5 h-5 text-teal-400" />,
      tag: "System Automation",
    },
    {
      num: "04",
      title: "Product & UX Strategy",
      subtitle: "Turn ambiguous problems into defensible solutions",
      description:
        "Membantu founder dan kreator mengisolasi rasa sakit pengguna yang sesungguhnya. Menyusun PRD 1-pager siap bangun, menentukan batasan ruang lingkup, dan merancang unit ekonomi produk yang sehat.",
      icon: <Compass className="w-5 h-5 text-amber-400" />,
      tag: "Strategic Scoping",
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 bg-[#050609] border-t border-white/5">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold mb-2 block">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              What I Build
            </h2>
            <p className="text-base text-slate-400 mt-3 font-normal leading-relaxed">
              Kombinasi antara intuisi produk, context engineering, dan eksekusi teknis modern untuk meluncurkan produk digital yang defensible.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenInquiry}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <span>Mulai Kolaborasi Proyek</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {capabilities.map((cap, idx) => (
            <motion.div
              key={cap.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-7 sm:p-8 rounded-3xl bg-[#0b0c12] border border-white/10 hover:border-white/25 transition-all duration-300 relative group overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {cap.num} · {cap.tag}
                  </span>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    {cap.icon}
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {cap.title}
                </h3>
                <p className="text-xs font-mono text-emerald-400/90 mb-4">
                  {cap.subtitle}
                </p>
                <p className="text-sm text-slate-400 leading-relaxed font-normal">
                  {cap.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                <Link
                  href="/about#jasa"
                  className="text-xs font-mono uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Pelajari Pendekatan</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
