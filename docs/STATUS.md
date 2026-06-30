# Project status — open work tracker

**Public documentation policy:** [SECURITY-PUBLIC.md](./SECURITY-PUBLIC.md)

**Last updated:** 2026-07-02  
**Canonical next-step docs:** [plans/AUDIT-REMEDIATION.md](./plans/AUDIT-REMEDIATION.md) · [plans/active/inspiration-polish-tracker.md](./plans/active/inspiration-polish-tracker.md) · [plans/active/batch-2026-07-02.md](./plans/active/batch-2026-07-02.md) · [plans/active/batch-2026-07-01.md](./plans/active/batch-2026-07-01.md) · [plans/active/market-readiness.md](./plans/active/market-readiness.md) · [plans/active/account-flow-fix.md](./plans/active/account-flow-fix.md)

This file reconciles “next steps” across all `docs/` so nothing is orphaned. Items are **Done**, **Ops** (external dashboard/env), or **Open** (code work).

---

## Done in code (June 2026)

| Area                                                       | Evidence                                                                                                                                                       |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 3 nav/UX bugs                                        | [archive/phase3-plan.md](./archive/phase3-plan.md) workstreams A–D marked Done                                                                                 |
| Auth, account menu, local dev                              | `AccountMenu.svelte`, `local-dev.ts`, `/auth/*`                                                                                                                |
| Production admin + lockdown                                | `promote-admin.ts`, `SITE_LOCKED`, `/locked`                                                                                                                   |
| Saleor redeem / promo                                      | `/account/redeem`, `checkout/promo.ts`, `checkoutAddPromoCode`                                                                                                 |
| Security hardening                                         | [security-hardening.md](./testing/security-hardening.md) — limits, rate limit, httpOnly promo cookie                                                           |
| API contract tests                                         | `tests/contracts/` — 20 tests; `npm run test:contracts`                                                                                                        |
| CRUD integration tests                                     | `tests/integration/crud-business-logic.test.ts` — 9 tests                                                                                                      |
| Readiness probes                                           | `scripts/test-readiness.ts`, `npm run test:readiness`                                                                                                          |
| `*.netlify.app` dev bypass block                           | `isProductionHostname()` in `local-dev.ts`                                                                                                                     |
| Production catalog mock guard                              | `guardMockCatalogFallback()` in `catalog/fallback.ts`                                                                                                          |
| Production `ag-session` refusal + sign-in misconfig banner | `hooks.server.ts`, `sign-in/+page.svelte`                                                                                                                      |
| Homepage UGC from approved testimonials                    | `+page.server.ts`, `testimonials/to-ugc.ts` (mock fallback when Supabase unset)                                                                                |
| Shop category filters from Saleor                          | `catalog/shop-filters.ts`, `GET /api/catalog/shop-filters`                                                                                                     |
| Public `/builds` from approved `build_submissions`         | `src/lib/server/builds/public.ts` (mock fallback when Supabase unset)                                                                                            |
| Cart line qty/remove when Saleor enabled                   | `cart.svelte.ts`, `saleor/checkout.ts`, `/cart/checkout`                                                                                                        |
| OAuth/magic-link callback from request origin              | `callback-url.ts`, sign-in/sign-up actions                                                                                                                     |
| Media uploads Phase 1 API + migration                      | `src/routes/api/media/*`, `ReviewPhotoUpload.svelte`, migration `20250630120000_media_assets.sql`                                                              |
| CI Prettier / format drift                                 | Commit `63eb20a` — `npm run lint` green on `dev`                                                                                                               |
| `check-secrets.sh` bundle + deploy config scan             | Commit `ce05185` — client bundle `SERVICE_ROLE` grep; `DEV_ADMIN` in tracked deploy config                                                                     |
| Ghost guide category/topic filters                         | `guide-filters.ts`, `/guides?category=` + `?topic=`, `/api/content/guide-filters`                                                                              |
| Locale currency + Saleor channel pricing                   | `currency.ts`, `locale.svelte.ts`, `channels.ts` — channel-native amounts when Saleor on                                                                       |
| Featured sections CMS scaffold                             | `featured-sections/repository.ts`, `/admin/featured`, homepage `+page.server.ts`                                                                               |
| Shop collection filter scaffold (`?collection=`)             | `shop-collection.ts`, `shop/+page.server.ts` — mock/Saleor swap point                                                                                        |
| Listing quick-add with Saleor `variantId` (AUD-P1-003)       | `ProductCard.svelte`, `cart.svelte.ts` `addItemSaleor`                                                                                                       |
| Ghost production fallback policy (AUD-P1-009)                | `ghost/fallback.ts`, `guardMockGhostFallback()` — no silent mock when Ghost env set on prod                                                                  |
| YouTube live sync + watch hub DB preference (AUD-P1-005)     | `youtube/sync.ts`, `/api/cron/youtube-sync`, `/watch` prefers Supabase `videos`                                                                              |
| Saleor checkout shipping + payment proxies (AUD-P1-001 partial) | `routes/checkout/shipping`, `payment/*`, `complete`; UI wired — pay disabled until Payment App on channel                                                 |
| IP scaffold quick wins (hero, orders, CDN reads, wholesale)  | `67a150c` — admin `saveHero`, order snapshots mock path, `resolveUgcPublicUrl`, wholesale form → repository, collection filter Saleor path                 |
| Footer layout (Z1-inspired condense)                         | `Footer.svelte` — `5ca1b1f`                                                                                                                                  |
| GitHub wiki                                                | Published — [wiki home](https://github.com/jjheffernan/animalgaragenet/wiki); backup in `docs/wiki-export/` (sanitized for public — no infra/AWS/secret names) |
| Org mirror sync                                            | `scripts/sync-org-mirror.sh` on `main`                                                                                                                         |
| Navbar polish (IP-BUG-001, IP-BUG-002)                     | `Header.svelte`, `Footer.svelte`, `NewsletterSignup.svelte` — `057242a`, `61b74c2`, `ec186a7`                                                                |
| Staff admin dashboard overview                             | `/admin/dashboard`, sidebar shell, `/admin` redirect — `3732fb9`                                                                                                 |
| Admin runtime dashboard (IP-026)                           | `/admin/runtime` (Integrations), `runtime-status.ts` — `d1d6823`                                                                                                 |
| Account social connections (IP-027)                        | `/account/connections`, `api/account/connections`, migration `20250630240000` — `ed1465d`                                                                    |
| Saleor order mirror webhook (IP-012)                       | `api/webhooks/saleor`, `order-webhook.ts` — `7649a9e`                                                                                                          |
| Component-route audit cleanup (AUD-P2-034–038)             | SupportCTA removed, `/media` nav, admin stubs disabled, builds/submit shell — `847ba4b`                                                                        |
| July 1 batch (BATCH-002–012)                               | Commerce search, collections, CMS sections, UGC wall, Ghost SEO, profiles contract, admin users, locale, Ghost tests — `4d0d0fd`–`a895eb7`                   |
| QoL polish pass (IP-BUG-003–004, list canvas)              | Shop filters, sign-out, parts ribbon, mobile footer, `PaginatedListCanvas` — `acd03ad`–`7513c34`                                                               |

---

## Ops — blocked on Netlify / Supabase / Saleor dashboard

These appear as unchecked boxes in plans but **cannot be completed in-repo**:

| Task                                             | Doc                                                                  | Action                                                                  |
| ------------------------------------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Set Supabase + `PUBLIC_SITE_URL` on Netlify      | [account-flow-fix.md](./plans/active/account-flow-fix.md)            | Netlify env UI                                                          |
| Supabase redirect URLs (Netlify + custom domain) | account-flow-fix                                                     | Supabase Auth → URL config                                              |
| Bootstrap first admin                            | account-flow-fix                                                     | `npx tsx --env-file=.env scripts/promote-admin.ts user@email.com admin` |
| Set `PUBLIC_SALEOR_API_URL` + `SALEOR_CHANNEL`   | [market-readiness.md](./plans/active/market-readiness.md) Phase 1    | Netlify env                                                             |
| Verify `/shop` ≠ 120 mock products               | market-readiness                                                     | After Saleor env + redeploy                                             |
| Populate `.env` and run readiness                | [readiness-report.md](./testing/readiness-report.md)                 | Local or CI secrets                                                     |
| Apply media migration on production Supabase     | [media-uploads.md](./plans/active/media-uploads.md)                  | `supabase db push` or dashboard apply                                   |
| Enable Discord/Microsoft OAuth                   | [discord.md](./auth/discord.md), [microsoft.md](./auth/microsoft.md) | Supabase + provider consoles                                            |
| Ghost site + tags                                | [ghost-audit.md](./audits/ghost-audit.md)                            | Ghost admin                                                             |
| `<org-sync-secret>` rotation docs                | readiness-report                                                     | Personal repo Actions secret                                            |

**Do not** set `DEV_ADMIN` or `LOCAL_DEV_AUTH` on Netlify.

---

## Open — code / CI work

**Audit counts (see [AUDIT-REMEDIATION.md](./plans/AUDIT-REMEDIATION.md)):** 11 open · 6 blocked (ops) · 42 done — P1 checkout (`AUD-P1-001`) is **partial** (code done; ops gate only), not open.

| Priority | Task                                                            | Tracker                                                                        |
| -------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| P0       | Merge `dev` → `main` when Netlify env configured                | [deployment.md](./style-guide/backend-ops/deployment.md)                       |
| P1       | Saleor checkout: Payment App enablement + live pay verify       | [batch-2026-07-01.md](./plans/active/batch-2026-07-01.md) BATCH-001 · [saleor-payments.md](./commerce/saleor-payments.md) |
| P2       | July 2 code batch (YMM filter, related products, SEO, CI, …)    | [batch-2026-07-02.md](./plans/active/batch-2026-07-02.md)                      |
| P2       | Ghost live CMS (fallback policy + detail SEO shipped)           | IP-015 · [ghost-audit.md](./audits/ghost-audit.md)                             |
| P2       | Remaining homepage mock slices (non-watch)                        | market-readiness Phase 3                                                       |
| P2       | `readiness-ci` optional Actions job                             | BATCH-018 · readiness-report                                                   |
| P2       | OAuth Discord/Azure verification                                | [inspiration-polish-tracker.md](./plans/active/inspiration-polish-tracker.md) |
| P2       | Site-wide SEO/OG (non-Ghost routes), analytics                  | BATCH-016 · Phase 5 (see [README.md](./README.md))                             |
| P2       | Newsletter / user preferences tables                            | [supabase.md](./integrations/supabase.md) roadmap                              |
| P2       | Faceted parts search (IP-028)                                   | BATCH-019                                                                      |
| P2       | CDN CloudFront invalidation (IP-013 remainder)                  | BATCH-020                                                                      |

---

## Doc hygiene — resolved contradictions

| Was stale                                                                | Fixed                                          |
| ------------------------------------------------------------------------ | ---------------------------------------------- |
| [inspiration.md](./meta/inspiration.md) Phase 3 P0 bugs “in progress”    | Marked Done — see archive/phase3-plan          |
| [saleor.md](./commerce/saleor.md) “redeem not implemented”               | Updated — redeem wired                         |
| [site-audit.md](./audits/site-audit.md) “no tests”                       | Updated — 180+ unit/contract/integration tests |
| [wiki-export/README.md](./wiki-export/README.md) “wiki not enabled”      | Updated — published                            |
| `readiness-report.md` contract-test todos | Marked partial/done where applicable           |
| [saleor-audit.md](./audits/saleor-audit.md) checkout/cart rows | Updated — proxies + Stripe scaffold wired |
| [supabase-schema.md](./infrastructure/supabase-schema.md) “Planned” tables | Updated — wired migrations through `social_connections` |

---

## Intentionally future (not launch blockers)

- Advanced animations, scroll-driven motion — [animations.md](./style-guide/frontend/animations.md)
- Full media CDN (Garage/S3) — [media-cdn-plan.md](./archive/media-cdn-plan.md) (superseded by media-uploads phase 1)
- Dashboard submodule — [dashboard-adoption-plan.md](./archive/dashboard-adoption-plan.md) (stay in-repo `/admin`)
- Marketing / inspiration backlog — [inspiration.md](./meta/inspiration.md) “Not Yet Built” sections

---

## Quick verification commands

```bash
npm run test:unit          # 184 tests
npm run test:contracts     # 20 payload contracts
npm run test:readiness     # 11 probes (needs .env)
bash scripts/check-secrets.sh
```
