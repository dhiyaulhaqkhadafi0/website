"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  assets,
  sbs,
  assetGuide,
  chapterHref,
  fileSize,
  money,
  type Pathway,
  monetization,
  RATE_PATH,
} from "@/content/business-hub";
import {
  calculateProject,
  calculateSimulation,
  PROJECT_DEFAULTS,
  type ProjectInputs,
} from "@/lib/business-calculations";
import s from "./business-hub.module.css";
// Browser preferences are external state; hydrate them only after the server render.
/* eslint-disable react-hooks/set-state-in-effect */
const sessionPreferences: Record<string, string[]> = {};
const subscribeReady = () => () => {};
export function BusinessReady() {
  const ready = useSyncExternalStore(
    subscribeReady,
    () => true,
    () => false,
  );
  return <span hidden data-business-ready={ready} />;
}
export function useLocalChoices(key: string, validIds: string[]) {
  const [values, setValues] = useState<string[]>([]);
  const [temporary, setTemporary] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "[]");
      setValues(
        Array.isArray(parsed)
          ? parsed.filter(
              (id: unknown): id is string =>
                typeof id === "string" && validIds.includes(id),
            )
          : [],
      );
      const probe = `${key}-probe`;
      localStorage.setItem(probe, "1");
      localStorage.removeItem(probe);
    } catch {
      setValues(sessionPreferences[key] || []);
      setTemporary(true);
    }
    setLoaded(true);
  }, [key, validIds]);
  function save(next: string[]) {
    setValues(next);
    sessionPreferences[key] = next;
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      setTemporary(true);
    }
  }
  return { values, save, temporary, loaded };
}
const readinessIds = sbs.readiness.map((_, i) => String(i));
export function ReaderContents({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const sync = () => setOpen(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return (
    <details
      open={open}
      className={s.toc}
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary aria-expanded={open}>Daftar isi</summary>
      {children}
    </details>
  );
}
export function ReadinessChecklist() {
  const { values, save, temporary } = useLocalChoices(
    "khadafi-sbs-readiness-v2",
    readinessIds,
  );
  return (
    <div>
      <p className={s.status} role="status">
        {values.length} dari {sbs.readiness.length} prasyarat ditandai siap.{" "}
        {temporary
          ? "Penyimpanan tidak tersedia; progres sementara selama sesi ini."
          : "Progres tersimpan di browser ini."}
      </p>
      <progress
        className={s.progress}
        value={values.length}
        max={sbs.readiness.length}
        aria-label="Progres kesiapan"
      />
      <div className={s.checklist}>
        {sbs.readiness.map((label, i) => (
          <label key={label}>
            <input
              type="checkbox"
              checked={values.includes(String(i))}
              onChange={() =>
                save(
                  values.includes(String(i))
                    ? values.filter((x) => x !== String(i))
                    : [...values, String(i)],
                )
              }
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
      <button className={s.secondary} onClick={() => save([])}>
        Reset checklist
      </button>
      <p className={s.notice}>
        Centang setelah ada hasil atau keputusan yang dapat diperiksa. Progres
        ini membantu belajar, bukan sertifikasi.
      </p>
    </div>
  );
}
export function PdfPreview({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      className={s.preview}
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary>Preview PDF — {title}</summary>
      {open && (
        <>
          <p>
            <a className={s.textLink} href={url} download>
              Unduh PDF bila preview tidak tersedia ↗
            </a>
          </p>
          <iframe title={`Preview ${title}`} src={url} loading="lazy" />
        </>
      )}
    </details>
  );
}
export function DocumentLibrary() {
  const [q, setQ] = useState(""),
    [formats, setFormats] = useState<string[]>([]),
    [pillar, setPillar] = useState(""),
    [scope, setScope] = useState("all");
  const tokens = q.toLocaleLowerCase("id").trim().split(/\s+/).filter(Boolean);
  const matches = (text: string) =>
    tokens.every((t) => text.toLocaleLowerCase("id").includes(t));
  const docs = assets.filter(
    (a) =>
      (!pillar || a.pillars.includes(pillar)) &&
      (!formats.length || a.files.some((f) => formats.includes(f.format))) &&
      (scope === "all" || (scope === "optional" ? a.optional : !a.optional)) &&
      matches(
        `${a.title} ${a.description} ${a.pillars.join(" ")} ${a.files.map((f) => f.format).join(" ")} ${a.optional ? "opsional" : "inti"}`,
      ),
  );
  const guides = sbs.chapters
    .flatMap((c) => c.components.map((x) => ({ chapter: c, ...x })))
    .filter(
      (x) =>
        (!pillar || x.chapter.slug === pillar) &&
        matches(
          `${x.title} ${x.summary} ${x.chapter.title} ${x.sections.map((y) => y.heading).join(" ")} ${x.downloads.map((id) => assets.find((a) => a.id === id)?.title).join(" ")}`,
        ),
    );
  function reset() {
    setQ("");
    setFormats([]);
    setPillar("");
    setScope("all");
  }
  return (
    <div>
      <label className={s.search}>
        <span>Cari topik atau dokumen</span>
        <input
          type="search"
          value={q}
          placeholder="Scope, proposal, invoice, SOP…"
          onChange={(e) => setQ(e.target.value)}
        />
      </label>
      <div className={s.filters}>
        <fieldset>
          <legend>Format dokumen · pilih satu atau lebih</legend>
          {["PDF", "DOCX", "XLSX"].map((f) => (
            <label className={s.check} key={f}>
              <input
                type="checkbox"
                checked={formats.includes(f)}
                onChange={() =>
                  setFormats(
                    formats.includes(f)
                      ? formats.filter((x) => x !== f)
                      : [...formats, f],
                  )
                }
              />
              {f}
            </label>
          ))}
        </fieldset>
        <label className={s.field}>
          Pilar
          <select value={pillar} onChange={(e) => setPillar(e.target.value)}>
            <option value="">Semua pilar</option>
            {sbs.chapters.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className={s.field}>
          Kelengkapan
          <select value={scope} onChange={(e) => setScope(e.target.value)}>
            <option value="all">Inti & opsional</option>
            <option value="core">Paket inti</option>
            <option value="optional">Opsional</option>
          </select>
        </label>
      </div>
      <div className={s.resultBar}>
        <span role="status" aria-live="polite">
          {docs.length} dokumen{q ? ` · ${guides.length} panduan` : ""}
        </span>
        <button onClick={reset}>Reset filter</button>
      </div>
      {q && (
        <div>
          <h3>Panduan</h3>
          {guides.length ? (
            <div className={s.chips}>
              {guides.map((g) => (
                <Link key={g.id} href={chapterHref(g.chapter.slug, g.anchor)}>
                  {g.title} ↗
                </Link>
              ))}
            </div>
          ) : (
            <p>Tidak ada panduan yang sesuai. Coba istilah lain.</p>
          )}
        </div>
      )}
      <h3>Dokumen</h3>
      <div className={s.docList}>
        {docs.map((a) => (
          <article key={a.id} className={s.docRow} data-document={a.id}>
            <div>
              <span className={s.eyebrow}>
                {a.id.toUpperCase()} ·{" "}
                {a.document_revision.replace(" retained", "")}{" "}
                {a.optional ? "· Opsional" : ""}
              </span>
              <h3>{a.title}</h3>
              <p>{a.description}</p>
              {a.usage_notice && <p>{a.usage_notice}</p>}
              <Link className={s.textLink} href={assetGuide(a.id)}>
                Baca panduan ↗
              </Link>
              {a.id === "sbs-03" && (
                <p>
                  <Link
                    className={s.textLink}
                    href={`${RATE_PATH}#harga-proyek`}
                  >
                    Buka kalkulator web ↗
                  </Link>
                </p>
              )}
            </div>
            <div className={s.docFiles}>
              {a.files.map((f) => (
                <div className={s.docFile} key={f.format}>
                  <a className={s.secondary} href={f.public_url} download>
                    Unduh {f.format} ↓
                  </a>
                  <small>
                    {fileSize(f.size_bytes)} ·{" "}
                    {a.document_revision.replace(" retained", "")}
                  </small>
                </div>
              ))}
              {a.files.find((f) => f.format === "PDF") && (
                <PdfPreview
                  title={a.title}
                  url={a.files.find((f) => f.format === "PDF")!.public_url}
                />
              )}
            </div>
          </article>
        ))}
      </div>
      {!docs.length && (
        <div className={s.empty}>
          <h3>Belum ada dokumen yang cocok.</h3>
          <p>Ubah format atau pilih semua pilar untuk menjelajah lagi.</p>
          <button className={s.button} onClick={reset}>
            Reset filter
          </button>
        </div>
      )}
    </div>
  );
}
export function PathwaySimulation({ item }: { item: Pathway }) {
  const [quantity, setQuantity] = useState(String(item.simulation.quantity)),
    [receipt, setReceipt] = useState(String(item.simulation.unit_receipt_idr));
  let result: number | undefined,
    error = "";
  try {
    result = calculateSimulation(
      quantity,
      receipt,
      item.simulation.divisor,
      item.simulation.quantity_unit,
    );
  } catch (e) {
    error = (e as Error).message;
  }
  return (
    <div>
      <div className={s.formGrid}>
        <label className={s.field}>
          Jumlah {item.simulation.quantity_unit} / bulan
          <input
            aria-label={`Jumlah ${item.simulation.quantity_unit}`}
            type="number"
            min="0"
            step={item.simulation.quantity_unit.includes("jam") ? "any" : "1"}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>
        <label className={s.field}>
          {item.simulation.unit_label} (Rp)
          {item.simulation.divisor === 1000 ? " / 1.000 views" : ""}
          <input
            aria-label="Penerimaan asumsi per unit"
            type="number"
            min="0"
            step="any"
            value={receipt}
            onChange={(e) => setReceipt(e.target.value)}
          />
        </label>
      </div>
      <div className={s.calculation} aria-live="polite">
        <span className={s.eyebrow}>Simulasi penerimaan kotor / bulan</span>
        {error ? (
          <p className={s.error} role="alert">
            {error}
          </p>
        ) : (
          <>
            <span className={s.total} data-testid="simulation-total">
              {money(result!)}
            </span>
            <small>
              {Number(quantity).toLocaleString("id-ID")}{" "}
              {item.simulation.quantity_unit} × {money(Number(receipt))}
              {item.simulation.divisor !== 1
                ? ` ÷ ${item.simulation.divisor.toLocaleString("id-ID")}`
                : ""}
            </small>
          </>
        )}
      </div>
      <div className={s.actions}>
        <button
          className={s.secondary}
          onClick={() => {
            setQuantity(String(item.simulation.quantity));
            setReceipt(String(item.simulation.unit_receipt_idr));
          }}
        >
          Reset asumsi
        </button>
      </div>
      {item.mechanisms.some(
        (m) => m === "komisi-referral" || m === "lisensi",
      ) && (
        <p className={s.notice}>
          Untuk komisi atau royalti, nilai per unit merupakan asumsi bagian yang
          diterima, bukan harga jual produk pihak ketiga.
        </p>
      )}
      <p className={s.notice}>{monetization.simulation_notice}</p>
    </div>
  );
}
const projectFields: [keyof ProjectInputs, string, string][] = [
  [
    "compensation",
    "Kompensasi pemilik / bulan (Rp)",
    "Kebutuhan pemilik yang ingin didanai.",
  ],
  [
    "overhead",
    "Operasional tetap / bulan (Rp)",
    "Biaya tetap masuk rate; jangan dihitung dua kali.",
  ],
  ["reserve", "Cadangan bulanan (Rp)", "Cadangan usaha dalam nominal."],
  ["days", "Hari kerja / bulan", "Lebih dari 0, maksimal 31."],
  ["hours", "Jam kerja / hari", "Lebih dari 0, maksimal 24."],
  [
    "billable",
    "Porsi jam tertagih (%)",
    "Waktu proyek klien, di luar administrasi.",
  ],
  [
    "projectHours",
    "Estimasi jam proyek",
    "Termasuk briefing, revisi, pengujian dan handover.",
  ],
  [
    "direct",
    "Biaya langsung proyek (Rp)",
    "Aset atau vendor yang belum ada di biaya tetap.",
  ],
  ["risk", "Cadangan risiko proyek (%)", "Ketidakpastian estimasi proyek."],
  ["margin", "Target margin (%)", "Minimal 0%, harus kurang dari 100%."],
  [
    "rounding",
    "Pembulatan ke atas (Rp)",
    "Kelipatan harga akhir; harus lebih dari nol.",
  ],
  ["deposit", "Porsi DP (%)", "DP + termin kedua maksimal 100%."],
  ["second", "Porsi termin kedua (%)", "Sisanya otomatis menjadi pelunasan."],
];
const projectValues = () =>
  Object.fromEntries(
    projectFields.map(([k]) => [k, String(PROJECT_DEFAULTS[k])]),
  ) as Record<keyof ProjectInputs, string>;
export function ProjectCalculator() {
  const [values, setValues] = useState(projectValues);
  let result: ReturnType<typeof calculateProject> | undefined,
    error = "";
  try {
    result = calculateProject(
      Object.fromEntries(
        projectFields.map(([k]) => [
          k,
          values[k].trim() ? Number(values[k]) : NaN,
        ]),
      ) as ProjectInputs,
    );
  } catch (e) {
    error = (e as Error).message;
  }
  return (
    <section
      id="harga-proyek"
      className={`${s.hub} ${s.section}`}
      aria-labelledby="project-title"
    >
      <div className={s.sectionHead}>
        <div>
          <span className={s.eyebrow}>
            Dari rate ke penawaran / Selaras dengan workbook V2
          </span>
          <h2 id="project-title">Hitung ruang untuk proyekmu.</h2>
        </div>
        <p>
          Simulasi DEMO-001 Kedai Senja. Proyek fiktif, bukan penawaran atau
          tarif Khadafi.
        </p>
      </div>
      <div className={s.formGrid}>
        {projectFields.map(([k, label, help]) => (
          <label key={k} className={s.field}>
            {label}
            <input
              name={k}
              type="number"
              min={0}
              step="any"
              value={values[k]}
              onChange={(e) => setValues({ ...values, [k]: e.target.value })}
            />
            <small>{help}</small>
          </label>
        ))}
      </div>
      <div className={s.calculation} aria-live="polite">
        <span className={s.eyebrow}>Harga proyek sebelum pajak</span>
        {error ? (
          <p className={s.error} role="alert">
            {error}
          </p>
        ) : (
          result && (
            <>
              <strong className={s.total} data-testid="project-total">
                {money(result.price)}
              </strong>
              <dl>
                {[
                  [
                    "Kapasitas tertagih",
                    `${result.capacity.toLocaleString("id-ID")} jam`,
                  ],
                  ["Rate dasar / jam", money(result.rate)],
                  ["Biaya dasar proyek", money(result.base)],
                  ["Biaya termasuk risiko", money(result.withRisk)],
                  ["DP", money(result.deposit)],
                  ["Termin kedua", money(result.second)],
                  ["Pelunasan akhir", money(result.final)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )
        )}
      </div>
      <div className={s.actions}>
        <button
          className={s.secondary}
          onClick={() => setValues(projectValues())}
        >
          Reset ke contoh Kedai Senja
        </button>
        <a
          className={s.textLink}
          href={assets.find((a) => a.id === "sbs-03")!.files[0].public_url}
          download
        >
          Unduh kalkulator XLSX ↗
        </a>
      </div>
      <p className={s.notice}>
        Biaya dasar = jam × rate + biaya langsung. Biaya dengan risiko = biaya
        dasar × (1 + risiko). Harga = biaya dengan risiko ÷ (1 − margin),
        dibulatkan ke atas. Pajak tidak dihitung otomatis. Biaya tetap sudah
        masuk rate.
      </p>
    </section>
  );
}
