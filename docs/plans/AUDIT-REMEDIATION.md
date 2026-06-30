# Audit remediation tracker

**Created:** 2026-06-30  
**Branch:** `dev`  
**Policy:** [SECURITY-PUBLIC.md](../SECURITY-PUBLIC.md) — no infra hostnames or secrets in this doc.

Canonical tracker for findings from `docs/audits/*`, [STATUS.md](../STATUS.md), and [TRIAGE.md](./TRIAGE.md). Source audit pages remain for historical detail until every item here is **done** (then the source file may be archived or deleted).

**Related trackers (do not duplicate work here):**

| Tracker                                                          | Role                                     |
| ---------------------------------------------------------------- | ---------------------------------------- |
| [TRIAGE.md](./TRIAGE.md)                                         | Doc reorg map + plan/code evidence table |
| [STATUS.md](../STATUS.md)                                        | High-level open-work summary             |
| [archive/polish-plan.md](../archive/polish-plan.md)              | Complete — session polish (June 2026)      |
| [plans/active/inspiration-polish-tracker.md](./active/inspiration-polish-tracker.md) | Canonical inspiration + polish open work |
| [plans/active/market-readiness.md](./active/market-readiness.md) | Phased launch roadmap                    |
| [archive/doc-implementation-manifest.md](../archive/doc-implementation-manifest.md) | Superseded June 2026 `DOC-###` batch |

---

## Summary (open items)

| Priority  | Open   | Blocked (ops) | Done   |
| --------- | ------ | ------------- | ------ |
| **P0**    | 0      | 5             | 4      |
| **P1**    | 0      | 1             | 11     |
| **P2**    | 11     | 0             | 27     |
| **Total** | **11** | **6**         | **42** |

_Blocked = external dashboard/env; cannot close in-repo._

---

## P0 — Launch / CI blockers

| ID         | Item                                                                                                  | Source                                   | Status      | Owner        | Acceptance criteria                                                                | Code / doc paths                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------- | ----------- | ------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| AUD-P0-001 | Netlify Supabase env (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) | STATUS, account-flow-fix, polish-plan    | **blocked** | auth / ops   | Readiness probe `supabase-auth` passes; magic link/OAuth completes on preview host | [account-flow-fix.md](./active/account-flow-fix.md) §1 · `src/lib/server/supabase/client.ts` · DOC-023 |
| AUD-P0-002 | `PUBLIC_SITE_URL` matches browsed deploy origin                                                       | STATUS, TRIAGE                           | **blocked** | auth / ops   | OAuth/magic-link redirect lands on same host user signed in from                   | `src/lib/config/env.ts` · `src/routes/auth/sign-in/+page.server.ts`                                    |
| AUD-P0-003 | Supabase redirect URL allowlist (preview + custom domain)                                             | STATUS, account-flow-fix                 | **blocked** | auth / ops   | `/auth/callback` succeeds on Netlify preview and production domain                 | `src/routes/auth/callback/+server.ts` · DOC-023                                                        |
| AUD-P0-004 | `PUBLIC_SALEOR_API_URL` + `SALEOR_CHANNEL` on Netlify                                                 | saleor-audit, market-readiness, STATUS   | **blocked** | saleor / ops | `/shop` product count ≠ 120 mock; images not placeholder CDN                       | `src/lib/server/saleor/client.ts` · DOC-024                                                            |
| AUD-P0-005 | Bootstrap first admin                                                                                 | STATUS, account-flow-fix                 | **blocked** | auth / ops   | `promote-admin.ts` run; `/admin` accessible with real session                      | `scripts/promote-admin.ts`                                                                             |
| AUD-P0-006 | CI Prettier drift (~221 files)                                                                        | STATUS, polish-plan, agents-skills-audit | **done**    | code         | `npm run lint` / CI format check green on `dev`                                    | Commit `63eb20a` · `.github/workflows/`                                                                |
| AUD-P0-007 | Refuse mock `ag-session` on production hostname                                                       | site-audit, TRIAGE, account-flow-fix     | **done**    | auth         | `hooks.server.ts` returns `null` session when Supabase unset on prod host          | `src/hooks.server.ts` L27–29 · DOC-022                                                                 |
| AUD-P0-008 | Surface `productionAuthMisconfigured` on sign-in                                                      | TRIAGE, account-flow-fix                 | **done**    | auth         | Banner when prod host + missing Supabase keys                                      | `src/routes/auth/sign-in/+page.svelte` · DOC-021                                                       |
| AUD-P0-009 | Gate silent Saleor→mock fallback on production                                                        | saleor-audit, market-readiness           | **done**    | saleor       | Production hostname throws/logs instead of silent mock catalog                     | `src/lib/server/catalog/fallback.ts`                                                                   |

