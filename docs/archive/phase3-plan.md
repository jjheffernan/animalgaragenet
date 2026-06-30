**Status:** Complete  
**Archived:** 2026-06-30  
**See instead:** [STATUS.md](../STATUS.md) · [meta/inspiration.md](../meta/inspiration.md)

# Phase 3 Implementation Plan

Execution plan for bug fixes, content completion, auth, admin, and YouTube integration. Work is split across four parallel workstreams (sub-agents).

## Status (June 2026)

| Workstream          | Status                                                               |
| ------------------- | -------------------------------------------------------------------- |
| A — Nav & UX        | Done (mega-menus, search, cart, promo, community nav)                |
| B — Watch / YouTube | Done (detail panel, admin sync stub)                                 |
| C — Content         | Mostly done (policies, contact, wholesale; Ghost guides/blog)        |
| D — Auth / Admin    | Done (auth routes, account builds, `/admin` shell, build moderation) |

---

## Workstream A — Navigation & Core UX

**Owner:** Sub-agent A  
**Files:** `Header.svelte`, `MegaMenu.svelte`, `PromoBar.svelte`, `promo.svelte.ts`, `SearchModal.svelte`, `CartDrawer.svelte`, `+layout.svelte`

### Tasks

1. **Parts button** — Click navigates to `/parts`; hover still opens mega-menu. Add `role="navigation"` wrappers, fix hover gap (menu attached to trigger, no dead zone).
2. **Shop button** — Same pattern → `/shop`.
3. **Search** — Remove duplicate `SearchModal`/`CartDrawer` from `+layout.svelte` (Header owns wired instances). Verify `search.openModal()` toggles modal.
4. **Cart** — Single `CartDrawer` bound to `cart.drawerOpen` in Header only.
5. **Promo dismiss** — Fix reactivity: expose `dismissed` as `$state` or use `$derived.by` for `visible`; call `promo.init()` on mount in `PromoBar`.
6. **A11y warnings** — Add `role="group"` + `tabindex="-1"` to mega-menu triggers; `tabindex="0"` on menu panel; replace `autofocus` with programmatic focus in `SearchModal` `$effect`.

### Acceptance

- Parts/Shop click-through works on desktop and mobile
- Search opens, returns results, closes on ESC
- Cart opens with item count badge
- Promo bar dismisses for session and stays hidden

---

## Workstream B — Watch & YouTube

**Owner:** Sub-agent B  
**Files:** `/watch`, `/watch/[id]`, `VideoGrid.svelte`, `VideoCard.svelte`, `VideoDetailPanel.svelte` (new), `mock/videos.ts`, `/admin/youtube`, `src/lib/server/youtube/`

### Tasks

1. **Video detail panel** — Clicking a video opens slide-over or modal with:
   - Extended description, publish date, duration
   - Embedded YouTube player
   - "Products in this video" grid with add-to-cart
   - Related videos row
2. **Route option** — `/watch/[id]` for deep links; grid uses panel on same page
3. **YouTube admin** — `/admin/youtube`:
   - List connected channels (mock → Supabase `youtube_channels`)
   - Add channel by ID/handle
   - Sync now button (mock fetch → upsert `videos` table)
   - Auto-sync cron documented in `docs/infrastructure/overview.md`
4. **Server module** — `src/lib/server/youtube/sync.ts`:
   - `fetchChannelVideos(apiKey, channelId)` placeholder
   - Maps to `Video` type with `linkedProductIds` admin-configurable
   - Webhook/cron entry point stub

### Acceptance

- Each video has expandable detail with products
- Admin can add a channel and trigger sync (mock data OK)
- Architecture documented for real YouTube Data API v3

---

## Workstream C — Content Pages & Builds

**Owner:** Sub-agent C  
**Files:** `/policies/*`, `/contact`, `/wholesale`, `/military`, `/builds/[slug]`, `catalog-helpers.ts`, `Footer.svelte`, `+page.svelte`

### Tasks

1. **Build blank page** — Fix `getProductsForBuild` to search `mock/products` + `mock/parts` via `getAllCatalogProducts()`. Fix linked product IDs in `mock/builds.ts` if needed.
2. **Support pages** — Full content for shipping, refunds, privacy, contact (forms with validation UI, Supabase submit stub).
3. **Program pages** — Wholesale + military: eligibility, how to apply, FAQ, forms.
4. **Footer dedup** — Remove `ManifestoBlock` from footer (keep tagline only). Remove duplicate `NewsletterSignup` from homepage (footer only).
5. **Homepage layout** — Single newsletter CTA in footer; tighten section order per style guide.

### Acceptance

- Build detail renders photos, mods, shop products
- Policy pages have real copy (not lorem stubs)
- One footer block, one newsletter signup visible on homepage

---

## Workstream D — Auth & Admin

**Owner:** Sub-agent D  
**Files:** `/auth/*`, `/account/*`, `/admin/*`, `src/lib/server/supabase/`, `src/hooks.server.ts`

### Tasks

1. **Auth routes** — `/auth/sign-in`, `/auth/sign-up`, `/auth/callback`, `/auth/sign-out`
   - Supabase magic link + OAuth (Google, Discord, Microsoft) — live when keys set; mock fallback without
   - Redirect to `/account` on success
2. **Account** — `/account` dashboard: profile, orders placeholder, saved vehicles, garage XP
3. **Admin shell** — `/admin` layout with role guard (mock admin session for dev)
4. **Admin users** — `/admin/users`: create user, assign role (admin | editor | contributor | customer)
5. **Admin CDN** — `/admin/media`: asset list, upload placeholder, CDN URL preview
6. **RBAC** — Document roles in `docs/meta/inspiration.md` + implement `src/lib/server/auth/roles.ts`
7. **Header** — Add Sign In / Account link based on session state

### Acceptance

- Sign-in flow UI complete (Supabase-ready)
- Admin can access user + media management (mock OK)
- RBAC roles defined and enforced in `hooks.server.ts` + `canAccessAdmin`

---

## Git Hygiene

- Remove `docs/inspiration/` competitor audit files
- Squash local commits to remove competitor names from history before first push
- All new commits use neutral messages

---

## Sequencing

```
A (nav fixes) ──┐
B (watch/YT)  ──┼──> Integration pass → npm run check && build → commit
C (content)   ──┤
D (auth/admin)──┘
```

---

_Last updated: June 2026_
