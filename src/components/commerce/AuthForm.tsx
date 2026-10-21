"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { syncSession } from "./SessionBridge";
import s from "./commerce.module.css";
const subscribeHydration = () => () => {};
export function AuthForm({
  returnTo,
  register = false,
}: {
  returnTo: string;
  register?: boolean;
}) {
  const router = useRouter();
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [emailOnly, setEmailOnly] = useState(false);
  const [space, setSpace] = useState<"auto" | "member" | "founder">(
    returnTo.startsWith("/studio") ? "founder" : "auto",
  );
  const destination = (serverDestination?: string) =>
    space === "founder"
      ? returnTo.startsWith("/studio")
        ? returnTo
        : "/studio/overview"
      : space === "member"
        ? returnTo.startsWith("/studio")
          ? "/account"
          : returnTo
        : returnTo !== "/account"
          ? returnTo
          : serverDestination === "/studio/overview"
            ? serverDestination
            : "/account";
  useEffect(() => {
    if (register) return;
    let alive = true;
    void supabase.auth.getSession().then(async ({ data }) => {
      if (!alive || !data.session) return;
      const r = await syncSession(data.session.access_token);
      const session = await r.json();
      if (r.ok && alive) {
        router.replace(
          returnTo !== "/account"
            ? returnTo
            : session.destination === "/studio/overview"
              ? session.destination
              : "/account",
        );
        router.refresh();
      }
    });
    return () => {
      alive = false;
    };
  }, [register, returnTo, router]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    try {
      if (emailOnly && !register) {
        const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: window.location.origin + "/login?returnTo=" + encodeURIComponent(returnTo) } });
        if (error) throw new Error("Tautan masuk belum dapat dikirim. Coba lagi atau masuk dengan password.");
        setNotice("Jika email terdaftar, tautan masuk akan dikirim. Buka tautan di email untuk mengakses pembelianmu.");
        return;
      }
      const { data, error } = register
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: "https://khadafidaffa.com/login",
              data: { display_name: String(form.get("name")) },
            },
          })
        : await supabase.auth.signInWithPassword({ email, password });
      if (error)
        throw new Error(
          register
            ? "Pendaftaran belum berhasil. Periksa email dan password, lalu coba lagi."
            : "Email atau password belum sesuai. Coba kembali.",
        );
      if (!data.session) {
        setNotice(
          "Periksa email untuk mengonfirmasi akunmu, lalu masuk di halaman login.",
        );
        return;
      }
      const response = await syncSession(data.session.access_token);
      if (!response.ok)
        throw new Error("Sesi belum dapat disiapkan. Coba masuk kembali.");
      const session = await response.json();
      router.replace(register ? "/account" : destination(session.destination));
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Tidak dapat terhubung. Coba kembali.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={s.authStage}>
      <aside className={s.authStory} aria-label="Ruang digital Khadafi">
        <span className={s.eyebrow}>A LITTLE CURIOSITY. A BIGGER TOMORROW.</span>
        <h2>Ide kecil. <br />Karya berarti.<br /><em>Perjalananmu.</em></h2>
        <p>Tempat untuk menyimpan bekal, menemukan perspektif, dan melanjutkan hal yang ingin kamu bangun.</p>
        <div className={s.authArtwork} aria-hidden="true">
          <span className={s.authOrbit} />
          <div className={s.authNoteBack}><small>02 / MAKE IT REAL</small><strong>Make<br />a little<br /><em>progress.</em></strong><i>BUILD SOMETHING MEANINGFUL</i></div>
          <div className={s.authNoteFront}><small>01 / STAY CURIOUS</small><strong>Your next<br /><em>chapter.</em></strong><i>KHADAFI / LEARNING NOTES</i></div>
          <span className={s.authSeal}>K.</span>
        </div>
        <Link href="/resources" className={s.authExplore}>Jelajahi bekal gratis <ArrowUpRight size={16} /></Link>
      </aside>
    <section className={s.auth}>
      <span className={s.eyebrow}>SATU AKUN KHADAFI</span>
      <h1>{register ? "Ruang untuk perjalananmu." : "Senang bertemu lagi."}</h1>
      <p>
        {register
          ? "Satu akun untuk produk dan library digitalmu."
          : "Satu akun untuk produk, pembelian, dan perjalanan belajarmu."}
      </p>
      {!register && (
        <fieldset className={s.spaces}>
          <legend>Tujuan masuk</legend>
          <label>
            <input
              type="radio"
              name="space"
              checked={space !== "founder"}
              onChange={() => setSpace("member")}
            />
            <span>
              <strong>Member</strong>
              <small>Akses produk, pembelian, dan materi belajarmu.</small>
            </span>
          </label>
          <label>
            <input
              type="radio"
              name="space"
              checked={space === "founder"}
              onChange={() => setSpace("founder")}
            />
            <span>
              <strong>Founder / Pengelola</strong>
              <small>Masuk ke ruang pengelolaan website.</small>
            </span>
          </label>
          <p>
            Pilihan ini menentukan tujuan masuk. Hak pengelola tetap diperiksa
            dari akun yang diizinkan.
          </p>
        </fieldset>
      )}
      <form
        className={s.form}
        method="post"
        onSubmit={submit}
        aria-label={register ? "Daftar akun" : "Masuk akun"}
        aria-busy={busy}
      >
        {register && (
          <label>
            Nama
            <input name="name" autoComplete="name" maxLength={120} required />
          </label>
        )}
        <label>
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="kamu@email.com"
          />
        </label>
        {(!emailOnly || register) && <label>
          Password
          <input
            type="password"
            name="password"
            autoComplete={register ? "new-password" : "current-password"}
            minLength={register ? 8 : undefined}
            maxLength={128}
            required
            placeholder={register ? "Minimal 8 karakter" : "Password akunmu"}
          />
        </label>}
        {!register && <button type="button" className={s.secondary} onClick={() => { setEmailOnly(v => !v); setError(""); setNotice(""); }}>{emailOnly ? "Gunakan password" : "Masuk lewat tautan email"}</button>}
        {register && (
          <label className={s.check}>
            <input type="checkbox" required />
            <span>
              Saya menyetujui <Link href="/terms">Syarat Penggunaan</Link> dan{" "}
              <Link href="/privacy">Kebijakan Privasi</Link>.
            </span>
          </label>
        )}
        {error && (
          <div className={s.notice + " " + s.error} role="alert">
            {error}
          </div>
        )}
        {notice && (
          <div className={s.notice} role="status">
            {notice}
          </div>
        )}
        <button className={s.button} disabled={!hydrated || busy}>
          {busy ? <LoaderCircle className={s.spin} /> : <ArrowUpRight />}
          {busy ? "Memproses…" : register ? "Buat akun" : "Masuk"}
        </button>
      </form>
      <p>
        {register ? "Sudah punya akun? " : "Belum punya akun? "}
        <Link
          href={
            (register ? "/login" : "/register") +
            "?returnTo=" +
            encodeURIComponent(returnTo)
          }
          style={{ textDecoration: "underline" }}
        >
          {register ? "Masuk" : "Buat akun"}
        </Link>
      </p>
    </section>
    </div>
  );
}
