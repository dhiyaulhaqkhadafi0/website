// Dashboard/stdin copies may contain surrounding whitespace. Never log inputs.
/** @param {string} clientId @param {string} secretKey */
export function normalizeDokuCredentials(clientId, secretKey) {
  const normalized = { clientId: clientId.trim(), secretKey: secretKey.trim() };
  if (!normalized.clientId || !normalized.secretKey) throw new Error("DOKU_CREDENTIALS_MISSING");
  if (!/^[A-Za-z0-9_-]+$/.test(normalized.clientId) || /[\u0000-\u001f\u007f]/.test(normalized.secretKey)) {
    throw new Error("DOKU_CREDENTIALS_INVALID_FORMAT");
  }
  return normalized;
}

/** @param {unknown} error @param {'STATUS'|'CHECKOUT'} operation */
export function dokuTransportFailure(error, operation) {
  const detail = error && typeof error === "object" ? error : {};
  const message = "message" in detail && typeof detail.message === "string" ? detail.message : "";
  const name = "name" in detail ? detail.name : "";
  const cause = "cause" in detail && detail.cause && typeof detail.cause === "object" && "code" in detail.cause ? detail.cause.code : "";
  const prefix = "DOKU_" + operation + "_";
  if (["AbortError", "TimeoutError"].includes(String(name)) || ["ETIMEDOUT", "UND_ERR_CONNECT_TIMEOUT"].includes(String(cause))) return prefix + "TIMEOUT";
  if (/redirect/i.test(message)) return prefix + "REDIRECT_BLOCKED";
  if (/cache.*(?:not implemented|unsupported)|unsupported cache/i.test(message)) return prefix + "CACHE_UNSUPPORTED";
  if (/header|bytestring/i.test(message)) return prefix + "HEADER_INVALID";
  if (["ENOTFOUND", "EAI_AGAIN"].includes(String(cause))) return prefix + "DNS_FAILURE";
  if (["CERT_HAS_EXPIRED", "UNABLE_TO_VERIFY_LEAF_SIGNATURE", "ERR_TLS_CERT_ALTNAME_INVALID"].includes(String(cause))) return prefix + "TLS_FAILURE";
  return prefix + "TRANSPORT_FAILURE";
}
