> **Status: Archived** — Queue consolidated into [BLOCKERS.md](../BLOCKERS.md) + [STATUS.md](../STATUS.md).

# Next steps tracker

**Created:** 2026-06-30  
**Last updated:** 2026-06-30  
**Branch:** `dev`  
**Policy:** [SECURITY-PUBLIC.md](../../SECURITY-PUBLIC.md) — no infra hostnames or secrets.

Canonical implementer queue reconciled from [STATUS.md](../../STATUS.md), [AUDIT-REMEDIATION.md](../AUDIT-REMEDIATION.md), [inspiration-polish-tracker.md](./inspiration-polish-tracker.md), [ponytail-audit-tracker.md](./ponytail-audit-tracker.md), [market-readiness.md](./market-readiness.md), and [archive/batch-2026-07-03-followups.md](../../archive/batch-2026-07-03-followups.md).

**Deployment runbook:** [infrastructure/deployment.md](../../infrastructure/deployment.md) — Netlify env checklist, Supabase `db push`, webhooks, OAuth, smoke tests.

---

## Summary

| Bucket | Count | Meaning |
| ------ | ----: | ------- |
| **Unblocked** | 1 | Can land in-repo on `dev` without Netlify/Saleor/Stripe dashboard access |
| **Ops-blocked** | 19 | Requires env vars, migrations on production Supabase, or external console work |

_Audit ID rows (AUD-P*) also appear in [AUDIT-REMEDIATION.md](../AUDIT-REMEDIATION.md). Do not close AUD rows here without updating that file._

---

## Unblocked — code / docs (in-repo)

| ID | Item | Source doc | Blocked? | Blocker | Owner batch | Status |
| -- | ---- | ---------- | -------- | ------- | ----------- | ------ |
| AUD-P2-006 | Live Saleor integration smoke tests (env-gated CI job beyond readiness probes) | AUDIT-REMEDIATION, STATUS | No | — | saleor / CI | **done** |
| AUD-P2-012 | Site-wide analytics hook (SEO/OG baseline shipped; consent-gated page hook wired) | AUDIT-REMEDIATION, STATUS | No | — | code | **done** |
| AUD-P2-020 | Machine-local agent skill symlink onboarding in `agents/AGENTS.md` | AUDIT-REMEDIATION, agents-skills-audit | No | — | docs | **done** |
| AUD-P2-021 | Remove daisyUI skill tree after sign-off (deprecation banner remains) | AUDIT-REMEDIATION | No | — | docs | **done** |
| AUD-P2-023 | Newsletter / user preferences tables (schema + RLS per roadmap) | AUDIT-REMEDIATION, integrations/supabase.md | No | — | supabase | **done** |
| MR-PH3-001 | Remaining homepage mock slices (videos, campaigns, hero beyond CMS; UGC/watch wired) | market-readiness Phase 3, STATUS | No | — | code | **done** |
| IP-004-code | Saleor stock webhook → `restock_alerts` notify handler (signup API live; webhook stub only) | inspiration-polish IP-004 | No | — | saleor | **done** |
| IP-023 | Multi-channel international pricing — wire `channels.ts` to Saleor admin channel map | inspiration-polish | No | — | saleor | **done** |
| IP-024 | Shipping zones + threshold promos (Saleor shipping + promotion rules) | inspiration-polish | No | — | saleor | **done** |
| IP-029 | `@motionone/svelte` scroll system (IO scroll trigger on `AnimatedReveal`; Motion One dep deferred) | inspiration-polish | No | — | code | **partial** |
| IP-030 | Deal / campaign scheduler (Pit Lane CMS; `/deals` mock) | inspiration-polish | No | — | code | **done** |
| PT-P3-001 | Split `saleor/checkout.ts` (624 LOC) — defer until second caller (YAGNI) | ponytail-audit | No | — | ponytail | **deferred** |
| PT-P3-003 | `forms/submit.ts` — remove dead generic insert stub or wire one table | ponytail-audit | No | — | ponytail | **done** |
| SEO-001 | `src/routes/sitemap.xml/+server.ts` — nav-linked static routes + dynamic content slugs | [sitemap-route-audit.md](../../audits/sitemap-route-audit.md) | No | — | code | **done** |
| SEO-002 | `robots.txt` route — `Sitemap:` from `PUBLIC_SITE_URL` | sitemap-route-audit | No | — | code | **done** |
| SEO-003 | Extend smoke tests beyond `/`, `/shop`, `/parts`, one PDP | sitemap-route-audit | No | — | code | **done** |

---

## Ops-blocked — env / production consoles

