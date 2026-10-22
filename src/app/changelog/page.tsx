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
    id: "oktober-21-akun-checkout",
    title: "Konfirmasi akun, pilihan pembayaran, dan detail visual",
    date: "2026-10-21", label: "21 Oktober 2026",
    changes: [
      "Halaman konfirmasi email berbahasa Indonesia dengan status berhasil, tautan kedaluwarsa, dan tombol menuju halaman masuk.",
      "Redirect autentikasi diarahkan ke domain resmi Khadafi, menggantikan alamat localhost.",
      "Pilihan QRIS, bank/virtual account, dan minimarket terlihat langsung di checkout. Pilihan pesanan dikunci saat diproses untuk mencegah pembayaran ganda.",
      "Penanganan respons DOKU Checkout disesuaikan dengan format API, sambil mempertahankan pemeriksaan nominal, invoice, domain pembayaran, dan verifikasi pembayaran server.",
      "Preview antarmuka Chikki dapat diperbesar, diperkecil, direset, dan digeser pada mobile maupun desktop.",
    ],
  },
  {
    id: "oktober-21-pengalaman",
    title: "Pengalaman yang lebih rapi, responsif, dan ringan",
    date: "2026-10-21", label: "21 Oktober 2026",
    changes: [
      "Menu mobile dan daftar bahasa dapat digulir, dengan pemulihan scroll saat menu ditutup.",
      "Pencarian produk dan resources memakai efek bingkai halus, filter cepat, dan dukungan pengurangan gerakan.",
      "Halaman login/daftar diperbarui, foto beranda memakai bingkai kaca, dan Chikki ditampilkan dalam mockup laptop.",
      "Banner HCFTL dan hero sumber daya gratis diperbarui, dengan animasi yang tetap tenang.",
      "Gambar dioptimalkan, pemuatan navigasi memakai animasi khusus, serta cache aset dan cache regional diperbaiki.",
      "Sitemap, metadata, struktur judul artikel, dan ads.txt diperbaiki untuk kesiapan SEO dan AdSense.",
      "Pengunjung mendapat rekomendasi bahasa berdasarkan negara dan bahasa browser; terjemahan opsional menyediakan 93 pilihan bahasa.",
      "QRIS production telah diuji melalui pembayaran pemilik situs; metode lain mengikuti aktivasi dan syarat DOKU.",
    ],
  },
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
      updated={{ date: "2026-10-21", label: "21 Oktober 2026" }}
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
