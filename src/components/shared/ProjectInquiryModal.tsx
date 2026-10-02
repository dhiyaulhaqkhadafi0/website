"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CheckCircle2, MessageSquare, Mail } from "lucide-react";

export interface ProjectInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export function ProjectInquiryModal({
  isOpen,
  onClose,
  initialService = "AI-Assisted Product Development",
}: ProjectInquiryModalProps) {
  const [prevInitial, setPrevInitial] = useState(initialService);
  const [selectedService, setSelectedService] = useState(initialService);
  const [timeline, setTimeline] = useState("1–2 Minggu (Sprint)");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [brief, setBrief] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (initialService !== prevInitial) {
    setPrevInitial(initialService);
    setSelectedService(initialService);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const services = [
    "AI-Assisted Product Development",
    "Web & MVP Development",
    "AI Workflow & Automation",
    "Product & UX Strategy",
    "Konsultasi / Eksplorasi Ide",
  ];

  const timelines = [
    "1–2 Minggu (Sprint)",
    "2–4 Minggu (Full MVP)",
    "Retainer Bulanan",
    "Fleksibel / Diskusi Awal",
  ];

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Halo Khadafi, saya ingin mendiskusikan proyek baru.\n\n` +
      `*Nama:* ${name || "Klien"}\n` +
      `*Kontak:* ${contact || "-"}\n` +
      `*Layanan:* ${selectedService}\n` +
      `*Target Timeline:* ${timeline}\n` +
      `*Ringkasan Kebutuhan:*\n${brief || "Tertarik berkolaborasi untuk pengembangan produk digital / AI."}`
    );
    window.open(`https://wa.me/6281946838791?text=${text}`, "_blank");
    setSubmitted(true);
  };

  const handleEmailSubmit = () => {
    const subject = encodeURIComponent(`[Project Inquiry] ${selectedService} — ${name || "Partner"}`);
    const body = encodeURIComponent(
      `Halo Khadafi,\n\nSaya tertarik berdiskusi mengenai proyek:\n\n` +
      `Nama: ${name}\n` +
      `Kontak: ${contact}\n` +
      `Layanan: ${selectedService}\n` +
      `Target Timeline: ${timeline}\n\n` +
      `Ringkasan Kebutuhan:\n${brief || "-"}\n\nTerima kasih.`
    );
    window.location.href = `mailto:daffadhiyaulhaqkhadafi@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const resetForm = () => {
    setName("");
    setContact("");
    setBrief("");
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-[#141513] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-[#ECEDE7] my-auto"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              aria-label="Tutup jendela inquiry"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Pesan Terbuka!</h3>
                <p className="text-white/60 text-sm max-w-sm mx-auto mb-6">
                  Detail inquiry proyek Anda telah disiapkan. Mari lanjutkan obrolan via WhatsApp atau Email untuk membahas brief lebih rinci.
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-white/90 transition-colors"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start A Project — Khadafi Business OS</span>
                </div>
                <h3 id="inquiry-modal-title" className="text-2xl font-bold tracking-tight mb-2">
                  Mulai Kolaborasi Proyek
                </h3>
                <p className="text-xs sm:text-sm text-white/60 mb-6">
                  Ceritakan ide produk, MVP, automasi AI, atau kebutuhan arsitektur Anda. Saya akan merespons dalam 1x24 jam.
                </p>

                <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                  {/* Service Selection */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                      Layanan yang Dibutuhkan
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {services.map((svc) => (
                        <button
                          key={svc}
                          type="button"
                          onClick={() => setSelectedService(svc)}
                          className={`text-left px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                            selectedService === svc
                              ? "bg-white/15 border-white text-white font-bold"
                              : "bg-white/[0.02] border-white/5 text-white/60 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          {svc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                      Estimasi Timeline Target
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {timelines.map((tm) => (
                        <button
                          key={tm}
                          type="button"
                          onClick={() => setTimeline(tm)}
                          className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-center ${
                            timeline === tm
                              ? "bg-white/15 border-white text-white font-bold"
                              : "bg-white/[0.02] border-white/5 text-white/60 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          {tm}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1">
                        Nama / Nama Organisasi
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Alex / Tech Startup"
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1">
                        Kontak (Email / No. HP)
                      </label>
                      <input
                        type="text"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="alex@domain.com / +62..."
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
                      />
                    </div>
                  </div>

                  {/* Brief */}
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">
                      Ringkasan Kebutuhan Proyek
                    </label>
                    <textarea
                      rows={3}
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      placeholder="Jelaskan gambaran masalah, fitur utama MVP, atau target yang ingin dicapai..."
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Kirim via WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={handleEmailSubmit}
                      className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Kirim via Email
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
