# HCFTL Iteration 6.2 — Hero, Entrance, dan Visual Riset

## Prompt implementasi untuk Anti Gravity / Codex lokal

Lanjutkan halaman `/lab` dari versi lokal terbaru setelah Iteration 6.1. Pengguna sudah menyukai karakter halaman ini. Pertahankan pahatan silver, tipografi editorial, palet gelap premium, susunan section, dan interaksi buka-tutup yang sudah berfungsi.

Terapkan tujuh perbaikan spesifik: hero lebih hidup dengan kontrol jeda utuh, headline berganti dengan konteks relevan, visual manifesto baru, entrance judul section, ilustrasi Evidence Ladder, konektor keselamatan/otonomi yang merespons pembacaan, serta nama founder satu baris jika ruang memungkinkan.

Kerjakan implementasi hingga preview dan verifikasi. Baca aturan proyek, status git, diff lokal, komponen Lab, serta sumber data sebelum mengedit. Jangan menimpa pekerjaan pengguna atau kembali ke desain sebelum Iteration 6.

## 1. Hero: gerakan yang lebih terbaca dan kontrol jeda utuh

### Hidupkan pahatan silver existing

Pertahankan bentuk cincin/pita silver yang sudah disukai. Perkuat kesan volume serta gerakannya tanpa menjadikannya loading spinner:

- Gerakan utama: perubahan orientasi perlahan dengan rentang kecil, misalnya 4–7 derajat dalam 12–18 detik, atau deformasi perspektif ringan yang tidak merusak bentuk. Ini titik awal; pilih efek yang cocok dengan implementasi SVG/CSS/canvas existing.
- Gerakan pendamping: satu highlight cyan-silver yang berjalan mengikuti tepian dalam siklus 7–10 detik. Jalurnya mengikuti geometri objek, bukan sapuan persegi di atas seluruh visual.
- Beri perbedaan terang sisi depan, sisi belakang, dan tepian. Bentuk harus terlihat jelas dalam keadaan animasi dijeda.
- Tambahkan paling banyak dua titik kecil bercahaya pada tepian hanya bila masih terasa terlalu statis. Titik tidak berkedip cepat dan tidak membentuk starfield.
- Parallax pointer desktop boleh sekitar 6–8 px, dengan interpolasi lembut. Jangan menggeser teks, tombol, atau area klik.
- Maksimal dua gerakan ambient dominan sekaligus. Jika highlight sudah cukup, tidak perlu menambah pulse, partikel, dan orbit baru.

### Perbaiki kontrol jeda yang terpotong di kanan

Pengguna melihat tulisan kecil seperti `Jeda` terpotong di sisi kanan hero. Audit bounding box, posisi, overflow ancestor, dan z-index pemicunya. Jangan menganggap masalah selesai dengan mengecilkan font.

- Pisahkan container dekorasi yang boleh dicrop dari container kontrol UI.
- Letakkan kontrol `Jeda animasi` / `Lanjutkan animasi` di baris bawah area visual dalam normal flow, rata kanan desktop, dengan ruang aman kanan/bawah minimal sekitar 16–24 px.
- Tombol tidak boleh berada di luar lebar viewport, di bawah masking objek, atau di dalam clipping layer dekoratif.
- Label sekitar 12–14 px, kontras cukup, ikon dan teks utuh, target sentuh sekitar 44 px, dan focus ring tidak terpotong.
- Pada mobile, kontrol tetap dalam lebar container dan tidak overlap status hero.
- Hubungkan dengan state jeda Lab existing. Tombol menghentikan gerak pahatan, highlight, animasi ambient diagram/background, dan timer headline. Labelnya mencerminkan keadaan aktual.

## 2. Headline berputar dengan konteks yang relevan

Pertahankan bagian statis `Teknologi frontier.` dan `Berpusat pada`. Ganti bagian terakhir beserta kalimat penjelasan sebagai satu pasangan data:

| Teks berganti | Kalimat pendukung yang menyertainya |
| --- | --- |
| manusia. | Mengembangkan sistem cerdas yang memperluas kemampuan manusia, dengan keputusan penting tetap berada di tangan manusia. |
| kehidupan. | Mengeksplorasi manfaat AI bagi kehidupan manusia melalui eksperimen terukur dan bukti yang dapat diperiksa. |
| masa depan. | Meneliti teknologi masa depan dengan mempertimbangkan dampaknya bagi manusia sejak tahap perancangan. |

Ini adalah tiga sudut pandang dari positioning human-centered yang sama. Nama lengkap HCFTL dan identitas lab tetap terlihat. Jangan menambahkan janji hasil riset atau klaim manfaat yang sudah terbukti bila belum tersedia.

### Timing dan layout

