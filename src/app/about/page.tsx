import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/shared/navbar";
import { HomeExperience } from "@/components/home/HomeExperience";
import s from "./about.module.css";
export const metadata: Metadata = {
  title: "Tentang Khadafi — Di Balik Ide & Karya",
  description:
    "Kenali Khadafi, AI-Assisted Product Engineer & Digital Builder. Tentang rasa ingin tahu, perjalanan belajar, dan karya digital yang terus tumbuh.",
  alternates: { canonical: "https://khadafidaffa.com/about" },
  openGraph: {
    title: "Halo, aku Khadafi.",
    description:
      "Di antara rasa ingin tahu, teknologi, dan karya yang terus tumbuh.",
    url: "https://khadafidaffa.com/about",
    images: ["/assets/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Halo, aku Khadafi.",
    description: "Di balik ide, proses, dan karya digital Khadafi.",
    images: ["/assets/og-image.png"],
  },
};
const work = [
  {
    num: "01",
    name: "Chikki",
    type: "Immersive Writing Network",
    description:
      "Sebuah eksplorasi membangun ruang digital bagi penulis, pembaca, dan karya kreatif untuk saling terhubung.",
    status: "Terus dikembangkan",
    href: "https://chikki.id",
    external: true,
    mark: "“",
  },
  {
    num: "02",
    name: "Freelance Journey Hub",
    type: "Karier independen & pembelajaran",
    description:
      "Tempatku mendokumentasikan perjalanan membangun karier independen, membagikan sumber belajar, dan mengkurasi peluang kerja remote.",
    status: "Panduan & kurasi aktif",
    href: "/freelance",
    external: false,
    mark: "↗",
  },
  {
    num: "03",
    name: "Digital Products & Experiments",
    type: "Ide yang menemukan bentuknya",
    description:
      "Kumpulan ide, produk, dan eksperimen yang terus kukembangkan untuk belajar sekaligus menciptakan sesuatu yang bernilai.",
    status: "Eksperimen berkelanjutan",
    href: "/#featured-work",
    external: false,
    mark: "✳",
  },
];
export default function AboutPage() {
  return (
    <>
      <Navbar />
      <HomeExperience>
        <div className={s.aboutPage}>
          <header className={s.hero}>
            <div className={s.container}>
              <div className={s.masthead}>
                <span>Di balik ide & karya</span>
                <span>Khadafi / Indonesia</span>
              </div>
              <div className={s.heroGrid}>
                <div className={s.introduction}>
                  <p className={s.kicker}>The human behind the work</p>
                  <h1>
                    Halo, aku
                    <br />
                    <em>Khadafi.</em>
                    <span aria-hidden="true">✳</span>
                  </h1>
                  <p>
                    Aku suka mengeksplorasi ide, memahami cara sesuatu bekerja,
                    dan mengubahnya menjadi karya digital yang bermanfaat.
                  </p>
                  <div className={s.heroLinks}>
                    <a href="#journey">
                      Kenali perjalananku <span aria-hidden="true">↓</span>
                    </a>
                    <Link href="/resources">Jelajahi library ↗</Link>
                  </div>
                </div>
                <figure className={s.portrait}>
                  <div className={s.photo}>
                    <Image
                      src="/assets/my-profile.jpg"
                      alt="Khadafi, di balik ide dan karya digital"
                      fill
                      priority
                      sizes="(max-width: 640px) 85vw, (max-width: 1000px) 45vw, 450px"
                    />
                  </div>
                  <figcaption>
                    <span>Selalu ada hal baru untuk dipelajari.</span>
                    <span aria-hidden="true">01 /</span>
                  </figcaption>
                  <span className={s.portraitNote}>
                    A work in progress.
                    <br />
                    <em>Just like the work.</em>
                  </span>
                </figure>
              </div>
              <div className={s.heroBottom}>
                <span>AI-Assisted Product Engineer & Digital Builder</span>
                <span>Belajar. Membangun. Memperbaiki.</span>
              </div>
            </div>
          </header>
          <section
            id="journey"
            className={s.journey}
            aria-labelledby="journey-title"
            data-reveal="soft"
          >
            <div className={s.container}>
              <div className={s.storyGrid}>
                <div>
                  <p className={s.kicker}>01 / The builder’s journey</p>
                  <h2 id="journey-title">
                    Rasa penasaran
                    <br />
                    yang{" "}
                    <em>
                      membawaku
                      <br />
                      ke sini.
                    </em>
                  </h2>
                  <span className={s.storyLine} aria-hidden="true" />
                </div>
                <div className={s.story}>
                  <p className={s.lead}>
                    Perjalananku tidak selalu berada di dunia teknologi.
                  </p>
                  <p>
                    Aku pernah berkecimpung di bidang sales dan digital
                    marketing. Dari sana, aku mulai memahami bahwa setiap
                    produk, layanan, dan bisnis selalu berhubungan dengan
                    manusia: apa yang mereka butuhkan, masalah yang mereka
                    hadapi, dan bagaimana kita menciptakan solusi yang berarti.
                  </p>
                  <p>
                    Rasa penasaran itu membawaku semakin dekat dengan dunia
                    digital. Aku mulai belajar tentang product development, user
                    experience, artificial intelligence, dan pengembangan
                    aplikasi.
                  </p>
                  <div className={s.storyAside}>
                    <span aria-hidden="true">↳</span>
                    <p>
                      Hari ini, aku membangun identitasku sebagai{" "}
                      <strong>
                        AI-Assisted Product Engineer & Digital Builder.
                      </strong>
                    </p>
                  </div>
                  <p>
                    Aku memanfaatkan AI untuk membantu proses berpikir,
                    merancang, membangun, dan menguji produk digital. Bukan
                    sekadar untuk bekerja lebih cepat, tetapi juga untuk membuka
                    kemungkinan yang sebelumnya sulit dilakukan secara mandiri.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section
            className={s.workSection}
            aria-labelledby="building-title"
            data-reveal="line"
          >
            <div className={s.container}>
              <div className={s.sectionHeading}>
                <div>
                  <p className={s.kicker}>02 / Tempat ide bertumbuh</p>
                  <h2 id="building-title">
                    Apa yang sedang
                    <br />
                    <em>kubangun?</em>
                  </h2>
                </div>
                <p>
                  Beberapa proyek yang menjadi tempatku belajar sekaligus
                  bereksperimen.
                </p>
              </div>
              <div className={s.works}>
                {work.map((w) => (
                  <Link
                    key={w.num}
                    href={w.href}
                    className={s.work}
                    {...(w.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <div
                      className={s.workVisual}
                      data-work={w.num}
                      aria-hidden="true"
                    >
                      <span>{w.num} / INDEPENDENT EXPLORATIONS</span>
                      <strong>{w.mark}</strong>
                      <small>{w.type}</small>
                    </div>
                    <div className={s.workCopy}>
                      <span className={s.workStatus}>
                        <i />
                        {w.status}
                      </span>
                      <h3>{w.name}</h3>
                      <p>{w.description}</p>
                      <span className={s.workLink}>
                        Jelajahi karya <span aria-hidden="true">↗</span>
                        {w.external && (
                          <span className={s.srOnly}> (tab baru)</span>
                        )}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          <section
            id="jasa"
            className={s.thinking}
            aria-labelledby="thinking-title"
            data-reveal="heading"
          >
            <div className={s.container}>
              <div className={s.storyGrid}>
                <div>
                  <p className={s.kicker}>03 / Cara memandang proses</p>
                  <h2 id="thinking-title">
                    Belajar,
                    <br />
                    membangun,
                    <br />
                    <em>memperbaiki.</em>
                  </h2>
                </div>
                <div className={s.story}>
                  <p className={s.lead}>
                    Aku percaya kita tidak harus mengetahui semua jawabannya
                    sebelum memulai.
                  </p>
                  <p>
                    Kadang sebuah ide berjalan baik, kadang hasilnya berbeda
                    dari yang dibayangkan. Justru di situlah proses belajar
                    terjadi.
                  </p>
                  <p>
                    Aku mencoba membangun dengan sederhana, memahami pengguna,
                    menguji asumsi, dan memperbaiki apa yang belum bekerja.
                  </p>
                  <ol className={s.principles}>
                    <li>
                      <span>01</span>
                      <div>
                        <h3>Pahami sebelum membangun.</h3>
                        <p>
                          Mulai dari manusia dan masalah yang ingin dibantu.
                        </p>
                      </div>
                    </li>
                    <li>
                      <span>02</span>
                      <div>
                        <h3>Buat langkah pertama sederhana.</h3>
                        <p>
                          Ruang lingkup yang jelas memberi ruang untuk belajar.
                        </p>
                      </div>
                    </li>
                    <li>
                      <span>03</span>
                      <div>
                        <h3>Biarkan bukti mengubah arah.</h3>
                        <p>Uji asumsi, dengarkan masukan, dan perbaiki.</p>
                      </div>
                    </li>
                  </ol>
                  <p>
                    Masih banyak hal yang ingin kupelajari. Dan website ini
                    adalah salah satu tempat untuk mendokumentasikan perjalanan
                    tersebut.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section
            id="contact"
            className={s.connect}
            aria-labelledby="connect-title"
          >
            <div className={s.container}>
              <p className={s.kicker}>04 / Percakapan berikutnya</p>
              <h2 id="connect-title">
                Mari <em>terhubung.</em>
              </h2>
              <p>
                Punya ide yang ingin diwujudkan? Sedang mengeksplorasi AI,
                produk digital, atau karier independen?
              </p>
              <p>
                Aku terbuka untuk berbagi perspektif, berdiskusi, dan menjajaki
                kolaborasi yang menarik.
              </p>
              <a
                className={s.contactButton}
                href="mailto:daffadhiyaulhaqkhadafi@gmail.com"
              >
                Mulai percakapan <span aria-hidden="true">↗</span>
              </a>
              <div className={s.signature}>
                <span>Terus belajar. Terus berkarya.</span>
                <em>Khadafi.</em>
              </div>
            </div>
          </section>
        </div>
      </HomeExperience>
    </>
  );
}
