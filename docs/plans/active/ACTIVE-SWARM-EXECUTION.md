# Active swarm execution tracker

**Created:** 2026-06-30  
**Last updated:** 2026-06-30 (slot D closeout)  
**Branch:** `dev`  
**Policy:** [SECURITY-PUBLIC.md](../../SECURITY-PUBLIC.md) — inventory + status only; no infra hostnames or secrets.

Batch slots: **A** = API/webhooks/SEO/CI · **B** = admin UI · **C** = inspiration-polish code · **D** = ponytail/schema/docs-only

**Sources:** All files in `docs/plans/active/` reconciled against [next-steps-tracker.md](./next-steps-tracker.md) and [AUDIT-REMEDIATION.md](../AUDIT-REMEDIATION.md).

---

## Summary

| Bucket | Count | Notes |
| ------ | ----: | ----- |
| Code-eligible (unblocked) | 20 | Slots A–D — excludes ops-blocked |
| Ops-blocked (no code) | 19 | Netlify / Saleor / Supabase consoles |
| **Slot A** open/partial | 4 | SEO-001–003 optional + AUD-P2-012 partial |
| **Slot B** open | 9 | Admin dashboard inspiration rows |
| **Slot C** open/partial | 7 | Homepage slices, IP-023–030, media Phase 2/3 |
| **Slot D** open | 1 | AUD-P2-021 (daisyUI tree removal — sign-off) |

---

## Execution table

