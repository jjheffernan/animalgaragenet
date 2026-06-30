# Project status — open work tracker

**Public documentation policy:** [SECURITY-PUBLIC.md](./SECURITY-PUBLIC.md)

**Last updated:** 2026-06-30  
**Canonical next-step docs:** [plans/AUDIT-REMEDIATION.md](./plans/AUDIT-REMEDIATION.md) · [plans/DOC-IMPLEMENTATION-MANIFEST.md](./plans/DOC-IMPLEMENTATION-MANIFEST.md) · [meta/polish-plan.md](./meta/polish-plan.md) · [plans/active/market-readiness.md](./plans/active/market-readiness.md) · [plans/active/account-flow-fix.md](./plans/active/account-flow-fix.md)

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
| GitHub wiki                                                | Published — [wiki home](https://github.com/jjheffernan/animalgaragenet/wiki); backup in `docs/wiki-export/` (sanitized for public — no infra/AWS/secret names) |
| Org mirror sync                                            | `scripts/sync-org-mirror.sh` on `main`                                                                                                                         |

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
| Enable Discord/Microsoft OAuth                   | [discord.md](./auth/discord.md), [microsoft.md](./auth/microsoft.md) | Supabase + provider consoles                                            |
| Ghost site + tags                                | [ghost-audit.md](./audits/ghost-audit.md)                            | Ghost admin                                                             |
| `<org-sync-secret>` rotation docs                | readiness-report                                                     | Personal repo Actions secret                                            |

**Do not** set `DEV_ADMIN` or `LOCAL_DEV_AUTH` on Netlify.

---

## Open — code / CI work

| Priority | Task                                                            | Tracker                                                                        |
| -------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| P0       | Merge `dev` → `main` when Netlify env configured                | [deployment.md](./style-guide/backend-ops/deployment.md)                       |
| P0       | Fix CI Prettier (~221 files) — blocks green checks              | [polish-plan.md](./meta/polish-plan.md)                                        |
| P1       | Public `/builds` from approved `build_submissions`              | [build-submissions.md](./content/build-submissions.md)                         |
| P1       | Saleor checkout: line qty/remove, shipping, `CHECKOUT_COMPLETE` | [saleor.md](./commerce/saleor.md), [saleor-audit.md](./audits/saleor-audit.md) |
| P1       | YouTube live sync (replace stub)                                | [readiness-report.md](./testing/readiness-report.md)                           |
| P1       | Media uploads phase 1 (Supabase Storage + `/api/media/*`)       | [media-uploads.md](./plans/active/media-uploads.md)                            |
| P2       | Ghost + remaining homepage mock slices (videos, builds)         | market-readiness Phase 3                                                       |
| P2       | `profiles` table contract test                                  | readiness-report (testimonials + build_submissions done)                       |
| P2       | `readiness-ci` optional Actions job                             | readiness-report                                                               |
| P2       | OAuth Discord/Azure verification                                | polish-plan P2                                                                 |
| P2       | SEO/OG, analytics, performance audit                            | Phase 5 (see [README.md](./README.md))                                         |
| P2       | Newsletter / user preferences tables                            | [supabase.md](./integrations/supabase.md) roadmap                              |

---

## Doc hygiene — resolved contradictions

| Was stale                                                                | Fixed                                          |
| ------------------------------------------------------------------------ | ---------------------------------------------- |
| [inspiration.md](./meta/inspiration.md) Phase 3 P0 bugs “in progress”    | Marked Done — see archive/phase3-plan          |
| [saleor.md](./commerce/saleor.md) “redeem not implemented”               | Updated — redeem wired                         |
| [site-audit.md](./audits/site-audit.md) “no tests”                       | Updated — 180+ unit/contract/integration tests |
| [wiki-export/README.md](./wiki-export/README.md) “wiki not enabled”      | Updated — published                            |
| [readiness-report.md](./testing/readiness-report.md) contract-test todos | Marked partial/done where applicable           |

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
