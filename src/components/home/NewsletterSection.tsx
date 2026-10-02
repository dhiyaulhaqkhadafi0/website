"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, Sparkles, Send } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate lightweight client submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 bg-[#050609] border-t border-white/5">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="p-8 sm:p-12 md:p-14 rounded-3xl bg-gradient-to-b from-[#0e0f18] to-[#0a0b12] border border-white/10 relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Weekly Dispatch</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
              One useful thing every week.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-8">
              Pelajaran membangun produk AI, alur kerja vibe coding, strategi freelance mandiri, dan catatan hal yang sedang saya bangun langsung di inbox Anda.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-center gap-3"
              >
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span className="text-sm font-semibold">
                  Terima kasih! Anda telah terdaftar untuk menerima dispatch mingguan.
                </span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan alamat email Anda..."
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-400/60 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3.5 bg-white text-black hover:bg-slate-100 rounded-xl font-bold text-sm transition-all shadow-lg shrink-0 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <span>{loading ? "Memproses..." : "Join Newsletter"}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-1">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nomor WhatsApp (Opsional, untuk notifikasi langsung)"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/5 text-white/80 placeholder:text-slate-600 text-xs focus:outline-none focus:border-white/20 transition-colors"
                  />
                </div>

                <p className="text-[11px] font-mono text-slate-500 mt-2">
                  No spam. Unsubscribe anytime. 100% curated insights.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
