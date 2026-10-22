# Freelance Business Hub V3

Implementasi dua modul gratis pada Tools & Sumber Daya, berdasarkan paket V3 pengguna. Beranda global, footer, sembilan resource lama, autentikasi, newsletter dan commerce dipertahankan. Tidak ada perubahan database atau email gate.

## Route

- `/freelance/tools`: hero dan dua pilihan awal tetap; satu section dua panel setara sebelum katalog; 11 resource dari registry.
- `/freelance/tools/monetisasi`: 80 jalur, delapan kategori, pencarian, mekanisme OR, kategori AND, pagination 12 item, URL query, simpan lokal dan perbandingan maksimal tiga.
- `/freelance/tools/monetisasi/[slug]`: 80 halaman HTML dengan definisi, contoh pembeli, empat langkah, risiko, simulasi dan tautan SBS berdasarkan relasi sumber.
- `/freelance/tools/service-business-system`: pengantar, enam pilar, alur delapan tahap, 19 dokumen, tools, 12 checklist dan FAQ.
- `/freelance/tools/service-business-system/{fondasi,harga,bukti,kesepakatan,operasional,pertumbuhan}`: 24 komponen lengkap dengan anchor `komponen-01` sampai `komponen-24`.
- `/freelance/tools/freelance-rate-calculator#harga-proyek`: perhitungan proyek dan termin yang mengikuti workbook V2; kalkulator tarif per jam lama tetap tersedia.

## Materi dan unduhan

`src/content/business-hub/` menyimpan satu sumber naskah dan registry format, ukuran, checksum serta relasi. Naskah SBS V2 dalam paket V3 identik dengan paket V2, diverifikasi melalui SHA-256. Data 80 jalur memakai JSON asli V3, termasuk enam nominal yang dikoreksi dan divisor RPM #27/#28.

Aset anonim berada di `/downloads/service-business-system/` dan `/downloads/monetization/`. Terdapat 42 file publik: 35 format individual SBS (17 PDF, 16 DOCX, dua XLSX), dua ZIP pengguna asli, README pengguna, tiga file direktori tools, serta PDF 80 Jalur. Dua ZIP lolos pemeriksaan CRC; tidak memuat prompt, audit, spesifikasi atau source integrasi. File internal tidak disalin ke public. Thumbnail sampul dibuat dari halaman pertama PDF asli.

NDA dan Maintenance/SLA ditandai opsional. Dokumen 19 ditampilkan sebagai worksheet persiapan pengaturan data, bukan DPA final. File multi-format tetap satu hasil pencarian. Preview PDF dimuat setelah dibuka dan memiliki tautan unduh cadangan.

## Perhitungan

Rumus proyek: kebutuhan bulanan dibagi kapasitas tertagih menghasilkan rate dasar. Biaya dasar = jam proyek × rate + biaya langsung. Biaya termasuk risiko = biaya dasar × (1 + risiko). Harga = biaya termasuk risiko ÷ (1 − margin), lalu dibulatkan ke atas. Koreksi toleransi floating point mencegah kelipatan tepat dibulatkan sekali lagi.

DEMO-001 Kedai Senja bersifat fiktif: rate Rp80.000, 30 jam, biaya langsung Rp400.000, risiko 10%, margin 20% → Rp3.850.000. Termin 50/30/20% → Rp1.925.000 / Rp1.155.000 / Rp770.000. Pajak tidak dihitung otomatis.

Simulasi jalur menghitung quantity × unit_receipt_idr ÷ divisor; contoh sumber tidak dimutasi. Nol valid, kosong meminta input, negatif/nonfinite ditolak dan jumlah selain jam harus bulat. Simulasi adalah penerimaan kotor, bukan laba, proyeksi atau jaminan.

## Verifikasi

Perintah:

```powershell
node scripts/check-business-hub.cjs
$env:QA_BASE='http://localhost:3017'
node scripts/check-business-hub-browser.cjs
$env:NEXT_PRIVATE_STANDALONE='true'
node node_modules/next/dist/bin/next build --webpack
npx opennextjs-cloudflare build --skipNextBuild
```

Gate lokal sebelum packaging: lint seluruh source yang berubah bersih; Next build/typecheck berhasil dengan 184 halaman statis. Acceptance pada production server lokal lulus 14 kelompok: 80 detail dan enam bab anonim, 42 GET file dengan MIME/signature/ukuran/checksum, pencarian/filter/URL/pagination, simpan/perbandingan, preview/fallback, checklist, kalkulator, localStorage diblokir, JavaScript dimatikan, 24 layout di 360/390/768/1440 px, regresi resource lama, sitemap dan tiga artikel MDX existing. Nol uncaught browser errors. Lint seluruh repository di luar diff tidak diklaim bersih.

