# Polish plan — June 30, 2026

> **Status: Complete** — Session polish items landed on `dev` (June 30, 2026).  
> **Replacement:** [inspiration-polish-tracker.md](../plans/active/inspiration-polish-tracker.md)

---

## P0 — Account & production auth (market-readiness audit)

From live probe and `docs/plans/active/account-flow-fix.md`:

- Set Netlify env: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — **Ops**
- Set `PUBLIC_SITE_URL` — **Ops**
- Add Supabase redirect URLs — **Ops**
- Bootstrap first admin — **Ops**
- Verify Account menu after magic link / OAuth — **Ops QA**
- **Do not** set `DEV_ADMIN` or `LOCAL_DEV_AUTH` on Netlify
- Code: `isProductionHostname()` — **Done**
- Code: gate Saleor→mock fallback — **Done**
- Code: refuse mock `ag-session` on production — **Done**
- Code: `supabaseReady` on sign-in — **Done**
- Code: OAuth/magic-link redirect from request origin — **Done**

## P0 — Live catalog on Netlify

- Set `PUBLIC_SALEOR_API_URL` + `SALEOR_CHANNEL` — **Ops**
- Run `npm run test:readiness` — **Ops**
- Confirm `/shop` ≠ mock — **Ops QA**
- `guardMockCatalogFallback` — **Done**

## P0 — Done (prior session)

- Local dev auth, Account dropdown, production admin, Saleor redeem, media uploads plan, docs refresh

## P0 — External API readiness

- Populate `.env` and re-run readiness — **Ops**
- YouTube sync stub — **Open** (see tracker IP-009)
- CDN/S3 deferred — **Open** (see tracker IP-012)
- Saleor live validation — **Ops**
- OAuth providers — **Ops**

## P1 — Remaining (at archive time)

- Saleor-readiness before live checkout — **Ops**
- Review photo uploads — **Done**
- CI Prettier — **Done** (tracker IP-019; commit `63eb20a`)
- Checkout/payment — **Blocked** (tracker IP-003)
- Ghost/YouTube — **Open** (tracker IP-009, IP-010)

## P2 — Nice-to-have

- Cart line qty/remove — **Done**
- OAuth provider completion — **Ops**
- Account orders/vehicles pages — **Done**
- Security hardening — **Partial**
