> **Status: Archived** — Swarm complete 2026-06-30. See [STATUS.md](../STATUS.md) · [BLOCKERS.md](../BLOCKERS.md) · [CODER-FLOW.md](../CODER-FLOW.md).

# Active swarm execution tracker

**Created:** 2026-06-30  
**Last synced:** 2026-06-30 (`dev`, swarm slots A–D continuation — build green)  
**Policy:** Inventory + status sync — no implementation in this doc.  
**Sources:** All files in `docs/plans/active/` reconciled 2026-06-30.

Batch slots: **A** = API/webhooks/SEO/CI · **B** = admin UI · **C** = inspiration-polish code · **D** = ponytail/schema/docs-only

**Recent `dev` landings reflected below:** `bbeecbe` (AUD-P2-020) · ponytail P1/P2/P3-002/P3-003 · `4e7d0a9` (admin shell/chrome) · `dd32c00` (admin theme unify — zinc/red, daisyUI removed) · `eba78ff` (LGTM observability)

---

## Slot counts

| Batch | Scope                         | Open/partial | Done (in table) | Ops-blocked |
| ----- | ----------------------------- | -----------: | --------------: | ----------: |
| **A** | API / webhooks / SEO / CI     |            0 |               7 |          20 |
| **B** | Admin UI                      |            0 |               9 |           2 |
| **C** | Inspiration-polish code       |            1 |               6 |           0 |
| **D** | Ponytail / schema / docs-only |            1 |              10 |           2 |
|       | **Grand total**               |        **2** |          **29** |      **24** |
|       |                               |              |     **59 rows** |             |

_NS-OPS-010 (merge `dev` → `main`) has no batch slot._

---

## Execution table

