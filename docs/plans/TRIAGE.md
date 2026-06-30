# Documentation triage — root `docs/` audit

**Date:** 2026-06-30  
**Branch:** `dev`  
**Policy:** [SECURITY-PUBLIC.md](../SECURITY-PUBLIC.md)

Every markdown file that **was** at `docs/` root (or created during reorg) — verdict and final location.

---

## Root files (allowed to remain)

| File | Verdict | Action |
|------|---------|--------|
| `README.md` | **Keep + update** | Stays at root — index links to subfolders, STATUS, SECURITY-PUBLIC |
| `STATUS.md` | **Keep + update** | Stays at root — open-work tracker; media-uploads line → Supabase Phase 1 |
| `SECURITY-PUBLIC.md` | **Keep + update** | Stays at root (renamed from `PUBLIC-SAFE.md`) — public-safe policy + placeholders |

No other markdown files remain at `docs/` root.

---

## Former root files — moved / archived

| Former path | Verdict | Action |
|-------------|---------|--------|
| `audit.md` | **Keep + update** | → `audits/site-audit.md` |
| `ghost-audit.md` | **Keep + update** | → `audits/ghost-audit.md` |
| `saleor-audit.md` | **Keep + update** | → `audits/saleor-audit.md`; Saleor host → placeholder |
| `auth-oauth.md` | **Keep + update** | → `auth/oauth.md` |
| `auth-discord.md` | **Keep + update** | → `auth/discord.md`; production URLs sanitized |
| `auth-microsoft.md` | **Keep + update** | → `auth/microsoft.md`; production URLs sanitized |
| `saleor.md` | **Keep + update** | → `commerce/saleor.md`; redeem marked wired |
| `cookies.md` | **Keep + update** | → `commerce/cookies.md` |
| `ghost.md` | **Keep + update** | → `content/ghost.md` |
| `build-submissions.md` | **Keep + update** | → `content/build-submissions.md` |
| `infrastructure.md` | **Keep + update** | → `infrastructure/overview.md`; bucket/CDN placeholders |
| `supabase.md` | **Keep + update** | → `integrations/supabase.md` |
| `decisions.md` | **Keep + update** | → `meta/decisions.md`; org mirror prose sanitized |
| `inspiration.md` | **Keep + update** | → `meta/inspiration.md`; Phase 3 P0 marked done |
| `polish-plan.md` | **Keep + update** | → `meta/polish-plan.md` |
| `phase3-plan.md` | **Stale** | → `archive/phase3-plan.md` — banner + workstreams marked done |
| `animation-media.md` | **Stale** | → `archive/animation-media.md` |
| `daisyui.md` | **Stale** | → `archive/daisyui.md` |
| `dashboard-adoption-plan.md` | **Stale** | → `archive/dashboard-adoption-plan.md` — partial shell shipped |
| `media-cdn-plan.md` | **Stale** | → `archive/media-cdn-plan.md` — superseded by `plans/active/media-uploads.md` |
| `plans/account-flow-fix.md` | **Keep + update** | → `plans/active/account-flow-fix.md` |
| `plans/market-readiness.md` | **Keep + update** | → `plans/active/market-readiness.md` |
| `plans/media-uploads.md` | **Keep + update** | → `plans/active/media-uploads.md` — Phase 1 open (no code) |

---

## Plan / code triage (`plans/active/*`)

See also the detailed table below (from prior pass). Headlines unchanged:

| Area | Headline |
|------|----------|
| **Auth (Phase 0)** | Code paths exist; production session = **Ops-only** (Netlify env + Supabase redirect URLs) |
| **Security hardening** | `isProductionHostname()` + `guardMockCatalogFallback()` **Done**; mock `ag-session` on prod HTTPS + `supabaseReady` UI **Open** |
| **Saleor catalog** | Loaders wired with production guard; live catalog on Netlify **Ops-only** |
| **Checkout / payment** | Placeholder — **Open** |
| **Media uploads** | Plan + admin prototype — **Open** (Supabase Storage Phase 1; no `/api/media/*`) |
| **UGC / content** | Testimonials CRUD **Done**; homepage UGC wall mock — **Open** |
| **Admin dashboard** | Shell + moderation **Done**; daisyUI, route isolation, nav targets **Open** |
| **Archived plans** | `phase3-plan` largely delivered; `media-cdn-plan` superseded for v1 |

