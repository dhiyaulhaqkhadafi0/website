export type GuideSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};
export type LearningGuide = {
  intro: string;
  sections: GuideSection[];
  template?: string;
  example?: string;
  prompts?: { group: string; title: string; text: string }[];
  checklist?: { id: string; group: string; label: string }[];
};
export const LEARNING_GUIDES: Record<string, LearningGuide> = {
  "product-idea-brief": {
    intro:
      "Ide yang menarik belum tentu memecahkan masalah yang cukup penting. Brief ini membantumu menjelaskan siapa yang dibantu, apa yang perlu diuji, dan seberapa kecil produk pertama yang masuk akal. Isi dengan pengamatan nyata; tandai bagian yang masih berupa dugaan.",
    sections: [
      {
        title: "Mulai dari masalah, bukan fitur",
        paragraphs: [
          "Tulis satu kejadian konkret: siapa yang mengalami kesulitan, kapan itu terjadi, dan apa akibatnya. Hindari kalimat luas seperti “semua orang membutuhkan produktivitas”. Masalah yang sempit lebih mudah diperiksa melalui percakapan dan pengamatan.",
          "Pisahkan fakta, asumsi, dan pertanyaan. “Tiga orang menunjukkan spreadsheet mereka” adalah bukti pengamatan; “mereka pasti mau membayar aplikasi” masih asumsi.",
        ],
        bullets: [
          "Problem statement: [pengguna] kesulitan [pekerjaan] saat [konteks], sehingga [dampak].",
          "Catat sumber pengamatan, tanggal, frekuensi masalah, dan cara orang mengatasinya sekarang.",
        ],
      },
      {
        title: "Kenali pengguna dan alternatifnya",
        paragraphs: [
          "Pilih satu kelompok awal berdasarkan perilaku, bukan hanya umur atau jabatan. Siapa yang baru saja mengalami masalah ini dan bersedia menunjukkan cara kerjanya? Jelaskan pemicu, keterbatasan waktu, alat yang dipakai, dan siapa yang mengambil keputusan.",
          "Tanyakan pengalaman terakhir, bukan “apakah kamu akan memakai aplikasi saya?”. Dengarkan langkah yang mereka lakukan, bagian yang menghabiskan waktu, dan alasan alternatif saat ini belum cukup.",
        ],
        bullets: [
          "Apa yang dilakukan terakhir kali masalah muncul?",
          "Apa alternatifnya: spreadsheet, pesan WhatsApp, layanan lain, atau tidak melakukan apa pun?",
          "Apa biaya waktu, risiko, atau uang yang benar-benar mereka alami?",
        ],
      },
      {
        title: "Rumuskan hipotesis solusi dan nilai inti",
        paragraphs: [
          "Tuliskan perubahan yang ingin dibantu sebelum memilih teknologi. Gunakan pola: jika [pengguna] dapat [tindakan], maka [hasil] menjadi lebih mudah. Jelaskan mengapa pendekatan ini lebih cocok untuk konteks mereka daripada alternatif.",
          "Bila solusi memakai AI, tentukan bagian yang dibantu model dan bagian yang harus tetap pasti. Tentukan bagaimana pengguna memeriksa dan memperbaiki hasil. Jangan memakai AI hanya karena sedang populer.",
        ],
      },
      {
        title: "Pangkas MVP dan tetapkan batasnya",
        paragraphs: [
          "Pilih satu alur yang dapat diselesaikan dari awal sampai akhir. Kelompokkan fitur menjadi wajib, nanti, dan di luar lingkup. Fitur wajib harus langsung membantu menguji hipotesis; fitur menarik yang belum dibutuhkan masuk daftar nanti.",
          "Tuliskan non-goals secara eksplisit agar desain dan implementasi tidak melebar. Tentukan juga siapa yang belum dilayani, integrasi yang belum ada, dan tindakan yang belum didukung.",
        ],
        bullets: [
          "Wajib: tindakan utama, data minimum, penanganan kegagalan, dan cara mengetahui apakah tugas selesai.",
          "Nanti: otomatisasi, variasi tampilan, dan integrasi tambahan.",
          "Di luar lingkup: kemampuan yang tidak diperlukan untuk menguji masalah awal.",
        ],
      },
      {
        title: "Uji asumsi yang paling berisiko",
        paragraphs: [
          "Daftar risiko kebutuhan pengguna, kelayakan teknis, privasi, biaya operasional, dan distribusi. Mulai dari asumsi yang paling menentukan, lalu pilih uji termurah: wawancara, prototipe klik, layanan manual, atau versi kecil.",
          "Sebelum menguji, tulis indikator keputusan. Catat penyebut pada setiap angka; “4 dari 6 peserta menyelesaikan tugas” lebih berguna daripada “67% berhasil” tanpa konteks. Sampel kecil membantu belajar, bukan membuktikan seluruh pasar.",
        ],
        bullets: [
          "Tentukan tugas uji, cara merekrut, dan izin menggunakan catatan peserta.",
          "Pisahkan metrik kegunaan (tugas selesai, kesalahan) dari minat (permintaan mencoba lagi).",
          "Putuskan kapan melanjutkan, mempersempit, atau mengulang masalah awal.",
        ],
      },
      {
        title: "Gunakan brief sebagai dokumen yang hidup",
        paragraphs: [
          "Salin template di bawah, isi dalam satu sesi, lalu tandai pertanyaan yang belum terjawab. Pilih satu eksperimen berikutnya dengan penanggung jawab dan tanggal tinjauan. Perbarui brief berdasarkan hasil, bukan karena ingin mempertahankan ide awal.",
          "Setelah masalah dan alur awal cukup jelas, lanjutkan ke AI Product Blueprint untuk merinci persyaratan. Sebelum rilis, gunakan MVP Readiness Checklist. Brief ini membantu mengambil keputusan; ia tidak menjamin bahwa sebuah ide akan menjadi bisnis yang berhasil.",
        ],
      },
    ],
    template:
      "# Product Idea Brief\n\n## 1. Masalah\n[Pengguna] kesulitan [tugas] ketika [konteks], sehingga [dampak].\nBukti dan sumber pengamatan:\nFrekuensi / tingkat kepentingan:\n\n## 2. Pengguna awal\nPerilaku dan konteks:\nPemicu kebutuhan:\nPekerjaan yang ingin diselesaikan:\nPain points:\nPengambil keputusan:\n\n## 3. Alternatif saat ini\nAlat / proses manual:\nKelebihan alternatif:\nKeterbatasan yang diamati:\n\n## 4. Hipotesis solusi\nJika pengguna dapat ..., maka ...\nNilai inti yang ditawarkan:\nAlur utama dari awal hingga selesai:\n\n## 5. Lingkup MVP\nWajib:\nNanti:\nNon-goals / pengguna yang belum dilayani:\n\n## 6. Asumsi dan risiko\nAsumsi | Bukti saat ini | Risiko jika salah | Cara menguji\n\n## 7. Validasi\nEksperimen:\nPeserta dan cara merekrut:\nTugas uji:\nIndikator sukses dan penyebut:\nBatas keputusan untuk lanjut / ubah / hentikan:\n\n## 8. Langkah berikutnya\nTindakan:\nPenanggung jawab:\nTanggal tinjauan:\nHasil dan perubahan keputusan:\n",
    example:
      "CONTOH FIKTIF — ilustrasi cara mengisi, bukan hasil riset nyata.\n\nNama ide: Antrean Revisi\nMasalah: ilustrator lepas sulit menemukan revisi terakhir ketika masukan klien tersebar di chat, sehingga pekerjaan yang sudah selesai kadang diulang.\nPengguna awal: ilustrator yang menangani 2–4 proyek bersamaan dan menerima masukan lewat chat.\nBukti: belum ada; wawancara dan observasi masih harus dilakukan.\nAlternatif: pesan berbintang dan spreadsheet. Keterbatasan yang diasumsikan: versi dan status belum terhubung.\nHipotesis: satu daftar masukan per versi membantu ilustrator menyepakati pekerjaan berikutnya.\nNilai inti: kejelasan revisi, bukan penambahan aplikasi manajemen proyek yang lengkap.\nMVP: buat proyek, catat masukan, tandai versi dan status, bagikan ringkasan.\nNon-goals: pembayaran, chat internal, AI generatif, dan aplikasi seluler native.\nRisiko: klien tidak mau memakai alat baru. Uji awal: ringkasan dibagikan sebagai tautan tanpa akun klien.\nValidasi: uji prototipe dengan 5 ilustrator yang direkrut atas persetujuan mereka. Sasaran awal yang ditetapkan tim: 4 dari 5 menemukan revisi terakhir tanpa bantuan. Angka ini merupakan kriteria eksperimen, bukan hasil.\nLangkah berikutnya: lakukan percakapan tentang proyek terakhir, amati alur, lalu revisi problem statement sebelum menulis kode.",
  },
  "checklist-persiapan-freelance": {
    intro:
      "Mulai freelance tidak harus dimulai dengan profil yang sempurna atau puluhan platform. Panduan ini membantu menyiapkan satu layanan yang jelas, bukti kerja yang jujur, dan proses dasar untuk menangani proyek. Hasil tiap orang berbeda; rencana ini adalah alat belajar, bukan jaminan mendapatkan klien.",
    sections: [
      {
        title: "01 — Pilih satu keahlian yang bisa ditawarkan",
        paragraphs: [
          "Daftar pekerjaan yang sudah bisa kamu selesaikan, lalu pilih satu layanan dengan hasil yang dapat diperlihatkan. Contohnya merapikan presentasi, menulis artikel, membuat landing page, atau menyunting video pendek. Pilih yang sesuai dengan kemampuan saat ini dan waktu yang tersedia.",
          "Jelaskan siapa pengguna layananmu dan masalah yang dibantu. “Menyunting tiga video edukasi untuk tutor independen” lebih mudah dipahami daripada “bisa semua urusan digital”. Pelajari contoh permintaan nyata untuk melihat bahasa yang digunakan calon klien.",
        ],
      },
      {
        title: "02 — Buat dua proyek contoh",
        paragraphs: [
          "Buat satu karya yang menunjukkan kemampuan inti, lalu satu karya yang memperlihatkan variasi kebutuhan. Tulis brief sendiri jika belum memiliki klien. Tandai sebagai proyek latihan atau studi konsep; jangan menyebutnya pekerjaan klien.",
          "Untuk tiap proyek, tampilkan masalah, batas pengerjaan, keputusan, dan hasil yang bisa diperiksa. Jelaskan bagian yang kamu kerjakan sendiri serta bantuan alat yang relevan. Jangan menggunakan logo, data pribadi, atau hasil kerja milik orang lain tanpa izin.",
        ],
      },
      {
        title: "03 — Susun profil dan deskripsi layanan",
        paragraphs: [
          "Tulis profil singkat yang menjawab siapa yang kamu bantu, hasil apa yang kamu kerjakan, dan bukti mana yang bisa dilihat. Hindari klaim ahli yang belum didukung pengalaman. Gunakan foto asli atau identitas yang sesuai ketentuan platform.",
          "Tetapkan keluaran layanan, jumlah revisi, input yang dibutuhkan, waktu pengerjaan, dan hal di luar lingkup. Satu halaman yang jelas membantu calon klien memahami kecocokan sebelum berdiskusi.",
        ],
      },
      {
        title: "04 — Pilih kanal dan siapkan kontak",
        paragraphs: [
          "Pilih satu platform yang sesuai layanan dan satu kanal jaringan profesional. Baca aturan platform, metode pembayaran, batas lokasi, dan biaya sebelum membuat akun. Materi Upwork di library menjelaskan cara kerja dasarnya; mengirim lamaran dapat memerlukan Connects.",
          "Siapkan email profesional, portofolio yang bisa dibuka tanpa izin tambahan, dan cara menjadwalkan percakapan. Lindungi informasi pribadi. Jika memakai platform, ikuti aturan komunikasi dan pembayaran platform tersebut.",
        ],
      },
      {
        title: "05 — Hitung harga awal secara masuk akal",
        paragraphs: [
          "Perkirakan jam untuk pengerjaan, komunikasi, revisi, dan administrasi. Pertimbangkan biaya alat, biaya platform, serta ruang untuk kesalahan estimasi. Bedakan tarif per jam dari biaya paket; keduanya perlu lingkup yang jelas.",
          "Gunakan kalkulator tarif di Freelance Hub sebagai simulasi. Tulis asumsi dan mata uang pada penawaran. Hindari menjanjikan harga termurah; jelaskan keluaran dan batas revisi. Peraturan pajak dan pembayaran perlu diperiksa sesuai situasimu.",
        ],
      },
      {
        title: "06 — Tulis proposal yang merespons kebutuhan",
        paragraphs: [
          "Baca brief dengan teliti. Buka proposal dengan pemahaman atas masalah klien, lalu jelaskan pendekatan singkat, satu karya yang paling relevan, perkiraan lingkup, dan satu pertanyaan yang penting untuk memulai.",
          "Contoh: “Saya melihat Anda membutuhkan tiga video pendek dari rekaman kelas. Saya akan memilih bagian dengan satu pesan utama, menambahkan subtitle, lalu mengirim satu contoh untuk menyepakati gaya. Berikut proyek latihan saya yang sejenis. Apakah rekaman dan panduan visual sudah tersedia?” Sesuaikan dengan kemampuanmu; jangan mengirim pesan massal yang sama.",
        ],
      },
      {
        title: "07 — Cari peluang dan tindak lanjuti dengan sopan",
        paragraphs: [
          "Catat peluang yang cocok, sumbernya, masalah yang diminta, status proposal, dan langkah berikutnya. Nilai kecocokan sebelum mengirim lamaran. Hubungi lewat kanal yang memang dibuka untuk pekerjaan; hindari mengumpulkan atau menyebarkan data kontak pribadi.",
          "Jika belum ada balasan, lakukan satu tindak lanjut singkat sesuai konteks atau aturan platform. Beri kesempatan untuk menolak dan hentikan jika tidak ada minat. Jangan meminta testimonial atau memberi kesan sudah bekerja sama sebelum proyek nyata.",
        ],
      },
      {
        title: "08 — Siapkan pembayaran dan serah terima",
        paragraphs: [
          "Sebelum bekerja, sepakati lingkup, hasil akhir, jadwal, revisi, hak penggunaan, dan pembayaran secara tertulis. Untuk platform, pahami syarat proteksi pembayaran dan milestone. Jangan membayar pihak yang menjanjikan akses pekerjaan.",
          "Siapkan struktur folder, penamaan versi, daftar aset, dan catatan serah terima. Uji tautan dan file sebelum dikirim. Tutup proyek dengan ringkasan hasil, batas dukungan, serta permintaan umpan balik yang wajar.",
        ],
      },
      {
        title: "Rencana 30 hari pertama",
        paragraphs: [
          "Minggu 1 (hari 1–7): pilih satu layanan dan target klien, pelajari lima brief publik, lalu tulis lingkup penawaran. Akhiri minggu dengan brief dua proyek contoh.",
          "Minggu 2 (hari 8–14): selesaikan dua karya, tulis proses dan batasnya, lalu minta umpan balik dari orang yang relevan. Perbaiki karya berdasarkan masukan yang spesifik.",
          "Minggu 3 (hari 15–21): terbitkan portofolio, siapkan profil, hitung harga, dan tulis satu proposal yang dapat disesuaikan. Uji semua tautan dari perangkat lain.",
          "Minggu 4 (hari 22–30): pilih peluang yang cocok, kirim proposal yang dipersonalisasi sesuai kapasitas, lalu catat tanggapan. Tinjau mana yang perlu diperbaiki: layanan, karya, kanal, atau cara menjelaskan nilai. Ukur tindakan yang kamu kendalikan, bukan hanya jumlah balasan.",
        ],
      },
    ],
    template:
      "# Rencana Freelance 0–1\nLayanan awal:\nTarget klien dan masalah:\nHasil yang diserahkan:\nDi luar lingkup:\nDua proyek contoh (tandai latihan):\nPortofolio:\nKanal utama:\nKontak profesional:\nEstimasi waktu + biaya:\nBatas revisi:\nKetentuan pembayaran:\n\n## Proposal\nPemahaman masalah klien:\nPendekatan:\nKarya relevan:\nLingkup dan waktu:\nPertanyaan sebelum mulai:\n\n## Catatan peluang\nTanggal | Peluang & sumber | Kecocokan | Status | Tindak lanjut\n\n## Tinjauan mingguan\nTindakan yang dilakukan:\nMasukan yang diterima:\nPerubahan untuk minggu berikutnya:\n",
    checklist: [
      {
        id: "freelance-1",
        group: "Layanan",
        label: "Memilih satu layanan dengan keluaran yang jelas.",
      },
      {
        id: "freelance-2",
        group: "Layanan",
        label: "Menentukan target klien berdasarkan kebutuhan.",
      },
      {
        id: "freelance-3",
        group: "Layanan",
        label: "Membaca contoh brief dan mencatat masalah berulang.",
      },
      {
        id: "freelance-4",
        group: "Portofolio",
        label: "Menyelesaikan proyek contoh pertama.",
      },
      {
        id: "freelance-5",
        group: "Portofolio",
        label: "Menyelesaikan proyek contoh kedua.",
      },
      {
        id: "freelance-6",
        group: "Portofolio",
        label: "Menandai karya latihan secara jujur.",
      },
      {
        id: "freelance-7",
        group: "Portofolio",
        label: "Menjelaskan proses, keputusan, dan kontribusi sendiri.",
      },
      {
        id: "freelance-8",
        group: "Profil",
        label: "Menulis profil yang berfokus pada kebutuhan klien.",
      },
      {
        id: "freelance-9",
        group: "Profil",
        label: "Menulis lingkup, batas revisi, dan waktu pengerjaan.",
      },
      {
        id: "freelance-10",
        group: "Profil",
        label: "Menguji tautan portofolio tanpa login.",
      },
      {
        id: "freelance-11",
        group: "Kanal",
        label: "Memilih platform dan membaca aturan serta biayanya.",
      },
      {
        id: "freelance-12",
        group: "Kanal",
        label: "Menyiapkan email atau kanal kontak profesional.",
      },
      {
        id: "freelance-13",
        group: "Penawaran",
        label: "Menghitung waktu, biaya alat, dan biaya platform.",
      },
      {
        id: "freelance-14",
        group: "Penawaran",
        label: "Menentukan mata uang serta metode pembayaran.",
      },
      {
        id: "freelance-15",
        group: "Penawaran",
        label: "Menulis proposal yang dipersonalisasi.",
      },
      {
        id: "freelance-16",
        group: "Peluang",
        label: "Mencatat peluang dan alasan kecocokannya.",
      },
      {
        id: "freelance-17",
        group: "Peluang",
        label: "Menentukan tindak lanjut yang sopan.",
      },
      {
        id: "freelance-18",
        group: "Proyek",
        label: "Menyiapkan kesepakatan lingkup dan pembayaran tertulis.",
      },
      {
        id: "freelance-19",
        group: "Proyek",
        label: "Menyiapkan folder, penamaan versi, dan serah terima.",
      },
      {
        id: "freelance-20",
        group: "Proyek",
        label: "Memeriksa keamanan file dan data klien.",
      },
      {
        id: "freelance-21",
        group: "Evaluasi",
        label: "Menyusun rencana empat minggu.",
      },
      {
        id: "freelance-22",
        group: "Evaluasi",
        label: "Meninjau hasil dan memilih satu perbaikan berikutnya.",
      },
    ],
  },
  "ai-product-blueprint": {
    intro:
      "Blueprint membantu mengubah masalah yang sudah dipahami menjadi instruksi pembangunan yang bisa diperiksa. Gunakan setelah merumuskan Product Idea Brief. Template ini tersedia dalam Markdown yang dapat disalin atau diunduh, tanpa memerlukan Notion.",
    sections: [
      {
        title: "Pisahkan masalah dan keputusan implementasi",
        paragraphs: [
          "Tulis pengguna awal, pekerjaan yang harus diselesaikan, dan bukti yang tersedia. Uraikan alur awal hingga akhir sebelum memilih framework. Catat kendala akses, perangkat, bahasa, serta data yang benar-benar dibutuhkan.",
          "Bedakan logika pasti (izin akses, total harga, status pembayaran) dari tugas yang dapat dibantu model (draf, pengelompokan, atau ringkasan). Hasil AI perlu dapat diperiksa dan dikoreksi pengguna.",
        ],
      },
      {
        title: "Tulis persyaratan yang dapat diuji",
        paragraphs: [
          "Gunakan user story yang spesifik: sebagai [pengguna], saya dapat [tindakan] agar [hasil]. Sertakan kondisi sukses, gagal, kosong, dan izin ditolak. Sebuah fitur belum jelas jika hanya disebut “dashboard yang bagus”.",
        ],
        bullets: [
          "Definisikan input valid dan pesan kesalahannya.",
          "Nyatakan data yang disimpan, kepemilikan, dan aturan akses.",
          "Tuliskan kriteria penerimaan sebagai perilaku yang dapat diamati.",
        ],
      },
      {
        title: "Pilih lingkup dan batas arsitektur",
        paragraphs: [
          "Batasi rilis pertama pada satu alur berguna. Pisahkan wajib, nanti, dan di luar lingkup. Dokumentasikan stack yang benar-benar digunakan, struktur route, sumber data, serta batas integrasi.",
          "Jangan menyerahkan pemilihan keamanan kepada tebakan coding assistant. Tentukan otorisasi server, pengelolaan secret, validasi input, dan penanganan tindakan ganda sesuai kebutuhan produk.",
        ],
      },
      {
        title: "Brief coding assistant secara bertahap",
        paragraphs: [
          "Berikan konteks repository dan minta inspeksi sebelum perubahan. Kerjakan satu bagian yang dapat diuji, tinjau diff, lalu lanjutkan. Jika hasil menyimpang, perbaiki dokumen atau pecah tugas. Hindari mengirim kredensial atau data pengguna sensitif ke prompt.",
        ],
      },
      {
        title: "Tinjau sebelum berpindah fase",
        paragraphs: [
          "Uji alur utama dan kegagalannya dari antarmuka serta server. Catat bukti, batas pengujian, dan keputusan rilis. Gunakan checklist MVP sebagai pengingat; sesuaikan dengan risiko produk. Setelah menerima masukan pengguna, perbarui PRD dan alasan perubahan.",
        ],
      },
    ],
    template:
      "# Product Requirements Document\n\n## Masalah dan pengguna\nMasalah:\nBukti / sumber:\nPengguna awal:\nAlur utama:\n\n## Lingkup\nWajib:\nNanti:\nNon-goals:\n\n## User stories\nSebagai ..., saya dapat ... agar ...\nKriteria penerimaan:\nKeadaan kosong:\nKesalahan dan pemulihan:\n\n## Data dan akses\nEntitas / pemilik:\nData minimum:\nPeran dan izin:\nRetensi / penghapusan yang didukung:\n\n## Arsitektur\nStack existing:\nRoute / komponen:\nIntegrasi:\nLogika deterministik:\nBantuan AI + pemeriksaan manusia:\n\n## Rencana implementasi\nLangkah kecil | Perilaku selesai | Cara verifikasi\n\n## Rilis\nPemeriksaan keamanan:\nUji alur utama dan kegagalan:\nBatas QA:\nRollback:\nPertanyaan terbuka:\n",
  },
  "vibe-coding-field-guide": {
    intro:
      "AI dapat membantu menulis dan memeriksa kode, tetapi kualitas produk tetap bergantung pada konteks, keputusan, dan pengujian. Panduan ini mengembangkan tujuh prinsip existing menjadi alur kerja yang dapat diulang.",
    sections: [
      {
        title: "01 — Jangan biarkan stack ditebak",
        paragraphs: [
          "Mulai dengan membaca package.json, struktur route, instruksi repository, dan dokumentasi versi terpasang. Jelaskan tujuan, batas lingkup, serta komponen yang perlu dipertahankan. Gunakan AGENTS.md untuk keputusan yang berlaku berulang, bukan untuk menyalin seluruh dokumentasi.",
        ],
      },
      {
        title: "02 — Satu perubahan yang dapat diperiksa",
        paragraphs: [
          "Pecah fitur menjadi perubahan kecil dengan hasil yang dapat diamati. Dahulukan satu alur lengkap. Misalnya, buat formulir dan validasinya, lalu sambungkan penyimpanan dan uji kegagalan. Hindari menggabungkan autentikasi, pembayaran, dan redesign besar tanpa tahapan verifikasi.",
        ],
      },
      {
        title: "03 — Baca diff dan simpan checkpoint",
        paragraphs: [
          "Periksa git status sebelum bekerja dan git diff setelah perubahan. Perhatikan import, konfigurasi, dependency, serta file yang seharusnya tidak tersentuh. Simpan commit yang jelas setelah validasi. Jika perlu membatalkan, pahami perubahan yang akan hilang; jangan melakukan reset destruktif pada pekerjaan yang belum tersimpan.",
        ],
      },
      {
        title: "04 — Pisahkan data dari antarmuka",
        paragraphs: [
          "Tentukan kontrak data dan keadaan loading, kosong, sukses, serta gagal. Simpan konten berulang dalam satu sumber yang terstruktur. Komponen antarmuka sebaiknya menyatakan perilaku, bukan membuat aturan otorisasi sendiri.",
        ],
      },
      {
        title: "05 — Verifikasi sedini mungkin",
        paragraphs: [
          "Jalankan TypeScript dan lint yang relevan, kemudian uji perilaku berisiko. Build sukses belum membuktikan bahwa route, tombol, atau penyimpanan bekerja. Periksa hasil yang dirender dan kegagalan jaringan. Untuk aplikasi dengan data pengguna, uji kepemilikan dan izin di server.",
        ],
      },
      {
        title: "06 — Jaga konteks tetap berguna",
        paragraphs: [
          "Berikan error lengkap yang relevan beserta langkah reproduksi dan perubahan terakhir. Batasi log pada bagian yang menjelaskan masalah. Minta penjelasan asumsi jika jawaban AI tidak sesuai bukti. Jangan memasukkan token akses, kunci server, atau isi database pribadi ke instruksi.",
        ],
      },
      {
        title: "07 — Berhenti mengulang pendekatan yang gagal",
        paragraphs: [
          "Jika perbaikan yang sama gagal berulang, kembali ke reproduksi terkecil. Baca dokumentasi resmi dan uji hipotesis satu per satu. Catat akar masalah serta pemeriksaan yang membuktikan perbaikannya. Tinjau juga regresi di alur yang berdekatan sebelum merilis.",
        ],
      },
    ],
    template:
      "# Brief untuk Coding Assistant\nTujuan pengguna:\nRepository dan stack terpasang:\nRoute / file terkait:\nPerilaku saat ini:\nPerilaku yang diharapkan:\nKriteria penerimaan:\nBatas lingkup:\nHal yang perlu dipertahankan:\nCara reproduksi / verifikasi:\n\nMulai dengan inspeksi repository. Nyatakan asumsi yang belum terbukti.\nKerjakan satu perubahan yang dapat diperiksa, lalu tunjukkan hasil verifikasinya.\nJangan memasukkan secret atau mengubah data production untuk pengujian.\n",
  },
  "ai-content-operating-system": {
    intro:
      "Sistem konten sederhana dimulai dari gagasan yang berguna, bukan target jumlah posting. Alur ini menjaga hubungan antara sumber, tulisan utama, dan versi distribusi. Papan kerja tersedia sebagai teks Markdown yang dapat dipakai di editor, Notion, atau Obsidian.",
    sections: [
      {
        title: "Tangkap gagasan dan sumber",
        paragraphs: [
          "Buat inbox untuk pertanyaan audiens, pengalaman sendiri, dan bahan bacaan. Untuk setiap ide, catat siapa yang dibantu, pertanyaan yang dijawab, serta sumbernya. Pisahkan pengalaman pribadi dari ringkasan bahan orang lain. Hindari menyimpan data klien tanpa izin.",
        ],
      },
      {
        title: "Periksa kedalaman sebelum menulis",
        paragraphs: [
          "Pilih satu ide dan rumuskan pesan utamanya dalam satu kalimat. Gunakan AI untuk mengusulkan pertanyaan atau argumen tandingan, lalu periksa kembali ke sumber. Jangan menyajikan kutipan, angka, atau pengalaman buatan sebagai fakta.",
        ],
      },
      {
        title: "Tulis satu materi utama",
        paragraphs: [
          "Buat outline dengan masalah, penjelasan, contoh, dan langkah praktis. Tulis sesuai pengetahuan yang benar-benar kamu miliki. Setelah draf selesai, periksa kejelasan, dukungan fakta, hak penggunaan aset, dan kegunaan bagi pembaca. Panjang tulisan mengikuti kebutuhan, bukan angka wajib.",
        ],
      },
      {
        title: "Sesuaikan distribusi dengan kanal",
        paragraphs: [
          "Ambil satu gagasan kecil untuk tiap versi: ringkasan untuk newsletter, satu contoh untuk unggahan profesional, atau satu pertanyaan untuk diskusi. Ubah pembuka dan format agar sesuai kanal. Sertakan tautan materi utama bila membantu; jangan sekadar memotong paragraf secara otomatis.",
        ],
      },
      {
        title: "Tinjau hasil tanpa mengejar angka kosong",
        paragraphs: [
          "Catat tanggal publikasi, tanggapan yang bermakna, pertanyaan baru, serta perbaikan isi. Jadwalkan pembaruan untuk materi yang berubah cepat. Pilih ritme yang dapat dipertahankan. Sistem yang baik membantu konsistensi tanpa menjanjikan pertumbuhan tertentu.",
        ],
      },
    ],
    template:
      "# Content OS\n\n## Inbox\nIde | Audiens | Pertanyaan | Sumber | Status\n\n## Brief konten\nPesan utama:\nManfaat bagi pembaca:\nBukti dan sumber:\nArgumen tandingan:\nContoh:\nLangkah praktis:\n\n## Pipeline\n- [ ] Pilih ide dan periksa sumber\n- [ ] Susun outline\n- [ ] Tulis draf utama\n- [ ] Periksa fakta, hak aset, dan kejelasan\n- [ ] Siapkan versi distribusi yang sesuai kanal\n- [ ] Publikasikan dan uji tautan\n- [ ] Catat masukan serta perbarui isi\n\n## Kalender\nTanggal | Materi | Kanal | Pemilik | Status | Tautan\n\n## Tinjauan\nTanggapan bermakna:\nPertanyaan baru:\nPerbaikan berikutnya:\n",
  },
  "personal-brand-positioning-canvas": {
    intro:
      "Positioning membantu orang memahami pekerjaanmu dan kapan perlu menghubungimu. Mulailah dari kemampuan dan bukti yang ada. Canvas ini adalah latihan berpikir, bukan cara mengarang otoritas atau menjamin pertumbuhan audiens.",
    sections: [
      {
        title: "Pilih orang yang ingin dibantu",
        paragraphs: [
          "Tuliskan satu kelompok yang masalah dan konteksnya kamu pahami. Jelaskan tugas mereka, batasan waktu atau alat, dan kebingungan yang sering muncul. Kelompok yang spesifik membantu memilih bahasa serta contoh yang relevan.",
        ],
      },
      {
        title: "Petakan kemampuan dan pengalaman nyata",
        paragraphs: [
          "Daftar hal yang bisa dilakukan, hal yang sedang dipelajari, dan hal yang belum siap ditawarkan. Cari irisan pengalaman yang dapat menjelaskan sudut pandangmu. Jangan mengubah kursus pengantar menjadi klaim sebagai ahli atau pekerjaan latihan menjadi pengalaman klien.",
        ],
      },
      {
        title: "Tentukan sudut pandang yang bisa dijelaskan",
        paragraphs: [
          "Pilih satu prinsip kerja dan jelaskan alasannya melalui contoh. Sudut pandang tidak harus kontroversial; ia perlu membantu pembaca memahami cara berpikirmu. Catat kondisi ketika prinsip itu tidak berlaku supaya penjelasan tetap bernuansa.",
        ],
      },
      {
        title: "Susun bukti kerja dan profil",
        paragraphs: [
          "Pilih dua atau tiga karya yang mendukung positioning. Untuk tiap karya, jelaskan masalah, peranmu, keputusan, dan hasil yang bisa diperiksa. Tulis bio pendek dengan pola: saya membantu [audiens] melakukan [pekerjaan] melalui [pendekatan], dengan [bukti yang tersedia].",
        ],
      },
      {
        title: "Uji kejelasan, lalu revisi",
        paragraphs: [
          "Minta orang yang sesuai audiens menjelaskan kembali apa yang kamu kerjakan setelah membaca profil. Jika penafsiran mereka terlalu luas atau keliru, sederhanakan. Tentukan tiga tema konten yang dekat dengan pekerjaanmu dan tinjau canvas ketika pengalaman berubah.",
        ],
      },
    ],
    template:
      "# Personal Brand Positioning Canvas\n\nAudiens awal:\nMasalah yang saya pahami:\nKeahlian yang dapat ditunjukkan:\nHal yang sedang dipelajari:\nSudut pandang dan alasannya:\nBatas keahlian:\n\n## Proof of work\nKarya | Masalah | Kontribusi saya | Tautan bukti\n\n## Bio singkat\nSaya membantu ... melakukan ... melalui ...\nBukti yang dapat dilihat: ...\n\n## Tiga tema konten\n1.\n2.\n3.\n\n## Uji kejelasan\nSiapa yang memberi masukan:\nApa yang mereka pahami:\nApa yang perlu diperjelas:\nTanggal tinjauan:\n",
  },
  "creator-to-founder-framework": {
    intro:
      "Peralihan dari kreator atau freelancer ke pembuat produk tidak harus mengikuti urutan yang sama untuk semua orang. Gunakan empat fase ini untuk membaca pola kebutuhan, mengurangi risiko, dan memilih bentuk kerja yang cocok. Tetap menawarkan jasa juga merupakan pilihan yang sah.",
    sections: [
      {
        title: "Fase 1 — Pahami masalah melalui pekerjaan nyata",
        paragraphs: [
          "Saat mengerjakan layanan, catat masalah yang berulang, bagian yang sulit, dan alasan klien memilih pendekatan tertentu. Minta izin sebelum menggunakan pelajaran dari proyek. Pendapatan layanan dan konteks pengguna dapat membantu belajar, tetapi tidak otomatis membuktikan permintaan produk.",
        ],
      },
      {
        title: "Fase 2 — Dokumentasikan proses yang dapat dipakai ulang",
        paragraphs: [
          "Ubah langkah berulang menjadi checklist, template, atau panduan internal. Uji apakah orang lain dapat menggunakannya tanpa penjelasan panjang. Mulai dengan satu artefak yang berguna. Jika proses masih sangat bergantung pada konteks individu, perbaiki dokumentasinya sebelum menjual sebagai produk.",
        ],
      },
      {
        title: "Fase 3 — Uji layanan dengan lingkup yang jelas",
        paragraphs: [
          "Kemas hasil yang spesifik, input yang dibutuhkan, batas revisi, dan waktu pengerjaan. Ukur biaya kerja serta kebutuhan dukungan. Diskusikan kebutuhan dengan calon pengguna sebelum membuat banyak paket. Jangan menjanjikan hasil bisnis yang berada di luar kendalimu.",
        ],
      },
      {
        title: "Fase 4 — Pertimbangkan produk digital atau software",
        paragraphs: [
          "Produk masuk akal bila kebutuhan berulang, pengguna memahami nilainya, dan proses dapat didukung secara berkelanjutan. Bandingkan template, kelas, alat sederhana, dan software; pilih bentuk paling ringan yang menguji asumsi. Hitung distribusi, dukungan, keamanan, serta biaya operasional.",
        ],
      },
      {
        title: "Gunakan bukti untuk memilih langkah",
        paragraphs: [
          "Setelah setiap eksperimen, catat apa yang dipakai, apa yang ditinggalkan, dan pertanyaan yang belum terjawab. Minat di media sosial belum sama dengan kesediaan menggunakan atau membayar. Lanjutkan, ubah lingkup, atau hentikan berdasarkan bukti. Tidak semua ide perlu menjadi platform.",
        ],
      },
    ],
    template:
      "# Creator-to-Founder Review\n\nMasalah berulang:\nPengguna dan konteks:\nBukti dari pekerjaan / percakapan (dengan izin):\nProses yang bisa dipakai ulang:\nArtefak kecil untuk diuji:\n\nBentuk penawaran: jasa / template / panduan / software\nHasil yang dijanjikan:\nInput dan batas dukungan:\nBiaya pengerjaan / operasional:\nKanal distribusi:\nRisiko dan asumsi:\n\nEksperimen berikutnya:\nIndikator keputusan:\nApa yang dipelajari:\nLanjut / revisi / hentikan, beserta alasannya:\n",
  },
  "ai-assisted-research-workflow": {
    intro:
      "AI dapat membantu mengorganisasi bahan, tetapi ringkasan yang meyakinkan belum tentu akurat. Workflow ini mengembangkan pendekatan ekstraksi dan sintesis existing dengan pencatatan asal informasi serta pemeriksaan langsung ke sumber.",
    sections: [
      {
        title: "Tentukan pertanyaan dan batas riset",
        paragraphs: [
          "Tuliskan keputusan yang akan dibantu oleh riset, konteks waktu, wilayah, dan istilah penting. Tentukan apa yang tidak dicakup. Pertanyaan yang sempit memudahkan memilih sumber serta menghindari koleksi tautan yang tidak pernah menghasilkan keputusan.",
        ],
      },
      {
        title: "Bangun daftar sumber yang dapat diperiksa",
        paragraphs: [
          "Dahulukan dokumentasi resmi, penelitian asli, dan sumber primer yang relevan. Catat URL, judul, tanggal publikasi atau akses, penulis, dan bagian yang mendukung klaim. Tandai informasi yang mungkin berubah. Jangan mengirim dokumen rahasia ke alat AI tanpa izin.",
        ],
      },
      {
        title: "Ekstrak sebelum menafsirkan",
        paragraphs: [
          "Minta AI mengambil pernyataan relevan beserta lokasi sumbernya. Periksa kutipan secara langsung dan pisahkan angka, opini penulis, serta interpretasi model. Jika sumber tidak mendukung klaim, tandai belum diketahui. Jangan meminta model mengisi celah dengan tebakan.",
        ],
      },
      {
        title: "Bandingkan, termasuk pertentangan",
        paragraphs: [
          "Kelompokkan temuan berdasarkan pertanyaan, bukan urutan sumber. Cari persamaan, perbedaan metode, batas sampel, dan perubahan waktu. Minta argumen yang menentang kesimpulan awal. Ketidaksepakatan sumber bisa berarti konteks berbeda, bukan salah satu pasti keliru.",
        ],
      },
      {
        title: "Tulis sintesis dan langkah berikutnya",
        paragraphs: [
          "Susun jawaban singkat yang memisahkan bukti, interpretasi, keterbatasan, dan pertanyaan terbuka. Hubungkan setiap klaim penting dengan sumber yang mendukungnya. Tentukan keputusan yang cukup aman diambil sekarang dan informasi yang masih perlu dicari. Simpan catatan agar bisa diperbarui.",
        ],
      },
    ],

    template:
      "# Research & Synthesis Notes\n\nPertanyaan riset:\nKeputusan yang akan dibantu:\nBatas waktu / wilayah / lingkup:\n\n## Register sumber\nID | Judul | Penulis / penerbit | Tanggal | URL | Bagian relevan\n\n## Ekstraksi\nKlaim:\nSumber dan lokasi:\nKutipan pendek bila diperlukan:\nBukti / opini / interpretasi:\nKeterbatasan:\n\n## Perbandingan\nTemuan yang sejalan:\nTemuan yang bertentangan:\nPerbedaan konteks / metode:\n\n## Sintesis\nApa yang diketahui:\nApa yang belum diketahui:\nKesimpulan sementara:\nKeputusan berikutnya:\nTanggal pembaruan:\n",
  },
  "high-context-prompts-pack": {
    intro:
      "Paket ini memuat 24 prompt yang dapat disalin satu per satu. Prompt mengarahkan pekerjaan, bukan menjamin kebenaran hasil. Ganti semua placeholder, berikan sumber yang relevan, dan periksa keluaran sebelum digunakan.",
    sections: [
      {
        title: "Cara memakai paket ini",
        paragraphs: [
          "Pilih satu tugas, lalu isi bagian dalam tanda kurung siku dengan konteks yang spesifik. Hapus bagian yang tidak diperlukan. Berikan contoh hasil bila formatnya penting. Jangan memasukkan token, data klien, atau dokumen rahasia tanpa izin.",
        ],
      },
      {
        title: "Periksa hasilnya, lalu iterasi",
        paragraphs: [
          "Baca keluaran sebagai draf. Periksa fakta ke sumber asli, jalankan pengujian untuk kode, dan sesuaikan keputusan dengan tujuan pengguna. Bila jawaban tidak sesuai, perjelas bagian konteks yang hilang. Jangan menganggap gaya bahasa percaya diri sebagai bukti.",
        ],
      },
      {
        title: "Empat kelompok tugas",
        paragraphs: [
          "Paket terdiri dari 8 prompt riset dan validasi, 6 produk dan spesifikasi, 5 kode dan verifikasi, serta 5 editorial dan konten. Mulai dari pertanyaan yang paling dekat dengan pekerjaanmu; tidak perlu menjalankan semua prompt secara berurutan.",
        ],
      },
    ],
    prompts: [
      {
        group: "Riset & validasi",
        title: "Peta masalah pengguna",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nDari catatan [CATATAN_WAWANCARA], kelompokkan masalah menurut tugas, pemicu, dan dampaknya. Cantumkan lokasi bukti, pisahkan pengamatan dari tafsiran, dan tulis pertanyaan yang belum terjawab.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Riset & validasi",
        title: "Pertanyaan wawancara",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nUntuk [SEGMEN] yang mengalami [MASALAH], susun delapan pertanyaan tentang pengalaman terakhir dan alternatif saat ini. Hindari pertanyaan yang mengarahkan peserta menyukai solusi. Jelaskan tujuan tiap pertanyaan.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Riset & validasi",
        title: "Audit asumsi ide",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nBaca [IDE_PRODUK]. Buat tabel asumsi kebutuhan, perilaku, kelayakan teknis, dan distribusi. Tulis bukti yang tersedia, risiko bila salah, serta uji paling kecil untuk tiap asumsi. Jangan mengarang hasil riset.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Riset & validasi",
        title: "Peta alternatif",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nDengan sumber [DAFTAR_SUMBER], bandingkan cara pengguna menyelesaikan [TUGAS] saat ini. Bedakan solusi berbayar, gratis, dan manual. Cantumkan sumber tiap fakta dan tandai informasi yang perlu diverifikasi.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Riset & validasi",
        title: "Catatan sumber",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nEkstrak informasi terkait [PERTANYAAN] dari [DOKUMEN]. Keluarkan tabel klaim, lokasi sumber, tanggal, dan batas konteks. Jika tidak tersedia, tulis tidak diketahui. Jangan membuat kutipan.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Riset & validasi",
        title: "Sintesis lintas dokumen",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nBandingkan [DOKUMEN_A] dan [DOKUMEN_B] untuk menjawab [PERTANYAAN]. Pisahkan kesamaan, pertentangan, perbedaan metode, dan ketidakpastian. Beri rujukan lokasi untuk setiap kesimpulan.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Riset & validasi",
        title: "Argumen tandingan",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nUji kesimpulan [KESIMPULAN] terhadap bukti [BUKTI]. Tulis tiga penjelasan alternatif dan bukti yang dapat membedakannya. Nyatakan jika data belum cukup. Jangan menilai keyakinan sebagai fakta.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Riset & validasi",
        title: "Rencana eksperimen",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nUntuk asumsi [ASUMSI], rancang uji kecil dengan [BATAS_WAKTU_DAN_BIAYA]. Jelaskan peserta, tugas, persetujuan yang dibutuhkan, indikator keputusan, risiko, dan cara mencatat hasil tanpa membuat data palsu.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Produk & spesifikasi",
        title: "PRD reality check",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nTinjau [PRD] untuk pengguna [TARGET_USER] dengan stack [TECH_STACK]. Temukan asumsi yang belum terbukti, scope yang dapat dipangkas, dan kriteria penerimaan yang kabur. Prioritaskan menurut dampak dan usulkan perubahan konkret; jangan memberi jaminan jadwal.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Produk & spesifikasi",
        title: "Alur pengguna",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nUraikan alur [TUGAS] dari titik masuk sampai selesai. Sertakan keadaan kosong, loading, gagal, akses ditolak, dan tindakan ganda. Keluarkan daftar layar serta perilaku yang perlu diuji.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Produk & spesifikasi",
        title: "Batas MVP",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nDari [DAFTAR_FITUR] dan tujuan [HIPOTESIS], kelompokkan wajib, nanti, dan di luar lingkup. Jelaskan bagaimana tiap fitur wajib membantu menguji hipotesis. Jangan menambah integrasi tanpa alasan.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Produk & spesifikasi",
        title: "Kontrak data",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nUntuk alur [ALUR], usulkan kontrak data yang sesuai [SKEMA_EXISTING]. Jelaskan kepemilikan, validasi, sumber kebenaran, dan nilai opsional. Tandai perubahan skema yang perlu ditinjau; jangan menjalankan migrasi.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Produk & spesifikasi",
        title: "Kriteria penerimaan",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nUbah [SPESIFIKASI] menjadi skenario input, tindakan, dan hasil yang dapat diamati. Sertakan batas data serta kegagalan jaringan. Hindari kriteria seperti terasa bagus tanpa perilaku terukur.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Produk & spesifikasi",
        title: "Brief implementasi",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nBaca konteks [REPOSITORY_DAN_STACK] untuk tugas [TUJUAN]. Susun langkah kecil, file yang mungkin terkait, risiko regresi, dan verifikasi tiap langkah. Inspeksi kode sebelum menyatakan detail implementasi.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Kode & verifikasi",
        title: "Isolasi bug",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nDengan langkah reproduksi [LANGKAH], error [ERROR], dan diff [DIFF], ajukan hipotesis berurutan beserta pemeriksaan pembeda. Mulai dari reproduksi terkecil. Jangan mengubah beberapa faktor sekaligus.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Kode & verifikasi",
        title: "Review diff",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nPeriksa [DIFF] terhadap [KRITERIA]. Temukan masalah perilaku, izin, validasi, dan kompatibilitas. Untuk tiap temuan, jelaskan pemicu, akibat, dan lokasi. Hindari menyatakan risiko hipotetis tanpa jalur yang masuk akal.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Kode & verifikasi",
        title: "Batas client dan server",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nTinjau [KOMPONEN] dalam [FRAMEWORK_DAN_VERSI]. Identifikasi data sensitif, keputusan izin, serta interaksi browser. Usulkan batas server/client yang sesuai dokumentasi versi terpasang, tanpa mengekspos secret.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Kode & verifikasi",
        title: "Rencana regresi",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nUntuk perubahan [PERUBAHAN], pilih pengujian yang paling berguna bagi [ALUR_KRITIS]. Pisahkan unit, integrasi, browser, dan production smoke. Tulis apa yang tidak dapat dibuktikan oleh fixture lokal.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Kode & verifikasi",
        title: "Audit aksesibilitas",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nTinjau [MARKUP_DAN_STYLES] untuk semantik, label, fokus, keyboard, kontras, dan reduced motion. Beri perbaikan spesifik. Nyatakan pemeriksaan yang membutuhkan browser atau pengukuran langsung.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Editorial & konten",
        title: "Sudut pandang editorial",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nDari insight [INSIGHT] tentang [TOPIK] untuk [AUDIENS], usulkan tiga angle: penjelasan konsep, studi proses, dan langkah praktis. Beri pembuka serta outline masing-masing. Jangan mengarang pengalaman atau membuat judul menyesatkan.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Editorial & konten",
        title: "Brief tulisan",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nSusun brief untuk [TOPIK] dengan tujuan pembaca [TUJUAN]. Tentukan pertanyaan inti, alur, contoh yang diperlukan, dan fakta yang perlu sumber. Pisahkan contoh fiktif dari pengalaman nyata.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Editorial & konten",

        title: "Review kejelasan",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nBaca [DRAF] untuk audiens [AUDIENS]. Tandai jargon, klaim tanpa sumber, lompatan logika, dan pengulangan. Usulkan perbaikan dengan mempertahankan maksud serta suara penulis; jangan menambah pencapaian.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Editorial & konten",
        title: "Adaptasi distribusi",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nUbah [ARTIKEL] menjadi satu ringkasan email dan dua unggahan [KANAL]. Pertahankan konteks dan batas klaim. Sesuaikan pembuka serta panjang dengan kanal. Arahkan ke materi utama tanpa menjanjikan hasil.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
      {
        group: "Editorial & konten",
        title: "Tinjauan konten",
        text: "Konteks saya: [KONTEKS_YANG_RELEVAN].\n\nDari [CATATAN_MASUKAN], kelompokkan pertanyaan berulang, bagian membingungkan, dan peluang pembaruan [MATERI]. Prioritaskan perubahan berdasarkan kegunaan. Jangan menganggap views sebagai bukti bahwa pembaca memahami isi.\n\nNyatakan keterbatasan dan pertanyaan klarifikasi yang benar-benar diperlukan. Berikan hasil yang dapat saya periksa.",
      },
    ],
  },
  "mvp-readiness-checklist": {
    intro:
      "32 poin ini membantu meninjau rilis pertama secara sistematis. Checklist bukan sertifikasi keamanan dan tidak menggantikan pengujian. Catat bukti untuk tiap poin; jika belum berlaku, tulis alasannya pada catatan kerja.",
    sections: [
      {
        title: "Mulai dari alur yang paling penting",
        paragraphs: [
          "Tentukan tindakan utama pengguna, jenis data yang ditangani, serta dampak jika terjadi kesalahan. Sesuaikan kedalaman pemeriksaan dengan risiko. Produk yang menerima pembayaran atau data sensitif memerlukan verifikasi yang lebih ketat daripada halaman informasi.",
        ],
      },
      {
        title: "Centang berdasarkan bukti",
        paragraphs: [
          "Jangan mencentang karena implementasinya terlihat benar. Jalankan skenario sukses dan gagal, periksa hasil di server atau penyimpanan, serta gunakan perangkat dan ukuran layar yang mewakili pengguna. Simpan tautan log, screenshot, atau catatan pengamatan.",
        ],
      },
      {
        title: "Pisahkan selesai, belum diuji, dan tidak berlaku",
        paragraphs: [
          "Poin yang belum dapat diuji tetap terbuka. Untuk poin yang tidak berlaku, tuliskan alasan pada catatan. Jumlah centang adalah kemajuan pemeriksaan, bukan skor kelayakan mutlak. Tidak ada persentase yang otomatis mengizinkan rilis.",
        ],
      },
      {
        title: "Bawa hasilnya ke keputusan rilis",
        paragraphs: [
          "Tinjau temuan berdasarkan dampak, kemungkinan, dan kemampuan pemulihan. Selesaikan risiko kritis sebelum rilis. Tentukan pemilik tindak lanjut, rollback, serta smoke test setelah deploy. Ekspor checklist untuk menyimpan catatan versi; penyimpanan browser hanya tersedia pada perangkat ini.",
        ],
      },
    ],
    template:
      "# Catatan Pemeriksaan MVP\nNama produk / versi:\nAlur kritis:\nLingkungan yang diuji:\nTanggal dan pemeriksa:\n\nPoin | Bukti pemeriksaan | Hasil | Tindak lanjut\n\nPoin yang tidak berlaku dan alasannya:\nRisiko yang belum selesai:\nKeputusan rilis dan alasan:\nRollback:\nSmoke test production:\n",
    checklist: [
      {
        id: "mvp-1",
        group: "Masalah & lingkup",
        label:
          "Pengguna awal dan masalah utama dijelaskan dengan bukti yang tersedia.",
      },
      {
        id: "mvp-2",
        group: "Masalah & lingkup",
        label: "Alur utama dapat diselesaikan dari awal sampai akhir.",
      },
      {
        id: "mvp-3",
        group: "Masalah & lingkup",
        label: "Fitur wajib dan hal di luar lingkup ditulis.",
      },
      {
        id: "mvp-4",
        group: "Masalah & lingkup",
        label: "Asumsi penting dan batas kemampuan produk dinyatakan.",
      },
      {
        id: "mvp-5",
        group: "Keamanan & akses",
        label: "Secret server tidak masuk source publik atau bundle browser.",
      },
      {
        id: "mvp-6",
        group: "Keamanan & akses",
        label: "Otorisasi tindakan sensitif diperiksa di server.",
      },
      {
        id: "mvp-7",
        group: "Keamanan & akses",
        label: "Data tiap pengguna terlindungi oleh aturan akses yang diuji.",
      },
      {
        id: "mvp-8",
        group: "Keamanan & akses",
        label: "Input pengguna divalidasi di batas server.",
      },
      {
        id: "mvp-9",
        group: "Akun & formulir",
        label: "Login, logout, dan sesi kedaluwarsa ditangani sesuai alur.",
      },
      {
        id: "mvp-10",
        group: "Akun & formulir",
        label: "Kesalahan formulir jelas dan terhubung ke label input.",
      },
      {
        id: "mvp-11",
        group: "Akun & formulir",
        label: "Kirim ganda dicegah atau diproses secara idempoten.",
      },
      {
        id: "mvp-12",
        group: "Akun & formulir",
        label:
          "Tindakan penting mempunyai loading, sukses, dan gagal yang akurat.",
      },
      {
        id: "mvp-13",
        group: "Data & pemulihan",
        label: "Keadaan tanpa data mempunyai tindakan berikutnya yang berguna.",
      },
      {
        id: "mvp-14",
        group: "Data & pemulihan",
        label: "Gangguan jaringan tidak menampilkan sukses palsu.",
      },
      {
        id: "mvp-15",
        group: "Data & pemulihan",
        label:
          "Data yang dijanjikan tersimpan telah diperiksa di lapisan penyimpanan.",
      },
      {
        id: "mvp-16",
        group: "Data & pemulihan",
        label: "Backup atau cara pemulihan yang sesuai risiko tersedia.",
      },
      {
        id: "mvp-17",
        group: "Pengalaman & aksesibilitas",
        label: "Alur utama dapat dipakai dengan keyboard dan fokus terlihat.",
      },
      {
        id: "mvp-18",
        group: "Pengalaman & aksesibilitas",
        label: "Label, heading, dan nama tombol menjelaskan tindakan.",
      },
      {
        id: "mvp-19",
        group: "Pengalaman & aksesibilitas",
        label: "Kontras dan ukuran area sentuh diperiksa.",
      },
      {
        id: "mvp-20",
        group: "Pengalaman & aksesibilitas",
        label: "Reduced motion menjaga konten dan fungsi tetap tersedia.",
      },
      {
        id: "mvp-21",
        group: "Responsif & performa",
        label: "Tampilan ponsel, tablet, dan desktop diperiksa tanpa overflow.",
      },
      {
        id: "mvp-22",
        group: "Responsif & performa",
        label: "Gambar memiliki ukuran dan alt text yang tepat.",
      },
      {
        id: "mvp-23",
        group: "Responsif & performa",
        label: "Loading tidak menggeser layout secara mengganggu.",
      },
      {
        id: "mvp-24",
        group: "Responsif & performa",
        label:
          "Performa diperiksa dengan pengukuran nyata serta batasnya dicatat.",
      },
      {
        id: "mvp-25",
        group: "Konten & navigasi",
        label: "Semua tombol dan tautan menuju tujuan yang dijanjikan.",
      },
      {
        id: "mvp-26",
        group: "Konten & navigasi",
        label: "Judul, deskripsi, canonical, dan preview sosial relevan.",
      },
      {
        id: "mvp-27",
        group: "Konten & navigasi",
        label: "Sitemap dan aturan indexing sesuai rute publik serta privat.",
      },
      {
        id: "mvp-28",
        group: "Konten & navigasi",
        label:
          "Kebijakan privasi dan persetujuan sesuai perilaku yang benar-benar ada.",
      },
      {
        id: "mvp-29",
        group: "Rilis & operasi",
        label:
          "Build dan pemeriksaan yang relevan selesai dengan hasil tercatat.",
      },
      {
        id: "mvp-30",
        group: "Rilis & operasi",
        label: "Alur penting dan kegagalannya diuji di lingkungan rilis.",
      },
      {
        id: "mvp-31",
        group: "Rilis & operasi",
        label: "Target deployment, konfigurasi, dan rollback teridentifikasi.",
      },
      {
        id: "mvp-32",
        group: "Rilis & operasi",
        label: "Smoke test production dan pemantauan error disiapkan.",
      },
    ],
  },
};
export function guideMarkdown(title: string, guide: LearningGuide) {
  return [
    "# " + title,
    guide.intro,
    ...guide.sections.map((s) =>
      [
        "## " + s.title,
        ...s.paragraphs,
        ...(s.bullets || []).map((b) => "- " + b),
      ].join("\n\n"),
    ),
    ...(guide.prompts || []).map((p) => "## " + p.title + "\n\n" + p.text),
    ...(guide.checklist || []).map((c) => "- [ ] " + c.group + ": " + c.label),
    guide.template ? "## Template\n\n" + guide.template : "",
    guide.example ? "## Contoh fiktif\n\n" + guide.example : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}
