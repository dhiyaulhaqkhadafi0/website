import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { CookiePreferences } from "@/components/legal/CookiePreferences";
export const metadata: Metadata = {
  title: "Cookies & Penyimpanan Browser",
  description:
    "Kenali sesi akun, preferensi tema, dan terjemahan opsional, serta kelola pilihan penyimpanan browser Anda.",
  alternates: { canonical: "https://khadafidaffa.com/cookies" },
};
const sections = [
  { id:'analytics',title:'Analytics berdasarkan pilihan Anda',paragraphs:[
    'Google Analytics 4 hanya dimuat setelah Anda mengizinkan analytics. Pilihan khadafi-analytics-consent disimpan terpisah dari izin terjemahan. Penolakan tetap memberi akses ke halaman publik.',
    'Pengukuran manual memakai jalur halaman tanpa query, fragmen, isi formulir, atau identitas akun. Studio, autentikasi, akun, dan checkout dikecualikan. Saat aktif, browser menghubungi Google dan Google dapat memproses informasi teknis koneksi.',
    'Anda dapat mencabut izin pada panel preferensi. Cookie analytics pihak pertama dihapus dan halaman dimuat ulang untuk menghentikan kode yang sudah dimuat. Data yang sebelumnya terkirim ke layanan analytics tidak ikut dihapus dari layanan tersebut.',
  ]},
  {
    id: "penting",
    title: "Sesi dan keamanan akun",
    paragraphs: [
      "Cookie khadafi-access menghubungkan sesi akun yang telah divalidasi dengan halaman member dan pengelola. Cookie ini tidak dapat dibaca JavaScript dan memiliki masa berlaku maksimal satu jam; perpanjangannya mengikuti sesi autentikasi yang valid.",
      "Supabase menyimpan sesi autentikasi pada browser agar Anda tetap masuk. Affiliate Manager juga memiliki cookie sesi pengelola tersendiri. Penyimpanan sesi diperlukan saat memakai fitur akun, dan tidak memberi hak akses di luar izin akun. Keluar dari akun atau hapus data situs melalui browser untuk menghapus sesi lokal.",
    ],
  },
  {
    id: "preferensi",
    title: "Tema dan pilihan tampilan",
    paragraphs: [
      "Pilihan tema disimpan pada localStorage dengan nama khadafi-home-theme. Pilihan ini mempertahankan tema terang atau gelap saat Anda kembali. Preferensi bahasa dan izin terjemahan menggunakan khadafi_lang_preference dan khadafi-translation-consent.",
      "Preferensi localStorage tetap tersimpan sampai Anda mengubahnya atau menghapus data situs. Penyimpanan ini berbeda dari cookie sesi dan bukan daftar subscriber newsletter.",
      "Tawaran bahasa menggunakan kode negara umum dari koneksi Cloudflare dan preferensi bahasa browser, tanpa meminta GPS atau menyimpan alamat IP. Pilihan menutup tawaran diingat pada khadafi_language_offer_v1 selama 30 hari. Negara hanya menjadi petunjuk karena negara dapat memiliki beberapa bahasa.",
    ],
  },
  {
    id: "terjemahan",
    title: "Google Translate bersifat opsional",
    paragraphs: [
      "Versi Bahasa Indonesia tidak memerlukan Google Translate. Skrip terjemahan hanya dimuat setelah izin diberikan dan Anda memilih bahasa terjemahan. Saat digunakan, browser terhubung ke layanan Google, yang dapat menerima konten halaman dan informasi teknis permintaan.",
      "Cookie googtrans mengingat bahasa yang dipilih selama maksimal 30 hari. Anda dapat mencabut izin pada panel di atas. Jika skrip sudah berjalan, muat ulang halaman untuk menghentikannya; cookie dari domain pihak ketiga dapat dikelola melalui pengaturan browser.",
      "Tawaran terjemahan hanya ditampilkan pada halaman publik. Skrip terjemahan tidak dimuat pada autentikasi, checkout, akun, dan Studio. Tawaran tidak mengubah URL, harga, atau hak akses akun.",
    ],
  },
  {
    id: "kontrol",
    title: "Mengelola penyimpanan Anda",
    paragraphs: [
      "Gunakan panel preferensi untuk fitur terjemahan. Untuk menghapus cookies, sesi, dan tema, buka pengaturan privasi browser, cari khadafidaffa.com, lalu hapus data situs. Tindakan ini dapat mengeluarkan Anda dari akun dan mengembalikan preferensi tampilan.",
      "Menghapus cookies tidak menghapus akun, pembelian, atau data subscriber di server. Berhenti newsletter menggunakan tautan kelola langganan; permintaan penghapusan data pribadi dapat disampaikan ke email bantuan.",
    ],
  },
];
export default function CookiesPage() {
  return (
    <LegalDocument
      title="Cookies & penyimpanan browser"
      summary="Sesi untuk akses akun, preferensi untuk kenyamanan, dan terjemahan opsional yang bisa Anda kendalikan."
      path="/cookies"
      sections={sections}
    >
      <CookiePreferences />
    </LegalDocument>
  );
}