- Render awal selalu `manusia.`. Tahan setiap pasangan sekitar 6 detik sebelum transisi 550–700 ms. Timer dimulai setelah halaman siap terlihat.
- Gunakan crossfade dan perpindahan vertikal kecil sekitar 8–12 px. Tidak ada typewriter, scramble huruf, bounce, atau pergantian yang mengosongkan headline sesaat.
- Kata dan penjelasannya berganti sinkron dari satu state/data source, tanpa interval terpisah yang bisa tidak selaras.
- Pertahankan posisi headline, paragraf, dan CTA. Ukur kebutuhan frasa serta paragraf terpanjang pada breakpoint aktual, lalu reservasi ruang secukupnya. Hindari fixed pixel height yang memotong teks saat font/zoom berubah.
- Animasi hanya pada bagian berganti. Jangan menganimasikan ulang seluruh H1 setiap siklus.
- Timer berhenti saat hero keluar viewport, document tersembunyi, pengguna menekan jeda, atau pengguna sedang menyeleksi teks/berinteraksi dengan area copy. Saat dilanjutkan, lanjutkan dari keadaan terakhir tanpa mengejar siklus yang terlewat.
- Pada reduced motion, tampilkan pasangan `manusia.` secara statis dan hentikan auto-rotation. Jangan hanya menghilangkan transisi sementara kata tetap berubah sendiri.

### Aksesibilitas

- Tetap satu H1 semantik. Screen reader mendapat identitas headline yang stabil; jangan mengumumkan setiap pergantian melalui aria-live.
- Jika salinan visual animasi dipisahkan dari teks aksesibel, hindari pembacaan ganda. Deskripsi aksesibel yang stabil harus mewakili posisi lab secara benar.
- Kontrol jeda harus dapat ditemukan dan digunakan dengan keyboard. Membuka panel atau berpindah fokus tidak boleh menyebabkan fokus hilang ketika copy berganti.
- Headline dan isi penting tetap tersedia jika JavaScript gagal. Cegah hydration mismatch dari pemilihan slide berbasis waktu/random pada initial render.

## 3. Manifesto: visual yang jelas dan bermakna

Ganti ornamen manifesto yang terlalu samar dengan ilustrasi konseptual **jaringan kemampuan manusia**. Gunakan diagram berbeda dari cincin hero agar tidak terasa repetitif.

- Satu titik pusat berlabel `Manusia` terhubung ke tiga bidang/ujung struktur berlabel `Memahami`, `Memutuskan`, dan `Bertindak`.
- Perlihatkan hubungan melalui garis tipis yang cukup terang, bidang transparan berlapis, dan node yang memiliki depth sederhana. Label tetap sebagai teks yang terbaca, bukan tulisan mungil di dalam objek.
- Inti stabil; satu sinyal cahaya dapat bergerak keluar dan kembali perlahan sebagai ilustrasi perluasan kemampuan. Maksimal satu aliran sinyal aktif agar tidak ramai.
- Caption ringkas boleh berbunyi `Kemampuan bertambah. Kendali tetap pada manusia.` Ini konsep visual, bukan klaim sistem riset yang sudah berjalan.
- Desktop: quote dan ilustrasi berada dalam ruang terpisah yang seimbang. Visual sekitar 300–420 px jika lebar mencukupi; tidak menumpuk di atas quote.
- Mobile: visual setelah quote dengan tinggi sekitar 220–280 px dan label yang tidak ikut mengecil berlebihan.
- Tingkatkan keterbacaan elemen utama dan pertahankan background lembut. Jangan menurunkan opacity seluruh diagram demi estetika.
- Pertahankan disclosure manifesto serta narasi existing.

## 4. Entrance judul section yang halus dan premium

Interpretasikan referensi pengguna ke presentasi Apple melalui pacing yang tenang, hierarki yang kuat, dan gerak presisi. Tidak perlu menyalin aset, logo, atau menambah transisi teatrikal.

Terapkan pola yang sama pada judul utama Manifesto, Frontier, Metode, Evidence Ladder, Governance, Kerangka Keselamatan, Skala Otonomi, Perkembangan, dan Founder:

