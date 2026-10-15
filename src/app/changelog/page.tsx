import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import s from "@/components/legal/legal.module.css";
export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Catatan perubahan beranda, produk, sumber daya, dan fungsi ekosistem Khadafi.",
  alternates: { canonical: "https://khadafidaffa.com/changelog" },
};
const entries = [
  {
    id: "oktober-15",
    title: "Beranda, akun, dan informasi yang lebih jelas",
    date: "2026-10-15",
    label: "15 Oktober 2026",
    changes: [
      "Beranda Bahasa Indonesia dengan jalur belajar, produk, dan peluang freelance.",
      "Footer lebih lega, enam akun sosial asli, serta navigasi Tentang, Privasi, Syarat & Ketentuan, Cookies, dan Changelog.",
      "Newsletter beranda dengan persetujuan, penyimpanan server, dan tautan unsubscribe.",
      "Satu login untuk member dan founder, dengan pemeriksaan izin server dan database.",
      "Halaman legal yang diselaraskan dengan fungsi situs dan kontrol terjemahan opsional.",
    ],
  },
  {
    id: "oktober-12",
    title: "Micro1 & Affiliate Manager",
    date: "2026-10-12",
    label: "12 Oktober 2026",
    changes: [
      "Halaman direktori Micro1 dengan konteks seleksi, sumber, dan penjelasan referral.",
      "Pengelolaan afiliasi privat serta pencatatan navigasi referral dengan pemeriksaan keamanan.",
    ],
  },
  {
    id: "oktober-11",
    title: "Bekal untuk perjalanan freelance",
    date: "2026-10-11",
    label: "11 Oktober 2026",
    changes: [
      "Lowongan individual, direktori platform, dan sumber daya freelance yang dapat dijelajahi.",
      "Template, panduan belajar, kalkulator tarif, serta pendaftaran Freelance Field Notes.",
    ],
  },
];
export default function ChangelogPage() {
  return (
    <LegalDocument
      title="Changelog"
      summary="Catatan perkembangan ekosistem. Apa yang berubah, kapan diperbarui, dan manfaatnya untuk Anda."
      path="/changelog"
      customSections
      sections={entries.map((e) => ({
        id: e.id,
        title: e.title,
        paragraphs: [],
      }))}
    >
      {entries.map((e) => (
        <section id={e.id} key={e.id} className={s.entry}>
          <time dateTime={e.date}>{e.label}</time>
          <h2>{e.title}</h2>
          <ul>
            {e.changes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      ))}
    </LegalDocument>
  );
}
