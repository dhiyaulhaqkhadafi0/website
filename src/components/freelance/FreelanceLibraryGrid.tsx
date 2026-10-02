"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FEATURED_PLATFORMS } from "@/content/freelance-directory";
import { RESOURCES_DATA } from "@/content/resources-data";
import styles from "./discovery.module.css";
import { PlatformLogo } from "./PlatformLogo";
export function FreelanceLibraryGrid() {
  return <section className={styles.library} aria-label="Perpustakaan freelance">
    <div className={styles.featureGrid}>
      <motion.article id="card-belajar" className={styles.feature} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}><span className={styles.eyebrow}>01 / Worldwide Freelancer</span><h2>Mulai Freelance dari Nol.</h2><p>Bangun fondasi sebelum mengejar peluang. Dari memilih skill dan merancang offer, sampai mengelola client pertama.</p><Link className={styles.textLink} href="/freelance/belajar/mulai-freelance">Buka handbook WWF 01 <ArrowRight size={18} /></Link></motion.article>
      <motion.article id="card-lowongan" className={styles.feature} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7, delay: .1 }}><span className={styles.eyebrow}>02 / Peluang Remote</span><h2>Temukan tempat yang tepat.</h2><p>Kenali job board, cek batasan negara, lalu pilih peluang yang cocok dengan bukti karyamu. Aplikasi dilakukan di situs platform.</p><Link className={styles.textLink} href="/freelance/direktori?type=Remote+Job+Board">Jelajahi remote job boards <ArrowRight size={18} /></Link></motion.article>
    </div>
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}>
      <div id="card-direktori" className={styles.sectionHeader}><div><span className={styles.eyebrow}>03 / Direktori Platform</span><h2>Tiga pintu masuk. Berbeda arah.</h2><p>Remote career, jasa independen, atau penulisan. Mulai dari kebutuhanmu, lalu baca detail platformnya.</p></div><Link className={styles.textLink} href="/freelance/direktori">Lihat direktori <ArrowRight size={18} /></Link></div>
      <div className={styles.platformGrid}>{FEATURED_PLATFORMS.map(p => <Link href={`/freelance/direktori/${p.slug}`} key={p.slug} className={styles.platformCard}><PlatformLogo name={p.name} logo={p.logo}/><h3 className="mt-5">{p.name}</h3><p>{p.description}</p><small>{p.type} · {p.pricing}<br />Belum dicoba langsung</small><span className={styles.textLink}>Kenali platform <ArrowRight size={16} /></span></Link>)}</div>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}>
      <div id="card-resources" className={styles.sectionHeader}><div><span className={styles.eyebrow}>04 / Sumber Daya & Tools</span><h2>Sistem kecil untuk bekerja lebih baik.</h2></div><Link className={styles.textLink} href="/resources">Semua resources <ArrowRight size={18} /></Link></div>
      <div id="card-tools" className={styles.resourceGrid}>{RESOURCES_DATA.filter(r => ["high-context-prompts-pack", "ai-content-operating-system", "personal-brand-positioning-canvas"].includes(r.slug)).map(r => <Link key={r.slug} href={`/resources/${r.slug}`}><small>{r.type.replaceAll("-", " ").toUpperCase()}</small>{r.title} <span aria-hidden="true">↗</span></Link>)}</div>
    </motion.div>
  </section>;
}
