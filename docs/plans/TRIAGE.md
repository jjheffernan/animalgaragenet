# Documentation triage — root `docs/` audit

**Date:** 2026-06-30 (refreshed)  
**Branch:** `dev`  
**Policy:** [SECURITY-PUBLIC.md](../SECURITY-PUBLIC.md)  
**Open items:** [AUDIT-REMEDIATION.md](./AUDIT-REMEDIATION.md) (canonical P0/P1/P2 tracker — this file is the reorg/triage map)

## Triage stats

| Category | Count | Notes |
|----------|------:|-------|
| **Open** (code) | 9 | Checkout, media Phase 1, builds gallery, YouTube sync, CI Prettier, `check-secrets` extend, OAuth redirect origin |
| **Open** (ops) | 8 | Netlify env, Supabase redirect URLs, Saleor catalog env, Ghost, OAuth providers, admin bootstrap |
| **Done** (code) | 18 | Auth guards, homepage UGC, shop filters, redeem/promo, catalog production guard, Phase 3 shell |
| **Archived** | 6 | `docs/archive/*.md` — banners + pointers to active docs |

Canonical batch tracker: [DOC-IMPLEMENTATION-MANIFEST.md](./DOC-IMPLEMENTATION-MANIFEST.md) · remediation: [AUDIT-REMEDIATION.md](./AUDIT-REMEDIATION.md) · open work: [STATUS.md](../STATUS.md)

---

## Root files (allowed to remain)

| File | Verdict | Action |
|------|---------|--------|
| `README.md` | **Keep + update** | Stays at root — index links to subfolders, STATUS, SECURITY-PUBLIC |
| `STATUS.md` | **Keep + update** | Stays at root — open-work tracker |
| `SECURITY-PUBLIC.md` | **Keep** | Stays at root — public-safe policy + placeholders |

No other markdown files remain at `docs/` root.

---

## Former root files — moved / archived

| Former path | Verdict | Final location |
|-------------|---------|----------------|
| `audit.md` | **Keep** | `audits/site-audit.md` |
| `ghost-audit.md` | **Keep** | `audits/ghost-audit.md` |
| `saleor-audit.md` | **Keep** | `audits/saleor-audit.md` |
| `auth-oauth.md` | **Keep** | `auth/oauth.md` |
| `auth-discord.md` | **Keep** | `auth/discord.md` |
| `auth-microsoft.md` | **Keep** | `auth/microsoft.md` |
| `saleor.md` | **Keep** | `commerce/saleor.md` |
| `cookies.md` | **Keep** | `commerce/cookies.md` |
| `ghost.md` | **Keep** | `content/ghost.md` |
| `build-submissions.md` | **Keep** | `content/build-submissions.md` |
| `infrastructure.md` | **Keep** | `infrastructure/overview.md` |
| `supabase.md` | **Keep** | `integrations/supabase.md` |
| `decisions.md` | **Keep** | `meta/decisions.md` |
| `inspiration.md` | **Keep** | `meta/inspiration.md` |
| `polish-plan.md` | **Keep** | `meta/polish-plan.md` |
| `phase3-plan.md` | **Archived** | `archive/phase3-plan.md` — workstreams A–D done |
| `animation-media.md` | **Archived** | `archive/animation-media.md` |
| `daisyui.md` | **Archived** | `archive/daisyui.md` |
| `dashboard-adoption-plan.md` | **Archived** | `archive/dashboard-adoption-plan.md` |
| `media-cdn-plan.md` | **Archived** | `archive/media-cdn-plan.md` — superseded by `plans/active/media-uploads.md` |
| `plans/account-flow-fix.md` | **Keep** | `plans/active/account-flow-fix.md` |
| `plans/market-readiness.md` | **Keep** | `plans/active/market-readiness.md` |
| `plans/media-uploads.md` | **Keep** | `plans/active/media-uploads.md` — Phase 1 open |

---

## Plan / code triage (`plans/active/*`)

| Area | Headline |
|------|----------|
| **Auth (Phase 0)** | Production guards **Done** (`ag-session` refusal, sign-in misconfig banner); session on Netlify = **Ops-only** (env + redirect URLs) |
| **Security hardening** | `isProductionHostname()` + `guardMockCatalogFallback()` + production `ag-session` block **Done** |
| **Saleor catalog** | Loaders + shop filters wired; production mock guard **Done**; live catalog on Netlify **Ops-only** |
| **Checkout / payment** | Placeholder — **Open** |
| **Media uploads** | Plan + admin prototype — **Open** (Supabase Storage Phase 1; no `/api/media/*`) |
| **UGC / content** | Testimonials CRUD + homepage UGC from approved rows **Done** (mock fallback when Supabase unset); public `/builds` gallery **Open** |
| **Admin dashboard** | Shell + moderation **Done**; daisyUI adoption, route isolation polish **Open** (low priority) |
| **Archived plans** | `phase3-plan` delivered; `media-cdn-plan` superseded for v1 |

