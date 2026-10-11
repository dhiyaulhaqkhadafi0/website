import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { JobsExplorer } from "@/components/freelance/JobsExplorer";
import { activeRemoteJobs } from "@/content/freelance-jobs";
import s from "@/components/freelance/jobs.module.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Lowongan Remote Pilihan", description: "Kurasi lowongan individual dengan lokasi kandidat, tingkatan, tanggal pemeriksaan, dan tautan lamaran resmi. Terpisah dari direktori platform freelance.", alternates: { canonical: "https://khadafidaffa.com/freelance/jobs" } };
export default function JobsPage() {
  const jobs = activeRemoteJobs();
  return <><Navbar/><main className={s.page}><header className={s.hero}><div className={s.container}><nav className={s.breadcrumb} aria-label="Breadcrumb"><Link href="/freelance">Freelance</Link><span aria-hidden="true">/</span><span>Lowongan remote</span></nav><div className={s.heroGrid}><div><span className={s.eyebrow}>Independent work / Peluang pilihan</span><h1>Kerja dari mana saja.<br/><span>Mulai dari peranmu.</span></h1><p>Lowongan individual untuk langkah berikutnya. Baca pekerjaannya, kenali batas lokasinya, lalu melamar langsung melalui sumber resmi.</p><div className={s.heroActions}><a href="#jobs-list">Jelajahi lowongan ↓</a><Link href="/freelance/direktori">Mencari platform? Buka direktori ↗</Link></div></div><aside className={s.note}><span className={s.eyebrow}>Catatan kurasi / 01</span><strong>{String(jobs.length).padStart(2,"0")} peluang</strong><p>Kurasi awal dari Wikimedia Foundation. Semua peran saat ini membutuhkan pengalaman; belum ada listing pemula yang terverifikasi.</p><small>Sumber perusahaan · Pemeriksaan manual<br/>Indonesia tercantum pada daftar negara hiring.</small></aside></div></div></header><div className={s.container}><Suspense fallback={<p>Memuat kurasi lowongan…</p>}><JobsExplorer jobs={jobs}/></Suspense></div></main></>;
}
