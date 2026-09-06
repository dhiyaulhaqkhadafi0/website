"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUp, Plus, Minus, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Lora } from "next/font/google";
import { LabSectionHeader } from "./LabSectionHeader";
import { HCFTLWordmark } from "./HCFTLWordmark";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });
const CUBIC_EASE = [0.16, 1, 0.3, 1] as const;

const RELEASE_MODELS = [
  {
    num: "01",
    title: "Open Research",
    desc: "Transparansi penuh pada metode, arsitektur eksperimen, catatan kegagalan, dan evaluasi empiris.",
    policy:
      "Setiap eksperimen yang rampung wajib menerbitkan data metodologis, parameter uji, dan batasan operasional agar dapat ditelaah secara independen oleh komunitas ilmiah.",
  },
  {
    num: "02",
    title: "Open Source",
    desc: "Perangkat lunak dan alat uji didistribusikan di bawah lisensi sumber terbuka yang sah.",
    policy:
      "Perangkat lunak, antarmuka pengujian, dan modul simulasi berkategori GREEN dirilis di bawah lisensi MIT atau Apache 2.0 untuk mendorong replikasi dan inovasi terbuka.",
  },
  {
    num: "03",
    title: "Controlled Release",
    desc: "Kapabilitas berkemampuan ganda tinggi atau aktuasi fisik berisiko dilepas secara bertahap.",
    policy:
      "Model dengan agensi otonom tinggi atau berpotensi fungsi ganda (AMBER) tunduk pada masa embargo evaluasi keselamatan dan hanya dirilis setelah audit batas risiko tuntas.",
  },
];

