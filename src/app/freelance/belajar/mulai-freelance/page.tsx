import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { LearningGuideTOC } from "@/components/freelance/LearningGuideTOC";
import { ReadingProgress } from "@/components/freelance/ReadingProgress";
import styles from "./guide.module.css";

export const metadata: Metadata = {
  title: "Mulai Freelance dari Nol",
  description: "Panduan praktis menentukan skill, membangun offer dan portfolio, menetapkan harga, mencari peluang, serta mengelola client pertama.",
  alternates: { canonical: "https://khadafidaffa.com/freelance/belajar/mulai-freelance" },
};

const chapters = [
  { id: "01-memahami", label: "01", title: "Memahami Freelance", short: "Dasar" },
  { id: "02-menentukan-arah", label: "02", title: "Skill & Arah", short: "Skill" },
  { id: "03-niche", label: "03", title: "Positioning & Niche", short: "Niche" },
  { id: "04-portfolio", label: "04", title: "Portfolio", short: "Portfolio" },
  { id: "05-harga", label: "05", title: "Pricing & Rate", short: "Pricing" },
  { id: "06-peluang", label: "06", title: "Mencari Peluang", short: "Peluang" },
  { id: "07-client", label: "07", title: "Manajemen Client", short: "Client" },
];

function ChapterHead({ number, category, title, intro }: { number: string; category: string; title: string; intro: string }) {
  return <header className={styles.chapterHead}>
    <p className={styles.eyebrow}>{number} / {category}</p>
    <h2>{title}</h2>
    <p className={styles.lede}>{intro}</p>
  </header>;
}

