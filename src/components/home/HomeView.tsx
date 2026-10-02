import Image from "next/image";
import Link from "next/link";
import type { BlogCardItem } from "@/lib/mdx";
import { SIGNATURE_SYSTEMS } from "@/content/resources-data";
import { WorkAtlas } from "@/components/freelance/WorkAtlas";
import { HomeExperience, InquiryButton } from "./HomeExperience";
import { CredentialsGallery } from "./CredentialsGallery";
import { NewsletterSection } from "./NewsletterSection";
import styles from "./editorial-home.module.css";

function BuilderComposition() {
  return (
    <figure
      className={styles.composition}
      aria-label="Komposisi proses builder: ide, tulisan, antarmuka, dan arsitektur"
    >
      <div className={styles.compositionAxis} aria-hidden="true" />
      <span className={styles.compositionIndex}>FIELD STUDY / 01</span>
      <div className={styles.ideaSheet}>
        <span>From a small idea.</span>
        <p>
          Make something
          <br />
          <em>worth using.</em>
        </p>
        <div aria-hidden="true">01 / Start small</div>
      </div>
      <div className={styles.architecture}>
        <span>Product architecture</span>
        <div>
          <i>Idea</i>
          <b>→</b>
          <i>Interface</i>
          <b>→</b>
          <i>System</i>
        </div>
        <code>build → test → learn</code>
      </div>
      <div className={styles.writingFragment}>
        <span>CHIKKI / PRODUCT EXPLORATION</span>
        <p>
          A space for words.
          <br />A place for people.
        </p>
        <div aria-hidden="true" />
        <small>Writing · Reading · Possibility</small>
      </div>
      <figcaption>Products, words, and the systems between them.</figcaption>
    </figure>
  );
}
const capabilities = [
  [
    "AI-Assisted Product Development",
    "Idea → strategy → UX → build → production",
  ],
  ["Web & MVP Development", "Useful digital products, built with clear scope."],
  [
    "AI Workflow & Automation",
    "Practical systems for the work you do every day.",
  ],
  ["Product Strategy", "Turn a vague idea into a product worth building."],
];
export function HomeView({ posts }: { posts: BlogCardItem[] }) {
  return (
    <HomeExperience>
      <header className={`${styles.section} ${styles.hero}`}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow}>AI-assisted product engineer</p>
              <h1>
                I build digital products,
                <br className={styles.desktopBreak} /> AI systems &amp;
                independent
                <br className={styles.desktopBreak} /> internet businesses.
              </h1>
              <p className={styles.heroCopy}>
                I turn ideas into useful products —
                <br className={styles.desktopBreak} /> from strategy and UX to
                production.
              </p>
              <div className={styles.actions}>
                <Link href="#featured-work" className={styles.primary}>
                  Explore My Work <span aria-hidden="true">↗</span>
                </Link>
                <InquiryButton className={styles.textLink}>
                  Start a Project <span aria-hidden="true">→</span>
                </InquiryButton>
              </div>
            </div>
            <BuilderComposition />
          </div>
          <div className={styles.heroFoot}>
            <span>Independent builder / Indonesia</span>
            <a href="#intent">
              Find your way <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </header>
      <section
        id="intent"
        className={`${styles.section} ${styles.intent}`}
        aria-labelledby="intent-title"
        data-reveal
      >
        <div className={styles.container}>
          <h2 id="intent-title">What brings you here?</h2>
          <div className={styles.intentRail}>
            <InquiryButton className={styles.intentItem}>
              <span className={styles.number}>01</span>
              <span className={styles.eyebrow}>Work with me</span>
              <strong>Build something together.</strong>
              <span className={styles.railArrow} aria-hidden="true">
                →
              </span>
            </InquiryButton>
            <a href="#knowledge" className={styles.intentItem}>
              <span className={styles.number}>02</span>
              <span className={styles.eyebrow}>Learn</span>
              <strong>Resources, systems &amp; guides.</strong>
              <span className={styles.railArrow} aria-hidden="true">
                →
              </span>
            </a>
            <a href="#featured-work" className={styles.intentItem}>
              <span className={styles.number}>03</span>
              <span className={styles.eyebrow}>Explore</span>
              <strong>Products I&apos;m building.</strong>
              <span className={styles.railArrow} aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>
      </section>
      <section
        id="featured-work"
        className={`${styles.section} ${styles.featured}`}
        aria-labelledby="featured-title"
        data-reveal
      >
        <div className={styles.container}>
          <span id="produk" className={styles.anchor} />
          <span id="selected-work" className={styles.anchor} />
          <span id="work" className={styles.anchor} />
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>01 / Featured work</p>
            <h2 id="featured-title">A few things taking shape.</h2>
          </div>
          <div className={styles.flagship}>
            <figure
              className={styles.chikkiVisual}
              aria-label="Chikki product study: ruang menulis dan hubungan antara penulis dan pembaca"
            >
              <div className={styles.productMasthead}>
                CHIKKI<span>Product study</span>
              </div>
              <div className={styles.chikkiPage}>
                <span>THE SPACE BETWEEN</span>
                <p>
                  An idea.
                  <br />A story.
                  <br />
                  <em>A connection.</em>
                </p>
                <div className={styles.proseLines} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <span className={styles.pageNumber}>01</span>
              </div>
              <figcaption>
                Writer <span aria-hidden="true">—</span> Reader{" "}
                <span aria-hidden="true">—</span> Opportunity
              </figcaption>
            </figure>
            <div className={styles.flagshipCopy}>
              <p className={styles.eyebrow}>Featured product / Building</p>
              <h3>Chikki</h3>
              <p className={styles.productSubtitle}>
                Immersive Writing Network
              </p>
              <p>
                A writing platform exploring a better relationship between
                writers, readers, and creative opportunities.
              </p>
              <p className={styles.disciplines}>
                Product Strategy · UX · Full-stack · Infrastructure
              </p>
              <span className={styles.buildingNote}>
                Public destination coming later.
              </span>
            </div>
          </div>
          <div className={styles.projectRows}>
            {[
              [
                "Freelance Journey Hub",
                "A field guide to independent work.",
                "/freelance",
              ],
              [
                "Khadafi Business OS",
                "This home for my work, systems, and ideas.",
                "/about",
              ],
              ["HCFTL", "Experiments in human-centered technology.", "/lab"],
            ].map(([name, description, href], i) => (
              <Link key={name} href={href}>
                <span className={styles.number}>0{i + 2}</span>
                <div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
          <div className={styles.ledger}>
            <p className={styles.eyebrow}>Currently building</p>
            <dl>
              <div>
                <dt>Chikki</dt>
                <dd>Building</dd>
              </div>
              <div>
                <dt>Freelance Hub</dt>
                <dd>Improving</dd>
              </div>
              <div>
                <dt>Business OS</dt>
                <dd>Building</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      <section
        id="capabilities"
        className={`${styles.section} ${styles.capabilities}`}
        aria-labelledby="capabilities-title"
        data-reveal
      >
        <div className={`${styles.container} ${styles.capabilityLayout}`}>
          <div>
            <p className={styles.eyebrow}>02 / Capabilities</p>
            <h2 id="capabilities-title">
              From idea
              <br />
              to something real.
            </h2>
            <InquiryButton className={styles.textLink}>
              Let&apos;s build together <span aria-hidden="true">→</span>
            </InquiryButton>
          </div>
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
        </div>
      </section>
      <section
        className={`${styles.section} ${styles.freelance}`}
        aria-labelledby="freelance-preview-title"
        data-reveal
      >
        <div className={`${styles.container} ${styles.freelanceGrid}`}>
          <div>
            <p className={styles.eyebrow}>03 / Independent work</p>
            <h2 id="freelance-preview-title">
              Building a career
              <br />
              <em>without an office.</em>
            </h2>
            <p>
              Notes, opportunities, and useful systems from my journey building
              an independent career.
            </p>
            <Link href="/freelance" className={styles.textLink}>
              Enter Freelance Journey Hub <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className={styles.atlasPreview}>
            <WorkAtlas />
          </div>
        </div>
      </section>
      <section
        id="knowledge"
        className={`${styles.section} ${styles.knowledge}`}
        aria-labelledby="knowledge-title"
        data-reveal
      >
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>04 / Knowledge</p>
            <h2 id="knowledge-title">Systems worth sharing.</h2>
          </div>
          <div className={styles.knowledgeGrid}>
            <div>
              <h3 className={styles.columnTitle}>Resources</h3>
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
                Explore all resources <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className={styles.articleColumn}>
              <h3 className={styles.columnTitle}>
                Latest from The Digital Grimoire
              </h3>
              {posts.slice(0, 3).map((post) => (
                <Link
                  key={post.metadata.slug}
                  href={`/blog/${post.metadata.slug}`}
                  className={styles.articleRow}
                >
                  <span className={styles.eyebrow}>
                    {post.metadata.category || "Article"}
                  </span>
                  <h4>{post.metadata.title}</h4>
                  <div>
                    <time dateTime={post.metadata.date}>
                      {new Date(post.metadata.date).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          timeZone: "UTC",
                        },
                      )}
                    </time>
                    {post.metadata.readingTime && (
                      <span>{post.metadata.readingTime} min read</span>
                    )}
                    <span aria-hidden="true">↗</span>
                  </div>
                </Link>
              ))}
              {posts.length === 0 && (
                <p>New field notes will appear here when published.</p>
              )}
              <Link href="/blog" className={styles.textLink}>
                Read the journal <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section
        id="about"
        className={`${styles.section} ${styles.about}`}
        aria-labelledby="about-title"
        data-reveal
      >
        <div className={styles.container}>
          <div className={styles.aboutGrid}>
            <figure className={styles.portrait}>
              <Image
                src="/assets/my-profile.jpg"
                alt="Daffa Dhiyaulhaq Khadafi"
                fill
                sizes="(max-width: 600px) 80vw, 360px"
              />
              <figcaption>Khadafi / Builder, always learning.</figcaption>
            </figure>
            <div>
              <p className={styles.eyebrow}>05 / The person behind the work</p>
              <h2 id="about-title">
                I&apos;m Khadafi.
                <br />
                <em>I build things on the internet.</em>
              </h2>
              <p>
                An independent builder working across product strategy, design,
                and engineering. I like turning complex ideas into useful,
                thoughtful things.
              </p>
              <Link href="/about" className={styles.textLink}>
                More About Me <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <CredentialsGallery />
        </div>
      </section>
      <section
        id="newsletter"
        className={`${styles.section} ${styles.conversion}`}
        aria-labelledby="newsletter-title"
        data-reveal
      >
        <div className={styles.container}>
          <NewsletterSection />
          <div className={styles.finalCta}>
            <p className={styles.eyebrow}>A good next step</p>
            <h2>
              Have something
              <br />
              <em>worth building?</em>
            </h2>
            <p>Let&apos;s turn your idea into a working product.</p>
            <div className={styles.actions}>
              <InquiryButton className={styles.primary}>
                Start a Project <span aria-hidden="true">→</span>
              </InquiryButton>
              <a href="#featured-work" className={styles.textLink}>
                Explore My Work <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </HomeExperience>
  );
}
