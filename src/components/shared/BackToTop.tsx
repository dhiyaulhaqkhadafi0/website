"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import styles from "./footer.module.css";
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const footer = document.querySelector("footer");
    const newsletter = document.getElementById("newsletter");
    const update = () => {
      const bottom = window.innerHeight;
      const top = newsletter?.getBoundingClientRect().top;
      const end = newsletter?.getBoundingClientRect().bottom;
      const formVisible =
        top !== undefined && end !== undefined && top < bottom && end > 0;
      setVisible(
        window.scrollY > bottom &&
          !formVisible &&
          (!footer || footer.getBoundingClientRect().top > bottom),
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return visible ? (
    <button
      type="button"
      className={styles.backToTop}
      aria-label="Kembali ke atas"
      onClick={() => {
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
        document
          .querySelector<HTMLAnchorElement>('header a[href="/"]')
          ?.focus({ preventScroll: true });
      }}
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  ) : null;
}
