"use client";
import { useState, useSyncExternalStore } from "react";
import s from "./resource-reading.module.css";
type CheckItem = { id: string; group: string; label: string };
type Saved = { template?: string; checked?: string[] };
const fallback = new Map<string, string>();
const subscribe = (callback: () => void) => {
  window.addEventListener("learning-workspace-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("learning-workspace-change", callback);
    window.removeEventListener("storage", callback);
  };
};
export function ResourceTools({
  slug,
  title,
  template = "",
  checklist = [],
  markdown,
}: {
  slug: string;
  title: string;
  template?: string;
  checklist?: CheckItem[];
  markdown: string;
}) {
  const key = "khadafi-learning-v1:" + slug;
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(key) || fallback.get(key) || "";
      } catch {
        return fallback.get(key) || "";
      }
    },
    () => "",
  );
  let saved: Saved = {};
  try {
    const parsed = JSON.parse(raw || "{}");
    saved = {
      template:
        typeof parsed.template === "string" ? parsed.template : undefined,
      checked: Array.isArray(parsed.checked)
        ? parsed.checked.filter((x: unknown) => typeof x === "string")
        : [],
    };
  } catch {}
  const text = saved.template ?? template;
  const checked = new Set(saved.checked || []);
  const [status, setStatus] = useState("");
  function save(value: Saved) {
    const encoded = JSON.stringify(value);
    fallback.set(key, encoded);
    try {
      localStorage.setItem(key, encoded);
    } catch {
      setStatus(
        "Penyimpanan browser tidak tersedia. Unduh catatan sebelum menutup halaman.",
      );
    }
    window.dispatchEvent(new Event("learning-workspace-change"));
  }
  function toggle(id: string) {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    save({ ...saved, checked: [...next] });
  }
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("Teks berhasil disalin.");
    } catch {
      setStatus(
        "Belum dapat menyalin otomatis. Pilih teks di kolom template, lalu gunakan perintah salin pada perangkatmu.",
      );
    }
  }
  function download() {
    let value = template ? markdown.replace(template, () => text) : markdown;
    for (const item of checklist)
      if (checked.has(item.id))
        value = value.replace(
          "- [ ] " + item.group + ": " + item.label,
          "- [x] " + item.group + ": " + item.label,
        );
    const url = URL.createObjectURL(
      new Blob([value], { type: "text/markdown;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = slug + ".md";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Materi dan catatan kerja telah diunduh sebagai Markdown.");
  }
  return (
    <section
      id="workspace"
      className={s.workspace}
      aria-labelledby="workspace-title"
    >
      <div className={s.workspaceHeading}>
        <div>
          <p className={s.kicker}>Dari membaca ke mencoba</p>
          <h2 id="workspace-title">Ruang kerjamu.</h2>
        </div>
        <span aria-hidden="true">↗</span>
      </div>
      <p className={s.workspaceNote}>
        Perubahan tersimpan pada browser ini, tanpa akun. Unduh untuk menyimpan
        salinan pribadi atau melanjutkan di perangkat lain.
      </p>
      {checklist.length > 0 && (
        <div className={s.checklist}>
          <div className={s.progressLabel}>
            <h3>Checklist interaktif</h3>
            <span aria-live="polite">
              {checklist.filter((i) => checked.has(i.id)).length} /{" "}
              {checklist.length} diperiksa
            </span>
          </div>
          <progress
            aria-label="Kemajuan pemeriksaan"
            max={checklist.length}
            value={checklist.filter((i) => checked.has(i.id)).length}
          />
          {[...new Set(checklist.map((i) => i.group))].map((group) => (
            <fieldset key={group}>
              <legend>{group}</legend>
              {checklist
                .filter((i) => i.group === group)
                .map((item) => (
                  <label key={item.id}>
                    <input
                      type="checkbox"
                      checked={checked.has(item.id)}
                      onChange={() => toggle(item.id)}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
            </fieldset>
          ))}
          <button
            className={s.quietButton}
            type="button"
            onClick={() => {
              save({ ...saved, checked: [] });
              setStatus(
                "Centang checklist dikosongkan. Catatan template tetap tersimpan.",
              );
            }}
          >
            Kosongkan centang
          </button>
        </div>
      )}
      {template && (
        <div className={s.template}>
          <label htmlFor={"template-" + slug}>
            Template yang bisa kamu edit
          </label>
          <textarea
            id={"template-" + slug}
            aria-label={"Template " + title}
            value={text}
            onChange={(e) => save({ ...saved, template: e.target.value })}
            spellCheck={false}
            rows={17}
          />
          <pre className={s.printTemplate}>{text}</pre>
          <button
            className={s.quietButton}
            type="button"
            onClick={() => {
              save({ ...saved, template });
              setStatus("Template kembali ke versi awal.");
            }}
          >
            Gunakan template awal
          </button>
        </div>
      )}
      <div className={s.toolActions}>
        {template && (
          <button
            type="button"
            className={s.primaryButton}
            onClick={() => copy(text)}
          >
            Salin template <span aria-hidden="true">↗</span>
          </button>
        )}
        <button type="button" onClick={download}>
          Unduh Markdown ↓
        </button>
        <button type="button" onClick={() => window.print()}>
          Cetak / simpan PDF ↗
        </button>
      </div>
      <p className={s.toolStatus} role="status" aria-live="polite">
        {status}
      </p>
    </section>
  );
}
export function CopyPrompt({ text }: { text: string }) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Disalin ✓");
    } catch {
      setStatus("Pilih teks untuk menyalin.");
    }
  }
  return (
    <div className={s.copyPrompt}>
      <button type="button" onClick={copy}>
        Salin prompt ↗
      </button>
      <span role="status" aria-live="polite">
        {status}
      </span>
    </div>
  );
}
