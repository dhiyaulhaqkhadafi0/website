import { requireUser, json, commerceConfigured } from "@/lib/commerce-server";
import { createServiceRoleClient } from "@/lib/supabase";
export async function POST(request: Request) {
  const auth = await requireUser(request);
  if (!auth.ok) return auth.response;
  const p = await request.json().catch(() => null);
  if (!p || typeof p.product_id !== "string")
    return json({ error: "Produk tidak valid." }, 400);
  const { data, error } = await auth.client
    .from("commerce_entitlements")
    .select("id,expires_at")
    .eq("user_id", auth.user.id)
    .eq("resource_id", p.product_id)
    .eq("resource_type", "product")
    .eq("status", "active");
  if (
    error ||
    !data?.some((e) => !e.expires_at || Date.parse(e.expires_at) > Date.now())
  )
    return json({ error: "Akun ini belum memiliki akses produk." }, 403);
  if (!commerceConfigured())
    return json(
      { error: "Unduhan belum tersedia. Silakan coba kembali." },
      503,
    );
  const db = createServiceRoleClient();
  const { data: files, error: fileError } = await db
    .from("commerce_product_files")
    .select("storage_path,name")
    .eq("product_id", p.product_id)
    .order("created_at", { ascending: false });
  if (fileError || !files?.length)
    return json({ error: "File belum tersedia." }, 404);
  const urls = await Promise.all(
    files.map(async (file) => {
      const { data, error } = await db.storage
        .from("commerce-files")
        .createSignedUrl(file.storage_path, 900, { download: file.name });
      if (error || !data) throw new Error("Signed download failed");
      return { name: file.name, url: data.signedUrl };
    }),
  ).catch(() => null);
  return urls
    ? json({ files: urls })
    : json({ error: "Link unduhan gagal dibuat." }, 502);
}