### Recommended next code tasks (doc-aligned)

1. Wire public `/builds` from approved `build_submissions` (replace `mock/builds.ts` loader).
2. Saleor checkout: line qty/remove, shipping, `CHECKOUT_COMPLETE`.
3. Media uploads Phase 1 — Supabase Storage bucket + `/api/media/*`.
4. YouTube `sync.ts` — replace stub with Data API.
5. Extend `scripts/check-secrets.sh` for client-bundle secret patterns.

*Out of scope for next small PR: full S3/Garage CDN pipeline, CI Prettier sweep (~221 files).*

---

## Detailed plan triage table

| Plan | Item | Verdict | Evidence path |
|------|------|---------|---------------|
| **account-flow-fix** | Set Netlify Supabase env vars | Ops-only | `plans/active/account-flow-fix.md` §1 |
| **account-flow-fix** | Set `PUBLIC_SITE_URL` to active deploy URL | Ops-only | `src/lib/config/env.ts` |
| **account-flow-fix** | Supabase redirect URL allowlist | Ops-only | `src/routes/auth/callback/+server.ts` |
| **account-flow-fix** | Admin bootstrap via `promote-admin.ts` | Ops-only | `scripts/promote-admin.ts` |
| **account-flow-fix** | Session hydration (`@supabase/ssr`) | Done | `src/hooks.server.ts` |
| **account-flow-fix** | Account menu vs Sign In header | Done | `AccountMenu.svelte`, `Header.svelte` |
| **account-flow-fix** | `isProductionHostname()` includes `*.netlify.app` | Done | `src/lib/server/auth/local-dev.ts` |
| **account-flow-fix** | Refuse mock `ag-session` on production HTTPS | Done | `src/hooks.server.ts` |
| **account-flow-fix** | OAuth/magic-link redirect from `event.url.origin` | Open | `sign-in/+page.server.ts` uses `config.siteUrl` only |
| **account-flow-fix** | Surface `productionAuthMisconfigured` on sign-in UI | Done | `sign-in/+page.svelte` |
| **market-readiness** | Phase 0 — account flow | Ops-only | account-flow-fix rows |
| **market-readiness** | Phase 0 — production auth guards | Done | `hooks.server.ts`, `sign-in/+page.svelte` |
| **market-readiness** | Phase 1 — Saleor env on Netlify | Ops-only | `saleor/client.ts` |
| **market-readiness** | Phase 1 — gate silent Saleor→mock fallback | Done | `catalog/fallback.ts` |
| **market-readiness** | Phase 1 — shop category filters from Saleor | Done | `catalog/shop-filters.ts`, `/api/catalog/shop-filters` |
| **market-readiness** | Phase 1 — `/shop` ≠ 120 mock products | Open (ops) | Needs `PUBLIC_SALEOR_API_URL` on Netlify |
| **market-readiness** | Phase 2 — checkout & payment | Open | `checkout/+page.svelte` |
| **market-readiness** | Phase 3 — homepage UGC from `testimonials` | Done | `+page.server.ts`, `testimonials/to-ugc.ts` |
| **market-readiness** | Phase 3 — public `/builds` from submissions | Open | `mock/builds.ts` still source |
| **media-uploads** | Phase 1 — bucket + `/api/media/*` | Open | No migration/routes |
| **polish-plan** | Saleor redeem + cart promo | Done | `/account/redeem`, `checkout/promo.ts` |
| **polish-plan** | CI Prettier (~221 files) | Open | Blocks green CI |
| **phase3-plan** (archive) | Workstreams A–D | Done / partial | See archive banner |
| **media-cdn-plan** (archive) | v1 upload strategy | Stale | Superseded by `media-uploads.md` |

---

## Doc corrections (2026-06-30 refresh)

| File | Change |
|------|--------|
| `TRIAGE.md` | Stats + done rows for auth guards, UGC, shop filters |
| `account-flow-fix.md` | Code hardening §5 — mark `ag-session` + sign-in banner Done |
| `market-readiness.md` | UGC row hybrid; fix `../../` links from `plans/active/` |
| `meta/decisions.md` | Fix style-guide link |
| `archive/daisyui.md`, `archive/media-cdn-plan.md` | Fix post-reorg relative links |
| `content/build-submissions.md` | Fix `../../src/` code paths |
| `docs/README.md` | Add manifest to Plans index |

---

## Link updates

Inbound links to old flat root paths (`docs/saleor.md`, `docs/supabase.md`, etc.) were migrated in the June 2026 reorg. Remaining historical references live in `.cursor/commit-manifest.json` only.

From `plans/active/`, cross-folder links use `../../` (e.g. `../../audits/saleor-audit.md`).
