"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, ArrowUpRight } from "lucide-react";
import {
  monetization,
  MONETIZATION_PATH,
  pathwayHref,
  filterPathways,
  parsePathQuery,
  pathQueryString,
  type PathQuery,
} from "@/content/business-hub";
import { useLocalChoices } from "./BusinessInteractions";
import s from "./business-hub.module.css";
const ids = monetization.items.map((i) => i.id);
export function MonetizationExplorer({
  initialQuery,
}: {
  initialQuery: PathQuery;
}) {
  const [query, setQuery] = useState(initialQuery),
    [compared, setCompared] = useState<string[]>([]),
    [status, setStatus] = useState("");
  // Next can reuse this component when a category shortcut changes server search params.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronize a new server navigation with this retained explorer.
    setQuery(initialQuery);
  }, [initialQuery]);
  const {
    values: saved,
    save,
    temporary,
    loaded,
  } = useLocalChoices("khadafi-m80-saved-v3", ids);
  useEffect(() => {
    const pop = () =>
      setQuery(parsePathQuery(new URLSearchParams(window.location.search)));
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  const rows = filterPathways(query, saved),
    pages = Math.max(1, Math.ceil(rows.length / 12)),
    page = Math.min(query.page, pages),
    visible = rows.slice((page - 1) * 12, page * 12);
  function update(patch: Partial<PathQuery>, replace = false) {
    const next = { ...query, ...patch, page: patch.page ?? 1 };
    setQuery(next);
    const qs = pathQueryString(next);
    window.history[replace ? "replaceState" : "pushState"](
      null,
      "",
      `${MONETIZATION_PATH}${qs ? "?" + qs : ""}#jalur`,
    );
  }
  const href = (p: number) =>
    `${MONETIZATION_PATH}?${pathQueryString({ ...query, page: p })}#jalur`;
  function toggleSave(id: string) {
    const removing = saved.includes(id);
    save(removing ? saved.filter((x) => x !== id) : [...saved, id]);
    setStatus(
      removing
        ? "Jalur dihapus dari pilihan tersimpan."
        : "Jalur disimpan di browser ini.",
    );
  }
  function compare(id: string) {
    if (compared.includes(id)) {
      setCompared(compared.filter((x) => x !== id));
      setStatus("Jalur dihapus dari perbandingan.");
    } else if (compared.length >= 3)
      setStatus(
        "Maksimal tiga jalur. Hapus salah satu pilihan sebelum menambahkan jalur lain.",
      );
    else {
      setCompared([...compared, id]);
      setStatus("Jalur ditambahkan ke perbandingan.");
    }
  }
  const selected = compared.map(
    (id) => monetization.items.find((i) => i.id === id)!,
  );
  return (
    <section id="jalur" className={s.section} aria-labelledby="paths-title">
      <div className={s.sectionHead}>
        <div>
          <span className={s.eyebrow}>Pustaka pilihan / 01—80</span>
          <h2 id="paths-title">Mulai dari rasa ingin tahu.</h2>
        </div>
        <p>
          Pilih satu arah, baca lebih dalam, lalu uji dalam skala yang bisa kamu
          tangani.
        </p>
      </div>
      <label className={s.search}>
        <span>Cari jalur, skill, atau model bisnis</span>
        <input
          type="search"
          placeholder="Desain, menulis, AI, riset…"
          value={query.q}
          onChange={(e) => update({ q: e.target.value }, true)}
        />
      </label>
      <div className={s.chips} aria-label="Kategori jalur">
        {[{ id: "", title: "Semua" }, ...monetization.categories].map((c) => (
          <button
            key={c.id}
            aria-pressed={query.category === c.id}
            onClick={() => update({ category: c.id })}
          >
            {c.title}
            <small>
              {c.id
                ? monetization.items.filter((i) => i.category_id === c.id)
                    .length
                : monetization.items.length}
            </small>
          </button>
        ))}
      </div>
      <div className={s.filters}>
        <fieldset>
          <legend>Mekanisme penerimaan · boleh lebih dari satu</legend>
          {Object.entries(monetization.mechanism_labels).map(([id, label]) => (
            <label key={id} className={s.check}>
              <input
                type="checkbox"
                checked={query.mechanisms.includes(id)}
                onChange={() =>
                  update({
                    mechanisms: query.mechanisms.includes(id)
                      ? query.mechanisms.filter((m) => m !== id)
                      : [...query.mechanisms, id],
                  })
                }
              />
              {label}
            </label>
          ))}
        </fieldset>
      </div>
      <div className={s.filters}>
        <label className={s.check}>
          <input
            type="checkbox"
            checked={query.saved}
            onChange={(e) => update({ saved: e.target.checked })}
          />
          Pilihan tersimpan ({saved.length})
        </label>
        <label className={s.field}>
          Urutkan
          <select
            value={query.sort}
            onChange={(e) => update({ sort: e.target.value })}
          >
            <option value="number">Nomor sumber</option>
            <option value="az">Judul A–Z</option>
          </select>
        </label>
        {compared.length > 0 && (
          <a className={s.textLink} href="#bandingkan">
            Bandingkan ({compared.length}/3) ↓
          </a>
        )}
      </div>
      <div className={s.resultBar}>
        <span role="status" aria-live="polite">
          {query.saved && !loaded
            ? "Memuat pilihan tersimpan…"
            : `${rows.length} jalur · Halaman ${page} dari ${pages}`}
        </span>
        <button onClick={() => update(parsePathQuery(new URLSearchParams()))}>
          Reset filter
        </button>
      </div>
      <p className={s.status} role="status" aria-live="polite">
        {temporary
          ? "Penyimpanan browser tidak tersedia. Pilihan disimpan sementara selama sesi ini. "
          : ""}
        {status}
      </p>
      {visible.length ? (
        <div className={s.grid}>
          {visible.map((item) => (
            <article
              className={s.pathCard}
              key={item.id}
              data-pathway={item.id}
            >
              <div className={s.cardTop}>
                <span>{String(item.number).padStart(2, "0")}</span>
                <span>
                  {
                    monetization.categories.find(
                      (c) => c.id === item.category_id,
                    )!.title
                  }
                </span>
              </div>
              <h3>
                <Link href={pathwayHref(item.slug)}>{item.title}</Link>
              </h3>
              <p>{item.definition}</p>
              <div className={s.tags}>
                {item.mechanisms.map((m) => (
                  <span className={s.badge} key={m}>
                    {
                      monetization.mechanism_labels[
                        m as keyof typeof monetization.mechanism_labels
                      ]
                    }
                  </span>
                ))}
              </div>
              <div className={s.simSmall}>
                <span>Simulasi penerimaan kotor / bulan</span>
                {item.simulation.formula_text}
              </div>
              <div className={s.cardActions}>
                <Link href={pathwayHref(item.slug)}>
                  Lihat jalur <ArrowUpRight size={14} />
                </Link>
                <button
                  aria-label={`${saved.includes(item.id) ? "Hapus simpanan" : "Simpan"} ${item.title}`}
                  aria-pressed={saved.includes(item.id)}
                  onClick={() => toggleSave(item.id)}
                >
                  <Bookmark size={14} />
                  {saved.includes(item.id) ? "Tersimpan" : "Simpan"}
                </button>
                <button
                  aria-label={`Bandingkan ${item.title}`}
                  aria-pressed={compared.includes(item.id)}
                  onClick={() => compare(item.id)}
                >
                  Bandingkan
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={s.empty}>
          <h3>Belum ada jalur yang cocok.</h3>
          <p>
            {query.saved
              ? "Simpan jalur yang menarik untuk mengumpulkannya di sini."
              : "Coba kata yang lebih sederhana atau kurangi filter."}
          </p>
          <button
            className={s.button}
            onClick={() => update(parsePathQuery(new URLSearchParams()))}
          >
            Reset filter
          </button>
        </div>
      )}
      {pages > 1 && (
        <nav className={s.pagination} aria-label="Halaman jalur monetisasi">
          {page > 1 && (
            <a
              href={href(page - 1)}
              onClick={(e) => {
                e.preventDefault();
                update({ page: page - 1 });
                document.getElementById("jalur")?.scrollIntoView();
              }}
            >
              ← Sebelumnya
            </a>
          )}
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={href(p)}
              aria-label={`Halaman ${p}`}
              aria-current={page === p ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                update({ page: p });
                document.getElementById("jalur")?.scrollIntoView();
              }}
            >
              {p}
            </a>
          ))}
          {page < pages && (
            <a
              href={href(page + 1)}
              onClick={(e) => {
                e.preventDefault();
                update({ page: page + 1 });
                document.getElementById("jalur")?.scrollIntoView();
              }}
            >
              Berikutnya →
            </a>
          )}
        </nav>
      )}
      {selected.length > 0 && (
        <section
          id="bandingkan"
          className={s.compare}
          aria-labelledby="compare-title"
        >
          <div className={s.sectionHead}>
            <div>
              <span className={s.eyebrow}>
                Lihat berdampingan / {selected.length} dari 3 pilihan
              </span>
              <h2 id="compare-title">Bandingkan cara menjalaninya.</h2>
            </div>
            <button
              onClick={() => {
                setCompared([]);
                setStatus("Perbandingan dikosongkan.");
              }}
            >
              Kosongkan perbandingan
            </button>
          </div>
          <div
            className={s.tableScroll}
            tabIndex={0}
            role="region"
            aria-label="Tabel perbandingan jalur, geser untuk membaca"
          >
            <table>
              <thead>
                <tr>
                  <th scope="col">Pertimbangan</th>
                  {selected.map((i) => (
                    <th scope="col" key={i.id}>
                      <Link href={pathwayHref(i.slug)}>{i.title} ↗</Link>
                      <br />
                      <button
                        aria-label={`Hapus ${i.title} dari perbandingan`}
                        onClick={() => compare(i.id)}
                      >
                        Hapus pilihan
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  "Calon pembeli",
                  "Mekanisme",
                  "Langkah pertama",
                  "Risiko",
                ].map((label, n) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {selected.map((i) => (
                      <td key={i.id}>
                        {
                          [
                            i.buyer_example,
                            i.mechanisms
                              .map(
                                (m) =>
                                  monetization.mechanism_labels[
                                    m as keyof typeof monetization.mechanism_labels
                                  ],
                              )
                              .join(", "),
                            i.first_steps[0],
                            i.risks.join(" "),
                          ][n]
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <p className={s.notice}>{monetization.simulation_notice}</p>
    </section>
  );
}