### Recommended next code tasks (small, doc-aligned)

1. Render `supabaseReady` warning on `/auth/sign-in` when keys missing on production hostname.
2. Refuse `ag-session` mock cookie when `isProductionHostname(event.url.hostname)`.
3. Wire homepage `ugc` prop to `listFeaturedTestimonials` (replace `mockUGC` in `+page.server.ts`).

*Out of scope: S3/Garage CDN full pipeline, checkout payment, media-uploads Phase 1 implementation.*

---

## Detailed plan triage table

| Plan | Item | Verdict | Evidence path |
|------|------|---------|---------------|
| **account-flow-fix** | Set Netlify Supabase env vars | Ops-only | `docs/plans/active/account-flow-fix.md` §1 |
| **account-flow-fix** | Set `PUBLIC_SITE_URL` to active deploy URL | Ops-only | `src/lib/config/env.ts` |
| **account-flow-fix** | Supabase redirect URL allowlist | Ops-only | `src/routes/auth/callback/+server.ts` |
| **account-flow-fix** | Admin bootstrap via `promote-admin.ts` | Ops-only | `scripts/promote-admin.ts` |
| **account-flow-fix** | Session hydration (`@supabase/ssr`) | Done | `src/hooks.server.ts` |
| **account-flow-fix** | Account menu vs Sign In header | Done | `AccountMenu.svelte`, `Header.svelte` |
| **account-flow-fix** | `isProductionHostname()` includes `*.netlify.app` | Done | `src/lib/server/auth/local-dev.ts` |
| **account-flow-fix** | Refuse mock `ag-session` on production HTTPS | Open | `src/hooks.server.ts` |
| **account-flow-fix** | OAuth/magic-link redirect from `event.url.origin` | Open | `sign-in/+page.server.ts` uses `config.siteUrl` only |
| **account-flow-fix** | Surface `supabaseReady` on sign-in UI | Open | Loaded in `+page.server.ts`; not in `+page.svelte` |
| **market-readiness** | Phase 0 — account flow | Ops-only | account-flow-fix rows |
| **market-readiness** | Phase 0 — `isProductionHostname` netlify guard | Done | `local-dev.ts` |
| **market-readiness** | Phase 1 — Saleor env on Netlify | Ops-only | `saleor/client.ts` |
| **market-readiness** | Phase 1 — gate silent Saleor→mock fallback | Done | `catalog/fallback.ts` |
| **market-readiness** | Phase 1 — `/shop` ≠ 120 mock products | Open (ops) | Needs `PUBLIC_SALEOR_API_URL` on Netlify |
| **market-readiness** | Phase 2 — checkout & payment | Open | `checkout/+page.svelte` |
| **market-readiness** | Phase 3 — homepage UGC from `testimonials` | Open | `+page.server.ts` still `mockUGC` |
| **media-uploads** | Phase 1 — bucket + `/api/media/*` | Open | No migration/routes |
| **polish-plan** | Saleor redeem + cart promo | Done | `/account/redeem`, `checkout/promo.ts` |
| **phase3-plan** (archive) | Workstreams A–D | Done / partial | See archive banner |
| **media-cdn-plan** (archive) | v1 upload strategy | Stale | Superseded by `media-uploads.md` |

---

## Doc corrections (2026-06-30)

| File | Change |
|------|--------|
| `SECURITY-PUBLIC.md` | Created at root (replaces `PUBLIC-SAFE.md`) |
| `deployment.md` | Org mirror + hostnames → placeholders |
| `account-flow-fix.md` | Preview/custom hosts sanitized; `isProductionHostname` → Done |
| `market-readiness.md` | DEV_ADMIN guard status fixed; URLs sanitized |
| `readiness-report.md` | Live URL → placeholder; media Phase 1 → Supabase |
| `auth/discord.md`, `auth/microsoft.md` | Production callback URLs → placeholders |
| `archive/media-cdn-plan.md` | CDN/bucket names redacted |

---

## Link updates

Inbound links to old root paths were updated in `docs/README.md`, `docs/STATUS.md`, `docs/wiki-export/*`, and agent specs (`.cursor/agents/*`) during the reorg commit. Remaining references to old paths live only in `.cursor/commit-manifest.json` (historical manifest — update on next orchestrated commit split).
