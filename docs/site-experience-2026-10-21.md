# Website experience, performance and SEO release — 21 October 2026

Scope: the ten requested improvements on the existing Khadafi website. Built from the latest verified DOKU production source, in the clean release checkout on `codex/site-speed-experience`. The primary working directory's unrelated edits were not imported. Ebook price remains Rp59,000; payment verification, order settlement, entitlement and download authorization code remain unchanged.

## Acceptance map

| Request | Implementation |
| --- | --- |
| Faster interaction and a distinctive loader | Shared orbit/thread navigation feedback; real App Router loading boundaries with reserved skeleton space; project modal downloaded on demand; navbar auth SDK deferred outside the initial render; concurrent duplicate session lookups suppressed; public article reads deduplicated per request with React.cache, without caching prices or sessions across requests. |
| Premium search animation | A masked conic border and restrained focus halo on both product and resource searches. Decorative layers never intercept pointer input; reduced motion disables animation. Search updates use local history and 150–160 ms debounce. |
| Mobile navigation | Fixed viewport-bounded expanded navbar; a scroll container sized with dvh, touch panning and overscroll containment; nonshrinking accordion items; body scroll restored on close and desktop resize. The long manual language list scrolls separately. |
| Premium portrait frame | Layered arched frame, a quiet glass reflection and monogram seal; the original portrait is retained as an optimized derivative. |
| Remove duplicated About link | Removed only Perjalanan & Fokus from the navigation data. Existing About, credentials, Lab and changelog destinations remain. |
| Authentication visuals | Responsive editorial split layout, illustrated learning notes, a focused form panel, refined account-purpose cards and light/dark support. Login, registration, OTP shouldCreateUser:false, password rules, consent and server authorization are preserved. |
| Chikki visual | Thin-bezel laptop composition containing the supplied interface image. The caption identifies the preview as a concept rather than real transaction data. |
| Resources banner and hero | Responsive HCFTL cover linking to the real collection, followed by an illustrated learning desk, floating note, orbit animation and resource seal. All existing learning resources, filters, paths and downloads remain. |
| SEO and AdSense readiness | Crawl audit, article H1 correction, escaped article JSON-LD, nonduplicated homepage brand title, parallel sitemap reads, real product lastModified values and URL deduplication. Published ads.txt matching the existing verified publisher metadata. |
| Automatic language offer | First-party request-local Cloudflare country hint plus browser language; 93 selectable languages and English fallback. A nonblocking offer remembers dismissal for 30 days. Google loads only after explicit translation consent. Authentication, account, checkout, API and Studio paths are excluded; public product pages remain translatable. |

## Media and runtime changes

The supplied raster images were resized/encoded for delivery without changing their artwork. Derivatives are self-contained in `public/images/experience`; raw reference files were not added to the release. Rebuild derivatives with `scripts/optimize-experience-media.cjs`, optionally supplying the reference resource folder.

| Asset | Source bytes | Delivered derivative bytes |
| --- | ---: | ---: |
| Shared brand | 1,122,020 | 5,982 |
| HCFTL cover, desktop | 2,025,841 | 94,788 |
| HCFTL cover, mobile | 2,025,841 | 36,864 |
| Chikki concept | 1,705,078 | 131,430 |
| Portrait | 77,996 | 24,088 |

Versioned image filenames receive immutable cache headers. Fixed dimensions reserve image space; below-fold visuals load lazily. These byte reductions are file-level comparisons, not claims that the original complete files were necessarily transferred by the previous image optimizer.

## Initial production audit

All 164 sitemap URLs returned HTTP 200 with canonical URLs and descriptions. Three bundled blog articles had two H1 elements; their body H1s are now section H2s while preserving anchor IDs. `/ads.txt` returned 404. Existing publisher metadata was independently verified as `ca-pub-2795731884245055`, so ads.txt declares the same account.

Cold-browser local lab samples, with browser cache disabled, before release:

| Route | LCP ms | CLS | Transferred bytes | JS bytes |
| --- | ---: | ---: | ---: | ---: |
| / | 2,844 | 0 | 416,085 | 290,046 |
| /products | 1,448 | 0 | 909,961 | 321,674 |
| /resources | 1,016 | 0 | 422,156 | 296,058 |
| /login | 492 | 0 | 460,964 | 318,096 |

These are single-run Chromium measurements from this machine, without network throttling. They are not field Core Web Vitals or a Lighthouse score. New illustrations change page content and affect byte comparisons. The matching post-deployment run is required before drawing performance conclusions.

## Verification before publication

- Targeted ESLint and TypeScript checks passed.
- Node tests verify locale precedence, 93 unique language options, private-route exclusions, no-store geo responses, trusted Cloudflare country selection and unchanged application/scheduler delegation.
- Browser checks exercised actual touch scrolling at 320×568, 390×600 and 844×390, expanded submenus, the full language list, Escape and body-scroll restoration.
- Search, empty state/reset, reduced motion, navigation progress, member/founder purpose selection, OTP/password mode, registration requirements and the auth light theme passed. No registration, email send or payment was performed.
- US/Japanese visitor fixtures verify automatic suggestions, explicit consent and remembered dismissal. Provider stubs test script loading boundaries; a separate real Google Translate test changed the resource heading to “Something new to learn. New ideas to be realized.”
- Public/private translation boundaries preserve normal Indonesian source URLs. Private routes never initialize the translation widget; entering them from an already translated document reloads the page to discard third-party script state.
- Screenshots at 390/1440 pixels were inspected, including decoded portrait imagery, the laptop and the resource hero. No horizontal overflow or uncaught browser errors were observed in the completed visual run. Development Fast Refresh caused transient test interruptions; final hosted verification uses the stable production release.
- Existing 11 commerce security checks, 22 QRIS safety checks, Checkout response, supported-channel and scheduler-route tests passed offline.

## Google and advertising boundaries

Technical crawlability does not prove that Google has indexed every URL. Search Console indexing and AdSense approval remain controlled by Google. Translation is a visitor aid; no fake English hreflang URLs or guaranteed ad-rate improvement is claimed.

The [AdSense ads.txt format](https://support.google.com/adsense/answer/12171612) is published using the existing account ID. Google may take time to refresh its dashboard. No ad network script or invented ad unit is activated before the account is ready. Any later ad launch must use the required Google consent configuration for its audience; a home-made language consent dialog is not a certified advertising CMP.

The locale approach keeps original content accessible without redirecting crawlers, consistent with [Google's multilingual site guidance](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites). Country hints come from [Cloudflare request metadata](https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties), without a third-party geolocation lookup or GPS prompt.

## Deployment

Build, release identity, hosted verification and the post-release performance comparison will be recorded after deployment. Sanitized evidence is in ignored `artifacts/site-experience/`.
