"use client";
import { useState, useSyncExternalStore } from "react";
import s from "./legal.module.css";
export const TRANSLATION_CONSENT_KEY = "khadafi-translation-consent";
const subscribe = (cb: () => void) => {
  window.addEventListener("translation-consent-change", cb);
  return () => window.removeEventListener("translation-consent-change", cb);
};
const getConsent = () => {
  try {
    return localStorage.getItem(TRANSLATION_CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
};
export function CookiePreferences() {
  const allowed = useSyncExternalStore(subscribe, getConsent, () => false);
  const [message, setMessage] = useState("");
  function choose(granted: boolean) {
    try {
      localStorage.setItem(
        TRANSLATION_CONSENT_KEY,
        granted ? "granted" : "denied",
      );
      if (!granted) {
        localStorage.setItem("khadafi_lang_preference", "id");
        for (const domain of [
          "",
          `; domain=.${location.hostname.replace(/^www\./, "")}`,
        ])
          document.cookie = `googtrans=; max-age=0; path=/${domain}`;
      }
      window.dispatchEvent(new Event("translation-consent-change"));
      setMessage(
        granted
          ? "Terjemahan opsional diizinkan. Pilih bahasa melalui menu navigasi untuk menggunakannya."
          : "Terjemahan opsional dinonaktifkan. Muat ulang halaman untuk menghentikan skrip yang sudah dimuat.",
      );
    } catch {
      setMessage(
        "Preferensi belum dapat disimpan. Periksa pengaturan penyimpanan browser.",
      );
    }
  }
  return (
    <div className={s.cookieControl}>
      <h2>Preferensi terjemahan</h2>
      <p>
        Google Translate saat ini {allowed ? "diizinkan" : "dinonaktifkan"}.
        Fitur ini bersifat opsional dan tidak diperlukan untuk membaca versi
        Bahasa Indonesia.
      </p>
      <div className={s.cookieActions}>
        <button type="button" onClick={() => choose(true)}>
          Izinkan terjemahan
        </button>
        <button type="button" onClick={() => choose(false)}>
          Nonaktifkan terjemahan
        </button>
      </div>
      <p role="status">{message}</p>
    </div>
  );
}
