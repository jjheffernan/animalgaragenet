# Next steps tracker

**Created:** 2026-06-30  
**Last updated:** 2026-06-30  
**Branch:** `dev`  
**Policy:** [SECURITY-PUBLIC.md](../../SECURITY-PUBLIC.md) — no infra hostnames or secrets.

Canonical implementer queue reconciled from [STATUS.md](../../STATUS.md), [AUDIT-REMEDIATION.md](../AUDIT-REMEDIATION.md), [inspiration-polish-tracker.md](./inspiration-polish-tracker.md), [ponytail-audit-tracker.md](./ponytail-audit-tracker.md), [market-readiness.md](./market-readiness.md), and [archive/batch-2026-07-03-followups.md](../../archive/batch-2026-07-03-followups.md).

**Deployment runbook:** [deployment.md](../../style-guide/backend-ops/deployment.md) (patched 2026-06-30).

---

## Summary

| Bucket | Count | Meaning |
| ------ | ----: | ------- |
| **Unblocked** | 11 | Can land in-repo on `dev` without Netlify/Saleor/Stripe dashboard access |
| **Ops-blocked** | 17 | Requires env vars, migrations on production Supabase, or external console work |

_Audit ID rows (AUD-P*) also appear in [AUDIT-REMEDIATION.md](../AUDIT-REMEDIATION.md). Do not close AUD rows here without updating that file._

---

## Unblocked — code / docs (in-repo)

| ID | Item | Source doc | Blocked? | Blocker | Owner batch | Status |
| -- | ---- | ---------- | -------- | ------- | ----------- | ------ |
| AUD-P2-006 | Live Saleor integration smoke tests (env-gated CI job beyond readiness probes) | AUDIT-REMEDIATION, STATUS | No | — | saleor / CI | **open** |
| AUD-P2-012 | Site-wide analytics hook (SEO/OG baseline shipped; Phase 5 telemetry deferred) | AUDIT-REMEDIATION, STATUS | No | — | code | **partial** |
| AUD-P2-020 | Machine-local agent skill symlink onboarding in `agents/AGENTS.md` | AUDIT-REMEDIATION, agents-skills-audit | No | — | docs | **open** |
| AUD-P2-021 | Remove daisyUI skill tree after sign-off (deprecation banner remains) | AUDIT-REMEDIATION | No | — | docs | **open** |
| AUD-P2-023 | Newsletter / user preferences tables (schema + RLS per roadmap) | AUDIT-REMEDIATION, integrations/supabase.md | No | — | supabase | **open** |
| MR-PH3-001 | Remaining homepage mock slices (videos, campaigns, hero beyond CMS; UGC/watch wired) | market-readiness Phase 3, STATUS | No | — | code | **open** |
| IP-004-code | Saleor stock webhook → `restock_alerts` notify handler (signup API live; webhook stub only) | inspiration-polish IP-004 | No | — | saleor | **open** |
| IP-023 | Multi-channel international pricing — wire `channels.ts` to Saleor admin channel map | inspiration-polish | No | — | saleor | **scaffolded** |
| IP-024 | Shipping zones + threshold promos (Saleor shipping + promotion rules) | inspiration-polish | No | — | saleor | **not started** |
| IP-029 | `@motionone/svelte` scroll system (reduced-motion baseline done) | inspiration-polish | No | — | code | **partial** |
| IP-030 | Deal / campaign scheduler (Pit Lane CMS; `/deals` mock) | inspiration-polish | No | — | code | **not started** |
| PT-P3-001 | Split `saleor/checkout.ts` (624 LOC) — defer until second caller (YAGNI) | ponytail-audit | No | — | ponytail | **open** (defer) |
| PT-P3-003 | `forms/submit.ts` — remove dead generic insert stub or wire one table | ponytail-audit | No | — | ponytail | **done** |

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
| NS-OPS-003 | Register Saleor webhook → `POST /api/webhooks/saleor`; set `SALEOR_WEBHOOK_SECRET` | inspiration IP-012, saleor-payments, deployment.md | Yes | Saleor Dashboard webhooks | saleor / ops | **blocked** |
| NS-OPS-004 | Schedule YouTube sync: `POST /api/cron/youtube-sync` + header `x-youtube-sync-secret` | inspiration IP-007, deployment.md | Yes | Netlify scheduled function or external cron + `YOUTUBE_*` env | content / ops | **blocked** |
| NS-OPS-005 | Populate GitHub Actions secrets for `readiness-ci.yml` | readiness-report, external-dependencies | Yes | Repo Settings → Secrets | CI / ops | **blocked** |
| NS-OPS-006 | Verify org mirror sync after `main` merge (`sync-org-main.yml`) | deployment.md, readiness-report | Yes | `<org-sync-secret>` / deploy key | maintainer | **blocked** |
| NS-OPS-007 | Optional CDN presigned upload env (`S3_*`, `AWS_*`, `PUBLIC_CDN_BASE_URL`) | inspiration IP-013, deployment.md | Yes | AWS console | media / ops | **blocked** |
| NS-OPS-008 | Optional `BUG_REPORT_WEBHOOK_URL` for staff alerts | inspiration IP-031, `.env.example` | Yes | Netlify env | ops | **blocked** |
| NS-OPS-009 | `SOCIAL_*_CLIENT_ID` for live account connections OAuth | inspiration IP-027, `.env.example` | Yes | IdP consoles + Netlify | auth / ops | **blocked** |
| NS-OPS-010 | Merge `dev` → `main` for production Netlify deploy | STATUS, deployment.md | Yes | NS-OPS-001–004 + AUD-P0-* complete | release | **blocked** |
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
