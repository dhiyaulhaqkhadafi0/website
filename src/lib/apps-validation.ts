import { APP_MODELS, APP_STATES } from "./apps-types";
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const uuid = /^[0-9a-f]{8}-[0-9a-f-]{27}$/i;
export function safeAppUrl(value: string, internal = false, optional = false) {
  if (!value && optional) return true;
  if (internal) return /^\/apps\/run\/[a-z0-9-]+$/.test(value);
  try {
    const url = new URL(value);
    return (
      value.length <= 2048 &&
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.port &&
      !/[\s\\\u0000-\u001f]/.test(value) &&
      !/^(localhost$|127\.|0\.|10\.|192\.168\.|169\.254\.|172\.(?:1[6-9]|2\d|3[01])\.|\[)/.test(
        url.hostname,
      )
    );
  } catch {
    return false;
  }
}
export function validateApp(body: Record<string, unknown>) {
  const text = (key: string, max: number, required = false) => {
    const v = body[key];
    if (v != null && typeof v !== "string")
      throw new Error(`${key}: teks tidak valid.`);
    const value = String(v || "").trim();
    if (
      (required && !value) ||
      value.length > max ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)
    )
      throw new Error(`${key}: isian tidak valid (maksimal ${max} karakter).`);
    return value;
  };
  const name = text("name", 120, true),
    key = text("slug", 80, true),
    category = text("category_id", 36, true);
  if (!slug.test(key) || !uuid.test(category))
    throw new Error("Slug atau kategori tidak valid.");
  const model = text("pricing_model", 30, true),
    status = text("status", 30, true),
    deployment = text("deployment", 20, true);
  if (
    !(APP_MODELS as readonly string[]).includes(model) ||
    !(APP_STATES as readonly string[]).includes(status) ||
    !["internal", "external"].includes(deployment)
  )
    throw new Error("Konfigurasi aplikasi tidak valid.");
  const price = Number(body.price),
    allowance = Number(body.free_allowance || 0);
  if (
    !Number.isSafeInteger(price) ||
    price < 0 ||
    price > 100000000 ||
    !Number.isSafeInteger(allowance) ||
    allowance < 0 ||
    allowance > 1000000
  )
    throw new Error("Harga dan kuota harus bilangan bulat positif.");
  if ((model === "free" && price !== 0) || (model !== "free" && price <= 0))
    throw new Error("Sesuaikan harga dengan model monetisasi.");
  const terms = text("access_terms", 1500, model !== "free");
  const destination = text("destination", 2048),
    icon = text("icon_url", 2048),
    cover = text("cover_url", 2048),
    preview = text("preview_url", 2048);
  for (const v of [icon, cover, preview])
    if (!safeAppUrl(v, false, true))
      throw new Error("Gambar dan preview memerlukan URL HTTPS.");
  if (destination && !safeAppUrl(destination, deployment === "internal"))
    throw new Error("Tujuan harus HTTPS atau route aplikasi terdaftar.");
  if (["published", "maintenance"].includes(status) && !destination)
    throw new Error("Isi tujuan sebelum publikasi.");
  const rawTags = body.tags;
  const tags = Array.isArray(rawTags)
    ? rawTags
    : String(rawTags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
  if (
    tags.length > 12 ||
    tags.some((t) => typeof t !== "string" || t.length > 40)
  )
    throw new Error("Maksimal 12 tag, masing-masing 40 karakter.");
  if (body.currency && body.currency !== "IDR")
    throw new Error("Mata uang saat ini IDR.");
  return {
    name,
    slug: key,
    category_id: category,
    short_description: text("short_description", 240, true),
    description: text("description", 12000),
    name_en: text("name_en", 120),
    short_description_en: text("short_description_en", 240),
    description_en: text("description_en", 12000),
    tags,
    icon_url: icon,
    cover_url: cover,
    preview_url: preview,
    deployment,
    destination,
    pricing_model: model,
    price,
    currency: "IDR",
    access_terms: terms,
    free_allowance: allowance,
    featured: body.featured === true || body.featured === "on",
    status,
    version: text("version", 40, true),
    seo_title: text("seo_title", 160),
    seo_description: text("seo_description", 300),
  };
}
export function validateAppCategory(body: Record<string, unknown>) {
  const value = (key: string, max: number, required = false) => {
    const v = body[key];
    if (typeof v !== "string" || v.length > max || (required && !v.trim()))
      throw new Error(`${key}: isian tidak valid.`);
    return v.trim();
  };
  const key = value("slug", 80, true);
  if (!slug.test(key)) throw new Error("Slug kategori tidak valid.");
  return {
    slug: key,
    name: value("name", 100, true),
    name_en: value("name_en", 100),
    description: value("description", 500),
    description_en: value("description_en", 500),
    icon: value("icon", 40),
    sort_order: Number.isSafeInteger(Number(body.sort_order))
      ? Number(body.sort_order)
      : 0,
  };
}
