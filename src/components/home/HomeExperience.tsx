"use client";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import styles from "./editorial-home.module.css";
const subscribe = (callback: () => void) => {
  window.addEventListener("home-theme-change", callback);
  return () => window.removeEventListener("home-theme-change", callback);
};
const getTheme = () => {
  try {
    return localStorage.getItem("khadafi-home-theme") === "light"
      ? "light"
      : "dark";
  } catch {
    return "dark";
  }
};
export function HomeExperience({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark");
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const visibility = () => {
      node.dataset.motionPaused = String(document.hidden);
    };
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.setAttribute("data-arrived", "true");
            observer.unobserve(e.target);
          }
      },
      { threshold: 0.08 },
    );
    if (!preference.matches)
      node
        .querySelectorAll("[data-reveal]")
        .forEach((e) => observer.observe(e));
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  function toggleTheme() {
    try {
      localStorage.setItem(
        "khadafi-home-theme",
        theme === "dark" ? "light" : "dark",
      );
    } catch {
      return;
    }
    window.dispatchEvent(new Event("home-theme-change"));
  }
  return (
    <div ref={root} className={styles.home} data-theme={theme}>
      <button
        type="button"
        className={styles.themeToggle}
        onClick={toggleTheme}
        aria-label={
          theme === "dark" ? "Gunakan tema terang" : "Gunakan tema gelap"
        }
      >
        {theme === "dark" ? "Tema terang" : "Tema gelap"}
        <span aria-hidden="true">{theme === "dark" ? "◐" : "◑"}</span>
      </button>
      {children}
    </div>
  );
}
const notes = [
  "Buat sesuatu yang berguna.",
  "Belajar. Bangun. Perbaiki.",
  "Ide kecil, kemungkinan besar.",
  "Terus ingin tahu. Terus berkarya.",
];
export function DynamicNote() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;
    function schedule() {
      clearTimeout(timer);
      if (!paused && !interacting && !document.hidden && !preference.matches)
        timer = setTimeout(() => setIndex((i) => (i + 1) % notes.length), 6000);
    }
    schedule();
    document.addEventListener("visibilitychange", schedule);
    preference.addEventListener("change", schedule);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", schedule);
      preference.removeEventListener("change", schedule);
    };
  }, [index, paused, interacting]);
  return (
    <div
      className={styles.dynamicNote}
      data-kind="paper"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setInteracting(false);
      }}
    >
      <span aria-label={notes.join(" ")}>
        <span key={index} className={styles.dynamicWord} aria-hidden="true">
          {notes[index]}
        </span>
      </span>
      <button
        type="button"
        aria-label={
          paused ? "Lanjutkan animasi catatan" : "Jeda animasi catatan"
        }
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? "▷" : "Ⅱ"}
      </button>
    </div>
  );
}
