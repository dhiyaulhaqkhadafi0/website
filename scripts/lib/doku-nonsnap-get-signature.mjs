// DOKU Non-SNAP GET signature helper.
// DOKU documents Digest only for POST, including response signature validation.
// This helper never sends or logs secrets and is independent of Next.js/Docker.
import { createHmac, timingSafeEqual } from "node:crypto";

function sign(parts, secret) {
  return "HMACSHA256=" +
    createHmac("sha256", secret).update(parts.join("\n"), "utf8").digest("base64");
}

export function signedGetRequest(clientId, requestId, timestamp, target, secret) {
  return sign([
    "Client-Id:" + clientId,
    "Request-Id:" + requestId,
    "Request-Timestamp:" + timestamp,
    "Request-Target:" + target,
  ], secret);
}

export function verifySignedGetResponse(
  headers, target, requestId, clientId, secret,
) {
  const received = headers.get("signature") || "";
  const timestamp = headers.get("response-timestamp") || "";
  const responseRequestId = headers.get("request-id") || "";
  const responseClientId = headers.get("client-id") || "";
  if (!received.startsWith("HMACSHA256=") || !timestamp ||
      responseRequestId !== requestId || responseClientId !== clientId ||
      !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(timestamp)) {
    return false;
  }
  const expected = sign([
    "Client-Id:" + clientId,
    "Request-Id:" + requestId,
    "Response-Timestamp:" + timestamp,
    "Request-Target:" + target,
  ], secret);
  const actualBuffer = Buffer.from(received, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer);
}
