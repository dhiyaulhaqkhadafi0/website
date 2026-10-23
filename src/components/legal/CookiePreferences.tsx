"use client";
import { useState, useSyncExternalStore } from "react";
import s from "./legal.module.css";
import { ANALYTICS_CONSENT_KEY, analyticsConsent } from '@/lib/analytics-policy.mjs';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';
const subscribeAnalytics=(callback:()=>void)=>{window.addEventListener('analytics-consent-change',callback);window.addEventListener('storage',callback);return()=>{window.removeEventListener('analytics-consent-change',callback);window.removeEventListener('storage',callback);};};
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
  const measured = useSyncExternalStore(subscribeAnalytics, analyticsConsent, () => false);
  const [message, setMessage] = useState("");
  function chooseAnalytics(granted:boolean) {
    try {
      localStorage.setItem(ANALYTICS_CONSENT_KEY,granted?'granted':'denied');
      if(!granted){
        (window as unknown as Record<string,unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`]=true;
        window.gtag?.('consent','update',{analytics_storage:'denied'});
        for(const cookie of document.cookie.split(';')){
          const name=cookie.trim().split('=')[0];
          if(!/^_ga(?:_|$)/.test(name))continue;
          for(const domain of ['',`; domain=${location.hostname}`,`; domain=.${location.hostname.replace(/^www\./,'')}`]) document.cookie=`${name}=; max-age=0; path=/; SameSite=Lax${domain}`;
        }
      }
      window.dispatchEvent(new Event('analytics-consent-change'));
      setMessage(granted?'Analytics diizinkan untuk halaman publik.':'Analytics dinonaktifkan.');
      if(!granted&&window.khadafiGaReady)window.location.reload();
    } catch { setMessage('Preferensi belum dapat disimpan.'); }
  }
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
      <h2>Penyimpanan penting</h2>
      <p>Sesi akun dan keamanan diperlukan saat Anda masuk. Selalu aktif untuk fungsi akun.</p>
      <h2>Analytics opsional</h2>
      <p>Google Analytics saat ini {measured?'diizinkan':'dinonaktifkan'}. Mengukur penggunaan halaman publik. Izin ini terpisah dari terjemahan.</p>
      <div className={s.cookieActions}><button type="button" onClick={()=>chooseAnalytics(true)}>Izinkan analytics</button><button type="button" onClick={()=>chooseAnalytics(false)}>Nonaktifkan analytics</button></div>
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
