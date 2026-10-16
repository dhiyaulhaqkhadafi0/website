# Repository audit — ecosystem redesign, 16 October 2026

The release starts from `0e518aa`, the current `origin/main`, in `E:/khadafi-website/.release/ecosystem-design` on `codex/ecosystem-design`. The primary checkout has unrelated uncommitted changes and was preserved.

## Preservation and architecture

- Next.js 16.3.3, React 19, existing Plus Jakarta Sans, CSS Modules, and OpenNext/Cloudflare Worker `khadafi`.
- Preserve the shared Navbar/Footer, authentication and authorization, commerce publication state, Freelance routes, affiliate tracking, and newsletter API/database schema.
- Preserve all eight resource slugs. Add two original guide routes. External curation opens the official provider directly rather than introducing thin local summary routes.
- Read the installed Next.js guides for layouts/pages, client boundaries, URL search parameters, and static parameters before implementation.
- Use one typed catalog for the public library, learning paths, detail metadata, and sitemap. Content stays in versioned TypeScript, with no new CMS or database.
- Public reading content is server-rendered. Browser state is restricted to filters, theme, editable worksheets, clipboard/download/print, checklist progress, and restrained motion.

## Content findings

The previous catalog links PRD, Content OS, and positioning canvas CTAs to the Notion homepage. The prompt pack advertises 24 items but contains two, and the MVP checklist advertises 32 but contains four. Public cards also show usage/efficiency claims without supporting evidence.

The new public pages supply real editable/downloadable Markdown equivalents, a complete 24-prompt pack, 32-point checklist, original Product Idea Brief with clearly fictional example, and freelance preparation guide with a 30-day plan. Existing principles and workflows are expanded without repeating unverified personal achievements, adoption counts, or performance claims.

## Baseline and boundaries

TypeScript baseline passed. Full baseline ESLint reports 101 problems (21 errors, 80 warnings), primarily in existing Studio/editor/AI code. Changed-file lint is a separate gate.

No hosted schema migration, secret rotation, provider setting changes, production test lead, paid-product activation, or new runtime dependency is part of this release. PostgreSQL newsletter persistence/consent/duplicate/unsubscribe and permissions are tested with local fixtures. Field p75 Core Web Vitals and email delivery are not implied by these tests.

The user's latest instruction authorizes direct production deployment without another approval, superseding the older approval gate in the pasted master prompt.


## Credential evidence

All nine certificate images and thirteen badge assets were inspected or checked against their issuer destinations. Nine issue dates were transcribed from the original certificate images. Kelas.com, LinkedIn Learning, and Simplilearn SkillUp issuer labels were corrected. MySkill is identified as bootcamp participation. The Google title matches its Professional Certificate. Unavailable external verification is stated and no misleading verification button is shown for it. All 20 other credential destinations returned HTTP 200; the existing Simplilearn deep link could not be automatically checked, and the LinkedIn document has no external verification URL.
