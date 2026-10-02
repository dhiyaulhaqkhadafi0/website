import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { DirectoryExplorer } from "@/components/freelance/DirectoryExplorer";
import { FREELANCE_PLATFORMS } from "@/content/freelance-directory";
import styles from "@/components/freelance/discovery.module.css";
export const metadata: Metadata = { title: "Direktori Platform Freelance & Remote", description: "Kenali platform freelance dan remote: bidang, biaya, cara kerja, serta pertimbangan sebelum melamar.", alternates: { canonical: "https://khadafidaffa.com/freelance/direktori" } };
export default function DirectoryPage() {
  return <><Navbar/><header className={styles.pageHero}><div className={styles.container}><nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/freelance">Freelance</Link><span aria-hidden="true">/</span><span>Direktori</span></nav><span className={styles.eyebrow}>Worldwide Freelancer / Discovery</span><h1>Temukan tempat.<br/>Bangun peluang.</h1><p>{FREELANCE_PLATFORMS.length} platform untuk menjelajahi kerja remote, proyek independen, dan dunia kreatif. Kenali cara kerjanya sebelum memutuskan tempat untuk mulai.</p></div></header><section className={styles.paper} aria-label="Daftar platform"><div className={styles.container}><Suspense fallback={<p>Memuat direktori platform…</p>}><DirectoryExplorer/></Suspense></div></section><section className={styles.darkCta}><div className={styles.container}><h2>Platform membantu. Bukti karya membuka pintu.</h2><p>Siapkan skill, offer, dan portfolio sebelum mengirim aplikasi pertama.</p><Link href="/freelance/belajar/mulai-freelance" className={styles.textLink}>Baca Mulai Freelance dari Nol ↗</Link></div></section></>;
}
