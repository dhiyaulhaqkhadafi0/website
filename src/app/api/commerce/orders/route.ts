import {
  requireUser,
  json,
  commerceConfigured,
  publishedProduct,
} from "@/lib/commerce-server";
import { createServiceRoleClient } from "@/lib/supabase";
export async function POST(request: Request) {
  const auth = await requireUser(request);
  if (!auth.ok) return auth.response;
  const p = await request.json().catch(() => null);
  if (
    !p ||
    typeof p.slug !== "string" ||
    typeof p.name !== "string" ||
    !p.name.trim() ||
    p.name.length > 120 ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      p.key || "",
    )
  )
    return json({ error: "Data checkout tidak valid." }, 400);
  const product = await publishedProduct(p.slug);
  if (!product) return json({ error: "Produk tidak tersedia." }, 404);
  if (!commerceConfigured(product.price > 0))
    return json(
      {
        error:
          "Checkout belum dibuka. Silakan kembali setelah pembayaran diaktifkan.",
      },
      503,
    );
  const db = createServiceRoleClient();
  const { data, error } = await db.rpc("commerce_create_order", {
    p_user: auth.user.id,
    p_product: product.id,
    p_name: p.name.trim(),
    p_email: auth.user.email,
    p_key: p.key,
  });
  const order = Array.isArray(data) ? data[0] : data;
  if (error || !order)
    return json(
      { error: "Pesanan belum dapat dibuat. Coba lagi beberapa saat." },
      400,
    );
  if (order.status === "paid") return json({ order_id: order.id });
  if (order.status !== "pending")
    return json(
      { error: "Pesanan ini sudah berakhir. Mulai checkout baru." },
      409,
    );
  if (order.payment_url)
    return json({ order_id: order.id, payment_url: order.payment_url });
  const production = process.env.MIDTRANS_IS_PRODUCTION === "true";
  try {
    const response = await fetch(
      production
        ? "https://app.midtrans.com/snap/v1/transactions"
        : "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Idempotency-Key": order.id,
          Authorization:
            "Basic " +
            Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString(
              "base64",
            ),
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: order.id,
            gross_amount: order.total,
          },
          item_details: [
            {
              id: product.id,
              price: order.total,
              quantity: 1,
              name: product.name.slice(0, 50),
            },
          ],
          customer_details: {
            first_name: p.name.trim(),
            email: auth.user.email,
          },
          callbacks: {
            finish:
              "https://khadafidaffa.com/checkout/success?order=" + order.id,
          },
        }),
        signal: AbortSignal.timeout(15000),
      },
    );
    const transaction = await response.json();
    if (!response.ok || typeof transaction.redirect_url !== "string")
      throw new Error("Gateway unavailable");
    const url = new URL(transaction.redirect_url);
    if (
      url.protocol !== "https:" ||
      url.hostname !==
        (production ? "app.midtrans.com" : "app.sandbox.midtrans.com")
    )
      throw new Error("Invalid gateway");
    const { error: saveError } = await db
      .from("commerce_orders")
      .update({ payment_url: url.href })
      .eq("id", order.id);
    if (saveError) throw new Error("Order update failed");
    return json({ order_id: order.id, payment_url: url.href });
  } catch {
    return json(
      {
        error:
          "Pembayaran belum dapat dibuka. Coba lagi; pesanan yang sama akan digunakan.",
      },
      502,
    );
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