| ID | Item | Source doc | Blocked? | Blocker | Owner batch | Status |
| -- | ---- | ---------- | -------- | ------- | ----------- | ------ |
| AUD-P0-001 | Netlify Supabase env (`PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`) | AUDIT-REMEDIATION, account-flow-fix | Yes | Netlify env UI | auth / ops | **blocked** |
| AUD-P0-002 | `PUBLIC_SITE_URL` matches browsed deploy origin | AUDIT-REMEDIATION, account-flow-fix | Yes | Netlify env | auth / ops | **blocked** |
| AUD-P0-003 | Supabase redirect URL allowlist (preview + custom domain `/auth/callback`) | AUDIT-REMEDIATION, account-flow-fix | Yes | Supabase Auth URL config | auth / ops | **blocked** |
| AUD-P0-004 | `PUBLIC_SALEOR_API_URL` + `SALEOR_CHANNEL` on Netlify | AUDIT-REMEDIATION, market-readiness | Yes | Netlify env | saleor / ops | **blocked** |
| AUD-P0-005 | Bootstrap first admin via `promote-admin.ts` | AUDIT-REMEDIATION, account-flow-fix | Yes | Working auth + local CLI with prod secrets | auth / ops | **blocked** |
| AUD-P1-001-ops | Stripe Payment App on Saleor channel + live pay verify | AUDIT-REMEDIATION, saleor-payments, BATCH-001 | Yes | Saleor Dashboard → Apps → Stripe | saleor / ops | **blocked** |
| AUD-P1-008 | Ghost site provisioned + tags `guide` / `blog` | AUDIT-REMEDIATION, ghost-audit, IP-015 | Yes | Ghost admin + `GHOST_*` on Netlify | content / ops | **blocked** |
| AUD-P2-018 | Discord + Microsoft OAuth providers enabled in Supabase | AUDIT-REMEDIATION, auth/discord.md, auth/microsoft.md | Yes | Supabase + IdP consoles | auth / ops | **blocked** |
| NS-OPS-001 | Apply squashed Supabase migrations (3 files) on production | migration-squash-notes, batch-2026-07-03-followups | Yes | `supabase db push` or dashboard | supabase / ops | **blocked** |
| NS-OPS-002 | Verify Storage bucket `ugc` + policies (in `20250701020000_media_social.sql`) | media-uploads, batch-2026-07-03-followups | Yes | NS-OPS-001 | supabase / ops | **blocked** |
| NS-OPS-003 | Register Saleor webhook → `POST /api/webhooks/saleor`; set `SALEOR_WEBHOOK_SECRET` | inspiration IP-012, saleor-payments, [deployment.md](../../infrastructure/deployment.md) | Yes | Saleor Dashboard webhooks | saleor / ops | **blocked** |
| NS-OPS-004 | Schedule YouTube sync: `POST /api/cron/youtube-sync` + header `x-youtube-sync-secret` | inspiration IP-007, [deployment.md](../../infrastructure/deployment.md) | Yes | External cron (GitHub Actions schedule, pg_cron, etc.) + `YOUTUBE_*` env | content / ops | **blocked** |
| NS-OPS-005 | Populate GitHub Actions secrets for `readiness-ci.yml` | readiness-report, external-dependencies | Yes | Repo Settings → Secrets | CI / ops | **blocked** |
| NS-OPS-006 | Verify org mirror sync after `main` merge (`sync-org-main.yml`) | [deployment.md](../../infrastructure/deployment.md), readiness-report | Yes | `<org-sync-secret>` deploy key | maintainer | **blocked** |
| NS-OPS-007 | CDN + CloudFront invalidation env (`S3_*`, `AWS_*`, `AWS_CLOUDFRONT_DISTRIBUTION_ID`, `PUBLIC_CDN_BASE_URL`) | inspiration IP-013, [deployment.md](../../infrastructure/deployment.md) | Yes | AWS console + Netlify env | media / ops | **blocked** |
| NS-OPS-008 | Optional `BUG_REPORT_WEBHOOK_URL` for staff alerts | inspiration IP-031, `.env.example` | Yes | Netlify env | ops | **blocked** |
| NS-OPS-009 | `SOCIAL_*_CLIENT_ID` for live account connections OAuth | inspiration IP-027, `.env.example` | Yes | IdP consoles + Netlify | auth / ops | **blocked** |
| NS-OPS-010 | Merge `dev` → `main` for production Netlify deploy | STATUS, [deployment.md](../../infrastructure/deployment.md) | Yes | NS-OPS-001–004 + AUD-P0-* complete | release | **blocked** |
| NS-OPS-011 | Post-env QA: `/shop` count ≠ 120; readiness probes pass | market-readiness, readiness-report | Yes | AUD-P0-004 | saleor / ops | **blocked** |

---

## Verification

```bash
npm run test:unit
npm run test:contracts
npm run test:readiness     # needs .env
bash scripts/check-secrets.sh
```

---

## Changelog

| Date | Change |
| ---- | ------ |
| 2026-06-30 | Initial tracker; deployment.md runbook gaps patched |
| 2026-06-30 | PT-P3-003 done — dead `submitFormStub` generic branch removed |
| 2026-06-30 | Linked canonical runbook at `infrastructure/deployment.md` |
| 2026-07-03 | Canonical runbook → `infrastructure/deployment.md`; ops rows aligned (YouTube external cron, CloudFront invalidation) |
| 2026-07-03 | Public-safe scrub per `SECURITY-PUBLIC.md` |
| 2026-06-30 | SEO-001–003 optional follow-ups from [sitemap-route-audit.md](../../audits/sitemap-route-audit.md) |
| 2026-06-30 | Swarm slot D — PT-P3-001 YAGNI-deferred; AUD-P2-023 done (`20250701010000_commerce_content.sql`); counts synced |
| 2026-06-30 | Slot A follow-up — MR-SEC-001 build submit guard; SEO-003 smoke routes; AUD-P2-012 analytics hook |

---

## Maintainer-only (not in public docs)

Record in private runbook / password manager only — never paste into `docs/`:

| Item | Why private |
| ---- | ----------- |
| Organization deploy repo slug (`<organization>/<deploy-repo>` actual value) | Org topology |
| GitHub Actions secret name for org mirror (workflow uses a fixed name; docs use `<org-sync-secret>`) | Deploy-key secret naming |
| Production Supabase project ref, Saleor host, Ghost URL, CDN/S3 bucket names | Live infra map |
| Stripe/Saleor Payment App secrets, webhook HMAC values, `YOUTUBE_SYNC_SECRET` | Credentials |

`.env.example` may list example hostnames for local setup — scrub real values before open-sourcing template updates.
