"use client";
import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { COMMISSION_COLUMNS, parseCommissionCsv } from "@/lib/affiliate-import";
import s from "./manager.module.css";
export function CommissionImport({
  token,
  onImported,
}: {
  token: string | null;
  onImported: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [rows, setRows] = useState<ReturnType<typeof parseCommissionCsv>>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  async function preview(file: File | undefined) {
    setRows([]);
    setError("");
    if (!file) return;
    try {
      if (file.size > 256000 || !file.name.toLowerCase().endsWith(".csv"))
        throw new Error("Pilih CSV maksimal 256 KB.");
      setRows(parseCommissionCsv(await file.text()));
    } catch (e) {
      setError(e instanceof Error ? e.message : "CSV tidak valid.");
    }
  }
  async function save() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        "/api/studio/affiliate-workspace/import-commissions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rows }),
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setNotice(
        `${result.count} komisi diimpor. Seluruh perubahan tercatat pada audit.`,
      );
      setRows([]);
      dialog.current?.close();
      onImported();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impor gagal.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className={s.actions} style={{ margin: "0 0 24px" }}>
        <button
          type="button"
          disabled={!token}
          onClick={() => {
            setRows([]);
            setError("");
            dialog.current?.showModal();
          }}
        >
          <Upload size={16} />
          Impor laporan CSV
        </button>
        {notice && <span role="status">{notice}</span>}
      </div>
      <dialog
        className={s.dialog}
        ref={dialog}
        onCancel={(e) => {
          if (busy) e.preventDefault();
        }}
      >
        <div className={s.dialogHeading}>
          <div>
            <span className={s.eyebrow}>KOMISI / REKONSILIASI</span>
            <h2>Periksa sebelum mengimpor.</h2>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => dialog.current?.close()}
            aria-label="Tutup impor"
          >
            <X />
          </button>
        </div>
        <div className={s.panel}>
          <p>
            Gunakan laporan provider, tanpa data kandidat. Maksimal 200 baris,
            256 KB. Referensi yang sudah tersimpan akan menolak seluruh impor;
            tidak ada baris yang ditimpa.
          </p>
          <details>
            <summary>Format kolom yang didukung</summary>
            <code
              style={{
                display: "block",
                overflowWrap: "anywhere",
                fontSize: 11,
                margin: "16px 0",
              }}
            >
              {COMMISSION_COLUMNS.join(",")}
            </code>
            <p>
              Tanggal ISO (YYYY-MM-DD), nominal desimal dengan titik, mata uang
              ISO. Kosongkan kolom opsional. Status earned/paid memerlukan bukti
              dan tanggal yang konsisten.
            </p>
          </details>
          <label style={{ marginTop: 24 }}>
            Laporan CSV
            <input
              type="file"
              accept=".csv,text/csv"
              disabled={busy}
              onChange={(e) => void preview(e.target.files?.[0])}
            />
          </label>
          {rows.length > 0 && (
            <>
              <h2>{rows.length} baris siap ditinjau</h2>
              <div className={s.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>Referensi provider</th>
                      <th>Nominal</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i}>
                        <td>{String(r.external_reference)}</td>
                        <td>
                          {String(r.amount ?? "Belum diketahui")} {r.currency}
                        </td>
                        <td>
                          {r.referral_status} / {r.payout_status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {error && (
            <p className={s.error} role="alert">
              {error}
            </p>
          )}
        </div>
        <footer className={s.dialogFooter}>
          <button
            type="button"
            disabled={busy}
            onClick={() => dialog.current?.close()}
          >
            Batal
          </button>
          <button
            type="button"
            className={s.primary}
            disabled={!rows.length || busy}
            onClick={() => void save()}
          >
            {busy ? "Mengimpor…" : `Konfirmasi impor ${rows.length} baris`}
          </button>
        </footer>
      </dialog>
    </>
  );
}
