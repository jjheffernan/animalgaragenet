# Project status — open work tracker

**Last updated:** 2026-06-30  
**Canonical next-step docs:** [polish-plan.md](./polish-plan.md) · [market-readiness.md](./plans/market-readiness.md) · [account-flow-fix.md](./plans/account-flow-fix.md)

This file reconciles “next steps” across all `docs/` so nothing is orphaned. Items are **Done**, **Ops** (external dashboard/env), or **Open** (code work).

---

## Done in code (June 2026)

| Area | Evidence |
|------|----------|
| Phase 3 nav/UX bugs | [phase3-plan.md](./phase3-plan.md) workstreams A–D marked Done |
| Auth, account menu, local dev | `AccountMenu.svelte`, `local-dev.ts`, `/auth/*` |
| Production admin + lockdown | `promote-admin.ts`, `SITE_LOCKED`, `/locked` |
| Saleor redeem / promo | `/account/redeem`, `checkout/promo.ts`, `checkoutAddPromoCode` |
| Security hardening | [security-hardening.md](./testing/security-hardening.md) — limits, rate limit, httpOnly promo cookie |
| API contract tests | `tests/contracts/` — 20 tests; `npm run test:contracts` |
| CRUD integration tests | `tests/integration/crud-business-logic.test.ts` — 9 tests |
| Readiness probes | `scripts/test-readiness.ts`, `npm run test:readiness` |
| `*.netlify.app` dev bypass block | `isProductionHostname()` in `local-dev.ts` |
| Production catalog mock guard | `guardMockCatalogFallback()` in `catalog/fallback.ts` |
| GitHub wiki | Published — [wiki home](https://github.com/jjheffernan/animalgaragenet/wiki); backup in `docs/wiki-export/` (sanitized for public — no infra/AWS/secret names) |
| Org mirror sync | `scripts/sync-org-mirror.sh` on `main` |

---

## Ops — blocked on Netlify / Supabase / Saleor dashboard

These appear as unchecked boxes in plans but **cannot be completed in-repo**:

| Task | Doc | Action |
|------|-----|--------|
| Set Supabase + `PUBLIC_SITE_URL` on Netlify | [account-flow-fix.md](./plans/account-flow-fix.md) | Netlify env UI |
| Supabase redirect URLs (Netlify + custom domain) | account-flow-fix | Supabase Auth → URL config |
| Bootstrap first admin | account-flow-fix | `npx tsx --env-file=.env scripts/promote-admin.ts user@email.com admin` |
| Set `PUBLIC_SALEOR_API_URL` + `SALEOR_CHANNEL` | [market-readiness.md](./plans/market-readiness.md) Phase 1 | Netlify env |
| Verify `/shop` ≠ 120 mock products | market-readiness | After Saleor env + redeploy |
| Populate `.env` and run readiness | [readiness-report.md](./testing/readiness-report.md) | Local or CI secrets |
| Enable Discord/Microsoft OAuth | [auth-discord.md](./auth-discord.md), [auth-microsoft.md](./auth-microsoft.md) | Supabase + provider consoles |
| Ghost site + tags | [ghost-audit.md](./ghost-audit.md) | Ghost admin |
| `ORG_REPO_DEPLOY_KEY` rotation docs | readiness-report | Personal repo Actions secret |

**Do not** set `DEV_ADMIN` or `LOCAL_DEV_AUTH` on Netlify.

---

## Open — code / CI work

| Priority | Task | Tracker |
|----------|------|---------|
| P0 | Merge `dev` → `main` when Netlify env configured | [deployment.md](./style-guide/backend-ops/deployment.md) |
| P0 | Fix CI Prettier (~221 files) — blocks green checks | [polish-plan.md](./polish-plan.md) |
| P1 | Saleor checkout: line qty/remove, shipping, `CHECKOUT_COMPLETE` | [saleor.md](./saleor.md), [saleor-audit.md](./saleor-audit.md) |
| P1 | YouTube live sync (replace stub) | [readiness-report.md](./testing/readiness-report.md) |
| P1 | Media uploads phase 1 (S3 presign + CDN) | [plans/media-uploads.md](./plans/media-uploads.md) |
| P1 | Ghost + Supabase UGC on homepage (Phase 3) | market-readiness Phase 3 |
| P2 | `profiles` table contract test | readiness-report (testimonials + build_submissions done) |
| P2 | `readiness-ci` optional Actions job | readiness-report |
| P2 | OAuth Discord/Azure verification | polish-plan P2 |
| P2 | SEO/OG, analytics, performance audit | [README.md](./README.md) Phase 5 |
| P2 | Newsletter / user preferences tables | [supabase.md](./supabase.md) roadmap |

---

## Doc hygiene — resolved contradictions

| Was stale | Fixed |
|-----------|-------|
| [inspiration.md](./inspiration.md) Phase 3 P0 bugs “in progress” | Marked Done — see phase3-plan |
| [saleor.md](./saleor.md) “redeem not implemented” | Updated — redeem wired |
| [audit.md](./audit.md) “no tests” | Updated — 180+ unit/contract/integration tests |
| [wiki-export/README.md](./wiki-export/README.md) “wiki not enabled” | Updated — published |
| [readiness-report.md](./testing/readiness-report.md) contract-test todos | Marked partial/done where applicable |

---

## Intentionally future (not launch blockers)

- Advanced animations, scroll-driven motion — [animations.md](./style-guide/frontend/animations.md)
- Full media CDN (Garage/S3) — [media-cdn-plan.md](./media-cdn-plan.md)
- Dashboard submodule — [dashboard-adoption-plan.md](./dashboard-adoption-plan.md) (stay in-repo `/admin`)
- Marketing / inspiration backlog — [inspiration.md](./inspiration.md) “Not Yet Built” sections

---

## Quick verification commands

```bash
npm run test:unit          # 180 tests
npm run test:contracts     # 20 payload contracts
npm run test:readiness     # 11 probes (needs .env)
bash scripts/check-secrets.sh
```
