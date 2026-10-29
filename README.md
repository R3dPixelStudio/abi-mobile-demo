# آبی‌موبایل · Abi Mobile

Persian RTL phone and accessory store **presentation demo** built with Next.js App Router. Temporary identity: white, cool blue, Vazirmatn, restrained optical hero. No database, real authentication, SMS, payments, or shipments.

Source repository: [R3dPixelStudio/abi-mobile-demo](https://github.com/R3dPixelStudio/abi-mobile-demo).

## Run locally

Use Node 22 LTS or newer (local verification used Node 25.2.1), npm, and the committed lockfile.

```sh
npm ci
npm run dev
# http://127.0.0.1:3000
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

On Windows use `npm.cmd` if PowerShell blocks npm.ps1. Do not run a build against the same `.next` directory while another production server is using it. Development uses `.next/dev`.

## Present the demo

1. Browse `/`, `/products`, product variants and `/compare`. Guests can save products and shop.
2. Add an available variant, open `/cart`, apply **ABI10**, and proceed to `/checkout`. Use the **پر کردن اطلاعات نمونه** button, confirm the demo checkbox, and submit. No bank details are requested or transmitted.
3. `/account`: sample phone **09120000000**, OTP **123456** (Persian digits also accepted). The Google button is an explicitly labeled simulation. Saved choices remain intact.
4. `/admin`: enter the demo panel. Create/edit products, variants, prices, stock, categories, banners, offers, articles, SEO and order status. Confirm deletion/reset. Two sample orders and one fictional address are seeded.
5. New local records use `/preview/product?id=…` and `/preview/article?id=…`. Refresh works in the same browser. Other devices cannot see these changes. Existing seed routes remain prerendered.
6. `/assistant` works with no key. Choose budget, intended use, storage, brand. Optional Groq mode ranks strictly filtered records; catalog prices and stock are always read from the seed data. Local admin overrides are deliberately excluded and this is disclosed in the UI.
7. Reset from `/admin/settings` to restore the original data. This also clears cart, account state, preferences and local orders. Browser storage is not a secure customer database.

## Verification and Cloudflare

```sh
npx playwright install chromium
# Start the app separately, then:
npm run test:e2e
npm run build:cloudflare
npm run preview:cloudflare
# Worker preview default port is 8787; in a second terminal:
npm run test:smoke
```

For an alternate running environment set `TEST_BASE_URL` before E2E/smoke tests. E2E takes presentation screenshots in `test-results/`. See [verification results](docs/VERIFICATION.md) and [deployment instructions](docs/DEPLOYMENT.md). A local build is not evidence of a public deployment.

## Layout of the source

| Path | Responsibility |
| --- | --- |
| `src/app/(shop)` | Storefront, catalog, blog, account, policies, local preview routes |
| `src/app/admin` | Separate admin layout and route sections |
| `src/components` | Reusable HTML UI, shop journeys, optional hero scene |
| `src/components/admin` | Admin tables, editors, SEO preview and confirmations |
| `src/lib/types.ts`, `validation.ts` | Domain records and input validation |
| `src/lib/repository.ts` | Small seed repository and local override merge |
| `src/lib/store.ts`, `storage.ts` | Zustand browser persistence, hydration and safe storage failures |
| `src/lib/domain.ts` | Money, digit/search normalization, cart validation and totals |
| `src/lib/assistant.ts`, `src/app/api/assistant` | Retrieval, bounded input/output, server-only Groq integration |
| `src/data` | 20 phones, 12 generic accessories, six articles, fictional orders and asset credits |
| `src/app/globals.css`, `shop.css` | Shared design tokens, RTL layout and responsive shop styles |
| `tests`, `tests/e2e` | Domain and browser journey checks |

Temporary branding/settings are centralized in `src/lib/brand.ts`; update server metadata and wordmarks when adopting the final brand. No separate Vite app exists. GSAP loads only for the home entrance and cleans up its scope. Decorative R3F is lazy, view-dependent, hidden-tab paused, bounded DPR and disabled for reduced motion, with an HTML/CSS composition underneath.

## Money, content and SEO boundaries

Money is integer **Toman**. All prices and stock are illustrative. A future provider expecting **Rial** must explicitly multiply by 10 at the server boundary. Product JSON-LD already converts Toman to IRR; no invented ratings or reviews appear. Dates are ISO internally and Jalali in visible UI.

The public demo has `noindex,nofollow` in metadata and headers. **Noindex is not access control.** Before production, configure the real `NEXT_PUBLIC_SITE_URL`, review content/rights/policies, deliberately remove both noindex controls, and implement shared publishing, canonical redirects, sitemap updates and server metadata updates. Browser-local SEO changes are previews only and do not affect search engines. SEO does not guarantee rankings.

Articles render plain paragraph strings; HTML input is displayed as text. Admin media supports HTTPS/local asset URLs, with previews; persistent upload/storage is not implemented. Product images and licensing notes: [ASSETS.md](docs/ASSETS.md), also visible at `/credits`. Seven phone models currently have clearly labeled missing-image panels. Accessories use original schematic illustrations of generic demo SKUs.

## Optional live AI

Copy `.env.example` to `.env.local` for local Next development, or `.dev.vars.example` to `.dev.vars` for Wrangler preview. Keep Groq keys server-only. On Cloudflare use `npx wrangler secret put GROQ_API_KEY`; never use a `NEXT_PUBLIC_` key, commit it, paste it into chat, or store it in the client. Model is configurable through `GROQ_MODEL`; default `openai/gpt-oss-20b` was checked against official Groq documentation during implementation. Missing/failed service falls back to the labeled deterministic demo. See [AI.md](docs/AI.md).

## Production is a separate phase

See [PRODUCTION.md](docs/PRODUCTION.md). This demo is intentionally portable: replace repository/store boundaries with server-backed data and orders. Suitable hosting must support a Next-compatible server runtime, secrets, database connectivity, media storage and operations. Static/shared PHP hosting alone cannot run that system.