| Tracker            | ID                  | Item                                                                                                    | Blocked?          | Batch slot | Status                                           |
| ------------------ | ------------------- | ------------------------------------------------------------------------------------------------------- | ----------------- | ---------- | ------------------------------------------------ |
| next-steps         | AUD-P2-006          | Live Saleor integration smoke tests (env-gated CI beyond readiness probes)                              | No                | A          | **done**                                         |
| next-steps         | AUD-P2-012          | Site-wide analytics hook (SEO/OG baseline shipped; consent-gated `trackPageView` in root layout)        | No                | A          | **done**                                         |
| next-steps         | IP-004-code         | Saleor stock webhook → `restock_alerts` notify handler                                                  | No                | A          | **done**                                         |
| next-steps         | SEO-001             | `sitemap.xml` — nav-linked static routes + dynamic content slugs                                        | No                | A          | **done**                                         |
| next-steps         | SEO-002             | `robots.txt` route — `Sitemap:` from `PUBLIC_SITE_URL` + static fallback                                | No                | A          | **done**                                         |
| next-steps         | SEO-003             | Extend smoke tests beyond `/`, `/shop`, `/parts`, one PDP                                               | No                | A          | **done**                                         |
| market-readiness   | MR-SEC-001          | Tighten `build_submissions` insert policy (rate limit / captcha / honeypot)                             | No                | A          | **done**                                         |
| admin-dashboard    | ADM-S1              | Live recent activity feed on `/admin/dashboard` (builds, bugs, YouTube sync)                            | No                | B          | **done** (`dd32c00` activity table + deep-links) |
| admin-dashboard    | ADM-S2-builds       | Builds moderation queue — zinc/red consistency (`admin-ui.ts`)                                          | No                | B          | **done** (`dd32c00`)                             |
| admin-dashboard    | ADM-S2-testimonials | Testimonials moderation queue — zinc/red consistency                                                    | No                | B          | **done** (`dd32c00`)                             |
| admin-dashboard    | ADM-S2-youtube      | YouTube admin — zinc table + card form                                                                  | No                | B          | **done** (`dd32c00`)                             |
| admin-dashboard    | ADM-S2-media        | Media browser — zinc `card`/`badge`/`btn` pass                                                          | No                | B          | **done** (`dd32c00`)                             |
| admin-dashboard    | ADM-S3              | Sidebar pending-work badges (builds + testimonials + open bugs)                                         | No                | B          | **done** (`navCounts` + `badgeKey`)              |
| admin-dashboard    | ADM-S4-users        | Users list — client search filter above table                                                           | No                | B          | **done** (`dd32c00` search + zinc table)         |
| admin-dashboard    | ADM-S4-bugs         | Bug reports — status filter chips + inbox/table                                                         | No                | B          | **done** (inbox/table toggle + zinc chips)       |
| admin-dashboard    | ADM-S5              | Runtime panel — Commerce/Content/Platform grouping + last-checked timestamp                             | No                | B          | **done** (`dd32c00` grouped cards + `checkedAt`) |
| next-steps         | MR-PH3-001          | Remaining homepage mock slices (videos, campaigns, hero beyond CMS; UGC/watch wired)                    | No                | C          | **done**                                         |
| inspiration-polish | IP-023              | Multi-channel international pricing — `channels.ts` + `SALEOR_LOCALE_CHANNELS` / `listSaleorChannels()` | No                | C          | **done**                                         |
| inspiration-polish | IP-024              | Shipping threshold promos — `shipping-promo.ts` + cart/checkout loaders                                 | No                | C          | **done**                                         |
| inspiration-polish | IP-029              | Scroll-triggered `AnimatedReveal` (IO); full `@motionone/svelte` deferred                               | No                | C          | partial                                          |
| inspiration-polish | IP-030              | Deal / campaign scheduler — `pit_lane_deals` + `deals/repository.ts`                                    | No                | C          | **done**                                         |
| media-uploads      | MEDIA-P2            | Review photo upload UI — complete Phase 2 wiring (`ReviewPhotoUpload.svelte`)                           | No                | C          | **done**                                         |
| media-uploads      | MEDIA-P3            | `/admin/media` real storage list/delete + orphan cleanup job                                            | No                | C          | **done**                                         |
| next-steps         | AUD-P2-020          | Machine-local agent skill symlink onboarding in `agents/AGENTS.md`                                      | No                | D          | **done** (`bbeecbe`)                             |
| next-steps         | AUD-P2-021          | Remove daisyUI skill tree after sign-off                                                                | No                | D          | **done**                                         |
| next-steps         | AUD-P2-023          | Newsletter / user preferences tables (schema + RLS per roadmap)                                         | No                | D          | **done**                                         |
| ponytail-audit     | PT-P3-001           | Split `saleor/checkout.ts` (624 LOC) — defer until second caller (YAGNI)                                | No                | D          | deferred                                         |
| ponytail-audit     | PT-P1-001           | Shared `guardProductionMockFallback` — catalog + Ghost mock-fallback guard                              | No                | D          | **done**                                         |
| ponytail-audit     | PT-P1-002           | Remove dead validation aliases in `limits.ts`                                                           | No                | D          | **done**                                         |
| ponytail-audit     | PT-P2-001           | Shared `parseRateLimitedJsonPost` for public POST APIs                                                  | No                | D          | **done**                                         |
| ponytail-audit     | PT-P2-002           | Reuse `validateUploadRequest` in admin media upload-slot                                                | No                | D          | **done**                                         |
| ponytail-audit     | PT-P2-003           | `storage.ts` helpers + cart/locale dedupe in client stores                                              | No                | D          | **done**                                         |
| ponytail-audit     | PT-P3-002           | `withSaleorCatalog` helper — dedupe catalog try/catch                                                   | No                | D          | **done**                                         |
| ponytail-audit     | PT-P3-003           | Remove dead `submitFormStub` generic branch in `forms/submit.ts`                                        | No                | D          | **done**                                         |
| next-steps         | AUD-P0-001          | Netlify Supabase env (`PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`)                                 | **Yes — no code** | A          | blocked                                          |
| next-steps         | AUD-P0-002          | `PUBLIC_SITE_URL` matches browsed deploy origin                                                         | **Yes — no code** | A          | blocked                                          |
| next-steps         | AUD-P0-003          | Supabase redirect URL allowlist (preview + custom domain `/auth/callback`)                              | **Yes — no code** | A          | blocked                                          |
| next-steps         | AUD-P0-004          | `PUBLIC_SALEOR_API_URL` + `SALEOR_CHANNEL` on Netlify                                                   | **Yes — no code** | A          | blocked                                          |
| next-steps         | AUD-P0-005          | Bootstrap first admin via `promote-admin.ts`                                                            | **Yes — no code** | A          | blocked                                          |
| next-steps         | AUD-P1-001-ops      | Stripe Payment App on Saleor channel + live pay verify                                                  | **Yes — no code** | A          | blocked                                          |
| next-steps         | AUD-P1-008          | Ghost site provisioned + tags `guide` / `blog`                                                          | **Yes — no code** | A          | blocked                                          |
| next-steps         | AUD-P2-018          | Discord + Microsoft OAuth providers enabled in Supabase                                                 | **Yes — no code** | A          | blocked                                          |
| next-steps         | NS-OPS-001          | Apply squashed Supabase migrations (3 files) on production                                              | **Yes — no code** | D          | blocked                                          |
| next-steps         | NS-OPS-002          | Verify Storage bucket `ugc` + policies                                                                  | **Yes — no code** | D          | blocked                                          |
| next-steps         | NS-OPS-003          | Register Saleor webhook → `POST /api/webhooks/saleor`; set `SALEOR_WEBHOOK_SECRET`                      | **Yes — no code** | A          | blocked                                          |
| next-steps         | NS-OPS-004          | Schedule YouTube sync cron + `YOUTUBE_*` env                                                            | **Yes — no code** | A          | blocked                                          |
| next-steps         | NS-OPS-005          | Populate GitHub Actions secrets for `readiness-ci.yml`                                                  | **Yes — no code** | A          | blocked                                          |
| next-steps         | NS-OPS-006          | Verify org mirror sync after `main` merge                                                               | **Yes — no code** | A          | blocked                                          |
| next-steps         | NS-OPS-007          | CDN + CloudFront invalidation env (`S3_*`, `AWS_*`, `PUBLIC_CDN_BASE_URL`)                              | **Yes — no code** | A          | blocked                                          |
| next-steps         | NS-OPS-008          | Optional `BUG_REPORT_WEBHOOK_URL` for staff alerts                                                      | **Yes — no code** | A          | blocked                                          |
| next-steps         | NS-OPS-009          | `SOCIAL_*_CLIENT_ID` for live account connections OAuth                                                 | **Yes — no code** | A          | blocked                                          |
| next-steps         | NS-OPS-010          | Merge `dev` → `main` for production Netlify deploy                                                      | **Yes — no code** | —          | blocked                                          |
| next-steps         | NS-OPS-011          | Post-env QA: `/shop` count ≠ 120; readiness probes pass                                                 | **Yes — no code** | A          | blocked                                          |
| inspiration-polish | IP-001              | Supabase auth on Netlify preview                                                                        | **Yes — no code** | A          | blocked                                          |
| inspiration-polish | IP-002              | Live Saleor product catalog on Netlify                                                                  | **Yes — no code** | A          | blocked                                          |
| inspiration-polish | IP-003-ops          | Checkout + payment live verify (code wired; Payment App ops gate)                                       | **Yes — no code** | A          | partial (ops)                                    |
| inspiration-polish | IP-015              | Ghost blog + guides (live CMS)                                                                          | **Yes — no code** | A          | blocked                                          |
| admin-dashboard    | ADM-BLOCK-COMM      | `/admin/commerce/*` + wholesale nav stubs — do not build UI until routes exist                          | **Yes — no code** | B          | blocked (nav)                                    |
| admin-dashboard    | ADM-DEF-CHART       | Dashboard chart widgets (orders, traffic, category)                                                     | **Yes — no code** | B          | deferred (Saleor analytics)                      |

