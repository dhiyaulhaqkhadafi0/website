import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

// Sandbox-only server function. Never accept a caller-supplied URL or invoice
// from a browser. A checkout must already exist in our isolated order database.
const STATUS_ORIGIN = "https://api-sandbox.doku.com";
export type DokuPaymentStatus =
  "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED" | "REFUNDED" | "TIMEOUT" | "REDIRECT";
const STATES = new Set<DokuPaymentStatus>([
  "PENDING", "SUCCESS", "FAILED", "EXPIRED", "REFUNDED", "TIMEOUT", "REDIRECT",
]);
export type VerifiedDokuStatus = {
  invoice: string;
  amount: number;
  status: DokuPaymentStatus;
  channel: string | null;
};
type FetchLike = typeof fetch;

function hmac(value: string, key: string) {
  return "HMACSHA256=" +
    createHmac("sha256", key).update(value, "utf8").digest("base64");
}
function same(a: string, b: string) {
  const one = Buffer.from(a, "utf8");
  const two = Buffer.from(b, "utf8");
  return one.length === two.length && timingSafeEqual(one, two);
}
function canonicalRequest(clientId: string, requestId: string, time: string, target: string) {
  return [
    "Client-Id:" + clientId, "Request-Id:" + requestId,
    "Request-Timestamp:" + time, "Request-Target:" + target,
  ].join("\n");
}
function canonicalResponse(clientId: string, requestId: string, time: string, target: string) {
  // DOKU GET signatures, unlike POST, must NOT include Digest.
  return [
    "Client-Id:" + clientId, "Request-Id:" + requestId,
    "Response-Timestamp:" + time, "Request-Target:" + target,
  ].join("\n");
}

export async function checkDokuSandboxStatus(
  invoice: string,
  credentials: { clientId: string; secretKey: string },
  requestFetch: FetchLike = fetch,
): Promise<VerifiedDokuStatus> {
  if (!/^KS[0-9A-Z]{1,25}$/.test(invoice)) throw new Error("Invalid DOKU invoice");
  if (!credentials.clientId || !credentials.secretKey)
    throw new Error("Missing DOKU Sandbox credentials");
  const target = "/orders/v1/status/" + invoice;
  const requestId = randomUUID();
  const time = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const response = await requestFetch(STATUS_ORIGIN + target, {
    method: "GET",
    headers: {
      "Client-Id": credentials.clientId,
      "Request-Id": requestId,
      "Request-Timestamp": time,
      "Signature": hmac(
        canonicalRequest(credentials.clientId, requestId, time, target),
        credentials.secretKey,
      ),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("DOKU Sandbox status HTTP " + response.status);
  const body = await response.text();
  if (body.length > 65536) throw new Error("Oversized DOKU status response");
  const headers = response.headers;
  const receivedSignature = headers.get("signature") || "";
  const responseTime = headers.get("response-timestamp") || "";
  if (!receivedSignature.startsWith("HMACSHA256=") ||
      headers.get("request-id") !== requestId ||
      headers.get("client-id") !== credentials.clientId ||
      !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(responseTime) ||
      !same(
        receivedSignature,
        hmac(
          canonicalResponse(credentials.clientId, requestId, responseTime, target),
          credentials.secretKey,
        ),
      )) {
    throw new Error("Invalid DOKU Check Status response signature");
  }
  let parsed: unknown;
  try { parsed = JSON.parse(body); }
  catch { throw new Error("Invalid DOKU status JSON"); }
  if (!parsed || typeof parsed !== "object") throw new Error("Invalid DOKU status payload");
  const result = parsed as Record<string, unknown>;
  const nested = result.response;
  const record = nested && typeof nested === "object" ? nested as Record<string, unknown> : result;
  const order = record.order as Record<string, unknown> | null;
  const transaction = record.transaction as Record<string, unknown> | null;
  const channel = record.channel as Record<string, unknown> | null;
  const amount = Number(order?.amount);
  const status = transaction?.status;
  if (order?.invoice_number !== invoice || !Number.isSafeInteger(amount) ||
      amount <= 0 || (order?.currency != null && order.currency !== "IDR") ||
      typeof status !== "string" || !STATES.has(status as DokuPaymentStatus)) {
    throw new Error("DOKU status invoice, amount, currency, or state mismatch");
  }
  return {
    invoice,
    amount,
    status: status as DokuPaymentStatus,
    channel: typeof channel?.id === "string" ? channel.id : null,
  };
}
