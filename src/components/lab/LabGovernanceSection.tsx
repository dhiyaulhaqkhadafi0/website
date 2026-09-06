"use client";

import { useState } from "react";
import { Plus, Minus, ShieldCheck, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Lora } from "next/font/google";
import { SAFETY_CLASSES, AUTONOMY_LEVELS } from "@/lib/hcftl";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });
const CUBIC_EASE = [0.16, 1, 0.3, 1] as const;

export function LabGovernanceSection() {
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showAutonomyModal, setShowAutonomyModal] = useState(false);

  // Independent active reading states (Prinsip 6)
  const [activeSafetyTier, setActiveSafetyTier] = useState<string>("GREEN");
  const [activeAutonomyCode, setActiveAutonomyCode] = useState<string>("A0");

  return (
    <section id="prinsip" className="py-24 sm:py-32 md:py-40 relative overflow-hidden scroll-mt-24">
      <div id="safety" className="sr-only" aria-hidden="true" />
      <div id="keselamatan" className="sr-only" aria-hidden="true" />
      <div id="otonomi" className="sr-only" aria-hidden="true" />

      <div className="max-w-[1360px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

        {/* ── 2-Part Editorial Layout (Always Visible) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 mb-28 sm:mb-32">
          
          {/* Left: Stark Monumental Statement */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-10 font-mono text-[11px] tracking-[0.2em] text-[#ADBAC5] uppercase">
                <span>05</span>
                <span className="w-8 h-px bg-[#ADBAC5]/30" />
                <span>Tata Kelola & Keselamatan</span>
              </div>
              <h2 className={`${lora.className} text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal text-[#F0F2ED] tracking-tight leading-[1.05] mb-8`} style={{ letterSpacing: "-0.03em" }}>
                Manusia<br />
                Tetap<br />
                Memegang<br />
                <span className="text-[#ADBAC5] italic">Kendali.</span>
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#ADBAC5] font-light leading-relaxed max-w-md mt-auto hidden lg:block">
              Pemisahan mendasar antara tingkat kecerdasan dan tingkat otonomi. Kemampuan komputasi yang tinggi wajib diimbangi dengan batas pengawasan manusia yang ketat.
            </p>
          </div>

          {/* Right: Three Core Principles */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-base sm:text-lg text-[#ADBAC5] font-light leading-relaxed mb-10 lg:hidden">
              Pemisahan mendasar antara tingkat kecerdasan dan tingkat otonomi. Kemampuan komputasi yang tinggi wajib diimbangi dengan batas pengawasan manusia yang ketat.
            </p>

            <div className="space-y-0 border-t border-white/[0.08]">
              
              {/* Principle 1 */}
              <div className="py-8 border-b border-white/[0.08] grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8 group">
                <div className="sm:col-span-1 font-mono text-xs text-[#B5E1E7] mt-1 font-semibold">01</div>
                <div className="sm:col-span-4">
                  <h3 className="text-xl font-medium text-[#F0F2ED]">Kewenangan Manusia</h3>
                  <div className="mt-1.5 text-[10px] font-mono text-[#ADBAC5]/60 uppercase tracking-widest">
                    Human-in-the-Loop
                  </div>
                </div>
                <div className="sm:col-span-7 text-sm text-[#ADBAC5] font-light leading-relaxed">
                  Tindakan yang memiliki konsekuensi nyata pada dunia fisik wajib mempertahankan intervensi dan otorisasi manusia yang bermakna. Sistem AI tidak memegang kedaulatan mutlak atas eksekusi berisiko.
                </div>
              </div>

              {/* Principle 2 */}
              <div className="py-8 border-b border-white/[0.08] grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8 group">
                <div className="sm:col-span-1 font-mono text-xs text-[#B5E1E7] mt-1 font-semibold">02</div>
                <div className="sm:col-span-4">
                  <h3 className="text-xl font-medium text-[#F0F2ED]">Batas Penggunaan Jelas</h3>
                  <div className="mt-1.5 text-[10px] font-mono text-[#ADBAC5]/60 uppercase tracking-widest">
                    Red Lines
                  </div>
                </div>
                <div className="sm:col-span-7 text-sm text-[#ADBAC5] font-light leading-relaxed">
                  HCFTL menolak secara kategoris segala riset yang memungkinkan persenjataan, penargetan manusia secara otonom, rekayasa patogen, atau senjata siber ofensif yang merusak.
                </div>
              </div>

              {/* Principle 3 */}
              <div className="py-8 border-b border-white/[0.08] grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8 group">
                <div className="sm:col-span-1 font-mono text-xs text-[#B5E1E7] mt-1 font-semibold">03</div>
                <div className="sm:col-span-4">
                  <h3 className="text-xl font-medium text-[#F0F2ED]">Evaluasi Berlapis</h3>
                  <div className="mt-1.5 text-[10px] font-mono text-[#ADBAC5]/60 uppercase tracking-widest">
                    Safety Gate
                  </div>
                </div>
                <div className="sm:col-span-7 text-sm text-[#ADBAC5] font-light leading-relaxed">
                  Setiap proyek diklasifikasikan ke dalam matriks keselamatan GREEN, AMBER, atau RED serta skala otonomi A0–A5 sebelum satu baris kode dijalankan di luar lingkungan simulasi terisolasi.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Two Independent Disclosures with Active Reading Connectors ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 border-t border-white/[0.08] pt-16">

          {/* DISCLOSURE 1: Kerangka Keselamatan with Active Reading Guide */}
          <div className="flex flex-col justify-between">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#B5E1E7] uppercase tracking-widest mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Klasifikasi Batas Risiko Proyek</span>
              </div>
              <h3 className={`${lora.className} text-2xl sm:text-3xl font-normal text-[#F0F2ED] mb-3`}>
                Kerangka Keselamatan
              </h3>
              <p className="text-sm text-[#ADBAC5] font-light leading-relaxed max-w-sm">
                Penetapan protokol tinjauan sejak awal untuk memisahkan riset positif dari sistem fungsi ganda berisiko dan kapabilitas terlarang.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSafetyModal(!showSafetyModal)}
              aria-expanded={showSafetyModal}
              aria-controls="safety-framework-disclosure"
              className="min-h-[44px] inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 text-xs font-mono text-[#F0F2ED] transition-all cursor-pointer focus:outline-none w-fit"
            >
              <span className="w-5 h-5 rounded-full border border-white/15 flex items-center justify-center">
                {showSafetyModal ? <Minus className="w-3 h-3 text-[#B5E1E7]" /> : <Plus className="w-3 h-3 text-[#ADBAC5]" />}
              </span>
              <span>{showSafetyModal ? "Tutup kerangka keselamatan" : "Lihat kelas keselamatan (GREEN / AMBER / RED)"}</span>
            </button>

            <AnimatePresence>
              {showSafetyModal && (
                <motion.div
                  id="safety-framework-disclosure"
                  role="region"
                  aria-label="Rincian Kelas Keselamatan HCFTL"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: CUBIC_EASE }}
                  className="overflow-hidden"
                >
                  {/* Status Indicator */}
                  <div className="mt-8 pt-4 pb-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#ADBAC5]">
                    <span className="text-[#ADBAC5]/60 uppercase tracking-wider">Kategori yang dibaca:</span>
                    <span className="text-[#F0F2ED] font-semibold">{activeSafetyTier}</span>
                  </div>

                  {/* Active Reading Connector Guide */}
                  <div className="relative pl-7 border-l border-white/[0.08] space-y-6 text-left mt-4">
                    {SAFETY_CLASSES.map((sc) => {
                      const isSelected = activeSafetyTier === sc.tier;
                      const isGreen = sc.tier === "GREEN";
                      const isAmber = sc.tier === "AMBER";
                      
                      const colorStyle = isGreen ? "text-emerald-400" : isAmber ? "text-amber-400" : "text-rose-400";
                      const badgeBorder = isGreen ? "border-emerald-500/30 bg-emerald-950/30" : isAmber ? "border-amber-500/30 bg-amber-950/30" : "border-rose-500/30 bg-rose-950/30";
                      const dotColor = isGreen ? "#34D399" : isAmber ? "#FBBF24" : "#F87171";

                      return (
                        <div
                          key={sc.tier}
                          onClick={() => setActiveSafetyTier(sc.tier)}
                          className={`relative pb-6 border-b border-white/[0.06] last:border-b-0 cursor-pointer rounded-xl p-3 -ml-3 transition-colors ${
                            isSelected ? "bg-white/[0.03]" : "hover:bg-white/[0.015]"
                          }`}
                        >
                          {/* Active Connector Node in Gutter */}
                          <div
                            className={`absolute -left-[23px] top-6 w-3 h-3 rounded-full border transition-all ${
                              isSelected
                                ? "scale-125 shadow-[0_0_10px]"
                                : "border-white/20 bg-[#070C12]"
                            }`}
                            style={{
                              borderColor: isSelected ? dotColor : undefined,
                              backgroundColor: isSelected ? dotColor : undefined,
                              boxShadow: isSelected ? `0 0 10px ${dotColor}` : undefined,
                            }}
                          />

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                            <span className={`font-mono text-sm font-bold uppercase tracking-wider ${colorStyle}`}>
                              {sc.tier} — {sc.title}
                            </span>
                            <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${badgeBorder} ${colorStyle}`}>
                              {sc.posture}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#ADBAC5] font-light leading-relaxed mb-4">
                            {sc.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {sc.examples.map((ex) => (
                              <span key={ex} className="px-2.5 py-0.5 text-[10px] font-mono text-[#ADBAC5] bg-white/[0.03] border border-white/[0.06] rounded-full">
                                {ex}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DISCLOSURE 2: Skala Otonomi with Active Reading Connectors */}
          <div className="flex flex-col justify-between">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#B5E1E7] uppercase tracking-widest mb-3">
                <Cpu className="w-3.5 h-3.5" />
                <span>Batas Agensi & Kewenangan</span>
              </div>
              <h3 className={`${lora.className} text-2xl sm:text-3xl font-normal text-[#F0F2ED] mb-3`}>
                Skala Otonomi
              </h3>
              <p className="text-sm text-[#ADBAC5] font-light leading-relaxed max-w-sm">
                Tingkat A0 hingga A3 menjadi fokus riset default HCFTL. Tingkat A4 memerlukan tinjauan institusional khusus, sedangkan A5 berada di luar batas riset.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAutonomyModal(!showAutonomyModal)}
              aria-expanded={showAutonomyModal}
              aria-controls="autonomy-scale-disclosure"
              className="min-h-[44px] inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 text-xs font-mono text-[#F0F2ED] transition-all cursor-pointer focus:outline-none w-fit"
            >
              <span className="w-5 h-5 rounded-full border border-white/15 flex items-center justify-center">
                {showAutonomyModal ? <Minus className="w-3 h-3 text-[#B5E1E7]" /> : <Plus className="w-3 h-3 text-[#ADBAC5]" />}
              </span>
              <span>{showAutonomyModal ? "Tutup skala otonomi" : "Lihat skala otonomi lengkap (A0–A5)"}</span>
            </button>

            <AnimatePresence>
              {showAutonomyModal && (
                <motion.div
                  id="autonomy-scale-disclosure"
                  role="region"
                  aria-label="Rincian Skala Otonomi HCFTL"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: CUBIC_EASE }}
                  className="overflow-hidden"
                >
                  {/* Status Indicator */}
                  <div className="mt-8 pt-4 pb-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#ADBAC5]">
                    <span className="text-[#ADBAC5]/60 uppercase tracking-wider">Tingkat yang dibaca:</span>
                    <span className="text-[#B5E1E7] font-semibold">{activeAutonomyCode}</span>
                  </div>

                  {/* Active Sequential Connector for Autonomy */}
                  <div className="relative pl-7 border-l border-white/[0.08] space-y-6 text-left mt-4">
                    {AUTONOMY_LEVELS.map((al) => {
                      const isSelected = activeAutonomyCode === al.code;
                      const isCore = al.posture === "DEFAULT_FOCUS";
                      const isReview = al.posture === "ELEVATED_REVIEW";
                      const colorStyle = isCore ? "text-emerald-400" : isReview ? "text-amber-400" : "text-rose-400";
                      const badgeBorder = isCore ? "border-emerald-500/30 bg-emerald-950/30" : isReview ? "border-amber-500/30 bg-amber-950/30" : "border-rose-500/30 bg-rose-950/30";
                      
                      return (
                        <div
                          key={al.code}
                          onClick={() => setActiveAutonomyCode(al.code)}
                          className={`relative pb-6 border-b border-white/[0.06] last:border-b-0 cursor-pointer rounded-xl p-3 -ml-3 transition-colors ${
                            isSelected ? "bg-white/[0.03]" : "hover:bg-white/[0.015]"
                          }`}
                        >
                          {/* Active Connector Node in Gutter */}
                          <div
                            className={`absolute -left-[23px] top-5 w-3 h-3 rounded-full border transition-all ${
                              isSelected
                                ? "border-[#B5E1E7] bg-[#B5E1E7] scale-125 shadow-[0_0_10px_#B5E1E7]"
                                : "border-white/20 bg-[#070C12]"
                            }`}
                          />

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2.5 gap-2">
                            <span className={`font-mono text-sm font-bold uppercase tracking-wider ${colorStyle}`}>
                              {al.code} — {al.name}
                            </span>
                            <span className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${badgeBorder} ${colorStyle}`}>
                              {al.postureLabel}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#ADBAC5] font-light leading-relaxed">
                            {al.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
