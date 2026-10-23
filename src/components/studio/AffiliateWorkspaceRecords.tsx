"use client";
import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import {
  WORKSPACE_FIELDS,
  type WorkspaceRecord,
  type WorkspaceEntity,
} from "@/lib/affiliate-workspace";
import type { AffiliateReport } from "@/lib/affiliate-types";
import s from "./manager.module.css";
const labels = {
  categories: "Kategori",
  opportunities: "Discovery",
  placements: "Placements",
  experiments: "Eksperimen",
};
export function AffiliateWorkspaceRecords({
  entity,
  token,
  report,
  onChange,
}: {
  entity: WorkspaceEntity;
  token: string | null;
  report: AffiliateReport | null;
  onChange: () => void;
}) {
  const [rows, setRows] = useState<WorkspaceRecord[]>([]),
    [related, setRelated] = useState<Record<string, WorkspaceRecord[]>>({}),
    [count, setCount] = useState(0),
    [page, setPage] = useState(1),
    [refresh, setRefresh] = useState(0),
    [error, setError] = useState(""),
    [loadedKey, setLoadedKey] = useState(""),
    [editing, setEditing] = useState<WorkspaceRecord | "new" | null>(null),
    [saving, setSaving] = useState(false),
    [formError, setFormError] = useState(""),
    [program, setProgram] = useState(""),
    [link, setLink] = useState(""),
    [notice, setNotice] = useState("");
  const requestKey = entity + ":" + page + ":" + refresh;
  const loading = loadedKey !== requestKey;
  const dialog = useRef<HTMLDialogElement>(null);
  const row = editing && editing !== "new" ? editing : null;
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    void Promise.all(
      [
        entity,
        "categories",
        ...(entity === "experiments" ? ["placements"] : []),
      ].map(async (area) => {
        const response = await fetch(
          `/api/studio/affiliate-workspace/${area}?page=${area === entity ? page : 1}&lookup=${area === entity ? "0" : "1"}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
            signal: controller.signal,
          },
        );
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        return { area, ...result };
      }),
    )
      .then((results) => {
        if (controller.signal.aborted) return;
        setError("");
        setRows(results[0].rows);
        setCount(results[0].count);
        setRelated(Object.fromEntries(results.map((r) => [r.area, r.rows])));
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadedKey(requestKey);
      });
    return () => controller.abort();
  }, [entity, token, page, refresh, requestKey]);
  useEffect(() => {
    if (editing) dialog.current?.showModal();
    else dialog.current?.close();
  }, [editing]);
  const choices = (kind: string) =>
    kind === "programs"
      ? report?.programs || []
      : kind === "links"
        ? (report?.links || []).filter((l) => l.program_id === program)
        : kind === "campaigns"
          ? (report?.campaigns || []).filter(
              (c) => c.program_id === program && c.link_id === link,
            )
          : related[kind] || [];
  function open(value: WorkspaceRecord | "new") {
    setFormError("");
    setEditing(value);
    setProgram(value === "new" ? "" : value.program_id || "");
    setLink(value === "new" ? "" : value.link_id || "");
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setFormError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch(
        `/api/studio/affiliate-workspace/${entity}`,
        {
          method: row ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            ...(row ? { id: row.id, updated_at: row.updated_at } : {}),
          }),
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setEditing(null);
      setNotice("Catatan tersimpan.");
      setRefresh((v) => v + 1);
      onChange();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  }
  async function promote(value: WorkspaceRecord) {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/studio/affiliate-workspace/promote", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: value.id, updated_at: value.updated_at }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setNotice(
        "Draft program dibuat. Tinjau ketentuan dan persetujuan domain sebelum diaktifkan.",
      );
      setRefresh((v) => v + 1);
      onChange();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mempromosikan.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className={s.content} style={{ padding: 0 }}>
      <section className={s.panel}>
        <div className={s.heading} style={{ marginBottom: 24 }}>
          <div>
            <h2>{labels[entity]}</h2>
            <p>
              {entity === "opportunities"
                ? "Riset peluang, simpan sumbernya, dan pantau proses pendaftaran. Ketentuan yang diiklankan belum tentu terverifikasi."
                : entity === "placements"
                  ? "Catat lokasi publik tempat tautan muncul, dengan hubungan program dan campaign yang sesuai."
                  : entity === "experiments"
                    ? "Uji hipotesis yang spesifik. Simpan KPI, periode, dan keterbatasan hasil tanpa mengasumsikan signifikansi."
                    : "Kelompokkan program berdasarkan manfaat. Model komisi disimpan terpisah dari kategori."}
            </p>
          </div>
          <button
            type="button"
            className={s.primary}
            disabled={loading || !!error}
            onClick={() => open("new")}
          >
            <Plus size={16} />
            Tambah catatan
          </button>
        </div>
        {notice && (
          <p role="status" className={s.notice}>
            {notice}
          </p>
        )}
        {error && (
          <div className={s.error} role="alert">
            {error}
            <button type="button" onClick={() => setRefresh((v) => v + 1)}>
              Coba lagi
            </button>
          </div>
        )}
        {loading ? (
          <p role="status">Memuat catatan…</p>
        ) : (
          <>
            <div className={s.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>
                      {entity === "categories"
                        ? "Deskripsi"
                        : "Tahap / konteks"}
                    </th>
                    <th>Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.name}</strong>
                        <small>
                          {String(
                            r.provider || r.public_url || r.slug || r.kpi || "",
                          )}
                        </small>
                      </td>
                      <td>
                        {r.status && (
                          <span className={s.badge}>{r.status}</span>
                        )}
                        <small>
                          {String(
                            r.advertised_terms ||
                              r.description ||
                              r.hypothesis ||
                              r.disclosure ||
                              "",
                          )}
                        </small>
                        {entity === "placements" && (
                          <small>
                            Klik dan pendapatan per placement: belum
                            diatribusikan. Gunakan campaign khusus untuk
                            pengukuran.
                          </small>
                        )}
                      </td>
                      <td>
                        <div className={s.actions}>
                          <button type="button" onClick={() => open(r)}>
                            Edit {r.name}
                          </button>
                          {entity === "opportunities" &&
                            r.status === "approved" &&
                            !r.promoted_program_id && (
                              <button
                                type="button"
                                disabled={saving}
                                onClick={() => void promote(r)}
                              >
                                Jadikan draft program
                              </button>
                            )}
                          {!!r.promoted_program_id && (
                            <small>Sudah menjadi program</small>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!rows.length && (
              <div className={s.empty}>
                Belum ada catatan. Mulai dari data yang sudah Anda riset.
              </div>
            )}
            <div className={s.actions} style={{ marginTop: 24 }}>
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((v) => v - 1)}
              >
                ← Sebelumnya
              </button>
              <span>
                {count} catatan · halaman {page}
              </span>
              <button
                type="button"
                disabled={page * 25 >= count}
                onClick={() => setPage((v) => v + 1)}
              >
                Berikutnya →
              </button>
            </div>
          </>
        )}
      </section>
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
            <span className={s.eyebrow}>{labels[entity]}</span>
            <h2>{row?.name || "Catatan baru"}</h2>
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
          <form onSubmit={save} key={row?.id || entity}>
            <div className={s.formGrid} style={{ padding: "28px 32px" }}>
              {WORKSPACE_FIELDS[entity].map((field) => (
                <label key={field.key}>
                  {field.label}
                  {field.reference ? (
                    <select
                      name={field.key}
                      required={field.required}
                      {...(field.key === "program_id"
                        ? {
                            value: program,
                            onChange: (
                              e: React.ChangeEvent<HTMLSelectElement>,
                            ) => {
                              setProgram(e.target.value);
                              setLink("");
                            },
                          }
                        : field.key === "link_id"
                          ? {
                              value: link,
                              onChange: (
                                e: React.ChangeEvent<HTMLSelectElement>,
                              ) => setLink(e.target.value),
                            }
                          : { defaultValue: String(row?.[field.key] || "") })}
                    >
                      <option value="">
                        Pilih {field.required ? "" : "(opsional)"}
                      </option>
                      {choices(field.reference).map((v) => (
                        <option value={v.id} key={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  ) : field.options ? (
                    <select
                      name={field.key}
                      defaultValue={String(
                        row?.[field.key] || field.options[0],
                      )}
                    >
                      {field.options.map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      name={field.key}
                      rows={4}
                      required={field.required}
                      maxLength={2000}
                      defaultValue={String(row?.[field.key] || "")}
                    />
                  ) : (
                    <input
                      name={field.key}
                      type={field.type || "text"}
                      min={field.type === "number" ? 0 : undefined}
                      max={field.type === "number" ? 3650 : undefined}
                      maxLength={field.type === "url" ? 2048 : 500}
                      required={field.required}
                      defaultValue={
                        field.type === "date"
                          ? String(row?.[field.key] || "").slice(0, 10)
                          : String(row?.[field.key] ?? "")
                      }
                    />
                  )}
                </label>
              ))}
            </div>
            {formError && (
              <p className={s.error} role="alert">
                {formError}
              </p>
            )}
            <footer className={s.dialogFooter}>
              <button
                type="button"
                disabled={saving}
                onClick={() => setEditing(null)}
              >
                Batal
              </button>
              <button type="submit" className={s.primary} disabled={saving}>
                {saving ? "Menyimpan…" : "Simpan ke database"}
              </button>
            </footer>
          </form>
        )}
      </dialog>
    </div>
  );
}