function Checkpoint({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className={styles.checkpoint}>
    <span className={styles.eyebrow}>Checkpoint {number}</span>
    <div>{children}</div>
  </div>;
}

export default function MulaiFreelancePage() {
  return <>
    <ReadingProgress />
    <Navbar />
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="guide-title">
        <div className={styles.wrap}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/freelance">Freelance</Link><span aria-hidden="true">/</span><span>Belajar</span><span aria-hidden="true">/</span><span aria-current="page">Mulai Freelance</span>
          </nav>
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.darkEyebrow}>Worldwide Freelancer · Panduan 01</p>
              <h1 id="guide-title">Mulai<span className={styles.mobileBreak}><br /></span><span className={styles.desktopSpace}> </span>Freelance<br /><em>dari Nol.</em></h1>
              <p className={styles.heroIntro}>Panduan praktis memahami dunia freelance, menentukan arah, membangun penawaran, menyiapkan portfolio, menentukan harga, mencari peluang, hingga mengelola client pertama.</p>
              <div className={styles.heroMeta}><span>Diperbarui Oktober 2026</span><span>± 25–35 menit baca & praktik</span></div>
              <a className={styles.startLink} href="#mulai-membaca">Mulai panduan <span aria-hidden="true">↓</span></a>
            </div>
            <div className={styles.heroMap} aria-label="Tujuh langkah dalam panduan">
              <div className={styles.mapTop}><span>Peta perjalanan</span><span>01 — 07</span></div>
              {chapters.map((chapter) => <a href={`#${chapter.id}`} key={chapter.id} className={styles.mapRow}>
                <span>{chapter.label}</span><strong>{chapter.title}</strong><span aria-hidden="true">↗</span>
              </a>)}
              <p>Dari satu skill yang berguna menuju hubungan kerja yang profesional.</p>
            </div>
          </div>
        </div>
      </section>

      <nav className={styles.path} aria-label="Jalur belajar">
        <div className={styles.wrap}>
          <div className={styles.pathHeading}><span className={styles.darkEyebrow}>Jalur belajar</span><p>Ikuti berurutan, atau mulai dari bagian yang paling kamu butuhkan.</p></div>
          <div className={styles.pathScroller}>
            {chapters.map((chapter) => <a key={chapter.id} href={`#${chapter.id}`} className={styles.pathStep}>
              <span>{chapter.label}</span><strong>{chapter.short}</strong>
            </a>)}
          </div>
        </div>
      </nav>

      <div className={styles.paper} id="mulai-membaca">
        <div className={`${styles.wrap} ${styles.readingGrid}`}>
          <LearningGuideTOC items={chapters} />
          <article className={styles.article}>
            <div className={styles.opening}>
              <p className={styles.eyebrow}>Sebelum mulai</p>
              <p>Freelance sering terlihat sederhana dari luar: punya skill, cari client, kerjakan project, lalu dibayar. Dalam praktiknya, kamu perlu tahu <strong>apa yang dijual, siapa yang membutuhkan, bagaimana membuktikan kemampuan, dan bagaimana bekerja secara profesional.</strong></p>
              <p>Panduan ini membantumu membangun fondasi itu selangkah demi selangkah. Kamu tidak perlu menunggu menjadi ahli; mulai dari sesuatu yang cukup bisa kamu kerjakan, lalu bangun bukti dan pengalaman.</p>
            </div>

            <section id="01-memahami" className={styles.chapter}>
              <ChapterHead number="01" category="Memahami dunia freelance" title="Freelance itu sebenarnya apa?" intro="Freelance adalah cara bekerja secara independen dengan menjual keahlian, hasil kerja, atau kapasitas waktu kepada client tanpa menjadi pegawai tetap mereka." />
              <p>Freelance juga tidak sama dengan remote work. Pegawai penuh waktu bisa bekerja dari rumah, sementara freelancer dapat bekerja daring atau bertemu client secara langsung. Perbedaannya terletak pada <strong>bentuk hubungan kerja</strong>.</p>
              <div className={styles.editorialList}>
                <p className={styles.eyebrow}>Empat model yang umum</p>
                {[
                  ["Project-based", "Mengerjakan hasil tertentu", "Per project"],
                  ["Hourly", "Menjual sejumlah jam kerja", "Per jam"],
                  ["Retainer", "Mendukung client secara rutin", "Per bulan"],
                  ["Contract", "Bekerja dalam periode tertentu", "Sesuai kontrak"],
                ].map(([name, work, pay], index) => <div className={styles.modelRow} key={name}><span>0{index + 1}</span><strong>{name}</strong><span>{work}</span><span>{pay}</span></div>)}
              </div>
              <p>Developer bisa dibayar untuk satu website, editor video per jam, atau penulis melalui retainer delapan artikel setiap bulan. Masing-masing model mengubah cara kamu menyusun scope, jadwal, dan harga.</p>
              <blockquote className={styles.pullQuote}>“Apakah orang ini bisa membantu menyelesaikan masalah saya?”</blockquote>
              <p>Itulah pertanyaan client. Geser cara berpikir dari “saya punya skill apa?” menjadi <strong>“masalah apa yang bisa saya selesaikan dengan skill tersebut?”</strong> Client membeli hasil yang berguna, bukan daftar tutorial yang pernah kamu tonton.</p>
              <h3>Kemandirian tetap butuh kesepakatan</h3>
              <p>Menjadi independen tidak berarti bekerja tanpa aturan. Seorang freelancer tetap bertanggung jawab pada deadline, kualitas, komunikasi, dan kerahasiaan materi client. Perbedaannya, hubungan itu dibangun melalui scope dan kesepakatan, bukan deskripsi pekerjaan pegawai tetap. Sebelum menerima pekerjaan, pahami siapa yang memberi arahan, hasil apa yang diterima, kapan pekerjaan selesai, serta bagaimana perubahan akan dibahas.</p>
              <p>Bayangkan dua orang yang sama-sama bekerja dari rumah. Yang pertama adalah pegawai tim produk dengan gaji bulanan. Yang kedua menerima project membuat halaman promosi dengan deliverable dan tenggat yang disepakati. Lokasinya sama, tetapi cara keduanya dibayar, dinilai, dan mengambil keputusan berbeda. Memahami ini sejak awal membantumu memilih peluang yang cocok.</p>
              <div className={styles.takeaway}><span className={styles.eyebrow}>Intinya</span><p>Freelance bukan sekadar kerja dari rumah. Kamu menjual hasil, kapasitas, atau keahlian kepada client dengan hubungan kerja yang disepakati bersama.</p></div>
              <Checkpoint number="01"><p>Model kerja mana yang paling ingin kamu coba lebih dulu: project-based, hourly, contract, atau retainer? Pilih satu sebagai titik awal; pilihan ini bisa berubah.</p></Checkpoint>
            </section>

            <section id="02-menentukan-arah" className={styles.chapter}>
              <ChapterHead number="02" category="Skill & arah" title="Skill apa yang bisa kamu jual?" intro="Kesalahan umum pemula adalah menunggu sampai merasa sangat ahli. Client membutuhkan orang yang cukup kompeten untuk menyelesaikan masalah tertentu." />
              <div className={styles.skillDiagram} aria-label="Skill yang layak dijual bertemu di antara kemampuan, kebutuhan pasar, dan minat untuk berkembang">
                <span>01 / Yang bisa kamu kerjakan</span><span>02 / Dibutuhkan pasar</span><span>03 / Ingin kamu kembangkan</span><strong>Di pertemuan ketiganya ada arah awalmu.</strong>
              </div>
              <h3>Mulai dengan skill inventory</h3>
              <p>Tuliskan semua kemampuan yang sudah kamu miliki, lalu kelompokkan. Jangan menilai terlalu cepat apakah kemampuan itu “cukup bagus”.</p>
              <div className={styles.threeColumns}>
                <div><h4>Technical</h4><p>Web development, desain grafis, video editing, copywriting, translation, data analysis, SEO.</p></div>
                <div><h4>Business</h4><p>Sales, digital marketing, research, customer service, project management.</p></div>
                <div><h4>Creative</h4><p>Writing, fotografi, scriptwriting, ilustrasi, content creation.</p></div>
              </div>
              <p>Uji setiap skill dengan tiga pertanyaan: <strong>apa output yang jelas?</strong> Siapa yang membutuhkan output itu? Apakah kamu ingin menjadi lebih baik di bidang ini? “Video editing” bisa menjadi video siap publikasi bagi creator yang tidak punya waktu mengedit.</p>
              <h3>Ubah kemampuan menjadi hasil</h3>
              <p>Jangan berhenti pada nama skill. Turunkan menjadi sesuatu yang bisa diterima client: writing menjadi artikel atau rangkaian email; desain menjadi identitas visual dan berkas siap pakai; data analysis menjadi laporan yang membantu keputusan. Setelah output jelas, cari situasi yang membuatnya bernilai. Artikel SEO berguna bagi bisnis yang ingin menjawab pertanyaan calon pembeli. Video pendek berguna bagi creator yang sudah punya rekaman tetapi belum punya waktu mengolahnya.</p>
              <p>Ambil tiga kandidat skill dari inventarismu. Beri nilai sederhana pada kemampuan saat ini, kebutuhan yang kamu temukan, dan minat untuk memperdalamnya. Ini bukan rumus matematis untuk memilih karier. Ini cara melihat trade-off secara jujur. Jika sebuah skill banyak diminta tetapi kamu sama sekali tidak ingin mengerjakannya, mungkin ia cocok untuk pekerjaan singkat, bukan arah utama jangka panjang.</p>
              <div className={styles.example}><span className={styles.eyebrow}>Real example / AI-assisted product engineer</span><p>Seorang founder perlu menguji ide produk dengan cepat. Skill full-stack development dan product thinking dapat menjadi layanan landing page atau MVP yang siap diuji, bukan sekadar klaim “bisa Next.js”.</p><dl><div><dt>Masalah</dt><dd>Ide produk belum punya bentuk yang bisa diuji.</dd></div><div><dt>Output</dt><dd>Landing page, prototipe, atau MVP.</dd></div><div><dt>Calon client</dt><dd>Founder, creator, dan bisnis digital.</dd></div></dl></div>
              <Checkpoint number="02"><p>Catat satu skill utama, masalah yang bisa diselesaikannya, dan siapa yang kemungkinan mempunyai masalah itu. Misalnya: video editing → footage belum siap tayang → YouTuber atau podcaster.</p></Checkpoint>
            </section>

            <section id="03-niche" className={styles.chapter}>
              <ChapterHead number="03" category="Positioning & niche" title="Jangan hanya menjual skill. Bangun posisi." intro="Kalimat “saya seorang web developer” menjelaskan profesi. Positioning membantu calon client memahami siapa yang kamu bantu dan hasil apa yang mereka dapat." />
              <div className={styles.formula}><span className={styles.eyebrow}>Formula positioning</span><p>Saya membantu <em>[target client]</em> mendapatkan <em>[hasil]</em> melalui <em>[layanan atau skill]</em>.</p></div>
              <p>Contohnya: “Saya membantu creator mengubah video panjang menjadi konten pendek yang siap dipublikasikan.” Kalimat itu lebih mudah diingat daripada daftar semua aplikasi editing yang kamu kuasai.</p>
              <h3>Seberapa sempit niche yang tepat?</h3>
              <p>Kamu tidak harus mengunci diri pada satu industri selamanya. Mulailah cukup spesifik agar orang paham, lalu perbaiki posisimu dari pengalaman nyata.</p>
              <ol className={styles.ladder}><li><span>Terlalu luas</span><strong>Saya membantu semua bisnis.</strong></li><li><span>Lebih jelas</span><strong>Saya membantu bisnis digital membangun website.</strong></li><li><span>Lebih spesifik</span><strong>Saya membantu creator dan founder meluncurkan produk digital melalui landing page.</strong></li></ol>
              <h3>Dari skill menjadi offer</h3>
              <p>Skill adalah kemampuan; <em>offer</em> adalah pekerjaan yang dapat dibeli. Copywriting bisa menjadi paket copy landing page. Video editing bisa menjadi 12 video pendek per bulan. Jelaskan untuk siapa layanan itu, masalahnya, deliverable, waktu pengerjaan, serta batas revisinya.</p>
              <p>Offer yang baik mengurangi pekerjaan menebak di kedua sisi. Client tahu apa yang akan diterima; kamu tahu batas pekerjaan yang harus dihitung. Nama layanan saja belum cukup. Tambahkan kondisi awal yang diperlukan, cara kerja singkat, berapa putaran umpan balik, dan apa yang terjadi bila kebutuhan berubah. Harga “mulai dari” hanya masuk akal jika scope dasarnya juga jelas.</p>
              <h3>Uji kalimatmu dengan orang lain</h3>
              <p>Berikan positioning kepada teman yang tidak bekerja di bidangmu. Tanyakan dua hal: “Menurutmu saya membantu siapa?” dan “Hasil apa yang saya jual?” Jika jawabannya meleset, perbaiki kalimatnya. Hindari janji yang tidak bisa dibuktikan, misalnya menjamin omzet naik tanpa memahami produk, audiens, atau saluran pemasaran client. Lebih kuat menjelaskan pekerjaan dan hasil yang berada dalam kendalimu.</p>
              <div className={styles.example}><span className={styles.eyebrow}>Contoh offer / MVP landing page</span><p>Untuk founder yang ingin memvalidasi produk. Termasuk struktur konten, desain responsif, implementasi, CTA, dan penyiapan publikasi. Estimasi 7–10 hari setelah materi diterima. Scope, revisi, dan harga disepakati sebelum kickoff.</p></div>
              <Checkpoint number="03"><p>Lengkapi satu kalimat positioning dan satu paragraf offer. Jika calon client masih harus menebak apa yang akan diterima, buat penawarannya lebih jelas.</p></Checkpoint>
            </section>

            <section id="04-portfolio" className={styles.chapter}>
              <ChapterHead number="04" category="Portfolio" title="Portfolio bukan galeri." intro="Portfolio adalah bukti bahwa kamu bisa menyelesaikan masalah. Tampilkan keputusan dan hasil, bukan hanya gambar akhir atau daftar tools." />
              <p>Belum pernah punya client? Buat <em>self-initiated project</em> dan beri label dengan jujur. Kamu bisa merancang ulang website bisnis lokal, menulis contoh artikel, atau membuat simulasi kampanye. Jangan menyajikan hasil latihan sebagai proyek client berbayar.</p>
              <div className={styles.sequence}><p className={styles.eyebrow}>Anatomi case study</p>{["Context", "Problem", "Role", "Process", "Solution", "Result", "What I learned"].map((step, i) => <div key={step}><span>0{i + 1}</span><strong>{step}</strong></div>)}</div>
              <p>Mulai cerita dari kebutuhan: “Founder membutuhkan MVP untuk diuji pengguna dalam waktu singkat.” Setelah itu jelaskan pilihan desain atau teknologi dan alasannya. Jika belum ada metrik hasil, tulis apa yang benar-benar selesai serta apa yang akan kamu uji berikutnya; jangan mengarang angka konversi.</p>
              <h3>Tulis satu case study yang bisa dipercaya</h3>
              <p>Contoh: sebuah kafe lokal punya menu yang sulit dibaca di ponsel. Kamu membuat konsep halaman menu yang lebih cepat dipindai. Dalam case study, jelaskan masalah awal, siapa audiensnya, pilihan hierarki konten, perubahan yang kamu buat, dan apa yang belum diuji. Jika ini latihan mandiri, tulis “konsep independen, tidak berafiliasi dengan bisnis tersebut”. Transparansi justru membantu pembaca menilai kemampuanmu secara tepat.</p>
              <p>Setiap project tidak harus memiliki metrik spektakuler. Bukti bisa berupa proses berpikir, prototipe yang berfungsi, cuplikan sebelum dan sesudah, hasil penyerahan, atau testimoni yang memang diberikan client. Pilih bukti yang paling relevan dengan layanan yang kamu tawarkan. Portfolio untuk menulis email pemasaran tidak perlu dipenuhi desain aplikasi yang tidak berkaitan.</p>
              <h3>Minimum viable portfolio</h3>
              <div className={styles.statLine}><span>01</span><p><strong>Positioning yang jelas</strong> — siapa yang kamu bantu dan hasil yang ditawarkan.</p></div><div className={styles.statLine}><span>02–03</span><p><strong>Project terbaik</strong> — cukup yang relevan dan dapat dijelaskan prosesnya.</p></div><div className={styles.statLine}><span>01</span><p><strong>Ajakan menghubungi</strong> — cara sederhana untuk memulai percakapan.</p></div>
              <Checkpoint number="04"><p>Pilih dua atau tiga project. Untuk masing-masing, tulis masalah, peranmu, keputusan terpenting, hasil yang bisa dibuktikan, dan apa yang kamu pelajari.</p></Checkpoint>
            </section>

            <section id="05-harga" className={styles.chapter}>
              <ChapterHead number="05" category="Pricing & rate" title="Harga yang masuk akal dimulai dari scope." intro="Tidak ada satu tarif freelance yang berlaku untuk semua orang. Harga dipengaruhi pengalaman, kompleksitas, risiko, tenggat, pasar, biaya, dan nilai pekerjaan bagi client." />
              <div className={styles.priceModels}>{[["Hourly", "Cocok saat kebutuhan berubah dan waktu tercatat dengan jelas."], ["Project-based", "Harga disepakati untuk deliverable dan batas scope tertentu."], ["Retainer", "Kapasitas rutin dengan output dan periode yang disepakati."], ["Value-based", "Menimbang dampak bisnis yang dapat dipahami kedua pihak."]].map(([name, description]) => <div key={name}><h3>{name}</h3><p>{description}</p></div>)}</div>
              <h3>Hitung batas sehatmu</h3><p>Misalkan target pendapatanmu Rp8.000.000 per bulan. Tidak semua jam kerja bisa ditagih: ada waktu untuk mencari client, meeting, administrasi, revisi, belajar, dan pemasaran. Pertimbangkan juga biaya tools, operasional, tabungan, pajak yang relevan, serta risiko bulan sepi. Dari sana tentukan <strong>harga minimum internal</strong> yang membuat pekerjaan tetap layak.</p>
              <p>Misalnya kamu memperkirakan hanya 80 jam per bulan yang bisa ditagih. Membagi Rp8.000.000 dengan 80 memberi titik awal Rp100.000 per jam, <strong>bukan tarif final</strong>. Target itu belum tentu mencakup biaya operasional, waktu tanpa project, atau risiko revisi. Pakai perhitungan ini untuk memeriksa apakah sebuah project akan sehat bagimu, lalu sesuaikan dengan scope dan kondisi pasar.</p>
              <p>Untuk project-based, tanyakan apa saja yang termasuk harga: jumlah halaman, materi dari client, integrasi, revisi, dan dukungan setelah serah terima. Untuk hourly, jelaskan cara mencatat waktu dan batas anggaran. Untuk retainer, tentukan kapasitas per bulan dan apa yang terjadi jika pekerjaan tidak terpakai atau melebihi kapasitas. Value-based membutuhkan pemahaman yang baik tentang dampak pekerjaan dan tidak cocok dipaksakan pada semua proyek.</p>
              <div className={styles.scopeShift}><span className={styles.eyebrow}>Scope &gt; diskon</span><p>Budget lebih kecil?</p><div><span>Website 8 halaman</span><span aria-hidden="true">→</span><strong>Landing page 1 halaman</strong></div><small>Harga turun karena pekerjaan berubah, bukan karena pekerjaan yang sama tiba-tiba lebih murah.</small></div>
              <Checkpoint number="05"><p>Untuk satu layanan, tulis model harga, batas minimum internal, apa yang termasuk, batas revisi, dan apa yang tidak termasuk. Pakai itu saat merespons inquiry.</p></Checkpoint>
            </section>

            <section id="06-peluang" className={styles.chapter}>
              <ChapterHead number="06" category="Mencari peluang" title="Client tidak muncul hanya karena portfolio sudah jadi." intro="Setelah fondasi siap, bangun sistem untuk menemukan peluang. Fokus pada aktivitas yang bisa kamu kendalikan dan kualitas percakapan yang kamu mulai." />
              <div className={styles.opportunityMap}>{[["Freelance platform", "Permintaan sudah ada, tetapi kompetisi tinggi. Pilih brief yang relevan."], ["Remote job board", "Cari peran contract, part-time, atau project-based; tidak semua remote job adalah freelance."], ["Direct outreach", "Mulai dari observasi yang spesifik, bukan pesan massal."], ["Personal brand", "Bagikan proses, case study, dan pembelajaran agar orang mengingat keahlianmu."], ["Network & referral", "Jelaskan layanan yang kamu buka sehingga orang tahu kapan harus mengenalkanmu."]].map(([name, copy], i) => <div key={name}><span>0{i + 1}</span><h3>{name}</h3><p>{copy}</p></div>)}</div>
              <div className={styles.example}><span className={styles.eyebrow}>Contoh outreach yang spesifik</span><p>“Saya melihat landing page produk Anda belum mempunyai CTA yang jelas di mobile. Saya sempat membuat beberapa catatan perbaikan yang mungkin relevan. Kalau berkenan, saya bisa kirimkan.”</p></div>
              <p>Untuk network, sampaikan kebutuhanmu dengan konkret: “Saya sedang membuka project landing page untuk bisnis digital. Kalau ada temanmu yang hendak meluncurkan produk, boleh kenalkan saya.” Untuk personal brand, bagikan pekerjaan yang sudah kamu lakukan dan alasan keputusanmu. Tujuannya bukan menjadi influencer, melainkan membuat kemampuanmu mudah diingat ketika kebutuhan muncul.</p>
              <h3>Rawat pipeline, bukan sekadar daftar link</h3><p>Catat setiap peluang agar kamu tahu langkah berikutnya. Spreadsheet sederhana sudah cukup.</p><div className={styles.pipeline}>Lead <span>→</span> Contacted <span>→</span> Replied <span>→</span> Discovery <span>→</span> Proposal <span>→</span> Negotiation <span>→</span> Won / Lost</div>
              <p>Di setiap baris pipeline, catat nama organisasi, kebutuhan, sumber peluang, tanggal kontak, dan tindak lanjut berikutnya. Jika proposal berkali-kali tidak dibalas, periksa apakah brief yang dipilih memang relevan dan apakah pembuka proposal menunjukkan pemahaman masalah client. Jika banyak percakapan berhenti di harga, mungkin scope atau nilai hasil belum dijelaskan dengan baik. Data sederhana ini lebih berguna daripada sekadar menghitung jumlah pesan.</p>
              <p>Proposal yang baik dimulai dari masalah client, lalu pendekatan, bukti yang relevan, dan langkah berikutnya. Misalnya: “Dari brief-nya, kebutuhan utama Anda adalah menjelaskan produk dengan lebih sederhana sebelum campaign. Saya akan mulai dari struktur informasi dan CTA, lalu membangun versi responsif. Jika cocok, kita bisa membahas scope dan timeline.”</p>
              <p>Jika belum ada balasan setelah beberapa hari, satu follow-up sopan cukup: “Saya menindaklanjuti proposal sebelumnya. Jika proyeknya masih berjalan dan ada pertanyaan soal scope atau timeline, saya senang membantu menjelaskan.”</p>
              <div className={styles.warning}><h3>Kenali tanda bahaya</h3><p>Waspadai permintaan pekerjaan penuh sebelum pembayaran, scope yang terus bertambah tanpa diskusi, transaksi mencurigakan, kewajiban membeli sesuatu lebih dulu, dan penolakan membuat kesepakatan tertulis.</p></div>
              <Checkpoint number="06"><p>Target mingguan awal: temukan 10 peluang berkualitas, kirim 5 proposal relevan, lakukan 5 outreach personal, publikasikan 1 bukti kerja, dan tindak lanjuti 2 percakapan. Sesuaikan angka dengan kapasitasmu; evaluasi responsnya.</p></Checkpoint>
            </section>

            <section id="07-client" className={styles.chapter}>
              <ChapterHead number="07" category="Manajemen client" title="Mendapatkan client baru setengah perjalanan." intro="Karier freelance juga ditentukan oleh cara kamu mengelola pekerjaan, ekspektasi, komunikasi, dan hubungan setelah project selesai." />
              <div className={styles.workflow} aria-label="Alur kerja dengan client">{["Inquiry", "Discovery", "Scope", "Proposal", "Agreement", "Payment", "Kickoff", "Production", "Review", "Delivery", "Testimonial", "Retention"].map((step, i) => <span key={step}>{String(i + 1).padStart(2, "0")} {step}</span>)}</div>
              <h3>Sebelum pekerjaan dimulai</h3><p>Saat discovery, pahami masalah, hasil yang diinginkan, deadline, pengambil keputusan, budget bila tersedia, dan scope. Dalam proposal serta kesepakatan tertulis, jelaskan deliverable, apa yang tidak termasuk, timeline, revisi, pembayaran, hak penggunaan, dan pembatalan. Struktur pembayaran awal berbeda menurut jenis proyek; yang penting semua terms jelas sebelum kickoff.</p>
              <p>Jangan langsung menawarkan solusi pada menit pertama discovery. Tanyakan apa yang sudah dicoba, apa yang membuat masalah ini mendesak, dan bagaimana client akan menilai pekerjaan berhasil. Tuliskan kembali pemahamanmu dengan kata-kata sederhana. Jika kamu dan client ternyata membayangkan hasil yang berbeda, lebih murah memperbaikinya sebelum proposal daripada setelah produksi dimulai.</p>
              <h3>Saat pekerjaan berjalan</h3><p>Kumpulkan file, akses, panduan brand, tujuan, kontak utama, dan tenggat. Beri kabar secara rutin tanpa memaksa meeting setiap hari. Contoh: “Minggu ini struktur halaman selesai. Berikutnya saya mengerjakan versi responsif. Tidak ada hambatan saat ini dan timeline masih sesuai rencana.”</p>
              <p>Tentukan sejak awal satu kanal komunikasi utama dan kapan feedback perlu diberikan. Setelah setiap keputusan penting, tulis ringkasan singkat agar tidak bergantung pada ingatan rapat. Jika materi dari client terlambat, sampaikan dampaknya pada jadwal. Jika kamu menemui hambatan, kabari sebelum tenggat lewat, sertakan opsi penyelesaiannya. Komunikasi semacam ini membangun kepercayaan bahkan ketika pekerjaan belum selesai.</p>
              <div className={styles.twoCases}><div><span className={styles.eyebrow}>Revisi</span><p>Mengubah warna CTA yang sudah ada.</p></div><div><span className={styles.eyebrow}>Scope baru</span><p>Menambahkan halaman membership yang belum disepakati.</p></div></div>
              <p>Jika permintaan berubah menjadi scope baru, jelaskan dampaknya pada biaya dan jadwal sebelum mengerjakannya. Saat handoff, berikan file akhir, akses bila relevan, dokumentasi atau tutorial singkat, status pekerjaan, dan langkah berikutnya.</p>
              <p>Sebelum menutup project, periksa kembali deliverable terhadap kesepakatan, minta konfirmasi penerimaan, dan jelaskan masa dukungan jika ada. Simpan catatan tentang apa yang berjalan baik dan apa yang perlu diperbaiki. Client lama mungkin membutuhkan pekerjaan lanjutan seperti pemeliharaan, konten, atau optimasi, tetapi tawarkan hanya jika memang relevan dengan hasil project pertama.</p>
              <div className={styles.example}><span className={styles.eyebrow}>Setelah delivery</span><p>“Senang bisa membantu proyek ini. Jika hasilnya sudah sesuai, apakah Anda berkenan memberi testimoni singkat tentang pengalaman bekerja bersama saya?” Setelah itu, tanyakan apakah ada bantuan lanjutan yang benar-benar dibutuhkan.</p></div>
              <p className={styles.finalThought}>Skill + komunikasi + ekspektasi + delivery + bisnis. Semuanya bagian dari pekerjaan freelancer.</p>
              <Checkpoint number="07"><p>Siapkan template discovery, scope, update mingguan, dan handoff. Empat dokumen sederhana ini membantu project pertama terasa profesional.</p></Checkpoint>
            </section>
          </article>
        </div>
      </div>

      <section className={styles.recap} aria-labelledby="recap-title"><div className={styles.wrap}>
        <div><p className={styles.eyebrow}>Setelah membaca</p><h2 id="recap-title">Apa yang sudah kamu pegang?</h2><p>Tidak semuanya harus sempurna. Tujuannya adalah membuatmu cukup siap untuk bergerak.</p></div>
        <ul>{["Satu skill utama", "Target client awal", "Positioning sederhana", "Satu offer", "2–3 project portfolio", "Model pricing", "Pipeline peluang", "Struktur proposal", "Workflow client"].map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
      </div></section>

      <section className={styles.roadmap} aria-labelledby="roadmap-title"><div className={styles.wrap}>
        <p className={styles.eyebrow}>Rencana tindakan</p><h2 id="roadmap-title">30 hari mulai freelance.</h2><p className={styles.roadmapIntro}>Bukan jadwal wajib. Gunakan sebagai urutan kerja awal, lalu sesuaikan dengan waktu dan kebutuhanmu.</p>
        <div className={styles.weeks}>{[["01", "Fondasi", "Pilih skill, target client, positioning, dan susun satu offer."], ["02", "Proof", "Bangun atau rapikan portfolio, tulis dua case study, dan perjelas profil profesional."], ["03", "Market", "Cari peluang, kirim proposal, mulai outreach, dan publikasikan bukti kerja."], ["04", "Iterate", "Tinjau respons, keberatan calon client, kualitas portfolio, dan perbaiki pendekatan."]].map(([week, title, copy]) => <div key={week}><span>Minggu {week}</span><h3>{title}</h3><p>{copy}</p></div>)}</div>
        <p className={styles.roadmapClose}>Freelance jarang berhasil karena satu keputusan besar. Ia tumbuh dari banyak iterasi kecil.</p>
      </div></section>

      <section className={styles.closing} aria-labelledby="closing-title"><div className={styles.wrap}>
        <p className={styles.darkEyebrow}>Langkah berikutnya</p><h2 id="closing-title">Mulai kecil.<br />Bangun bukti.<br /><em>Ulangi.</em></h2>
        <p>Kamu tidak perlu portfolio, branding, atau website yang sempurna untuk memulai. Kamu membutuhkan skill yang cukup berguna, masalah yang jelas, bukti bahwa kamu bisa membantu, dan keberanian menawarkan pekerjaanmu ke pasar.</p>
        <div className={styles.closingFlow}>Skill <span>→</span> Proof <span>→</span> Offer <span>→</span> Opportunity <span>→</span> Client <span>→</span> Reputation <span>→</span> Repeat</div>
      </div></section>

      <nav className={styles.next} aria-label="Lanjut belajar"><div className={styles.wrap}>
        <div className={styles.nextPrimary}><span className={styles.darkEyebrow}>Berikutnya / WWF 02</span><h2>Bangun Portfolio Pertamamu</h2><p>Pelajari cara mengubah skill, latihan, dan project menjadi portfolio yang membantu calon client memahami apa yang bisa kamu kerjakan.</p><span className={styles.pending}>Panduan berikutnya sedang disiapkan</span></div>
        <div className={styles.nextSecondary}><span className={styles.darkEyebrow}>Sudah siap mencari?</span><h2>Cari Peluang Pertamamu</h2><p>Jelajahi platform freelance, remote job board, dan sumber peluang yang tersedia di Freelance Hub.</p><Link href="/freelance#card-direktori">Jelajahi direktori <span aria-hidden="true">↗</span></Link></div>
      </div></nav>
    </main>
  </>;
}
