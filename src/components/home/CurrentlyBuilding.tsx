"use client";

import { motion } from "framer-motion";
import { Activity, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function CurrentlyBuilding() {
  const ledgerItems = [
    {
      project: "Chikki Studio",
      scope: "Immersive Writing Network & AI Repurpose",
      status: "Live MVP",
      statusColor: "bg-emerald-400 text-emerald-300 border-emerald-500/30",
      stage: "Active Iteration",
      link: null,
    },
    {
      project: "Freelance Journey Hub",
      scope: "Worldwide Discovery Directory & Flagship Guide",
      status: "Improving",
      statusColor: "bg-amber-400/20 text-amber-300 border-amber-500/30",
      stage: "Expanding Data",
      link: "/freelance",
    },
    {
      project: "Khadafi Business OS",
      scope: "Central Business Router & Global IA v1",
      status: "Building",
      statusColor: "bg-indigo-400/20 text-indigo-300 border-indigo-500/30",
      stage: "Phase 2 Active",
      link: "/changelog",
    },
    {
      project: "Digital Systems Vault",
      scope: "Context Priming Pack & Prompt Recipes v2",
      status: "Research",
      statusColor: "bg-teal-400/20 text-teal-300 border-teal-500/30",
      stage: "Drafting",
      link: "/resources",
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 bg-[#06070b] border-t border-white/5">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Real-Time Status</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Currently Building
            </h2>
          </div>

          <Link
            href="/changelog"
            className="text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Lihat Changelog</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          </Link>
        </div>

        {/* Ledger Table */}
        <div className="rounded-2xl border border-white/10 bg-[#0b0c13] overflow-hidden shadow-xl">
          <div className="divide-y divide-white/5 font-mono text-xs">
            {ledgerItems.map((item, idx) => (
              <motion.div
                key={item.project}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <span className="font-bold text-white text-sm sm:w-48 font-sans">
                    {item.project}
                  </span>
                  <span className="text-slate-400 text-xs font-sans">
                    {item.scope}
                  </span>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10.5px] border uppercase tracking-wider font-semibold ${item.statusColor}`}
                  >
                    {item.status}
                  </span>
                  <span className="text-slate-400 text-[11px] sm:w-32 text-right">
                    {item.stage}
                  </span>
                  {item.link && (<Link
                    href={item.link}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    aria-label={`Buka detail ${item.project}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
