// Read-only DOKU Sandbox Non-SNAP Check Status API probe for an EXISTING invoice.
// Does NOT create invoices, payments, webhooks, entitlements or orders.
// Requires Node 24+ and DOKU Sandbox credentials in the process environment.
// Docs: GET /orders/v1/status/{invoice}; HMAC GET signature has NO Digest.
import { createHmac, randomUUID, createHash, timingSafeEqual } from "node:crypto";

const clientId = process.env.DOKU_CLIENT_ID || "";
const secretKey = process.env.DOKU_SECRET_KEY || "";
const invoice = (process.env.DOKU_SANDBOX_INVOICE || "").trim();
const expectedAmount = 59000;
const prodVars = ["DOKU_IS_PRODUCTION", "DOKU_PRODUCTION_APPROVED"];

function stop(reason) {
  console.error("STOP: " + reason);
  process.exitCode = 1;
}

function responseSignatureIsValid(headers, raw, target, id, secret) {
  const received = headers.get("signature");
  if (!received) return true; // Some successful responses omit signature.
  const timestamp = headers.get("response-timestamp") || "";
  const signedId = headers.get("request-id") || id;
  const signedClient = headers.get("client-id") || clientId;
  if (!timestamp || signedId !== id || signedClient !== clientId) return false;
  const payload = [
    "Client-Id:" + clientId,
    "Request-Id:" + id,
    "Response-Timestamp:" + timestamp,
    "Request-Target:" + target,
    "Digest:" + createHash("sha256").update(raw, "utf8").digest("base64"),
  ].join("\n");
  const expected = "HMACSHA256=" + createHmac("sha256", secret).update(payload).digest("base64");
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

if (prodVars.some(v => process.env[v] === "true")) {
  stop("Production environment detected; Sandbox read-only script refused.");
} else if (!clientId || !secretKey) {
  stop("DOKU_CLIENT_ID and DOKU_SECRET_KEY Sandbox are required.");
} else if (!/^KS[A-Z0-9]{1,25}$/.test(invoice)) {
  stop("Expected a DOKU SANDBOX invoice from this feature's smoke checkout (starts with KS).");
} else {
  const target = "/orders/v1/status/" + encodeURIComponent(invoice);
  const requestId = randomUUID();
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  // GET request: do NOT append Digest (official DOKU Non-SNAP signature spec).
  const canonical = [
    "Client-Id:" + clientId,
    "Request-Id:" + requestId,
    "Request-Timestamp:" + timestamp,
    "Request-Target:" + target,
  ].join("\n");
  const hmac = "HMACSHA256=" +
    createHmac("sha256", secretKey).update(canonical).digest("base64");
  try {
    console.log("Checking EXISTING Rp59.000 checkout through DOKU Sandbox status API...");
    const response = await fetch("https://api-sandbox.doku.com" + target, {
      method: "GET",
      headers: {
        "Client-Id": clientId,
        "Request-Id": requestId,
        "Request-Timestamp": timestamp,
        "Signature": hmac,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const raw = await response.text();
    if (raw.length > 65536) throw new Error("Oversized response");
    let parsed;
    try { parsed = JSON.parse(raw); } catch { throw new Error("Response is not JSON"); }
    if (!response.ok) throw new Error("Check Status API HTTP " + response.status);
    if (!responseSignatureIsValid(response.headers, raw, target, requestId, secretKey)) {
      throw new Error("DOKU status response signature mismatch");
    }
    // DOKU documentation models status output like a notification body.
    const payload = parsed?.response?.transaction && parsed?.response?.order
      ? parsed.response : parsed;
    const actualInvoice = payload?.order?.invoice_number;
    const amount = Number(payload?.order?.amount);
    const status = payload?.transaction?.status;
    const channel = payload?.channel?.id;
    if (typeof status !== "string" ||
        !["SUCCESS", "PENDING", "FAILED", "EXPIRED", "REFUNDED", "TIMEOUT", "REDIRECT"].includes(status)) {
      throw new Error("DOKU status field absent/unrecognized; do not assume PAID");
    }
    if (actualInvoice !== invoice || !Number.isSafeInteger(amount) || amount !== expectedAmount) {
      throw new Error("Invoice or Rp59.000 amount mismatched; do not assume PAID");
    }
    console.log("PASS: Check Status API responded with matching invoice and amount.");
    console.log("DOKU transaction.status = " + status);
    console.log("Amount = Rp59.000");
    if (typeof channel === "string" && /^[-_A-Z0-9]{1,70}$/.test(channel)) {
      console.log("Channel = " + channel);
    }
    console.log(status === "SUCCESS"
      ? "Confirmed paid by DOKU Sandbox API. No webhook received or app order updated by this script."
      : "Not confirmed paid by DOKU Sandbox API. No local order changes made.");
    console.log("READ-ONLY. Never grant ebook entitlement based only on browser redirect.");
  } catch (error) {
    stop(error instanceof Error ? error.message : "Unexpected status check error");
    console.error("Do NOT assume paid or edit the local order based on this error.");
  }
}
