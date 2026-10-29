# Production migration checklist

- Replace demo seed/local overrides with a durable database repository, migrations and server validation. Unique slugs, variant IDs, transaction-safe stock reservations and order idempotency must be enforced on the server.
- Implement server authentication and role authorization; sessions, CSRF protection, admin audit history, real OTP delivery/rate limits, and Google OAuth through the real provider. The current route guards only organize the demo UI.
- Integrate a payment provider with explicit Toman/Rial conversion, signed/verified webhooks, retry/idempotency handling, refunds, reconciliation and server-side amount validation. Never trust local cart prices or stock.
- Add order processing, delivery integrations, notifications and retention rules; remove fictional contact/order data. Validate business identity, warranty, device registration, region/SKU and all client policy text before sale.
- Use object storage/CDN for persistent media with file type/size checks, image processing and an approved asset-rights register. Replace seven missing phone photographs and all generic accessory illustrations with approved actual inventory media.
- Implement shared CMS publishing, drafts/roles, slug redirects, cache invalidation, server metadata and sitemap updates. Set the real domain and deliberately remove demo noindex after review. Noindex provides no privacy/security guarantee.
- Move AI retrieval to the trusted server catalog. Add durable global abuse controls, spend limits, monitoring and a model-specific availability test. Do not let the assistant place orders or alter inventory.
- Establish backups with restore drills, database monitoring, redacted server logs, alerts, error reporting, uptime checks, deployment rollback, secret rotation and dependency updates.
- Run accessibility/contrast, screen-reader, physical-mobile performance and real-device WebGL tests; verify reduced motion, storage-denied behavior and content layout under long Persian strings.

## Suitable hosting

Choose either a maintained Node-compatible Next.js deployment (managed Next host or properly operated Node container/server), or Cloudflare Workers with a supported Next adapter. Both need secure server secrets, compatible database drivers/connections, object storage/CDN, scheduled/background work for order processing, backups, and operational ownership. Workers databases should use edge-compatible drivers or a connection service such as Hyperdrive when appropriate. A Node deployment can replace the Cloudflare environment accessor and rate-limit binding with host equivalents. Basic static hosting or ordinary PHP shared hosting is insufficient for the full production commerce backend.
