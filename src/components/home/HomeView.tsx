import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import type { BlogCardItem } from "@/lib/mdx";
import { SIGNATURE_SYSTEMS } from "@/content/resources-data";
import { WorkAtlas } from "@/components/freelance/WorkAtlas";
import { HomeExperience, DynamicNote } from "./HomeExperience";
import { CredentialsGallery } from "./CredentialsGallery";
import { NewsletterSection } from "./NewsletterSection";
import { ChikkiPreview } from "./ChikkiPreview";
import styles from "./editorial-home.module.css";
function SectionBridge({ label, href, index }: { label: string; href: string; index: string }) {
  return <a className={styles.sectionBridge} href={href} aria-label={"Lanjut ke " + label}>
    <span>{index} / {label}</span><svg viewBox="0 0 160 64" fill="none" aria-hidden="true"><path d="M1 9h88c24 0 36 13 36 34v11m-10-11 10 11 11-11" stroke="currentColor" strokeWidth="1.3" /></svg><span>Terus jelajahi ↓</span>
  </a>;
}

function BuilderComposition() {
  return (
    <figure
      className={styles.composition}
      aria-label="Dari ide menjadi produk: tulisan, antarmuka, dan sistem"
    >
      <div className={styles.compositionAxis} aria-hidden="true" />
      <div className={styles.orb} aria-hidden="true">
        <div className={styles.orbBody} />
        <span className={styles.orbitOne}>
          <i />
        </span>
        <span className={styles.orbitTwo}>
          <i />
        </span>
      </div>
      <span className={styles.compositionIndex}>CATATAN PROSES / 01</span>
      <div className={styles.ideaSheet}>
        <span>Berawal dari ide kecil.</span>
        <DynamicNote />
        <div aria-hidden="true">01 / Mulai sederhana</div>
      </div>
      <div className={styles.architecture}>
        <span>Arsitektur produk</span>
        <div>
          <i>Ide</i>
          <b>→</b>
          <i>Antarmuka</i>
          <b>→</b>
          <i>Sistem</i>
        </div>
        <code>bangun → uji → pelajari</code>
      </div>
      <div className={styles.writingFragment}>
        <span>CHIKKI / EKSPLORASI PRODUK</span>
        <p>
          Ruang untuk cerita.
          <br />
          Tempat untuk terhubung.
        </p>
        <div aria-hidden="true" />
        <small>Menulis · Membaca · Bertumbuh</small>
      </div>
      <figcaption>Ide, karya, dan sistem yang menghubungkannya.</figcaption>
    </figure>
  );
}
const capabilities = [
  [
    "AI-Assisted Product Development",
    "Dari ide dan strategi, hingga produk yang dapat digunakan.",
  ],
  [
    "Web & MVP Development",
    "Membangun produk digital dengan tujuan dan lingkup yang jelas.",
  ],
  [
    "AI Workflow & Automation",
    "Sistem praktis untuk membantu pekerjaan sehari-hari.",
  ],
  [
    "Product Strategy",
    "Merumuskan masalah, menguji ide, dan menentukan langkah berikutnya.",
  ],
];
async function RecentArticles({ posts }: { posts: Promise<BlogCardItem[]> }) {
  const articles = await posts;
  return <>{articles.slice(0, 3).map((post) => (
    <Link key={post.metadata.slug} href={`/blog/${post.metadata.slug}`} className={styles.articleRow}>
      <span className={styles.eyebrow}>{post.metadata.category || "Artikel"}</span>
      <h4>{post.metadata.title}</h4>
      <div><time dateTime={post.metadata.date}>{new Date(post.metadata.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</time>
        {post.metadata.readingTime && <span>{post.metadata.readingTime} menit baca</span>}<span aria-hidden="true">↗</span>
      </div>
    </Link>
  ))}{articles.length === 0 && <p>Artikel akan tampil di sini setelah diterbitkan.</p>}</>;
}
function ArticlePlaceholder() {
  return <div className={styles.articlePlaceholder} role="status" aria-label="Memuat artikel terbaru">
    {[0, 1, 2].map(i => <div key={i} aria-hidden="true"><i /><i /><i /></div>)}
  </div>;
}
export function HomeView({ posts }: { posts: Promise<BlogCardItem[]> }) {
  return (
    <HomeExperience>
      <header className={`${styles.section} ${styles.hero}`}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow + " " + styles.heroRole}>
                AI-Assisted Product Engineer &amp; Digital Builder
              </p>
              <h1>
                Belajar, berkarya,
                <br className={styles.desktopBreak} /> dan membangun peluang di
                dunia digital.
              </h1>
              <p className={styles.heroCopy}>
                Saya Khadafi, product engineer dan kreator. Di sini saya
                membagikan produk, sumber daya, dan perjalanan membangun karier
                serta bisnis digital dengan bantuan AI.
              </p>
              <div className={styles.actions}>
                <Link href="#intent" className={styles.primary}>
                  Jelajahi Website <span aria-hidden="true">↗</span>
                </Link>
                <Link href="/about" className={styles.textLink}>
                  Kenali Saya <span aria-hidden="true">→</span>
                </Link>
              </div>
              <p className={styles.heroWhisper}>
                Terus belajar. Terus berkarya.
              </p>
            </div>
            <BuilderComposition />
          </div>
          <div className={styles.heroFoot}>
            <span>Builder independen / Indonesia</span>
            <a href="#intent">
              Temukan langkahmu <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </header>
      <SectionBridge label="Temukan arahmu" href="#intent" index="01" />
      <section
        id="intent"
        className={`${styles.section} ${styles.intent}`}
        aria-labelledby="intent-title"
        data-reveal="line"
      >
        <div className={styles.container}>
          <h2 id="intent-title">Mulai dari yang kamu butuhkan.</h2>
          <div className={styles.intentRail}>
            {[
              ["Belajar", "Bekal untuk langkah berikutnya.", "#knowledge"],
              [
                "Jelajahi Produk",
                "Kenali karya dan produk digital.",
                "#featured-work",
              ],
              [
                "Temukan Peluang",
                "Bangun jalan karier mandirimu.",
                "/freelance",
              ],
            ].map(([label, title, href], i) => (
              <Link href={href} key={label} className={styles.intentItem}>
                <span className={styles.number}>0{i + 1}</span>
                <span className={styles.eyebrow}>{label}</span>
                <strong>{title}</strong>
                <span className={styles.railArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SectionBridge label="Karya & eksperimen" href="#featured-work" index="02" />
      <section
        id="featured-work"
        className={`${styles.section} ${styles.featured}`}
        aria-labelledby="featured-title"
        data-reveal="heading"
      >
        <div className={styles.container}>
          <span id="produk" className={styles.anchor} />
          <span id="selected-work" className={styles.anchor} />
          <span id="work" className={styles.anchor} />
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>01 / Produk &amp; proyek pilihan</p>
            <h2 id="featured-title">
              Ide yang terus
              <br />
              <em>menemukan bentuknya.</em>
            </h2>
          </div>
          <div className={styles.flagship}>
            <ChikkiPreview />
            <div className={styles.flagshipCopy}>
              <p className={styles.eyebrow}>
                Produk pilihan / Terus dikembangkan
              </p>
              <h3>Chikki</h3>
              <p className={styles.productSubtitle}>
                Immersive Writing Network
              </p>
              <p>
                Platform menulis yang mengeksplorasi hubungan lebih dekat antara
                penulis, pembaca, dan peluang berkarya.
              </p>
              <p className={styles.disciplines}>
                Strategi produk · UX · Full-stack · Infrastruktur
              </p>
              <a
                href="https://chikki.id"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.textLink}
              >
                Jelajahi Chikki <span aria-hidden="true">↗</span>
              </a>
              <span className={styles.buildingNote}>
                Sudah dapat dijelajahi. Pengalaman membaca dan ruang kreator
                terus dikembangkan.
              </span>
            </div>
          </div>
          <div className={styles.projectRows}>
            {[
              [
                "Produk Digital",
                "Jelajahi katalog; harga dan ketersediaan ditampilkan pada tiap produk.",
                "/products",
              ],
              [
                "Freelance Journey Hub",
                "Tersedia · Panduan, direktori platform, dan lowongan individual.",
                "/freelance",
              ],
              [
                "Khadafi Business OS",
                "Terus dikembangkan · Rumah untuk karya, sistem, dan ide saya.",
                "/about",
              ],
              [
                "HCFTL",
                "Eksplorasi · Eksperimen teknologi yang berpusat pada manusia.",
                "/lab",
              ],
            ].map(([name, description, href], i) => (
              <Link href={href} key={name}>
                <span className={styles.number}>0{i + 2}</span>
                <div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SectionBridge label="Peluang baru" href="#freelance-home" index="03" />
      <section
        id="freelance-home"
        className={`${styles.section} ${styles.freelance}`}
        aria-labelledby="freelance-preview-title"
        data-reveal="soft"
      >
        <div className={`${styles.container} ${styles.freelanceGrid}`}>
          <div>
            <p className={styles.eyebrow}>02 / Freelance Journey Hub</p>
            <h2 id="freelance-preview-title">
              Bangun karier.
              <br />
              <em>Tentukan jalanmu.</em>
            </h2>
            <p>
              Bekal praktis untuk memulai dan mengembangkan karier mandiri.
              Pelajari dasarnya, kenali platformnya, lalu temukan peluang yang
              sesuai.
            </p>
            <Link href="/freelance" className={styles.textLink}>
              Jelajahi Freelance Hub <span aria-hidden="true">→</span>
            </Link>
            <div className={styles.freelanceLinks}>
              {[
                [
                  "01",
                  "Panduan belajar",
                  "/freelance/tools/mulai-freelance-dari-nol",
                ],
                ["02", "Direktori platform", "/freelance/direktori"],
                ["03", "Lowongan individual", "/freelance/jobs"],
              ].map(([num, label, href]) => (
                <Link href={href} key={href}>
                  <span>{num}</span>
                  {label}
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.atlasPreview}>
            <WorkAtlas />
          </div>
        </div>
      </section>
      <SectionBridge label="Bekal untuk bertumbuh" href="#knowledge" index="04" />
      <section
        id="knowledge"
        className={`${styles.section} ${styles.knowledge}`}
        aria-labelledby="knowledge-title"
        data-reveal="line"
      >
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>03 / Sumber daya &amp; artikel</p>
            <h2 id="knowledge-title">
              Belajar sesuatu.
              <br />
              <em>Jadikan berguna.</em>
            </h2>
          </div>
          <div className={styles.knowledgeGrid}>
            <div>
              <h3 className={styles.columnTitle}>Sumber daya pilihan</h3>
              <div className={styles.resourceRows}>
                {SIGNATURE_SYSTEMS.map((system) => (
                  <Link
                    key={system.id}
                    href={`/resources/${system.primaryResourceSlug}`}
                  >
                    <span>{system.num}</span>
                    <strong>{system.name}</strong>
                    <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
              <Link href="/resources" className={styles.textLink}>
                Semua sumber daya <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className={styles.articleColumn}>
              <h3 className={styles.columnTitle}>
                Terbaru dari The Digital Grimoire
              </h3>
              <Suspense fallback={<ArticlePlaceholder />}><RecentArticles posts={posts} /></Suspense>
              <Link href="/blog" className={styles.textLink}>
                Baca semua artikel <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <SectionBridge label="Di balik karya" href="#about" index="05" />
      <section
        id="about"
        className={`${styles.section} ${styles.about}`}
        aria-labelledby="about-title"
        data-reveal="soft"
      >
        <div className={styles.container}>
          <div className={styles.aboutGrid}>
            <figure className={styles.portrait}>
              <Image
                src="/images/experience/portrait-v1.webp"
                unoptimized
                alt="Khadafi, digital builder"
                fill
                sizes="(max-width: 600px) 80vw, 360px"
              />
              <span className={styles.portraitLight} aria-hidden="true" />
              <span className={styles.portraitSignature}>K.</span>
              <figcaption>Khadafi / Berkarya, sambil terus belajar.</figcaption>
            </figure>
            <div>
              <p className={styles.eyebrow}>04 / Di balik karya</p>
              <h2 id="about-title">
                Saya Khadafi.
                <br />
                <em>Membangun hal yang berguna.</em>
              </h2>
              <p>
                Saya bekerja di persimpangan strategi produk, desain, dan
                rekayasa. Saya senang mengubah ide yang rumit menjadi pengalaman
                digital yang jelas dan bermanfaat.
              </p>
              <Link href="/about" className={styles.textLink}>
                Lebih dekat dengan saya <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div id="capabilities" className={styles.aboutCapabilities}>
            <p className={styles.eyebrow}>Dari ide hingga menjadi nyata</p>
            <ol className={styles.capabilityRows}>
              {capabilities.map(([title, description], i) => (
                <li key={title}>
                  <span className={styles.number}>0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/about#jasa" className={styles.textLink}>
              Lihat kemampuan &amp; jasa <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <CredentialsGallery />
        </div>
      </section>
      <SectionBridge label="Tetap terhubung" href="#newsletter" index="06" />
      <section
        id="newsletter"
        className={`${styles.section} ${styles.conversion}`}
        aria-labelledby="newsletter-title"
        data-reveal="line"
      >
        <div className={styles.container}>
          <NewsletterSection />
          <div className={styles.finalCta}>
            <p className={styles.eyebrow}>Langkah berikutnya, pilihanmu.</p>
            <h2>
              Temukan hal yang berguna
              <br />
              <em>untuk langkahmu berikutnya.</em>
            </h2>
            <p>
              Jelajahi produk, panduan, dan sumber daya yang sedang saya bangun.
              <br />
              Butuh bantuan? Temui saya di Threads @khdfii9.
            </p>
            <div className={styles.actions}>
              <Link href="#intent" className={styles.primary}>
                Jelajahi Website <span aria-hidden="true">↑</span>
              </Link>
              <a
                href="https://threads.com/khdfii9"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.textLink}
              >
                Hubungi Support <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </HomeExperience>
  );
}
