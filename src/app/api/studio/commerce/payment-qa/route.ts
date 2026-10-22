import { requireStudio, sameOrigin, json } from "@/lib/commerce-server";
import { createServiceRoleClient } from "@/lib/supabase";
import { checkoutForDokuOrder } from "@/lib/doku-order-checkout";
import { dokuPolicy } from "@/lib/doku-config";
export async function POST(request: Request) {
  if (process.env.DOKU_QA_ENABLED !== "true") return json({ error: "Not found" }, 404);
  if (!sameOrigin(request)) return json({ error: "Origin tidak diizinkan." }, 403);
  const auth = await requireStudio(request);
  if (!auth.ok) return auth.response;
  const allowed = (process.env.DOKU_QA_USER_IDS || "").split(",").map(x => x.trim());
  if (!allowed.includes(auth.user.id)) return json({ error: "Not found" }, 404);
  const p = await request.json().catch(() => null);
  if (!/^[a-f0-9-]{36}$/i.test(p?.key || "") || !["free", "qris"].includes(p?.mode)) return json({ error: "Invalid QA intent" }, 400);
  if (p.mode === "free" && process.env.DOKU_QA_FREE_ENABLED !== "true") return json({ error: "Not found" }, 404);
  const policy = dokuPolicy(process.env);
  if (p.mode === "qris" && (!policy.qaCheckout || !policy.qris ||
      (policy.production && process.env.DOKU_QA_LIVE_APPROVED !== "true")))
    return json({ error: "QRIS QA belum diizinkan atau kanal belum aktif." }, 503);
  const db = createServiceRoleClient();
  const { data, error } = await db.rpc("commerce_create_doku_qa_order", { p_user: auth.user.id, p_product: process.env.DOKU_QA_PRODUCT_ID, p_key: p.key, p_free: p.mode === "free" });
  const order = Array.isArray(data) ? data[0] : data;
  if (error || !order) return json({ error: "Private QA configuration unavailable" }, 503);
  if (order.status === "paid") return json({ order_id: order.id, free_test: order.provider === "free" });
  try { return json({ order_id: order.id, payment_url: await checkoutForDokuOrder(order, auth.user.email || "", "Payment QA", true) }); }
  catch { return json({ error: "Payment QA pending verification" }, 503); }
}
