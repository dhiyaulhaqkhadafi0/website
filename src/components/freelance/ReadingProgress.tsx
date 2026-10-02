"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import styles from "./reading-progress.module.css";

export function ReadingProgress({ startId, endId, titleId = "guide-title", label = "Progres membaca panduan" }: { startId: string; endId: string; titleId?: string; label?: string }) {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const start = document.getElementById(startId);
    const end = document.getElementById(endId);
    if (!start || !end) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const startY = start.getBoundingClientRect().top + window.scrollY;
      const endY = end.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
      const distance = Math.max(1, endY - startY);
      setProgress(Math.round(Math.min(1, Math.max(0, (window.scrollY - startY) / distance)) * 100));
      setShowTop(window.scrollY > 400);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [startId, endId]);

  const goToTop = () => {
    document.getElementById(titleId)?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return <>
    <div className={styles.track} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
      <div className={styles.fill} style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
    {showTop && <button type="button" className={styles.backTop} onClick={goToTop} aria-label="Kembali ke atas" title={`Kembali ke atas · ${progress}% dibaca`}>
      <svg className={styles.ring} viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <circle className={styles.ringTrack} cx="28" cy="28" r="24" />
        <circle className={styles.ringFill} cx="28" cy="28" r="24" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - progress} />
      </svg>
      <ArrowUp size={20} strokeWidth={1.6} aria-hidden="true" />
      <span className={styles.tooltip} aria-hidden="true">Kembali ke atas <span>{progress}%</span></span>
    </button>}
  </>;
}
