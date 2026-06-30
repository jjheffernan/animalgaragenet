# Documentation triage — root `docs/` audit

**Date:** 2026-07-01 (refreshed)  
**Branch:** `dev`  
**Policy:** [SECURITY-PUBLIC.md](../SECURITY-PUBLIC.md)  
**Open items:** [AUDIT-REMEDIATION.md](./AUDIT-REMEDIATION.md) (canonical P0/P1/P2 tracker — this file is the reorg/triage map)

## Triage stats

| Category        | Count | Notes                                                                                                             |
| --------------- | ----: | ----------------------------------------------------------------------------------------------------------------- |
| **Open** (code) |    12 | See [batch-2026-07-01.md](./active/batch-2026-07-01.md) — checkout verify, catalog edges, featured CMS, Ghost SEO, UGC wall, locale, military link |
| **Open** (ops)  |     8 | Netlify env, Supabase redirect URLs, Saleor catalog env, Ghost, OAuth providers, admin bootstrap, migration apply |
| **Done** (code) |    36 | June 30 batch + IP-012/026/027, navbar polish, component-route cleanup, order webhook, Stripe checkout scaffold |
| **Archived**    |     7 | `docs/archive/*.md` — banners + pointers to active docs                                                           |

Canonical remediation: [AUDIT-REMEDIATION.md](./AUDIT-REMEDIATION.md) · open work: [STATUS.md](../STATUS.md)

---

## Root files (allowed to remain)

| File                 | Verdict           | Action                                                             |
| -------------------- | ----------------- | ------------------------------------------------------------------ |
| `README.md`          | **Keep + update** | Stays at root — index links to subfolders, STATUS, SECURITY-PUBLIC |
| `STATUS.md`          | **Keep + update** | Stays at root — open-work tracker                                  |
| `SECURITY-PUBLIC.md` | **Keep**          | Stays at root — public-safe policy + placeholders                  |

No other markdown files remain at `docs/` root.

---

## Former root files — moved / archived

| Former path                  | Verdict      | Final location                                                              |
| ---------------------------- | ------------ | --------------------------------------------------------------------------- |
| `audit.md`                   | **Keep**     | `audits/site-audit.md`                                                      |
| `ghost-audit.md`             | **Keep**     | `audits/ghost-audit.md`                                                     |
| `saleor-audit.md`            | **Keep**     | `audits/saleor-audit.md`                                                    |
| `auth-oauth.md`              | **Keep**     | `auth/oauth.md`                                                             |
| `auth-discord.md`            | **Keep**     | `auth/discord.md`                                                           |
| `auth-microsoft.md`          | **Keep**     | `auth/microsoft.md`                                                         |
| `saleor.md`                  | **Keep**     | `commerce/saleor.md`                                                        |
| `cookies.md`                 | **Keep**     | `commerce/cookies.md`                                                       |
| `ghost.md`                   | **Keep**     | `content/ghost.md`                                                          |
| `build-submissions.md`       | **Keep**     | `content/build-submissions.md`                                              |
| `infrastructure.md`          | **Keep**     | `infrastructure/overview.md`                                                |
| `supabase.md`                | **Keep**     | `integrations/supabase.md`                                                  |
| `decisions.md`               | **Keep**     | `meta/decisions.md`                                                         |
| `inspiration.md`             | **Keep**     | `meta/inspiration.md`                                                       |
| `polish-plan.md`             | **Keep**     | `meta/polish-plan.md`                                                       |
| `phase3-plan.md`             | **Archived** | `archive/phase3-plan.md` — workstreams A–D done                             |
| `animation-media.md`         | **Archived** | `archive/animation-media.md`                                                |
| `daisyui.md`                 | **Archived** | `archive/daisyui.md`                                                        |
| `dashboard-adoption-plan.md` | **Archived** | `archive/dashboard-adoption-plan.md`                                        |
| `media-cdn-plan.md`          | **Archived** | `archive/media-cdn-plan.md` — superseded by `plans/active/media-uploads.md` |
| `plans/account-flow-fix.md`  | **Keep**     | `plans/active/account-flow-fix.md`                                          |
| `plans/market-readiness.md`  | **Keep**     | `plans/active/market-readiness.md`                                          |
| `plans/media-uploads.md`     | **Keep**     | `plans/active/media-uploads.md` — Phase 1 wired; apply migration on Supabase |

---

## Plan / code triage (`plans/active/*`)

| Area                   | Headline                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Auth (Phase 0)**     | Production guards **Done** (`ag-session` refusal, sign-in misconfig banner); session on Netlify = **Ops-only** (env + redirect URLs) |
| **Security hardening** | `isProductionHostname()` + `guardMockCatalogFallback()` + production `ag-session` block **Done**                                     |
| **Saleor catalog**     | Loaders + shop filters wired; production mock guard **Done**; live catalog on Netlify **Ops-only**                                   |
| **Checkout / payment** | Proxies + Stripe Elements scaffold **done**; live pay blocked on Payment App (ops)                                                   |
| **Media uploads**      | Plan + API wired — **Done** (code); apply migration on Supabase — **Ops**                                                      |
| **UGC / content**      | Testimonials CRUD + homepage UGC + public `/builds` from approved rows **Done** (mock fallback when Supabase unset)              |
| **Admin dashboard**    | Runtime dashboard **done** (`/admin/runtime`); nav stubs disabled; user CRUD partial                                                 |
| **Archived plans**     | `phase3-plan` delivered; `media-cdn-plan` superseded for v1                                                                          |

### Recommended next code tasks (doc-aligned)

See [batch-2026-07-01.md](./active/batch-2026-07-01.md) for the canonical July 1 implementer table.

