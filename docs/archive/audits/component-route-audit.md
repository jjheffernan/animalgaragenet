> **Status: Archived** — AUD-P2-034–038 done. See [archive/changelog-2026-H1.md](../changelog-2026-H1.md).

# Component & route audit — 2026-06-30

**Branch:** `dev`  
**Scope:** `src/lib/components/`, `src/routes/`, `src/routes/api/`  
**Method:** Glob + ripgrep importers; nav/footer/internal link scan (no sitemap in repo).

## Summary

| Category | Orphans / issues | Safe deletes |
| -------- | ---------------- | ------------ |
| Components | 0 unused (SupportCTA removed) | — |
| Stale routes | 1 weak-link (`/military`) + 6 admin stubs disabled | — |
| API routes | 0 dead | 0 |

## Unused components

| Path | Issue | Action | Priority |
| ---- | ----- | ------ | -------- |
| `src/lib/components/marketing/SupportCTA.svelte` | Zero imports | **Deleted** (`847ba4b`) | P2 |

All other 62 components under `src/lib/components/` have at least one importer (routes, other components, or tests).

## Stale / weak routes

### Public pages — weak discovery

| Path | Issue | Action | Priority |
| ---- | ----- | ------ | -------- |
| `src/routes/military/` | `/military` has no nav, footer, or internal links | Keep; add footer or loyalty/checkout link, or archive | P2 |
| `src/routes/media/` | Was omitted from `communityLinks` dropdown | **Fixed** — added to community nav (`AUD-P2-036`) | — |
| `src/routes/tools/tire-calculator/` | Cross-linked with fitment-visualizer only; not in nav/footer | Keep (per `docs/meta/decisions.md`) | P3 |
| `src/routes/tools/fitment-visualizer/` | Same as above | Keep | P3 |
| `src/routes/builds/submit/+page.svelte` | Load always redirects | **Deleted**; redirect server kept (`AUD-P2-038`) | — |
| `src/routes/builds/submit/+page.server.ts` | Redirect-only bookmark handler | Keep | — |
| `src/routes/locked/` | Reached via `SITE_LOCKED` in `hooks.server.ts` only | Keep (ops feature) | — |
| `src/routes/brands/` | Homepage `BrandLanes` + PDP breadcrumbs; not in main nav | Keep | — |
| `src/routes/blog/` | Footer only; not in header community menu | Keep | P3 |

### Admin — nav stubs (prototype)

`src/lib/admin/nav.ts` links to routes without `+page` files:

| Path | Issue | Action | Priority |
| ---- | ----- | ------ | -------- |
| `/admin/social/ugc` | Nav link → 404 | **`disabled: true`** in nav until scaffolded | P1 |
| `/admin/social/discord` | Nav link → 404 | Same | P1 |
| `/admin/commerce/channels` | Nav link → 404 | Same | P1 |
| `/admin/commerce/orders` | Nav link → 404 | Same | P1 |
| `/admin/calendar` | Nav link → 404 | Same (`AUD-P2-037` **done**) | P2 |
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
| `api/webhooks/saleor` | Saleor webhook target | **Wired** — `ORDER_CREATED` + fulfillment mirror (`7649a9e`); HMAC when `SALEOR_WEBHOOK_SECRET` set | — |
| `api/cron/youtube-sync` | Cron/external (`x-youtube-sync-secret`) | Keep | — |
| `api/catalog/search` | Called from `SearchModal.svelte` | Keep | — |
| `api/account/garage` | `garage-api.ts` + tests | Keep | — |
| `api/media/*` | `ReviewPhotoUpload.svelte` | Keep | — |
| `api/newsletter/subscribe` | `NewsletterSignup.svelte` + tests | Keep | — |
| `api/restock/notify` | `NotifyMeButton.svelte` + tests | Keep | — |

**Outside `api/` scope:** `checkout/payment/+server.ts` is a deprecated 400 responder; `checkout/payment/process` and `checkout/complete` have no `fetch` callers (logic in `checkout/payment/complete/+page.server.ts` load). Document for future checkout cleanup — do not delete yet.

## Remediation applied (same PR)

| Item | Change |
| ---- | ------ |
| AUD-P2-034 | Deleted `SupportCTA.svelte`; updated `src/lib/components/README.md` |
| AUD-P2-036 | Added Media to `communityLinks` in `Header.svelte` |
| AUD-P2-037 | Marked 6 admin nav stubs `disabled: true` until scaffolded |
| AUD-P2-038 | Deleted unreachable `builds/submit/+page.svelte`; kept redirect server |

## Verification

```bash
bash scripts/check-secrets.sh
npm run test:unit
```

**Tracker:** [AUDIT-REMEDIATION.md](../plans/AUDIT-REMEDIATION.md) — AUD-P2-034–038
