// Offline, real HTTP contract test of the EXACT handler called by Next.js.
// No Docker, Supabase, Next.js, DOKU API, credentials, or real money.
// Node 24+ runs the imported dependency-free .ts modules.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import {
  signature, verifyDokuHmacSignature, dokuInvoice, orderIdFromDokuInvoice,
} from "../src/lib/doku-security.ts";
import { handleDokuWebhookHttp } from "../src/lib/doku-webhook-handler.ts";

const clientId = "BRN-FAKE-LOCAL";
const secretKey = "fake-test-secret-not-real";
const webhookPath = "/api/commerce/doku/webhook";
const orderId = randomUUID();
const unpaidId = randomUUID();
const invoice = dokuInvoice(orderId);
const unpaidInvoice = dokuInvoice(unpaidId);

const orders = new Map([
  [orderId, { total: 59000, status: "pending", references: new Set() }],
  [unpaidId, { total: 59000, status: "pending", references: new Set() }],
]);
const entitlements = new Set();
let databaseEnabled = true;
let forceDatabaseError = false;
let numberOfPersists = 0;
const dependencies = {
  verify: (headers, body) =>
    verifyDokuHmacSignature(headers, body, clientId, secretKey, webhookPath),
  decodeInvoice: orderIdFromDokuInvoice,
  invoiceForOrder: dokuInvoice,
  canSettle: () => databaseEnabled,
  persist: async ({orderId: id, amount, reference, status}) => {
    numberOfPersists++;
    if (forceDatabaseError) throw new Error("Simulated DB unavailable");
    const row = orders.get(id);
    if (!row || row.total !== amount || reference !== dokuInvoice(id)) {
      throw new Error("Incorrect invoice/amount or unknown order");
    }
    if(status !== "SUCCESS") return;
    row.status = "paid";
    row.references.add(reference);
    entitlements.add(id);
  },
};
const server = createServer(async (incoming, outgoing) => {
  if (incoming.method !== "POST" || incoming.url !== webhookPath) {
    outgoing.writeHead(404); outgoing.end(); return;
  }
  try {
    const chunks = [];
    for await (const part of incoming) chunks.push(part);
    const body = Buffer.concat(chunks);
    const request = new Request("http://127.0.0.1" + webhookPath, {
      method: "POST",
      headers: incoming.headers,
      body,
    });
    const response = await handleDokuWebhookHttp(request, dependencies);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(await response.text());
  } catch {
    outgoing.writeHead(500); outgoing.end('{"error":"harness failed"}');
  }
});

function event(invoiceNumber = invoice, amount = 59000, status = "SUCCESS") {
  return JSON.stringify({
    service: { id: "VIRTUAL_ACCOUNT" },
    channel: { id: "VIRTUAL_ACCOUNT_BANK_MANDIRI" },
    order: { invoice_number: invoiceNumber, amount },
    transaction: {
      status,
      date: "2026-10-18T16:30:00Z",
      original_request_id: randomUUID(),
    },
  });
}
function signedHeaders(body, target = webhookPath) {
  const requestId = randomUUID();
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  return {
    "Content-Type": "application/json",
    "Client-Id": clientId,
    "Request-Id": requestId,
    "Request-Timestamp": timestamp,
    "Signature": signature(clientId, requestId, timestamp, target, body, secretKey),
  };
}
function check(label, assertion) {
  assertion();
  console.log("PASS: " + label);
}

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(0, "127.0.0.1", resolve);
});
const base = "http://127.0.0.1:" + server.address().port + webhookPath;
async function send(body, headers = signedHeaders(body)) {
  const r = await fetch(base, {
    method: "POST", headers, body,
    signal: AbortSignal.timeout(5000),
  });
  return { status: r.status, data: await r.json() };
}

try {
  check("unpaid order begins locked", () => {
    assert.equal(orders.get(orderId).status, "pending");
    assert.equal(entitlements.size, 0);
  });
  let result = await send(event(), { "Content-Type": "application/json" });
  check("unsigned SUCCESS rejected 401", () => assert.equal(result.status, 401));
  result = await send(event(unpaidInvoice, 59000, "FAILED"));
  check("signed FAILED safely ignored", () => {
    assert.equal(result.status, 200);
    assert.equal(result.data.ignored, true);
    assert.equal(orders.get(unpaidId).status, "pending");
    assert.equal(entitlements.size, 0);
  });
  result = await send("{unparseable");
  check("signed malformed JSON rejected 400", () => assert.equal(result.status, 400));
  result = await send(JSON.stringify({ order: {invoice_number: invoice}, transaction: {} }));
  check("missing transaction status rejected 400", () => assert.equal(result.status, 400));
  const original = event();
  result = await send(original.replace("59000", "59001"), signedHeaders(original));
  check("tampered signed amount rejected 401", () => assert.equal(result.status, 401));
  result = await send(original, signedHeaders(original, "/other/notification"));
  check("signature for wrong target rejected 401", () => assert.equal(result.status, 401));
  result = await send(event("INVALID_INVOICE"));
  check("invalid invoice rejected 400", () => assert.equal(result.status, 400));
  result = await send(event(invoice, 0));
  check("nonpositive amount rejected 400", () => assert.equal(result.status, 400));
  result = await send(event(invoice, 59001));
  check("signed incorrect amount does not grant access", () => {
    assert.equal(result.status, 503);
    assert.equal(orders.get(orderId).status, "pending");
    assert.equal(entitlements.size, 0);
  });
  databaseEnabled = false;
  result = await send(event());
  check("unavailable settlement returns 503 for retry", () => assert.equal(result.status, 503));
  databaseEnabled = true;
  forceDatabaseError = true;
  result = await send(event());
  check("database failure returns 503 and grants no access", () => {
    assert.equal(result.status, 503);
    assert.equal(entitlements.size, 0);
  });
  forceDatabaseError = false;
  result = await send(event());
  check("signed valid SUCCESS marks paid and grants one entitlement", () => {
    assert.equal(result.status, 200);
    assert.equal(orders.get(orderId).status, "paid");
    assert.equal(entitlements.size, 1);
  });
  result = await send(event());
  check("duplicate signed SUCCESS remains idempotent", () => {
    assert.equal(result.status, 200);
    assert.equal(entitlements.size, 1);
    assert.equal(orders.get(orderId).references.size, 1);
  });
  check("different unpaid order stays locked", () => {
    assert.equal(orders.get(unpaidId).status, "pending");
    assert.equal(entitlements.has(unpaidId), false);
  });
  console.log("SUCCESS: 15 HTTP webhook contract tests passed; no database or live gateway used.");
} catch (error) {
  console.error("FAILED: " + (error instanceof Error ? error.message : "Unexpected error"));
  process.exitCode = 1;
} finally {
  await new Promise((resolve) => server.close(resolve));
}