---

## P1 — Core product gaps

| ID         | Item                                                      | Source                                | Status      | Owner      | Acceptance criteria                                                                                | Code / doc paths                                                                                        |
| ---------- | --------------------------------------------------------- | ------------------------------------- | ----------- | ---------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| AUD-P1-001 | Saleor checkout complete + payment                        | saleor-audit, STATUS, saleor.md       | **partial** | saleor     | Code path complete (shipping, payment proxies, Stripe Elements); live pay gated on Payment App ops | `src/routes/checkout/` · `src/lib/server/saleor/checkout.ts` · DOC-037 |
| AUD-P1-002 | Cart line remove / quantity when Saleor enabled           | saleor-audit, polish-plan             | **done**    | saleor     | `checkoutLinesUpdate` / `checkoutLinesDelete` + API routes; `cart.svelte.ts` mutates live checkout | `src/lib/stores/cart.svelte.ts` · `src/routes/cart/checkout/` · `src/lib/server/saleor/checkout.ts`     |
| AUD-P1-003 | Add-to-cart from listing cards with `variantId`           | saleor-audit                          | **done**    | saleor     | `ProductCard` passes default variant; no mock `getCatalogProductById` on Saleor path               | `src/lib/components/catalog/ProductCard.svelte` · `cart.svelte.ts` `addItemSaleor`                      |
| AUD-P1-004 | Media uploads Phase 1 (Supabase Storage + `/api/media/*`) | STATUS, media-uploads, polish-plan    | **done**    | supabase   | Migration + presigned API + `ReviewPhotoUpload`; apply migration on Supabase project (ops)         | [media-uploads.md](./active/media-uploads.md) · `src/routes/api/media/*`                               |
| AUD-P1-005 | YouTube live sync (replace stub)                          | STATUS, polish-plan, readiness-report | **done**    | code       | `youtube/sync.ts` calls Data API + DB upsert; readiness `youtube` probe passes                     | `src/lib/server/youtube/sync.ts` · DOC-038                                                              |
| AUD-P1-006 | `/builds` from `build_submissions` table                  | build-submissions, TRIAGE             | **done**    | supabase   | List + detail loaders query approved rows; mock only when env unset                                | `src/lib/server/builds/public.ts` · `src/routes/builds/*`                                               |
| AUD-P1-007 | OAuth/magic-link redirect from request origin on preview  | TRIAGE, account-flow-fix              | **done**    | auth       | Preview deploys use `event.url.origin` when allowed via `callback-url.ts`                          | `src/lib/server/auth/callback-url.ts` · sign-in/sign-up actions                                         |
| AUD-P1-008 | Ghost site provisioned + tags `guide` / `blog`            | ghost-audit, STATUS                   | **blocked** | code / ops | Real posts on staging with `GHOST_URL` + `GHOST_CONTENT_API_KEY` set                               | [ghost-audit.md](../audits/ghost-audit.md) · [content/ghost.md](../content/ghost.md) · DOC-008, DOC-013 |
| AUD-P1-009 | Ghost production fallback policy                          | ghost-audit                           | **done**    | code       | When Ghost env set but API down: hard error or metric (not silent mock)                            | `src/lib/server/ghost/posts.ts`                                                                         |
| AUD-P1-010 | Homepage UGC from approved testimonials                   | TRIAGE, market-readiness              | **done**    | supabase   | `+page.server.ts` prefers `listFeaturedTestimonials` over `mockUGC` when configured                | `src/routes/+page.server.ts` · DOC-026                                                                  |
| AUD-P1-011 | Saleor redeem + cart promo                                | saleor-audit, STATUS                  | **done**    | saleor     | `/account/redeem`, `checkoutAddPromoCode`, httpOnly promo cookie                                   | `src/routes/account/redeem/` · `src/lib/server/saleor/checkout/promo.ts`                                |
| AUD-P1-012 | `isProductionHostname()` includes `*.netlify.app`         | TRIAGE, account-flow-fix              | **done**    | auth       | Dev bypass blocked on Netlify preview hosts                                                        | `src/lib/server/auth/local-dev.ts`                                                                      |
| AUD-P1-013 | Primary Saleor catalog loaders env-gated                  | saleor-audit                          | **done**    | saleor     | Shop, parts, gift cards, deals, collections use `$lib/server/catalog/*` swap                       | `src/lib/server/catalog/products.ts`                                                                    |

