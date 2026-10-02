"use client";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./directory.module.css";

export function DirectoryMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.setAttribute("data-arrived", "true"); observer.unobserve(entry.target);
      }
    }, { threshold: .08 });
    root.current.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return <div ref={root} className={styles.directory}>{children}</div>;
}
