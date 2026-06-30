# Audit remediation tracker

**Created:** 2026-06-30  
**Branch:** `dev`  
**Policy:** [SECURITY-PUBLIC.md](../SECURITY-PUBLIC.md) — no infra hostnames or secrets in this doc.

Canonical tracker for findings from `docs/audits/*`, [STATUS.md](../STATUS.md), [TRIAGE.md](./TRIAGE.md), and [DOC-IMPLEMENTATION-MANIFEST.md](./DOC-IMPLEMENTATION-MANIFEST.md). Source audit pages remain for historical detail until every item here is **done** (then the source file may be archived or deleted).

**Related trackers (do not duplicate work here):**

| Tracker | Role |
|---------|------|
| [DOC-IMPLEMENTATION-MANIFEST.md](./DOC-IMPLEMENTATION-MANIFEST.md) | Doc-vs-code batch verdicts (`DOC-###`) |
| [TRIAGE.md](./TRIAGE.md) | Doc reorg map + plan/code evidence table |
| [STATUS.md](../STATUS.md) | High-level open-work summary |
| [meta/polish-plan.md](../meta/polish-plan.md) | Session polish P0 checklist |
| [plans/active/market-readiness.md](./active/market-readiness.md) | Phased launch roadmap |

---

## Summary (open items)

| Priority | Open | Blocked (ops) | Done |
|----------|------|---------------|------|
| **P0** | 1 | 5 | 3 |
| **P1** | 8 | 1 | 4 |
| **P2** | 23 | 0 | 6 |
| **Total** | **32** | **6** | **13** |

*Blocked = external dashboard/env; cannot close in-repo.*

---

## P0 — Launch / CI blockers

| ID | Item | Source | Status | Owner | Acceptance criteria | Code / doc paths |
|----|------|--------|--------|-------|---------------------|------------------|
| AUD-P0-001 | Netlify Supabase env (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) | STATUS, account-flow-fix, polish-plan | **blocked** | auth / ops | Readiness probe `supabase-auth` passes; magic link/OAuth completes on preview host | [account-flow-fix.md](./active/account-flow-fix.md) §1 · `src/lib/server/supabase/client.ts` · DOC-023 |
| AUD-P0-002 | `PUBLIC_SITE_URL` matches browsed deploy origin | STATUS, TRIAGE | **blocked** | auth / ops | OAuth/magic-link redirect lands on same host user signed in from | `src/lib/config/env.ts` · `src/routes/auth/sign-in/+page.server.ts` |
| AUD-P0-003 | Supabase redirect URL allowlist (preview + custom domain) | STATUS, account-flow-fix | **blocked** | auth / ops | `/auth/callback` succeeds on Netlify preview and production domain | `src/routes/auth/callback/+server.ts` · DOC-023 |
| AUD-P0-004 | `PUBLIC_SALEOR_API_URL` + `SALEOR_CHANNEL` on Netlify | saleor-audit, market-readiness, STATUS | **blocked** | saleor / ops | `/shop` product count ≠ 120 mock; images not placeholder CDN | `src/lib/server/saleor/client.ts` · DOC-024 |
| AUD-P0-005 | Bootstrap first admin | STATUS, account-flow-fix | **blocked** | auth / ops | `promote-admin.ts` run; `/admin` accessible with real session | `scripts/promote-admin.ts` |
| AUD-P0-006 | CI Prettier drift (~221 files) | STATUS, polish-plan, agents-skills-audit | **open** | code | `npm run lint` / CI format check green on `dev` | DOC-036 · `.github/workflows/` |
| AUD-P0-007 | Refuse mock `ag-session` on production hostname | site-audit, TRIAGE, account-flow-fix | **done** | auth | `hooks.server.ts` returns `null` session when Supabase unset on prod host | `src/hooks.server.ts` L27–29 · DOC-022 |
| AUD-P0-008 | Surface `productionAuthMisconfigured` on sign-in | TRIAGE, account-flow-fix | **done** | auth | Banner when prod host + missing Supabase keys | `src/routes/auth/sign-in/+page.svelte` · DOC-021 |
| AUD-P0-009 | Gate silent Saleor→mock fallback on production | saleor-audit, market-readiness | **done** | saleor | Production hostname throws/logs instead of silent mock catalog | `src/lib/server/catalog/fallback.ts` |

