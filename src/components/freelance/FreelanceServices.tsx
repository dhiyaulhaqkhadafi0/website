"use client";

import { motion } from "framer-motion";
import { Cpu, Layout, TrendingUp, CheckCircle2, ArrowRight, Clock, Tag } from "lucide-react";
import { SERVICE_CLUSTERS, ServiceCluster } from "@/content/freelance-data";

interface FreelanceServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

export function FreelanceServices({ onSelectService }: FreelanceServicesProps) {
  const getIcon = (iconName: ServiceCluster["iconName"]) => {
    switch (iconName) {
      case "Cpu":
        return <Cpu className="w-6 h-6 text-brand-accent" />;
      case "Layout":
        return <Layout className="w-6 h-6 text-indigo-400" />;
      case "TrendingUp":
        return <TrendingUp className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <section id="services" className="py-20 md:py-28 relative border-t border-white/[0.08] bg-[#05060C]">
      {/* Subtle Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-accent/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-xs font-mono uppercase tracking-wider text-brand-accent">
            <span>04 // CAPABILITIES & OFFERING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            What I Do
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            Tidak membatasi diri sebagai sekadar &ldquo;Web Developer&rdquo; atau &ldquo;Desainer&rdquo;. Skillset-ku merentang di irisan product thinking, rekayasa kecerdasan buatan, sistem antarmuka, dan pertumbuhan digital.
          </p>
        </div>

        {/* 3 Service Clusters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {SERVICE_CLUSTERS.map((srv, idx) => (
            <motion.div
              key={srv.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden"
            >
              {/* Top Accent Gradient Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent group-hover:via-brand-accent transition-all" />

              <div>
                {/* Header Icon & Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getIcon(srv.iconName)}
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                    {srv.badge}
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-brand-accent transition-colors">
                  {srv.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed mb-6">
                  {srv.shortDesc}
                </p>

                {/* Key Deliverables */}
                <div className="space-y-4 mb-6">
                  <div className="text-xs font-mono uppercase tracking-wider text-white/40">
                    CORE DELIVERABLES
                  </div>
                  <ul className="space-y-2.5">
                    {srv.deliverables.map((del, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2.5 text-xs text-white/75">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack Pills */}
                <div className="mb-6 pt-4 border-t border-white/5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">
                    TECH STACK & TOOLS
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {srv.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-white/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Meta & Action */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between text-xs text-white/50 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-accent" />
                    <span>{srv.timeline}</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">{srv.startingRange}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectService(srv.title)}
                  className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-brand-accent hover:text-white text-white/80 border border-white/10 hover:border-brand-accent font-semibold text-xs flex items-center justify-center gap-2 transition-all group/btn shadow-sm"
                >
                  <span>Diskusikan Layanan Ini</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Small reassurance footer */}
        <div className="mt-12 p-4 rounded-2xl bg-white/[0.02] border border-white/5 max-w-2xl mx-auto text-center">
          <p className="text-xs text-white/50">
            Semua kolaborasi menggunakan sistem <strong className="text-white/80 font-medium">Asynchronous First</strong> (mengurangi meeting yang tidak perlu), komunikasi transparan di Slack/WhatsApp, dan sprint mingguan yang terukur.
          </p>
        </div>

      </div>
    </section>
  );
}
