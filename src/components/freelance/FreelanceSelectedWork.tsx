"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Sparkles, Terminal, CheckCircle2 } from "lucide-react";
import { SELECTED_WORK, CaseStudy } from "@/content/freelance-data";
import Link from "next/link";

export function FreelanceSelectedWork() {
  return (
    <section id="work" className="py-20 md:py-28 relative border-t border-white/[0.08] bg-[#020306]">
      {/* Background accents */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-indigo-400">
              <span>05 // CASE STUDY CARDS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Selected Work
            </h2>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed">
              Bukan sekadar galeri mockup visual. Ini adalah studi kasus sistem nyata yang dibangun dari nol dengan fokus pada problem solving, performa, dan arsitektur produk defensibel.
            </p>
          </div>

          <div className="text-xs font-mono text-white/40">
            SHOWCASING 03 FLAGSHIP BUILDS
          </div>
        </div>

        {/* Case Study Cards Stack */}
        <div className="space-y-8">
          {SELECTED_WORK.map((work, idx) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/20 p-6 sm:p-8 lg:p-10 transition-all group overflow-hidden relative shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
            >
              {/* Dynamic Accent Ambient Glow */}
              <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${work.accentColor} blur-[120px] rounded-full pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity`} />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                
                {/* Left: Content & Metrics (5 cols) */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Category & Badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-accent/15 border border-brand-accent/30 text-brand-accent font-bold">
                      {work.badge}
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-xs font-mono text-white/50">
                      {work.clientOrProject}
                    </span>
                  </div>

                  {/* Title & Role */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 group-hover:text-brand-accent transition-colors">
                      {work.title}
                    </h3>
                    <p className="text-xs font-mono text-white/40 uppercase tracking-wider">
                      ROLE: {work.role}
                    </p>
                  </div>

                  <p className="text-sm text-white/70 leading-relaxed">
                    {work.summary}
                  </p>

                  {/* Solutions list */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                      KEY SOLUTIONS
                    </div>
                    <ul className="space-y-1.5 text-xs text-white/60">
                      {work.keySolutions.map((sol, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{sol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Impact Metrics Banner */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {work.impactMetrics.map((met, mIdx) => (
                      <div key={mIdx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                        <div className="text-xs sm:text-sm font-bold text-white mb-0.5">
                          {met.value}
                        </div>
                        <div className="text-[10px] text-white/40 uppercase font-mono">
                          {met.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stack Pills & CTA */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {work.stack.map((stk) => (
                        <span
                          key={stk}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/60"
                        >
                          {stk}
                        </span>
                      ))}
                    </div>

                    {work.link && (
                      <Link
                        href={work.link}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-accent hover:text-white transition-colors group/link"
                      >
                        <span>Eksplorasi Proyek</span>
                        <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </Link>
                    )}
                  </div>

                </div>

                {/* Right: Rich Interactive Visual / Product Showcase Frame (6 cols) */}
                <div className="lg:col-span-6">
                  <div className="relative rounded-2xl bg-[#090C16] border border-white/10 p-5 sm:p-6 shadow-2xl group-hover:border-brand-accent/40 group-hover:scale-[1.01] transition-all">
                    
                    {/* Browser / App Header */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-[11px] font-mono text-white/40">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <span className="ml-2 text-white/50">app.khadafi.studio/{work.id}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        DEPLOYED
                      </span>
                    </div>

                    {/* Visual Mock Canvas */}
                    <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-[#0D1220] to-[#070912] border border-white/5 p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden">
                      {/* Subtle Grid in Mock */}
                      <div 
                        className="absolute inset-0 opacity-[0.05]"
                        style={{
                          backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
                          backgroundSize: '16px 16px'
                        }}
                      />

                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-brand-accent" />
                          <span className="text-xs font-mono text-white/70 font-semibold uppercase">
                            {work.id.toUpperCase()}_ENGINE_V2
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-white/40">LATENCY 42ms</span>
                      </div>

                      <div className="relative z-10 my-auto py-4">
                        <div className="text-xs text-brand-accent font-mono mb-1">
                          // ARCHITECTURE HIGHLIGHT
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-white mb-2">
                          {work.impactMetrics[1].label}: {work.impactMetrics[1].value}
                        </h4>
                        <p className="text-xs text-white/50 line-clamp-2">
                          {work.summary}
                        </p>
                      </div>

                      <div className="relative z-10 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
                        <span>STATUS: PRODUCTION</span>
                        {work.link && (
                          <Link href={work.link} className="text-brand-accent hover:underline flex items-center gap-1">
                            <span>Buka Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>

                    </div>

                  </div>
                </div>

              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
