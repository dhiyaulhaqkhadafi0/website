# Implementation Plan — Khadafi Community (Fase 1)

Tanggal: 7 September 2026

---

## 1. Sasaran
Membangun halaman publik komunitas yang estetik, editorial, hangat, dan bermanfaat bagi audience Khadafi sesuai spesifikasi dokumen *Khadafi Community — Development Pack v1.0*.

## 2. Struktur File
- **Page Entrypoint**: `src/app/komunitas/page.tsx`
  - Server Component yang memuat 3 artikel published dari `getBlogListingPosts()`.
  - Dilengkapi metadata canonical, openGraph, dan Twitter cards.
- **Redirect Route**: `src/app/community/route.ts`
  - Mengalihkan traffic `/community` secara permanen (301) ke `/komunitas`.
- **Komponen Utama**: `src/components/community/CommunityView.tsx`
  - Client component untuk interaktivitas smooth scrolling, expandable FAQ, dan visual motion halus.
- **Navbar Integration**: `src/components/shared/navbar.tsx`
  - Mengubah link `/#komunitas` menjadi `/komunitas`.

## 3. Delapan Bagian Halaman Sesuai Spesifikasi
1. **Hero**: Headline *"Bertumbuh lewat karya, bersama."*, subheadline, tombol kembali `← Kembali ke Beranda`, dan dual CTA.
2. **Kegiatan Utama**: *"7 Hari, 1 Karya Jadi"* (status: Rencana Pilot).
3. **Tiga Pilar Manfaat**: Belajar dari Proses, Mencoba Bersama, Mendapat Feedback.
4. **Catatan Perjalanan**: 3 artikel published asli dari Digital Grimoire.
5. **Showcase**: Karya Khadafi (Chikki, Gerakasa, HCFTL) dengan label jujur "Studi Kasus Internal" + undangan karya.
6. **Cara Bergabung**: Alur persiapan batch pilot 20–30 orang.
7. **Budaya & FAQ**: Nilai komunitas, fokus kritik karya, promosi terarah, gratis untuk batch awal.
8. **Penutup**: Konsisten dengan hero dan tautan kembali.

## 4. Kriteria Selesai (Definition of Done)
- Mobile-first responsif (360px – 1440px), no horizontal overflow.
- Tanpa klaim pendaftaran palsu atau countdown fiktif.
- TypeScript check `npx tsc --noEmit` bersih.
- Next.js build `npm run build:next` sukses.
