"use client";

import { useState } from "react";
import { Plus, Minus, CheckCircle, Clock, CircleDot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Lora } from "next/font/google";
import { LabSectionHeader } from "./LabSectionHeader";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });
const CUBIC_EASE = [0.16, 1, 0.3, 1] as const;

export function LabProgressSection() {
  const [showExperimentDetail, setShowExperimentDetail] = useState(false);

  return (
    <section id="perkembangan" className="py-24 sm:py-32 md:py-40 relative overflow-hidden scroll-mt-24">
      <div id="registry" className="sr-only" aria-hidden="true" />
      <div id="research" className="sr-only" aria-hidden="true" />

      <div className="max-w-[1360px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

        {/* Section Header with Staggered Entrance */}
        <LabSectionHeader
          number="06"
          label="Jurnal Perkembangan"
          title={
            <>
              Fase 0: <span className="text-[#ADBAC5] italic">Fondasi Institusional.</span>
            </>
          }
          description="Kami tidak mengoptimalkan jumlah demo atau rilis cepat. Prioritas saat ini adalah menetapkan doktrin keselamatan, hierarki tata kelola, dan sistem evaluasi bukti sebelum meluncurkan eksperimen pertama."
          className="mb-20 sm:mb-24"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
          
          {/* ── Milestones (Left Column) ── */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="font-mono text-xs text-[#F0F2ED] uppercase tracking-widest mb-8 border-b border-white/[0.08] pb-4">
                Milestone & Capaian
              </h3>
              
              <div className="space-y-6">
                {/* Completed Milestone */}
                <div className="flex gap-4 group">
                  <div className="mt-1">
                    <CheckCircle className="w-4 h-4 text-[#B5E1E7]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[#F0F2ED] font-medium text-base">Ratifikasi Blueprint Lab v1.0</h4>
                      <span className="text-[9px] font-mono text-[#B5E1E7] border border-[#B5E1E7]/30 px-2 py-0.5 rounded-full uppercase">Selesai</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#ADBAC5] font-light leading-relaxed">Dokumen arsitektur institusional awal telah disahkan dan dipublikasikan secara terbuka.</p>
                  </div>
                </div>

                {/* In-Progress Milestone */}
                <div className="flex gap-4 group">
                  <div className="mt-1">
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[#F0F2ED] font-medium text-base">Penyusunan Public Safety Charter</h4>
                      <span className="text-[9px] font-mono text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase">Aktif</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#ADBAC5] font-light leading-relaxed">Penetapan kebijakan rilis bertanggung jawab, red lines riset, dan protokol penghentian darurat.</p>
                  </div>
                </div>

                {/* Upcoming Milestone */}
                <div className="flex gap-4 group">
                  <div className="mt-1">
                    <CircleDot className="w-4 h-4 text-[#ADBAC5]/40" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[#ADBAC5] font-medium text-base">Perumusan Piagam Experiment 001</h4>
                      <span className="text-[9px] font-mono text-[#ADBAC5]/60 border border-white/[0.08] px-2 py-0.5 rounded-full uppercase">Berikutnya</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#ADBAC5]/70 font-light leading-relaxed">Mendefinisikan hipotesis empiris pertama dalam lingkungan simulasi digital kembar terisolasi.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/[0.06] mt-8 font-mono text-xs text-[#ADBAC5]/60">
              Prinsip: No unverified claims before experimental reproducibility.
            </div>
          </div>

          {/* ── Experiment 001 & Publications (Right Column) ── */}
          <div className="lg:col-span-7 space-y-14">
            
            {/* Experiment 001 with Dual-Layer Disclosure */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#070C12] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="font-mono text-xs text-[#F0F2ED] uppercase tracking-widest">
                  Eksperimen Aktif
                </span>
                <span className="text-xs font-mono text-amber-400 border border-amber-400/30 bg-amber-950/20 px-3 py-1 rounded-full">
                  Dalam Perumusan
                </span>
              </div>

              <h4 className={`${lora.className} text-2xl font-normal text-[#F0F2ED] mb-3`}>
                Experiment 001: Autonomous Agent Sandbox
              </h4>

              <p className="text-sm sm:text-base text-[#ADBAC5] font-light leading-relaxed mb-6">
                Rencana eksplorasi koordinasi multi-agen heterogen dalam kotak pasir digital kembar terisolasi. Eksperimen ini memvalidasi mitigasi kegagalan sistem terdistribusi tanpa membutuhkan kewenangan tak terbatas di dunia fisik.
              </p>

              {/* Factual Tag Line (Always Visible) */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#ADBAC5]/80 pb-6 border-b border-white/[0.06]">
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/30 border border-emerald-500/20 text-emerald-400">KELAS: GREEN</span>
                <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08]">TARGET: LEVEL 03</span>
                <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08]">OTONOMI: A3 (BOUNDED)</span>
              </div>

              {/* Disclosure Trigger: 'Baca rancangan eksperimen' */}
              <div className="pt-5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowExperimentDetail(!showExperimentDetail)}
                  aria-expanded={showExperimentDetail}
                  aria-controls="experiment-001-proposal"
                  className="min-h-[44px] group inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-[#ADBAC5] hover:text-[#F0F2ED] transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-full border border-white/10 bg-white/[0.02] group-hover:border-white/20 flex items-center justify-center transition-colors">
                    {showExperimentDetail ? <Minus className="w-3 h-3 text-[#B5E1E7]" /> : <Plus className="w-3 h-3 text-[#ADBAC5]" />}
                  </span>
                  <span>{showExperimentDetail ? "Tutup rancangan eksperimen" : "Baca rancangan eksperimen"}</span>
                </button>
              </div>

              {/* Expandable Proposal Content */}
              <AnimatePresence>
                {showExperimentDetail && (
                  <motion.div
                    id="experiment-001-proposal"
                    role="region"
                    aria-label="Proposal Rinci Experiment 001"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: CUBIC_EASE }}
                    className="overflow-hidden border-t border-white/[0.06] mt-5 pt-5 text-left"
                  >
                    <div className="space-y-4 text-xs sm:text-sm text-[#ADBAC5] font-light leading-relaxed">
                      <div>
                        <span className="font-mono text-[10px] text-[#B5E1E7] uppercase tracking-widest block mb-1">
                          01 — Hipotesis Kerja
                        </span>
                        <p>
                          Agen-agen cerdas dengan spesialisasi tugas heterogen dapat mencapai konsensus mitigasi gangguan infrastruktur 40% lebih cepat daripada sistem deterministik murni tanpa melanggar batasan keamanan formal.
                        </p>
                      </div>

                      <div>
                        <span className="font-mono text-[10px] text-[#B5E1E7] uppercase tracking-widest block mb-1">
                          02 — Lingkungan Eksekusi
                        </span>
                        <p>
                          Kotak pasir virtual berbasis representasi digital twin tertutup; koneksi eksternal ke jaringan publik dan aktuasi fisik nyata diblokir secara kriptografis pada tingkat kernel simulasi.
                        </p>
                      </div>

                      <div>
                        <span className="font-mono text-[10px] text-[#B5E1E7] uppercase tracking-widest block mb-1">
                          03 — Pengaman & Intervensi (Kill-Switch)
                        </span>
                        <p>
                          Protokol penghentian darurat satu tombol yang dapat diakses operator manusia setiap detik, menjamin eksekusi dapat dibatalkan seketika jika terdeteksi anomali perilaku di luar amplop A3.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Factual Research Archives (Empty State with Institutional Integrity) */}
            <div>
              <h3 className="font-mono text-xs text-[#F0F2ED] uppercase tracking-widest mb-6 border-b border-white/[0.08] pb-4">
                Arsip Riset & Publikasi
              </h3>
              
              <div className="space-y-1">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 py-3.5 border-b border-white/[0.04] text-xs font-mono">
                  <div className="sm:col-span-4 text-[#ADBAC5]/60 uppercase tracking-wider">Research Notes</div>
                  <div className="sm:col-span-8 text-[#ADBAC5]/50 italic">Belum ada dokumen publikasi.</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 py-3.5 border-b border-white/[0.04] text-xs font-mono">
                  <div className="sm:col-span-4 text-[#ADBAC5]/60 uppercase tracking-wider">Formal Publications</div>
                  <div className="sm:col-span-8 text-[#ADBAC5]/50 italic">Belum ada makalah ilmiah sejawat.</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 py-3.5 border-b border-white/[0.04] text-xs font-mono">
                  <div className="sm:col-span-4 text-[#ADBAC5]/60 uppercase tracking-wider">Open Research Releases</div>
                  <div className="sm:col-span-8 text-[#ADBAC5]/50 italic">Belum ada paket reproduksi data terilis.</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 py-3.5 border-b border-white/[0.04] text-xs font-mono">
                  <div className="sm:col-span-4 text-[#ADBAC5]/60 uppercase tracking-wider">Failure Records</div>
                  <div className="sm:col-span-8 text-[#ADBAC5]/50 italic">Belum ada anomali atau kegagalan tercatat.</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
