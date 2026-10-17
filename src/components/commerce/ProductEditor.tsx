"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, LoaderCircle, Save, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, type Product } from "@/lib/commerce-types";
import { commerceApi } from "./client-api";
import { BookCover } from "./BookCover";
import { ProductImage } from "./ProductImage";
import { CREATOR_NAME } from "@/lib/product-media";
import s from "./commerce.module.css";
type ProductFile = {
  id: string;
  name: string;
  version: string;
  storage_path: string;
};
const blank = {
  name: "",
  slug: "",
  short_description: "",
  description: "",
  category: "Ebook",
  price: 0,
  cover_url: "",
  creator_name: CREATOR_NAME,
  gallery: [],
  featured: false,
  status: "draft",
  included: [],
  audience: "",
  preview: "",
  seo_title: "",
  seo_description: "",
} as Omit<Product, "id" | "currency" | "created_at" | "updated_at">;
export function ProductEditor({
  initial,
  initialFiles = [],
}: {
  initial?: Product;
  initialFiles?: ProductFile[];
}) {
  const router = useRouter();
  const [p, setP] = useState(initial || blank);
  const [files, setFiles] = useState(initialFiles);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const dirty = useRef(false);
  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => {
      if (dirty.current) { event.preventDefault(); event.returnValue = ""; }
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, []);
  function field<K extends keyof typeof p>(key: K, value: (typeof p)[K]) {
    setP((prev) => ({ ...prev, [key]: value }));
    dirty.current = true;
    setNotice("");
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const data = await commerceApi(
        initial ? "/api/studio/products/" + initial.id : "/api/studio/products",
        { method: initial ? "PATCH" : "POST", body: JSON.stringify(p) },
      );
      dirty.current = false;
      setP(data.product);
      setNotice("Produk berhasil disimpan.");
      if (!initial) router.replace("/studio/products/" + data.product.id);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }
  async function upload(file: File | undefined, cover = false, gallery = false) {
    if (!file) return;
    if (!initial && !cover && !gallery) {
      setError("Simpan draft terlebih dahulu sebelum mengunggah file.");
      return;
    }
    const image = cover || gallery;
    if (file.size > (image ? 10 : 50) * 1024 * 1024) {
      setError("Ukuran maksimum " + (image ? "10" : "50") + " MB.");
      return;
    }
    if (
      image
        ? !["image/png", "image/jpeg", "image/webp"].includes(file.type)
        : ![
            "application/pdf",
            "application/zip",
            "application/x-zip-compressed",
          ].includes(file.type)
    ) {
      setError("Format file tidak didukung.");
      return;
    }
    setUploading(true);
    setError("");
    setNotice("");
    const path =
      (image ? "commerce-covers" : initial!.id) +
      "/" +
      crypto.randomUUID() +
      "." +
      (image
        ? file.type.split("/")[1]
        : file.type === "application/pdf"
          ? "pdf"
          : "zip");
    const bucket = image ? "blog-media" : "commerce-files";
    try {
      if (image) {
        const bitmap = await createImageBitmap(file);
        const valid = bitmap.width >= 200 && bitmap.height >= 200 && bitmap.width <= 12000 && bitmap.height <= 12000;
        bitmap.close();
        if (!valid) throw new Error("Dimensi gambar harus 200–12.000 px pada kedua sisi.");
      }
      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: false, contentType: file.type });
      if (error)
        throw new Error("Upload gagal. Periksa koneksi dan izin storage.");
      if (gallery) {
        setP(prev => ({ ...prev, gallery: [...(prev.gallery || []), { url: supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl, alt: file.name.replace(/\.[^.]+$/, "") }].slice(0, 12) }));
        dirty.current = true;
        setNotice("Preview diunggah. Simpan produk untuk menerapkannya.");
      } else if (cover) {
        field(
          "cover_url",
          supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl,
        );
        setNotice("Cover diunggah. Simpan produk untuk menerapkannya.");
      } else {
        const data = await commerceApi(
          "/api/studio/products/" + initial!.id + "/files",
          {
            method: "POST",
            body: JSON.stringify({ storage_path: path, name: file.name }),
          },
        );
        setFiles((prev) => [...prev, data.file]);
        setNotice("File privat berhasil ditambahkan.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal.");
    } finally {
      setUploading(false);
    }
  }
  function slugify(value: string) {
    return value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  const published = initial?.status === "published";
  return (
    <>
      <div className={s.breadcrumb}>
        <Link
          href="/studio/products"
          onClick={(e) => {
            if (
              dirty.current &&
              !window.confirm("Perubahan belum disimpan. Tinggalkan editor?")
            )
              e.preventDefault();
          }}
        >
          ← Semua produk
        </Link>
      </div>
      <div className={s.pageTitle}>
        <span className={s.eyebrow}>STUDIO / PRODUCT EDITOR</span>
        <h1>{initial ? "Bentuk produkmu." : "Mulai dari sebuah ide."}</h1>
        <p>
          {initial
            ? "Kelola isi, file, dan publikasi produk dalam satu tempat."
            : "Simpan sebagai draft, lalu tambahkan file dan lengkapi halaman produknya."}
        </p>
      </div>
      <form
        className={s.form + " " + s.editor}
        onSubmit={save}
        aria-label="Editor produk"
      >
        <section className={s.editorSection}>
          <h2>01 / Informasi produk</h2>
          <div className={s.form}>
            <label>Nama kreator<input maxLength={180} required value={p.creator_name || CREATOR_NAME} onChange={e => field("creator_name", e.target.value)} /></label>
            <label>
              Nama produk
              <input
                required
                maxLength={180}
                value={p.name}
                onChange={(e) => field("name", e.target.value)}
                onBlur={() => {
                  if (!p.slug) field("slug", slugify(p.name));
                }}
              />
            </label>
            <div className={s.fieldGrid}>
              <label>
                Slug /products/
                <input
                  required
                  maxLength={160}
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  value={p.slug}
                  onChange={(e) => field("slug", e.target.value)}
                />
              </label>
              <label>
                Kategori
                <select
                  value={p.category}
                  onChange={(e) =>
                    field("category", e.target.value as Product["category"])
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Deskripsi singkat
              <textarea
                maxLength={500}
                value={p.short_description}
                onChange={(e) => field("short_description", e.target.value)}
                style={{ minHeight: 100 }}
              />
            </label>
          </div>
        </section>
        <section className={s.editorSection}>
          <h2>02 / Harga & cover</h2>
          <div className={s.form}>
            <label>
              Harga (Rp) · isi 0 untuk produk gratis
              <input
                type="number"
                min={0}
                max={100000000}
                step={1}
                required
                value={p.price}
                onChange={(e) => field("price", Number(e.target.value))}
              />
            </label>
            <label>
              URL cover
              <input
                maxLength={2048}
                value={p.cover_url}
                onChange={(e) => field("cover_url", e.target.value)}
                placeholder="/products/cover.webp atau https://…"
              />
            </label>
            <label>
              Upload cover · PNG, JPEG, WebP · maks. 10 MB
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={uploading}
                onChange={(e) => void upload(e.target.files?.[0], true)}
              />
            </label>
            {p.cover_url && (
              <div style={{ maxWidth: 340 }}>
                <BookCover
                  name={p.name || "Cover produk"}
                  cover={p.cover_url}
                />
              </div>
            )}
          </div>
        </section>
        <section className={s.editorSection}>
          <h2>Galeri & preview produk</h2>
          <p className={s.note}>Maksimal 12 gambar publik, PNG/JPEG/WebP, 10 MB per gambar. Unggah hanya cuplikan yang boleh dilihat sebelum pembelian.</p>
          <label>Tambahkan beberapa gambar<input type="file" multiple accept="image/png,image/jpeg,image/webp" disabled={uploading || (p.gallery?.length || 0) >= 12} onChange={async e => { const selected = Array.from(e.target.files || []); if (selected.length + (p.gallery?.length || 0) > 12) { setError("Galeri maksimal 12 gambar."); return; } for (const file of selected) await upload(file, false, true); e.target.value = ""; }} /></label>
          <div className={s.mediaEditor}>{(p.gallery || []).map((media, index) => <div key={media.url + index}>
            <ProductImage src={media.url} alt={media.alt || p.name} />
            <label>Alt text<input maxLength={180} value={media.alt} onChange={e => field("gallery", (p.gallery || []).map((m, i) => i === index ? { ...m, alt: e.target.value } : m))} /></label>
            <div className={s.mediaActions}>
              <button type="button" disabled={index === 0} onClick={() => { const next = [...(p.gallery || [])]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; field("gallery", next); }}>← Geser</button>
              <button type="button" disabled={index === (p.gallery?.length || 0) - 1} onClick={() => { const next = [...(p.gallery || [])]; [next[index], next[index + 1]] = [next[index + 1], next[index]]; field("gallery", next); }}>Geser →</button>
              <button type="button" onClick={() => { field("cover_url", media.url); field("gallery", (p.gallery || []).filter((_, i) => i !== index).concat(p.cover_url ? [{ url: p.cover_url, alt: p.name + " — cover" }] : [])); }}>Jadikan cover</button>
              <button type="button" onClick={() => field("gallery", (p.gallery || []).filter((_, i) => i !== index))}>Hapus preview</button>
            </div>
          </div>)}</div>
        </section>
        <section className={s.editorSection}>
          <h2>03 / File produk privat</h2>
          <p className={s.note}>
          PDF atau ZIP, maksimum 50 MB. File baru ditambahkan tanpa mengganti
          file lama; seluruh file tetap tersedia untuk pembeli.
          </p>
          {files.map((f) => (
            <div key={f.id} className={s.fileRow}>
              <Upload size={16} />
              <span>
                {f.name} · versi {f.version}
              </span>
              <span className={s.badge}>Privat</span>
            </div>
          ))}
          <label style={{ marginTop: 20 }}>
            Tambah file
            <input
              type="file"
              accept=".pdf,.zip"
              disabled={!initial || uploading}
              onChange={(e) => void upload(e.target.files?.[0])}
            />
          </label>
          {!initial && (
            <small>Simpan draft terlebih dahulu untuk menambahkan file.</small>
          )}
          {uploading && (
            <p role="status" className={s.note}>
              Mengunggah file…
            </p>
          )}
        </section>
        <section className={s.editorSection}>
          <h2>04 / Halaman produk</h2>
          <div className={s.form}>
            <label>
              Tentang produk · pisahkan paragraf dengan baris kosong; gunakan ## Judul, **tebal**, dan - daftar
              <textarea
                maxLength={15000}
                value={p.description}
                onChange={(e) => field("description", e.target.value)}
              />
            </label>
            <label>
              Apa yang termasuk · satu poin per baris
              <textarea
                value={p.included.join("\n")}
                onChange={(e) => field("included", e.target.value.split("\n"))}
              />
            </label>
            <label>
              Cocok untuk siapa
              <textarea
                maxLength={3000}
                value={p.audience}
                onChange={(e) => field("audience", e.target.value)}
              />
            </label>
            <label>
              Cuplikan / preview teks
              <textarea
                maxLength={10000}
                value={p.preview}
                onChange={(e) => field("preview", e.target.value)}
              />
            </label>
          </div>
        </section>
        <section className={s.editorSection}>
          <h2>05 / SEO & publikasi</h2>
          <div className={s.form}>
            <label>
              Judul SEO
              <input
                maxLength={180}
                value={p.seo_title}
                onChange={(e) => field("seo_title", e.target.value)}
              />
            </label>
            <label>
              Deskripsi SEO
              <textarea
                maxLength={320}
                value={p.seo_description}
                onChange={(e) => field("seo_description", e.target.value)}
                style={{ minHeight: 100 }}
              />
            </label>
            <label>
              Status
              <select
                value={p.status}
                onChange={(e) =>
                  field("status", e.target.value as Product["status"])
                }
              >
                <option value="draft">Draft</option>
                <option value="published" disabled={!files.length}>
                  Published
                </option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label className={s.check}>
              <input
                type="checkbox"
                checked={p.featured}
                onChange={(e) => field("featured", e.target.checked)}
              />
              <span>Jadikan pilihan utama di storefront</span>
            </label>
            <small>
              Produk published harus memiliki file privat. Periksa harga final
              sebelum mempublikasikan.
            </small>
          </div>
        </section>
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
        <div className={s.saveBar}>
          <span className={s.status}>{initial ? p.status : "Draft baru"}</span>
          <div className={s.actions} style={{ marginTop: 0 }}>
            {initial && (
              <Link
                className={s.secondary}
                href={"/products/" + p.slug + (published ? "" : "?preview=1")}
                target="_blank"
              >
                Preview <ArrowUpRight />
              </Link>
            )}
            <button className={s.button} disabled={busy || uploading}>
              {busy ? <LoaderCircle className={s.spin} /> : <Save />}
              {busy
                ? "Menyimpan…"
                : p.status === "published"
                  ? "Simpan & publikasikan"
                  : "Simpan produk"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
