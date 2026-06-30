# Implementation batch — 2026-07-03 follow-ups

**Branch:** `dev`  
**Created:** 2026-07-03  
**Policy:** [SECURITY-PUBLIC.md](../../SECURITY-PUBLIC.md)  
**Sources:** Audit of last 30 commits · [batch-2026-07-02.md](./batch-2026-07-02.md) · [inspiration-polish-tracker.md](./inspiration-polish-tracker.md)

Rows here are **missed follow-ups** from prior workers (July 2 QoL + IP-031 + admin entry reconcile). Primary July 2 implementer queue remains [batch-2026-07-02.md](./batch-2026-07-02.md) Phase 2 (BATCH-013–020).

---

## Reconciled (no code action)

| Item | Evidence | Resolution |
| ---- | -------- | ---------- |
| Admin entry URLs | `3732fb9`, `1944119` | `/admin` → `/admin/dashboard`; AccountMenu **Admin** → `/admin/dashboard`; **Integrations** sidebar → `/admin/runtime` only |
| Uncommitted WIP | `git status` (2026-07-03 audit) | Working tree clean |

---

## July 3 follow-ups (in-repo)

| ID | Priority | Task | Code paths | Acceptance | Owner worker slot |
| -- | -------- | ---- | ---------- | ---------- | ----------------- |
| BATCH-021 | P2 | Admin bug report inbox (IP-031 remainder) | `src/routes/admin/bug-reports/`, `src/lib/admin/nav.ts` | **done** — read-only staff list via `listBugReports()`; mock fallback when Supabase unset | **C** |

**Slot B rationale:** Supabase-backed staff UI alongside testimonials/builds moderation patterns.

---

## Ops-only (documented — not in-repo)

Apply on Supabase / register in external consoles. Do not duplicate in implementer batches.

| ID / area | Task | Prod setup |
| --------- | ---- | ---------- |
| IP-031 | Bug reports table | Apply `20250630250000_bug_reports.sql`; optional `BUG_REPORT_WEBHOOK_URL` |
| IP-004 | Restock alerts | Apply `20250630210000_restock_alerts.sql`; Saleor stock webhook → restock handler |
| IP-006 | Homepage CMS | Apply `20250630150000_content_metadata.sql` |
| IP-007 | YouTube sync | Apply `20250630160000_youtube_sync.sql`; schedule `POST /api/cron/youtube-sync` + `x-youtube-sync-secret` |
| IP-008 | Newsletter | Apply `20250630140000_newsletter_subscribers.sql` |
| IP-009 / IP-010 | Garage XP / saved vehicles | Apply `20250630230000_account_garage_xp.sql` |
| IP-011 | Wholesale inquiries | Apply `20250630220000_wholesale_inquiries.sql` |
| IP-012 | Order mirror | Apply `20250630170000_order_snapshots.sql`; register Saleor webhook → `/api/webhooks/saleor`; `SALEOR_WEBHOOK_SECRET` |
| IP-016 | Media assets | Apply `20250630120000_media_assets.sql` |
| IP-020 | Build submissions | Apply `20250629120000_build_submissions.sql` |
| IP-021 | Testimonials / UGC | Apply `20250629140000_testimonials.sql`; Storage bucket `ugc` |
| IP-027 | Social connections | Apply `20250630240000_social_connections.sql` |
| AUD-P1-001 / BATCH-001 | Live checkout | Stripe Payment App enabled on Saleor channel |
| IP-015 / AUD-P1-008 | Ghost CMS | `GHOST_URL`, `GHOST_CONTENT_API_KEY`; tags `guide` / `blog` |
| AUD-P0-001–005 | Auth + catalog env | Netlify Supabase + Saleor env; `promote-admin.ts` bootstrap |

---

## Verification

```bash
npm run test:unit
npm run test:contracts
bash scripts/check-secrets.sh
```

---

_See [inspiration-polish-tracker.md](./inspiration-polish-tracker.md) for tracker cross-links._
