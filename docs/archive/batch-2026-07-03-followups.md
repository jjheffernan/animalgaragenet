**Status:** Complete (in-repo)  
**Archived:** 2026-07-03  
**See instead:** [plans/active/inspiration-polish-tracker.md](../plans/active/inspiration-polish-tracker.md) § Ops-only · [infrastructure/migration-squash-notes.md](../infrastructure/migration-squash-notes.md) (squashed migration filenames)

# Implementation batch — 2026-07-03 follow-ups

**Branch:** `dev`  
**Created:** 2026-07-03  
**Policy:** [SECURITY-PUBLIC.md](../SECURITY-PUBLIC.md)  
**Sources:** Audit of last 30 commits · [batch-2026-07-02.md](./batch-2026-07-02.md) · [inspiration-polish-tracker.md](../plans/active/inspiration-polish-tracker.md)

Rows here were **missed follow-ups** from prior workers (July 2 QoL + IP-031 + admin entry reconcile). All in-repo rows **done**; ops apply checklist below remains authoritative until production Supabase is on squashed migrations.

---

## Batch status

**July 3 in-repo follow-ups: complete** — BATCH-021 shipped (`905f481`). Ops-only rows retained for production apply.

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

Apply on Supabase / register in external consoles. Use **squashed** migration filenames after `65e9d52` — see [migration-squash-notes.md](../infrastructure/migration-squash-notes.md).

| ID / area | Task | Prod setup |
| --------- | ---- | ---------- |
| IP-031 | Bug reports table | In `20250701010000_commerce_content.sql`; optional `BUG_REPORT_WEBHOOK_URL` |
| IP-004 | Restock alerts | In `20250701010000_commerce_content.sql`; Saleor stock webhook → restock handler |
| IP-006 | Homepage CMS | In `20250701010000_commerce_content.sql` (`content_metadata`) |
| IP-007 | YouTube sync | In `20250701010000_commerce_content.sql`; schedule `POST /api/cron/youtube-sync` + `x-youtube-sync-secret` |
| IP-008 | Newsletter | In `20250701010000_commerce_content.sql` |
| IP-009 / IP-010 | Garage XP / saved vehicles | Profiles/preferences in `20250701000000_core_auth_profiles.sql` + `20250701010000_commerce_content.sql` |
| IP-011 | Wholesale inquiries | In `20250701010000_commerce_content.sql` |
| IP-012 | Order mirror | In `20250701010000_commerce_content.sql`; register Saleor webhook → `/api/webhooks/saleor`; `SALEOR_WEBHOOK_SECRET` |
| IP-016 | Media assets | `20250701020000_media_social.sql` |
| IP-020 | Build submissions | In `20250701010000_commerce_content.sql` |
| IP-021 | Testimonials / UGC | In `20250701010000_commerce_content.sql`; Storage bucket `ugc` |
| IP-027 | Social connections | In `20250701010000_commerce_content.sql` (`user_preferences.social_connections`) |
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

_See [inspiration-polish-tracker.md](../plans/active/inspiration-polish-tracker.md) for tracker cross-links._
