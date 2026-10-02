"use client";

import { motion } from "framer-motion";
import { Globe2, MapPin, Compass, Laptop, Wifi, Coffee, BatteryCharging, Headphones } from "lucide-react";
import { REMOTE_LOCATIONS, RemoteLocation } from "@/content/freelance-data";

export function FreelanceRemoteLife() {
  const essentials = [
    { icon: <Laptop className="w-4 h-4 text-brand-accent" />, label: "M-Series Laptop", desc: "18-hr battery life & fanless silent power" },
    { icon: <Headphones className="w-4 h-4 text-indigo-400" />, label: "ANC Headphones", desc: "Instant focus bubble in busy cafes" },
    { icon: <Wifi className="w-4 h-4 text-emerald-400" />, label: "Dual Hotspot & e-SIM", desc: "Zero downtime client connectivity" },
    { icon: <Coffee className="w-4 h-4 text-amber-400" />, label: "Asynchronous Comm", desc: "No morning meeting anxiety" },
  ];

  return (
    <section id="remote-life" className="py-20 md:py-28 relative border-t border-white/[0.08] bg-[#03050A]">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono uppercase tracking-wider text-emerald-400">
            <span>08 // WORK FROM ANYWHERE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Work From Anywhere
          </h2>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed">
            Freelance buatku bukan cuma soal mendapatkan project. Ini tentang <strong className="text-white font-semibold">membangun kedaulatan</strong> untuk menentukan kapan, bagaimana, dan dari mana aku bekerja.
          </p>
        </div>

        {/* Location Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {REMOTE_LOCATIONS.map((loc, idx) => {
            const isCurrent = loc.status === "current";
            const isPlanned = loc.status === "planned";

            return (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                  isCurrent
                    ? "bg-emerald-500/[0.05] border-emerald-500/30 shadow-[0_0_35px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30"
                    : isPlanned
                    ? "bg-white/[0.02] border-white/10 hover:border-brand-accent/30"
                    : "bg-white/[0.01] border-white/5 opacity-70 hover:opacity-100"
                }`}
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-2xl">{loc.flag}</span>
                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${
                        isCurrent
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : isPlanned
                          ? "bg-brand-accent/15 text-brand-accent border-brand-accent/30"
                          : "bg-white/5 text-white/40 border-white/10"
                      }`}
                    >
                      {loc.statusLabel}
                    </span>
                  </div>

                  {/* City & Country */}
                  <h3 className="text-xl font-bold text-white mb-1">
                    {loc.city}
                  </h3>
                  <div className="text-xs font-mono text-white/40 uppercase mb-3">
                    {loc.country} {loc.targetTimeline && `• ${loc.targetTimeline}`}
                  </div>

                  {/* Vibe */}
                  <div className="text-xs font-medium text-brand-accent/90 mb-3 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 shrink-0" />
                    <span>{loc.vibe}</span>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed">
                    {loc.notes}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-white/30">
                  ROADMAP_NODE_0{idx + 1}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Remote Essentials Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10">
          <div className="text-xs font-mono uppercase tracking-wider text-white/40 mb-6 flex items-center gap-2">
            <BatteryCharging className="w-4 h-4 text-brand-accent" />
            <span>MINIMALIST REMOTE PACKING & ARTIFACTS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {essentials.map((item, eIdx) => (
              <div key={eIdx} className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-0.5">
                    {item.label}
                  </h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