---

## P1 — Core product gaps

| ID | Item | Source | Status | Owner | Acceptance criteria | Code / doc paths |
|----|------|--------|--------|-------|---------------------|------------------|
| AUD-P1-001 | Saleor checkout complete + payment | saleor-audit, STATUS, saleor.md | **open** | saleor | `CHECKOUT_COMPLETE` mutation; shipping address/methods; payment redirect replaces placeholder UI | `src/routes/checkout/+page.svelte` · DOC-037 |
| AUD-P1-002 | Cart line remove / quantity when Saleor enabled | saleor-audit, polish-plan | **open** | saleor | `checkoutLinesUpdate` / `checkoutLinesDelete` + API routes; `cart.svelte.ts` mutates live checkout | `src/lib/stores/cart.svelte.ts` L186–198 · `src/routes/cart/checkout/` |
| AUD-P1-003 | Add-to-cart from listing cards with `variantId` | saleor-audit | **open** | saleor | `ProductCard` passes default variant; no mock `getCatalogProductById` on Saleor path | `src/lib/components/catalog/ProductCard.svelte` · `cart.svelte.ts` `addItemSaleor` |
| AUD-P1-004 | Media uploads Phase 1 (Supabase Storage + `/api/media/*`) | STATUS, media-uploads, polish-plan | **open** | supabase | Migration, bucket RLS, presigned upload API, review photo wiring | [media-uploads.md](./active/media-uploads.md) · DOC-025 |
| AUD-P1-005 | YouTube live sync (replace stub) | STATUS, polish-plan, readiness-report | **open** | code | `youtube/sync.ts` calls Data API + DB upsert; readiness `youtube` probe passes | `src/lib/server/youtube/sync.ts` · DOC-038 |
| AUD-P1-006 | `/builds` from `build_submissions` table | DOC manifest, build-submissions | **open** | supabase | List + detail loaders query Supabase; mock only when env unset | `src/routes/builds/+page.server.ts` · `src/routes/builds/[slug]/+page.server.ts` · DOC-039, DOC-014 |
| AUD-P1-007 | OAuth/magic-link redirect from request origin on preview | TRIAGE, account-flow-fix | **open** | auth | Preview deploys use `event.url.origin` when `PUBLIC_SITE_URL` unset or mismatched | `src/routes/auth/sign-in/+page.server.ts` L43 |
| AUD-P1-008 | Ghost site provisioned + tags `guide` / `blog` | ghost-audit, STATUS | **blocked** | code / ops | Real posts on staging with `GHOST_URL` + `GHOST_CONTENT_API_KEY` set | [ghost-audit.md](../audits/ghost-audit.md) · [content/ghost.md](../content/ghost.md) · DOC-008, DOC-013 |
| AUD-P1-009 | Ghost production fallback policy | ghost-audit | **open** | code | When Ghost env set but API down: hard error or metric (not silent mock) | `src/lib/server/ghost/posts.ts` |
| AUD-P1-010 | Homepage UGC from approved testimonials | TRIAGE, market-readiness | **done** | supabase | `+page.server.ts` prefers `listFeaturedTestimonials` over `mockUGC` when configured | `src/routes/+page.server.ts` · DOC-026 |
| AUD-P1-011 | Saleor redeem + cart promo | saleor-audit, STATUS | **done** | saleor | `/account/redeem`, `checkoutAddPromoCode`, httpOnly promo cookie | `src/routes/account/redeem/` · `src/lib/server/saleor/checkout/promo.ts` |
| AUD-P1-012 | `isProductionHostname()` includes `*.netlify.app` | TRIAGE, account-flow-fix | **done** | auth | Dev bypass blocked on Netlify preview hosts | `src/lib/server/auth/local-dev.ts` |
| AUD-P1-013 | Primary Saleor catalog loaders env-gated | saleor-audit | **done** | saleor | Shop, parts, gift cards, deals, collections use `$lib/server/catalog/*` swap | `src/lib/server/catalog/products.ts` |

