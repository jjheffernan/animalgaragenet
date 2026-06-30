# Polish plan — June 30, 2026

## P0 — Done this session

- Local dev auth (`local-dev.ts`, quick-login on `/auth/sign-in`)
- Account header dropdown (`AccountMenu.svelte`)
- Production admin (`scripts/promote-admin.ts`, `SITE_LOCKED`, `/locked`)
- Saleor redeem (`/account/redeem`, cart promo API, `PromoCodeForm`)
- Media uploads plan (`docs/plans/media-uploads.md`)
- Docs refresh (`docs/supabase.md`, local-dev, deployment)

## P0 — External API readiness (2026-06-30)

From `npm run test:readiness` — all probes skipped without `.env`; structural gaps below block live cutover:

- Populate `.env` from `.env.example` and re-run `npm run test:readiness` for pass/fail signal
- YouTube sync is stub-only (`youtube/sync.ts` returns mock videos) — implement live API + DB upsert
- CDN/S3 upload path not wired (`cdn-s3` skip) — phase 1 of `docs/plans/media-uploads.md`
- Saleor live validation pending (`saleor-catalog`, `saleor-checkout` skip) — run before enabling checkout
- OAuth providers unverified (`oauth-google/discord/azure` skip) — enable in Supabase + probe

## P1 — Remaining

- Run `saleor-readiness` agent before enabling live checkout
- Wire review photo uploads (phase 1 of media-uploads plan)
- Fix CI Prettier (221 files) so org sync auto-triggers after merge

## P2 — Nice-to-have

- Cart line qty/remove when Saleor enabled
- OAuth provider completion (Discord/Microsoft)
- Account orders/vehicles pages (currently disabled in nav)
