import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import {
  LEGAL_LINKS,
  LEGAL_UPDATED,
  SUPPORT_EMAIL,
  type LegalSection,
} from "@/content/legal";
import s from "./legal.module.css";
export function LegalDocument({
  title,
  summary,
  path,
  sections,
  children,
  customSections = false,
}: {
  title: string;
  summary: string;
  path: string;
  sections: LegalSection[];
  children?: React.ReactNode;
  customSections?: boolean;
}) {
  return (
    <>
      <Navbar />
      <article className={s.document}>
        <div className={s.wrap}>
          <Link className={s.back} href="/">
            ← Kembali ke beranda
          </Link>
          <header className={s.header}>
            <p className={s.eyebrow}>Informasi &amp; kepercayaan</p>
            <h1>{title}</h1>
            <p className={s.summary}>{summary}</p>
            <p className={s.updated}>
              Diperbarui <time dateTime="2026-10-15">{LEGAL_UPDATED}</time>
            </p>
          </header>
          <nav className={s.related} aria-label="Halaman informasi">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={path === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className={s.layout}>
            <nav className={s.contents} aria-label="Daftar isi">
              <p>Dalam halaman ini</p>
              {sections.map((section, i) => (
                <a key={section.id} href={`#${section.id}`}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {section.title}
                </a>
              ))}
            </nav>
            <div className={s.body}>
              {children}
              {!customSections &&
                sections.map((section) => (
                  <section id={section.id} key={section.id}>
                    <h2>{section.title}</h2>
                    {section.paragraphs.map((text) => (
                      <p key={text}>{text}</p>
                    ))}
                  </section>
                ))}
              <section className={s.contact}>
                <p className={s.eyebrow}>Butuh penjelasan?</p>
                <h2>Mari bicarakan.</h2>
                <p>
                  Kirim pertanyaan tentang akun, data, atau penggunaan situs
                  melalui email bantuan.
                </p>
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL} ↗</a>
              </section>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