---

## P2 — Polish, SEO, tests, tooling

| ID | Item | Source | Status | Owner | Acceptance criteria | Code / doc paths |
|----|------|--------|--------|-------|---------------------|------------------|
| AUD-P2-001 | Collection product edges on homepage | saleor-audit | **open** | saleor | `getCollections()` returns populated `products[]` from Saleor | `src/lib/server/catalog/collections.ts` |
| AUD-P2-002 | Shop category filter via Saleor taxonomy | saleor-audit | **open** | saleor | Replace `filterProductsByShopCategory()` heuristics with collections/category tree | `src/lib/server/catalog/catalog-helpers.ts` |
| AUD-P2-003 | Saleor catalog search at scale | saleor-audit | **open** | saleor | Server-side search API instead of fetch-100 + client filter | `src/lib/server/catalog/search.ts` · `src/routes/api/catalog/search/` |
| AUD-P2-004 | Parts YMM URL filter vs `fitment` metadata | saleor-audit | **open** | saleor | Category route applies year/make/model query params to Saleor products | `src/routes/parts/[category]/+page.server.ts` |
| AUD-P2-005 | Product detail related products / linked builds | saleor-audit | **open** | saleor | Related slice from Saleor or CMS, not mock helpers only | `src/routes/shop/[slug]/+page.server.ts` |
| AUD-P2-006 | Live Saleor integration smoke tests | saleor-audit | **open** | saleor | Optional CI job with env-gated live API contract | `tests/` · `npm run test:readiness` |
| AUD-P2-007 | Ghost OG / Twitter cards on detail pages | ghost-audit, STATUS | **open** | code | `og:title`, `og:description`, `og:image` from `heroImage` | `src/routes/guides/[slug]/` · `src/routes/blog/[slug]/` |
| AUD-P2-008 | Map Ghost `meta_title` / `meta_description` | ghost-audit | **open** | code | SEO fields override title/excerpt when present | `src/lib/server/ghost/mappers.ts` |
| AUD-P2-009 | Ghost `posts.ts` integration tests | ghost-audit | **open** | code | Mocked `fetch` covers list/slug + fallback paths | `src/lib/server/ghost/posts.ts` |
| AUD-P2-010 | E2E smoke: `/guides`, `/blog` | ghost-audit, saleor-audit | **open** | code | Playwright specs pass after `npx playwright install` | `tests/e2e/` |
| AUD-P2-011 | Ghost Content API cache headers | ghost-audit | **open** | code | `setHeaders` / `Cache-Control` on content routes | `src/routes/guides/**` · `src/routes/blog/**` |
| AUD-P2-012 | Site-wide SEO / OG / analytics | site-audit, STATUS | **open** | code | Per-route meta; analytics hook (Phase 5) | `src/routes/**/+page.svelte` |
| AUD-P2-013 | `prefers-reduced-motion` support | site-audit | **open** | code | Animations respect user preference per style guide | `src/lib/components/shared/AnimatedReveal.svelte` |
| AUD-P2-014 | `LocaleSelector` in header | site-audit | **open** | code | Component wired to nav | `src/lib/components/navigation/LocaleSelector.svelte` · `Header.svelte` |
| AUD-P2-015 | `/media` UGC wall from Supabase | TRIAGE (related) | **open** | supabase | Replace `mockUGC` in `media/+page.server.ts` when testimonials configured | `src/routes/media/+page.server.ts` |
| AUD-P2-016 | `profiles` table contract test | STATUS, readiness-report | **open** | code | Payload contract in `tests/contracts/` | DOC manifest backlog |
| AUD-P2-017 | Optional `readiness-ci` GitHub Actions job | STATUS | **open** | code | Workflow runs `npm run test:readiness` with secrets | `.github/workflows/` |
| AUD-P2-018 | Discord / Microsoft OAuth verification | STATUS, polish-plan | **open** | auth / ops | Providers enabled in Supabase; readiness probes pass | [auth/discord.md](../auth/discord.md) · DOC-010 |
| AUD-P2-019 | Extend `check-secrets.sh` for bundles | DOC manifest | **open** | code | Script scans build output / bundles for secret patterns | `scripts/check-secrets.sh` · DOC-040 |
| AUD-P2-020 | Machine-local agent skill symlinks documented | agents-skills-audit | **open** | docs | Onboarding notes for `agents/*` → `~/.cursor/skills-cursor/` | `agents/AGENTS.md` |
| AUD-P2-021 | daisyUI skill tree removal (post sign-off) | agents-skills-audit | **open** | docs | Deprecation banner remains until tree deleted | `.agents/skills/daisyui/` · `skills-lock.json` |
| AUD-P2-022 | Refresh polish-sweep stale Prettier count | agents-skills-audit | **open** | docs | `.cursor/agents/polish-sweep.md` matches current CI | `.cursor/agents/polish-sweep.md` |
| AUD-P2-023 | Newsletter / user preferences tables | STATUS, supabase.md | **open** | supabase | Schema + RLS per roadmap | [integrations/supabase.md](../integrations/supabase.md) |
| AUD-P2-024 | Site audit: unit test coverage | site-audit | **done** | code | 180+ tests; `npm run test:unit` in CI | `tests/` |
| AUD-P2-025 | Site audit: `+error.svelte` | site-audit | **done** | code | Branded error page exists | `src/routes/+error.svelte` |
| AUD-P2-026 | Agents audit: dead doc paths in agent specs | agents-skills-audit | **done** | docs | No `docs/saleor.md` / `PUBLIC-SAFE.md` hits | `.cursor/agents/` |
| AUD-P2-027 | Agents audit: infra hostnames in agent specs | agents-skills-audit | **done** | docs | Placeholders per SECURITY-PUBLIC | `.cursor/agents/market-readiness.md` |
| AUD-P2-028 | Agents audit: component path fixes | agents-skills-audit | **done** | docs | Full paths under `catalog/`, `navigation/`, `layout/` | `.cursor/agents/*.md` |
| AUD-P2-029 | `docs/README.md` agent index complete | agents-skills-audit | **done** | docs | All 13 agent specs listed | [README.md](../README.md) |

---

## Source audit retirement status

| Source file | Open items remaining | Retire when |
|-------------|---------------------|-------------|
| [audits/site-audit.md](../audits/site-audit.md) | P2-012–014 (SEO, a11y, locale) | All AUD-P2 site rows **done** |
| [audits/saleor-audit.md](../audits/saleor-audit.md) | P0-004 (ops), P1-001–003, P2-001–006 | All Saleor AUD rows **done** |
| [audits/ghost-audit.md](../audits/ghost-audit.md) | P1-008–009, P2-007–011 | All Ghost AUD rows **done** |
| [meta/agents-skills-audit.md](../meta/agents-skills-audit.md) | P2-020–022 | AUD-P2-020–022 **done** |

*Do not delete source audits until the row above is satisfied.*

---

## Verification

```bash
npm run test:unit          # 184+ tests
npm run test:contracts
npm run test:readiness     # needs .env
bash scripts/check-secrets.sh
```

Update this file when closing items; bump the summary table counts and set status to **done** or **blocked** with a link to the closing PR/commit.
