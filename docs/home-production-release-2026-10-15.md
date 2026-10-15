# Homepage, shared accounts, and legal navigation release

Released on 15 October 2026 to https://khadafidaffa.com.

## Source and deployment

| Item | Verified value |
| --- | --- |
| Base | `e611bbf4e73a435e167f8fa4d8e4d4db0f90a88b` (`origin/main`, Micro1/Affiliate Manager release) |
| Application source | `31b86dbe19f042db76678846361b491dd79d6fa6` |
| Release branch | `codex/home-production` |
| Worker | `khadafi` |
| Production version | `3f2e047f-229b-4600-bfe9-0e76d4eb9574`, verified at 100% traffic |
| Previous version for rollback | `4f337135-cc46-4620-b1d0-af0232793ee0` |
| R2 cache | 58 build-scoped entries uploaded successfully; existing cache retained |
| Public client scan | 125 generated files checked against the one locally available private credential; no matching value found |

This release was prepared in an isolated checkout based on current main. The older dirty working tree was preserved. Micro1, signed referral routes, Affiliate Manager, and existing Cloudflare bindings and secrets were retained. No published paid product or payment-provider activation was added. Subsequent changes in this release report are documentation only and do not change the tested application source.

## Visible changes

The Indonesian homepage connects products, services, learning resources, freelance work, articles, credentials, and the founder profile. Motion includes restrained transitions, active button states, changing copy, and a pause control; reduced-motion preferences are respected.

The footer has larger spacing, readable groups, six real social account destinations supplied by the owner, and one consistent information row in this order: **Tentang**, **Kebijakan Privasi**, **Syarat & Ketentuan**, **Cookies**, **Changelog**. Privacy, terms, cookies, and changelog use a shared responsive reading layout with section navigation and canonical URLs. Legal copy describes actual account, newsletter, purchase, referral, and infrastructure behavior without inventing a company policy or refund deadline.

Optional Google Translate is loaded only after explicit consent and a non-Indonesian language selection. Cookies provides persistent allow/disable controls. Normal visits and consent alone do not load Google's script.

The shared login distinguishes member and founder destinations; server and database permission checks determine actual founder access. Existing Affiliate Manager remains linked inside the private workspace. Public discovery does not expose Studio routes.

## Hosted database and newsletter

Migration `20261013053325_homepage_newsletter_and_studio_access.sql` was applied successfully to the Khadafi Web project. It adds the homepage consent source and tightens founder authorization against the verified authenticated user and existing protected allowlist. Hosted rollback-safe SQL checks confirmed that a spoofed owner email with a different user ID is denied, member access cannot read private subscribers/orders, and the verified allowlisted owner is recognized. Synthetic transaction data was rolled back.

Production newsletter verification used one uniquely identified `.invalid` address. Signup returned a personalized response only after persistence; a duplicate retained the existing preference; unsubscribe succeeded twice; resubmitting stayed inactive. Hosted SQL confirmed exactly one row with source `homepage`, consent version `khadafi-updates-v1`, and status `unsubscribed`. Only that exact synthetic row was deleted, followed by verification that zero remained.

## Validation

- Clean webpack Next production build and TypeScript check passed with `NEXT_PRIVATE_STANDALONE=true`.
- Cloudflare OpenNext packaging and deployment both exited successfully. Physical dependencies were installed from the lockfile to avoid resolution through the older checkout's dependency junction. Windows package-copy warnings remained non-fatal; the deployed published article body was verified separately.
- Targeted ESLint passed. The older full-repository lint checkpoint has unrelated legacy failures; this release does not claim a globally clean lint run.
- Eight home server checks, eleven commerce security checks, thirty affiliate security checks, ten embedded PostgreSQL checks, and the public navigation/credential audit passed.
- Fifteen browser groups passed locally and again on the production domain: legal pages at 360/390/768/1440 px, one heading, no horizontal overflow, five footer destinations, canonical URLs, optional translation consent/revocation, homepage, Micro1, public routes, anonymous private-route/API protection, cross-origin newsletter rejection, and zero uncaught errors.
- Additional live checks passed for a currently published article and substantive body, About, footer logo loading, all six exact social URLs, and sitemap inclusion/exclusion.

Sanitized logs, screenshots, browser results, deployment status, and newsletter checks are in ignored `artifacts/home-ecosystem/` and `artifacts/legal-release/` in the release checkout.

## Verification boundaries

No hosted signed-in owner UI CRUD, real customer purchase, payment settlement, or email delivery is claimed. Newsletter persistence does not send a welcome email or campaign. Existing Supabase security-advisor findings were unchanged by this migration and remain separate maintenance work.

The legacy filesystem MDX sample `/blog/mantra-pertama` is unavailable on the Worker; current published database-backed articles render successfully. This existing storage/runtime limitation was not expanded into a blog migration during the footer release. The earlier `home-ecosystem-refinement.md` is a historical local checkpoint; the hosted and deployment evidence above supersedes its pending-release status.
