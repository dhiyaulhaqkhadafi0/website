"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Box, FileText, BookOpen } from "lucide-react";

export function ProductsEcosystem() {
  const products = [
    {
      title: "Chikki Studio",
      category: "Web Application & Venture",
      description:
        "Platform penulisan bebas distraksi dengan dukungan TipTap WYSIWYG, integrasi Supabase, dan engine AI repurposing untuk kreator dan penulis independen.",
      status: "Live Product MVP",
      link: null,
      actionText: "Buka Chikki Studio ↗",
      icon: <Box className="w-5 h-5 text-indigo-400" />,
      accent: "from-indigo-500/10 to-transparent",
    },
    {
      title: "AI Product Blueprint & PRD Engine",
      category: "Digital Product / Template",
      description:
        "Format spesifikasi PRD AI-native untuk coding agent (Claude, Cursor, Codex), feature prioritization matrix, dan acceptance criteria siap pakai dalam Notion.",
      status: "1.2k+ Builders",
      link: "/resources/ai-product-blueprint",
      actionText: "Akses Blueprint ↗",
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      accent: "from-emerald-500/10 to-transparent",
    },
    {
      title: "Vibe Coding Field Guide",
      category: "Tactical Playbook & Guide",
      description:
        "Panduan taktis membangun software produksi bersama AI coding assistants: aturan interaksi, context injection, mitigasi halusinasi, dan kontrol git hygiene.",
      status: "Most Popular",
      link: "/resources/vibe-coding-field-guide",
      actionText: "Baca Field Guide ↗",
      icon: <BookOpen className="w-5 h-5 text-teal-400" />,
      accent: "from-teal-500/10 to-transparent",
    },
  ];

  return (
    <section id="produk" className="relative py-24 px-4 sm:px-6 bg-[#05060a] border-t border-white/5 scroll-mt-24">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold mb-2 block">
              Product Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Things I&apos;m Building
            </h2>
            <p className="text-base text-slate-400 mt-3 font-normal leading-relaxed">
              Ekosistem aplikasi mandiri, blueprint sistem, dan produk digital yang telah dirilis dan dapat digunakan langsung oleh para builder.
            </p>
          </div>

          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
          >
            <span>Katalog Sumber Daya</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </Link>
        </div>

        {/* 3 Real Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {products.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-7 sm:p-8 rounded-3xl bg-[#0c0d13] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden bg-gradient-to-b ${item.accent}`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded bg-white/5 border border-white/10 text-emerald-300">
                    {item.status}
                  </span>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    {item.icon}
                  </div>
                </div>

                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-2">
                  {item.category}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal mb-8">
                  {item.description}
                </p>
              </div>

              <div className="pt-5 border-t border-white/5">
                {item.link && (<Link
                  href={item.link}
                  className="inline-flex items-center justify-between w-full text-xs font-semibold text-white/90 group-hover:text-emerald-400 transition-colors"
                >
                  <span>{item.actionText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
