"use client";

import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Sparkles, Clock, Calendar } from "lucide-react";
import { FREELANCE_NOTES, FreelanceNote } from "@/content/freelance-data";
import Link from "next/link";

export function FreelanceNotes() {
  return (
    <section id="notes" className="py-20 md:py-28 relative border-t border-white/[0.08] bg-[#020205]">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-xs font-mono uppercase tracking-wider text-brand-accent">
              <span>09 // FIELD DISPATCHES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Notes From The Journey
            </h2>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed">
              Tulisan reflektif dari balik layar. Bukan teori akademis abstrak, melainkan catatan langsung dari eksperimen koding, komunikasi klien, dan pembentukan sistem mandiri.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-accent hover:text-white transition-colors"
          >
            <span>Buka Semua Artikel di Blog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FREELANCE_NOTES.map((note, idx) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-brand-accent/40 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                {/* Meta */}
                <div className="flex items-center justify-between text-xs font-mono text-white/40 mb-3">
                  <span className="text-brand-accent font-semibold">{note.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{note.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{note.readTime}</span>
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-accent transition-colors leading-snug">
                  {note.title}
                </h3>

                <p className="text-sm text-white/60 leading-relaxed mb-6">
                  {note.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <Link
                  href={note.slug || "/blog"}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 group-hover:text-white transition-colors"
                >
                  <span>Baca Catatan</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-brand-accent" />
                </Link>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
