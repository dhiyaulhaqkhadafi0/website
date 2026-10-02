"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface FreelanceHeroProps {
  onScrollToLibrary: () => void;
  onScrollToJobs: () => void;
}

export function FreelanceHero({
  onScrollToLibrary,
  onScrollToJobs,
}: FreelanceHeroProps) {
  return (
    <section className="relative w-full pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden bg-[#292A27]">
      {/* Minimal warm atmospheric glow — very subtle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#A5AC91]/[0.06] blur-[160px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-[1240px] relative z-10">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#A1A39B]">
            Freelance Journey Hub
          </span>
        </motion.div>

        {/* Main Headline — editorial display */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
          className="text-[52px] sm:text-[68px] md:text-[84px] lg:text-[96px] font-black tracking-[-0.04em] text-[#ECEDE7] leading-[0.96] max-w-3xl"
        >
          Building a career
          <br />
          <span className="text-[#A1A39B]">without an office.</span>
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
          className="mt-8 md:mt-10 text-[17px] sm:text-[18px] md:text-[20px] text-[#C3C5BD] leading-relaxed max-w-[600px] font-normal"
        >
          Catatan perjalanan, peluang, tools, dan sumber daya untuk membangun karier freelance &amp; remote dari mana saja.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28 }}
          className="mt-10 md:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <button
            onClick={onScrollToLibrary}
            type="button"
            id="hero-cta-primary"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-[8px] bg-[#ECEDE7] text-[#242521] font-semibold text-[14px] sm:text-[15px] hover:bg-[#F7F6F1] hover:-translate-y-[2px] active:translate-y-0 transition-all duration-300"
          >
            <span>Jelajahi Dunia Freelance</span>
          </button>

          <button
            onClick={onScrollToJobs}
            type="button"
            id="hero-cta-secondary"
            className="inline-flex items-center justify-center gap-2 px-2 py-3.5 text-[#C3C5BD] font-medium text-[14px] sm:text-[15px] hover:text-[#ECEDE7] transition-colors duration-200 group"
          >
            <span>Lihat Lowongan Remote</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </motion.div>

        {/* Micro taxonomy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="mt-14 md:mt-16"
        >
          <p className="text-[12px] tracking-[0.14em] text-[#898B84] uppercase font-medium">
            Freelance&nbsp;&nbsp;·&nbsp;&nbsp;Remote Work&nbsp;&nbsp;·&nbsp;&nbsp;AI&nbsp;&nbsp;·&nbsp;&nbsp;Digital Career
          </p>
        </motion.div>
      </div>
    </section>
  );
}
