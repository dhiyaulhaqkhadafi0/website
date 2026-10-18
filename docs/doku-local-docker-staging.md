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

Do not run the repository's supabase/migrations wholesale in a new local project or call supabase db reset in the website repo. Build a curated isolated migration chain for commerce/Auth/Storage first, test it, then add the DOKU migration in the local staging project. Keep migrations for unrelated modules out of this temporary sandbox.

## 4. Steps only after hardware preflight succeeds

1. Start Docker Desktop Linux containers and confirm docker info works.
2. Use Supabase CLI via npx (Node >=20) or Scoop on Windows; do not globally install via npm.
3. Create local staging workspace on E: with supabase init and unique project id.
4. Validate the isolated local baseline migrations and enable minimal Supabase services via supabase start (-x for optional services).
5. Obtain local URL and keys via supabase status and configure website .env.local locally (git ignored). Never paste secrets in chat or commit them.
6. Before testing, enforce local Supabase URL and refuse the production Supabase project in checkout code.
7. Add DOKU Sandbox credentials only to the local server environment, not production Cloudflare settings.
8. Expose only a local Next.js HTTPS callback through a short-lived tunnel, register it at DOKU Sandbox, test signed successful and failed notifications, then stop the tunnel.
9. Validate no unauthorized e-book downloads, correct paid entitlements, idempotent payment notifications and retries.

## 5. Known blockers

- Current free disk space and Docker status have not been confirmed by the user's Windows machine.
- Local baseline migrations and test credentials have not been generated.
- No HTTPS callback tunnel configured yet.
- Draft PR #4 built successfully but has not been tested end to end.

Supabase docs:
https://supabase.com/docs/guides/local-development/cli/getting-started
https://supabase.com/docs/guides/local-development/cli-workflows
https://supabase.com/docs/reference/cli/supabase-start
