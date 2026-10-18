# DOKU Local Sandbox — Windows / Docker / Supabase

Status: preparation only; no Supabase local containers started yet.

## 1. Check disk/RAM and Docker first

From the website repo PowerShell run:
  .\scripts\doku-local-staging-preflight.ps1

The script is read-only. Report drive C/E free GB, total RAM, Docker daemon status, WSL distributions, and existing VHDX storage paths. Do not run image pulls or initialize containers before checking capacity. Budget roughly 20 GB free as a conservative planning cushion on the drive containing Docker disk images (actual need varies). Supabase recommends at least 7 GB RAM for the full local stack.

IMPORTANT: putting source files on E: does NOT automatically move Docker images/WSL virtual disk from C: to E:. Inspect Docker Desktop Settings > Resources > Advanced > Disk image location. Don't manually delete or move VHDX; don't prune, unregister WSL, or reset any databases.

## 2. Isolation contract

- Keep all source updates in Draft PR #4 (feature/doku-sandbox-checkout).
- No merge, deploy to worker khadafi, production database migrations, or live DOKU keys.
- Use a separate local workspace at E:\khadafi-doku-staging-db if disk check permits.
- NEVER run supabase link, supabase db push, or supabase db reset --linked.
- Use only fake users/products/orders. Do not copy production personal data.
- Local Supabase (Auth, REST, Storage, Postgres) must remain reachable only on localhost. Never expose Supabase Studio or Postgres to the public internet.
- For DOKU payment notification testing, tunnel only the Next.js application (HTTPS) for the webhook route.

## 3. Schema prerequisite

The existing repository migrations are *incremental*, not a complete from-scratch bootstrap. Base commerce tables live in root supabase_commerce.sql; private.is_blog_admin originates in supabase_blog_studio.sql. The DOKU migration depends on earlier commerce structures.

Do not run the repository's supabase/migrations wholesale in a new local project or call supabase db reset in the website repo. The branch now includes scripts/prepare-doku-local-schema.ps1, which creates a curated local-only chain (founder RLS prerequisite, commerce base, guest media, and DOKU migration) in the separate staging workspace. This script does not execute SQL or start Docker. Review the generated migrations before running them; keep unrelated module migrations out of this temporary sandbox.

## 4. Steps only after hardware preflight succeeds

1. Start Docker Desktop Linux containers and confirm docker info works.
2. Use Supabase CLI via npx (Node >=20) or Scoop on Windows; do not globally install via npm.\n3. From the checked-out DOKU feature branch, run scripts/prepare-doku-local-schema.ps1 -StagingRoot E:\\khadafi-doku-staging-db to assemble the 4 migrations, without executing any migrations.
4. Verify the existing local staging workspace on E: has supabase/config.toml from supabase init and a unique project id.
5. Validate the isolated local baseline migrations and enable minimal Supabase services via supabase start (-x for optional services).
6. Obtain local URL and keys via supabase status and configure website .env.local locally (git ignored). Never paste secrets in chat or commit them.
7. Before testing, enforce local Supabase URL and refuse the production Supabase project in checkout code.
8. Add DOKU Sandbox credentials only to the local server environment, not production Cloudflare settings.
9. Expose only a local Next.js HTTPS callback through a short-lived tunnel, register it at DOKU Sandbox, test signed successful and failed notifications, then stop the tunnel.
10. Validate no unauthorized e-book downloads, correct paid entitlements, idempotent payment notifications and retries.

## 5. Known blockers

- Current free disk space and Docker status have not been confirmed by the user's Windows machine.
- Local baseline migration *preparation script* is committed, but it has not been executed or tested on the user's machine. Local test credentials have not been generated.
- No HTTPS callback tunnel configured yet.
- Draft PR #4 built successfully but has not been tested end to end.

Supabase docs:
https://supabase.com/docs/guides/local-development/cli/getting-started
https://supabase.com/docs/guides/local-development/cli-workflows
https://supabase.com/docs/reference/cli/supabase-start

## 6. Checkpoint 2026-10-18: SQL smoke PASS; next light DOKU API probe

The user ran the local PostgreSQL-only Supabase stack. All 4 local migrations applied and the SQL smoke test (scripts/test-doku-local-db.ps1) PASSED:
- correct Rp59,000 pending DOKU order
- no entitlement before payment
- idempotent create and payment callback
- exactly one entitlement after paid
- rollback removed synthetic records
The user then stopped the local database safely. This is *not* a full API/webhook end-to-end test.

The paid checkout gate in src/lib/commerce-server.ts has since been corrected to use dokuConfigured() instead of requiring legacy Midtrans settings.

The next safe operation does NOT need Docker or Next.js:
1. Sync feature/doku-sandbox-checkout worktree.
2. Set DOKU_CLIENT_ID and DOKU_SECRET_KEY in the *current PowerShell process* using Sandbox credentials and private prompts; never commit or paste to chat.
3. Run node scripts/test-doku-sandbox-api.mjs.
4. Remove both environment variables after the run.
5. Share only PASS/FAILED lines, not keys, URL tokens or raw API payloads.
The script calls only api-sandbox.doku.com, creates a sandbox checkout session with Rp59,000 but no real charge, verifies response invoice/amount/host and prints NO secrets or full checkout URL.

Note: database port mapping 0.0.0.0:54322 was observed while running; before any future run, review Windows Firewall/network exposure and never forward PostgreSQL, Auth, Studio or Storage publicly. A future end-to-end HTTPS callback must expose ONLY the app-level webhook, with local Supabase never accessible directly from the internet.
