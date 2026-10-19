## End-to-end SYNTHETIC signed webhook → REAL Next → DB → PDF (2026-10-19)

**PASS** on disposable GitHub Actions runner: https://github.com/dhiyaulhaqkhadafi0/website/actions/runs/39207319512 — PR #4, commit `a3cd7f9`.

This run builds on the previous private-PDF E2E. Instead of calling the privileged payment RPC directly to simulate completion, the test now sends fake HMAC-signed **HTTP POST** to the actual local Next route `/api/commerce/doku/webhook` using a CI-only inert Client ID and fake secret; the real route verifies HMAC and calls the real Supabase RPC. It then checks paid order persistence, a single entitlement after repeated SUCCESS, and downloads the actual synthetic private PDF via the authenticated user/guest route. No DOKU API traffic is generated and these are NOT genuine provider-generated notifications.

Verified safeguards: unsigned/forged/wrong-path signatures rejected (401), signed FAILED ignored (2xx without settlement), wrong amount or unknown invoice causes non-2xx (503) with no entitlement, valid signed SUCCESS settles (2xx) and retry stays idempotent. Unpaid, other user, tampered guest cookie and expired/revoked authorization protections remain independently tested. Real DOKU webhook delivery remains unresolved and requires Support.

Security gates: only on ephemeral GitHub-hosted runner, localhost Next and Supabase; CI-only fake credentials set on individual Next/start and test steps, never project secrets; root job defaults `DOKU_ENABLED=false`. No new Supabase hosted project, paid DOKU simulation, production keys, merge, database migration or deployment.

---

# Khadafi Studio — Private PDF Download E2E (zero-cost CI)

**As of 2026-10-19: GitHub Actions PASS**, using real Next.js HTTP handlers + isolated Supabase Auth, Postgres, REST and Storage in the ephemeral standard Ubuntu GitHub runner. This was NOT a live DOKU payment or production/hosted Supabase test.

**Run:** https://github.com/dhiyaulhaqkhadafi0/website/actions/runs/39203136980

## CI implementation

- Test source: `scripts/test-doku-private-pdf-e2e.mjs`
- Reusable workflow: `.github/workflows/doku-isolated-sql.yml`
- Runner: `ubuntu-24.04`, Node 24, temporary local Supabase CLI 4 curated commerce migrations; Next.js dev server loopback `127.0.0.1:3000`.
- The test job confirms NO remote Supabase/DOKU credentials are inherited. It obtains LOCAL-only development credentials from `supabase status -o env` without printing them, and does not provision or contact any user's real Supabase project.
- Creates two fabricated Supabase Auth users with random test passwords and a draft synthetic Rp59,000 product, attaches a fake noncommercial PDF to `commerce-files`, then publishes it.
- Calls `commerce_create_order_doku` using a local service-role account to create a proper **pending** checkout/order record.
- Requests the REAL Next.js endpoints `POST /api/commerce/download` and `POST /api/commerce/guest-download` using a genuine locally issued Auth bearer token or a fixture cookie following the current guest order HMAC contract.
- Calls `commerce_set_payment_doku` with an explicitly **simulated already-authenticated SUCCESS** decision. It is NOT triggered by a real DOKU webhook/Check Status provider call in this test.
- Downloads the actual PDF via the temporary URL returned by the Next route, verifies bytes match the test fixture; then revokes entitlement and confirms no new download URL is issued.

## Verified outcomes

1. API denies anonymous download, both users when pending, guest access without valid order ownership, tampered guest cookie, and incorrect Origin.
2. Supabase private Storage bucket disallows public URL download and anonymous signed URL creation.
3. Wrong-payment-amount RPC fails without entitlement; valid settlement succeeds; identical retry yields exactly ONE active entitlement.
4. Auth user A can obtain/download own PDF after paid. Auth user B and unauthenticated callers cannot request a link to A's purchase. Valid signed guest order cookie can request a link after paid.
5. Signed private Storage URL works and includes temporary signed token; issuing a new link is forbidden after entitlement revocation.

**Important bearer-token limitation:** A Supabase signed Storage URL can be opened by ANYONE who obtains the URL until expiry; it is not cryptographically tied to the intended viewer's account. The app issues links with 900s (15-minute) expiry. An immediate revocation prevents issuance of further links but does not necessarily revoke previously issued signed URLs. Avoid claiming that sharing an issued URL is impossible.

## Remaining blockers

- Real DOKU Sandbox payment status WAS verified separately by official signed Check Status API, but REAL HTTP Notification from DOKU never appeared in the tunnel test; needs DOKU merchant support trace.
- Still no verified single chain of real DOKU Checkout payment -> live webhook or reconciliation -> real persisted order -> full customer UI. E2E private PDF test uses a local pre-validated payment simulation.
- No scheduler started or deployed. Draft PR #4 must remain unmerged; no production Supabase/Chikki account, Worker, Cloudflare tunnel, or DOKU production configuration may be modified.

## Reproduce

The workflow automatically triggers for PR #4 changes in the download routes, guest owner helper, SQL migrations, or test file. Standard runners are free for public repositories subject to GitHub policies. The runner and all synthetic data are discarded when the CI job finishes. Re-running the job NEVER makes a real purchase.

Local Docker on an 8 GB laptop is not required.

