import { guestOrder } from "@/lib/guest-order";
import { createServiceRoleClient } from "@/lib/supabase";
import { json, sameOrigin } from "@/lib/commerce-server";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Origin tidak diizinkan." }, 403);
  const input = await request.json().catch(() => null);
  if (typeof input?.order !== "string" || typeof input?.product !== "string") return json({ error: "Pesanan tidak valid." }, 400);
  const order = await guestOrder(input.order);
  if (!order || order.status !== "paid" || !order.commerce_order_items.some((item: { product_id: string }) => item.product_id === input.product)) return json({ error: "Akses pesanan tidak tersedia." }, 403);
  const db = createServiceRoleClient();
  const { data: entitlements, error } = await db.from("commerce_entitlements").select("expires_at").eq("order_id", order.id).eq("user_id", order.user_id).eq("resource_id", input.product).eq("resource_type", "product").eq("status", "active");
  if (error || !entitlements?.some(e => !e.expires_at || Date.parse(e.expires_at) > Date.now())) return json({ error: "Akses produk sudah berakhir." }, 403);
  const { data: files, error: fileError } = await db.from("commerce_product_files").select("storage_path,name").eq("product_id", input.product).order("created_at", { ascending: false });
  if (fileError || !files?.length) return json({ error: "File belum tersedia." }, 404);
  const urls = await Promise.all(files.map(async file => {
    const { data, error } = await db.storage.from("commerce-files").createSignedUrl(file.storage_path, 900, { download: file.name });
    if (error || !data) throw new Error("Download unavailable");
    return { name: file.name, url: data.signedUrl };
  })).catch(() => null);
  return urls ? json({ files: urls }) : json({ error: "Unduhan belum dapat dibuat." }, 502);
}
