# Shopping assistant

The assistant at `/assistant` is usable without an API key. Its default mode uses deterministic filtering and simple ranking over `src/data/products.ts`. Prices are sample Toman amounts, not market quotations. It does not use local admin overrides: those remain browser-only. The UI identifies this limitation before and after recommending.

## Optional Groq connection

- Set server-only `GROQ_API_KEY` in `.env.local` for development, or use `npx wrangler secret put GROQ_API_KEY` for the configured Cloudflare Worker. Never use a `NEXT_PUBLIC_` prefix or commit a populated environment file.
- The default model is `openai/gpt-oss-20b`. Optional server-only `GROQ_MODEL` can override it, but the model must support the configured strict JSON schema and reasoning-effort option.
- Enable the live checkbox in the assistant. The user's structured preferences and optional text go to Groq; no name, cart, account, address, or browsing history is collected or sent. The UI asks users not to enter personal information.
- Cloudflare must bind `AI_RATE_LIMITER` with an 8-request / 60-second policy. Production live calls fail closed when the binding or trusted Cloudflare IP is absent or the limiter fails. Development uses a bounded process-local limiter; this is not a production distributed limiter.
- Missing credentials, quota/rate limits, timeouts, provider failures or invalid responses return labeled deterministic demo recommendations. There is no automatic retry. A deployed service needs secret configuration and a live smoke check before claiming the live integration works.

## Trust boundary

`POST /api/assistant` checks same origin, JSON content type, a maximum 4096 bytes in the actual request stream, and a strict Zod input schema. Persian and Arabic digits and thousands separators normalize to integer Toman. Budget is 1 million–1 billion Toman, question is at most 500 characters, and storage/use choices are bounded.

Canonical in-stock variants are filtered by budget, brand and storage before the provider sees up to 12 candidates. Only 1–3 unique eligible catalog IDs are accepted from the model. The model cannot set product names, facts, prices, URLs or copy shown to the shopper. Explanations are prepared Persian strings. Recommendation cards display only eligible variants, so an unavailable cheaper variant cannot create an incorrect budget match.

The provider request has a 10-second timeout, a 600-token completion cap, and a 32 KiB response-body cap. Client navigation aborts pending fetches, and client requests have a 12-second fallback timeout. No request text, personal data, provider response or API key is logged by the handler. A SHA-256 digest of the Cloudflare IP is used as a limiter key; no raw IP is stored by application code.

The free-text question only affects live ranking. Demo mode uses explicit form filters. Camera/gaming/battery ranking uses simple catalog heuristics and does not claim independently measured quality, FPS or battery life. The shopper sees this distinction.

## Verification

Run `npm test` for budget normalization, eligibility, model response IDs and actual streamed body limits; run `npm run typecheck` and `npm run build` for integration. Live service testing requires an operator-configured server secret and Cloudflare binding; no key is needed for demo tests.

Official references checked 2026-10-27: [Groq GPT-OSS 20B](https://console.groq.com/docs/model/openai/gpt-oss-20b), [Groq structured outputs](https://console.groq.com/docs/structured-outputs), [Groq API reference](https://console.groq.com/docs/api-reference).
