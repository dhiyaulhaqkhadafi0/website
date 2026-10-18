import { createServiceRoleClient } from "@/lib/supabase";
import { json } from "@/lib/commerce-server";
import { dokuInvoice, orderIdFromDokuInvoice, verifyDokuNotification } from "@/lib/doku";

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyDokuNotification(request.headers, raw)) {
    return json({ error: "Invalid DOKU signature" }, 401);
  }
  let payload: unknown;
  try { payload = JSON.parse(raw); } catch {
    return json({ error: "Invalid notification" }, 400);
  }
  const event = payload as {
    order?: { invoice_number?: unknown; amount?: unknown };
    transaction?: { status?: unknown };
  };
  const invoice = event?.order?.invoice_number;
  const status = event?.transaction?.status;
  if (typeof invoice !== "string" || typeof status !== "string") {
    return json({ error: "Invalid notification" }, 400);
  }
  // With DOKU Checkout, a failed payment attempt can be retried with another method.
  // Only authenticated SUCCESS grants the file. All other events leave it locked.
  if (status !== "SUCCESS") return json({ ok: true, ignored: true });

  const id = orderIdFromDokuInvoice(invoice);
  const amount = Number(event.order?.amount);
  if (!id || !Number.isSafeInteger(amount) || amount <= 0) {
    return json({ error: "Invalid order or amount" }, 400);
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return json({ error: "Unavailable" }, 503);
  try {
    const db = createServiceRoleClient();
    const { error } = await db.rpc("commerce_set_payment_doku", {
      p_order: id,
      p_total: amount,
      p_reference: dokuInvoice(id),
    });
    if (error) throw new Error("Payment update failed");
    console.info("commerce.doku.payment", { order_id: id, status: "paid" });
    return json({ ok: true });
  } catch {
    // Non-2xx tells DOKU to retry. Never acknowledge an unpersisted payment.
    console.error("commerce.doku.payment_retry", { invoice });
    return json({ error: "Retry notification" }, 503);
  }
}