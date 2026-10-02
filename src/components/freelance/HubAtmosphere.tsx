"use client";
import { useEffect, useRef } from "react";
import styles from "./discovery.module.css";
export function HubAtmosphere() {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = cursorRef.current;
    const hub = cursor?.closest<HTMLElement>(`.${styles.hub}`);
    if (!cursor || !hub) return;
    const media = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let x = 0, y = 0;
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType === "touch") return;
      x = event.clientX; y = event.clientY;
      cursor.dataset.active = String(Boolean((event.target as Element).closest("a,button")));
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        cursor.style.opacity = "1";
        const rect = hub.getBoundingClientRect();
        hub.style.setProperty("--pointer-x", `${x / Math.max(1, rect.width) * 100}%`);
        hub.style.setProperty("--pointer-y", `${Math.max(0, y - rect.top) / rect.height * 100}%`);
      });
    };
    const hide = () => { cursor.style.opacity = "0"; };
    hub.addEventListener("pointermove", move, { passive: true });
    hub.addEventListener("pointerleave", hide);
    hub.addEventListener("keydown", hide);
    window.addEventListener("scroll", hide, { passive: true });
    media.addEventListener("change", hide);
    return () => { cancelAnimationFrame(frame); hub.removeEventListener("pointermove", move); hub.removeEventListener("pointerleave", hide); hub.removeEventListener("keydown", hide); window.removeEventListener("scroll", hide); media.removeEventListener("change", hide); };
  }, []);
  return <><div className={styles.ambient} aria-hidden="true" /><div ref={cursorRef} className={styles.cursor} aria-hidden="true" /></>;
}
