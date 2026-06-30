# Polish plan — June 30, 2026

## P0 — Account & production auth (market-readiness audit)

From live probe of https://<your-preview-host> and `docs/plans/active/account-flow-fix.md`:

- Set Netlify env: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Set `PUBLIC_SITE_URL=https://<your-preview-host>` (must match browsed origin until custom domain cutover)
- Add Supabase redirect URLs: `https://<your-preview-host>/auth/callback` and `https://<your-site-host>/auth/callback`
- Bootstrap first admin: `npx tsx --env-file=.env scripts/promote-admin.ts user@email.com admin`
- Verify Account menu appears in header after magic link / OAuth (not stuck on “Sign In”)
- **Do not** set `DEV_ADMIN` or `LOCAL_DEV_AUTH` on Netlify
- Code follow-up: ~~extend `isProductionHostname()` to block `*.netlify.app`~~ **Done** (`local-dev.ts`)
- Code follow-up: ~~gate silent Saleor→mock fallback on production~~ **Done** (`catalog/fallback.ts`)

## P0 — Live catalog on Netlify (no mock)

From `docs/plans/active/market-readiness.md` — production `/shop` shows **120 mock products** (picsum images):

- Set `PUBLIC_SALEOR_API_URL` + `SALEOR_CHANNEL` on Netlify
- Run `npm run test:readiness` with prod secrets — `saleor-catalog` must pass
- Confirm `/shop` count ≠ 120 and images are not `picsum.photos`
- Remove or gate silent Saleor→mock fallback in `catalog/*.ts` for production — **Done** (`guardMockCatalogFallback`)

## P0 — Done (prior session)

- Local dev auth (`local-dev.ts`, quick-login on `/auth/sign-in`)
- Account header dropdown (`AccountMenu.svelte`)
- Production admin (`scripts/promote-admin.ts`, `SITE_LOCKED`, `/locked`)
- Saleor redeem (`/account/redeem`, cart promo API, `PromoCodeForm`)
- Media uploads plan (`docs/plans/active/media-uploads.md`)
- Docs refresh (`docs/integrations/supabase.md`, local-dev, deployment)

## P0 — External API readiness (structural)

From `npm run test:readiness` — all probes skipped without `.env`; gaps below block launch:

- Populate `.env` from `.env.example` and re-run `npm run test:readiness` for pass/fail signal
- YouTube sync is stub-only (`youtube/sync.ts` returns mock videos) — implement live API + DB upsert
- CDN/S3 upload path not wired (`cdn-s3` skip) — phase 1 of `docs/plans/active/media-uploads.md`
- Saleor live validation pending (`saleor-catalog`, `saleor-checkout` skip) — run before enabling checkout
- OAuth providers unverified (`oauth-google/discord/azure` skip) — enable in Supabase + probe

## P1 — Remaining

- Run `saleor-readiness` agent before enabling live checkout
- Wire review photo uploads (phase 1 of media-uploads plan)
- Fix CI Prettier (221 files) so org sync auto-triggers after merge
- Checkout/payment (Phase 2 of market-readiness plan)
- Ghost CMS + Supabase UGC hydration (Phase 3)

## P2 — Nice-to-have

- Cart line qty/remove when Saleor enabled
- OAuth provider completion (Discord/Microsoft)
- Account orders/vehicles pages (currently disabled in nav)
- Security hardening checklist (Phase 4 of market-readiness plan)
