import { timingSafeEqual, createHash, randomUUID } from "node:crypto";
import { createServiceRoleClient } from "@/lib/supabase";
import { dokuPolicy } from "@/lib/doku-config";
import { checkDokuStatus } from "@/lib/doku-status-check";
export const dynamic = "force-dynamic";
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
export async function POST(request: Request) {
  const policy = dokuPolicy(process.env);
  if (!policy.configured || process.env.DOKU_RECONCILE_ENABLED !== "true") return reply({ error: "Not found" }, 404);
  const expected = process.env.DOKU_RECONCILE_TOKEN || "";
  const actual = request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  const supplied = Buffer.from(actual), secret = Buffer.from(expected);
  if (secret.length < 32 || supplied.length !== secret.length || !timingSafeEqual(supplied, secret)) return reply({ error: "Unauthorized" }, 401);
  const db = createServiceRoleClient();
  const { data: states, error } = await db.rpc("commerce_claim_doku_reconciliation", { p_environment: policy.environment });
  if (error) return reply({ error: "Database unavailable" }, 503);
  const summary = { checked: 0, paid: 0, pending: 0, failed: 0 };
  for (const state of states || []) {
    let failure: string | null = null;
    try {
      const { data: order, error: readError } = await db.from("commerce_orders").select("total,currency,status,provider").eq("id", state.order_id).single();
      if (readError || !order || order.provider !== "doku" || order.currency !== "IDR" || !["pending", "paid"].includes(order.status)) throw new Error("Order mismatch");
      const result = await checkDokuStatus(state.invoice, { clientId: process.env.DOKU_CLIENT_ID || "", secretKey: process.env.DOKU_SECRET_KEY || "" }, policy.production);
      summary.checked++;
      if (result.invoice !== state.invoice || result.amount !== order.total || !["VIRTUAL_ACCOUNT_BANK_MANDIRI", "QRIS_DOKU"].includes(result.channel || "")) throw new Error("Provider mismatch");
      if (result.status === "SUCCESS") {
        const { error: writeError } = await db.rpc("commerce_record_doku_event", {
          p_order: state.order_id, p_total: order.total, p_reference: state.invoice,
          p_environment: policy.environment, p_event: "check:" + randomUUID(),
          p_hash: createHash("sha256").update(JSON.stringify(result)).digest("hex"),
          p_status: result.status, p_channel: result.channel,
        });
        if (writeError) throw new Error("Settlement unavailable");
        summary.paid++;
      } else summary.pending++;
    } catch { failure = "PROVIDER_OR_DB_ERROR"; summary.failed++; }
    const finished = await db.rpc("commerce_finish_doku_reconciliation", { p_order: state.order_id, p_token: state.lease_token, p_error: failure });
    if (finished.error) return reply({ error: "Lease persistence unavailable", ...summary }, 503);
  }
  console.info("commerce.doku.reconciliation", summary);
  return reply({ ok: true, ...summary });
}
