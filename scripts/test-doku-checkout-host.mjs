// Node.js 24+ can import the type-stripped, dependency-free TypeScript guard.
// No DOKU credentials or network calls are used.
import assert from "node:assert/strict";
import { isAllowedDokuCheckoutUrl } from "../src/lib/doku-checkout-host.ts";
const cases = [
  ["https://sandbox.doku.com/checkout-link-v2/fake", false, true],
  ["https://staging.doku.com/checkout-link-v2/fake", false, true],
  ["https://jokul.doku.com/checkout/link/fake", true, true],
  ["https://staging.doku.com/checkout-link-v2/fake", true, false],
  ["https://jokul.doku.com/checkout/link/fake", false, false],
  ["http://staging.doku.com/checkout-link-v2/fake", false, false],
  ["https://staging.doku.com.evil.test/", false, false],
  ["https://notstaging.doku.com/", false, false],
  ["https://evil.test@staging.doku.com/", false, false],
  ["https://staging.doku.com@evil.test/", false, false],
  ["https://staging.doku.com:8443/", false, false],
  ["javascript:alert(1)", false, false],
];
for (const [url, production, expected] of cases) {
  assert.equal(isAllowedDokuCheckoutUrl(url, production), expected, url);
}
console.log("PASS: " + cases.length + " DOKU checkout host allowlist cases");
