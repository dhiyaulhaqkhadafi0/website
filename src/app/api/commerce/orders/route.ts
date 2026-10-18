import {
  requireUser,
  json,
  commerceConfigured,
  publishedProduct,
  sameOrigin,
} from "@/lib/commerce-server";
import { createServiceRoleClient } from "@/lib/supabase";
import { grantGuestOrder, guestFingerprint } from "@/lib/guest-order";
import { createDokuCheckout } from "@/lib/doku";
import { isAllowedDokuCheckoutUrl } from "@/lib/doku-checkout-host";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Origin tidak diizinkan." }, 403);
  const auth = request.headers.has("authorization") ? await requireUser(request) : null;
  if (auth && !auth.ok) return auth.response;
  if (Number(request.headers.get("content-length")) > 4096) return json({ error: "Data terlalu besar." }, 413);
  const raw = await request.text();
  if (raw.length > 4096) return json({ error: "Data terlalu besar." }, 413);
  let p;
  try { p = JSON.parse(raw); } catch { return json({ error: "Data checkout tidak valid." }, 400); }
  if (
    !p ||
    typeof p.slug !== "string" ||
    p.slug.length > 160 ||
    typeof p.name !== "string" ||
    !p.name.trim() ||
    p.consent !== true ||
    p.name.length > 120 ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      p.key || "",
    )
  )
    return json({ error: "Data checkout tidak valid." }, 400);
  const product = await publishedProduct(p.slug);
  if (!product) return json({ error: "Produk tidak tersedia." }, 404);
  if (!commerceConfigured(product.price > 0))
    return json({ error: "Checkout belum dibuka. Silakan kembali setelah pembayaran diaktifkan." }, 503);
  if (product.price > 0) {
    const expectedHost = new URL(process.env.DOKU_SITE_ORIGIN || "https://invalid.example").host;
    const requestHost = request.headers.get("host") || new URL(request.url).host;
    if (requestHost !== expectedHost) return json({ error: "Checkout belum aktif pada domain ini." }, 503);
  }
  const db = createServiceRoleClient();
  let user = auth?.ok ? auth.user : null;
  if (!user) {
    if (typeof p.email !== "string" || p.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return json({ error: "Email pembeli tidak valid." }, 400);
    const { error: limited } = await db.rpc("commerce_guest_attempt", { p_fingerprint: guestFingerprint(request) });
    if (limited) return json({ error: "Terlalu banyak percobaan. Silakan coba lagi nanti." }, 429);
    // Create/reuse an email identity without a password or a signed-in session.
    // The generated login link and tokens never leave this server.
    const identity = await db.auth.admin.generateLink({ type: "magiclink", email: p.email.trim().toLowerCase() });
    if (identity.error || !identity.data.user || identity.data.user.is_anonymous) return json({ error: "Checkout email belum tersedia. Coba masuk ke akunmu." }, 503);
    user = identity.data.user;
  }
  const { data, error } = await db.rpc(product.price > 0 ? "commerce_create_order_doku" : "commerce_create_order", {
    p_user: user.id,
    p_product: product.id,
    p_name: p.name.trim(),
    p_email: user.email,
    p_key: p.key,
  });
  const order = Array.isArray(data) ? data[0] : data;
  if (error || !order)
    return json(
      { error: "Pesanan belum dapat dibuat. Coba lagi beberapa saat." },
      400,
    );
  if (!auth) await grantGuestOrder(order.id);
  if (order.status === "paid") return json({ order_id: order.id });
  if (order.status !== "pending")
    return json(
      { error: "Pesanan ini sudah berakhir. Mulai checkout baru." },
      409,
    );
  if (order.provider !== "doku") return json({ error: "Pesanan masih memakai gateway lama. Mulai pesanan baru." }, 409);
  if (order.payment_url) {
    try {
      if (!isAllowedDokuCheckoutUrl(
        order.payment_url,
        process.env.DOKU_IS_PRODUCTION === "true",
      )) throw new Error("Invalid checkout URL");
      return json({ order_id: order.id, payment_url: new URL(order.payment_url).href });
    } catch { return json({ error: "Link pembayaran tidak valid." }, 409); }
  }
  try {
    const checkoutUrl = await createDokuCheckout({
      orderId: order.id,
      amount: order.total,
      email: user.email || "",
      name: p.name.trim(),
    });
    const { error: saveError } = await db
      .from("commerce_orders")
      .update({ payment_url: checkoutUrl })
      .eq("id", order.id).eq("provider", "doku").eq("status", "pending");
    if (saveError) throw new Error("Order update failed");
    return json({ order_id: order.id, payment_url: checkoutUrl });
  } catch {
    return json({
      error: "Pembayaran DOKU belum dapat dibuka. Coba lagi; pesanan yang sama akan digunakan.",
    }, 502);
  }
}
export async function GET(request: Request) {
  const auth = await requireUser(request);
  if (!auth.ok) return auth.response;
  const { data, error } = await auth.client
    .from("commerce_orders")
    .select("*,commerce_order_items(*)")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false })
    .limit(100);
  return error
    ? json({ error: "Pesanan belum dapat dimuat." }, 500)
    : json({ orders: data });
}
