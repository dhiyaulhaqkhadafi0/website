import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Globe2 } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { FREELANCE_PLATFORMS, platformOutbound } from "@/content/freelance-directory";
import { PlatformLogo } from "@/components/freelance/PlatformLogo";
import { PlatformWorkflow } from "@/components/freelance/DirectoryVisual";
import { PlatformComparison } from "@/components/freelance/PlatformComparison";
import { DirectoryMotion } from "@/components/freelance/DirectoryMotion";
import { AffiliateDisclosure } from "@/components/freelance/AffiliateDisclosure";
import { ReadingProgress } from "@/components/freelance/ReadingProgress";
import styles from "@/components/freelance/directory.module.css";
export const dynamicParams = false;
export function generateStaticParams() { return FREELANCE_PLATFORMS.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = FREELANCE_PLATFORMS.find(item => item.slug === slug);
  if (!p) return {};
  const url = `https://khadafidaffa.com/freelance/direktori/${p.slug}`;
  return { title: `${p.name} — Direktori Freelance`, description: `${p.description} Kenali model kerja, biaya, dan pertimbangannya.`, alternates: { canonical: url }, openGraph: { title: `${p.name} — Direktori Freelance`, description: p.description, url } };
}
export default async function PlatformPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = FREELANCE_PLATFORMS.find(item => item.slug === slug);
  if (!p) notFound();
  const outbound = platformOutbound(p);
  const checkedDate = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${p.lastCheckedAt}T12:00:00Z`));
  return <DirectoryMotion><Navbar/><ReadingProgress startId="platform-start" endId="platform-end" titleId="platform-title" label={`Progres membaca ${p.name}`}/>
    <header id="platform-start" className={styles.hero}><div className={styles.container}><nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/freelance">Freelance</Link><span aria-hidden="true">/</span><Link href="/freelance/direktori">Direktori</Link><span aria-hidden="true">/</span><span>{p.name}</span></nav><div className={styles.heroGrid}><div><span className={styles.kicker}>{p.type}</span><div className={styles.detailTitle}><PlatformLogo name={p.name} logo={p.logo} large/><h1 id="platform-title" tabIndex={-1}>{p.name}</h1></div><p>{p.description}</p><div className={styles.heroMeta}><span>{p.pricing}</span><span>{p.regions.join(" / ")}</span><span>Belum dicoba langsung</span></div><a href={outbound.href} target="_blank" rel={outbound.rel} className={styles.outbound}>Kunjungi situs resmi <ArrowUpRight size={17} aria-hidden="true"/><span className="sr-only"> (tab baru)</span></a><AffiliateDisclosure active={outbound.affiliate}/></div><PlatformWorkflow platform={p}/></div></div></header>
    <div className={styles.paper}><div className={`${styles.container} ${styles.detailGrid}`}><article className={styles.article}>
      <section id="kenali" data-reveal><span className={styles.kicker}>01 / Kenali platform</span><h2>Tentang {p.name}</h2><p>{p.longDescription}</p><h3>Cocok untuk siapa?</h3><p>{p.forWhom}</p><p>Bidang yang dapat ditelusuri: {p.categories.join(", ")}. Level: {p.experienceLevels.join(", ")}; persyaratan akhir mengikuti platform atau listing.</p><h3>Jenis peluang</h3><div className={styles.opportunities}>{p.opportunityTypes.map(type => <span key={type}>{type}</span>)}</div></section>
      <section id="cara-kerja" data-reveal><span className={styles.kicker}>02 / Pengalaman kerja</span><h2>Dari profil menjadi peluang.</h2><p>{p.howItWorks}</p><p>{p.workingNotes}</p></section>
      <section id="biaya" data-reveal><span className={styles.kicker}>03 / Biaya & akses</span><h2>Hitung sebelum berkomitmen.</h2><div className={styles.costNote}><strong>{p.pricing}</strong><p>{p.pricingNote}</p><small>Kategori biaya merangkum akses dasar dari sisi pencari kerja atau freelancer. Gratis bukan berarti seluruh fitur atau transaksi bebas biaya. Periksa sumber resmi sebelum membayar atau menerima kontrak.</small></div></section>
      <div className={styles.balance} id="pertimbangan" data-reveal><section><span className={styles.kicker}>04 / Nilai praktis</span><h2>Yang bisa membantu.</h2><ul>{p.pros.map(pro => <li key={pro}>{pro}</li>)}</ul></section><section><span className={styles.kicker}>Sebelum memutuskan</span><h2>Yang perlu ditimbang.</h2><ul>{p.considerations.map(note => <li key={note}>{note}</li>)}</ul></section></div>
      <section id="indonesia" data-reveal><span className={styles.kicker}>05 / Konteks Indonesia</span><h2>Remote tetap punya batas.</h2><div className={styles.indonesiaNote}><Globe2 size={24} strokeWidth={1.5} aria-hidden="true"/><span>Internasional menunjukkan cakupan platform.<br/>Kelayakan negara perlu diperiksa secara terpisah.</span></div>{p.indonesiaNotes.map(note => <p key={note}>{note}</p>)}</section>
      <section id="mulai" data-reveal><span className={styles.kicker}>06 / Langkah berikutnya</span><h2>Mulai dengan satu percobaan.</h2><ol className={styles.steps}>{p.startSteps.map(step => <li key={step}>{step}</li>)}</ol><div className={styles.tips}><h3>Tips untuk {p.name}</h3><ul>{p.tips.map(tip => <li key={tip}>{tip}</li>)}</ul></div></section>
      <section id="kurasi" data-reveal><span className={styles.kicker}>07 / Transparansi kurasi</span><h2>Informasi publik. Bukan janji hasil.</h2><div className={styles.curation}>{p.status} langsung</div><p>{p.notes}</p><p>Tips memulai adalah panduan editorial untuk menilai kecocokan. Direktori ini tidak memberikan rating, menjamin penerimaan, atau memverifikasi setiap lowongan yang diterbitkan platform.</p></section>
      <section id="sumber" className={styles.sources} data-reveal><span className={styles.kicker}>08 / Sumber & pembaruan</span><h2>Periksa sumbernya.</h2><p>Informasi publik diperiksa pada <time dateTime={p.lastCheckedAt}>{checkedDate}</time>. Biaya, akses, dan fitur dapat berubah.</p>{p.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer"><span>{source.label} — {p.name}</span><ArrowUpRight size={16} aria-hidden="true"/><span className="sr-only"> (tab baru)</span></a>)}<small>Identitas merek milik masing-masing platform. Logo digunakan untuk membantu pengenalan, bukan sebagai tanda kemitraan.</small></section>
    </article><aside className={styles.aside} aria-label="Navigasi dan ringkasan platform"><p className={styles.asideTitle}>Di halaman ini</p><nav className={styles.toc} aria-label="Daftar isi platform">{[["kenali", "Kenali platform"], ["cara-kerja", "Cara mendapat peluang"], ["biaya", "Biaya & akses"], ["indonesia", "Konteks Indonesia"], ["mulai", "Cara memulai"], ["bandingkan", "Bandingkan singkat"], ["sumber", "Sumber & pembaruan"]].map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}</nav><dl><dt>Model kerja</dt><dd>{p.model}</dd><dt>Bidang</dt><dd>{p.categories.join(" / ")}</dd><dt>Terakhir diperiksa</dt><dd>{checkedDate}</dd></dl><Link href="/freelance/direktori" className={styles.returnLink}>← Kembali ke direktori</Link></aside></div>
      <div className={styles.container}><PlatformComparison platform={p}/></div>
    </div><section id="platform-end" className={styles.closing} data-reveal><div className={styles.container}><div><h2>Satu platform dulu.<br/>Satu langkah nyata.</h2><p>Rapikan offer dan portfolio, lalu cari peluang yang sesuai.</p></div><Link href="/freelance/belajar/mulai-freelance">Buka handbook WWF 01 <ArrowUpRight size={18} aria-hidden="true"/></Link></div></section>
  </DirectoryMotion>;
}
