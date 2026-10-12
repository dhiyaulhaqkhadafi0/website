# Micro1 Directory + Affiliate Management V1

## Audit dan batas release

Audit 12 Oktober 2026: PR [#3](https://github.com/dhiyaulhaqkhadafi0/website/pull/3) masih open/draft, belum merged, head `802114222afb3df31b2c9562b3c1799c29025644`, berbasis main `d6af5365151ea7b59d2d9a99e5568c521cb52658`. PR sudah berisi satu entri Micro1 dan URL referral pemilik. Implementasi ini melanjutkan branch `feat/micro1-directory-20261012` di `.worktrees/micro1-affiliates`. Checkout utama dengan perubahan commerce tidak diubah. Next 16.3.3, React 19.2.8, OpenNext Cloudflare 1.20.5; panduan lokal route handlers, cookies, dan authentication dibaca sebelum implementasi.

Scope release: preview, tanpa merge PR atau deployment production. GitHub main dan traffic production harus tetap pada release sebelumnya. Migrasi Supabase bersifat additive pada project situs **Khadafi Web / mykgtajanxczdnzekycl**, bukan project Chikki. Tabel situs yang sudah ada tidak diubah. Konfigurasi affiliate bersama; event dan komisi dipisahkan dengan `environment=preview|production`. Tidak ada klik/komisi seed. Klik QA browser merupakan navigasi nyata di scope preview dan akan terlihat di laporan preview.

## Halaman dan route

| Route | Fungsi |
| --- | --- |
| `/freelance/direktori/micro1` | Satu halaman editorial kanonis: bidang, tujuh tahap, kesiapan, batasan, sembilan FAQ, disclosure, sumber resmi, related guides. |
| `/go/[slug]` | Resolusi konfigurasi active dan navigasi referral terukur. Contoh `/go/micro1?campaign=website-directory`. |
| `/studio/affiliates` | Workspace internal enam area, server memverifikasi sesi admin sebelum merender manager. |
| `POST /api/studio/affiliates/session` | Menjembatani sesi Supabase Studio yang sudah ada ke cookie HttpOnly untuk pemeriksaan halaman di server. Tidak membuat akun atau auth baru. |
| `/api/studio/affiliates/{programs,links,campaigns,commissions}` | GET laporan/list, POST create, PATCH edit/archive; semua wajib bearer admin yang diverifikasi server dan RLS. Tidak ada hard delete. |

Public navbar tidak memuat manager. Link **Affiliates** hanya ada pada navigasi Studio. Route internal dynamic, `noindex`; API/private responses `no-store`. Cookie sesi internal berumur 15 menit, SameSite Strict, Secure pada HTTPS, path `/studio/affiliates`. Halaman yang belum berizin hanya menampilkan gate; data tidak disisipkan ke HTML publik. Login tetap melalui `/studio` dan identitas/allowlist Blog Studio yang sama.

## Sumber dan klaim editorial

Informasi diperiksa 12 Oktober 2026 melalui [Experts](https://www.micro1.ai/experts), [Opportunities](https://www.micro1.ai/experts/opportunities), [Interview Prep](https://www.micro1.ai/interview-prep), [Candidate Terms](https://www.micro1.ai/legal/terms-candidates), [Referral Program](https://www.micro1.ai/referral-program), dan [Referral Terms](https://www.micro1.ai/legal/referral-terms). Halaman membedakan interview, sertifikasi, matching, dan kerja berbayar. Tidak mengklaim pengalaman penggunaan langsung, jaminan kelulusan, gaji tertentu, atau nominal komisi tetap. Daftar bidang bukan daftar lowongan selalu aktif; kelayakan Indonesia tetap perlu diperiksa per listing. Biaya keseluruhan belum diverifikasi, sehingga kategori direktori **Periksa ketentuan**. Sumber/dokumentasi tetap menuju URL resmi tanpa referral.

URL awal disimpan lengkap di database, tanpa penggantian parameter:

```text
https://refer.micro1.ai/referral/jobs?referralCode=b22f58a9-d462-4389-ab54-34e45d361215&utm_source=referral&utm_medium=share&utm_campaign=job_referral
```

Program `Micro1 Expert Referral`, link `All Expert Opportunities`, slug `micro1`, owner `Website Admin`, campaign awal `Website Directory / website-directory / website / directory`. Tidak ada campaign marketing palsu; buat campaign tambahan ketika memang akan dipakai.

## Database dan keamanan

Migrasi dibuat dengan Supabase CLI 2.120.0:

1. `supabase/migrations/20261012071152_affiliate_management_v1.sql`: empat tabel konfigurasi/ledger, click events, audit, private credential/allowlist, RLS, indexes, FK, constraints, tracking dan aggregate RPC, serta konfigurasi awal nyata.
2. `supabase/migrations/20261012073135_affiliate_link_analytics.sql`: menambah aggregate per link pada RPC stats.
3. `supabase/migrations/20261012075705_affiliate_foreign_key_indexes.sql`: covering indexes untuk tiga FK gabungan, sesuai hasil performance advisor.

Ketiga migrasi sudah diterapkan melalui connector Supabase. Jangan menjalankan ulang SQL create-table secara manual pada project yang sudah dimigrasi. Riwayat migration hosted mengikuti timestamp apply connector; nama migrasi dan isi SQL merupakan identitas release yang perlu dicocokkan sebelum replay pada environment baru. Dependensi: schema `private` dan fungsi `private.is_blog_admin()` dari Studio existing.

| Tabel | Akses |
| --- | --- |
| `affiliate_programs`, `affiliate_links`, `affiliate_campaigns`, `affiliate_commissions` | SELECT/INSERT/UPDATE hanya authenticated admin melalui allowlist Studio existing. Tidak ada DELETE grant. |
| `affiliate_click_events` | Admin read-only; append hanya lewat fungsi tracking private dengan credential server. |
| `affiliate_audit_log` | Admin read-only; trigger mencatat before/after, actor, dan waktu secara atomik. Tidak dapat diedit melalui API manager. |
| `private.affiliate_tracking_config` | RLS tertutup, tanpa grants publik; menyimpan hash credential berbeda per environment. |
| `private.affiliate_allowed_hosts` | RLS tertutup; operator mengatur domain tujuan yang boleh dipakai. |

Campaign memiliki FK gabungan agar program/link konsisten; commission campaign harus milik program yang sama. Provider reference unik per program/environment; nilai nonnegatif dengan dua desimal. Status earned/paid mewajibkan referensi provider, bukti, nominal, dan tanggal konfirmasi; paid membutuhkan tanggal bayar. Status payout/referral harus konsisten. API memvalidasi mata uang ISO, status, tanggal, slug, URL, batas ukuran payload, dan versi `updated_at` untuk menolak edit stale. Archive adalah edit reversibel dengan konfirmasi; riwayat tetap disimpan.

RPC analytics menggunakan **security invoker** dan RLS; query agregat dieksekusi di PostgreSQL. Tidak ada service-role key pada tracking atau frontend. Tracking memakai wrapper invoker menuju fungsi private definer yang sempit, fixed search path, grant execute terbatas, dan pemeriksaan credential sebelum membaca konfigurasi/menulis event. Fungsi tidak dapat membaca laporan atau mengubah konfigurasi. Tidak ada public direct insert ke tabel events. Security advisor tidak menemukan warning baru pada API affiliate; private tables tanpa policy merupakan intentional deny-all. Warning lama pada article engagement dan leaked-password protection berada di luar scope ini.

Referensi advisor untuk operator: [RLS enabled/no policy](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy), [anonymous definer execution](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable), [authenticated definer execution](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable), [password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection), dan [multiple permissive policies](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies). Tiga FK affiliate yang sempat ditandai performance advisor sudah mendapat covering indexes pada migrasi ketiga; sisa warning policy commerce merupakan baseline existing.

## Tracking dan privasi

1. GET memvalidasi slug/query dan mengambil tujuan dari storage server. Hanya parameter `campaign` yang didukung; URL tujuan dari query tidak diterima.
2. Program/link harus active. Campaign, jika disebut, harus active, milik link, dan berada dalam jendela waktu yang valid. Campaign tidak dikenal/nonaktif ditolak, bukan diberi atribusi palsu.
3. Tujuan divalidasi kembali di database dan server: HTTPS, domain allowlist, tanpa userinfo, fragment, port khusus, whitespace, atau backslash. Query referral asli dikembalikan utuh. Campaign hanya untuk atribusi internal; tidak menimpa UTM provider.
4. Pengunjung mendapat transisi singkat dengan POST otomatis. Token navigasi HMAC berumur dua menit, mengandung UUID event, slug, campaign, source category, expiry. Tidak ada cookie/localStorage tracker atau visitor ID. Tanpa JavaScript, tombol form tetap dapat dipakai.
5. POST memeriksa origin dan token; database memasukkan event dengan UUID unik. Retry token yang sama tidak menghasilkan event kedua. Response 303 menuju URL terverifikasi. Referrer ditahan pada navigasi eksternal. Bridge memakai same-origin referrer policy agar browser mengirim origin POST yang sah.
6. HEAD, prefetch, crawler/bot yang dikenali tidak mencatat event. Global ceiling 600 event/menit/environment membatasi pertumbuhan akibat spam tanpa IP/fingerprint. Di atas ceiling, navigasi masih diteruskan tetapi tidak dihitung. Ini bukan perlindungan sempurna dari bot yang menyamar; tidak mengklaim unique visitors atau atribusi provider.

Event hanya berisi ID, link, campaign nullable, waktu, source category, event type, environment. Tidak menyimpan URL referrer mentah, IP, user-agent, nama/email kandidat, atau fingerprint. Source campaign berasal dari konfigurasi admin; tanpa campaign, hanya klasifikasi domain referrer yang disimpan. Klik ulang yang menghasilkan navigasi baru bisa dihitung lagi; mengidentifikasi orang yang sama sengaja tidak dilakukan. Redirect/bridge tidak di-cache. Timeout/missing configuration/disabled destination menghasilkan pesan dan tautan kembali ke panduan, tanpa redirect ke URL tak tervalidasi.

## Menggunakan manager

Masuk di `/studio`, buka **Affiliates**. Overview/Analytics memakai filter 7/30/90 hari atau tanggal khusus, maksimal 366 hari; waktu laporan Asia/Jakarta. Jumlah program/link aktif menunjukkan konfigurasi saat ini, sedangkan klik dan komisi mengikuti periode. Mata uang ditampilkan terpisah, tidak dikonversi atau dijumlahkan lintas currency.

- **Programs**: tambah provider, situs resmi, jenis, status, catatan, last verified. Program baru sebaiknya draft sampai informasi diperiksa.
- **Links**: pilih program, isi nama/slug/type/owner dan URL lengkap. Tombol copy tersedia untuk URL referral maupun tracking, dengan fallback teks jika clipboard ditolak. Statistik per link mengikuti periode laporan.
- **Campaigns**: pilih program dan link yang sesuai; source/medium/slug berupa huruf kecil dan tanda hubung. Contoh `Threads Organic / threads-organic / threads / organic` menghasilkan `https://khadafidaffa.com/go/micro1?campaign=threads-organic`. Pada preview, tombol copy memakai origin preview agar tautan dapat diuji; pada production memakai domain utama. Campaign baru default draft; aktifkan saat siap dipakai. Jadwal date-only disimpan pada 00:00 UTC, ends_at eksklusif.
- **Analytics**: klik per program/link/campaign, per hari, sumber, dan klik terakhir berasal dari PostgreSQL. Bukan aplikasi, konversi, atau payout otomatis.
- **Commissions**: cocokkan dashboard/statement provider secara manual. Reported/qualified → pending; earned → confirmed; paid → paid; rejected → rejected. Jika sumber campaign tidak diketahui, pilih **Tidak teratribusi**. Jangan menebak dari jumlah klik. Simpan ID statement atau referensi bukti internal tanpa nama/email kandidat. Jumlah confirmed sudah termasuk paid, sehingga jangan menjumlahkan kedua angka itu sebagai pendapatan terpisah.

Search/status/program filters, pagination 25 baris, modal keyboard/escape, loading/error/retry, successful saves, dan riwayat before/after tersedia. Ledger commission disaring per environment dan periode berdasarkan tanggal pencatatan (created_at), bukan tanggal earning/payout provider. V1 memakai lookup katalog maksimum 1.000 program/link/campaign; belum dirancang untuk katalog berskala sangat besar. Belum ada API/webhook provider yang diverifikasi dan diintegrasikan pada project ini; tidak ada scraping atau auto-sync payout.

## Konfigurasi dan preview

`AFFILIATE_TRACKING_SECRET` adalah server-only, minimal 32 karakter; preview memiliki credential acak sendiri yang hash SHA-256-nya terdaftar di private config. Nilai disimpan lokal dalam `.env.local`/`.dev.vars` yang di-ignore dan diupload hanya sebagai secret versi preview. `AFFILIATE_ENVIRONMENT` harus cocok dengan scope credential; default fail-safe preview. `AFFILIATE_ALLOWED_HOSTS` hanya konfigurasi server/operator; tambahan domain juga harus didaftarkan pada private DB allowlist. Admin UI tidak dapat mengubah allowlist.

Untuk production kelak: siapkan credential **berbeda** untuk scope production, validasi hash/scope serta domain, build/QA, review PR, baru lakukan merge/deploy dengan instruksi eksplisit. Jangan mempromosikan secret preview sebagai credential production. Jangan mencampur QA events atau ledger preview ke laporan production.

Rollback aman: kembalikan versi aplikasi sebelumnya atau pause program/link/campaign. Pertahankan tabel dan audit untuk rekonsiliasi; tidak perlu drop/truncate tabel. Pembatalan data ledger dilakukan lewat edit status dengan bukti/catatan dan audit. Tidak ada destructive down migration otomatis.

## Validasi

- `node scripts/check-affiliate.cjs`: 30 validasi referral, URL berbahaya, currency/amount/evidence/status, campaign date, source classification, single entry, no analytics seed.
- `scripts/check-affiliate-db.sql`: transaksi **PostgreSQL hosted nyata**, RLS anon/non-admin/admin, CRUD/audit, FK, URL, komisi, duplicate reference, event idempotency, source aggregation, link/program/campaign paused. Seluruh QA writes di-rollback.
- `node scripts/check-micro1-browser.cjs`: Chrome, 360/768/1280, FAQ/anchor/CTA, signed POST/303 exact referral params, HEAD/prefetch, tampering/open redirect, unauthorized admin methods, related routes. Memakai Supabase nyata untuk event preview; respons 303 ditahan agar tidak mengirim aplikasi/form ke provider.
- `node scripts/check-affiliate-manager-browser.cjs`: loopback Supabase HTTP fixture untuk UI/API integration lengkap, sesi existing → server gate, six areas, create/edit/archive, copy, manual commission validation/paid, empty state, stale edit, outage/retry. Fixture tidak dikirim ke hosted database dan tidak disisipkan dalam application code. Pemeriksaan RLS/persistence hosted dilakukan terpisah oleh SQL di atas. Login admin asli di hosted preview memerlukan kredensial pemilik; kredensial tidak dibuat, diubah, atau diambil untuk QA.
- Regression Resource Library, directory/search/jobs, targeted TypeScript/ESLint, production Next/Worker build dan live preview smoke checks dicatat pada bagian hasil release setelah selesai.

Screenshot dan laporan JSON berada di `artifacts/micro1/` (ignored, tersedia di checkout lokal).

## Hasil release preview — 12 Oktober 2026

- Implementasi aplikasi: commit `4c84a42`, sudah di-push ke branch PR #3 `feat/micro1-directory-20261012`. Commit sesudahnya hanya merapikan script QA dan mencatat hasil verifikasi; aplikasi pada Worker sama dengan commit implementasi tersebut.
- Preview publik: [Micro1 Directory](https://micro1-affiliates-khadafi.dhiyaulhaqkhadafi0.workers.dev/freelance/direktori/micro1). Manager: [Studio Affiliates](https://micro1-affiliates-khadafi.dhiyaulhaqkhadafi0.workers.dev/studio/affiliates).
- Worker preview `e8e25992-eee5-43f2-bead-7c9b4aa0c433`; [URL versi tetap](https://e8e25992-khadafi.dhiyaulhaqkhadafi0.workers.dev/freelance/direktori/micro1). Upload menggunakan `versions upload --keep-vars --secrets-file .dev.vars --preview-alias micro1-affiliates`, bukan deployment traffic production.
- Next webpack production build **exit 0**, TypeScript berhasil, 68 static pages. OpenNext Worker build **exit 0**. Dependency preview diinstal terpisah melalui `npm ci`; Windows copy warnings pada paket MDX tetap muncul, sehingga pemeriksaan runtime hosted dilakukan setelah build. Tidak ada perubahan dependency manifest atau lockfile.
- R2: **58/58** objek cache diunggah dengan prefix build `N32oTVNTN6B_WFuXvHv8-`; tidak menimpa prefix build production. `/go` dan `/studio/affiliates` dynamic, tidak masuk cache statis. Pemindaian **407** aset publik tidak menemukan nilai private credential dari environment lokal.
- Validator **30 lulus**; regression directory/search/jobs **lulus** (24 platform, 33 tujuan unik); Resource Library **lulus** (9 resource, 4 download, 7 bab, calculator dan invalid inputs).
- PostgreSQL hosted transaction/RLS/CRUD/audit/aggregate checks **lulus**, seluruh data sintetis rollback. Tiga migrasi additive sudah diterapkan; tidak ada migrasi tabel/auth existing atau destructive SQL.
- Browser publik hosted **16 lulus**, Chrome 360/768/1280; FAQ, anchor, referral POST/303, parameter asli, signed-token retry, HEAD/prefetch, arbitrary destination rejection, unauthorized GET/POST/PATCH, dan related routes. Respons ke provider ditahan oleh QA; tidak ada aplikasi kandidat dikirim.
- Browser pencarian direktori hosted **lulus**: pencarian `Micro1` menghasilkan tepat satu link lalu membuka detail yang benar.
- HTTP smoke hosted **22 lulus**, termasuk canonical/sitemap, gate admin `no-store`, alias handbook 308, resource MDX dan artikel blog existing, tracker unavailable 410, serta route commerce tetap 404. Production Resource Library masih 200 dan Micro1 masih 404, sesuai batas preview.
- Manager UI/API **17 lulus** pada loopback fixture: existing-session bridge, gate server, CRUD, clipboard preview URL, archive confirmation, manual proven commission, totals, empty/error/retry, optimistic conflict, unauthorized/non-admin access, dan unsafe/offline/inactive tracking. Ini tidak menggantikan login pemilik pada preview; persistence dan RLS hosted dibuktikan terpisah lewat PostgreSQL.
- ESLint seluruh source repo (tanpa generated artifacts) masih mempunyai **25 error dan 81 warning pada file existing di luar perubahan ini**. Seluruh file TS/TSX/CJS yang berubah bersih dari error maupun warning. Tidak mengklaim lint seluruh repository lulus.
- TypeScript `tsc --noEmit` **exit 0** dan changed-file ESLint **exit 0**. Cloudflare Git integration berhasil membangun branch commit `4c84a42`; integrasi Vercel existing melaporkan error, terpisah dari Worker preview yang diuji. URL preview terkonfigurasi di atas memiliki secret tracking preview sendiri; jangan memakai preview bot lain sebagai bukti konfigurasi credential.
- Setelah browser hosted: **5 click events preview nyata**, **0 click events production**, **0 commission**, **1 program**, **1 link**, **1 campaign**. Klik preview mencakup navigasi QA lokal/hosted; bukan laporan konversi atau penghasilan provider.
- Production traffic tetap **100%** pada Worker `e1c6d95e-1bdd-4cdd-b157-c3c2c1c42610`, deployment `8db29913-f247-4bec-aaba-ad900ccf7c88`. Tidak menjalankan merge PR, `wrangler deploy`, atau `versions deploy`.

Koneksi lokal memiliki kendala DNS ISP: hostname `workers.dev` diarahkan ke CNAME `blockpage.xlaxiata.id`. Verifikasi hosted dilakukan melalui IP Cloudflare dari HTTPS DNS resmi, menggunakan tunnel loopback khusus hostname preview dan validasi sertifikat HTTPS normal. DNS perangkat tidak diubah. Jika preview tidak terbuka dari jaringan yang sama, gunakan koneksi yang dapat mengakses `workers.dev`; ini terpisah dari runtime aplikasi. Credential owner dan konfigurasi akun Micro1 tidak diambil atau diubah. Analytics hanya mengetahui navigasi website; commission/conversion tetap rekonsiliasi manual.

## Langkah production release berikutnya

1. Tinjau PR #3 dan uji login melalui akun Studio pemilik yang sudah ada pada preview. Sesudah login, buka Affiliates; manager tetap memakai allowlist admin existing.
2. Operator membuat secret production yang berbeda, memasukkan hash SHA-256 dengan scope production ke private tracking config, dan mengatur `AFFILIATE_ENVIRONMENT=production` pada versi release. Validasi exact referral, allowlist domain, dan scope credential sebelum release.
3. Setelah ada instruksi production eksplisit, merge PR, build dari commit yang disetujui, upload cache dengan prefix build baru, deploy Worker ke domain utama, lalu smoke-test public detail, tracked redirect, admin authorization, dan statistik production. Preview QA events tetap berada pada scope preview.
4. Jika pemeriksaan gagal, pertahankan/kembalikan versi aplikasi sebelumnya dan pause program/link/campaign bila diperlukan. Jangan menghapus tabel, audit, atau ledger untuk rollback.

## Peta perubahan source

- Public: `Micro1Page.tsx`, `micro1.module.css`, route detail `[slug]/page.tsx`, dan `freelance-directory.ts`.
- Backend: `affiliate-types.ts`, `affiliate-validation.ts`, `affiliate-server.ts`, `affiliate-auth.ts`, `/go/[slug]/route.ts`, dua handler API Studio, dan server-gated `/studio/affiliates/page.tsx`.
- Studio: `AffiliateManager.tsx`, `AffiliateSessionGate.tsx`, `affiliates.module.css`, dan link internal pada `StudioHeader.tsx`.
- Database: tiga migrasi SQL di atas.
- QA: empat script affiliate/Micro1, penyesuaian count direktori menjadi 24/33, serta normalisasi CRLF pada pemeriksaan download Resource Library.
- Konfigurasi: `.env.example`, ignore credential/cache lokal, `NEXT_OUTPUT_DIR` untuk memisahkan build production dari output QA/dev, dan pengecualian direktori artifact generated dari TypeScript.
