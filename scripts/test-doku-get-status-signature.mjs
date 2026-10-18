// Offline unit test; all credentials are fake; no network, no DOKU account.
// Verify DOKU Non-SNAP GET HMAC has no Digest for request AND response.
import assert from "node:assert/strict";
import { createHmac, createHash } from "node:crypto";
import {
  signedGetRequest,
  verifySignedGetResponse,
} from "./lib/doku-nonsnap-get-signature.mjs";

const clientId = "BRN-FAKE-UNIT-TEST";
const requestId = "d895fb53-479c-4f77-a76a-ab81b40d77cb";
const requestTime = "2026-10-19T00:00:00Z";
const responseTime = "2026-10-19T00:00:01Z";
const target = "/orders/v1/status/KSABCDE1234";
const secret = "DO-NOT-USE-THIS-TEST-SECRET";
function expectedSignature(parts) {
  return "HMACSHA256=" +
    createHmac("sha256", secret).update(parts.join("\n")).digest("base64");
}
const request = expectedSignature([
  "Client-Id:" + clientId,
  "Request-Id:" + requestId,
  "Request-Timestamp:" + requestTime,
  "Request-Target:" + target,
]);
assert.equal(signedGetRequest(clientId, requestId, requestTime, target, secret), request);
console.log("PASS: DOKU GET request HMAC excludes Digest");

const response = expectedSignature([
  "Client-Id:" + clientId,
  "Request-Id:" + requestId,
  "Response-Timestamp:" + responseTime,
  "Request-Target:" + target,
]);
const headers = new Headers({
  "Client-Id": clientId,
  "Request-Id": requestId,
  "Response-Timestamp": responseTime,
  "Signature": response,
});
assert.equal(verifySignedGetResponse(headers, target, requestId, clientId, secret), true);
console.log("PASS: DOKU GET response HMAC excludes Digest");

const wrongDigestResponse = expectedSignature([
  "Client-Id:" + clientId,
  "Request-Id:" + requestId,
  "Response-Timestamp:" + responseTime,
  "Request-Target:" + target,
  "Digest:" + createHash("sha256").update('{"order":{}}').digest("base64"),
]);
const signedWithWrongDigest = new Headers(headers);
signedWithWrongDigest.set("Signature", wrongDigestResponse);
assert.equal(
  verifySignedGetResponse(signedWithWrongDigest, target, requestId, clientId, secret),
  false,
);
console.log("PASS: extra POST-only Digest is NOT accepted for GET response");

const missing = new Headers(headers);
missing.delete("Signature");
assert.equal(verifySignedGetResponse(missing, target, requestId, clientId, secret), false);
console.log("PASS: missing response signature rejected");

const modified = new Headers(headers);
modified.set("Request-Id", "different-id");
assert.equal(verifySignedGetResponse(modified, target, requestId, clientId, secret), false);
assert.equal(verifySignedGetResponse(headers, "/other/status", requestId, clientId, secret), false);
assert.equal(verifySignedGetResponse(headers, target, requestId, clientId, "wrong-secret"), false);
console.log("PASS: changed Request-Id, target, or secret rejected");
console.log("SUCCESS: offline DOKU Non-SNAP GET signature test passed");
