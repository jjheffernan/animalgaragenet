**Status:** Complete (code-actionable items)  
**Archived:** 2026-06-30  
**See instead:** [inspiration-polish-coordination.md](../plans/active/inspiration-polish-coordination.md) · [inspiration-polish-prod-setup.md](../plans/active/inspiration-polish-prod-setup.md) · [AUDIT-REMEDIATION.md](../plans/AUDIT-REMEDIATION.md)

# Polish plan — June 30, 2026

> **Session update (June 30, 2026):** Code items below marked **Done** landed on `dev`. Ops-only steps → [inspiration-polish-prod-setup.md](../plans/active/inspiration-polish-prod-setup.md).

## P0 — Account & production auth (market-readiness audit)

From live probe of https://<your-preview-host> and `docs/plans/active/account-flow-fix.md`:

- Set Netlify env: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — **Ops**
- Set `PUBLIC_SITE_URL=https://<your-preview-host>` (must match browsed origin until custom domain cutover) — **Ops**
- Add Supabase redirect URLs: `https://<your-preview-host>/auth/callback` and `https://<your-site-host>/auth/callback` — **Ops**
- Bootstrap first admin: `npx tsx --env-file=.env scripts/promote-admin.ts user@email.com admin` — **Ops**
- Verify Account menu appears in header after magic link / OAuth (not stuck on "Sign In") — **Ops QA**
- **Do not** set `DEV_ADMIN` or `LOCAL_DEV_AUTH` on Netlify
- Code follow-up: ~~extend `isProductionHostname()` to block `*.netlify.app`~~ **Done** (`local-dev.ts`)
- Code follow-up: ~~gate silent Saleor→mock fallback on production~~ **Done** (`catalog/fallback.ts`)
- Code follow-up: ~~refuse mock `ag-session` on production HTTPS~~ **Done** (`hooks.server.ts`)
- Code follow-up: ~~surface `supabaseReady` on sign-in when keys missing~~ **Done** (`sign-in/+page.svelte`)
- Code follow-up: ~~OAuth/magic-link redirect from request origin~~ **Done** (`callback-url.ts`, OAuth client + sign-in/sign-up)

## P0 — Live catalog on Netlify (no mock)

From `docs/plans/active/market-readiness.md` — production `/shop` shows **120 mock products** (picsum images):

- Set `PUBLIC_SALEOR_API_URL` + `SALEOR_CHANNEL` on Netlify — **Ops**
- Run `npm run test:readiness` with prod secrets — `saleor-catalog` must pass — **Ops**
- Confirm `/shop` count ≠ 120 and images are not `picsum.photos` — **Ops QA**
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

- Populate `.env` from `.env.example` and re-run `npm run test:readiness` for pass/fail signal — **Ops**
- YouTube sync is stub-only (`youtube/sync.ts` returns mock videos) — **Blocked** (needs `YOUTUBE_API_KEY`)
- CDN/S3 upload path not wired (`cdn-s3` skip) — **Deferred** (v1 uses Supabase Storage; see media-uploads)
- Saleor live validation pending (`saleor-catalog`, `saleor-checkout` skip) — **Ops** (run before enabling checkout)
- OAuth providers unverified (`oauth-google/discord/azure` skip) — **Ops** (enable in Supabase + probe)

## P1 — Remaining

- Run `saleor-readiness` agent before enabling live checkout — **Ops / agent**
- ~~Wire review photo uploads (phase 1 of media-uploads plan)~~ **Done** (migration + API + `ReviewPhotoUpload`)
- Fix CI Prettier (221 files) so org sync auto-triggers after merge — run `npm run format`
- Checkout/payment (Phase 2 of market-readiness plan) — **Blocked** (Saleor payment gateway)
- Ghost CMS + Supabase UGC hydration (Phase 3) — **Partial** (homepage UGC from testimonials **Done**; Ghost/YouTube open)

## P2 — Nice-to-have

- ~~Cart line qty/remove when Saleor enabled~~ **Done**
- OAuth provider completion (Discord/Microsoft) — **Ops** (Supabase dashboard)
- ~~Account orders/vehicles pages (currently disabled in nav)~~ **Done** (`/account/orders`, `/account/vehicles`)
- Security hardening checklist (Phase 4 of market-readiness plan) — **Partial** (production auth guards done; RLS/captcha open)
