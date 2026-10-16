"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SERVICES } from "@/content/shop";
import { INQUIRY_STATUSES, type Inquiry } from "@/lib/service-inquiry";
import s from "./shop.module.css";
const labels = { new: "Baru", contacted: "Sudah dihubungi", closed: "Selesai" };
export function StudioInquiries() {
  const [rows, setRows] = useState<Inquiry[]>([]),
    [count, setCount] = useState(0),
    [page, setPage] = useState(1),
    [status, setStatus] = useState(""),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Sesi berakhir. Silakan masuk kembali.");
      const response = await fetch(
        `/api/studio/inquiries?page=${page}&status=${status}`,
        {
          headers: { Authorization: "Bearer " + session.access_token },
          cache: "no-store",
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setRows(result.inquiries);
      setCount(result.count);
    } catch (e) {
      setRows([]);
      setError(e instanceof Error ? e.message : "Brief belum dapat dimuat.");
    } finally {
      setLoading(false);
    }
  }, [page, status]);
  useEffect(() => {
    const task = setTimeout(() => void load(), 0);
    return () => clearTimeout(task);
  }, [load]);
  async function update(id: string, value: string) {
    setSaving(id);
    setError("");
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Sesi berakhir. Silakan masuk kembali.");
      const response = await fetch("/api/studio/inquiries", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + session.access_token,
        },
        body: JSON.stringify({ id, status: value }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Status belum tersimpan.");
    } finally {
      setSaving("");
    }
  }
  return (
    <>
      <div className={s.collectionIntro} style={{ marginTop: 45 }}>
        <div>
          <span className={s.eyebrow}>PRIVATE / PROJECT INQUIRIES</span>
          <h1
            style={{ fontSize: 42, letterSpacing: "-.05em", lineHeight: 1.15 }}
          >
            Percakapan berikutnya.
          </h1>
        </div>
        <p>Brief proyek · bukan pesanan atau penjualan.</p>
      </div>
      <div className={s.filterFields}>
        <label htmlFor="owner-inquiry-status">
          Status
          <select
            id="owner-inquiry-status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua status</option>
            {INQUIRY_STATUSES.map((value) => (
              <option value={value} key={value}>
                {labels[value]}
              </option>
            ))}
          </select>
        </label>
        <button
          className={s.secondary}
          onClick={() => void load()}
          disabled={loading}
        >
          Muat ulang
        </button>
      </div>
      <p role="status" className={s.formNote}>
        {loading ? "Memuat brief..." : `${count} brief · halaman ${page}`}
      </p>
      {error && (
        <p role="alert" className={s.formError}>
          {error}
        </p>
      )}
      <div className={s.ownerList}>
        {!loading && !error && rows.length === 0 && (
          <p className={s.prose}>Belum ada brief pada pilihan ini.</p>
        )}
        {rows.map((row) => (
          <article className={s.ownerCard} key={row.id}>
            <header>
              <div>
                <h2>{row.name}</h2>
                <a href={"mailto:" + encodeURIComponent(row.email)}>{row.email}</a>
              </div>
              <time dateTime={row.created_at}>
                {new Intl.DateTimeFormat("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Jakarta",
                }).format(new Date(row.created_at))}{" "}
                WIB
              </time>
            </header>
            <p>{row.description}</p>
            <footer>
              <span>
                {SERVICES.find((service) => service.slug === row.service)
                  ?.title || row.service}
              </span>
              <span>{row.budget || "Anggaran belum ditentukan"}</span>
              <span>{row.timeline || "Waktu belum ditentukan"}</span>
              <label>
                Status{" "}
                <select
                  aria-label={`Status brief ${row.name}`}
                  value={row.status}
                  disabled={saving === row.id}
                  onChange={(e) => void update(row.id, e.target.value)}
                >
                  {INQUIRY_STATUSES.map((value) => (
                    <option value={value} key={value}>
                      {labels[value]}
                    </option>
                  ))}
                </select>
              </label>
            </footer>
            <small>
              Persetujuan: {row.consent_version} · data privat untuk tindak
              lanjut proyek
            </small>
          </article>
        ))}
      </div>
      <div className={s.actions} style={{ paddingBottom: 50 }}>
        <button
          className={s.secondary}
          disabled={page <= 1 || loading}
          onClick={() => setPage((v) => v - 1)}
        >
          Sebelumnya
        </button>
        <button
          className={s.secondary}
          disabled={page * 25 >= count || loading}
          onClick={() => setPage((v) => v + 1)}
        >
          Berikutnya
        </button>
      </div>
    </>
  );
}
