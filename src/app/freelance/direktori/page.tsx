import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { DirectoryExplorer } from "@/components/freelance/DirectoryExplorer";
import { DirectoryMotion } from "@/components/freelance/DirectoryMotion";
import { DirectoryVisual } from "@/components/freelance/DirectoryVisual";
import { ReadingProgress } from "@/components/freelance/ReadingProgress";
import { FREELANCE_PLATFORMS } from "@/content/freelance-directory";
import styles from "@/components/freelance/directory.module.css";
export const metadata: Metadata = { title: "Direktori Platform Freelance & Remote", description: "Kenali platform freelance dan remote: bidang, biaya, cara kerja, serta pertimbangan sebelum melamar.", alternates: { canonical: "https://khadafidaffa.com/freelance/direktori" } };
export default function DirectoryPage() {
  return <DirectoryMotion><Navbar/><ReadingProgress startId="directory-start" endId="directory-end" titleId="directory-title" label="Progres menjelajahi direktori"/>
    <header id="directory-start" className={styles.hero}><div className={styles.container}><nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/freelance">Freelance</Link><span aria-hidden="true">/</span><span>Direktori</span></nav><div className={styles.heroGrid}><div><span className={styles.kicker}>Worldwide Freelancer / Discovery</span><h1 id="directory-title" tabIndex={-1}>Temukan tempat.<br/>Bangun peluang.</h1><p>{FREELANCE_PLATFORMS.length} platform terkurasi untuk menjelajahi kerja remote, proyek independen, dan dunia kreatif. Kenali cara kerjanya sebelum memutuskan tempat untuk mulai.</p><a href="#directory-explore" className={styles.heroLink}>Jelajahi direktori <ArrowUpRight size={16} aria-hidden="true"/></a></div><DirectoryVisual/></div></div></header>
    <section id="directory-explore" className={styles.paper} aria-label="Daftar platform" style={{ scrollMarginTop: 90 }}><div className={styles.container}><Suspense fallback={<p>Direktori platform siap dijelajahi.</p>}><DirectoryExplorer/></Suspense></div></section>
    <section id="directory-end" className={styles.closing} data-reveal><div className={styles.container}><div><h2>Platform membantu.<br/>Bukti karya membuka pintu.</h2><p>Siapkan skill, offer, dan portfolio sebelum mengirim aplikasi pertama.</p></div><Link href="/freelance/belajar/mulai-freelance">Buka handbook WWF 01 <ArrowUpRight size={18} aria-hidden="true"/></Link></div></section>
  </DirectoryMotion>;
}
