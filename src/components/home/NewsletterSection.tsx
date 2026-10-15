"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import styles from "./editorial-home.module.css";
export function NewsletterSection() {
  const sending = useRef(false);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [manageUrl, setManageUrl] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const fields = new FormData(event.currentTarget);
    const params = new URLSearchParams(window.location.search);
    sending.current = true;
    setState("loading");
    setMessage("");
    try {
      const response = await fetch("/api/freelance/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.get("name"),
          email: fields.get("email"),
          consent: fields.get("consent") === "on",
          website: fields.get("website"),
          source: "homepage",
          utm_source: params.get("utm_source"),
          utm_campaign: params.get("utm_campaign"),
        }),
      });
      const data = await response.json();
      if (!response.ok || data.ok !== true)
        throw new Error(
          data.error || "Pendaftaran belum dapat disimpan. Silakan coba lagi.",
        );
      setMessage(data.message);
      setManageUrl(data.manageUrl || "");
      setState("success");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Koneksi terputus. Silakan coba lagi.",
      );
      setState("error");
    } finally {
      sending.current = false;
    }
  }
  return (
    <div className={styles.newsletter}>
      <div>
        <p className={styles.eyebrow}>
          05 / Catatan Khadafi · Newsletter gratis
        </p>
        <h2 id="newsletter-title">
          Dapatkan ide dan sumber daya untuk{" "}
          <em>langkah digitalmu berikutnya.</em>
        </h2>
        <p>
          Terima pilihan peluang freelance, panduan AI praktis, serta pembaruan
          produk dan sumber daya dari Khadafi melalui email.
        </p>
        <ul className={styles.newsletterBenefits}>
          <li>Peluang yang layak dijelajahi.</li>
          <li>Ide yang bisa dipraktikkan.</li>
          <li>Kabar dari balik proses berkarya.</li>
        </ul>
      </div>
      <div className={styles.newsletterForm}>
        {state === "success" ? (
          <div role="status" className={styles.newsletterSuccess}>
            <span aria-hidden="true">✓</span>
            <h3>Pendaftaran diproses.</h3>
            <p>{message}</p>
            {manageUrl && (
              <>
                <Link href={manageUrl} className={styles.textLink}>
                  Kelola langganan <span aria-hidden="true">↗</span>
                </Link>
                <p className={styles.formNote}>
                  Simpan tautan pribadi ini untuk berhenti berlangganan kapan
                  saja.
                </p>
              </>
            )}
          </div>
        ) : (
          <form
            onSubmit={submit}
            aria-label="Newsletter Khadafi"
            aria-busy={state === "loading"}
          >
            <label htmlFor="newsletter-name">
              Nama kamu
              <input
                id="newsletter-name"
                name="name"
                autoComplete="given-name"
                placeholder="Nama panggilanmu"
                minLength={2}
                maxLength={100}
                required
                disabled={state === "loading"}
              />
            </label>
            <label htmlFor="newsletter-email">
              Alamat email
              <input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="kamu@email.com"
                maxLength={254}
                required
                disabled={state === "loading"}
              />
            </label>
            <div className={styles.honeypot} aria-hidden="true">
              <label>
                Website
                <input name="website" autoComplete="off" tabIndex={-1} />
              </label>
            </div>
            <label className={styles.newsletterConsent}>
              <input
                type="checkbox"
                name="consent"
                required
                disabled={state === "loading"}
              />
              <span>
                Saya setuju menerima pembaruan Khadafi melalui email dan telah
                membaca <Link href="/privacy">Kebijakan Privasi</Link>.
              </span>
            </label>
            {state === "error" && (
              <p
                role="alert"
                id="newsletter-error"
                className={styles.newsletterError}
              >
                {message}
              </p>
            )}
            <button
              className={styles.primary}
              type="submit"
              disabled={state === "loading"}
              aria-describedby={
                state === "error" ? "newsletter-error" : undefined
              }
            >
              {state === "loading"
                ? "Menyimpan pendaftaran…"
                : state === "error"
                  ? "Coba Lagi"
                  : "Gabung Gratis"}
              <span aria-hidden="true">→</span>
            </button>
            <p className={styles.formNote}>
              Gratis. Berhenti berlangganan kapan saja.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
