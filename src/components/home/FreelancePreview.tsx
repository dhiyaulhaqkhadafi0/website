"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";

export function FreelancePreview() {
  return (
    <section className="relative py-24 px-4 sm:px-6 bg-[#08090e] border-t border-white/5 overflow-hidden">
      {/* Background warm graphite aura */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[500px] h-[400px] bg-[#a5ac91]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Description & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#a5ac91] font-semibold mb-2 block">
            Independent Remote Career
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] mb-6">
            Building a career without an office.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-8 max-w-xl">
            Catatan perjalanan, kurasi platform kerja global, sistem pipeline klien, dan sumber daya taktis untuk membangun karier freelance dan remote yang mandiri dan berkelanjutan.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>14+ Platform Direktori</span>
            </div>
            <span className="text-white/20">·</span>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Panduan Mulai dari Nol</span>
            </div>
            <span className="text-white/20">·</span>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span>Worldwide Freelancer</span>
            </div>
          </div>

          <Link
            href="/freelance"
            className="px-7 py-3.5 bg-[#ecede7] text-[#292a27] hover:bg-white rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2 group active:scale-95"
          >
            <span>Enter Freelance Journey Hub</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right Column: Visual Preview Card of the Hub */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 relative"
        >
          <div className="p-7 rounded-3xl bg-[#292a27] text-[#ecede7] border border-[#a5ac91]/30 shadow-2xl relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#a5ac91]/10 blur-[40px] rounded-full pointer-events-none" />

            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#a5ac91] pb-4 mb-5 border-b border-[#a5ac91]/20">
              <span>Freelance Hub // Preview</span>
              <Globe className="w-4 h-4" />
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#33342f] border border-[#a5ac91]/20">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#a5ac91] block mb-1">
                  Flagship Editorial Guide
                </span>
                <h4 className="text-base font-bold text-[#ecede7] mb-1">
                  Mulai Freelance dari Nol
                </h4>
                <p className="text-xs text-[#a1a39b] leading-relaxed">
                  Struktur tahapan: mindset, skill audit, packaging offer, hingga mengirim proposal pertama.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#33342f] border border-[#a5ac91]/20">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#a5ac91] block mb-1">
                  Global Discovery
                </span>
                <h4 className="text-base font-bold text-[#ecede7] mb-1">
                  Direktori Kerja Remote & Job Boards
                </h4>
                <p className="text-xs text-[#a1a39b] leading-relaxed">
                  Contra, We Work Remotely, Upwork, ProBlogger, Remote OK, FlexJobs, dan 10+ lainnya.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#a5ac91]/20 flex items-center justify-between text-xs text-[#a5ac91] font-mono">
              <span>Eksplorasi Lengkap</span>
              <span className="text-[#ecede7]">khadafidaffa.com/freelance →</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
