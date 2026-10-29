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

## First publication

1. While signed into **R3dPixelStudio**, create an empty `abi-mobile-demo` repository. Grant the connected GitHub app access if using the connector. For command-line push, authenticate Git Credential Manager to the intended account. Never share the token/password with the application or put it in project files.
2. From the existing local repository, add the verified repository as `origin` and push `main`. Do not overwrite an existing remote branch.
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
