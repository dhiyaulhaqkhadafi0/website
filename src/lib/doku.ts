import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const CHECKOUT_PATH = "/checkout/v1/payment";
export const DOKU_WEBHOOK_PATH = "/api/commerce/doku/webhook";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Base36 keeps the invoice under DOKU's 30-character card payment limit.
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
  const id = hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
  return dokuInvoice(id) === invoice ? id : null;
}

function digest(body: string) {
  return createHash("sha256").update(body, "utf8").digest("base64");
}

function signature(
  clientId: string, requestId: string, timestamp: string,
  target: string, body: string, key: string, response = false,
) {
  const payload = [
    "Client-Id:" + clientId,
    "Request-Id:" + requestId,
    (response ? "Response-Timestamp:" : "Request-Timestamp:") + timestamp,
    "Request-Target:" + target,
    "Digest:" + digest(body),
  ].join("\n");
  return "HMACSHA256=" + createHmac("sha256", key).update(payload).digest("base64");
}

function sameSignature(a: string, b: string) {
  const left = Buffer.from(a), right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function credentials() {
  const clientId = process.env.DOKU_CLIENT_ID || "";
  const secretKey = process.env.DOKU_SECRET_KEY || "";
  if (!clientId || !secretKey) throw new Error("DOKU credentials are missing");
  return { clientId, secretKey };
}

export function dokuConfigured() {
  const production = process.env.DOKU_IS_PRODUCTION === "true";
  const origin = process.env.DOKU_SITE_ORIGIN || "";
  try {
    const url = new URL(origin);
    const validOrigin = url.protocol === "https:" && url.origin === origin && !url.username && !url.password;
    const approved = !production || (
      process.env.DOKU_PRODUCTION_APPROVED === "true" &&
      origin === "https://khadafidaffa.com"
    );
    // Prevent inadvertently redirecting live customers to sandbox checkout.
    return process.env.DOKU_ENABLED === "true" &&
      Boolean(process.env.DOKU_CLIENT_ID && process.env.DOKU_SECRET_KEY) &&
      validOrigin && approved && (production || origin !== "https://khadafidaffa.com");
  } catch { return false; }
}

export function verifyDokuNotification(headers: Headers, body: string): boolean {
  if (!dokuConfigured() || body.length > 32768) return false;
  const { clientId, secretKey } = credentials();
  const receivedClient = headers.get("client-id") || "";
  const requestId = headers.get("request-id") || "";
  const timestamp = headers.get("request-timestamp") || "";
  const provided = headers.get("signature") || "";
  if (receivedClient !== clientId || !requestId || requestId.length > 128 ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(timestamp) ||
    !provided.startsWith("HMACSHA256=")) return false;
  const expected = signature(clientId, requestId, timestamp, DOKU_WEBHOOK_PATH, body, secretKey);
  return sameSignature(expected, provided);
}

export async function createDokuCheckout(input: {
  orderId: string; amount: number; email: string; name: string;
}): Promise<string> {
  if (!dokuConfigured()) throw new Error("DOKU is not enabled");
  const { clientId, secretKey } = credentials();
  const production = process.env.DOKU_IS_PRODUCTION === "true";
  const invoice = dokuInvoice(input.orderId);
  const body = JSON.stringify({
    order: {
      amount: input.amount,
      invoice_number: invoice,
      currency: "IDR",
      callback_url: process.env.DOKU_SITE_ORIGIN + "/checkout/success?order=" + input.orderId,
      callback_url_result: process.env.DOKU_SITE_ORIGIN + "/checkout/success?order=" + input.orderId,
      auto_redirect: false,
    },
    payment: { payment_due_date: 60 },
    customer: { name: input.name, email: input.email },
  });
  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const response = await fetch(
    (production ? "https://api.doku.com" : "https://api-sandbox.doku.com") + CHECKOUT_PATH,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": clientId,
        "Request-Id": requestId,
        "Request-Timestamp": timestamp,
        Signature: signature(clientId, requestId, timestamp, CHECKOUT_PATH, body, secretKey),
      },
      body,
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    },
  );
  const raw = await response.text();
  if (raw.length > 65536) throw new Error("Unexpected DOKU response");
  const result = JSON.parse(raw);
  if (!response.ok) throw new Error("DOKU checkout creation failed");

  // If the server includes a response signature, authenticate the body as well.
  const responseSignature = response.headers.get("signature");
  if (responseSignature) {
    const responseTime = response.headers.get("response-timestamp") || "";
    const signedClient = response.headers.get("client-id") || clientId;
    const signedId = response.headers.get("request-id") || requestId;
    if (!responseTime || signedClient !== clientId || signedId !== requestId ||
      !sameSignature(signature(clientId, requestId, responseTime, CHECKOUT_PATH, raw, secretKey, true), responseSignature)) {
      throw new Error("Invalid DOKU response signature");
    }
  }
  if (result?.response?.order?.invoice_number !== invoice ||
    Number(result?.response?.order?.amount) !== input.amount ||
    (result?.response?.order?.currency && result.response.order.currency !== "IDR") ||
    typeof result?.response?.payment?.url !== "string") {
    throw new Error("DOKU response does not match the order");
  }
  const url = new URL(result.response.payment.url);
  if (url.protocol !== "https:" || url.username || url.password ||
    !((production && url.hostname === "jokul.doku.com") ||
      (!production && url.hostname === "sandbox.doku.com"))) {
    throw new Error("Unexpected DOKU checkout URL");
  }
  return url.toString();
}