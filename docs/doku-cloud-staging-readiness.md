# Khadafi Studio DOKU — Cloud Staging Readiness Plan

Status 2026-10-19: **PREPARATION ONLY**. Draft PR #4, `feature/doku-sandbox-checkout`. DO NOT deploy, merge, migrate production DB, use live DOKU credentials, or attach production-only preview env to this branch.

## Read-only Supabase audit (connected account)

Supabase organization `dhiyaulhaqkhadafi's Org`, org ID `opmbryosqbcxrurarzsq`, is **Free**. Two active projects:
- `Khadafi Web` `mykgtajanxczdnzekycl` (production; no writes).
- `Chikki` `zhxqjmciowxozrohutoi` (production; no writes).

Supabase Free limits two active projects across organizations for Owners/Admins; branching not included. Merely creating another Free organization does not create a new third free slot. Never pause/delete either active project, create a branch of production, or use either existing service role key for staging.

Official pricing (indicative, not a project-specific quote):
- https://supabase.com/pricing — Pro starts at USD 25/month; additional compute/project may incur more, plus usage.
- https://supabase.com/docs/guides/platform/billing-on-supabase
- https://supabase.com/docs/guides/platform/billing-faq
The operator must explicitly choose the organization and approve a fresh Supabase **get_cost** quote *before* provisioning any paid project. If preserving both existing Free projects unchanged, a **separate paid organization** for the new staging project may be preferable; that org must be created/selected explicitly by its owner. Do not silently upgrade the current Free production organization.

## Proposed isolated environment (after billing approval)

| Component | Staging | Guardrail |
|---|---|---|
| Supabase | NEW project named `khadafi-doku-staging` | Singapore `ap-southeast-1`; no real user/customer data; never Khadafi Web/Chikki |
| Database | Curated original commerce schema and DOKU RPCs | Apply only to new staging project; audit DDL before migrations |
| Storage | New project's private `commerce-files` bucket | Upload synthetic test PDF only, never real store files |
| Auth | Separate test accounts | No copied production identities |
| Payment | `api-sandbox.doku.com`, Sandbox keys only | Never production DOKU credentials |
| Web app | Dedicated preview Cloudflare Worker/host | Worker name must differ from `khadafi`; do NOT reuse prod service binding, cache R2, or environment secrets |
| Payment webhook | `https://<new-public-preview-host>/api/commerce/doku/webhook` | Must not silently inherit legacy tunnel route `doku-staging.khadafidaffa.com` |
| Reconciler | Isolated server-side operator/cron | Current endpoint only permits **localhost**, cloud execution NOT YET SUPPORTED |
| PDFs | Synthetic e-book PDF only | 15-minute temporary signed storage URL from test bucket |

**Important current-code blockers (not resolved merely by creating Supabase):**
1. `src/lib/supabase.ts` has a legacy production URL fallback. Cloud staging MUST fail closed if `NEXT_PUBLIC_SUPABASE_URL` or staging publishable key is absent, and reject both production Supabase refs. Do not inherit production preview credentials.
2. `src/lib/doku.ts` currently supports explicitly isolated local testing; site origin, webhook callback and cloud host must be validated against the **new** staging hostname/DB ref. `DOKU_LOCAL_STAGING_ONLY=true` is local-only and cannot be copied into cloud.
3. `src/app/api/internal/commerce/doku/reconcile/route.ts` explicitly requires local Supabase port 54321 and localhost:3000; it is **disabled on cloud**. Implement a dedicated cloud-staging-only operator/cron path with high-entropy server token and strict staging guards, then test its fail-closed behavior before it can run.
4. Default `wrangler.jsonc` names Worker `khadafi` and references production cache/services. Running `wrangler deploy` against it is prohibited. Prepare separate staging configuration, unique Worker/cache/storage and review bindings before any deploy. Avoid automatically deploying preview from CI with production environment variables.
5. DOKU Sandbox successfully reported `SUCCESS` via Check Status and simulator, **but did not send any observed real HTTP Notification** to our test tunnel. DOKU Support must trace this; reconciliation only assists missing notification. The signed webhook must remain supported.
6. Do not use the existing `doku-staging.khadafidaffa.com` currently mapped to local Cloudflare Tunnel as a new cloud destination until its DNS/tunnel lifecycle is explicitly reconciled.

## Sequence — staged and reversible

0. Receive explicit chosen Supabase organization, obtain actual quote with `get_cost` and obtain separate user approval for any nonzero cost. No cost assumption.
1. Provision **new isolated staging Supabase only**, record returned project ID without database/password/service secrets in source.
2. Review and apply curated Commerce base + local prereq + guest + DOKU schema *only* to staging, not bulk production migrations. Carefully check which migration creates buckets/Auth/RLS and handle prerequisite setup explicitly. Never issue `supabase link`, `db push`, or `db reset --linked` in the production repository.
3. Add cloud-only runtime guard + fake credentials/URLs regression tests; no enabled payment defaults. Verify `NEXT_PUBLIC_SUPABASE_URL` matches newly provisioned ref and is not Chikki or Khadafi production.
4. Prepare a **separate** Worker/preview project, distinct name, domain and bindings. Ensure build/preview tasks cannot deploy `khadafi` Worker accidentally.
5. Stage only *synthetic* Rp59,000 e-book and private dummy PDF; verify unpaid order cannot download. Configure Sandbox keys in staging-only secrets manager (no GitHub commits/chat).
6. Verify signed real Check Status against existing paid invoice if order linkage is possible; otherwise create one new properly linked **Sandbox** checkout only when necessary and support issue understood. Check reconciliation and webhook are idempotent and never grant for amount/signature mismatch.
7. Confirm user/guest private download, content type, 15-minute signed URL expiry, idempotent entitlement, and cancellation/error paths. Run lint/typecheck/build + isolated DB E2E with no sensitive logs.
8. Only then enable an isolated private scheduler. Leave production unmodified until a separate, explicit rollout approval.

## Evidence already recorded

- Signed real Sandbox Check Status API: `SUCCESS`, Rp59,000, Mandiri VA.
- Synthetic webhook HTTP contract tests: 15 PASS.
- Offline reconciliation regression on user's Node v24 laptop, commit `d024af1`: PASS.
- Isolated local SQL order/entitlement rollback test: PASS, but full DB+API+PDF E2E not proven.
- Production traffic/deployment and both production Supabase projects: unchanged by staging investigation.

## Gate to leave preparation phase

The owner must choose the **billing organization** and approve the specific quoted price of the **new** staging project. Only then provisioning and cloud-specific code activation may proceed. No other paid resources may be silently enabled.
