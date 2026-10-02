import Link from "next/link";
import { type FreelancePlatform, platformAlternatives } from "@/content/freelance-directory";
import { PlatformLogo } from "./PlatformLogo";
import styles from "./directory.module.css";

export function PlatformComparison({ platform }: { platform: FreelancePlatform }) {
  const alternatives = platformAlternatives(platform);
  const compared = [platform, ...alternatives.slice(0, 2)];
  return <section id="bandingkan" className={styles.comparison} data-reveal>
    <span className={styles.kicker}>Pilih model, bukan sekadar nama</span><h2>Bandingkan singkat.</h2><p>Perbedaan cara kerja untuk membantu menentukan pintu masukmu. Tanpa skor atau urutan pemenang.</p>
    <div className={styles.tableScroll} role="region" aria-label="Tabel perbandingan platform, geser horizontal bila perlu" tabIndex={0}>
      <table><caption className="sr-only">Perbandingan {compared.map(p => p.name).join(", ")}</caption><thead><tr><th scope="col">Yang dibandingkan</th>{compared.map(p => <th scope="col" key={p.slug}><PlatformLogo name={p.name} logo={p.logo}/><Link href={`/freelance/direktori/${p.slug}`}>{p.name} ↗</Link>{p.slug === platform.slug && <small>Yang sedang dibaca</small>}</th>)}</tr></thead><tbody>
        {([ ["Model kerja", (p: FreelancePlatform) => p.model], ["Cara mendapat peluang", (p: FreelancePlatform) => p.opportunityMethod], ["Cocok untuk", (p: FreelancePlatform) => p.forWhom], ["Biaya & akses", (p: FreelancePlatform) => `${p.pricing}. ${p.pricingNote}`], ["Cakupan", (p: FreelancePlatform) => `${p.regions.join(", ")}; kelayakan negara perlu dikonfirmasi.`] ] as const).map(([label, value]) => <tr key={label}><th scope="row">{label}</th>{compared.map(p => <td key={p.slug}>{value(p)}</td>)}</tr>)}
      </tbody></table>
    </div>
    <div className={styles.alternatives}><h3>Jalur lain yang bisa dipelajari.</h3>{alternatives.map(p => <Link key={p.slug} href={`/freelance/direktori/${p.slug}`}><PlatformLogo name={p.name} logo={p.logo}/><div><strong>{p.name}</strong><p>{p.model} · {p.forWhom}</p></div><span aria-hidden="true">↗</span></Link>)}</div>
  </section>;
}
