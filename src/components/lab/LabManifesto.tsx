"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Lora } from "next/font/google";
import { useLabMotion } from "./LabMotionContext";
import { HCFTLWordmark } from "./HCFTLWordmark";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });
const CUBIC_EASE = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────────────────────────────────────────
   VISUAL MANIFESTO: Jaringan Kemampuan Manusia
   Pusat "Manusia" terhubung ke "Memahami", "Memutuskan", dan "Bertindak"
───────────────────────────────────────────────────────────── */
function HumanCapabilityNetwork({ isMotionActive }: { isMotionActive: boolean }) {
  return (
    <div className="w-full max-w-[420px] aspect-[4/3] relative flex flex-col items-center justify-center p-4 rounded-2xl border border-white/[0.08] bg-[#070C12]/90 backdrop-blur-md shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
      <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md" fill="none" aria-hidden="true">
        <defs>
          <filter id="hcnGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient concentric guide rings */}
        <circle cx="200" cy="150" r="95" stroke="rgba(181,225,231,0.08)" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="200" cy="150" r="60" stroke="rgba(181,225,231,0.12)" strokeWidth="1" />

        {/* Triangular capability boundary envelope */}
        <polygon
          points="200,50 315,225 85,225"
          fill="rgba(181,225,231,0.025)"
          stroke="rgba(181,225,231,0.2)"
          strokeWidth="1.2"
        />

        {/* Connection rays from Manusia center to 3 nodes */}
        <line x1="200" y1="150" x2="200" y2="50" stroke="#B5E1E7" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="200" y1="150" x2="315" y2="225" stroke="#B5E1E7" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="200" y1="150" x2="85" y2="225" stroke="#B5E1E7" strokeWidth="1.5" strokeOpacity="0.6" />

        {/* Moving signal pulse: outward and return (Expansion of capability while anchored to Human) */}
        {isMotionActive && (
          <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" filter="url(#hcnGlow)">
            <animateMotion
              path="M 200 150 L 200 50 L 200 150 L 315 225 L 200 150 L 85 225 L 200 150"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
        )}

        {/* Outer Node 1: Memahami (Top) */}
        <g transform="translate(200, 50)">
          <circle cx="0" cy="0" r="22" fill="#0A121A" stroke="rgba(181,225,231,0.6)" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="6" fill="#7DD3FC" />
          <text x="0" y="-30" textAnchor="middle" fill="#F0F2ED" fontSize="11" fontFamily="monospace" letterSpacing="0.12em">
            MEMAHAMI
          </text>
        </g>

        {/* Outer Node 2: Memutuskan (Bottom Right) */}
        <g transform="translate(315, 225)">
          <circle cx="0" cy="0" r="22" fill="#0A121A" stroke="rgba(181,225,231,0.6)" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="6" fill="#7DD3FC" />
          <text x="0" y="38" textAnchor="middle" fill="#F0F2ED" fontSize="11" fontFamily="monospace" letterSpacing="0.12em">
            MEMUTUSKAN
          </text>
        </g>

        {/* Outer Node 3: Bertindak (Bottom Left) */}
        <g transform="translate(85, 225)">
          <circle cx="0" cy="0" r="22" fill="#0A121A" stroke="rgba(181,225,231,0.6)" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="6" fill="#7DD3FC" />
          <text x="0" y="38" textAnchor="middle" fill="#F0F2ED" fontSize="11" fontFamily="monospace" letterSpacing="0.12em">
            BERTINDAK
          </text>
        </g>

        {/* Stable Center Anchor: MANUSIA */}
        <g transform="translate(200, 150)">
          <circle cx="0" cy="0" r="28" fill="#070C12" stroke="#F0F2ED" strokeWidth="2" />
          <circle cx="0" cy="0" r="12" fill="#B5E1E7" filter="url(#hcnGlow)" />
          <text x="0" y="4" textAnchor="middle" fill="#070C12" fontSize="9" fontWeight="bold" fontFamily="monospace" letterSpacing="0.05em">
            INTI
          </text>
          <text x="0" y="-36" textAnchor="middle" fill="#B5E1E7" fontSize="12" fontWeight="bold" fontFamily="monospace" letterSpacing="0.15em">
            MANUSIA
          </text>
        </g>
      </svg>

      {/* Caption */}
      <div className="mt-2 text-center">
        <span className="text-[11px] font-mono text-[#ADBAC5] tracking-wider">
          Kemampuan bertambah. Kendali tetap pada manusia.
        </span>
      </div>
    </div>
  );
}

export function LabManifesto() {
  const [isOpen, setIsOpen] = useState(false);
  const { isMotionActive, shouldReduceMotion } = useLabMotion();

  const anim = (delay: number) => {
    if (shouldReduceMotion) return { initial: { opacity: 1, y: 0 } };
    return {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-40px" },
      transition: { duration: 0.75, delay, ease: CUBIC_EASE },
    };
  };

  return (
    <section id="tentang" className="py-24 sm:py-32 md:py-44 relative overflow-hidden scroll-mt-24">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

        {/* Section label (0ms) */}
        <motion.div
          {...anim(0)}
          className="flex items-center gap-3 mb-10 sm:mb-12 font-mono text-[11px] tracking-[0.2em] text-[#ADBAC5] uppercase"
        >
          <span>02</span>
          <span className="w-8 h-px bg-[#ADBAC5]/30" />
          <span>Manifesto</span>
        </motion.div>

        {/* ── Pengantar Editorial: Mengenal HCFTL (Always visible, editorial layout) ── */}
        <motion.div
          {...anim(0.04)}
          className="mb-14 sm:mb-20 max-w-3xl border-b border-white/[0.08] pb-12 sm:pb-16"
        >
          {/* Small label with Wordmark */}
          <div className="flex flex-wrap items-center gap-3.5 mb-5">
            <HCFTLWordmark size="sm" variant="silver" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
            <span className="font-mono text-xs tracking-[0.2em] text-[#7DD3FC] uppercase font-medium">
              Mengenal HCFTL
            </span>
          </div>

          {/* Medium size full name */}
          <h2 className={`${lora.className} text-2xl sm:text-3xl md:text-4xl font-normal text-[#F0F2ED] tracking-tight leading-snug mb-6`}>
            Human Centered Frontier Technology Lab
          </h2>

          {/* Comfortable reading paragraphs */}
          <div className="space-y-4 text-base sm:text-lg text-[#ADBAC5] font-light leading-relaxed">
            <p>
              HCFTL adalah inisiatif laboratorium riset independen yang mengeksplorasi AI dan teknologi baru untuk memperluas kemampuan manusia.
            </p>
            <p>
              &ldquo;Human Centered&rdquo; berarti kebutuhan dan kendali manusia menjadi pusat perancangan. &ldquo;Frontier Technology&rdquo; merujuk pada teknologi yang masih berkembang dan membuka kemungkinan baru.
            </p>
            <p>
              Di sini, gagasan diarahkan menjadi eksperimen yang terukur, terdokumentasi, dan dapat dievaluasi.
            </p>
          </div>
        </motion.div>

        {/* Main Editorial Statement & Visual Balanced Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-12">
          
          {/* Left Column: Monumental Quote & Intro (100ms & 160ms) */}
          <div className="lg:col-span-7">
            <motion.blockquote
              {...anim(0.1)}
              className={`${lora.className} text-[36px] sm:text-[48px] md:text-[56px] lg:text-[66px] font-normal text-[#ADBAC5] leading-[1.1] tracking-tight mb-8`}
              style={{ letterSpacing: "-0.03em" }}
            >
              Teknologi yang semakin kuat seharusnya memperluas kemampuan{" "}
              <span className="text-[#F0F2ED] relative inline-block">
                manusia
                <span className="absolute bottom-1 sm:bottom-2 left-0 w-full h-[2px] bg-[#B5E1E7]/50" />
              </span>
              —bukan mengurangi kendalinya.
            </motion.blockquote>

            <motion.p
              {...anim(0.14)}
              className="text-lg sm:text-xl text-[#ADBAC5] font-light leading-relaxed max-w-xl"
            >
              HCFTL lahir dari kesadaran bahwa kemajuan kecerdasan buatan dan sistem otonom membutuhkan arah yang terukur dan berpusat pada kedaulatan manusia.
            </motion.p>
          </div>

          {/* Right Column: Jaringan Kemampuan Manusia (200ms) */}
          <motion.div
            {...anim(0.2)}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <HumanCapabilityNetwork isMotionActive={isMotionActive} />
          </motion.div>

        </div>

        {/* Disclosure Area: Narasi pendirian melalui 'Mengapa HCFTL ada?' */}
        <div className="border-t border-white/[0.08] pt-8 mt-10">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="manifesto-foundation-narrative"
            className="min-h-[44px] group inline-flex items-center gap-3 py-2 text-xs sm:text-sm font-mono text-[#ADBAC5] hover:text-[#F0F2ED] transition-colors focus:outline-none cursor-pointer"
          >
            <span className="w-6 h-6 rounded-full border border-white/[0.1] bg-white/[0.03] group-hover:border-white/20 flex items-center justify-center transition-colors">
              {isOpen ? (
                <Minus className="w-3.5 h-3.5 text-[#B5E1E7]" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-[#ADBAC5] group-hover:text-[#F0F2ED]" />
              )}
            </span>
            <span className="tracking-wide">
              {isOpen ? "Tutup detail narasi pendirian" : "Mengapa HCFTL ada?"}
            </span>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                id="manifesto-foundation-narrative"
                role="region"
                aria-label="Narasi Pendirian HCFTL"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: CUBIC_EASE }}
                className="overflow-hidden"
              >
                <div className="pt-8 max-w-2xl space-y-6 text-left">
                  <p className="text-base sm:text-lg text-[#ADBAC5] font-light leading-relaxed">
                    Eksplorasi teknologi garis depan tidak boleh semata-mata mengejar demonstrasi visual atau kecepatan rilis tanpa disertai bukti ilmiah yang dapat diuji ulang secara mandiri.
                  </p>
                  <p className="text-base text-[#ADBAC5]/80 font-light leading-relaxed">
                    Kami menempatkan manusia sebagai otoritas tertinggi dalam setiap keputusan sistem berisiko, membangun lapisan pengaman sebelum sistem berinteraksi dengan dunia nyata, dan berkomitmen pada transparansi penuh terhadap batasan serta kegagalan riset.
                  </p>
                  <div className="pt-4 font-mono text-xs tracking-widest text-[#B5E1E7] uppercase flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B5E1E7]" />
                    <span>Capability without responsibility is not progress.</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
