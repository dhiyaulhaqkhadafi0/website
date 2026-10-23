"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Plus, X, RefreshCw, Grid2X2, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  APP_MODELS,
  APP_STATES,
  appHref,
  appPrice,
  type AppRecord,
  type AppCategory,
} from "@/lib/apps-types";
import { WorkspaceShell, type WorkspaceArea } from "./workspace/WorkspaceShell";
import s from "./manager.module.css";
import { AppMediaField } from "./AppMediaField";
const areas: WorkspaceArea[] = [
  ["overview", "Overview", "Workspace"],
  ["catalog", "Katalog", "Workspace"],
  ["categories", "Kategori", "Workspace"],
  ["pricing", "Pricing", "Bisnis"],
  ["access", "Akses & lisensi", "Bisnis"],
  ["analytics", "Analytics", "Bisnis"],
  ["orders", "Transaksi", "Bisnis"],
  ["settings", "Pengaturan", "Sistem"],
].map(([id, label, group]) => ({ id, label, group }));
type Entitlement = {
  id: string;
  app_id: string;
  status: string;
  expires_at: string | null;
  created_at: string;
};
export function AppsManager({
  initialArea = "overview",
}: {
  initialArea?: string;
}) {
  const [tab, setTab] = useState(
      areas.some((a) => a.id === initialArea) ? initialArea : "overview",
    ),
    [apps, setApps] = useState<AppRecord[]>([]),
    [categories, setCategories] = useState<AppCategory[]>([]),
    [access, setAccess] = useState<Entitlement[]>([]);
  const [token, setToken] = useState(""),
    [loadedKey, setLoadedKey] = useState(""),
    [checkedAt, setCheckedAt] = useState(0),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [refresh, setRefresh] = useState(0),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<
      AppRecord | AppCategory | "new" | null
    >(null),
    [kind, setKind] = useState<"registry" | "categories">("registry"),
    [saving, setSaving] = useState(false),
    [formError, setFormError] = useState("");
  const [preview, setPreview] = useState<AppRecord | null>(null);
  const requestKey = token + ":" + refresh;
  const loading = !token || loadedKey !== requestKey;
  const dialog = useRef<HTMLDialogElement>(null),
    previewDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    void supabase.auth
      .getSession()
      .then(({ data }) => setToken(data.session?.access_token || ""));
    const { data } = supabase.auth.onAuthStateChange((_event, session) =>
      setToken(session?.access_token || ""),
    );
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    async function load() {
      try {
        const results = await Promise.all(
          ["registry", "categories", "entitlements"].map(async (entity) => {
            const response = await fetch(`/api/studio/apps/${entity}`, {
              headers: { Authorization: `Bearer ${token}` },
              cache: "no-store",
              signal: AbortSignal.any([
                controller.signal,
                AbortSignal.timeout(15000),
              ]),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            return data;
          }),
        );
        if (!controller.signal.aborted) {
          setApps(results[0].rows);
          setCategories(results[1].rows);
          setAccess(results[2].rows);
          setCheckedAt(Date.now());
          setError("");
        }
      } catch (e) {
        if (!controller.signal.aborted)
          setError(e instanceof Error ? e.message : "Koneksi terputus.");
      } finally {
        if (!controller.signal.aborted) setLoadedKey(requestKey);
      }
    }
    void load();
    return () => controller.abort();
  }, [token, refresh, requestKey]);
  useEffect(() => {
    if (editing) dialog.current?.showModal();
    else dialog.current?.close();
  }, [editing]);
  useEffect(() => {
    if (preview) previewDialog.current?.showModal();
    else previewDialog.current?.close();
  }, [preview]);
  const row = editing && editing !== "new" ? editing : null;
  const field = (
    name: string,
    label: string,
    opts?: {
      options?: [string, string][];
      type?: string;
      required?: boolean;
      area?: boolean;
      max?: number;
    },
  ) => (
    <label key={name}>
      {label}
      {opts?.options ? (
        <select
          aria-label={label}
          name={name}
          defaultValue={String(
            (row as unknown as Record<string, unknown>)?.[name] ??
              opts.options[0]?.[0] ??
              "",
          )}
          required={opts.required !== false}
        >
          {opts.options.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      ) : opts?.area ? (
        <textarea
          name={name}
          rows={4}
          maxLength={opts.max || 12000}
          defaultValue={String(
            (row as unknown as Record<string, unknown>)?.[name] || "",
          )}
          required={opts.required}
        />
      ) : (
        <input
          name={name}
          type={opts?.type || "text"}
          required={opts?.required}
          maxLength={opts?.max || 240}
          min={opts?.type === "number" ? 0 : undefined}
          step={opts?.type === "number" ? 1 : undefined}
          defaultValue={String(
            (row as unknown as Record<string, unknown>)?.[name] ??
              (name === "version"
                ? "1.0.0"
                : name === "price" ||
                    name === "free_allowance" ||
                    name === "sort_order"
                  ? 0
                  : ""),
          )}
        />
      )}
    </label>
  );
  function open(
    value: AppRecord | AppCategory | "new",
    entity: "registry" | "categories",
  ) {
    setKind(entity);
    setFormError("");
    setEditing(value);
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (event.currentTarget.querySelector('input[type="file"][disabled]')) {
      setFormError("Tunggu sampai unggahan gambar selesai sebelum menyimpan.");
      return;
    }
    setSaving(true);
    setFormError("");
    const body = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch(`/api/studio/apps/${kind}`, {
        method: row ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...body,
          ...(row ? { id: row.id, updated_at: row.updated_at } : {}),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setEditing(null);
      setNotice("Tersimpan. Publikasi mengikuti status yang dipilih.");
      setRefresh((v) => v + 1);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  }
  const filtered = apps.filter(
    (a) =>
      `${a.name} ${a.slug}`.toLowerCase().includes(query.toLowerCase()) &&
      (!filter || a.status === filter),
  );
  const list = (
    <>
      <div className={s.filters}>
        <label>
          Cari aplikasi
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nama atau slug…"
          />
        </label>
        <label>
          Status
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Semua status</option>
            {APP_STATES.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
      </div>
      <div className={s.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Aplikasi</th>
              <th>Publikasi</th>
              <th>Model & akses</th>
              <th>Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td>
                  <strong>{a.name}</strong>
                  <small>
                    {categories.find((c) => c.id === a.category_id)?.name} · v
                    {a.version}
                  </small>
                  <small>{a.short_description}</small>
                </td>
                <td>
                  <span className={s.badge}>{a.status}</span>
                  <small>{a.deployment}</small>
                </td>
                <td>
                  {appPrice(a)}
                  <small>{a.access_terms || "Gratis"}</small>
                </td>
                <td>
                  <div className={s.actions}>
                    <button type="button" onClick={() => open(a, "registry")}>
                      Edit
                    </button>
                    <button type="button" onClick={() => setPreview(a)}>
                      Preview
                    </button>
                    {["published", "maintenance"].includes(a.status) && (
                      <Link href={appHref(a, categories)}>Publik ↗</Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <div className={s.empty}>
            <Grid2X2 />
            <h2>Mulai dari satu masalah yang nyata.</h2>
            <p>
              Daftarkan tool setelah fungsi dan tujuannya siap. Simpan ide yang
              masih dikerjakan sebagai draft.
            </p>
            <button
              className={s.primary}
              onClick={() => open("new", "registry")}
              type="button"
            >
              Tambah aplikasi pertama
            </button>
          </div>
        )}
      </div>
    </>
  );
  return (
    <WorkspaceShell
      title="Apps Manager"
      active={tab}
      areas={areas}
      onSelect={(id) => {
        history.replaceState(null, "", `?area=${id}`);
        setTab(id);
      }}
    >
      <div className={s.content}>
        <header className={s.heading}>
          <div>
            <span className={s.eyebrow}>
              APPS / {areas.find((a) => a.id === tab)?.label}
            </span>
            <h1>
              {tab === "overview" ? (
                <>
                  Alat kecil.
                  <br />
                  <em>Kemungkinan besar.</em>
                </>
              ) : (
                areas.find((a) => a.id === tab)?.label
              )}
            </h1>
            <p>
              Rawat koleksi aplikasi Anda. Satu fungsi yang jelas, satu
              pengalaman yang berguna.
            </p>
          </div>
          <div className={s.actions}>
            <button
              type="button"
              aria-label="Muat ulang Apps"
              onClick={() => setRefresh((v) => v + 1)}
            >
              <RefreshCw size={17} />
            </button>
            <button
              className={s.primary}
              type="button"
              disabled={loading || !!error}
              onClick={() =>
                open("new", tab === "categories" ? "categories" : "registry")
              }
            >
              <Plus size={17} />
              {tab === "categories" ? "Tambah kategori" : "Tambah aplikasi"}
            </button>
          </div>
        </header>
        {notice && (
          <p className={s.notice} role="status">
            {notice}
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Tutup pemberitahuan"
            >
              <X size={16} />
            </button>
          </p>
        )}
        {error && (
          <p className={s.error} role="alert">
            {error}
            <button type="button" onClick={() => setRefresh((v) => v + 1)}>
              Coba lagi
            </button>
          </p>
        )}
        {loading && !error && (
          <p className={s.empty} role="status">
            Memuat koleksi dan memeriksa akses…
          </p>
        )}
        {!loading && !error && (
          <>
            {tab === "overview" && (
              <>
                <div className={s.metrics}>
                  {[
                    ["Seluruh aplikasi", apps.length],
                    [
                      "Terpublikasi",
                      apps.filter((a) => a.status === "published").length,
                    ],
                    [
                      "Dalam draft",
                      apps.filter((a) => a.status === "draft").length,
                    ],
                    [
                      "Lisensi aktif",
                      access.filter(
                        (a) =>
                          a.status === "active" &&
                          (!a.expires_at ||
                            Date.parse(a.expires_at) > checkedAt),
                      ).length,
                    ],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
                <section className={s.panel}>
                  <span className={s.eyebrow}>LANGKAH BERIKUTNYA</span>
                  <h2>Dari eksperimen menjadi alat yang siap dipakai.</h2>
                  <p>
                    Buat aplikasinya di Google AI Studio, tinjau kode dan
                    biayanya, lalu daftarkan di sini. Aplikasi eksternal gratis
                    dapat diarahkan ke HTTPS. Kode internal perlu diintegrasikan
                    sebelum dipublikasikan.
                  </p>
                  <div className={s.actions}>
                    <button onClick={() => setTab("catalog")} type="button">
                      Kelola katalog <ArrowUpRight size={15} />
                    </button>
                    <Link href="/apps">Lihat katalog publik ↗</Link>
                  </div>
                </section>
                {list}
              </>
            )}
            {(tab === "catalog" || tab === "pricing") && (
              <>
                {tab === "pricing" && (
                  <section className={s.panel}>
                    <h2>Harga mengikuti manfaat dan biaya penggunaan.</h2>
                    <p>
                      One-time cocok untuk fungsi tanpa biaya komputasi
                      berulang. Untuk AI, tentukan kredit atau langganan dengan
                      kuota. Tuliskan cakupan versi, durasi dukungan, dan batas
                      pemakaian di setiap aplikasi.
                    </p>
                    <p>
                      Checkout Apps belum dibuka. Metadata harga tidak
                      menerbitkan lisensi.
                    </p>
                  </section>
                )}
                {list}
              </>
            )}
            {tab === "categories" && (
              <section className={s.panel}>
                <h2>Kategori koleksi</h2>
                <div className={s.tableWrap}>
                  <table>
                    <thead>
                      <tr>
                        <th>Kategori</th>
                        <th>Deskripsi</th>
                        <th>Urutan</th>
                        <th>Tindakan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((c) => (
                        <tr key={c.id}>
                          <td>
                            <strong>{c.name}</strong>
                            <small>
                              {c.slug} · {c.name_en}
                            </small>
                          </td>
                          <td>{c.description}</td>
                          <td>{c.sort_order}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => open(c, "categories")}
                            >
                              Edit kategori
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
            {tab === "access" && (
              <section className={s.panel}>
                <h2>Lisensi yang diterbitkan server</h2>
                <p>
                  Akses diterbitkan setelah pembayaran terverifikasi. Pembelian
                  berulang, kedaluwarsa, dan pencabutan akses harus mengikuti
                  ledger pembayaran.
                </p>
                {access.length ? (
                  <div className={s.tableWrap}>
                    <table>
                      <thead>
                        <tr>
                          <th>Aplikasi</th>
                          <th>Status</th>
                          <th>Berlaku sampai</th>
                        </tr>
                      </thead>
                      <tbody>
                        {access.map((e) => (
                          <tr key={e.id}>
                            <td>
                              {apps.find((a) => a.id === e.app_id)?.name ||
                                e.app_id}
                            </td>
                            <td>{e.status}</td>
                            <td>{e.expires_at || "Sesuai cakupan lisensi"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className={s.empty}>
                    Belum ada lisensi Apps. Tidak ada akses yang dibuat dari
                    status di browser.
                  </div>
                )}
              </section>
            )}
            {tab === "analytics" && (
              <section className={s.panel}>
                <h2>Ukur pemakaian yang benar-benar terjadi.</h2>
                <p>
                  Event app_open mengukur pembukaan, app_used hanya boleh
                  dikirim setelah fungsi aplikasi selesai. Keduanya berbeda
                  dengan pembelian.
                </p>
                <div className={s.empty}>
                  Belum tersedia data penggunaan terverifikasi. Setiap mini-app
                  perlu menghubungkan event penggunaan setelah diintegrasikan.
                </div>
                <a
                  href="https://analytics.google.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Buka Google Analytics ↗
                </a>
              </section>
            )}
            {tab === "orders" && (
              <section className={s.panel}>
                <h2>Transaksi Apps belum diaktifkan.</h2>
                <p>
                  Pesanan DOKU yang ada tetap menggunakan ledger commerce.
                  Adapter Apps harus mengikat order, harga, aplikasi, dan
                  lisensi secara idempoten sebelum checkout dibuka.
                </p>
                <Link href="/studio/orders">Buka pesanan bisnis ↗</Link>
                <div className={s.empty}>
                  Pendapatan Apps: belum tersedia. Tidak dihitung dari klik atau
                  harga katalog.
                </div>
              </section>
            )}
            {tab === "settings" && (
              <section className={s.panel}>
                <h2>Registrasi & integrasi</h2>
                <ol>
                  <li>Ekspor source dari Google AI Studio ke GitHub.</li>
                  <li>
                    Tinjau API key, dependensi, akses, dan biaya pemakaian.
                  </li>
                  <li>
                    Integrasikan route internal melalui registry kode, atau
                    gunakan URL eksternal HTTPS.
                  </li>
                  <li>Tambahkan metadata ID/EN, harga dan cakupan akses.</li>
                  <li>
                    Uji fungsi dan publikasi. Monetisasi hanya setelah
                    pembayaran dan akses teruji.
                  </li>
                </ol>
                <p>
                  Preview eksternal dan gambar tidak memuat kode aplikasi ke
                  dalam Studio. Gunakan URL gambar HTTPS dari media yang Anda
                  kelola.
                </p>
                <Link href="/studio">Buka perpustakaan media artikel ↗</Link>
              </section>
            )}
          </>
        )}
      </div>
      <dialog
        ref={dialog}
        className={s.dialog}
        onCancel={(e) => {
          if (saving) e.preventDefault();
          else setEditing(null);
        }}
      >
        <div className={s.dialogHeading}>
          <div>
            <span className={s.eyebrow}>
              {row ? "EDIT" : "TAMBAH"} /{" "}
              {kind === "categories" ? "KATEGORI" : "APLIKASI"}
            </span>
            <h2>{row?.name || "Awal yang berguna."}</h2>
          </div>
          <button
            type="button"
            disabled={saving}
            aria-label="Tutup form"
            onClick={() => setEditing(null)}
          >
            <X />
          </button>
        </div>
        {editing && (
          <form onSubmit={save} key={row?.id || kind}>
            {kind === "categories" ? (
              <div className={s.formGrid}>
                {field("name", "Nama kategori", { required: true })}
                {field("slug", "Slug stabil", { required: true, max: 80 })}
                {field("name_en", "Nama English")}
                {field("sort_order", "Urutan", { type: "number" })}
                {field("description", "Deskripsi ID", { area: true, max: 500 })}
                {field("description_en", "Description EN", {
                  area: true,
                  max: 500,
                })}
                {field("icon", "Kode ikon (metadata)", { max: 40 })}
              </div>
            ) : (
              <>
                <fieldset>
                  <legend>01 / Identitas aplikasi</legend>
                  <div className={s.formGrid}>
                    {field("name", "Nama aplikasi", {
                      required: true,
                      max: 120,
                    })}
                    {field("slug", "Slug unik", { required: true, max: 80 })}
                    {field("category_id", "Kategori", {
                      options: categories.map((c) => [c.id, c.name]),
                      required: true,
                    })}
                    {field("version", "Versi rilis", {
                      required: true,
                      max: 40,
                    })}
                    {field("short_description", "Ringkasan ID", {
                      required: true,
                    })}
                    {field("description", "Deskripsi ID", { area: true })}
                    {field("tags", "Kebutuhan / tag (pisahkan koma)", {
                      max: 500,
                    })}
                  </div>
                </fieldset>
                <details>
                  <summary>02 / Konten English & SEO</summary>
                  <div className={s.formGrid}>
                    {field("name_en", "Name EN", { max: 120 })}
                    {field("short_description_en", "Summary EN")}
                    {field("description_en", "Description EN", { area: true })}
                    {field("seo_title", "Judul SEO", { max: 160 })}
                    {field("seo_description", "Deskripsi SEO", { max: 300 })}
                  </div>
                </details>
                <fieldset>
                  <legend>03 / Lokasi & media</legend>
                  <div className={s.formGrid}>
                    {field("deployment", "Lokasi aplikasi", {
                      options: [
                        ["external", "External — HTTPS"],
                        ["internal", "Internal — route terintegrasi"],
                      ],
                    })}
                    {field("destination", "URL / route aplikasi", {
                      max: 2048,
                    })}
                    <AppMediaField
                      name="icon_url"
                      label="URL ikon HTTPS"
                      value={row && "icon_url" in row ? row.icon_url : ""}
                      token={token}
                    />
                    <AppMediaField
                      name="cover_url"
                      label="URL cover HTTPS"
                      value={row && "cover_url" in row ? row.cover_url : ""}
                      token={token}
                    />
                    {field("preview_url", "URL preview HTTPS (metadata)", {
                      type: "url",
                      max: 2048,
                    })}
                  </div>
                  <p className={s.hint}>
                    Menambahkan URL eksternal tidak mengintegrasikan login atau
                    paywall. Route internal harus masuk registry kode yang sudah
                    ditinjau.
                  </p>
                </fieldset>
                <fieldset>
                  <legend>04 / Harga & publikasi</legend>
                  <div className={s.formGrid}>
                    {field("pricing_model", "Model monetisasi", {
                      options: APP_MODELS.map((v) => [v, v]),
                    })}
                    {field("price", "Harga IDR (tanpa desimal)", {
                      type: "number",
                      required: true,
                    })}
                    {field("free_allowance", "Kuota gratis (metadata)", {
                      type: "number",
                    })}
                    {field("status", "Status publikasi", {
                      options: APP_STATES.map((v) => [v, v]),
                    })}
                    {field(
                      "access_terms",
                      "Cakupan akses, versi & batas penggunaan",
                      { area: true, max: 1500 },
                    )}
                    <label className={s.checkbox}>
                      <input
                        type="checkbox"
                        name="featured"
                        defaultChecked={
                          !!(row && "featured" in row && row.featured)
                        }
                      />
                      Tampilkan sebagai pilihan
                    </label>
                  </div>
                  <p className={s.hint}>
                    Harga berbayar hanya konfigurasi. Pembayaran Apps belum
                    tersedia, dan tidak ada lisensi yang diterbitkan dari form
                    ini.
                  </p>
                </fieldset>
              </>
            )}
            {formError && (
              <p className={s.error} role="alert">
                {formError}
              </p>
            )}
            <footer className={s.dialogFooter}>
              <button
                disabled={saving}
                type="button"
                onClick={() => setEditing(null)}
              >
                Batal
              </button>
              <button disabled={saving} type="submit" className={s.primary}>
                {saving ? "Menyimpan…" : "Simpan ke database"}
              </button>
            </footer>
          </form>
        )}
      </dialog>
      <dialog
        ref={previewDialog}
        className={s.dialog}
        onCancel={() => setPreview(null)}
      >
        <div className={s.dialogHeading}>
          <span className={s.eyebrow}>
            PREVIEW PRIVAT / TIDAK DIPUBLIKASIKAN
          </span>
          <button
            type="button"
            aria-label="Tutup preview"
            onClick={() => setPreview(null)}
          >
            <X />
          </button>
        </div>
        {preview && (
          <div className={s.panel}>
            <h1>{preview.name}</h1>
            <p>{preview.short_description}</p>
            <p style={{ whiteSpace: "pre-wrap" }}>{preview.description}</p>
            <strong>{appPrice(preview)}</strong>
            <p>{preview.access_terms}</p>
            <span className={s.badge}>{preview.status}</span>
          </div>
        )}
      </dialog>
    </WorkspaceShell>
  );
}