export function LabFounderSection() {
  const [showFounderNarrative, setShowFounderNarrative] = useState(false);
  const [expandedReleaseModel, setExpandedReleaseModel] = useState<string | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleReleaseModel = (num: string) => {
    setExpandedReleaseModel((prev) => (prev === num ? null : num));
  };

  return (
    <section id="founder" className="py-24 sm:py-32 md:py-40 relative overflow-hidden scroll-mt-24">
      <div id="filosofi" className="sr-only" aria-hidden="true" />

      <div className="max-w-[1360px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header with Staggered Entrance */}
        <LabSectionHeader
          number="07"
          label="Profil & Filosofi"
          title="Riset Terbuka & Kepemimpinan"
          className="mb-14 sm:mb-16"
        />

        {/* ── Founder Profile: Full Width Name on Desktop (Iteration 6.2) ── */}
        <div className="border-b border-white/[0.08] pb-24 sm:pb-32 mb-28">
          
          {/* Full Single-Line Heading across Wide Desktop */}
          <div className="mb-10">
            <h3 className={`${lora.className} text-4xl sm:text-5xl md:text-6xl lg:text-[58px] xl:text-[70px] font-normal text-[#F0F2ED] tracking-tight leading-[1.1] lg:whitespace-nowrap`}>
              Daffa Dhiyaulhaq Khadafi.
            </h3>
            <div className="text-xs sm:text-sm font-mono text-[#B5E1E7] uppercase tracking-widest mt-4 flex items-center gap-3">
              <span>Founder & Research Director</span>
              <span className="text-[#ADBAC5]/40">—</span>
              <HCFTLWordmark size="xs" variant="silver" />
            </div>
          </div>

          {/* Grid below the name: Narrative & Links (Left 8 cols) vs Institutional Metadata (Right 4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                {/* Always Visible Intro */}
                <p className="text-lg sm:text-xl text-[#ADBAC5] font-light leading-relaxed max-w-2xl mb-8">
                  AI-Assisted Product Engineer yang mengeksplorasi bagaimana tim kecil dengan augmentasi AI dapat berpartisipasi secara bermakna dalam pengembangan teknologi frontier—beroperasi dengan keketatan institusional, tata kelola keselamatan, dan bukti yang terverifikasi.
                </p>

                {/* Disclosure Trigger: 'Tentang pendiri' */}
                <div className="mb-10">
                  <button
                    type="button"
                    onClick={() => setShowFounderNarrative(!showFounderNarrative)}
                    aria-expanded={showFounderNarrative}
                    aria-controls="founder-long-narrative"
                    className="min-h-[44px] group inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-[#ADBAC5] hover:text-[#F0F2ED] transition-colors focus:outline-none cursor-pointer py-1"
                  >
                    <span className="w-5 h-5 rounded-full border border-white/10 bg-white/[0.02] group-hover:border-white/20 flex items-center justify-center transition-colors">
                      {showFounderNarrative ? <Minus className="w-3 h-3 text-[#B5E1E7]" /> : <Plus className="w-3 h-3 text-[#ADBAC5]" />}
                    </span>
                    <span>{showFounderNarrative ? "Tutup detail narasi" : "Tentang pendiri"}</span>
                  </button>

                  <AnimatePresence>
                    {showFounderNarrative && (
                      <motion.div
                        id="founder-long-narrative"
                        role="region"
                        aria-label="Narasi Rinci Pendiri HCFTL"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28, ease: CUBIC_EASE }}
                        className="overflow-hidden border-t border-white/[0.06] mt-4 pt-6 max-w-2xl text-left"
                      >
                        <div className="space-y-4 text-sm text-[#ADBAC5] font-light leading-relaxed">
                          <p>
                            Didorong oleh keyakinan bahwa masa depan kecerdasan buatan bukan hanya milik korporasi skala raksasa, Daffa mendirikan HCFTL sebagai ruang riset independen yang bebas dari tekanan komersialisasi instan.
                          </p>
                          <p>
                            Dengan mengombinasikan latar belakang rekayasa produk digital dan ketertarikan mendalam pada sistem otonom fisik, fokusnya adalah memastikan inovasi teknologi tingkat lanjut dibangun dengan arsitektur yang transparan, dapat diaudit secara ilmiah, dan selalu menempatkan kesejahteraan manusia di pusat setiap algoritma.
                          </p>
                          <p className="font-mono text-xs text-[#B5E1E7]/80">
                            Prinsip Operasional: Kualitas bukti ilmiah melampaui sensasionalisme demonstrasi.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Navigation Buttons (Min 44px touch targets) */}
              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2.5 px-6 h-12 rounded-full bg-[#F0F2ED] text-[#070C12] text-xs font-mono font-medium hover:bg-white transition-all shadow-sm active:scale-[0.98]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Beranda Personal</span>
                </Link>

                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full bg-transparent border border-white/[0.1] hover:bg-white/[0.04] text-xs font-mono text-[#ADBAC5] hover:text-[#F0F2ED] transition-all active:scale-[0.98]"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Membaca Tulisan di Blog</span>
                </Link>
              </div>
            </div>

            {/* Institutional Metadata (Right Column) */}
            <div className="lg:col-span-4 flex flex-col justify-start">
              <div className="space-y-4 font-mono text-xs border border-white/[0.08] bg-[#070C12] p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                <div className="pb-3 border-b border-white/[0.06]">
                  <div className="text-[#ADBAC5]/60 uppercase tracking-widest text-[10px] mb-1">Inisiatif</div>
                  <div className="text-[#F0F2ED] font-medium">Riset Independen</div>
                </div>
                <div className="pb-3 border-b border-white/[0.06]">
                  <div className="text-[#ADBAC5]/60 uppercase tracking-widest text-[10px] mb-1">Fase Aktual</div>
                  <div className="text-[#B5E1E7] font-medium">Fondasi v1.0</div>
                </div>
                <div className="pb-3 border-b border-white/[0.06]">
                  <div className="text-[#ADBAC5]/60 uppercase tracking-widest text-[10px] mb-1">Tahun Berdiri</div>
                  <div className="text-[#F0F2ED]">2026</div>
                </div>
                <div>
                  <div className="text-[#ADBAC5]/60 uppercase tracking-widest text-[10px] mb-1">Stasiun Riset</div>
                  <div className="text-[#F0F2ED]">HCFTL-JKT-HQ-01</div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ── 3 Pillars of Release Philosophy ── */}
        <div className="mb-28 sm:mb-32">
          <div className="flex items-center justify-between mb-10 border-b border-white/[0.08] pb-4">
            <h4 className="font-mono text-xs text-[#F0F2ED] uppercase tracking-widest">
              Model Rilis Riset
            </h4>
            <span className="text-[10px] font-mono text-[#ADBAC5]/60 uppercase tracking-wider hidden sm:inline">
              Transparansi & Tanggung Jawab
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {RELEASE_MODELS.map((item) => {
              const isPolicyOpen = expandedReleaseModel === item.num;

              return (
                <div
                  key={item.num}
                  className="border-t border-white/[0.1] pt-6 relative group hover:border-[#B5E1E7]/40 transition-colors"
                >
                  <span className="font-mono text-[11px] text-[#ADBAC5]/60 block mb-3 group-hover:text-[#B5E1E7] transition-colors">
                    {item.num}
                  </span>
                  <h5 className="text-xl font-medium text-[#F0F2ED] mb-3">
                    {item.title}
                  </h5>
                  <p className="text-sm text-[#ADBAC5] font-light leading-relaxed mb-4">
                    {item.desc}
                  </p>

                  {/* Policy Disclosure Trigger */}
                  <button
                    type="button"
                    onClick={() => toggleReleaseModel(item.num)}
                    aria-expanded={isPolicyOpen}
                    aria-controls={`policy-detail-${item.num}`}
                    className="min-h-[44px] inline-flex items-center gap-2 text-xs font-mono text-[#ADBAC5] hover:text-[#F0F2ED] transition-colors focus:outline-none cursor-pointer"
                  >
                    <span className="w-4 h-4 rounded-full border border-white/10 flex items-center justify-center">
                      {isPolicyOpen ? <Minus className="w-2.5 h-2.5 text-[#B5E1E7]" /> : <Plus className="w-2.5 h-2.5 text-[#ADBAC5]" />}
                    </span>
                    <span>{isPolicyOpen ? "Tutup rincian kebijakan" : "Lihat kebijakan rilis"}</span>
                  </button>

                  <AnimatePresence>
                    {isPolicyOpen && (
                      <motion.div
                        id={`policy-detail-${item.num}`}
                        role="region"
                        aria-label={`Kebijakan Rilis ${item.title}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden border-t border-white/[0.06] mt-3 pt-3 text-left"
                      >
                        <p className="text-xs text-[#ADBAC5]/90 font-light leading-relaxed">
                          {item.policy}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Editorial Closing Quote with Warm Graphite Tapering ── */}
        <div className="text-center max-w-4xl mx-auto py-24 sm:py-32 border-t border-white/[0.08] relative">
          <blockquote className={`${lora.className} text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-normal text-[#F0F2ED] leading-[1.1] tracking-tight mb-6`}>
            &ldquo;Masa depan teknologi tidak seharusnya berjalan meninggalkan manusia.&rdquo;
          </blockquote>
          <p className={`${lora.className} text-xl sm:text-2xl md:text-3xl font-light text-[#ADBAC5] italic`}>
            &ldquo;Ia harus tumbuh bersama manusia.&rdquo;
          </p>
        </div>

        {/* ── Institutional Footer ── */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs text-[#ADBAC5]/60">
          <div className="flex flex-col sm:flex-row items-center gap-3.5 text-center sm:text-left">
            <HCFTLWordmark size="xs" variant="silver" />
            <span className="hidden sm:inline text-white/20">|</span>
            <span>© 2026 HCFTL — Human Centered Frontier Technology Lab.</span>
            <span className="hidden md:inline text-white/20">|</span>
            <span className="hidden md:inline">Sitasi ilmiah non-komersial diizinkan dengan atribusi.</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="min-h-[44px] flex items-center gap-2 text-[#ADBAC5] hover:text-[#F0F2ED] transition-colors uppercase tracking-widest text-[10px] cursor-pointer"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
