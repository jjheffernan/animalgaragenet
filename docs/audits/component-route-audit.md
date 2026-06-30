# Component & route audit — 2026-06-30

**Branch:** `dev`  
**Scope:** `src/lib/components/`, `src/routes/`, `src/routes/api/`  
**Method:** Glob + ripgrep importers; nav/footer/internal link scan (no sitemap in repo).

## Summary

| Category | Orphans / issues | Safe deletes |
| -------- | ---------------- | ------------ |
| Components | 1 unused | 1 |
| Stale routes | 4 weak-link + 6 admin stubs + 1 redirect orphan | 1 page shell |
| API routes | 0 dead (2 headless JSON, 1 external stub) | 0 |

## Unused components

| Path | Issue | Action | Priority |
| ---- | ----- | ------ | -------- |
| `src/lib/components/marketing/SupportCTA.svelte` | Zero imports in `src/` or `tests/` | Delete | P2 |

All other 62 components under `src/lib/components/` have at least one importer (routes, other components, or tests).

## Stale / weak routes

### Public pages — weak discovery

| Path | Issue | Action | Priority |
| ---- | ----- | ------ | -------- |
| `src/routes/military/` | `/military` has no nav, footer, or internal links | Keep; add link or archive | P2 |
| `src/routes/media/` | Linked from `UGCWall` only; in `communityPaths` but omitted from `communityLinks` dropdown | Keep; add to community nav | P2 |
| `src/routes/tools/tire-calculator/` | Cross-linked with fitment-visualizer only; not in nav/footer | Keep (per `docs/meta/decisions.md`) | P3 |
| `src/routes/tools/fitment-visualizer/` | Same as above | Keep | P3 |
| `src/routes/builds/submit/+page.svelte` | `+page.server.ts` always redirects to `/account/builds`; page never renders | Delete page shell | P2 |
| `src/routes/builds/submit/+page.server.ts` | Redirect-only bookmark handler | Keep | — |
| `src/routes/locked/` | Ops-only (`SITE_LOCKED` in `hooks.server.ts`) | Keep | — |
| `src/routes/brands/` | Homepage `BrandLanes` + PDP breadcrumbs; not in main nav | Keep | — |
| `src/routes/blog/` | Footer only; not in header community menu | Keep | P3 |

### Admin — nav stubs (prototype)

`src/lib/admin/nav.ts` links to routes without `+page` files:

| Path | Issue | Action | Priority |
| ---- | ----- | ------ | -------- |
| `/admin/social/ugc` | Nav link → 404 | Scaffold route or mark `disabled` in nav | P1 |
| `/admin/social/discord` | Nav link → 404 | Same | P1 |
| `/admin/commerce/channels` | Nav link → 404 | Same | P1 |
| `/admin/commerce/orders` | Nav link → 404 | Same | P1 |
| `/admin/calendar` | Nav link → 404 | Same | P2 |
| `/admin/support` | Nav link → 404 | Same | P2 |

### Admin — existing but mock/stub UI

| Path | Issue | Action | Priority |
| ---- | ----- | ------ | -------- |
| `src/routes/admin/users/+page.svelte` | In-memory `mockAdminUsers` | Keep until Supabase sync | P2 |
| `src/routes/admin/media/+page.svelte` | `mockMedia` | Keep | P2 |
| `src/routes/admin/+page.svelte` | Dashboard uses mock counts | Keep | P2 |

## API routes (`src/routes/api/`)

| Path | Issue | Action | Priority |
| ---- | ----- | ------ | -------- |
| `api/catalog/shop-filters` | No in-app `fetch`; filters loaded server-side in `shop/+page.server.ts` | Keep (headless JSON API) | P3 |
| `api/content/guide-filters` | No in-app `fetch`; filters in `guides/+page.server.ts` | Keep (headless JSON API) | P3 |
| `api/webhooks/saleor` | 501 stub; external Saleor webhook target | Keep; wire per IP-012 | P1 |
| `api/cron/youtube-sync` | Cron/external (`x-youtube-sync-secret`) | Keep | — |
| `api/catalog/search` | Called from `SearchModal.svelte` | Keep | — |
| `api/account/garage` | `garage-api.ts` + tests | Keep | — |
| `api/media/*` | `ReviewPhotoUpload.svelte` | Keep | — |
| `api/newsletter/subscribe` | `NewsletterSignup.svelte` + tests | Keep | — |
| `api/restock/notify` | `NotifyMeButton.svelte` + tests | Keep | — |

**Note (outside `api/` scope):** `src/routes/checkout/payment/+server.ts` is a deprecated 400 responder; `checkout/payment/process` and `checkout/complete` have no `fetch` callers (logic lives in `checkout/payment/complete/+page.server.ts` load). Document for future checkout cleanup, not delete yet.

## Recommended deletions (evidence-based)

| # | File | Evidence |
| - | ---- | -------- |
| 1 | `src/lib/components/marketing/SupportCTA.svelte` | 0 importers |
| 2 | `src/routes/builds/submit/+page.svelte` | Load always redirects; page never renders |

Also update `src/lib/components/README.md` (remove SupportCTA row).

## Verification

```bash
bash scripts/check-secrets.sh
npm run test:unit
```

**Tracker:** [AUDIT-REMEDIATION.md](../plans/AUDIT-REMEDIATION.md) — AUD-P2-034–038
