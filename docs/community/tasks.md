# Tasks — Khadafi Community (Fase 1)

Tanggal: 7 September 2026

---

## Fase 0 — Audit & Dokumen Fondasi
- [x] Audit stack, file structure, dependencies, dan navbar route.
- [x] Buat dokumen `docs/community/audit.md`.
- [x] Buat dokumen `docs/community/decisions.md`.
- [x] Buat dokumen `docs/community/content-checklist.md`.
- [x] Buat dokumen `docs/community/tasks.md`.
- [x] Buat dokumen `docs/community/implementation-plan.md`.

## Fase 1 — Implementasi Halaman Publik Komunitas
- [x] Buat page route `src/app/komunitas/page.tsx` dengan metadata SEO & OpenGraph lengkap.
- [x] Buat route redirect `src/app/community/route.ts` yang mengalihkan pengunjung ke `/komunitas`.
- [x] Buat komponen presentasional interaktif `src/components/community/CommunityView.tsx`:
  - [x] Section 1: Hero dengan title & description resmi dari dev pack + dual CTA navigasi.
  - [x] Section 2: Kegiatan Utama ("7 Hari, 1 Karya Jadi") dengan badge status *Rencana Pilot*.
  - [x] Section 3: Tiga Pilar Manfaat (Belajar dari Proses, Mencoba Bersama, Feedback Konstruktif).
  - [x] Section 4: Catatan Perjalanan (3 artikel terbaru published dari `getBlogListingPosts`).
  - [x] Section 5: Showcase Karya Nyata (Chikki, Gerakasa, HCFTL) dengan label "Studi Kasus Internal" + Callout kontribusi karya.
  - [x] Section 6: Alur Bergabung Transparan (Tahapan batch pilot 20–30 orang).
  - [x] Section 7: Budaya Komunitas & FAQ interaktif (accordion akordeon bersih).
  - [x] Section 8: CTA Penutup & Navigasi Kembali.
- [x] Update `src/components/shared/navbar.tsx` agar link `Komunitas` mengarah ke `/komunitas`.
- [x] Verifikasi build & TypeScript:
  - [x] `npx tsc --noEmit` lulus tanpa error.
  - [x] `npm run build:next` lulus tanpa error.
- [x] Buat `docs/community/qa.md` & `docs/community/handoff.md`.
