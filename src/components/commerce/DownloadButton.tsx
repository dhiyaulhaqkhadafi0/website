"use client";
import { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { commerceApi } from "./client-api";
import s from "./commerce.module.css";
export function DownloadButton({ id }: { id: string }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  async function download() {
    setBusy(true);
    setError("");
    try {
      const data = await commerceApi("/api/commerce/download", {
        method: "POST",
        body: JSON.stringify({ product_id: id }),
      });
      setFiles(data.files);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unduhan gagal.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <button
        className={s.secondary}
        onClick={() => void download()}
        disabled={busy}
      >
        {busy ? <LoaderCircle className={s.spin} /> : <Download />}
        {busy ? "Menyiapkan…" : "Unduh produk"}
      </button>
      {error && (
        <p role="alert" className={s.note}>
          {error}
        </p>
      )}
      {files.length > 0 && (
        <div className={s.downloadLinks}>
          {files.map((f) => (
            <a
              key={f.url}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {f.name} ↗
            </a>
          ))}
          <small>
            Link berlaku selama 15 menit. Buat ulang jika kedaluwarsa.
          </small>
        </div>
      )}
    </div>
  );
}
