# Inspiration implementation tracker

**Source:** [inspiration.md](../../meta/inspiration.md)  
**Ops setup:** [inspiration-polish-prod-setup.md](./inspiration-polish-prod-setup.md)  
**Polish plan (archived code items):** [polish-plan.md](../../meta/polish-plan.md) — do not duplicate Done rows here.

Marker convention: `@inspiration-scaffold` (Supabase/community/CMS) and `@saleor-migration` (commerce). Agents must not remove scaffold comments unless wiring that step.

---

## P0 — Commerce

| Feature | Scaffold path | Status | Prod setup |
| --- | --- | --- | --- |
| Live Saleor product catalog | `src/lib/server/catalog/products.ts`, `saleor/queries.ts` | **Scaffolded** (`@saleor-migration`) | `PUBLIC_SALEOR_API_URL`, `SALEOR_CHANNEL` — see polish Phase 1 |
| Real cart + checkout mutations | `src/lib/server/saleor/checkout*.ts`, `routes/cart/` | **Scaffolded** (`@saleor-migration`) | Saleor payment gateway — polish Phase 2 |
| Notify-me restocks → Supabase | `supabase/migrations/20250630210000_restock_alerts.sql`, `src/lib/server/restock/repository.ts`, `POST /api/restock/notify`, `NotifyMeButton.svelte` | **Scaffolded** — UI wired; email send on restock open | Apply migration; wire Saleor `IN_STOCK` webhook → `listPendingRestockAlerts` |
| Collection-based shop filters (`?collection=`) | `src/lib/server/catalog/shop-collection.ts`, `routes/shop/+page.server.ts` | **Scaffolded** — mock collections; Saleor product edges commented | Uncomment `COLLECTION_PRODUCTS_QUERY` when Saleor live |
| Multi-channel international pricing | `src/lib/server/saleor/channels.ts` | **Scaffolded** (`@saleor-migration`) | Map locales in Saleor admin |
| Shipping zones + threshold promos | — | **Not started** | Saleor shipping + promotion rules |
| Unified merch + parts checkout | — | **Blocked** | Single Saleor cart (anti-pattern: split checkout) |

## P0 — Media & CDN

| Feature | Scaffold path | Status | Prod setup |
| --- | --- | --- | --- |
| S3 + CloudFront media URLs | — | **Deferred** | v1 uses Supabase Storage — see media-uploads plan |
| Campaign hero from CMS | `featured_sections` migration, `src/lib/server/featured-sections/repository.ts`, `routes/+page.server.ts`, `/admin/featured` | **Scaffolded** — loader + admin shell; homepage still uses `activeCampaign` mock fallback | Apply `20250630150000_content_metadata.sql`; seed `hero` row |
| YouTube channel auto-sync | `youtube_channels`/`videos` migrations, `src/lib/server/youtube/repository.ts`, `youtube/sync.ts`, `POST /api/cron/youtube-sync`, `/admin/youtube` | **Scaffolded** — mock API fetch; DB upsert wired | `YOUTUBE_API_KEY`, `YOUTUBE_SYNC_SECRET`; Netlify cron |
| UGC submission + moderation | `testimonials` + `media_assets` migrations, `/admin/testimonials` | **Live** (phase 1 media uploads) | Supabase Storage bucket `ugc` |

## P1 — Community & Auth

| Feature | Scaffold path | Status | Prod setup |
| --- | --- | --- | --- |
| Build thread submit → Supabase | `build_submissions` migration, `src/lib/server/build-logs/repository.ts`, `forms/submit.ts` | **Live** | Apply migrations; `/admin/builds` moderation |
| Newsletter → Supabase | `newsletter_subscribers` migration, `src/lib/server/newsletter/repository.ts`, `POST /api/newsletter/subscribe`, `NewsletterSignup.svelte` | **Scaffolded** — footer wired | Apply `20250630140000_newsletter_subscribers.sql` |
| Garage XP wired to real actions | `profiles.garage_xp` migration, `src/lib/server/user-preferences/repository.ts`, `POST /api/account/garage` | **Scaffolded** — API only; client still localStorage | Apply `20250630230000_account_garage_xp.sql`; wire `garage-xp.svelte.ts` |
| User vehicle garage (saved YMM) | `user_preferences.vehicles` migration, `GET/PUT /api/account/garage`, `routes/account/vehicles` | **Scaffolded** — API only; client still localStorage | Same migration; wire `garage.svelte.ts` |
| Wholesale application workflow | `wholesale_inquiries` migration, `src/lib/server/wholesale/repository.ts`, `routes/wholesale` | **Scaffolded** — form persists | Apply `20250630220000_wholesale_inquiries.sql`; admin queue TBD |
| Discord support integration | Footer CTA only | **Not started** | Optional popup-free CTA |

## P1 — Admin & RBAC

| Feature | Scaffold path | Status | Prod setup |
| --- | --- | --- | --- |
| Supabase-backed user CRUD | `src/lib/server/supabase/admin-users.ts`, `/admin/users` | **Partial** — mock table | Service role + `promote-admin.ts` |
| Featured sections editor | `/admin/featured` | **Scaffolded** — hero form only | Staff JWT (`editor`/`admin`) |
| Build moderation queue | `/admin/builds` | **Live** | Staff role |
| Deal / campaign scheduler | `/deals` mock | **Not started** | CMS table TBD |

## P2+ — Discovery, motion, deferred

| Feature | Status | Notes |
| --- | --- | --- |
| Faceted parts search | Not started | Saleor attributes |
| Financing (Affirm/Katapult) | Not started | High AOV |
| `@motionone/svelte` scroll system | Not started | animation-media.md |
| Burnout Board / sticker rewards | Not started | Gamification phase 4 |

---

## Execution log

| Date | Commit area | Notes |
| --- | --- | --- |
| 2026-06-30 | Migrations + repositories | `restock_alerts`, `wholesale_inquiries`, `account_garage_xp` |
| 2026-06-30 | API routes + UI wire | restock, newsletter, garage sync, featured admin |
| 2026-06-30 | Catalog + YouTube | `shop-collection.ts`, youtube repository |

---

_Last updated: June 30, 2026_
