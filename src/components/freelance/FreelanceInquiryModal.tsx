"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, CheckCircle2, MessageSquare, Mail } from "lucide-react";

interface FreelanceInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export function FreelanceInquiryModal({
  isOpen,
  onClose,
  initialService = "AI-Assisted Product Development",
}: FreelanceInquiryModalProps) {
  const [selectedService, setSelectedService] = useState(initialService);
  const [timeline, setTimeline] = useState("1–2 Minggu (Sprint)");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [brief, setBrief] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const services = [
    "AI-Assisted Product Development",
    "Product & UI/UX Design System",
    "Digital Growth & Landing Systems",
    "Custom Discovery / Consultation",
  ];

  const timelines = [
    "1–2 Minggu (Sprint)",
    "2–4 Minggu (Full MVP)",
    "Ongoing Monthly Retainer",
    "Masih Eksplorasi / Fleksibel",
  ];

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Halo Khadafi, saya ingin mendiskusikan proyek.\n\n` +
      `*Nama:* ${name || "Klien"}\n` +
      `*Kontak:* ${contact || "-"}\n` +
      `*Layanan:* ${selectedService}\n` +
      `*Timeline:* ${timeline}\n` +
      `*Detail Kebutuhan:*\n${brief || "Tertarik berkolaborasi untuk pengembangan produk digital."}`
    );
    window.open(`https://wa.me/6285156557672?text=${text}`, "_blank");
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
      `Ringkasan Proyek:\n${brief}\n\nSalam,\n${name}`
    );
    window.location.href = `mailto:daffadhiyaulhaqkhadafi@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#020205]/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
            className="relative w-full max-w-xl bg-[#090D16] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-10 my-8 overflow-hidden text-left"
          >
            {/* Ambient Accent Light */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Inquiry Terkirim!</h3>
                <p className="text-white/60 text-sm max-w-sm mx-auto leading-relaxed">
                  Terima kasih sudah menghubungi. Aku akan merespons dalam 1x24 jam untuk menjadwalkan 15-min discovery call santai.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      onClose();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all"
                  >
                    Tutup Jendela
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                    Open for 1–2 Projects
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                  Mari Bangun Sesuatu.
                </h2>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                  Ceritakan ide produk, MVP, atau sistem landing yang ingin kamu wujudkan. Aku mengutamakan eksekusi cepat dan arsitektur yang defensibel.
                </p>

                <form onSubmit={handleWhatsAppSubmit} className="space-y-5">
                  {/* Select Service */}
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                      Pilihan Layanan
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {services.map((srv) => (
                        <button
                          type="button"
                          key={srv}
                          onClick={() => setSelectedService(srv)}
                          className={`text-left text-xs p-3 rounded-xl border transition-all ${
                            selectedService === srv
                              ? "bg-brand-accent/20 border-brand-accent text-white font-semibold shadow-[0_0_15px_rgba(129,140,248,0.2)]"
                              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {srv}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Timeline */}
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                      Target Timeline
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {timelines.map((tl) => (
                        <button
                          type="button"
                          key={tl}
                          onClick={() => setTimeline(tl)}
                          className={`text-center text-[11px] p-2 rounded-lg border transition-all ${
                            timeline === tl
                              ? "bg-indigo-500/20 border-indigo-400 text-white font-semibold"
                              : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                          }`}
                        >
                          {tl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                        Nama / Brand
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex (Founder)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                        Kontak (Email / WhatsApp)
                      </label>
                      <input
                        type="text"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="alex@startup.com / 0812..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-accent transition-colors"
                      />
                    </div>
                  </div>

                  {/* Brief */}
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                      Ringkasan Proyek / Masalah yang Ingin Diselesaikan
                    </label>
                    <textarea
                      rows={3}
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      placeholder="Jelaskan secara singkat apa yang ingin kamu bangun, fitur utama, atau inspirasi produk..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-accent transition-colors resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Kirim via WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={handleEmailSubmit}
                      className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 font-semibold text-sm flex items-center justify-center gap-2 border border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Mail className="w-4 h-4" />
                      Kirim via Email
                    </button>
                  </div>
                  <p className="text-center text-[11px] text-white/40">
                    Semua diskusi bersifat rahasia (NDA ready). Respon langsung dalam 24 jam.
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
