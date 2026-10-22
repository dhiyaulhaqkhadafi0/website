import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { normalizeDokuCredentials, dokuTransportFailure } from "./doku-credentials.mjs";

// Server-only caller: never accept a caller-supplied URL or invoice from a browser.
// A checkout must already exist in the matching environment's order database.
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
  transactionType?: string;
  originalRequestId?: string;
  orderStatus?: string;
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

export async function checkDokuStatus(
  invoice: string,
  credentials: { clientId: string; secretKey: string },
  production = false,
  requestFetch: FetchLike = fetch,
): Promise<VerifiedDokuStatus> {
  if (!/^KS[0-9A-Z]{1,25}$/.test(invoice)) throw new Error("DOKU_STATUS_INVALID_INVOICE");
  credentials = normalizeDokuCredentials(credentials.clientId, credentials.secretKey);
  const target = "/orders/v1/status/" + invoice;
  const requestId = randomUUID();
  const time = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const response = await requestFetch((production ? "https://api.doku.com" : "https://api-sandbox.doku.com") + target, {
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
    redirect: "manual",
  }).catch(error => { throw new Error(dokuTransportFailure(error, "STATUS")); });
  if (response.status >= 300 && response.status < 400) throw new Error("DOKU_STATUS_REDIRECT_BLOCKED");
  if (!response.ok) {
    // HTTP absence/rejection never proves that an earlier checkout is safe to recreate.
    if ([401, 403].includes(response.status)) throw new Error("DOKU_STATUS_CREDENTIALS_REJECTED");
    if (response.status === 404) throw new Error("DOKU_STATUS_NOT_FOUND_UNCONFIRMED");
    if (response.status === 429) throw new Error("DOKU_STATUS_RATE_LIMITED");
    throw new Error("DOKU_STATUS_HTTP_FAILURE");
  }
  const body = await response.text();
  if (body.length > 65536) throw new Error("DOKU_STATUS_RESPONSE_TOO_LARGE");
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
    throw new Error("DOKU_STATUS_SIGNATURE_INVALID");
  }
  let parsed: unknown;
  try { parsed = JSON.parse(body); }
  catch { throw new Error("DOKU_STATUS_INVALID_JSON"); }
  if (!parsed || typeof parsed !== "object") throw new Error("DOKU_STATUS_INVALID_PAYLOAD");
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
    throw new Error("DOKU_STATUS_ORDER_MISMATCH");
  }
  return {
    invoice,
    amount,
    status: status as DokuPaymentStatus,
    channel: typeof channel?.id === "string" ? channel.id : null,
    ...(typeof transaction?.original_request_id === "string" ? { originalRequestId: transaction.original_request_id } : {}),
    ...(typeof order?.status === "string" ? { orderStatus: order.status } : {}),
    ...(typeof transaction?.type === "string" ? { transactionType: transaction.type } : {}),
  };
}
// Preserve the audited sandbox-only API for old scripts and fixtures.
export function checkDokuSandboxStatus(invoice: string, credentials: { clientId: string; secretKey: string }, requestFetch: FetchLike = fetch) {
  return checkDokuStatus(invoice, credentials, false, requestFetch);
}
