# Homepage Phase 2.1 — editorial correction

Implemented on 3 October 2026. This is a homepage correction, with no Services or Products phase and no deployment.

## Result

The homepage now has eight primary blocks: hero, intent router, featured work with a compact project ledger, capabilities, Freelance Journey, Knowledge, About with credentials, and newsletter with final CTA. Warm charcoal and warm paper themes replace navy surfaces. Open typography, numbered rows, restrained dividers, a Chikki product study, the existing Work Atlas, and the real portrait provide different visual rhythms.

Chikki has no public destination link. Its visual is labelled as a product study, rather than presented as an actual product screenshot. There are no invented performance metrics or client claims. Resources and the latest three articles use existing data.

The homepage composition is a Server Component. Small client components handle theme preference, a one-time 12px section reveal, inquiry, credentials, and newsletter interaction. Content is visible before JavaScript executes; reduced-motion styles disable the reveal and transitions. No UI dependency was added. Next Image handles the portrait and credential thumbnails; full-resolution originals remain available in the viewer.

## Public route safety

- Navigation and footer share deliberate configuration in `src/content/public-navigation.ts`, validated by `src/lib/public-routes.ts`.
- The public whitelist also filters sitemap entries. It does not enumerate the app directory.
- Public links to `/studio` were removed from navigation, footer, the retired home components, and the freelance case study.
- The private route, editor, APIs, and existing functionality were not modified. This change prevents public discovery through UI links; it does not change authentication.
- The existing community signup menu anchor was corrected from `#join` to the actual `#gabung` section.
- Existing homepage anchors, including `/#certifications` and `/#produk`, remain valid.

## Credentials and inquiry

Recovered the original nine certificates and thirteen badges from the earlier homepage data. Their titles, images, issuers, and verification destinations are preserved in `src/content/credentials.json`. Both additional certificate pages are included: 11 certificate pages plus 13 badge images. No credential asset was removed.

The compact credentials block opens a native modal gallery. The viewer supports previous/next, arrow keys, separate pages, zoom/reset, original image access, and existing credential verification links. Escape and focus restoration work. The inquiry modal is reused, with labelled fields, keyboard focus trapping, restored focus, reduced-motion support, and required-field validation for either contact channel.

Newsletter interaction prepares an email request. No subscription service is configured, and the interface explicitly explains that signup is not automated. It no longer reports a fabricated successful subscription. QA did not send an email, WhatsApp message, or newsletter request.

## Executed validation

- `npx tsc --noEmit`: passed.
- ESLint on all changed TypeScript/TSX and verification script files: passed.
- `node scripts/check-home-editorial.cjs`: passed; 39 deliberate navigation entries, rejected private destinations, and 24 preserved image pages.
- `node scripts/check-freelance-discovery.cjs`: passed; 23 platforms and 32 real discovery destinations.
- Sharp decoded all 24 credential images successfully.
- `npm run build`: completed with exit code 0. Next compiled, ran TypeScript, and generated 51 static pages. OpenNext produced `.open-next/worker.js`, but printed Windows package-copy diagnostics for MDX dependencies and a compatibility-date warning. Cloudflare Worker runtime was not verified or deployed.
- Local `next start` production HTTP checks: 35 public links and their anchors, 26 HTTP documents, 50 sitemap entries, and all 24 credential image HEAD requests passed. No private public link was found.
- Browser QA captured 320, 390, 768, 1024, 1280, and 1440px in both themes on the production build. Document width stayed within the viewport in all twelve cases. The desktop production browser console contained no warning or error entries during the final check.
- Mobile navigation and its Products submenu opened correctly. Inquiry Tab/Shift+Tab wrapping, Escape dismissal, and focus restoration passed. No form transmission was performed.
- All 22 credential entries were opened in the browser viewer on 320px; the modal fit the viewport. Direct `/#certifications`, arrow-key navigation, both multi-page certificates, zoom, and focus restoration were checked. All assets separately passed HTTP and decoding checks.
- Invalid newsletter email input was blocked by native validation without a success status.
- Reduced-motion behavior was inspected in source; OS-level reduced-motion emulation was not available in this browser workflow.

Screenshots and browser measurements are saved under `C:/Users/user/.codex/visualizations/2026/10/02/01a0fcac-b90e-75c1-b88e-829cf245df04`, with filenames beginning `home-phase-2-1-`. The 1440px full-page captures include the loaded portrait.

## Checkpoints and release state

Before correction: local tag `checkpoint/homepage-phase-2-before-editorial-2-1` at `9e7a25845f804005c0a426743b66553ee4828bd1`.

Final correction is saved as a separate local commit. No push or deployment is performed for Phase 2.1, consistent with the current request. The existing deployed site is unchanged.
