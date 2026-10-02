import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { FREELANCE_PLATFORMS } from "@/content/freelance-directory";
import styles from "@/components/freelance/discovery.module.css";
export const dynamicParams = false;
export function generateStaticParams() { return FREELANCE_PLATFORMS.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = FREELANCE_PLATFORMS.find(item => item.slug === slug);
  if (!p) return {};
  return { title: `${p.name} — Direktori Freelance`, description: p.description, alternates: { canonical: `https://khadafidaffa.com/freelance/direktori/${p.slug}` } };
}
export default async function PlatformPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = FREELANCE_PLATFORMS.find(item => item.slug === slug);
  if (!p) notFound();
  const alternatives = FREELANCE_PLATFORMS.filter(item => item.slug !== slug && (item.type === p.type || item.categories.some(c => p.categories.includes(c)))).slice(0, 3);
  return <><Navbar/><header className={styles.pageHero}><div className={styles.container}><nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/freelance">Freelance</Link><span aria-hidden="true">/</span><Link href="/freelance/direktori">Direktori</Link><span aria-hidden="true">/</span><span>{p.name}</span></nav><span className={styles.eyebrow}>{p.type}</span><h1>{p.name}</h1><p>{p.description}</p><div className={styles.detailHeroMeta}><span>{p.pricing}</span><span>{p.opportunityTypes.join(" / ")}</span><span>Belum dicoba langsung</span></div><a href={p.website} target="_blank" rel="noopener noreferrer" className={styles.textLink}>Kunjungi situs resmi ↗<span className="sr-only"> (tab baru)</span></a></div></header>
    <div className={styles.paper}><div className={`${styles.container} ${styles.detailGrid}`}><article className={styles.article}>
      <section><span className={styles.eyebrow}>01 / Kenali platform</span><h2>Tentang {p.name}</h2><p>{p.description} {p.forWhom}</p></section>
      <section><h2>Cara kerjanya</h2><p>{p.howItWorks}</p></section>
      <section><h2>Cocok untuk siapa?</h2><p>{p.forWhom}</p><p>Bidang yang dapat ditelusuri: {p.categories.join(", ")}. Jenis peluang: {p.opportunityTypes.join(", ")}. Ketersediaan mengikuti listing pada platform.</p></section>
      <section><h2>Biaya & akses</h2><p>{p.pricingNote}</p><p>Periksa sumber resmi di bawah untuk kebijakan terbaru sebelum membuat komitmen.</p></section>
      <section><h2>Yang bisa membantu</h2><ul>{p.pros.map(pro => <li key={pro}>{pro}</li>)}</ul></section>
      <section><h2>Yang perlu dipertimbangkan</h2><ul>{p.considerations.map(note => <li key={note}>{note}</li>)}</ul></section>
      <section><span className={styles.eyebrow}>02 / Langkah berikutnya</span><h2>Cara mulai</h2><ol>{p.startSteps.map(step => <li key={step}>{step}</li>)}</ol></section>
      <section><h2>Catatan kurasi</h2><p>{p.notes}</p></section>
      <section className={styles.sourceLinks}><h2>Sumber & pembaruan</h2><p>Informasi publik diperiksa pada <time dateTime={p.lastCheckedAt}>2 Oktober 2026</time>. Biaya dan fitur dapat berubah.</p>{p.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} — {p.name} ↗<span className="sr-only"> (tab baru)</span></a>)}</section>
    </article><aside className={styles.detailAside} aria-label="Ringkasan platform"><dl><div><dt>Bidang</dt><dd>{p.categories.join(" / ")}</dd></div><div><dt>Cakupan</dt><dd>{p.regions.join(" / ")}<br/>Batas negara per listing</dd></div><div><dt>Level</dt><dd>Beragam, mengikuti listing</dd></div><div><dt>Pengalaman pribadi</dt><dd>{p.status}</dd></div></dl><Link href="/freelance/direktori" className={styles.textLink}>← Kembali ke direktori</Link></aside></div>
    <section className={styles.container}><h2 className="text-3xl font-bold mb-8">Bandingkan jalur lain.</h2><div className={styles.platformGrid}>{alternatives.map(item => <Link className={styles.platformCard} href={`/freelance/direktori/${item.slug}`} key={item.slug}><h3>{item.name}</h3><p>{item.description}</p><span className={styles.textLink}>Baca detail ↗</span></Link>)}</div></section></div>
    <section className={styles.darkCta}><div className={styles.container}><h2>Satu platform dulu. Satu langkah nyata.</h2><p>Rapikan offer dan portfolio, lalu cari peluang yang sesuai.</p><Link href="/freelance/belajar/mulai-freelance" className={styles.textLink}>Buka handbook WWF 01 ↗</Link></div></section></>;
}
