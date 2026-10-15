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
    if (
      !root.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.setAttribute("data-arrived", "true");
            observer.unobserve(e.target);
          }
      },
      { threshold: 0.06 },
    );
    root.current
      .querySelectorAll("[data-reveal]")
      .forEach((e) => observer.observe(e));
    return () => observer.disconnect();
  }, []);
  const toggleTheme = () => {
    try {
      localStorage.setItem(
        "khadafi-home-theme",
        theme === "dark" ? "light" : "dark",
      );
    } catch {
      return;
    }
    window.dispatchEvent(new Event("home-theme-change"));
  };
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
  "Mulai dari rasa ingin tahu.",
  "Ubah ide menjadi karya.",
  "Buka peluang berikutnya.",
];
export function DynamicNote() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (paused || preference.matches || index >= notes.length - 1) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      clearTimeout(timer);
      if (!document.hidden && !preference.matches)
        timer = setTimeout(() => setIndex((i) => i + 1), 4200);
    };
    schedule();
    document.addEventListener("visibilitychange", schedule);
    preference.addEventListener("change", schedule);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", schedule);
      preference.removeEventListener("change", schedule);
    };
  }, [index, paused]);
  return (
    <div className={styles.dynamicNote}>
      <span aria-label="Mulai dari rasa ingin tahu. Ubah ide menjadi karya. Buka peluang berikutnya.">
        <span key={index} className={styles.dynamicWord} aria-hidden="true">
          {notes[index]}
        </span>
      </span>
      {index < notes.length - 1 && (
        <button
          type="button"
          aria-label={paused ? "Lanjutkan animasi kata" : "Jeda animasi kata"}
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? "▷" : "Ⅱ"}
        </button>
      )}
    </div>
  );
}
