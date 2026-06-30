# Project status — open work tracker

**Public documentation policy:** [SECURITY-PUBLIC.md](./SECURITY-PUBLIC.md)

**Last updated:** 2026-06-30  
**Canonical next-step docs:** [infrastructure/deployment.md](./infrastructure/deployment.md) (production runbook) · [plans/active/ACTIVE-SWARM-EXECUTION.md](./plans/active/ACTIVE-SWARM-EXECUTION.md) (swarm batch slots A–D) · [plans/active/next-steps-tracker.md](./plans/active/next-steps-tracker.md) (implementer queue) · [plans/AUDIT-REMEDIATION.md](./plans/AUDIT-REMEDIATION.md) · [plans/active/inspiration-polish-tracker.md](./plans/active/inspiration-polish-tracker.md) · [plans/active/ponytail-audit-tracker.md](./plans/active/ponytail-audit-tracker.md) · [plans/active/market-readiness.md](./plans/active/market-readiness.md) · [plans/active/account-flow-fix.md](./plans/active/account-flow-fix.md) · [archive/batch-2026-07-03-followups.md](./archive/batch-2026-07-03-followups.md) (ops apply)

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
| Sitemap & route navigation audit                           | [sitemap-route-audit.md](./audits/sitemap-route-audit.md) — SEO-001–003 shipped |
| July 1 batch (BATCH-002–012)                               | Commerce search, collections, CMS sections, UGC wall, Ghost SEO, profiles contract, admin users, locale, Ghost tests — `4d0d0fd`–`a895eb7`                   |
| QoL polish pass (IP-BUG-003–004, list canvas)              | Shop filters, sign-out, parts ribbon, mobile footer, `PaginatedListCanvas` — `acd03ad`–`7513c34`                                                               |
| Pagination + sticky catalog toolbars                       | `86affdd` — mobile pagination layout; sticky shop/parts ribbons                                                                                                  |
| Shop filter grouping + product showcases                   | `9d4967a` — grouped category filters; compact product showcase blocks                                                                                          |
| Public bug report form (IP-031 partial)                    | `/support/report-bug`, `POST /api/support/bug-report` — `24579e8`; admin inbox → BATCH-021                                                                       |
| Admin entry reconciliation                                 | AccountMenu → `/admin/dashboard`; `/admin` redirect; Integrations → `/admin/runtime` — `3732fb9`, `1944119`                                                      |
| July 2 batch (BATCH-013–020)                               | Parts YMM filter, related products, faceted search, Ghost cache headers, SEO baseline, reduced-motion, readiness CI, CDN invalidation — `b4614c5`–`905f481`   |
| July 3 follow-up (BATCH-021)                               | Admin bug report inbox — `/admin/bug-reports` — `905f481`                                                                                                        |
| CDN invalidation path allowlist (AUD-SEC-001)              | `invalidateCdnPaths` allowlist + admin API cap — `029498b` · [security-audit-2026-07.md](./audits/security-audit-2026-07.md)                                   |
| Supabase migration squash (17 → 3)                         | `20250701000000` / `010000` / `020000` logical files — `65e9d52` · [migration-squash-notes.md](./infrastructure/migration-squash-notes.md)                     |
| Ponytail audit (PT-P1/P2)                                  | Shared mock-fallback guard, API POST dedupe, store localStorage helpers — `f1d4ccf`, `2e7700f` · [ponytail-audit-tracker.md](./plans/active/ponytail-audit-tracker.md) |
| Ponytail P3 catalog dedupe + form stub                     | `withSaleorCatalog` helper — `2f26fbc`; dead `submitFormStub` branch — `4481873` (PT-P3-003)                                                                      |
| Ponytail P3 checkout split (YAGNI-deferred)                | PT-P3-001 closed — single caller; no `checkout.ts` split until second consumer · [ponytail-audit-tracker.md](./plans/active/ponytail-audit-tracker.md)              |
| Newsletter + user preferences schema (AUD-P2-023)            | `newsletter_subscribers` + `user_preferences` RLS in `20250701010000_commerce_content.sql`                                                                       |
| `check-secrets.sh` CI workflow allowlist                   | `readiness-ci.yml` may reference `SUPABASE_SERVICE_ROLE_KEY` by name — `0c82962`                                                                                |
| July docs archive pass                                     | Batch plans → `docs/archive/`; STATUS/README/AUDIT sync; `meta/polish-plan.md` stub removed — `01b603e`                                                         |

---

## Ops — blocked on Netlify / Supabase / Saleor dashboard

