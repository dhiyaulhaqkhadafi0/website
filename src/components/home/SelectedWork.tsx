"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Layers, Globe, Cpu, Sparkles } from "lucide-react";

export function SelectedWork() {
  const projects = [
    {
      id: "chikki",
      featured: true,
      title: "CHIKKI — Immersive Writing Network",
      tagline: "Distraction-free editorial workspace with multi-format AI repurposing.",
      description:
        "Platform studio penulisan dengan TipTap WYSIWYG, AI repurposing engine lintas format (Twitter thread, LinkedIn post, newsletter), real-time engagement analytics, dan antarmuka editorial dark-mode yang elegan.",
      badge: "Flagship Live Product",
      stack: ["Next.js 16", "Supabase RLS", "TipTap Editor", "Tailwind CSS", "Cloudflare"],
      metrics: [
        { label: "Velocity", value: "Built in 2 Weeks" },
        { label: "Core Feature", value: "Multi-Format AI Repurpose" },
        { label: "Performance", value: "Sub-100ms Interactions" },
      ],
      link: "/studio",
      actionText: "Buka Chikki Studio ↗",
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
    },
    {
      id: "freelance-hub",
      featured: false,
      title: "Freelance Journey Hub",
      tagline: "Discovery platform & career systems for independent builders.",
      description:
        "Pusat ekosistem karier remote dengan visualisasi konektivitas global, kurasi 14+ platform kerja internasional, pencarian instan, dan panduan belajar 'Mulai Freelance dari Nol'.",
      badge: "Platform & Editorial",
      stack: ["Next.js 16", "React 19", "Dynamic SVG Atlas", "Turbopack"],
      metrics: [
        { label: "Directory", value: "14+ Platforms Curated" },
        { label: "Guide", value: "Flagship Learning Path" },
      ],
      link: "/freelance",
      actionText: "Jelajahi Freelance Hub ↗",
      icon: <Globe className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: "business-os",
      featured: false,
      title: "Khadafi Business OS v1",
      tagline: "Personal business headquarters & unified digital ecosystem.",
      description:
        "Arsitektur situs terpadu yang memadukan storefront produk, jalur komersial, knowledge vault, dan audience engine dalam satu sistem performa tinggi berbasis Cloudflare Workers.",
      badge: "Digital Headquarters",
      stack: ["Next.js 16", "Cloudflare OpenNext", "Context Engineering", "Markdown MDX"],
      metrics: [
        { label: "Architecture", value: "Modular Business Router" },
        { label: "Scale", value: "Edge Deployment" },
      ],
      link: "/about",
      actionText: "Lihat Arsitektur OS ↗",
      icon: <Layers className="w-5 h-5 text-teal-400" />,
    },
    {
      id: "hcftl-lab",
      featured: false,
      title: "HCFTL — Human-Centered Future Tech Lab",
      tagline: "Exploration laboratory on agentic systems & interface futures.",
      description:
        "Inisiatif riset independen mengeksplorasi batas teknologi AI generatif, interaksi manusia-komputer non-konvensional, dan arsitektur produk defensibel jangka panjang.",
      badge: "Research Lab",
      stack: ["AI Agentic Research", "Experimental UI", "Long-term R&D"],
      metrics: [
        { label: "Focus", value: "HCI & AI Interaction" },
        { label: "Nature", value: "Experimental Initiative" },
      ],
      link: "/lab",
      actionText: "Kunjungi HCFTL Lab ↗",
      icon: <Cpu className="w-5 h-5 text-amber-400" />,
    },
  ];

  return (
    <section id="selected-work" className="relative py-24 px-4 sm:px-6 bg-[#07080d] border-t border-white/5 scroll-mt-24">
      {/* Anchor alias */}
      <div id="work" className="sr-only" aria-hidden="true" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold mb-2 block">
              Proof of Work
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Selected Work
            </h2>
            <p className="text-base text-slate-400 mt-3 font-normal leading-relaxed">
              Karya nyata yang telah dirancang, dideploy, dan dioperasikan. Bukan sekadar mockup konsep, melainkan sistem fungsional siap produksi.
            </p>
          </div>
        </div>

        {/* Featured Project 1: CHIKKI */}
        {projects
          .filter((p) => p.featured)
          .map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="mb-8 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#10121d] via-[#0d0e17] to-[#0a0b12] border border-white/15 hover:border-indigo-500/40 transition-all duration-300 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-all" />

              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono uppercase tracking-wider">
                    {item.icon}
                    <span>{item.badge}</span>
                  </div>
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white transition-colors"
                  >
                    <span>{item.actionText}</span>
                    <ArrowUpRight className="w-4 h-4 text-indigo-400" />
                  </Link>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 tracking-tight group-hover:text-indigo-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-base sm:text-lg text-indigo-300/90 font-medium mb-4">
                  {item.tagline}
                </p>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mb-8">
                  {item.description}
                </p>

                {/* Metrics strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 pt-6 border-t border-white/10">
                  {item.metrics.map((m) => (
                    <div key={m.label} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                        {m.label}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-white">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  {item.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

        {/* Additional 3 Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {projects
            .filter((p) => !p.featured)
            .map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-7 rounded-3xl bg-[#0b0c12] border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10.5px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-400">
                      {item.badge}
                    </span>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      {item.icon}
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs font-mono text-slate-400 mb-3 leading-snug">
                    {item.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 border-t border-white/5 flex items-center justify-between">
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>{item.actionText}</span>
                  </Link>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