---

## Landed on `dev` (not separate swarm rows)

| Area                                                                                        | Evidence                                                                                                                            |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Admin shell chrome (interim daisyUI)                                                        | `4e7d0a9` — `.admin-shell` plugin, sidebar/topbar, dashboard health strip + `stats` + `timeline`                                    |
| Admin theme unify (zinc/red)                                                                | `dd32c00` — removed daisyUI + `.admin-shell`; shared `admin-ui.ts`; storefront unchanged (plain Tailwind `@theme`)                  |
| LGTM observability                                                                          | `eba78ff` — request logging, metrics endpoint, OTLP hook point; [observability-lgtm.md](../../infrastructure/observability-lgtm.md) |
| account-flow-fix                                                                            | Code hardening done; remaining items are ops duplicates of AUD-P0-*                                                                 |
| Inspiration-polish slot C (continued)                                                       | Homepage videos/campaigns, testimonial photos, admin UGC browser, scroll `AnimatedReveal`                                           |
| inspiration-polish IP-005–IP-028 (except open rows above), IP-BUG-001–004, archived batches | done                                                                                                                                |

---

## Verification

```bash
# Row count (expect 59 data rows)
awk -F'|' '/^\| (next-steps|market-readiness|admin-dashboard|inspiration-polish|media-uploads|ponytail-audit) / {c++} END{print c}' docs/plans/active/ACTIVE-SWARM-EXECUTION.md

npm run lint
```
