"use client";
import Script from "next/script";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  ANALYTICS_CONSENT_KEY,
  analyticsConsent,
  isAnalyticsPath,
  safePage,
} from "@/lib/analytics-policy.mjs";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
const subscribe = (callback: () => void) => {
  window.addEventListener("analytics-consent-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("analytics-consent-change", callback);
    window.removeEventListener("storage", callback);
  };
};
function decided() {
  try {
    return localStorage.getItem(ANALYTICS_CONSENT_KEY) !== null;
  } catch {
    return false;
  }
}
export function PublicAnalytics() {
  const path = usePathname() || "/";
  const allowed = useSyncExternalStore(
    subscribe,
    analyticsConsent,
    () => false,
  );
  const hasChoice = useSyncExternalStore(subscribe, decided, () => true);
  const productionHost = useSyncExternalStore(
    subscribe,
    () =>
      location.hostname === "khadafidaffa.com" ||
      (process.env.NEXT_PUBLIC_GA_DEBUG === "true" &&
        ["localhost", "127.0.0.1"].includes(location.hostname)),
    () => false,
  );
  const [ready, setReady] = useState(false);
  const last = useRef("");
  const enabled =
    process.env.NEXT_PUBLIC_GA_MANUAL_EVENTS_READY === "true" &&
    productionHost &&
    allowed &&
    isAnalyticsPath(path) &&
    /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID);
  useEffect(() => {
    const state = window as unknown as Record<string, unknown>;
    state[`ga-disable-${GA_MEASUREMENT_ID}`] = !enabled;
    if (!enabled && window.khadafiGaReady) {
      window.khadafiGaReady = false;
      window.location.reload();
    }
    // Use full-document transitions into sensitive routes once any Google code has executed.
    function navigate(event: MouseEvent) {
      const anchor = (event.target as Element)?.closest?.("a");
      if (!anchor || !window.khadafiGaReady) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin === location.origin && !isAnalyticsPath(url.pathname)) {
        event.preventDefault();
        event.stopPropagation();
        location.assign(url.href);
      }
    }
    document.addEventListener("click", navigate, true);
    return () => document.removeEventListener("click", navigate, true);
  }, [enabled]);
  useEffect(() => {
    if (!enabled || !ready || last.current === path) return;
    const location = safePage(path);
    if (!location) return;
    last.current = path;
    // No document.title: visitor-entered content must never become an analytics parameter.
    window.gtag?.("event", "page_view", {
      page_location: location,
      page_title: path === "/" ? "Khadafi" : path.split("/")[1],
      page_referrer: "",
    });
  }, [path, ready, enabled]);
  function choose(granted: boolean) {
    try {
      localStorage.setItem(
        ANALYTICS_CONSENT_KEY,
        granted ? "granted" : "denied",
      );
      window.dispatchEvent(new Event("analytics-consent-change"));
    } catch {
      /* Storage unavailable: tracking stays disabled. */
    }
  }
  return (
    <>
      {enabled && (
        <Script
          id="khadafi-ga4"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
          onReady={() => {
            if (!analyticsConsent() || !isAnalyticsPath(location.pathname))
              return;
            if (!window.khadafiGaReady) {
              window.dataLayer = window.dataLayer || [];
              window.gtag = (...args: unknown[]) => {
                window.dataLayer!.push(args);
              };
              window.gtag("consent", "default", {
                analytics_storage: "granted",
                ad_storage: "denied",
                ad_user_data: "denied",
                ad_personalization: "denied",
              });
              window.gtag("js", new Date());
              window.gtag("config", GA_MEASUREMENT_ID, {
                send_page_view: false,
                debug_mode: process.env.NEXT_PUBLIC_GA_DEBUG === "true",
                allow_google_signals: false,
                allow_ad_personalization_signals: false,
                page_location: safePage(location.pathname),
                page_referrer: "",
              });
              window.khadafiGaReady = true;
            }
            setReady(true);
          }}
        />
      )}
      {!hasChoice && isAnalyticsPath(path) && (
        <aside className="analytics-consent" aria-label="Preferensi analytics">
          <div>
            <strong>Bantu kami memahami apa yang berguna.</strong>
            <p>
              Izinkan analytics opsional untuk mengukur penggunaan halaman
              publik. <Link href="/cookies">Atur preferensi</Link>
            </p>
          </div>
          <button type="button" onClick={() => choose(false)}>
            Tanpa analytics
          </button>
          <button type="button" onClick={() => choose(true)}>
            Izinkan analytics
          </button>
        </aside>
      )}
    </>
  );
}
