"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import credentials from "@/content/credentials.json";
import styles from "./editorial-home.module.css";
type Credential = {
  title: string;
  image: string;
  link: string;
  issuer?: string;
  category?: string;
  pages?: string[];
};
const items: Credential[] = [
  ...credentials.certificates,
  ...credentials.badges,
];
function sourceLink(link: string) {
  if (link === "#") return null;
  try {
    const url = new URL(link.startsWith("https://") ? link : `https://${link}`);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
export function CredentialsGallery() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const current = selected === null ? null : items[selected];
  const pages = current?.pages ?? (current ? [current.image] : []);
  useEffect(() => {
    if (!open) return;
    const prior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prior;
    };
  }, [open]);
  useEffect(() => {
    if (open)
      dialog.current
        ?.querySelector<HTMLButtonElement>(
          selected === null
            ? '[aria-label="Close certifications"]'
            : "[data-viewer-back]",
        )
        ?.focus({ preventScroll: true });
  }, [open, selected]);
  const select = (index: number) => {
    setSelected(index);
    setPage(0);
    setZoom(1);
  };
  const close = () => dialog.current?.close();
  return (
    <div id="certifications" className={styles.credentials}>
      <div>
        <p className={styles.eyebrow}>Credentials &amp; foundations</p>
        <p>
          Google AI Professional · IBM Product Management
          <br />
          Business Analysis · Product Marketing
        </p>
      </div>
      <button
        className={styles.textLink}
        type="button"
        onClick={() => {
          setSelected(null);
          setOpen(true);
          dialog.current?.showModal();
        }}
      >
        View all certifications <span aria-hidden="true">→</span>
      </button>
      <dialog
        ref={dialog}
        className={styles.credentialDialog}
        aria-labelledby="credentials-title"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            const r = e.currentTarget.getBoundingClientRect();
            if (
              e.clientX < r.left ||
              e.clientX > r.right ||
              e.clientY < r.top ||
              e.clientY > r.bottom
            )
              close();
          }
        }}
        onKeyDown={(e) => {
          if (selected === null) return;
          if (e.key === "ArrowRight") {
            e.preventDefault();
            select((selected + 1) % items.length);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            select((selected - 1 + items.length) % items.length);
          }
        }}
      >
        <div className={styles.galleryHead}>
          <div>
            <p className={styles.eyebrow}>9 certificates / 13 badges</p>
            <h2 id="credentials-title">
              {current ? current.title : "Credentials & foundations"}
            </h2>
          </div>
          <button
            autoFocus
            type="button"
            onClick={close}
            aria-label="Close certifications"
          >
            ×
          </button>
        </div>
        {current ? (
          <div className={styles.viewer}>
            <div className={styles.viewerTools}>
              <button
                data-viewer-back
                type="button"
                onClick={() => setSelected(null)}
              >
                ← All credentials
              </button>
              <span>
                {selected! + 1} / {items.length}
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
                disabled={zoom === 1}
                aria-label="Zoom out certificate"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
                disabled={zoom === 2}
                aria-label="Zoom in certificate"
              >
                +
              </button>
              <button type="button" onClick={() => setZoom(1)}>
                Reset zoom
              </button>
            </div>
            <div className={styles.imageViewport}>
              <Image
                key={`${selected}-${page}`}
                src={encodeURI(pages[page])}
                alt={`${current.title}${pages.length > 1 ? ` — page ${page + 1}` : ""}`}
                width={1500}
                height={1100}
                unoptimized
                style={{
                  width: `${zoom * 100}%`,
                  maxWidth: "none",
                  height: "auto",
                }}
              />
            </div>
            {pages.length > 1 && (
              <div
                className={styles.pageControls}
                aria-label="Certificate pages"
              >
                {pages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-pressed={page === index}
                    onClick={() => {
                      setPage(index);
                      setZoom(1);
                    }}
                  >
                    Page {index + 1}
                  </button>
                ))}
              </div>
            )}
            <div className={styles.viewerFooter}>
              <button
                type="button"
                onClick={() =>
                  select((selected! - 1 + items.length) % items.length)
                }
              >
                ← Previous credential
              </button>
              <a
                href={encodeURI(pages[page])}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open original ↗
              </a>
              {sourceLink(current.link) && (
                <a
                  href={sourceLink(current.link)!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Credential source ↗
                </a>
              )}
              <button
                type="button"
                onClick={() => select((selected! + 1) % items.length)}
              >
                Next credential →
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.credentialGrid}>
            {items.map((item, index) => (
              <button
                key={`${item.title}-${index}`}
                type="button"
                aria-label={`Open credential ${index + 1}: ${item.title}`}
                onClick={() => select(index)}
              >
                <div>
                  <Image
                    src={encodeURI(item.image)}
                    alt=""
                    width={440}
                    height={320}
                    sizes="(max-width: 600px) 80vw, 300px"
                  />
                </div>
                <span>{item.issuer ?? "Digital badge"}</span>
                <strong>{item.title}</strong>
              </button>
            ))}
          </div>
        )}
      </dialog>
    </div>
  );
}
