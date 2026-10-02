import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { SearchResults } from "@/components/freelance/SearchResults";
import { SEARCH_CATEGORIES, type FilterCategory } from "@/content/freelance-search";
import styles from "@/components/freelance/discovery.module.css";
export const metadata: Metadata = { title: "Cari di Freelance Hub", robots: { index: false, follow: true }, alternates: { canonical: "https://khadafidaffa.com/freelance/cari" } };
export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" && SEARCH_CATEGORIES.includes(params.category as FilterCategory) ? params.category as FilterCategory : "Semua";
  return <><Navbar/><header className={styles.pageHero}><div className={styles.container}><nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/freelance">Freelance</Link><span aria-hidden="true">/</span><span>Pencarian</span></nav><h1>Cari arah berikutnya.</h1><p>Panduan, direktori platform, tools, dan resources dalam satu pencarian.</p></div></header><div className={styles.paper}><SearchResults key={`${q}-${category}`} initialQuery={q} initialCategory={category}/></div></>;
}
