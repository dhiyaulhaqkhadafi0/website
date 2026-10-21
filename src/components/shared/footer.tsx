import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PUBLIC_FOOTER_GROUPS } from "@/content/public-navigation";
import { SOCIAL_LINKS } from "@/content/social-links";
import { SocialIcon } from "./SocialIcon";
import { BackToTop } from "./BackToTop";
import { LEGAL_LINKS } from "@/content/legal";
import s from "./footer.module.css";
export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.container}>
        <div className={s.topline}>
          <span>Terus belajar. Terus berkarya.</span>
          <a href="mailto:daffadhiyaulhaqkhadafi@gmail.com">
            Mari terhubung <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className={s.main}>
          <div className={s.identity}>
            <Link href="/" className={s.brand} aria-label="Khadafi — Beranda">
              <Image
                src="/images/experience/brand-v1.webp"
                unoptimized
                alt=""
                width={66}
                height={44}
              />
              <span>
                KHADAFI
                <small>
                  AI-Assisted Product Engineer
                  <br />
                  &amp; Digital Builder
                </small>
              </span>
            </Link>
            <p>
              Rumah untuk ide, karya, dan langkah berikutnya. Membangun produk
              digital dan berbagi bekal untuk tumbuh bersama.
            </p>
            <nav className={s.socials} aria-label="Media sosial Khadafi">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.name} Khadafi (buka tab baru)`}
                  title={link.name}
                >
                  <SocialIcon name={link.icon} />
                </a>
              ))}
            </nav>
            <a
              className={s.email}
              href="mailto:daffadhiyaulhaqkhadafi@gmail.com"
            >
              daffadhiyaulhaqkhadafi@gmail.com
            </a>
          </div>
          <nav className={s.groups} aria-label="Jelajahi website">
            {PUBLIC_FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h2>{group.title}</h2>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}>
                        <span>
                          {link.label}
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </span>
                        <small>{link.desc}</small>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className={s.bottom}>
          <p>© {new Date().getFullYear()} Daffa Dhiyaulhaq Khadafi.</p>
          <nav aria-label="Informasi legal">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <span className={s.location}>
            <i aria-hidden="true" />
            Builder independen · Indonesia
          </span>
        </div>
      </div>
      <BackToTop />
    </footer>
  );
}
