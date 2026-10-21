export const CREATOR_NAME = "Daffa Dhiyaulhaq Khadafi";
export type ProductMedia = { url: string; alt: string };
const storage = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mykgtajanxczdnzekycl.supabase.co";
export function mediaUrl(value: string) {
  const raw = value.trim();
  if (raw === "/products/formula-profitable-blueprint-mockup.png")
    return "/images/experience/formula-profitable-blueprint-mockup-v1.webp";
  // Repair the published ebook's old, extensionless site path.
  if (["/products/ebook-formula-profitable-blueprint-cover", "ebook/products/ebook-formula-profitable-blueprint-cover"].includes(raw))
    return "/products/formula-profitable-blueprint-cover.webp";
  if (!raw || /[\\\r\n]/.test(raw) || raw.startsWith("//")) return "";
  if (raw.startsWith("/")) return raw;
  if (raw.startsWith("https://")) {
    try { const url = new URL(raw); return url.username || url.password ? "" : url.href; } catch { return ""; }
  }
  // Storage keys belong to the public media bucket, never the paid-file bucket.
  if (!/^[\w./ -]+$/.test(raw) || raw.split("/").some(p => p === ".." || p === ".") || !/\.(png|jpe?g|webp)$/i.test(raw)) return "";
  return storage + "/storage/v1/object/public/blog-media/" + raw.split("/").map(encodeURIComponent).join("/");
}
