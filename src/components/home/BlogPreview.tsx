"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { BlogCardItem } from "@/lib/mdx";

interface BlogPreviewProps {
  posts: BlogCardItem[];
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  return (
    <section className="relative py-24 px-4 sm:px-6 bg-[#08090e] border-t border-white/5">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="max-w-xl">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold mb-2 block">
              The Digital Grimoire
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Latest Insights
            </h2>
            <p className="text-base text-slate-400 mt-3 font-normal leading-relaxed">
              Catatan mendalam, eksperimen teknis, dan pelajaran lapangan seputar AI, rekayasa produk, dan bisnis digital.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-semibold text-xs sm:text-sm border border-white/15 transition-all"
          >
            <span>Read All Insights</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {posts.slice(0, 3).map((post, idx) => (
            <motion.article
              key={post.metadata.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-7 rounded-3xl bg-[#0c0d14] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4 text-xs font-mono text-slate-400">
                  <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-emerald-300 uppercase tracking-wider text-[10.5px]">
                    {post.metadata.category || "Insight"}
                  </span>
                  {post.metadata.readingTime && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{post.metadata.readingTime} min read</span>
                    </span>
                  )}
                </div>

                <Link href={`/blog/${post.metadata.slug}`}>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {post.metadata.title}
                  </h3>
                </Link>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal line-clamp-3 mb-6">
                  {post.metadata.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">
                  {post.metadata.date}
                </span>

                <Link
                  href={`/blog/${post.metadata.slug}`}
                  className="font-semibold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                  <span>Baca Esai</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
