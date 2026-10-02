import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { SearchResults } from "@/components/freelance/SearchResults";
import { SEARCH_CATEGORIES, type FilterCategory } from "@/content/freelance-search";
import styles from "@/components/freelance/discovery.module.css";
import directory from "@/components/freelance/directory.module.css";
import { DirectoryMotion } from "@/components/freelance/DirectoryMotion";
import { DirectoryVisual } from "@/components/freelance/DirectoryVisual";
export const metadata: Metadata = { title: "Cari di Freelance Hub", robots: { index: false, follow: true }, alternates: { canonical: "https://khadafidaffa.com/freelance/cari" } };
export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" && SEARCH_CATEGORIES.includes(params.category as FilterCategory) ? params.category as FilterCategory : "Semua";
  return <DirectoryMotion><Navbar/><header className={directory.hero}><div className={directory.container}><nav aria-label="Breadcrumb" className={directory.breadcrumb}><Link href="/freelance">Freelance</Link><span aria-hidden="true">/</span><span>Pencarian</span></nav><div className={directory.heroGrid}><div><span className={directory.kicker}>Freelance / Search Hub</span><h1>Cari arah berikutnya.</h1><p>Panduan, direktori platform, tools, dan resources dalam satu pencarian.</p><Link className={directory.heroLink} href="/freelance/direktori">Jelajahi seluruh direktori ↗</Link></div><DirectoryVisual/></div></div></header><div className={styles.paper}><SearchResults key={`${q}-${category}`} initialQuery={q} initialCategory={category}/></div></DirectoryMotion>;
}
