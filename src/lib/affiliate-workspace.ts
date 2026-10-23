export const WORKSPACE_ENTITIES = [
  "categories",
  "opportunities",
  "placements",
  "experiments",
] as const;
export type WorkspaceEntity = (typeof WORKSPACE_ENTITIES)[number];
export type WorkspaceRecord = {
  id: string;
  name: string;
  slug?: string;
  status?: string;
  program_id?: string;
  link_id?: string;
  campaign_id?: string;
  category_id?: string;
  updated_at: string;
  created_at: string;
  [key: string]: unknown;
};
export type RecordField = {
  key: string;
  label: string;
  type?: "text" | "url" | "date" | "number" | "textarea";
  options?: string[];
  required?: boolean;
  reference?: "programs" | "links" | "campaigns" | "categories" | "placements";
};
export const WORKSPACE_FIELDS: Record<WorkspaceEntity, RecordField[]> = {
  categories: [
    { key: "name", label: "Nama kategori", required: true },
    { key: "slug", label: "Slug stabil", required: true },
    { key: "description", label: "Deskripsi", type: "textarea" },
  ],
  opportunities: [
    { key: "name", label: "Nama program", required: true },
    { key: "provider", label: "Provider", required: true },
    {
      key: "official_website",
      label: "Website resmi",
      type: "url",
      required: true,
    },
    {
      key: "program_url",
      label: "URL program affiliate",
      type: "url",
      required: true,
    },
    { key: "category_id", label: "Kategori", reference: "categories" },
    {
      key: "description",
      label: "Manfaat & kesesuaian niche",
      type: "textarea",
    },
    {
      key: "commission_model",
      label: "Model komisi",
      options: [
        "unknown",
        "CPA",
        "CPL",
        "revenue_share",
        "recurring",
        "one_time",
      ],
    },
    {
      key: "advertised_terms",
      label: "Ketentuan yang diiklankan (belum terverifikasi)",
      type: "textarea",
    },
    {
      key: "cookie_days",
      label: "Durasi cookie (hari, kosong jika belum diketahui)",
      type: "number",
    },
    {
      key: "payout_terms",
      label: "Minimum payout, mata uang, jadwal & metode",
      type: "textarea",
    },
    { key: "geography", label: "Negara / pembatasan wilayah" },
    { key: "eligibility", label: "Persyaratan pendaftaran", type: "textarea" },
    {
      key: "last_verified_at",
      label: "Tanggal verifikasi sumber",
      type: "date",
    },
    {
      key: "status",
      label: "Tahap riset",
      options: [
        "researching",
        "interested",
        "applied",
        "pending",
        "approved",
        "rejected",
        "inactive",
      ],
    },
    {
      key: "notes",
      label: "Catatan & referensi sumber (tanpa password)",
      type: "textarea",
    },
  ],
  placements: [
    { key: "name", label: "Nama placement", required: true },
    {
      key: "program_id",
      label: "Program",
      reference: "programs",
      required: true,
    },
    {
      key: "link_id",
      label: "Link referral",
      reference: "links",
      required: true,
    },
    {
      key: "campaign_id",
      label: "Campaign (opsional)",
      reference: "campaigns",
    },
    {
      key: "placement_type",
      label: "Jenis penempatan",
      options: [
        "blog",
        "directory",
        "resource",
        "recommendation",
        "apps",
        "homepage",
        "cta",
        "newsletter",
        "video",
        "social",
      ],
    },
    {
      key: "public_url",
      label: "URL tempat link ditampilkan",
      type: "url",
      required: true,
    },
    {
      key: "disclosure",
      label: "Teks pengungkapan affiliate",
      type: "textarea",
      required: true,
    },
    {
      key: "status",
      label: "Status",
      options: ["draft", "active", "paused", "archived"],
    },
    { key: "notes", label: "Catatan", type: "textarea" },
  ],
  experiments: [
    { key: "name", label: "Nama eksperimen", required: true },
    {
      key: "placement_id",
      label: "Placement",
      reference: "placements",
      required: true,
    },
    { key: "hypothesis", label: "Hipotesis", type: "textarea", required: true },
    { key: "cta_a", label: "CTA kontrol", required: true },
    { key: "cta_b", label: "CTA alternatif", required: true },
    { key: "kpi", label: "KPI & metode pengukuran", required: true },
    { key: "starts_at", label: "Tanggal mulai", type: "date" },
    { key: "ends_at", label: "Tanggal akhir", type: "date" },
    {
      key: "status",
      label: "Status",
      options: ["draft", "running", "completed", "archived"],
    },
    {
      key: "result_notes",
      label: "Hasil, ukuran sampel & keterbatasan",
      type: "textarea",
    },
  ],
};
export function validateWorkspace(
  entity: WorkspaceEntity,
  body: Record<string, unknown>,
) {
  const data: Record<string, unknown> = {};
  for (const field of WORKSPACE_FIELDS[entity]) {
    const raw = body[field.key];
    if (raw != null && typeof raw !== "string" && typeof raw !== "number")
      throw new Error(`${field.label}: isian tidak valid.`);
    const value = String(raw ?? "").trim();
    const max =
      field.type === "textarea"
        ? 2000
        : field.type === "url"
          ? 2048
          : field.key === "name"
            ? 120
            : 500;
    if (
      value.length > max ||
      (field.required && !value) ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)
    )
      throw new Error(`${field.label}: periksa isian.`);
    if (field.options && !field.options.includes(value))
      throw new Error(`${field.label}: pilihan tidak valid.`);
    if (field.reference) {
      if (value && !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(value))
        throw new Error("ID referensi tidak valid.");
      data[field.key] = value || null;
      continue;
    }
    if (field.type === "url" && value) {
      try {
        const u = new URL(value);
        if (
          u.protocol !== "https:" ||
          u.username ||
          u.password ||
          u.port ||
          /[\s\\]/.test(value)
        )
          throw new Error();
      } catch {
        throw new Error(`${field.label}: gunakan HTTPS yang valid.`);
      }
    }
    if (field.type === "date") {
      if (
        value &&
        (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
          !Number.isFinite(Date.parse(value)))
      )
        throw new Error("Tanggal tidak valid.");
      data[field.key] = value
        ? new Date(`${value}T00:00:00+07:00`).toISOString()
        : null;
      continue;
    }
    if (field.type === "number") {
      if (
        value &&
        (!Number.isSafeInteger(Number(value)) ||
          Number(value) < 0 ||
          Number(value) > 3650)
      )
        throw new Error("Durasi tidak valid.");
      data[field.key] = value ? Number(value) : null;
      continue;
    }
    data[field.key] = value;
  }
  if (data.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(data.slug)))
    throw new Error("Slug tidak valid.");
  if (
    data.starts_at &&
    data.ends_at &&
    String(data.starts_at) > String(data.ends_at)
  )
    throw new Error("Tanggal akhir harus setelah mulai.");
  return data;
}
