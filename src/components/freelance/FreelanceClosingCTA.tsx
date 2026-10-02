"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

interface FreelanceClosingCTAProps {
  onOpenInquiry: () => void;
}

// Simple Timeline Item
function TimelineItem({
  year,
  status,
  title,
  description,
}: {
  year?: string;
  status: "past" | "current" | "future";
  title: string;
  description: string;
}) {
  return (
    <div className="relative pl-8 pb-10 last:pb-0">
      {/* Timeline Line */}
      <div className="absolute left-[9px] top-3 bottom-[-12px] w-[1px] bg-[rgba(255,255,255,0.08)] last:hidden" />

      {/* Timeline Dot */}
      <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full flex items-center justify-center bg-[#2E2F2B] border ${
        status === "current"
          ? "border-[#ECEDE7] text-[#ECEDE7]"
          : status === "past"
          ? "border-[#A1A39B] text-[#A1A39B]"
          : "border-[rgba(255,255,255,0.1)] text-transparent"
      }`}>
        {status === "current" && <div className="w-1.5 h-1.5 rounded-full bg-[#ECEDE7]" />}
        {status === "past" && <div className="w-1.5 h-1.5 rounded-full bg-[#A1A39B]" />}
      </div>

      <div>
        {year && (
          <span className="block text-[11px] font-bold tracking-widest text-[#A1A39B] mb-1.5">
            {year}
          </span>
        )}
        <h4 className={`text-[15px] font-bold ${status === "future" ? "text-[#A1A39B]" : "text-[#ECEDE7]"}`}>
          {title}
        </h4>
        <p className="text-[13px] text-[#898B84] mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export function FreelanceClosingCTA({
  onOpenInquiry,
}: FreelanceClosingCTAProps) {
  return (
    <div className="bg-[#2E2F2B]">
      {/* 1. TIMELINE SECTION */}
      <section id="card-perjalanan" className="relative w-full py-20 md:py-28 border-t border-[rgba(255,255,255,0.07)]">
        <div className="container mx-auto px-6 max-w-[1240px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">

            {/* Header side */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 max-w-xl"
            >
              <span className="block text-[11px] font-bold tracking-[0.22em] uppercase text-[#A1A39B] mb-6">
                Build in Public
              </span>

              <h2 className="text-[36px] sm:text-[44px] md:text-[52px] font-black tracking-[-0.03em] text-[#ECEDE7] leading-[1.05]">
                Sedang dibangun.
                <br />
                <span className="text-[#A1A39B]">Didokumentasikan.</span>
              </h2>

              <p className="mt-8 text-[15px] md:text-[16px] text-[#C3C5BD] leading-relaxed font-normal">
                Saya tidak sedang menunggu semuanya sempurna. Saya membangun karier freelance ini sambil mendokumentasikan apa yang saya coba, apa yang gagal, dan apa yang berhasil.
              </p>

              <div className="mt-8 pt-8 border-t border-[rgba(255,255,255,0.07)]">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#A1A39B] hover:text-[#ECEDE7] transition-colors"
                >
                  Ikuti update di X/Twitter <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>

            {/* Timeline side */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 lg:col-start-8"
            >
              <TimelineItem
                year="2026"
                status="past"
                title="Memulai Freelance Journey"
                description="Portfolio, positioning, dan platform setup."
              />
              <TimelineItem
                status="current"
                title="Membangun Freelance Journey Hub"
                description="Sedang berlangsung. Dokumentasi resource."
              />
              <TimelineItem
                status="future"
                title="Penghasilan freelance konsisten"
                description="In progress."
              />
              <TimelineItem
                status="future"
                title="Klien internasional pertama"
                description="Next milestone."
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. WORK WITH ME SECTION */}
      <section id="card-work-with-me" className="relative w-full py-20 border-t border-[rgba(255,255,255,0.04)] bg-[#292A27]">
        <div className="container mx-auto px-6 max-w-[1240px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 p-10 sm:p-12 border border-[rgba(255,255,255,0.07)] bg-[#2E2F2B] rounded-[8px]"
          >
            <div className="max-w-2xl">
              <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-[#A5AC91] mb-4 px-2.5 py-1 border border-[#A5AC91]/30 rounded-[4px]">
                Terbuka untuk project
              </span>
              <h3 className="text-[24px] sm:text-[28px] font-black tracking-[-0.02em] text-[#ECEDE7] leading-tight mb-3">
                Punya ide yang ingin dibangun?
              </h3>
              <p className="text-[14px] sm:text-[15px] text-[#A1A39B] leading-relaxed">
                Saya membantu mengubah ide menjadi produk digital. Terbuka untuk freelance project, kolaborasi, dan peluang remote.
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <button
                onClick={onOpenInquiry}
                type="button"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-[8px] bg-[#ECEDE7] text-[#242521] font-semibold text-[14px] hover:bg-[#F7F6F1] hover:-translate-y-[2px] transition-all duration-300 group/btn"
              >
                <span>Mari bekerja bersama</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