These appear as unchecked boxes in plans but **cannot be completed in-repo**. **Full checklist:** [infrastructure/deployment.md](./infrastructure/deployment.md).

| Task                                             | Doc                                                                  | Action                                                                  |
| ------------------------------------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Set Supabase + `PUBLIC_SITE_URL` on Netlify      | [deployment.md](./infrastructure/deployment.md) · [account-flow-fix.md](./plans/active/account-flow-fix.md) | Netlify env UI                                                          |
| Supabase redirect URLs (Netlify + custom domain) | [deployment.md](./infrastructure/deployment.md) § OAuth              | Supabase Auth → URL config                                              |
| Bootstrap first admin                            | [deployment.md](./infrastructure/deployment.md) § Supabase             | `npx tsx --env-file=.env scripts/promote-admin.ts user@email.com admin` |
| Set `PUBLIC_SALEOR_API_URL` + `SALEOR_CHANNEL`   | [deployment.md](./infrastructure/deployment.md) · [market-readiness.md](./plans/active/market-readiness.md) | Netlify env                                                             |
| Saleor webhook + `SALEOR_WEBHOOK_SECRET`         | [deployment.md](./infrastructure/deployment.md) § Saleor             | Saleor Dashboard → webhook → `/api/webhooks/saleor`                     |
| Stripe Payment App on Saleor channel             | [deployment.md](./infrastructure/deployment.md) § ops-blocked      | Saleor Dashboard — not storefront env                                   |
| Verify `/shop` ≠ 120 mock products               | [deployment.md](./infrastructure/deployment.md) § post-deploy        | After Saleor env + redeploy                                             |
| Populate `.env` and run readiness                | [deployment.md](./infrastructure/deployment.md) · [readiness-report.md](./testing/readiness-report.md) | Local or CI secrets                                                     |
| Apply squashed Supabase migrations on production             | [deployment.md](./infrastructure/deployment.md) · [migration-squash-notes.md](./infrastructure/migration-squash-notes.md) | `supabase db push` (3 files)                                            |
| YouTube cron + `YOUTUBE_SYNC_SECRET`             | [deployment.md](./infrastructure/deployment.md) § YouTube          | External scheduler → `POST /api/cron/youtube-sync`                      |
| CloudFront invalidation env                      | [deployment.md](./infrastructure/deployment.md) § CDN                | `AWS_CLOUDFRONT_DISTRIBUTION_ID` + S3 creds on Netlify                  |
| Enable Discord/Microsoft OAuth                   | [deployment.md](./infrastructure/deployment.md) § OAuth              | Supabase + provider consoles                                            |
| Ghost site + tags                                | [deployment.md](./infrastructure/deployment.md) · [ghost-audit.md](./audits/ghost-audit.md) | Ghost admin + Content API env                                           |
| Org mirror deploy key                            | [deployment.md](./infrastructure/deployment.md) § release flow     | `<org-sync-secret>` — `./scripts/setup-org-sync-auth.sh` (maintainer runbook) |

**Do not** set `DEV_ADMIN` or `LOCAL_DEV_AUTH` on Netlify.

---

## Open — code / CI work

**Audit counts (see [AUDIT-REMEDIATION.md](./plans/AUDIT-REMEDIATION.md)):** 2 open · 7 blocked (ops) · 48 done — P1 checkout (`AUD-P1-001`) is **partial** (code done; ops gate only), not open.

**Next-steps tracker (consolidated queue):** 10 unblocked · 19 ops-blocked — see [next-steps-tracker.md](./plans/active/next-steps-tracker.md).

| Priority | Task                                                            | Tracker                                                                        |
| -------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| P0       | Merge `dev` → `main` when Netlify env configured                | [deployment.md](./infrastructure/deployment.md)                                  |
| P1       | Saleor checkout: Payment App enablement + live pay verify       | [archive/batch-2026-07-01.md](./archive/batch-2026-07-01.md) BATCH-001 · [saleor-payments.md](./commerce/saleor-payments.md) |
| P2       | Ghost live CMS (fallback policy + detail SEO shipped)           | IP-015 · [ghost-audit.md](./audits/ghost-audit.md)                             |
| P2       | Remaining homepage mock slices (non-watch)                        | market-readiness Phase 3                                                       |
| P2       | OAuth Discord/Azure verification                                | [inspiration-polish-tracker.md](./plans/active/inspiration-polish-tracker.md) (ops-blocked) |
| P2       | daisyUI skill tree removal (post sign-off)                      | AUD-P2-021                                                                     |

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
