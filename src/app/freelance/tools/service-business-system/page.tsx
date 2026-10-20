import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  HubShell,
  HubBreadcrumb,
} from "@/components/freelance/BusinessHubShared";
import {
  DocumentLibrary,
  ReadinessChecklist,
} from "@/components/freelance/BusinessInteractions";
import {
  sbs,
  assets,
  SBS_PATH,
  chapterHref,
  RATE_PATH,
  coreArchive,
  fullArchive,
  fileSize,
} from "@/content/business-hub";
import tools from "@/content/business-hub/tools.json";
import s from "@/components/freelance/business-hub.module.css";
export const metadata: Metadata = {
  title: {
    absolute: "Service Business System Gratis untuk Freelancer | Khadafi",
  },
  description:
    "Pelajari enam pilar bisnis jasa freelance. Baca panduan, hitung harga, dan unduh template proposal, SPK, invoice, SOP serta tracker gratis tanpa login.",
  alternates: { canonical: SBS_PATH },
};
const workflow = [
  "Discovery",
  "Brief",
  "Proposal",
  "Kesepakatan dan DP",
  "Pengerjaan",
  "Review",
  "Pelunasan dan Handover",
  "After sales",
];
const faqs = [
  [
    "Harus mulai dari bab pertama?",
    "Tidak. Semua enam bab terbuka. Mulai dari masalah yang sedang kamu hadapi, lalu lengkapi bagian lain ketika diperlukan.",
  ],
  [
    "Apakah semua dokumen gratis tanpa akun?",
    "Ya. Panduan web, PDF, DOCX, XLSX dan kedua ZIP pengguna dapat diakses tanpa login, email atau pembayaran.",
  ],
  [
    "Apa beda paket inti dan lengkap?",
    "Paket inti berisi aset 01–16 dan direktori tools. Paket lengkap menambahkan NDA, Maintenance/SLA dan worksheet pengaturan data yang opsional.",
  ],
  [
    "Apakah template kesepakatan siap dipakai untuk semua proyek?",
    "Template merupakan materi edukasi untuk disesuaikan dengan pihak, scope dan konteks proyek. Worksheet pengaturan data membantu persiapan review; bukan DPA final.",
  ],
  [
    "Apakah angka contoh merupakan tarif Khadafi?",
    "Tidak. DEMO-001 Kedai Senja adalah proyek fiktif. Angka dipakai untuk menjelaskan hubungan scope, waktu, biaya, risiko, margin dan termin.",
  ],
  [
    "Apakah wajib memakai semua tools?",
    "Tidak. Pilih alat secukupnya untuk kebutuhanmu. Baca ketentuan terkini di sumber resminya sebelum mengandalkan fitur atau paket tertentu.",
  ],
];
export default function ServiceBusinessHub() {
  return (
    <HubShell>
      <header className={s.hero}>
        <div className={s.wrap}>
          <HubBreadcrumb label="Service Business System" />
          <div className={s.heroGrid}>
            <div>
              <span className={s.eyebrow}>Panduan praktik / Bisnis jasa</span>
              <h1>
                Service Business
                <br />
                <em>System.</em>
              </h1>
              <p>
                {sbs.subtitle}. Dari memilih layanan sampai menjaga hubungan
                setelah proyek selesai.
              </p>
              <div className={s.actions}>
                <Link className={s.button} href={chapterHref("fondasi")}>
                  Mulai dari Fondasi ↗
                </Link>
                <a
                  className={s.secondary}
                  href="/downloads/service-business-system/release/Service_Business_System_V2_Inti_Gratis.zip"
                  download
                >
                  Unduh Toolkit Gratis ↓
                </a>
                <a className={s.textLink} href="#dokumen">
                  Lihat dokumen
                </a>
              </div>
            </div>
            <a
              className={s.coverPreview}
              href={assets[0].files[0].public_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/freelance/sbs-playbook-cover.webp"
                width={495}
                height={700}
                sizes="(max-width: 700px) 100px, 240px"
                alt="Sampul asli Service Business Playbook, edisi V2"
              />
              <span>
                Lihat playbook PDF ↗<br />
                <small>
                  Versi offline · {fileSize(assets[0].files[0].size_bytes)}
                </small>
              </span>
            </a>
          </div>
          <div className={s.meta}>
            <span>{sbs.chapters.length} pilar</span>
            <span>
              {sbs.chapters.flatMap((c) => c.components).length} komponen
            </span>
            <span>{assets.length} aset utama · PDF, DOCX & XLSX</span>
            <span>Gratis · Tanpa login</span>
          </div>
        </div>
      </header>
      <div className={s.wrap}>
        <section className={s.section}>
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>Mulai dari kebutuhan</span>
              <h2>Di tahap mana kamu sekarang?</h2>
            </div>
            <p>
              Ambil satu langkah yang paling dekat. Kamu bebas berpindah bab.
            </p>
          </div>
          <div className={s.entryGrid}>
            {[
              {
                title: "Belum tahu menjual apa",
                desc: "Petakan skill, pembeli, hasil dan batas layananmu.",
                slug: "fondasi",
                cta: "Siapkan fondasi",
              },
              {
                title: "Sudah ada calon klien",
                desc: "Hitung penawaran dan susun kesepakatan yang bisa dipahami.",
                slug: "harga",
                cta: "Mulai dari harga",
              },
              {
                title: "Sedang mengerjakan proyek",
                desc: "Rapikan brief, timeline, review dan serah terima.",
                slug: "operasional",
                cta: "Atur pengerjaan",
              },
            ].map((x) => (
              <article className={s.entry} key={x.slug}>
                <h3>{x.title}</h3>
                <p>{x.desc}</p>
                <Link href={chapterHref(x.slug)}>{x.cta} ↗</Link>
                {x.slug === "harga" && (
                  <Link href={chapterHref("kesepakatan")}>
                    Baca kesepakatan ↗
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>
        <section className={s.section}>
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>
                Enam pilar / Satu alur yang utuh
              </span>
              <h2>Dari layanan, sampai hubungan.</h2>
            </div>
            <p>Baca penjelasannya. Kerjakan langkahnya. Ambil dokumennya.</p>
          </div>
          {sbs.chapters.map((c, i) => (
            <article className={s.pillar} key={c.id}>
              <span className={s.number}>0{i + 1}</span>
              <div>
                <h3>
                  <Link href={chapterHref(c.slug)}>{c.title}</Link>
                </h3>
                <p>{c.components[0].summary}</p>
                <div className={s.tags}>
                  {c.components.map((x) => (
                    <Link
                      className={s.badge}
                      key={x.id}
                      href={chapterHref(c.slug, x.anchor)}
                    >
                      {x.title}
                    </Link>
                  ))}
                </div>
              </div>
              <Link className={s.textLink} href={chapterHref(c.slug)}>
                Baca bab ↗
              </Link>
            </article>
          ))}
        </section>
        <section className={s.section}>
          <span className={s.eyebrow}>Alur kerja / Delapan tahap</span>
          <h2>Lebih jelas dari awal sampai akhir.</h2>
          <ol className={s.workflow}>
            {workflow.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>
        </section>
        <section id="dokumen" className={s.section}>
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>Pustaka dokumen / 01—19</span>
              <h2>Ambil yang kamu perlukan.</h2>
            </div>
            <p>
              Versi baca untuk dipelajari, versi editable untuk disesuaikan
              dengan pekerjaanmu.
            </p>
          </div>
          <div className={s.actions}>
            <a
              className={s.button}
              href="/downloads/service-business-system/release/Service_Business_System_V2_Inti_Gratis.zip"
              download
            >
              Unduh Paket Inti · 01–16 ↓ · {fileSize(coreArchive.size_bytes)}
            </a>
            <a
              className={s.secondary}
              href="/downloads/service-business-system/release/Service_Business_System_V2_Lengkap_Gratis.zip"
              download
            >
              Unduh Semua termasuk opsional · 01–19 ↓ ·{" "}
              {fileSize(fullArchive.size_bytes)}
            </a>
          </div>
          <p className={s.notice}>
            Materi 17–19 opsional sesuai kebutuhan. Dokumen 19 adalah worksheet
            persiapan pengaturan data, bukan DPA final siap tanda tangan. Semua
            contoh bersifat edukatif.
          </p>
          <DocumentLibrary />
        </section>
        <section className={s.section}>
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>Alat bantu / Pilih secukupnya</span>
              <h2>Tools mengikuti cara kerjamu.</h2>
            </div>
            <Link className={s.textLink} href={`${RATE_PATH}#harga-proyek`}>
              Buka kalkulator harga proyek ↗
            </Link>
          </div>
          <div className={s.entryGrid}>
            {tools.map((t) => (
              <article key={t.name} className={s.entry}>
                <span className={s.eyebrow}>{t.stage}</span>
                <h3>{t.name}</h3>
                <p>{t.use}</p>
                <a href={t.url} target="_blank" rel="noopener noreferrer">
                  Buka situs resmi ↗
                </a>
              </article>
            ))}
          </div>
          <p className={s.notice}>
            Kurasi pendamping dari paket, diperiksa penyusun pada 19 Oktober
            2026. Fitur dan paket dapat berubah; periksa sumber resmi. Tidak
            perlu mendaftar semua tools.{" "}
            <Link href="/freelance/tools/loom-untuk-freelancer">
              Baca juga panduan Loom ↗
            </Link>
          </p>
        </section>
        <section id="checklist" className={s.section}>
          <span className={s.eyebrow}>Jeda untuk memeriksa / 12 prasyarat</span>
          <h2>Sudah punya buktinya?</h2>
          <ReadinessChecklist />
        </section>
        <section className={s.section}>
          <span className={s.eyebrow}>Pertanyaan yang mungkin tersisa</span>
          <h2>Sebelum melangkah.</h2>
          <div style={{ marginTop: 30 }}>
            {faqs.map(([q, a]) => (
              <details className={s.faq} key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </HubShell>
  );
}
