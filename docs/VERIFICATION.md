# Verification record — 2026-10-29

This separates source checks, local browser/runtime checks and remote publication. It is not a production certification.

| Check | Actual result |
| --- | --- |
| Strict TypeScript | Passed `npm run typecheck` |
| ESLint | Passed with no warnings/errors |
| Unit/domain tests | 20 passed: catalog schemas/counts/assets, digit normalization, prices/discounts, stale variants, stock, immutable orders, local CRUD, AI bounded input/ranking, same-origin checks |
| Next production build | Passed; 66 pages generated, including 32 product and six article routes |
| OpenNext Cloudflare build | Passed; `.open-next/worker.js` generated with the pinned adapter |
| Browser journeys | Five passed on installed Chrome, including at 360 px, against the **Cloudflare local Worker runtime**, not just the dev server |
| Worker HTTP smoke | 98 page/asset requests, three unknown-route 404 checks, eight API cases, robots and sitemap passed at `http://127.0.0.1:8787` |
| Initial HTML | All seeded product names and full initial article paragraphs checked in HTTP responses |
| Demo API | Valid retrieval, no-key fallback, cross-origin 403, wrong type 415, malformed/invalid 400, oversized 413, GET 405 passed |
| Dependency audit | Full `npm audit --json`: zero vulnerabilities after scoped transitive build-tool patches |
| Lockfile | Initial GitHub Linux install exposed incomplete optional dependency records. Regenerated in a clean directory with npm 10.9.9 targeting Linux x64; matching `npm ci --dry-run` passed and audit reported zero vulnerabilities. Next types now generate before type checking on a clean checkout. |
| Visual inspection | Desktop hero and 360 px hero/product screenshots inspected; browser checks found no document overflow on tested customer/admin pages |
| Public Cloudflare | October 29 deployment: https://abi-mobile-demo.reminiscent-comte.workers.dev, version `0dc3026d-ee7c-468a-aad8-36f70128302d`. Owner claim is required before temporary-account expiry. October 28 preview expired. |
| Public HTTP verification | 98 page/asset requests, three unknown-route 404 checks, eight API cases, robots and sitemap passed against the October 29 public Worker. |
| Public browser verification | Five automated journeys were blocked by Cloudflare's temporary-preview security challenge. This is not a pass for live browser interactions; the five journeys passed against the local Worker. |
| GitHub source | Published to https://github.com/R3dPixelStudio/abi-mobile-demo. Linux verification rerun after the lockfile fix; see Actions for current status. |

## Browser coverage

- Unavailable variant blocks purchase; available variant can be saved, compared and added.
- Cart survives refresh; ABI10 discount and displayed total survive cart → checkout → refresh → immutable order confirmation.
- Persian-digit OTP works; guest wishlist survives account entry; comparison supports two aligned products and differences filtering.
- Latin iPhone search, real brand/budget/stock filtering, price sorting, mobile filter dialog Escape and focus restoration.
- Deterministic assistant results and explicit no-key fallback through the server endpoint.
- Admin creates a product and article; validation, editing, saved SEO fields, new local preview URLs and refresh work. Article HTML-like input remains text. Delete cancellation and full reset work.
- Google simulation, edited profile, address creation/edit/deletion and preference persistence survive refresh.
- Reduced motion disables decorative WebGL; no browser page errors were recorded in the presentation route sweep.

## Issues found and resolved

Discount state previously stayed in the cart component; it now persists with the checkout session. Comparison could accept an input before saved-state hydration; it now waits for readiness. Profile inputs could show seed values after refresh; they now follow hydrated data until edited. Next's dev request URL normalized the loopback hostname; same-origin validation now uses the actual Host authority while rejecting mismatched/cross-site origins. Admin hints were included in label names; they now use separate `aria-describedby` associations. npm generated incomplete optional-package records; a clean lockfile generation fixed reproducibility.

## Practical limits

- The downloaded Chromium executable failed to launch on this Windows host; tests used installed Chrome through `TEST_BROWSER_CHANNEL=chrome`. CI uses downloaded Chromium on Ubuntu; the remote CI result must be checked after push.
- OpenNext warns that Windows is not fully supported. The Windows build and local Worker passed, but Ubuntu CI is the recommended deployment environment.
- Seven phone images remain explicitly marked unavailable. Twelve accessories use generic schematic art. Most seeded models have a single reference image; the gallery supports multiple images entered in admin.
- Real Groq inference was not tested because no key was supplied. Live quota enforcement and provider outages need staging tests with the chosen account/model.
- No physical-device frame-rate, screen-reader audit, automated contrast audit, or production load test was performed. Browser 360 px inspection is not a physical handset test.
- Local admin edits and account data are per-browser previews. No shared publishing, secure identity, real order fulfillment or payment exists.
