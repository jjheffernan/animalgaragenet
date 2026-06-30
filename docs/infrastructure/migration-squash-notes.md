# Supabase migration squash — 2026-07-01

**Branch:** `dev`  
**Reason:** 17 incremental migrations existed only on `dev` and were never applied to production. Squashed into logical files for a clean first-time prod apply.

---

## Before → after

| Before (17 files)                                                    | Merged into                                |
| -------------------------------------------------------------------- | ------------------------------------------ |
| `20250630125000_updated_at_helper.sql`                               | `20250701000000_core_auth_profiles.sql`    |
| `20260629120000_initial_profiles.sql`                                | ↑                                          |
| `20260629130000_profiles_signup_trigger.sql`                         | ↑                                          |
| `20250630230000_account_garage_xp.sql` (profiles columns)            | ↑                                          |
| `20250630180000_admin_moderation_policies.sql` (`is_staff`)          | ↑                                          |
| `20250629120000_build_submissions.sql`                               | `20250701010000_commerce_content.sql`      |
| `20250629130000_build_logs_account.sql`                              | ↑ (merged into `build_submissions` CREATE) |
| `20250629140000_testimonials.sql`                                    | ↑                                          |
| `20250630140000_newsletter_subscribers.sql`                          | ↑                                          |
| `20250630150000_content_metadata.sql`                                | ↑                                          |
| `20250630230000_account_garage_xp.sql` (`user_preferences.vehicles`) | ↑                                          |
| `20250630240000_social_connections.sql`                              | ↑ (`user_preferences.social_connections`)  |
| `20250630160000_youtube_sync.sql`                                    | ↑                                          |
| `20250630170000_order_snapshots.sql`                                 | ↑                                          |
| `20250630180000_admin_moderation_policies.sql` (staff policies)      | ↑                                          |
| `20250630210000_restock_alerts.sql`                                  | ↑                                          |
| `20250630220000_wholesale_inquiries.sql`                             | ↑                                          |
| `20250630250000_bug_reports.sql`                                     | ↑                                          |
| `20250630120000_media_assets.sql`                                    | `20250701020000_media_social.sql`          |
| `20250630180000_admin_moderation_policies.sql` (media policies)      | ↑                                          |

**Count:** 17 → **5** migration files (includes `20250701030000_pit_lane_deals.sql` and `20250701040000_build_submissions_rls.sql`).

**Removed duplicates:** `initial_profiles` had a commented-out copy of `handle_new_user`; `build_logs_account` ALTERs folded into `build_submissions` CREATE; `20260629*` misdated profile files merged into core auth with correct sort order.

---

## Apply guidance

### Fresh production (recommended)

Production has **no** prior migration history (or you are OK wiping both DBs). Link and apply the squashed set:

```bash
supabase link --project-ref <your-ref>

# Wipe remote + replay all migrations (destructive — no data preserved)
supabase db reset --linked

# Or, if remote migration history is empty and schema is blank:
supabase db push

supabase migration list    # should show 5 applied migrations
```

### Remote has stale migration history

If a prior push attempt left mismatched version names in `supabase_migrations.schema_migrations`:

```bash
supabase migration list

# Revert each stale remote-only version (example)
supabase migration repair --status reverted <old-version>

# Then push the squashed set
supabase db push
```

Alternatively: Supabase Dashboard → **Database** → reset project, then `supabase db push`.

### Local dev — new clone or after squash pull

Replay from scratch:

```bash
supabase start
supabase db reset          # drops local DB and replays all 5 files
```

### Local dev — existing DB with old 17 migrations applied

Your local `supabase_migrations.schema_migrations` will not match the repo. **Do not** `db push` incrementally — reset:

```bash
supabase db reset
```

Data in the local stack is discarded. Re-seed test users if needed (`scripts/promote-admin.ts`, dev auth).

### `db reset` vs `db push`

| Scenario                                                  | Command                                                                                                                         |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Local Docker stack, clean replay                          | `supabase db reset`                                                                                                             |
| Linked remote, empty / never migrated                     | `supabase db push`                                                                                                              |
| Linked remote, OK to wipe all data                        | `supabase db reset --linked`                                                                                                    |
| Linked remote, already has old migration names in history | `supabase migration repair` + `db push`, or Dashboard reset — see above                                                         |
| Local DB applied old 17 files                             | `supabase db reset`                                                                                                             |

---

## Preserved invariants

- RLS enabled on every `public` table
- `SELECT` policies paired with `UPDATE` where clients update rows
- `is_staff()` uses `app_metadata.role` only (never `user_metadata`)
- Storage `ugc` bucket: `INSERT` + `SELECT` + `UPDATE` + `DELETE` for owner paths
- Table/column comments retained where they existed

---

## Related

- [supabase-schema.md](./supabase-schema.md) — table reference and RLS templates
- [deployment.md](./deployment.md) — Netlify env vars and first-deploy checklist
- [batch-2026-07-03-followups.md](../archive/batch-2026-07-03-followups.md) — ops apply checklist (squashed filenames)
