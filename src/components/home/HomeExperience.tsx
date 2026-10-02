"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ProjectInquiryModal } from "@/components/shared/ProjectInquiryModal";
import styles from "./editorial-home.module.css";
const InquiryContext = createContext<() => void>(() => {});
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
  const [inquiryOpen, setInquiryOpen] = useState(false);
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
    <InquiryContext.Provider value={() => setInquiryOpen(true)}>
      <div ref={root} className={styles.home} data-theme={theme}>
        <button
          type="button"
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "Light mode" : "Dark mode"}
          <span aria-hidden="true">{theme === "dark" ? "◐" : "◑"}</span>
        </button>
        {children}
        <ProjectInquiryModal
          isOpen={inquiryOpen}
          onClose={() => setInquiryOpen(false)}
        />
      </div>
    </InquiryContext.Provider>
  );
}
export function InquiryButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const open = useContext(InquiryContext);
  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}
