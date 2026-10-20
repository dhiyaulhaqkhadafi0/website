import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HubShell,
  HubBreadcrumb,
} from "@/components/freelance/BusinessHubShared";
import {
  PathwaySimulation,
  ReaderContents,
} from "@/components/freelance/BusinessInteractions";
import {
  monetization,
  monetizationPdf,
  MONETIZATION_PATH,
  pathwayHref,
  chapterHref,
  sbs,
} from "@/content/business-hub";
import s from "@/components/freelance/business-hub.module.css";
export const dynamicParams = false;
export const generateStaticParams = () =>
  monetization.items.map((i) => ({ slug: i.slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const i = monetization.items.find((x) => x.slug === slug);
  if (!i) notFound();
  return {
    title: `${i.title} — 80 Jalur Monetisasi`,
    description:
      i.definition +
      " Baca langkah awal, risiko, dan simulasi penerimaan kotor.",
    alternates: { canonical: pathwayHref(i.slug) },
  };
}
export default async function PathwayDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    index = monetization.items.findIndex((i) => i.slug === slug);
  if (index < 0) notFound();
  const item = monetization.items[index],
    category = monetization.categories.find((c) => c.id === item.category_id)!;
  return (
    <HubShell>
      <header className={s.hero}>
        <div className={s.wrap}>
          <HubBreadcrumb
            label={item.title}
            parent={{ href: MONETIZATION_PATH, title: "80 Jalur Monetisasi" }}
          />
          <span className={s.eyebrow}>
            {String(item.number).padStart(2, "0")} / {category.title}
          </span>
          <h1>
            {item.title}
            <em>.</em>
          </h1>
          <p>{item.definition}</p>
          <div className={s.meta}>
            <span>Langkah awal · Risiko · Simulasi</span>
            <span>Gratis · Tanpa login</span>
          </div>
        </div>
      </header>
      <div className={s.wrap}>
        <div className={s.reader}>
          <ReaderContents>
            <nav aria-label="Daftar isi jalur">
              <a href="#pembeli">Pembeli & mekanisme</a>
              <a href="#mulai">Empat langkah awal</a>
              <a href="#risiko">Risiko yang perlu diuji</a>
              <a href="#simulasi">Coba simulasi</a>
              {item.related_sbs_pillars.length > 0 && (
                <a href="#terkait">Siapkan sistem jasa</a>
              )}
              <Link href={`${MONETIZATION_PATH}?category=${category.id}#jalur`}>
                Semua {category.title} ↗
              </Link>
            </nav>
          </ReaderContents>
          <article className={s.article}>
            <section id="pembeli">
              <span className={s.eyebrow}>Kenali konteksnya</span>
              <h2>Siapa yang mungkin membutuhkan?</h2>
              <aside className={s.example}>
                <small>Contoh pembeli / Panduan editorial</small>
                <p>{item.buyer_example}</p>
              </aside>
              <p>
                Contoh ini membantu menguji kebutuhan, bukan bukti permintaan
                pasar atau jaminan kecocokan.
              </p>
              <h3>Mekanisme penerimaan</h3>
              <div className={s.tags}>
                {item.mechanisms.map((m) => (
                  <span className={s.badge} key={m}>
                    {
                      monetization.mechanism_labels[
                        m as keyof typeof monetization.mechanism_labels
                      ]
                    }
                  </span>
                ))}
              </div>
              <p style={{ marginTop: 20 }}>{category.intro}</p>
            </section>
            <section id="mulai">
              <span className={s.eyebrow}>Dari membaca ke mencoba</span>
              <h2>Mulai dari versi kecil.</h2>
              <ol>
                {item.first_steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
            <section id="risiko">
              <span className={s.eyebrow}>Bahan pertimbangan</span>
              <h2>Perhatikan sebelum melangkah.</h2>
              <ul>
                {item.risks.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              {item.special_note && (
                <aside className={s.notice}>{item.special_note}</aside>
              )}
              <p>
                Ketentuan, biaya dan kelayakan platform dapat berubah. Periksa
                informasi resmi sebelum memilih kanal atau mengeluarkan biaya.
              </p>
            </section>
            <section id="simulasi">
              <span className={s.eyebrow}>Uji asumsi / Bukan proyeksi</span>
              <h2>Bagaimana hitungannya?</h2>
              <p>
                Ubah jumlah dan asumsi penerimaan per unit. Angka awal berasal
                dari ilustrasi panduan; hasil nol tetap mungkin.
              </p>
              <PathwaySimulation item={item} />
            </section>
            {item.related_sbs_pillars.length > 0 && (
              <section id="terkait">
                <span className={s.eyebrow}>Lanjutkan sesuai kebutuhan</span>
                <h2>Siapkan cara menjalankan jasanya.</h2>
                <p>
                  Bab Service Business System yang berkaitan dengan jalur ini:
                </p>
                <div className={s.chips}>
                  {item.related_sbs_pillars.map((slug) => (
                    <Link key={slug} href={chapterHref(slug)}>
                      {sbs.chapters.find((c) => c.slug === slug)?.title} ↗
                    </Link>
                  ))}
                </div>
              </section>
            )}
            <section>
              <span className={s.eyebrow}>Simpan versi offline</span>
              <h2>Seluruh peta, dalam satu panduan.</h2>
              <p>
                Baca lagi 80 jalur, contoh pembeli, langkah dan risiko saat kamu
                membutuhkannya.
              </p>
              <a
                className={s.button}
                href={monetizationPdf.public_url}
                download
              >
                Unduh Panduan PDF ↓
              </a>
            </section>
            <nav className={s.chapterNav} aria-label="Navigasi jalur">
              {index > 0 ? (
                <Link href={pathwayHref(monetization.items[index - 1].slug)}>
                  <small>← Jalur sebelumnya</small>
                  {monetization.items[index - 1].title}
                </Link>
              ) : (
                <Link href={MONETIZATION_PATH}>
                  <small>← Kembali ke peta</small>80 Jalur Monetisasi
                </Link>
              )}
              {index < 79 ? (
                <Link href={pathwayHref(monetization.items[index + 1].slug)}>
                  <small>Jalur berikutnya →</small>
                  {monetization.items[index + 1].title}
                </Link>
              ) : (
                <Link href={MONETIZATION_PATH}>
                  <small>Kembali ke peta →</small>Jelajahi semua jalur
                </Link>
              )}
            </nav>
          </article>
        </div>
      </div>
    </HubShell>
  );
}
