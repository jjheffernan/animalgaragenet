# Supabase schema reference

Copy-paste patterns for Animal Garage Postgres tables, RLS, and apply workflow.  
**Public-safe** — no project refs, keys, or hostnames.

Full auth and env setup: [integrations/supabase.md](../integrations/supabase.md).

---

## Environment variables

| Variable | Scope | Used for |
| --- | --- | --- |
| `PUBLIC_SUPABASE_URL` | Public | API URL in browser + server |
| `PUBLIC_SUPABASE_ANON_KEY` | Public | RLS-scoped client |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Moderation, webhooks, cron sync — **never** in client bundles |
| `PUBLIC_SITE_URL` | Public | Magic link / OAuth redirects |

Optional: `SITE_LOCKED`, `DEV_ADMIN` (localhost only), `LOCAL_DEV_AUTH` (localhost only).

---

## How to apply migrations

### Local stack

```bash
supabase start                    # Docker local Postgres + Auth + Storage
supabase db reset                 # drop + replay all supabase/migrations/*
# or incremental:
supabase migration up
```

### Linked remote project

```bash
supabase link --project-ref <your-ref>
supabase db push                  # apply pending migrations to remote
supabase migration list           # verify history
```

### Dashboard fallback

Supabase Dashboard → **SQL Editor** → paste a single migration file → Run.  
Prefer CLI so `supabase_migrations.schema_migrations` stays in sync.

### New migration file

```bash
supabase migration new <descriptive_name>
# edit supabase/migrations/<timestamp>_<descriptive_name>.sql
```

---

## Tables (public schema)

| Table | Purpose | Wired in app |
| --- | --- | --- |
| `profiles` | Display name per `auth.users` | Auth signup trigger |
| `build_submissions` | Build log submit + account drafts | `src/lib/server/build-logs/`, `/builds/submit` |
| `testimonials` | Garage Squad reviews / UGC text | `src/lib/server/testimonials/` |
| `media_assets` | UGC image metadata (Storage `ugc` bucket) | `src/lib/server/media/repository.ts`, `api/media/*` |
| `testimonial_media` | Gallery join testimonials ↔ assets | `src/lib/server/media/repository.ts` |
| `newsletter_subscribers` | Footer newsletter opt-ins | `NewsletterSignup.svelte`, `api/newsletter/subscribe` |
| `featured_sections` | Homepage section JSON (`hero`, `media`, …) | `featured-sections/repository.ts`, `/admin/featured` |
| `user_preferences` | Locale, currency, favorites, garage XP | `user-preferences/repository.ts`, `api/account/garage` |
| `youtube_channels` | Connected channels for sync | `youtube/sync.ts`, `api/cron/youtube-sync` |
| `videos` | Synced YouTube catalog for `/watch` | `youtube/repository.ts`, `/watch` |
| `order_snapshots` | Saleor order mirror for `/account` | `orders/snapshots.ts`, `api/webhooks/saleor` |
| `social_connections` | Social handles on `user_preferences.social_connections` | `social-connections/`, `api/account/connections` |
| `restock_alerts` | PDP back-in-stock signups | `api/restock/subscribe` |
| `wholesale_inquiries` | B2B wholesale form queue | `/wholesale` |
| `bug_reports` | Site bug reports from `/support/report-bug` | `bug-reports/`, `admin/bug-reports` |

**Commerce** (products, cart, checkout) stays in **Saleor** — not Supabase.

---

## Authorization model

- **Roles** (`admin`, `editor`, `contributor`, `customer`) live in `auth.users.raw_app_meta_data.role`.
- Set roles only with **service role** or `scripts/promote-admin.ts` — never `user_metadata`.
- RLS helper: `public.is_staff()` → true when JWT `app_metadata.role` is `admin` or `editor`.

```sql
-- Staff check (security invoker — safe in public schema)
create or replace function public.is_staff()
returns boolean
language sql stable security invoker set search_path = ''
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'),
    false
  );
$$;
```

---

## RLS policy templates

**Rule:** Every `public` table has `enable row level security`.  
**Rule:** `UPDATE` requires a matching `SELECT` policy (Postgres RLS).

### Own-row read/write (account data)

```sql
alter table public.my_table enable row level security;

create policy "Users read own rows"
  on public.my_table for select to authenticated
  using (auth.uid() = user_id);

create policy "Users update own rows"
  on public.my_table for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### Public insert, no public read (spam-sensitive forms)

```sql
create policy "Public insert only"
  on public.my_queue for insert to anon, authenticated
  with check (true);
-- Moderation: service role or is_staff() SELECT/UPDATE policies
```

### Public read filtered rows (approved UGC)

```sql
create policy "Public read approved"
  on public.testimonials for select to anon, authenticated
  using (status = 'approved');
```

### Staff moderation

```sql
create policy "Staff read all"
  on public.build_submissions for select to authenticated
  using (public.is_staff());

create policy "Staff update all"
  on public.build_submissions for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());
```

### Storage bucket (private `ugc`)

Path convention: `ugc/{user_id}/{asset_id}.{ext}`

```sql
-- INSERT + SELECT + UPDATE required for upsert/replace
create policy "Users upload own objects"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'ugc'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
```

Server-minted signed upload URLs: see [media-uploads.md](../plans/active/media-uploads.md).

---

## Migration inventory (apply order)

Squashed 2026-07-01 — see [migration-squash-notes.md](./migration-squash-notes.md) for before/after list and reset guidance.

| # | File | Creates / changes |
| --- | --- | --- |
| 1 | `20250701000000_core_auth_profiles.sql` | `set_updated_at()`, `profiles`, `handle_new_user` trigger, `is_staff()` |
| 2 | `20250701010000_commerce_content.sql` | `build_submissions`, `testimonials`, `newsletter_subscribers`, `featured_sections`, `user_preferences`, `youtube_channels`, `videos`, `order_snapshots`, `restock_alerts`, `wholesale_inquiries`, `bug_reports`, staff RLS |
| 3 | `20250701020000_media_social.sql` | `media_assets`, `testimonial_media`, `ugc` Storage bucket + policies |

---

## Security checklist (quick)

- [ ] RLS enabled on every new `public` table
- [ ] No authorization from `user_metadata` / `raw_user_meta_data`
- [ ] `SELECT` policy exists wherever clients `UPDATE`
- [ ] Service role only in `src/lib/server/**` and scripts
- [ ] Storage upsert: `INSERT` + `SELECT` + `UPDATE` policies on `storage.objects`
- [ ] Run advisors after schema change: `supabase db advisors` or Supabase MCP `get_advisors`

---

## Verify after apply

```bash
npm run test:readiness          # supabase-db probe when env set
scripts/check-secrets.sh        # no committed secrets
```

```sql
-- Spot-check RLS
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
```

---

## Related docs

- [integrations/supabase.md](../integrations/supabase.md) — auth, Netlify env, roles
- [content/build-submissions.md](../content/build-submissions.md) — build log flow
- [plans/active/media-uploads.md](../plans/active/media-uploads.md) — UGC storage Phase 1
- [infrastructure/overview.md](./overview.md) — CDN + long-term architecture