- Judul muncul dengan opacity dan translateY sekitar 18–24 px selama 650–850 ms.
- Blur sangat ringan maksimal 2–3 px boleh dicoba lalu hilang, hanya jika hasil render teks tetap bersih. Jika mahal atau tampak kabur, gunakan opacity/transform saja.
- Label bab hadir terlebih dahulu, judul menyusul sekitar 60–90 ms, paragraf pengantar sekitar 100–160 ms. Seluruh rangkaian cukup singkat agar tidak menunda membaca.
- Animasi dipicu sekali saat heading pertama memasuki viewport. Heading yang sudah di atas fold saat load langsung terbaca atau mendapat entrance singkat tanpa menunggu scroll.
- Gunakan wrapper dengan ruang bagi ascender/descender dan focus target. Jangan memotong huruf italic atau baris kedua dengan mask yang terlalu sempit.
- Jangan membelah teks menjadi puluhan span huruf untuk efek ini. Pertahankan urutan heading dan semantik yang benar.
- Jangan menyembunyikan seluruh section sampai animasi selesai; ini entrance judul, bukan gate untuk membaca konten.
- Reduced motion dan fallback tanpa JS menampilkan heading langsung. Anchor langsung ke section harus memperlihatkan judul dan target tanpa menunggu trigger viewport yang gagal.

## 5. Evidence Ladder: ilustrasi bukti bertingkat

Tambahkan ilustrasi yang relevan dengan peningkatan kualitas bukti, dipasangkan dengan daftar level existing.

- Gunakan enam bidang/platform tipis yang naik bertahap membentuk struktur perspektif ringan jika sumber lokal memang memiliki enam level. Jumlah, urutan, dan label harus berasal dari model data aktual.
- Setiap platform dipetakan satu-ke-satu dengan level. Jangan menggambar skala angka, persentase, atau tinggi yang menyiratkan pengukuran kuantitatif.
- Saat level dibuka pada daftar, platform terkait mendapat edge light cyan dan penanda aktif; lainnya tetap terlihat lebih redup. Caption memperlihatkan nama level yang sedang dibaca.
- Highlight menggambarkan **level yang dipilih pengunjung**, bukan level yang sudah dicapai HCFTL. Jangan menambahkan badge pencapaian tanpa sumber.
- Transisi highlight sekitar 250–400 ms. Diagram tetap terlihat ketika tidak ada level terbuka; jangan memilih level capaian secara otomatis.
- Desktop: ilustrasi berada di samping daftar dengan ruang yang cukup. Mobile: ilustrasi ringkas di atas daftar, dengan label yang tetap terbaca.
- Daftar menjadi sumber interaksi utama. Diagram boleh dekoratif jika informasi yang sama telah tersedia secara aksesibel pada daftar; jangan membuat kontrol keyboard duplikat tanpa kebutuhan.
- Pertahankan isi dan perilaku accordion Evidence Ladder. Hindari mengganti semua penjelasan dengan ilustrasi saja.

## 6. Garis penghubung keselamatan dan skala otonomi

Pengguna ingin setiap fase memiliki garis/titik penghubung yang hidup saat dibaca. Terapkan sebagai **panduan pembacaan yang aktif**, bukan indikator status operasional lab.

### Kerangka keselamatan

GREEN, AMBER, dan RED adalah kategori/batas keselamatan, bukan tahapan yang harus dilalui menuju RED. Pertahankan arti tersebut pada copy dan diagram.

- Buat garis panduan vertikal tipis di sisi daftar, dengan node pada setiap kategori.
- Garis dasar dan semua label kategori tersedia sejak panel terbuka. Segmen aksen digambar singkat menuju kategori yang dilihat atau dipilih, lalu node kategori itu menyala dengan warna semantiknya.
- Warna aksen lokal mengikuti kategori aktif; jangan mengisi seluruh garis menjadi hijau/merah seolah menyatakan hasil pemeriksaan.
- RED tetap memiliki ringkasan batas yang terbaca tanpa harus menunggu animasi atau menyelesaikan fase sebelumnya.
- Gunakan istilah `Kategori yang dibaca` bila perlu menjelaskan state; jangan `Fase selesai`, progress percent, atau tanda centang pencapaian.

### Skala otonomi

- Buat konektor vertikal berurutan dari level terendah hingga tertinggi sesuai data existing, misalnya A0–A5 jika memang itu model lokal.
- Setiap node menampilkan kode, nama level, dan ringkasan. Node yang dibaca atau dibuka mendapat garis aksen cyan-silver serta edge light lembut.
- Level lebih tinggi bukan otomatis lebih baik atau lebih aman. Jangan menggunakan badge sukses pada level tertinggi.
- Detail bisa dibuka bertahap oleh pengguna. Label dan ringkasan seluruh level tetap dapat dipindai tanpa menunggu autoplay.

### Logika aktivasi dan animasi