**Next (partial P1 items):**

- **AUD-P1-001 — Ops (only remaining gate):** Install and enable Stripe Payment App (`saleor.app.payment.stripe`) on the Saleor channel so `paymentGateways` is non-empty on checkout load. No storefront `STRIPE_*` env vars are required — publishable key comes from `paymentGatewayInitialize`.
- **AUD-P1-001 — Code:** **done** — shipping, payment proxies, Stripe Elements, structured Payment App missing UX (`PAYMENT_APP_OPS_HINT`).
- **AUD-P1-001 — Verify (ops):** `npm run test:readiness` → `saleor-checkout` pass; manual test card → order visible in Saleor Dashboard.

---

## P2 — Polish, SEO, tests, tooling

| ID         | Item                                            | Source                    | Status   | Owner      | Acceptance criteria                                                                | Code / doc paths                                                        |
| ---------- | ----------------------------------------------- | ------------------------- | -------- | ---------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| AUD-P2-001 | Collection product edges on homepage            | saleor-audit              | **done** | saleor     | `getCollections()` returns populated `products[]` from Saleor                      | `src/lib/server/catalog/collections.ts` · BATCH-002                     |
| AUD-P2-002 | Shop category filter via Saleor taxonomy        | saleor-audit              | **done** | saleor     | `getShopFilterOptions()` + `filterProductsByShopSlug()` use Saleor category tree when env set | `src/lib/server/catalog/shop-filters.ts` · `/api/catalog/shop-filters` |
| AUD-P2-003 | Saleor catalog search at scale                  | saleor-audit              | **done** | saleor     | Server-side `PRODUCT_SEARCH_QUERY` instead of fetch-100 + client filter            | `src/lib/server/catalog/search.ts` · BATCH-010                          |
| AUD-P2-004 | Parts YMM URL filter vs `fitment` metadata      | saleor-audit              | **open** | saleor     | Category route applies year/make/model query params to Saleor products             | `src/routes/parts/[category]/+page.server.ts`                           |
| AUD-P2-005 | Product detail related products / linked builds | saleor-audit              | **open** | saleor     | Related slice from Saleor or CMS, not mock helpers only                            | `src/routes/shop/[slug]/+page.server.ts`                                |
| AUD-P2-006 | Live Saleor integration smoke tests             | saleor-audit              | **open** | saleor     | Optional CI job with env-gated live API contract                                   | `tests/` · `npm run test:readiness`                                     |
| AUD-P2-007 | Ghost OG / Twitter cards on detail pages        | ghost-audit, STATUS       | **done** | code       | `og:title`, `og:description`, `og:image` from `heroImage`                          | `src/routes/guides/[slug]/` · `src/routes/blog/[slug]/` · BATCH-005 · `a895eb7` |
| AUD-P2-008 | Map Ghost `meta_title` / `meta_description`     | ghost-audit               | **done** | code       | SEO fields override title/excerpt when present                                     | `src/lib/server/ghost/mappers.ts` · BATCH-005                               |
| AUD-P2-009 | Ghost `posts.ts` integration tests              | ghost-audit               | **done** | code       | Mocked `fetch` covers list/slug + fallback paths                                   | `src/lib/server/ghost/posts.test.ts`                                    |
| AUD-P2-010 | E2E smoke: `/guides`, `/blog`                   | ghost-audit, saleor-audit | **done** | code       | Playwright specs pass after `npx playwright install`                               | `e2e/content.spec.ts`                                                 |
| AUD-P2-011 | Ghost Content API cache headers                 | ghost-audit               | **open** | code       | `setHeaders` / `Cache-Control` on content routes                                   | `src/routes/guides/**` · `src/routes/blog/**`                           |
| AUD-P2-012 | Site-wide SEO / OG / analytics                  | site-audit, STATUS        | **open** | code       | Per-route meta; analytics hook (Phase 5)                                           | `src/routes/**/+page.svelte`                                            |
| AUD-P2-013 | `prefers-reduced-motion` support                | site-audit                | **open** | code       | Animations respect user preference per style guide                                 | `src/lib/components/shared/AnimatedReveal.svelte`                       |
| AUD-P2-014 | `LocaleSelector` in header                      | site-audit                | **done** | code       | Component wired to nav                                                             | `src/lib/components/navigation/LocaleSelector.svelte` · `Header.svelte` |
| AUD-P2-015 | `/media` UGC wall from Supabase                 | TRIAGE (related)          | **done** | supabase   | `loadMediaUgcItems()` from featured/approved testimonials when Supabase configured | `src/routes/media/+page.server.ts` · BATCH-004 · `a895eb7`              |
| AUD-P2-016 | `profiles` table contract test                  | STATUS, readiness-report  | **done** | code       | Payload contract in `tests/contracts/`                                             | `tests/contracts/profiles-signup-trigger.test.ts` · BATCH-006            |
| AUD-P2-017 | Optional `readiness-ci` GitHub Actions job      | STATUS                    | **open** | code       | Workflow runs `npm run test:readiness` with secrets                                | `.github/workflows/`                                                    |
| AUD-P2-018 | Discord / Microsoft OAuth verification          | STATUS, polish-plan       | **open** | auth / ops | Providers enabled in Supabase; readiness probes pass                               | [auth/discord.md](../auth/discord.md) · DOC-010                         |
| AUD-P2-019 | Extend `check-secrets.sh` for bundles           | DOC manifest              | **done** | code       | Script scans client bundles for `SERVICE_ROLE`; blocks `DEV_ADMIN` in deploy config | Commit `ce05185` · `scripts/check-secrets.sh` · DOC-040                 |
| AUD-P2-020 | Machine-local agent skill symlinks documented   | agents-skills-audit       | **open** | docs       | Onboarding notes for `agents/*` → `~/.cursor/skills-cursor/`                       | `agents/AGENTS.md`                                                      |
| AUD-P2-021 | daisyUI skill tree removal (post sign-off)      | agents-skills-audit       | **open** | docs       | Deprecation banner remains until tree deleted                                      | `.agents/skills/daisyui/` · `skills-lock.json`                          |
| AUD-P2-022 | Refresh polish-sweep stale Prettier count       | agents-skills-audit       | **done** | docs       | `.cursor/agents/polish-sweep.md` matches current CI                                | `.cursor/agents/polish-sweep.md`                                        |
| AUD-P2-030 | Ghost guide category/topic filters              | ghost-audit, content/ghost | **done** | code       | `getGuideFilterOptions()` hydrates from Ghost; `/guides?category=` + `?topic=`     | `src/lib/server/ghost/guide-filters.ts` · `/api/content/guide-filters` |
| AUD-P2-031 | Locale currency respects Saleor channel           | saleor-audit, i18n        | **done** | saleor     | `formatDisplayPrice` + `getChannelForLocale()`; mock rates when Saleor off         | `src/lib/i18n/currency.ts` · `src/lib/stores/locale.svelte.ts`         |
| AUD-P2-032 | Featured sections CMS scaffold                  | inspiration tracker       | **done** | supabase   | Repository + `/admin/featured` + homepage loader; mock when Supabase unset         | `src/lib/server/featured-sections/repository.ts` · migration `20250630150000` |
| AUD-P2-033 | Header utility cluster spacing (signed-in)      | polish / IP-BUG-001       | **done** | code       | Desktop `lg:grid` layout; fixed `size-9` icon targets; badge overlays on bell/cart | `src/lib/components/layout/Header.svelte`                               |
| AUD-P2-034 | Remove orphan `SupportCTA.svelte`               | component-route-audit     | **done** | code       | Zero-import component deleted; README index updated                                | `src/lib/components/marketing/SupportCTA.svelte`                          |
| AUD-P2-035 | `/military` discoverability                     | component-route-audit     | **done** | code       | Linked from footer or checkout/loyalty, or route archived with redirect            | `src/routes/military/+page.svelte` · `Footer.svelte`                  |
| AUD-P2-036 | `/media` in community nav                       | component-route-audit     | **done** | code       | `media` added to `communityLinks` in `Header.svelte`                               | `src/lib/components/layout/Header.svelte`                                 |
| AUD-P2-037 | Admin nav stub routes (6× 404)                  | component-route-audit     | **done** | code       | Six prototype links `disabled: true` until routes scaffolded; no 404 from sidebar | `src/lib/admin/nav.ts` · commit `847ba4b`                                 |
| AUD-P2-038 | `/builds/submit` dead page shell                | component-route-audit     | **done** | code       | Unreachable `+page.svelte` removed; `+page.server.ts` redirect retained            | `src/routes/builds/submit/`                                             |
| AUD-P2-023 | Newsletter / user preferences tables            | STATUS, supabase.md       | **open** | supabase   | Schema + RLS per roadmap                                                           | [integrations/supabase.md](../integrations/supabase.md)                 |
| AUD-P2-024 | Site audit: unit test coverage                  | site-audit                | **done** | code       | 180+ tests; `npm run test:unit` in CI                                              | `tests/`                                                                |
| AUD-P2-025 | Site audit: `+error.svelte`                     | site-audit                | **done** | code       | Branded error page exists                                                          | `src/routes/+error.svelte`                                              |
| AUD-P2-026 | Agents audit: dead doc paths in agent specs     | agents-skills-audit       | **done** | docs       | No `docs/saleor.md` / `PUBLIC-SAFE.md` hits                                        | `.cursor/agents/`                                                       |
| AUD-P2-027 | Agents audit: infra hostnames in agent specs    | agents-skills-audit       | **done** | docs       | Placeholders per SECURITY-PUBLIC                                                   | `.cursor/agents/market-readiness.md`                                    |
| AUD-P2-028 | Agents audit: component path fixes              | agents-skills-audit       | **done** | docs       | Full paths under `catalog/`, `navigation/`, `layout/`                              | `.cursor/agents/*.md`                                                   |
| AUD-P2-029 | `docs/README.md` agent index complete           | agents-skills-audit       | **done** | docs       | All 13 agent specs listed                                                          | [README.md](../README.md)                                               |

---

## Source audit retirement status

| Source file                                                   | Open items remaining                 | Retire when                   |
| ------------------------------------------------------------- | ------------------------------------ | ----------------------------- |
| [audits/site-audit.md](../audits/site-audit.md)               | P2-012–013 (SEO, a11y)               | All AUD-P2 site rows **done** |
| [audits/saleor-audit.md](../audits/saleor-audit.md)           | P0-004 (ops), P1-001 (partial), P2-001–006 | All Saleor AUD rows **done**  |
| [audits/ghost-audit.md](../audits/ghost-audit.md)             | P1-008, P2-011           | All Ghost AUD rows **done**   |
| [meta/agents-skills-audit.md](../meta/agents-skills-audit.md) | —                                    | AUD-P2-020–022 **done**       |
| [audits/component-route-audit.md](../audits/component-route-audit.md) | — | AUD-P2-034–038 **done** |

_Do not delete source audits until the row above is satisfied._

---

## Verification

```bash
npm run test:unit          # 184+ tests
npm run test:contracts
npm run test:readiness     # needs .env
bash scripts/check-secrets.sh
```

Update this file when closing items; bump the summary table counts and set status to **done** or **blocked** with a link to the closing PR/commit.
