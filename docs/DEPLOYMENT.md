# GitHub and Cloudflare handoff

Verified repository: [R3dPixelStudio/abi-mobile-demo](https://github.com/R3dPixelStudio/abi-mobile-demo), created by the owner and confirmed through the connected GitHub app. The local credential helper belongs to another account; use the connected app or authenticate Git to the correct account for publication.

## Architecture choice

Next.js 16.4.3 + React 19.3.1 + OpenNext Cloudflare 1.20.13 + Wrangler 4.154.0 are pinned with a lockfile. The adapter's declared peer range supports the selected Next version. OpenNext keeps the conventional Next App Router/build, and adds the Workers runtime and asset packaging. A separate Vite app was not introduced.

The optional Groq endpoint requires a server, so deployment targets **Workers**, not a static Pages export. Cloudflare-specific code consists of `open-next.config.ts`, `wrangler.jsonc`, the adapter environment accessor and the rate-limit binding. Public pages are prerendered; API/preview routes run through the Worker. No database, R2 bucket or paid service was provisioned.

Official references checked during implementation:

- [OpenNext Cloudflare getting started](https://opennext.js.org/cloudflare/get-started)
- [Cloudflare Next.js guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [Wrangler commands](https://developers.cloudflare.com/workers/wrangler/commands/)
- [Groq supported models](https://console.groq.com/docs/models)

## Current publication and permanent ownership

The owner has claimed the existing Cloudflare account and authorized a release of the locally approved interactive hero, watch/accessory catalog, product galleries and blue club. Wrangler OAuth is authenticated to the existing Reminiscent Comte account; its existing Worker and prior version were confirmed before updating. This release uses the same public URL below. The older temporary-account instructions below are historical. No fresh temporary account should be created for this site.

The approved release builds with `npm run build:cloudflare` and deploys with `npm run deploy`; the test suite was intentionally not rerun at the owner's request. The GitHub release commit uses `[skip ci]` for this presentation update. Manufacturer reference media rights remain documented in ASSETS.md; this is a presentation demo, not production commerce.

Source is published on `main` in the verified repository above. The October 29 public preview is https://abi-mobile-demo.reminiscent-comte.workers.dev, Worker version `0dc3026d-ee7c-468a-aad8-36f70128302d`. Its build uses that origin for canonical/social/sitemap URLs. It runs in a temporary Cloudflare account and needs owner claim before expiry. The private claim link was delivered separately and is intentionally absent from source control. The earlier October 28 preview expired.

Claim the temporary account through the private Cloudflare link, or authenticate Wrangler to your permanent account and deploy there. Claiming and configuring GitHub deployment credentials are owner account actions; neither is implied by a successful temporary deploy. Automated public browser checks encountered Cloudflare's preview security challenge; HTTP smoke checks passed.

## Deploy to an owned account

1. The GitHub repository already exists under **R3dPixelStudio**, and source has been uploaded through the connected GitHub app. For later command-line pushes, authenticate Git Credential Manager to the intended account. Never share a token/password with the application or put it in project files.
2. Use the existing `origin` and `main`. Inspect changes before pushing; do not overwrite unrelated remote work.
3. Run `npx wrangler login` and complete Cloudflare OAuth yourself. Select the intended account; enable its free Workers subdomain if necessary. No domain purchase is needed.
4. Build and publish:

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build:cloudflare
npm run deploy
```

5. Read the actual workers.dev URL from successful Wrangler output. Set `NEXT_PUBLIC_SITE_URL` to that exact origin at **build time**, rebuild and deploy. Keep noindex enabled. Optional live mode: add the `GROQ_API_KEY` secret with Wrangler and set a supported `GROQ_MODEL`; a model change needs a compatibility check of structured output options.
6. Run `TEST_BASE_URL=<actual-url> npm run test:smoke` against the public URL, then E2E (E2E missing-key assertion assumes Groq is unconfigured). On PowerShell set `$env:TEST_BASE_URL='https://…'` first. Verify direct routes, refresh, asset responses, API origin checks, noindex and canonical URLs. A local emulator success does not establish edge deployment success.

## GitHub workflow

`.github/workflows/verify.yml` checks pull requests and pushes with `npm ci`, lint, types, tests and the actual OpenNext build. It installs Chromium and runs browser journeys plus smoke checks against Wrangler's local Workers runtime on Ubuntu. Ubuntu avoids OpenNext's Windows compatibility warning.

`.github/workflows/deploy.yml` is manual (`workflow_dispatch`), so commits cannot unexpectedly publish. Configure repository secrets `CLOUDFLARE_API_TOKEN` (least privilege: deploy Workers on the chosen account) and `CLOUDFLARE_ACCOUNT_ID`, plus repository variable `DEMO_SITE_URL`. Run only after choosing the intended account and URL. Groq is a Worker secret, not a build variable. The workflow verifies public pages with an HTTP smoke check after deployment. Do not add secrets to source control.

## Limits

Workers rate limits are edge-local approximate controls, not a global quota. Review Cloudflare account limits before enabling a public paid inference API. Live inference fails closed without the rate-limit binding in production. Deployment may require an account-specific compatibility/quota review; no paid plan has been purchased. No R2 incremental cache is configured, so production dynamic publishing/revalidation will require an appropriate cache strategy.
