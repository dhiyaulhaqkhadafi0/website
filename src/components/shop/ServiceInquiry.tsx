"use client";
import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/content/shop";
import { BUDGETS, INQUIRY_CONSENT, TIMELINES } from "@/lib/service-inquiry";
import s from "./shop.module.css";
const subscribeHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;
export function ServiceInquiry({ service = "" }: { service?: string }) {
  const hydrated = useSyncExternalStore(subscribeHydration, clientHydrated, serverHydrated);
  const form = useRef<HTMLFormElement>(null),
    requestId = useRef<string>(""),
    submitted = useRef<string>("");
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
      "idle",
    ),
    [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const payload = {
      ...values,
      consent: values.consent === "on",
      consent_version: INQUIRY_CONSENT,
    };
    const canonical = JSON.stringify(payload);
    if (!requestId.current || submitted.current !== canonical) {
      requestId.current = crypto.randomUUID();
      submitted.current = canonical;
    }
    setState("sending");
    setMessage("");
    try {
      const response = await fetch("/api/services/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, request_id: requestId.current }),
        signal: AbortSignal.timeout(12000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true)
        throw new Error(
          result.error || "Brief belum tersimpan. Silakan coba lagi.",
        );
      setState("success");
      setMessage(result.message);
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "Koneksi belum memberi konfirmasi. Silakan coba lagi; brief di formulir tetap tersedia.",
      );
    }
  }
  return (
    <section
      className={s.inquirySection}
      id="inquiry"
      aria-labelledby="inquiry-heading"
    >
      <div>
        <span className={s.eyebrow}>LET&apos;S START WITH A CONVERSATION</span>
        <h2 id="inquiry-heading">
          Ceritakan idemu.
          <br />
          <em>Kita mulai dari situ.</em>
        </h2>
        <p>
          Belum perlu brief yang sempurna. Ceritakan konteks, kebutuhan, dan
          hasil yang ingin kamu capai.
        </p>
        <p>
          Penawaran dan jadwal dibahas setelah kebutuhan dipahami. Mengirim
          brief tidak membuat pesanan.
        </p>
        <div className={s.actions}>
          <a
            href="mailto:daffadhiyaulhaqkhadafi@gmail.com"
            className={s.textLink}
          >
            Lebih nyaman lewat email? <ArrowUpRight />
          </a>
        </div>
      </div>
      <div>
        {state === "success" ? (
          <div className={s.formSuccess} role="status" tabIndex={-1}>
            <h3>Idemu sudah sampai.</h3>
            <p>{message}</p>
            <p>
              Ini konfirmasi penyimpanan, bukan konfirmasi proyek atau email
              otomatis. Khadafi akan meninjau kebutuhanmu terlebih dahulu.
            </p>
            <button
              className={s.secondary}
              style={{ marginTop: 20 }}
              onClick={() => {
                requestId.current = "";
                submitted.current = "";
                setState("idle");
              }}
            >
              Kirim brief lain
            </button>
          </div>
        ) : (
          <form
            ref={form}
            className={s.inquiryForm}
            method="post" action="/api/services/inquiries"
            onSubmit={submit}
            aria-busy={state === "sending"}
          >
            <div className={s.fieldGrid}>
              <label htmlFor="inquiry-name">
                Nama
                <input
                  id="inquiry-name"
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={100}
                  placeholder="Nama yang nyaman kamu gunakan"
                />
              </label>
              <label htmlFor="inquiry-email">
                Email
                <input
                  id="inquiry-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder="Untuk membalas brief-mu"
                />
              </label>
            </div>
            <label htmlFor="inquiry-service">
              Apa yang ingin kamu bangun?
              <select
                id="inquiry-service"
                name="service"
                required
                defaultValue={service}
              >
                <option value="" disabled>
                  Pilih jenis layanan
                </option>
                {SERVICES.map((item) => (
                  <option value={item.slug} key={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="inquiry-description">
              Sedikit cerita tentang proyekmu
              <textarea
                id="inquiry-description"
                name="description"
                required
                minLength={20}
                maxLength={3000}
                placeholder="Tujuan, audiens, kendala saat ini, atau hasil yang kamu bayangkan..."
                aria-describedby="brief-note"
              />
            </label>
            <div className={s.fieldGrid}>
              <label htmlFor="inquiry-budget">
                <span>
                  Perkiraan anggaran{" "}
                  <span className={s.optional}>/ opsional</span>
                </span>
                <select id="inquiry-budget" name="budget" defaultValue="">
                  <option value="">Belum ingin menentukan</option>
                  {BUDGETS.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label htmlFor="inquiry-timeline">
                <span>
                  Target waktu <span className={s.optional}>/ opsional</span>
                </span>
                <select id="inquiry-timeline" name="timeline" defaultValue="">
                  <option value="">Belum ingin menentukan</option>
                  {TIMELINES.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className={s.honeypot} aria-hidden="true">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <label className={s.consent}>
              <input type="checkbox" name="consent" required />
              <span>
                Saya menyetujui nama, email, dan brief ini disimpan untuk
                ditinjau dan dihubungi terkait proyek ini, sesuai{" "}
                <Link href="/privacy">Kebijakan Privasi</Link>. Persetujuan ini
                tidak mendaftarkan saya ke newsletter.
              </span>
            </label>
            {state === "error" && (
              <div className={s.formError} role="alert">
                {message}
              </div>
            )}
            <button
              type="submit"
              className={s.button}
              disabled={!hydrated || state === "sending"}
            >
              {state === "sending"
                ? "Menyimpan brief..."
                : "Kirim brief proyek"}
              <ArrowUpRight />
            </button>
            <noscript><p className={s.formNote}>Aktifkan JavaScript untuk mengirim formulir, atau hubungi Khadafi melalui tautan email di atas.</p></noscript>
            <p id="brief-note" className={s.formNote}>
              Tulis 20–3.000 karakter. Jangan sertakan kata sandi, kunci API,
              dokumen identitas, atau data sensitif klien. Brief tersimpan
              melalui Supabase dan hanya dapat ditinjau pengelola Studio.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
