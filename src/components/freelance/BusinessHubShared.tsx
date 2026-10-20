import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { BusinessReady } from "./BusinessInteractions";
import {
  MONETIZATION_PATH,
  SBS_PATH,
  sbs,
  monetization,
  type Asset,
  fileSize,
} from "@/content/business-hub";
import s from "./business-hub.module.css";
export function HubShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.hub}>
      <Navbar />
      <BusinessReady />
      {children}
    </div>
  );
}
export function HubBreadcrumb({
  label,
  parent,
}: {
  label: string;
  parent?: { href: string; title: string };
}) {
  return (
    <nav className={s.crumb} aria-label="Breadcrumb">
      <Link href="/freelance">Freelance</Link>
      <span>/</span>
      <Link href="/freelance/tools">Tools & Sumber Daya</Link>
      {parent && (
        <>
          <span>/</span>
          <Link href={parent.href}>{parent.title}</Link>
        </>
      )}
      <span>/</span>
      <span aria-current="page">{label}</span>
    </nav>
  );
}
export function BusinessSpotlight() {
  return (
    <section
      className={`${s.hub} ${s.spotlight}`}
      aria-label="Dua pintu untuk langkah berikutnya"
    >
      <span className={s.eyebrow}>
        Pilih arah bisnismu, lalu siapkan cara menjalankannya
      </span>
      <div className={s.spotlightGrid}>
        <article className={s.spotPanel}>
          <span className={s.eyebrow}>
            Peta peluang / {monetization.categories.length} kategori
          </span>
          <h2>
            80 Jalur Monetisasi
            <br />
            Bisnis Digital.
          </h2>
          <p>
            Temukan pilihan yang dekat dengan skill, aset, dan cara kerjamu.
            Baca, simpan, lalu bandingkan arah yang ingin kamu uji.
          </p>
          <div className={s.actions}>
            <Link className={s.button} href={MONETIZATION_PATH}>
              Jelajahi 80 Jalur <ArrowUpRight size={17} />
            </Link>
            <small>PDF gratis · Tanpa login</small>
          </div>
        </article>
        <article className={s.spotPanel}>
          <span className={s.eyebrow}>
            Service Business System / {sbs.chapters.length} pilar
          </span>
          <h2>
            Dari menawarkan skill,
            <br />
            sampai mengelola jasa.
          </h2>
          <p>
            Pelajari 24 komponen untuk menyiapkan layanan, harga, dan proses
            kerja. Ambil 19 dokumen saat kamu membutuhkannya.
          </p>
          <div className={s.actions}>
            <Link className={s.button} href={SBS_PATH}>
              Pelajari Sistemnya <ArrowUpRight size={17} />
            </Link>
            <Link className={s.textLink} href={`${SBS_PATH}#dokumen`}>
              Lihat dokumen gratis
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
export function AssetDownloadLinks({ asset }: { asset: Asset }) {
  return (
    <div className={s.actions}>
      {asset.files.map((f) => (
        <a key={f.format} className={s.secondary} href={f.public_url} download>
          Unduh {f.format} <span>{fileSize(f.size_bytes)}</span>
        </a>
      ))}
    </div>
  );
}
export function FreelanceBusinessTeaser() {
  return (
    <aside className={s.teaser}>
      <div>
        <h2>
          Skill yang kamu punya,
          <br />
          bisa jadi pintu ke mana?
        </h2>
        <p>
          Jelajahi 80 pilihan bisnis digital. Mulai dari satu arah yang ingin
          kamu uji.
        </p>
      </div>
      <Link href={MONETIZATION_PATH}>Buka peta monetisasi ↗</Link>
    </aside>
  );
}
