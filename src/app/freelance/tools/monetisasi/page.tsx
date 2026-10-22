import type { Metadata } from "next";
import Link from "next/link";
import {
  HubShell,
  HubBreadcrumb,
} from "@/components/freelance/BusinessHubShared";
import { MonetizationExplorer } from "@/components/freelance/MonetizationExplorer";
import {
  monetization,
  monetizationPdf,
  MONETIZATION_PATH,
  parsePathQuery,
  fileSize,
} from "@/content/business-hub";
import s from "@/components/freelance/business-hub.module.css";
export const metadata: Metadata = {
  title: { absolute: "80 Jalur Monetisasi Bisnis Digital Gratis | Khadafi" },
  description:
    "Temukan 80 model bisnis digital dalam delapan kategori. Baca langkah awal, bandingkan pilihan, dan unduh panduan gratis tanpa login.",
  alternates: { canonical: MONETIZATION_PATH },
};
export default async function MonetizationHub({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams,
    p = new URLSearchParams();
  for (const [k, v] of Object.entries(raw))
    if (v !== undefined)
      (Array.isArray(v) ? v : [v]).forEach((x) => p.append(k, x));
  const query = parsePathQuery(p);
  return (
    <HubShell>
      <header className={s.hero}>
        <div className={s.wrap}>
          <HubBreadcrumb label="80 Jalur Monetisasi" />
          <div className={s.heroGrid}>
            <div>
              <span className={s.eyebrow}>Peta pilihan / Bisnis digital</span>
              <h1>
                80 Jalur Monetisasi
                <br />
                <em>Bisnis Digital.</em>
              </h1>
              <p>
                Temukan model yang cocok dengan skill, aset, dan cara kerjamu.
              </p>
              <div className={s.actions}>
                <a className={s.button} href="#jalur">
                  Jelajahi 80 Jalur ↓
                </a>
                <a
                  className={s.secondary}
                  href={monetizationPdf.public_url}
                  download
                >
                  Unduh Panduan PDF ↓
                </a>
              </div>
            </div>
            <div className={s.book} aria-hidden="true">
              <span>Khadafi / Field guide 02</span>
              <strong>
                Banyak jalan.
                <br />
                Pilih satu untuk
                <br />
                mulai mencoba.
              </strong>
              <small>
                Skill → Karya → Informasi → Sistem
                <br />
                Peta untuk dijelajahi, bukan janji penghasilan.
              </small>
            </div>
          </div>
          <div className={s.meta}>
            <span>{monetization.categories.length} kategori</span>
            <span>{monetization.items.length} jalur</span>
            <span>Gratis tanpa login</span>
            <span>PDF · {fileSize(monetizationPdf.size_bytes)} · V3</span>
          </div>
        </div>
      </header>
      <div className={s.wrap}>
        <section className={s.section}>
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>
                Dari apa yang sudah dekat denganmu
              </span>
              <h2>Setiap arah punya pintu masuk.</h2>
            </div>
            <p>Pintasan untuk menjelajah. Seluruh kategori tetap terbuka.</p>
          </div>
          <div className={s.shortcutGrid}>
            {[
              {
                title: "Menjual keterampilan",
                categories: ["jasa-digital", "b2b"],
              },
              {
                title: "Membuat karya",
                categories: ["produk-digital", "digital-assets-ip"],
              },
              {
                title: "Mengolah informasi",
                categories: ["information-business"],
              },
              { title: "Membangun software", categories: ["software-ai"] },
            ].map((x) => (
              <article className={s.entry} key={x.title}>
                <h3>{x.title}</h3>
                {x.categories.map((id) => (
                  <p key={id}>
                    <Link
                      className={s.textLink}
                      href={`${MONETIZATION_PATH}?category=${id}#jalur`}
                    >
                      {monetization.categories.find((c) => c.id === id)!.title}{" "}
                      ↗
                    </Link>
                  </p>
                ))}
              </article>
            ))}
          </div>
        </section>
        <MonetizationExplorer initialQuery={query} />
      </div>
    </HubShell>
  );
}