Artefak tersanitasi berada di `artifacts/business-hub/`: log build, hasil browser, screenshot desktop/mobile, manifest rilis, hasil upload cache dan hasil produksi. Direktori artifacts diabaikan Git.

## Packaging Windows

Jangan memakai junction node_modules untuk build rilis ini. Junction ikut masuk ke standalone, sehingga patch adapter OpenNext tidak diterapkan pada salinan Next yang benar dan esbuild menarik binary sharp Windows. Dependensi rilis disalin secara fisik dari versi lockfile yang sama; tidak mengubah versi dependensi atau lockfile. Next dan OpenNext berhasil dengan exit code 0 setelah perbaikan packaging tersebut. Peringatan copy Windows pada paket unist/vfile tidak menghalangi hasil akhir; runtime workerd dan domain production turut diperiksa.

Deployment memakai Worker `khadafi`, bucket `khadafi-opennext-cache`, dan `--keep-vars` untuk mempertahankan binding/secret existing. Versi sebelum rilis: `9868bff2-b7a8-42d4-b1cc-2f6d1f506351`.

## Kompatibilitas artikel existing

Pemeriksaan runtime menemukan artikel MDX existing bergantung pada filesystem dan kompilasi MDX saat request, yang tidak tersedia pada Worker. `scripts/generate-blog-content.cjs` mengompilasi tiga artikel repository saat build menjadi `src/content/generated-blog-posts.json`. Hook `predev` dan `prebuild:next` menyiapkan bundle tersebut. Naskah dan metadata asli dipertahankan; prioritas artikel Studio serta panggilan Supabase existing tidak diubah. Tidak ada perubahan database.

Ketiga artikel (`arsitektur-ai`, `bisnis-digital-defensibel`, `mantra-pertama`) menghasilkan HTTP 200 dan judul asli pada runtime workerd serta production. Pemeriksaan bundle dapat diulang dengan `node scripts/generate-blog-content.cjs --check`.

## Rilis production — 20 Oktober 2026

- Domain: https://khadafidaffa.com/freelance/tools
- Source aplikasi: `6f670aa9606a89c21a7d72f65db9abec0c830b87`, branch `codex/freelance-business-hub`; tidak merge ke main.
- Build: `himGmJIjGwjotQ2vXkyrv`; `/BUILD_ID` pada domain utama cocok dengan build lokal.
- Worker final: `5c1ff734-95fd-4c63-9e91-eb6a6398381c`, deployment `4620c77f-95e7-41c6-8b5a-a784c9a64ea0`, 100% traffic pada pemeriksaan Wrangler.
- Sebanyak 151/151 entri cache build final diunggah ke R2; cache sebelumnya dipertahankan.
- Preflight memeriksa 666 file publik/cache terhadap dua kredensial privat yang tersedia, tanpa kecocokan. Nilai kredensial tidak ditulis ke log.
- Pemeriksaan tambahan domain utama lulus: build ID, tiga artikel asli, decoding sampul melalui optimasi gambar Cloudflare, screenshot spotlight dan nol page errors.
- Acceptance lengkap pada domain production lulus 14 kelompok pada `2026-10-20T13:25:49.949Z` (20:25 WIB): seluruh 80 detail dan enam bab, 42 unduhan dengan checksum identik, semua interaksi, 24 layout responsif, regresi resource lama, sitemap dan tiga artikel existing; nol uncaught browser errors. Skrip menunggu hydration kalkulator sebelum mengisi input agar hasil uji mencerminkan interaksi yang sudah aktif.
- Versi intermediate sebelum koreksi artikel: `6174ed52-8d34-472e-8a9f-dfc1cdd489b9`; versi sebelum seluruh rilis tercatat di atas untuk referensi pemulihan.

Artefak bukti: `artifacts/business-hub/production/verification.json`, `production/runtime-smoke.json`, `deployments-after.json`, `release-manifest.json`, `r2-upload.json` serta screenshot desktop/mobile. Pemeriksaan ini tidak menjalankan transaksi pembayaran atau mutasi akun Studio.

Simpanan dan checklist bersifat lokal per browser; fallback memori sesi digunakan saat storage diblokir. Tidak ada sinkronisasi akun. Kurasi tools berasal dari paket pengguna dan tanggal pemeriksaan penyusunnya; tidak diklaim sebagai audit platform baru.
