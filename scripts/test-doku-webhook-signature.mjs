import assert from "node:assert/strict";
import { createHash, createHmac, randomUUID } from "node:crypto";
import {
  dokuInvoice, orderIdFromDokuInvoice, verifyDokuHmacSignature, signature,
} from "../src/lib/doku-security.ts";

const clientId = "BRN-FAKE-LOCAL";
const secret = "local-test-secret-do-not-use-for-real-payments";
const path = "/api/commerce/doku/webhook";
const uuid = randomUUID();
const invoice = dokuInvoice(uuid);
assert.equal(orderIdFromDokuInvoice(invoice), uuid);
assert.ok(invoice.length <= 30);
assert.equal(orderIdFromDokuInvoice("KSABC!"), null);
assert.equal(orderIdFromDokuInvoice(invoice.toLowerCase()), null);
assert.throws(() => dokuInvoice("invalid-uuid"));

const payload = JSON.stringify({
  order: { invoice_number: invoice, amount: 59000 },
  transaction: { status: "SUCCESS" },
});
const requestId = randomUUID();
const timestamp = "2026-10-18T10:00:00Z";
const digest = createHash("sha256").update(payload, "utf8").digest("base64");
const stringToSign = [
  "Client-Id:" + clientId,
  "Request-Id:" + requestId,
  "Request-Timestamp:" + timestamp,
  "Request-Target:" + path,
  "Digest:" + digest,
].join("\n");
const expectedSignature = "HMACSHA256=" +
  createHmac("sha256", secret).update(stringToSign).digest("base64");

assert.equal(signature(clientId, requestId, timestamp, path, payload, secret), expectedSignature);
const headers = new Headers({
  "Client-Id": clientId,
  "Request-Id": requestId,
  "Request-Timestamp": timestamp,
  "Signature": expectedSignature,
});
assert.equal(verifyDokuHmacSignature(headers, payload, clientId, secret, path), true);
assert.equal(verifyDokuHmacSignature(headers, payload.replace("59000", "59001"), clientId, secret, path), false);
assert.equal(verifyDokuHmacSignature(headers, payload.replace("SUCCESS", "FAILED"), clientId, secret, path), false);
assert.equal(verifyDokuHmacSignature(headers, payload, clientId, "wrong-secret", path), false);
assert.equal(verifyDokuHmacSignature(headers, payload, clientId, secret, "/api/other"), false);
assert.equal(verifyDokuHmacSignature(headers, "x".repeat(32769), clientId, secret, path), false);

const tampered = new Headers(headers);
tampered.set("Signature", "HMACSHA256=wrong");
assert.equal(verifyDokuHmacSignature(tampered, payload, clientId, secret, path), false);
tampered.set("Signature", expectedSignature);
tampered.set("Client-Id", "BRN-OTHER");
assert.equal(verifyDokuHmacSignature(tampered, payload, clientId, secret, path), false);
tampered.set("Client-Id", clientId);
tampered.set("Request-Timestamp", "not-a-time");
assert.equal(verifyDokuHmacSignature(tampered, payload, clientId, secret, path), false);

console.log("PASS: 12 DOKU HMAC + invoice security assertions (fake credentials; no network)");
