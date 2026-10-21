import {
  requireUser,
  json,
  commerceConfigured,
  publishedProduct,
  sameOrigin,
} from "@/lib/commerce-server";
import { createServiceRoleClient } from "@/lib/supabase";
import { grantGuestOrder, guestFingerprint } from "@/lib/guest-order";
import { checkoutForDokuOrder } from "@/lib/doku-order-checkout";
import { readLimitedBody } from "@/lib/doku-webhook-handler";
import { isCheckoutMethod, checkoutMethodAllowed } from "@/lib/checkout-methods";
import { dokuPolicy } from "@/lib/doku-config";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Origin tidak diizinkan." }, 403);
  const auth = request.headers.has("authorization") ? await requireUser(request) : null;
  if (auth && !auth.ok) return auth.response;
  if (!auth && process.env.COMMERCE_GUEST_CHECKOUT_ENABLED !== "true")
    return json({ error: "Masuk ke akun untuk membeli dan menyimpan akses ebook." }, 401);
  if (Number(request.headers.get("content-length")) > 4096) return json({ error: "Data terlalu besar." }, 413);
  let raw: string;
  try { raw = await readLimitedBody(request, 4096); }
  catch { return json({ error: "Data terlalu besar." }, 413); }
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
  const method = p.method === undefined ? "all" : p.method;
  if (!isCheckoutMethod(method) || (product.price > 0 && !checkoutMethodAllowed(method, dokuPolicy(process.env))))
    return json({ error: "Metode pembayaran tidak tersedia. Pilih metode lain." }, 400);
  if (!commerceConfigured(product.price > 0))
    return json({ error: "Checkout belum dibuka. Silakan kembali setelah pembayaran diaktifkan." }, 503);
  if (product.price > 0) {
    const expectedHost = new URL(process.env.DOKU_SITE_ORIGIN || "https://invalid.example").host;
    const requestHost = request.headers.get("host") || new URL(request.url).host;
    const localCheckout = process.env.DOKU_LOCAL_STAGING_ONLY === "true" &&
      process.env.DOKU_IS_PRODUCTION !== "true" &&
      ["localhost:3000", "127.0.0.1:3000"].includes(requestHost);
    if (requestHost !== expectedHost && !localCheckout) {
      return json({ error: "Checkout belum aktif pada domain ini." }, 503);
    }
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
  if (order.status === "paid") return json({ order_id: order.id, status: "paid" });
  if (order.status !== "pending")
    return json(
      { error: "Pesanan ini sudah berakhir. Mulai checkout baru." },
      409,
    );
  if (order.provider !== "doku") return json({ error: "Pesanan masih memakai gateway lama. Mulai pesanan baru." }, 409);
  try {
    const checkoutUrl = await checkoutForDokuOrder(order, user.email || "", p.name.trim(), false, method);
    return json({ order_id: order.id, payment_url: checkoutUrl });
  } catch (error) {
    const messages: Record<string, string> = {
      DOKU_CREDENTIALS_REJECTED: "DOKU menolak konfigurasi pembayaran toko. Hubungi kami untuk memeriksa pesanan ini.",
      DOKU_RATE_LIMITED: "DOKU sedang membatasi permintaan. Periksa pesananmu sebelum mencoba kembali.",
      DOKU_CHECKOUT_REJECTED: "DOKU belum dapat membuat halaman pembayaran. Periksa pesananmu; status ini belum merupakan konfirmasi pembayaran.",
      DOKU_CHECKOUT_PENDING: "Pesanan sebelumnya belum memiliki link pembayaran yang terverifikasi. Periksa pesananmu sebelum mengulang pembayaran.",
      DOKU_METHOD_LOCKED: "Metode pesanan ini sudah dipilih. Lanjutkan pesanan sebelumnya melalui Riwayat Pembelian; jangan membuat pembayaran ganda.",
      DOKU_METHOD_UNAVAILABLE: "Metode pembayaran ini belum tersedia. Pilih metode lain.",
    };
    const code = error instanceof Error ? error.message : "";
    return json({
      error: messages[code] || "Halaman pembayaran DOKU belum berhasil disiapkan. Periksa pesananmu; belum ada konfirmasi pembayaran yang diterima.",
      code: /^DOKU_[A-Z_]+$/.test(code) ? code : "DOKU_CHECKOUT_UNKNOWN",
    }, ["DOKU_CHECKOUT_PENDING", "DOKU_METHOD_LOCKED"].includes(code) ? 409 : 502);
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
