import { createHash } from "node:crypto";
import { isDokuSettlement } from "./doku-channels.mjs";
export type DokuNotification = {
  orderId: string; amount: number; reference: string; eventId: string;
  bodyHash: string; status: string; channel: string;
};
export type DokuWebhookDependencies = {
  verify: (headers: Headers, body: string) => boolean;
  decodeInvoice: (invoice: string) => string | null;
  invoiceForOrder: (orderId: string) => string;
  canSettle: () => boolean;
  persist: (event: DokuNotification) => Promise<void>;
};
const reply = (body: unknown, status = 200) => Response.json(body, {
  status, headers: { "Cache-Control": "private, no-store" },
});
export async function readLimitedBody(request: Request, limit: number) {
  if (Number(request.headers.get("content-length")) > limit) throw new Error("Body too large");
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new Error("Body too large"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks).toString("utf8");
}
export async function handleDokuWebhookHttp(request: Request, deps: DokuWebhookDependencies): Promise<Response> {
  let raw: string;
  try { raw = await readLimitedBody(request, 32768); }
  catch { return reply({ error: "Notification too large" }, 413); }
  if (!deps.verify(request.headers, raw)) return reply({ error: "Invalid DOKU signature" }, 401);
  let event;
  try { event = JSON.parse(raw); }
  catch { return reply({ error: "Invalid notification" }, 400); }
  const invoice = event?.order?.invoice_number, status = event?.transaction?.status;
  const amount = Number(event?.order?.amount), channel = event?.channel?.id;
  const id = typeof invoice === "string" ? deps.decodeInvoice(invoice) : null;
  if (!id || invoice !== deps.invoiceForOrder(id) || !Number.isSafeInteger(amount) || amount <= 0 ||
      (event?.order?.currency != null && event.order.currency !== "IDR") ||
      !["SUCCESS", "PENDING", "FAILED", "EXPIRED", "TIMEOUT", "REFUNDED", "DISPUTED"].includes(status) ||
      !isDokuSettlement(channel, status, event?.transaction?.type))
    return reply({ error: "Invalid notification" }, 400);
  if (!deps.canSettle()) return reply({ error: "Unavailable" }, 503);
  try {
    await deps.persist({ orderId: id, amount, reference: invoice, status, channel,
      eventId: request.headers.get("request-id") || "",
      bodyHash: createHash("sha256").update(raw).digest("hex") });
    return reply({ ok: true, ...(status !== "SUCCESS" ? { ignored: true } : {}) });
  } catch {
    // 2xx only after durable inbox + business transaction commits.
    return reply({ error: "Retry notification" }, 503);
  }
}
