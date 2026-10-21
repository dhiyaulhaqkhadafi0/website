// Open a real DOKU SANDBOX Checkout in the browser without Docker/Supabase.
// It is a standalone API smoke test, NOT app/DB/webhook end-to-end testing.
// The full checkout URL is kept in memory: never printed, stored or posted in chat.
// Requires Node 24+, DOKU_CLIENT_ID and DOKU_SECRET_KEY in current process only.
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { signature } from "../src/lib/doku-security.ts";
import { isAllowedDokuCheckoutUrl } from "../src/lib/doku-checkout-host.ts";

const clientId = process.env.DOKU_CLIENT_ID || "";
const secretKey = process.env.DOKU_SECRET_KEY || "";
const target = "/checkout/v1/payment";
const endpoint = "https://api-sandbox.doku.com" + target;
const amount = 59000;

function fail(message) {
  console.error("FAILED: " + message);
  process.exitCode = 1;
}
if (!clientId || !secretKey) {
  fail("Sandbox credentials not configured in current process.");
} else if (process.env.DOKU_IS_PRODUCTION === "true") {
  fail("Refusing to run when DOKU_IS_PRODUCTION=true.");
} else {
  try {
    const invoice = "KSTEST" + randomUUID().replace(/-/g, "").slice(0, 20).toUpperCase();
    const body = JSON.stringify({
      order: { amount, invoice_number: invoice, currency: "IDR", auto_redirect: false },
      payment: { payment_due_date: 60 },
    });
    const requestId = randomUUID();
    const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    console.log("Creating DOKU SANDBOX Checkout for Rp59.000 (no real charge)...");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": clientId,
        "Request-Id": requestId,
        "Request-Timestamp": timestamp,
        "Signature": signature(clientId, requestId, timestamp, target, body, secretKey),
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const raw = await response.text();
    if (raw.length > 65536) throw new Error("Unexpectedly large DOKU response.");
    let result;
    try { result = JSON.parse(raw); }
    catch { throw new Error("DOKU response is not JSON."); }
    if (!response.ok) {
      // Never print full API errors: sometimes responses contain sensitive identifiers.
      throw new Error("DOKU Sandbox HTTP " + response.status);
    }
    if (result?.response?.order?.invoice_number !== invoice ||
        Number(result?.response?.order?.amount) !== amount ||
        (result?.response?.order?.currency && result.response.order.currency !== "IDR") ||
        typeof result?.response?.payment?.url !== "string") {
      throw new Error("Invoice, amount, currency or checkout link did not match.");
    }
    const paymentUrl = result.response.payment.url;
    if (!isAllowedDokuCheckoutUrl(paymentUrl, false)) {
      throw new Error("DOKU checkout URL rejected by strict Sandbox host allowlist.");
    }

    // Browser link is exposed ONLY on 127.0.0.1 with a random, one-time path.
    // The DOKU payment URL itself never touches the terminal, disk or chat.
    const oneTimePath = "/open/" + randomUUID();
    let used = false;
    const server = createServer((request, reply) => {
      const allowedHost = "127.0.0.1:" + server.address().port;
      if (request.method !== "GET" || request.url !== oneTimePath ||
          request.headers.host !== allowedHost || used ||
          request.socket.remoteAddress !== "127.0.0.1") {
        reply.writeHead(404, {
          "Cache-Control": "no-store",
          "Referrer-Policy": "no-referrer",
          "X-Content-Type-Options": "nosniff",
        });
        reply.end("Not found.");
        return;
      }
      used = true;
      reply.writeHead(302, {
        "Location": paymentUrl,
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
      });
      reply.end();
      server.close();
    });
    server.on("error", () => fail("Could not create local-only browser redirect."));
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      console.log("PASS: DOKU Sandbox checkout Rp59.000 created.");
      console.log("PASS: Verified payment host = " + new URL(paymentUrl).hostname);
      console.log("");
      console.log("Open in Chrome on THIS laptop (local redirect is one-time):");
      console.log("http://127.0.0.1:" + port + oneTimePath);
      console.log("");
      console.log("Choose Mandiri VA if offered. Copy ONLY the sandbox VA into DOKU simulator.");
      console.log("Do NOT pay via actual bank/wallet app. No webhook or ebook entitlement is connected.");
      console.log("Local link expires in 10 minutes. This script quits after opening.");
    });
    setTimeout(() => server.close(), 10 * 60 * 1000).unref();
  } catch (error) {
    fail(error instanceof Error ? error.message : "Unknown error");
  }
}
