import { createHash, timingSafeEqual } from "node:crypto";
import { createServiceRoleClient } from "@/lib/supabase";
import { json } from "@/lib/commerce-server";
import { paymentStatus } from "@/lib/commerce-types";
export async function POST(request: Request) {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key || !process.env.SUPABASE_SERVICE_ROLE_KEY)
    return json({ error: "Payment integration unavailable" }, 503);
  const p = await request.json().catch(() => null);
  if (
    !p ||
    !["order_id", "status_code", "gross_amount", "signature_key"].every(
      (k) => typeof p[k] === "string",
    ) ||
    !/^[0-9a-f-]{36}$/i.test(p.order_id) ||
    !/^[0-9a-f]{128}$/i.test(p.signature_key)
  )
    return json({ error: "Invalid notification" }, 400);
  const expected = createHash("sha512")
    .update(p.order_id + p.status_code + p.gross_amount + key)
    .digest();
  if (!timingSafeEqual(expected, Buffer.from(p.signature_key, "hex")))
    return json({ error: "Invalid signature" }, 401);
  // Signature does not cover transaction_status: fetch canonical status directly.
  const production = process.env.MIDTRANS_IS_PRODUCTION === "true";
  try {
    const response = await fetch(
      (production
        ? "https://api.midtrans.com"
        : "https://api.sandbox.midtrans.com") +
        "/v2/" +
        encodeURIComponent(p.order_id) +
        "/status",
      {
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + Buffer.from(key + ":").toString("base64"),
        },
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      },
    );
    if (!response.ok) throw new Error("Status unavailable");
    const verified = await response.json();
    if (
      verified.order_id !== p.order_id ||
      verified.currency !== "IDR" ||
      !Number.isInteger(Number(verified.gross_amount)) ||
      typeof verified.transaction_id !== "string"
    )
      return json({ error: "Payment mismatch" }, 400);
    const status = paymentStatus(
      verified.transaction_status,
      verified.fraud_status,
    );
    if (!status) return json({ ok: true, ignored: true });
    const { error } = await createServiceRoleClient().rpc(
      "commerce_set_payment",
      {
        p_order: p.order_id,
        p_total: Number(verified.gross_amount),
        p_status: status,
        p_reference: verified.transaction_id,
      },
    );
    if (error) throw new Error("Payment update failed");
    console.info("commerce.payment", { order_id: p.order_id, status });
    return json({ ok: true });
  } catch {
    console.error("commerce.payment.retry", { order_id: p.order_id });
    return json({ error: "Please retry notification" }, 503);
  }
}
