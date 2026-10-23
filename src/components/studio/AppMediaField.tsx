"use client";
import { useState } from "react";
export function AppMediaField({
  name,
  label,
  value,
  token,
}: {
  name: string;
  label: string;
  value: string;
  token: string;
}) {
  const [url, setUrl] = useState(value),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function upload(file: File | undefined) {
    if (!file) return;
    setError("");
    if (
      !["image/png", "image/jpeg", "image/webp", "image/avif"].includes(
        file.type,
      ) ||
      file.size > 8 * 1024 * 1024
    ) {
      setError("Pilih PNG, JPG, WebP, atau AVIF maksimal 8 MB.");
      return;
    }
    setBusy(true);
    try {
      const data = new FormData();
      data.set("file", file);
      const response = await fetch("/api/studio/media", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setUrl(result.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gambar gagal diunggah.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <label>
        {label}
        <input
          name={name}
          type="url"
          maxLength={2048}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          disabled={busy}
        />
      </label>
      <label style={{ marginTop: 12, fontSize: 11 }}>
        Atau unggah gambar
        <input
          type="file"
          aria-label={`Unggah ${label}`}
          accept="image/png,image/jpeg,image/webp,image/avif"
          disabled={busy}
          onChange={(e) => void upload(e.target.files?.[0])}
        />
      </label>
      {busy && <p role="status">Mengunggah gambar…</p>}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