| Tracker | ID | Item | Blocked? | Batch slot | Status |
| ------- | -- | ---- | -------- | ---------- | ------ |
| next-steps | AUD-P2-006 | Live Saleor integration smoke tests (env-gated CI beyond readiness probes) | No | A | **done** |
| next-steps | AUD-P2-012 | Site-wide analytics hook (SEO/OG baseline shipped; Phase 5 telemetry deferred) | No | A | partial |
| next-steps | IP-004-code | Saleor stock webhook → `restock_alerts` notify handler | No | A | **done** |
| next-steps | SEO-001 | `sitemap.xml` — nav-linked static routes + dynamic content slugs | No | A | open (optional) |
| next-steps | SEO-002 | Add `Sitemap:` directive to `static/robots.txt` | No | A | open (optional) |
| next-steps | SEO-003 | Extend smoke tests beyond `/`, `/shop`, `/parts`, one PDP | No | A | open (optional) |
| market-readiness | MR-SEC-001 | Tighten `build_submissions` insert policy (rate limit / captcha / honeypot) | No | A | open |
| admin-dashboard | ADM-S1 | Live recent activity feed on `/admin/dashboard` | No | B | open |
| admin-dashboard | ADM-S2-builds | Builds moderation queue — daisyUI consistency | No | B | open |
| admin-dashboard | ADM-S2-testimonials | Testimonials moderation queue — daisyUI consistency | No | B | open |
| admin-dashboard | ADM-S2-youtube | YouTube admin — migrate zinc table to daisyUI `table` | No | B | open |
| admin-dashboard | ADM-S2-media | Media browser — daisyUI `card`/`badge`/`btn` pass | No | B | open |
| admin-dashboard | ADM-S3 | Sidebar pending-work badges (builds + testimonials counts) | No | B | open |
| admin-dashboard | ADM-S4-users | Users list — client search filter above table | No | B | open |
| admin-dashboard | ADM-S4-bugs | Bug reports — table view toggle or status filter chips | No | B | open |
| admin-dashboard | ADM-S5 | Runtime panel — Commerce/Content/Platform grouping + last-checked timestamp | No | B | open |
| next-steps | MR-PH3-001 | Remaining homepage mock slices (videos, campaigns, hero beyond CMS) | No | C | open |
| inspiration-polish | IP-023 | Multi-channel international pricing — wire `channels.ts` to Saleor admin channel map | No | C | scaffolded |
| inspiration-polish | IP-024 | Shipping zones + threshold promos (Saleor shipping + promotion rules) | No | C | not started |
| inspiration-polish | IP-029 | `@motionone/svelte` scroll system (reduced-motion baseline done) | No | C | partial |
| inspiration-polish | IP-030 | Deal / campaign scheduler (Pit Lane CMS; `/deals` mock) | No | C | not started |
| media-uploads | MEDIA-P2 | Review photo upload UI — complete Phase 2 wiring | No | C | partial |
| media-uploads | MEDIA-P3 | `/admin/media` real storage list/delete + orphan cleanup job | No | C | open |
| next-steps | AUD-P2-020 | Machine-local agent skill symlink onboarding in `agents/AGENTS.md` | No | D | **done** |
| next-steps | AUD-P2-021 | Remove daisyUI skill tree after sign-off (deprecation banner remains) | No | D | open |
| next-steps | AUD-P2-023 | Newsletter / user preferences tables (schema + RLS per roadmap) | No | D | **done** |
| ponytail-audit | PT-P3-001 | Split `saleor/checkout.ts` — YAGNI until second caller | No | D | **deferred** |
| next-steps | AUD-P0-001 | Netlify Supabase env (`PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`) | **Yes — no code** | A | blocked |
| next-steps | AUD-P0-002 | `PUBLIC_SITE_URL` matches browsed deploy origin | **Yes — no code** | A | blocked |
| next-steps | AUD-P0-003 | Supabase redirect URL allowlist (preview + custom domain `/auth/callback`) | **Yes — no code** | A | blocked |
| next-steps | AUD-P0-004 | `PUBLIC_SALEOR_API_URL` + `SALEOR_CHANNEL` on Netlify | **Yes — no code** | A | blocked |
| next-steps | AUD-P0-005 | Bootstrap first admin via `promote-admin.ts` | **Yes — no code** | A | blocked |
| next-steps | AUD-P1-001-ops | Stripe Payment App on Saleor channel + live pay verify | **Yes — no code** | A | blocked |
| next-steps | AUD-P1-008 | Ghost site provisioned + tags `guide` / `blog` | **Yes — no code** | A | blocked |
| next-steps | AUD-P2-018 | Discord + Microsoft OAuth providers enabled in Supabase | **Yes — no code** | A | blocked |
| next-steps | NS-OPS-001 | Apply squashed Supabase migrations (3 files) on production | **Yes — no code** | D | blocked |
| next-steps | NS-OPS-002 | Verify Storage bucket `ugc` + policies | **Yes — no code** | D | blocked |
| next-steps | NS-OPS-003 | Register Saleor webhook → `POST /api/webhooks/saleor`; set `SALEOR_WEBHOOK_SECRET` | **Yes — no code** | A | blocked |
| next-steps | NS-OPS-004 | Schedule YouTube sync cron + `YOUTUBE_*` env | **Yes — no code** | A | blocked |
| next-steps | NS-OPS-005 | Populate GitHub Actions secrets for `readiness-ci.yml` | **Yes — no code** | A | blocked |
| next-steps | NS-OPS-006 | Verify org mirror sync after `main` merge | **Yes — no code** | A | blocked |
| next-steps | NS-OPS-007 | CDN + CloudFront invalidation env (`S3_*`, `AWS_*`, `PUBLIC_CDN_BASE_URL`) | **Yes — no code** | A | blocked |
| next-steps | NS-OPS-008 | Optional `BUG_REPORT_WEBHOOK_URL` for staff alerts | **Yes — no code** | A | blocked |
| next-steps | NS-OPS-009 | `SOCIAL_*_CLIENT_ID` for live account connections OAuth | **Yes — no code** | A | blocked |
| next-steps | NS-OPS-010 | Merge `dev` → `main` for production Netlify deploy | **Yes — no code** | — | blocked |
| next-steps | NS-OPS-011 | Post-env QA: `/shop` count ≠ 120; readiness probes pass | **Yes — no code** | A | blocked |
| inspiration-polish | IP-001 | Supabase auth on Netlify preview | **Yes — no code** | A | blocked |
| inspiration-polish | IP-002 | Live Saleor product catalog on Netlify | **Yes — no code** | A | blocked |
| inspiration-polish | IP-003-ops | Checkout + payment live verify (code wired; Payment App ops gate) | **Yes — no code** | A | partial (ops) |
| inspiration-polish | IP-015 | Ghost blog + guides (live CMS) | **Yes — no code** | A | blocked |
| admin-dashboard | ADM-BLOCK-COMM | `/admin/commerce/*` + wholesale nav stubs — do not build UI until routes exist | **Yes — no code** | B | blocked (nav) |
| admin-dashboard | ADM-DEF-CHART | Dashboard chart widgets (orders, traffic, category) | **Yes — no code** | B | deferred (Saleor analytics) |

---

## Slot D closeout (2026-06-30)

| ID | Action |
| -- | ------ |
| PT-P3-001 | **YAGNI-deferred** — ponytail: single caller; no `checkout.ts` split |
| AUD-P2-023 | **done** — schema + RLS already in `20250701010000_commerce_content.sql` |
| AUD-P2-020 | **done** (slot A) — `agents/AGENTS.md` symlink onboarding |
| AUD-P2-021 | **open** — awaits daisyUI skill tree sign-off |

---

## Changelog

| Date | Change |
| ---- | ------ |
| 2026-06-30 | Initial swarm inventory from active plan files |
| 2026-06-30 | Slot D closeout — PT-P3-001 deferred, AUD-P2-023 done; counts synced to STATUS |
