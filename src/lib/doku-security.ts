import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Dependency-free helpers shared by the Next.js server and local security tests.
// Do not pass secrets to logs or client-side code.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Base36 keeps the invoice within DOKU's 30-character limit.
export function dokuInvoice(orderId: string): string {
  if (!UUID.test(orderId)) throw new Error("Invalid order ID");
  return "KS" + BigInt("0x" + orderId.replace(/-/g, "")).toString(36).toUpperCase();
}

export function orderIdFromDokuInvoice(invoice: string): string | null {
  if (!/^KS[0-9A-Z]{1,25}$/.test(invoice)) return null;
  let value = BigInt(0);
  for (const char of invoice.slice(2)) {
    const digit = parseInt(char, 36);
    if (Number.isNaN(digit)) return null;
    value = value * BigInt(36) + BigInt(digit);
  }
  if (value > (BigInt(1) << BigInt(128)) - BigInt(1)) return null;
  const hex = value.toString(16).padStart(32, "0");
  const id = hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" +
    hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
  return dokuInvoice(id) === invoice ? id : null;
}

function digest(body: string) {
  return createHash("sha256").update(body, "utf8").digest("base64");
}

export function signature(
  clientId: string, requestId: string, timestamp: string,
  target: string, body: string, key: string, response = false,
): string {
  const payload = [
    "Client-Id:" + clientId,
    "Request-Id:" + requestId,
    (response ? "Response-Timestamp:" : "Request-Timestamp:") + timestamp,
    "Request-Target:" + target,
    "Digest:" + digest(body),
  ].join("\n");
  return "HMACSHA256=" + createHmac("sha256", key).update(payload).digest("base64");
}

export function sameSignature(a: string, b: string) {
  const left = Buffer.from(a), right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function verifyDokuHmacSignature(
  headers: Headers,
  body: string,
  clientId: string,
  secretKey: string,
  webhookPath: string,
): boolean {
  if (body.length > 32768) return false;
  const receivedClient = headers.get("client-id") || "";
  const requestId = headers.get("request-id") || "";
  const timestamp = headers.get("request-timestamp") || "";
  const provided = headers.get("signature") || "";
  if (receivedClient !== clientId || !requestId || requestId.length > 128 ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(timestamp) ||
    !provided.startsWith("HMACSHA256=")) return false;
  const expected = signature(clientId, requestId, timestamp, webhookPath, body, secretKey);
  return sameSignature(expected, provided);
}