- Prioritaskan pemilihan eksplisit melalui klik, keyboard, atau disclosure. Jika tidak ada pilihan eksplisit, sorot baris yang paling dekat dengan area baca viewport menggunakan observer yang stabil.
- Setelah pengguna memilih kategori/level, pertahankan pilihan sampai pengguna memilih yang lain atau menutup panel; scrollspy tidak boleh langsung menimpanya.
- State keselamatan dan otonomi independen. Dua kolom yang terlihat bersamaan tidak saling mengubah pilihan.
- Garis aktif dapat memakai stroke-dashoffset selama sekitar 350–600 ms setelah pemilihan. Titik mendapat satu pulse lembut lalu menetap; hindari aliran berkedip terus-menerus pada semua level.
- Pola titik-titik boleh digunakan pada garis dasar. Jangan membuat garis terlalu redup hingga hilang atau terlalu terang hingga menyaingi teks.
- Konektor mengikuti posisi node saat disclosure mengubah tinggi konten dan ketika layout berubah ke mobile. Hitung ulang bila perlu, jangan mengandalkan koordinat pixel tetap.
- Node berada di gutter tersendiri, tidak menembus teks atau ikon kontrol.
- Reduced motion menampilkan konektor dan pilihan aktif langsung. Global pause menghentikan efek bergerak, tetapi perubahan pilihan pengguna tetap dapat ditampilkan seketika.
- Tidak ada autoplay yang membuka semua detail atau memaksa pengunjung menunggu langkah demi langkah.

## 7. Nama founder satu baris jika ruang mencukupi

Nama lengkap yang harus dipertahankan: `Daffa Dhiyaulhaq Khadafi`.

- Pada desktop lebar, berikan heading nama satu baris penuh di atas grid profil. Narasi dan tautan berada pada baris di bawah, sehingga nama tidak terkurung di kolom sempit.
- Gunakan ukuran fluid yang sesuai font aktual, misalnya rentang awal 36–64 px pada desktop, kemudian ukur lebar render nyata. Sesuaikan ukuran heading ini sendiri, jangan mengecilkan semua judul section.
- Pada viewport yang benar-benar cukup, gunakan nowrap pada breakpoint yang telah teruji. Jangan menerapkannya secara global.
- Pada layar kecil, izinkan wrap alami menjadi dua baris dengan pemenggalan yang rapi. Jangan menggunakan marquee, horizontal scroll, scaleX, tracking ekstrem, ellipsis, atau menghilangkan bagian nama.
- Pada zoom 200%, keterbacaan dan reflow lebih utama daripada memaksa satu baris.
- Font, warna, dan peran founder tetap konsisten dengan karakter editorial halaman.

## 8. Implementasi, performa, dan batas scope

- Gunakan komponen, font, motion utilities, serta model data existing. Tidak perlu redesign section lain, backend baru, atau library animasi baru tanpa kebutuhan yang terbukti.
- Gunakan state jeda global existing untuk semua motion. Audit animasi CSS, SVG, timer headline, dan requestAnimationFrame agar semuanya benar-benar mengikuti jeda.
- Hormati reduced motion dari render awal, termasuk headline, entrance, sinyal visual, konektor, dan smooth scroll.
- Hentikan timer/loop ketika section tidak terlihat atau document tersembunyi. Bersihkan listener, observer, dan timer ketika komponen unmount.
- Hindari React setState setiap pointermove, animasi blur besar, atau membangun ulang geometri kompleks tiap frame.
- Jangan mengubah informasi faktual, status eksperimen, level evidence, kategori keselamatan, atau definisi otonomi demi visual.

## 9. Bukti selesai

Prioritaskan verifikasi tujuh permintaan pengguna ini:

1. Rekam hero minimal 20–25 detik agar tiga pasangan headline terlihat, termasuk transisi kalimat pendukung. Tidak ada layout jump, overlap, atau CTA berpindah posisi.
2. Tunjukkan pahatan yang lebih hidup serta tombol jeda utuh. Buktikan jeda menghentikan motion dan pergantian headline.
3. Tunjukkan manifesto dengan visual yang jelas serta entrance beberapa judul saat scroll pertama.
4. Pilih beberapa level evidence dan buktikan highlight ilustrasi mengikuti pilihan tanpa menyiratkan pencapaian lab.
5. Pilih dan scroll kategori keselamatan serta level otonomi; rekam konektor aktif, disclosure, dan stabilitas state masing-masing.
6. Screenshot nama founder satu baris di desktop lebar, lalu reflow yang rapi di mobile dan zoom 200%.
7. Periksa 360, 390, 768, 1024, dan 1440 px; sertakan viewport pendek, keyboard, reduced motion, dan anchor menuju detail tersembunyi.

Jalankan gate lint/typecheck/build proyek serta periksa console. Laporkan hasil aktual, exit code, URL preview dan port yang terkonfirmasi, serta kendala tersisa. Screenshot atau log build saja tidak membuktikan gerak yang halus; rekaman interaksi diperlukan.

Ikuti otorisasi commit/push yang sudah berlaku. Task ini meminta implementasi dan preview yang dapat direview, tidak menambah permintaan merge atau deployment production.
