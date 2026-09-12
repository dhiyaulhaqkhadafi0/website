"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { Lora } from "next/font/google";
import { useLabMotion } from "./LabMotionContext";
import { HCFTLWordmark } from "./HCFTLWordmark";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });
const CUBIC_EASE = [0.16, 1, 0.3, 1] as const;

const HEADLINE_ROTATION_PAIRS = [
  {
    target: "manusia.",
    description:
      "Mengembangkan sistem cerdas yang memperluas kemampuan manusia, dengan keputusan penting tetap berada di tangan manusia.",
  },
  {
    target: "kehidupan.",
    description:
      "Mengeksplorasi manfaat AI bagi kehidupan manusia melalui eksperimen terukur dan bukti yang dapat diperiksa.",
  },
  {
    target: "masa depan.",
    description:
      "Meneliti teknologi masa depan dengan mempertimbangkan dampaknya bagi manusia sejak tahap perancangan.",
  },
];

export function LabHero() {
  const { isPaused, togglePause, shouldReduceMotion, isMotionActive } = useLabMotion();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  // Track viewport visibility of the hero section to stop timer when scrolled away
  const [isHeroInView, setIsHeroInView] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  // Motion values for smooth 60fps pointer parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for parallax depth (±6px to ±8px offset max as per spec)
  const springConfig = { damping: 28, stiffness: 100 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  // Stop headline timer when hero section leaves the viewport
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroInView(entry.isIntersecting);
      },
      { threshold: 0.05 } // hero is "in view" if at least 5% is visible
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Synchronized Headline Rotation Timer (6 seconds)
  // Stops when: motion paused, reduced motion, user hovering copy, or hero out of viewport
  useEffect(() => {
    if (!isMotionActive || shouldReduceMotion || isHovered || !isHeroInView) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HEADLINE_ROTATION_PAIRS.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isMotionActive, shouldReduceMotion, isHovered, isHeroInView]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (shouldReduceMotion || isPaused || e.pointerType === "touch" || !visualRef.current) return;
      const rect = visualRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      // Clamped to ±6px horizontal, ±8px vertical
      mouseX.set(Math.max(-6, Math.min(6, x * 12)));
      mouseY.set(Math.max(-8, Math.min(8, y * 16)));
    },
    [shouldReduceMotion, isPaused, mouseX, mouseY]
  );

  const handlePointerLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const currentPair = HEADLINE_ROTATION_PAIRS[activeSlide];

  return (
    <section ref={sectionRef} className="relative min-h-[90vh] flex flex-col justify-center pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 overflow-hidden">
      {/* Background ambient lighting - Directional light framing the sculpture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 65% 55% at 82% 52%, rgba(56,189,248,0.07) 0%, rgba(14,35,64,0.18) 45%, transparent 75%),
            radial-gradient(circle 500px at 15% 25%, rgba(255,255,255,0.02) 0%, transparent 60%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto px-6 sm:px-8 lg:px-12 w-full max-w-[1360px]">
        {/* Desktop Layout: The hero is one wide canvas. Text takes ~8 columns, Sculpture integrates on right/bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 relative items-center min-h-[520px]">

          {/* ── TEXT CONTENT (~8 columns wide) ── */}
          <div
            className="lg:col-span-8 flex flex-col items-start text-left z-20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >

            {/* Navigasi Kembali ke Beranda */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#7DD3FC]/40 text-xs font-mono tracking-wider text-[#ADBAC5] hover:text-[#F0F2ED] transition-all group shadow-sm backdrop-blur-md"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-[#7DD3FC]" />
                <span>Kembali ke Beranda</span>
              </Link>
            </motion.div>

            {/* Masthead / Identity */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3.5 mb-8 font-mono text-[11px] sm:text-xs tracking-[0.2em] uppercase"
            >
              <HCFTLWordmark size="sm" variant="silver" />
              <span className="text-[#ADBAC5]/40">—</span>
              <span className="text-[#ADBAC5] tracking-widest">Lab Riset Independen</span>
            </motion.div>

            {/* Monumental Rotating Headline */}
            <div className="mb-6 z-20 min-h-[160px] sm:min-h-[190px] md:min-h-[220px] lg:min-h-[250px] flex flex-col justify-start">
              <h1
                className={`${lora.className} text-[46px] sm:text-[64px] md:text-[80px] lg:text-[96px] xl:text-[104px] font-normal text-[#F0F2ED] leading-[1.05] tracking-tight`}
                style={{ letterSpacing: "-0.03em" }}
                aria-label="Teknologi frontier. Berpusat pada manusia."
              >
                <span className="block">Teknologi frontier.</span>
                <span className="block text-[#ADBAC5] mt-1 lg:mt-2">
                  Berpusat pada{" "}
                  <span className="inline-block relative">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentPair.target}
                        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                        transition={{ duration: 0.6, ease: CUBIC_EASE }}
                        className="text-[#F0F2ED] italic inline-block"
                      >
                        {currentPair.target}
                      </motion.span>
                    </AnimatePresence>
                    <span className="absolute -bottom-2 sm:-bottom-4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#B5E1E7]/50 to-transparent" />
                  </span>
                </span>
              </h1>
            </div>

            {/* Synchronized Contextual Description & CTA Group (Zero layout jump) */}
            <div className="max-w-[48ch] flex flex-col z-20 w-full">
              {/* Description container with reserved min-height to eliminate any CTA jumping */}
              <div className="min-h-[84px] sm:min-h-[96px] flex items-start mb-8">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentPair.description}
                    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.55, ease: CUBIC_EASE }}
                    className="text-lg sm:text-xl text-[#ADBAC5] font-light leading-relaxed"
                  >
                    {currentPair.description}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Primary CTA & Editorial Link */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
                <Link
                  href="#riset"
                  className="relative group inline-flex items-center justify-center gap-3 px-8 h-12 rounded-[10px] bg-gradient-to-b from-[#F0F2ED] via-[#E2E8F0] to-[#CBD5E1] text-[#070C12] font-semibold text-sm tracking-wide shadow-[0_4px_16px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,1),inset_0_0_10px_rgba(181,225,231,0.25)] hover:shadow-[0_6px_22px_rgba(181,225,231,0.3),inset_0_1px_0_rgba(255,255,255,1),inset_0_0_16px_rgba(181,225,231,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300"
                >
                  <span
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)" }}
                    aria-hidden="true"
                  />
                  <span className="relative z-10 font-bold">Jelajahi Riset</span>
                  <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <Link
                  href="#metode"
                  className="group inline-flex items-center justify-center gap-2 h-12 text-[#ADBAC5] hover:text-[#F0F2ED] font-medium text-sm transition-colors duration-300 relative px-2"
                >
                  <span>Cara Kami Bekerja</span>
                  <div className="absolute bottom-2 left-0 w-full h-[1px] bg-[#ADBAC5]/30 group-hover:bg-[#F0F2ED] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                </Link>
              </div>
            </div>

            {/* Factual Foundation Status Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center gap-3 text-xs font-mono text-[#ADBAC5] mt-auto z-20"
            >
              <span className="relative flex h-1.5 w-1.5">
                {isMotionActive && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B5E1E7] opacity-75" />
                )}
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#B5E1E7]" />
              </span>
              <span className="uppercase tracking-widest text-[#F0F2ED]">Tahap fondasi</span>
              <span className="text-[#ADBAC5]/40">—</span>
              <span className="tracking-wide">Merancang eksperimen pertama</span>
            </motion.div>

          </div>

          {/* ── THE FOLDED LIGHT RIBBON (SCULPTURE) ── */}
          <div className="lg:absolute lg:right-[-80px] xl:right-[-40px] lg:top-1/2 lg:-translate-y-1/2 w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[680px] xl:max-w-[780px] aspect-[4/3] flex items-center justify-center z-10 mt-12 lg:mt-0 opacity-95 pointer-events-none">
            <div
              ref={visualRef}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              className="relative w-full h-full pointer-events-auto"
            >
              {/* Parallax layer + Slow 3D tilt orientation change (4-7° over 15s) + Vertical drift */}
              <motion.div
                style={{ x: parallaxX, y: parallaxY }}
                animate={
                  isMotionActive
                    ? {
                        rotateZ: [-3, 3, -3],
                        y: [-3, 3, -3],
                      }
                    : { rotateZ: 0, y: 0 }
                }
                transition={
                  isMotionActive
                    ? { duration: 15, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.3 }
                }
                className="w-full h-full flex items-center justify-center relative origin-center"
              >
                <svg
                  viewBox="0 0 800 600"
                  className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
                  fill="none"
                  aria-hidden="true"
                >
                  <defs>
                    {/* Metallic Silver Front Gradient with delicate cyan sheen */}
                    <linearGradient id="ribbonFront" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                      <stop offset="25%" stopColor="#D5DEE5" stopOpacity="0.8" />
                      <stop offset="55%" stopColor="#1E2C38" stopOpacity="0.75" />
                      <stop offset="85%" stopColor="#14212B" stopOpacity="0.88" />
                      <stop offset="100%" stopColor="#B5E1E7" stopOpacity="0.95" />
                    </linearGradient>

                    {/* Darker Inner/Back Gradient for 3D depth */}
                    <linearGradient id="ribbonBack" x1="100%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#05080C" stopOpacity="0.98" />
                      <stop offset="45%" stopColor="#0E1721" stopOpacity="0.92" />
                      <stop offset="80%" stopColor="#1A2733" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#ADBAC5" stopOpacity="0.25" />
                    </linearGradient>
                    
                    {/* Crisp Edge Glow Gradient */}
                    <linearGradient id="edgeGlow" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#B5E1E7" stopOpacity="0.2" />
                      <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.95" />
                      <stop offset="70%" stopColor="#E2E8F0" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.35" />
                    </linearGradient>

                    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="10" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Ribbon Back Surface (Inside Fold) */}
                  <path
                    d="M 150 400 C 150 400, 300 550, 500 500 C 700 450, 750 250, 650 150 C 550 50, 400 50, 400 50 L 450 120 C 450 120, 550 120, 600 200 C 650 280, 600 400, 480 430 C 360 460, 250 350, 250 350 Z"
                    fill="url(#ribbonBack)"
                  />

                  {/* Ribbon Front Surface (Outside Fold) */}
                  <path
                    d="M 250 350 C 250 350, 100 250, 200 100 C 300 -50, 500 50, 500 50 L 400 50 C 400 50, 250 -20, 150 80 C 50 180, 150 400, 150 400 Z"
                    fill="url(#ribbonFront)"
                  />

                  {/* Sharp Cyan / Silver Glowing Edges */}
                  <path
                    id="outerEdgePath"
                    d="M 150 400 C 150 400, 300 550, 500 500 C 700 450, 750 250, 650 150"
                    stroke="url(#edgeGlow)"
                    strokeWidth="1.8"
                    fill="none"
                    filter="url(#softGlow)"
                  />
                  <path
                    d="M 150 400 C 150 400, 50 180, 150 80 C 250 -20, 400 50, 400 50"
                    stroke="url(#edgeGlow)"
                    strokeWidth="1.5"
                    fill="none"
                  />

                  {/* Highlight tracing along the edge geometry (Iteration 6.2 requirement) */}
                  {isMotionActive && (
                    <circle cx="0" cy="0" r="4" fill="#FFFFFF" filter="url(#softGlow)">
                      <animateMotion
                        path="M 150 400 C 150 400, 300 550, 500 500 C 700 450, 750 250, 650 150"
                        dur="9s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Two small luminous points on the edge */}
                  <circle cx="500" cy="500" r="2.5" fill="#B5E1E7" opacity="0.8" />
                  <circle cx="200" cy="100" r="2.5" fill="#FFFFFF" opacity="0.9" />

                  {/* Subtle Light reflection moving over the surface */}
                  <g className={isMotionActive ? "animate-[pulse_10s_ease-in-out_infinite]" : ""}>
                    <ellipse cx="500" cy="500" rx="42" ry="16" transform="rotate(-15 500 500)" fill="#FFFFFF" opacity="0.12" filter="url(#softGlow)" />
                    <ellipse cx="200" cy="100" rx="32" ry="12" transform="rotate(45 200 100)" fill="#B5E1E7" opacity="0.18" filter="url(#softGlow)" />
                  </g>
                </svg>
              </motion.div>
            </div>
          </div>

        </div>

        {/* ── GLOBAL MOTION PAUSE / RESUME CONTROL (Relocated to Safe Normal Flow) ── */}
        {/* Placed in a dedicated unclipped container at the bottom right of the hero with safe 20px padding */}
        <div className="flex justify-end items-center pt-8 sm:pt-12 relative z-30">
          <button
            type="button"
            onClick={togglePause}
            aria-label={isPaused ? "Lanjutkan animasi ambient Lab" : "Jeda animasi ambient Lab"}
            className="min-h-[44px] group inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.1] bg-[#070C12]/90 backdrop-blur-md text-xs font-mono text-[#ADBAC5] hover:text-[#F0F2ED] hover:border-white/25 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#B5E1E7]/40 shadow-sm"
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 text-[#B5E1E7]" />
                <span className="tracking-wide">Lanjutkan animasi</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-[#ADBAC5] group-hover:text-[#F0F2ED]" />
                <span className="tracking-wide">Jeda animasi</span>
              </>
            )}
          </button>
        </div>

      </div>
    </section>
  );
}
