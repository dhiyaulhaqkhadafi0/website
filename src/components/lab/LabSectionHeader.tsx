"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });
const CUBIC_EASE = [0.16, 1, 0.3, 1] as const;

interface LabSectionHeaderProps {
  number: string;
  label: string;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function LabSectionHeader({
  number,
  label,
  title,
  description,
  children,
  className = "mb-16",
}: LabSectionHeaderProps) {
  const shouldReduceMotion = useReducedMotion();

  const anim = (delay: number) => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 1, y: 0 },
      };
    }
    return {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-40px" },
      transition: { duration: 0.75, delay, ease: CUBIC_EASE },
    };
  };

  return (
    <div className={className}>
      {/* 1. Number & Label (0ms) */}
      <motion.div
        {...anim(0)}
        className="flex items-center gap-3 mb-6 font-mono text-[11px] tracking-[0.2em] text-[#ADBAC5] uppercase"
      >
        <span>{number}</span>
        <span className="w-8 h-px bg-[#ADBAC5]/30" />
        <span>{label}</span>
      </motion.div>

      {/* 2. Main Title (70ms) & Description (140ms) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <motion.h2
          {...anim(0.07)}
          className={`${lora.className} text-4xl sm:text-5xl md:text-6xl font-normal text-[#F0F2ED] tracking-tight leading-[1.1] max-w-3xl`}
        >
          {title}
        </motion.h2>

        {description && (
          <motion.div
            {...anim(0.14)}
            className="max-w-md text-base sm:text-lg text-[#ADBAC5] font-light leading-relaxed"
          >
            {description}
          </motion.div>
        )}

        {children && <div className="shrink-0">{children}</div>}
      </div>
    </div>
  );
}
