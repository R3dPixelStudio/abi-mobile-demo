# Abi Mobile implementation plan

## Approved direction
Persian RTL technology boutique, white/cool grey surfaces, sky-blue brand accent, compact editorial product-led hero, real model-specific imagery, Vazirmatn. Single Next.js App Router application. Native scrolling, semantic HTML, small optional optical WebGL ornament. All commerce and identity operations are explicitly demo-only.

## Architecture and tasks
- [x] Foundation: pin compatible Next/React/Tailwind dependencies; establish strict TypeScript, lint, tests, Worker adapter and security headers.
- [x] Domain: product/article schemas, 20 phones and 12 accessories, six original Persian guides, source manifest, normalization, integer Toman totals and stock validation tests.
- [x] UI: shared tokens, header/search/mobile navigation, accessible modal, cards, homepage and product detail visual system.
- [x] Shopping: URL filters/sort/search, variants, compare, persistent cart/wishlist, simulated checkout and immutable order snapshots.
- [x] Account: clearly simulated phone/OTP/Google entry, profile, orders/details, addresses and settings; preserve guest state.
- [x] Admin: product/variant CRUD, reusable templates, articles/SEO, taxonomy, offers, home and settings; validated local overrides and reset.
- [x] AI: deterministic catalog recommendation, optional guarded server Groq route, bounded inputs/timeouts/output and public rate limits; canonical catalog facts only.
- [x] Content/SEO: SSR seed detail routes, blog and informational pages, unique metadata, noindex, canonical config, sitemap, safe JSON-LD with Rial conversion.
- [x] Verification: domain tests, customer/admin journey checks, type/lint/Next and Worker builds, mobile/desktop visual inspection, direct route and API smoke checks.
- [ ] Handoff: GitHub source and Cloudflare publication where accounts allow, verify real URLs; README, asset rights notes, deployment and production migration checklist.

## Contracts
`Product`: id/slug/name/brand/kind/category/description/images/specs/variants/featured/seo. `Variant`: id/color/colorHex/storage/price/stock. `Article`: id/slug/title/excerpt/content (paragraph strings)/cover/category/tags/status/seo/date. Browser storage is schema-validated before merging. Cart stores product/variant IDs and quantities; prices are derived from current catalog. Orders snapshot reviewed line data. Deleted/unavailable variants block checkout rather than disappearing silently.

## Verification strategy
Exercise Persian normalization, integer money and discounts, stale carts, quantity caps, recommendations and unsafe persistence with unit tests. Verify purchase and admin CRUD/reset in a browser. Inspect 360px and desktop screenshots, keyboard dialogs, reduced motion, initial server HTML, response headers, asset HTTP status and runtime API fallbacks. Report each environment separately.

Implementation and local verification are complete. Exact-model photo coverage remains partial as documented in ASSETS.md. Remote publication status is recorded separately in VERIFICATION.md.
