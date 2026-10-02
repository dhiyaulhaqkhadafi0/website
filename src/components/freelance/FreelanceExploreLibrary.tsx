"use client";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SEARCH_CATEGORIES, searchFreelance, type FilterCategory } from "@/content/freelance-search";
import styles from "./discovery.module.css";
export type { FilterCategory } from "@/content/freelance-search";
export function FreelanceExploreLibrary({ searchQuery, onSearchChange, selectedCategory, onCategoryChange, full = false }: {
  searchQuery: string; onSearchChange: (query: string) => void; selectedCategory: FilterCategory;
  onCategoryChange: (category: FilterCategory) => void; full?: boolean;
}) {
  const active = full || Boolean(searchQuery.trim()) || selectedCategory !== "Semua";
  const results = searchFreelance(searchQuery, selectedCategory);
  const shown = full ? results : results.slice(0, 6);
  return <section id="explore-library" className={styles.searchSection}>
    {!full && <motion.div className={styles.searchHeading} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}><h2>Mau cari apa?</h2><p>Panduan, platform, dan sumber daya untuk langkah berikutnya dalam karier independenmu.</p></motion.div>}
    <form action="/freelance/cari" role="search" className={styles.searchForm}>
      <div className={styles.searchField}><Search size={19} aria-hidden="true" />
        <input aria-label="Cari di Freelance Hub" name="q" type="search" value={searchQuery} onChange={e => onSearchChange(e.target.value)} placeholder="Cari platform, skill, panduan, atau tools…" onKeyDown={e => { if (e.key === "Escape") onSearchChange(""); }} />
        <input type="hidden" name="category" value={selectedCategory} />
        {searchQuery && <button aria-label="Bersihkan pencarian" type="button" onClick={() => onSearchChange("")}><X size={18} /></button>}
        <button type="submit" aria-label="Lihat semua hasil pencarian"><ArrowRight size={19} /></button>
      </div>
    </form>
    <div className={styles.filters} aria-label="Kategori pencarian">{SEARCH_CATEGORIES.map(category => <button key={category} type="button" aria-pressed={selectedCategory === category} onClick={() => onCategoryChange(category)}>{category}</button>)}</div>
    {!full && <div className={styles.popular}><span className="py-2.5">Mulai dari:</span>{["kerja remote", "freelance pemula", "menulis", "portfolio", "AI tools"].map(term => <button type="button" key={term} onClick={() => onSearchChange(term)}>{term}</button>)}</div>}
    {active && <div className={styles.results}>
      <div className={styles.resultMeta}><span role="status" aria-live="polite">{results.length} hasil{searchQuery.trim() && <> untuk “{searchQuery.trim()}”</>}</span>{!full && <Link href={`/freelance/cari?q=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}`}>Lihat semua hasil ↗</Link>}</div>
      {shown.map(result => <Link className={styles.result} key={result.href} href={result.href}><small>{selectedCategory === "Lowongan" ? "Job board" : result.category}</small><div><h3>{result.title}</h3><p>{result.description}</p></div><ArrowRight size={18} aria-hidden="true" /></Link>)}
      {!results.length && <p className={styles.empty}>Belum ada hasil yang cocok. Coba “menulis”, “design”, atau nama platform; pilih Semua untuk memperluas pencarian.</p>}
      {selectedCategory === "Lowongan" && <p className="text-xs leading-6 text-[#89917b] mt-5">Hasil berupa platform pencarian kerja. Lowongan aktif dan aplikasi tersedia di situs masing-masing.</p>}
    </div>}
  </section>;
}