1. Payment App on Saleor channel + checkout live verify (BATCH-001).
2. Featured sections beyond hero + `/media` UGC wall (BATCH-003, BATCH-004).
3. Ghost OG/meta mapping + contract/E2E tests (BATCH-005, BATCH-012).

_Out of scope for next small PR: full S3/Garage CDN pipeline._

---

## Detailed plan triage table

| Plan                         | Item                                                | Verdict        | Evidence path                                          |
| ---------------------------- | --------------------------------------------------- | -------------- | ------------------------------------------------------ |
| **account-flow-fix**         | Set Netlify Supabase env vars                       | Ops-only       | `plans/active/account-flow-fix.md` §1                  |
| **account-flow-fix**         | Set `PUBLIC_SITE_URL` to active deploy URL          | Ops-only       | `src/lib/config/env.ts`                                |
| **account-flow-fix**         | Supabase redirect URL allowlist                     | Ops-only       | `src/routes/auth/callback/+server.ts`                  |
| **account-flow-fix**         | Admin bootstrap via `promote-admin.ts`              | Ops-only       | `scripts/promote-admin.ts`                             |
| **account-flow-fix**         | Session hydration (`@supabase/ssr`)                 | Done           | `src/hooks.server.ts`                                  |
| **account-flow-fix**         | Account menu vs Sign In header                      | Done           | `AccountMenu.svelte`, `Header.svelte`                  |
| **account-flow-fix**         | `isProductionHostname()` includes `*.netlify.app`   | Done           | `src/lib/server/auth/local-dev.ts`                     |
| **account-flow-fix**         | Refuse mock `ag-session` on production HTTPS        | Done           | `src/hooks.server.ts`                                  |
| **account-flow-fix**         | OAuth/magic-link redirect from `event.url.origin`   | Done           | `callback-url.ts`; sign-in/sign-up actions              |
| **account-flow-fix**         | Surface `productionAuthMisconfigured` on sign-in UI | Done           | `sign-in/+page.svelte`                                 |
| **market-readiness**         | Phase 0 — account flow                              | Ops-only       | account-flow-fix rows                                  |
| **market-readiness**         | Phase 0 — production auth guards                    | Done           | `hooks.server.ts`, `sign-in/+page.svelte`              |
| **market-readiness**         | Phase 1 — Saleor env on Netlify                     | Ops-only       | `saleor/client.ts`                                     |
| **market-readiness**         | Phase 1 — gate silent Saleor→mock fallback          | Done           | `catalog/fallback.ts`                                  |
| **market-readiness**         | Phase 1 — shop category filters from Saleor         | Done           | `catalog/shop-filters.ts`, `/api/catalog/shop-filters` |
| **market-readiness**         | Phase 1 — `/shop` ≠ 120 mock products               | Open (ops)     | Needs `PUBLIC_SALEOR_API_URL` on Netlify               |
| **market-readiness**         | Phase 2 — checkout & payment                        | Partial        | Checkout UI + proxies wired; Payment App ops pending |
| **market-readiness**         | Phase 3 — homepage UGC from `testimonials`          | Done           | `+page.server.ts`, `testimonials/to-ugc.ts`            |
| **market-readiness**         | Phase 3 — public `/builds` from submissions         | Done           | `builds/public.ts` → approved `build_submissions`      |
| **media-uploads**            | Phase 1 — bucket + `/api/media/*`                   | Done (code)    | Migration + API in repo; apply on Supabase project     |
| **polish-plan**              | Saleor redeem + cart promo                          | Done           | `/account/redeem`, `checkout/promo.ts`                 |
| **polish-plan**              | Cart line qty/remove when Saleor enabled            | Done           | `cart.svelte.ts`, `/cart/checkout` PATCH/DELETE        |
| **polish-plan**              | CI Prettier (~221 files)                            | Done           | Commit `63eb20a`                                       |
| **phase3-plan** (archive)    | Workstreams A–D                                     | Done / partial | See archive banner                                     |
| **media-cdn-plan** (archive) | v1 upload strategy                                  | Stale          | Superseded by `media-uploads.md`                       |

---

## Doc corrections (2026-06-30 refresh)

| File                                              | Change                                                      |
| ------------------------------------------------- | ----------------------------------------------------------- |
| `TRIAGE.md`                                       | Stats + July 1 batch pointer; checkout/admin rows refreshed |
| `batch-2026-07-01.md`                             | New — canonical July 1 implementer table                    |
| `AUDIT-REMEDIATION.md`                            | AUD-P2-037 done; counts 22 open / 32 done                   |
| `account-flow-fix.md`                             | `callback-url.ts` redirect — mark Done                      |
| `market-readiness.md`                             | UGC row hybrid; fix `../../` links from `plans/active/`     |
| `meta/decisions.md`                               | Fix style-guide link                                        |
| `archive/daisyui.md`, `archive/media-cdn-plan.md` | Fix post-reorg relative links                               |
| `content/build-submissions.md`                    | Public gallery wired via `builds/public.ts`                 |
| `docs/README.md`                                  | Archive manifest; media-uploads status                      |
| `plans/DOC-IMPLEMENTATION-MANIFEST.md`          | Archived → `archive/doc-implementation-manifest.md`         |
| `plans/active/inspiration-polish-coordination.md`, `inspiration-polish-prod-setup.md` | **Merged** into `inspiration-polish-tracker.md` (prod appendix) |

---

## Link updates

Inbound links to old flat root paths (`docs/saleor.md`, `docs/supabase.md`, etc.) were migrated in the June 2026 reorg. Remaining historical references live in `.cursor/commit-manifest.json` only.

From `plans/active/`, cross-folder links use `../../` (e.g. `../../audits/saleor-audit.md`).
