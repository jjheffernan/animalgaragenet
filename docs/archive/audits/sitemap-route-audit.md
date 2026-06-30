> **Status: Archived** — SEO-001–003 shipped. See [STATUS.md](../../STATUS.md).

# Sitemap & route navigation audit — 2026-06-30

**Branch:** `dev`  
**Policy:** [SECURITY-PUBLIC.md](../SECURITY-PUBLIC.md) — route paths and feature names only.  
**Related:** [component-route-audit.md](./component-route-audit.md) (orphan components, admin stubs)

**Method:** Glob `src/routes/**/+page.svelte`; cross-reference `Header.svelte`, `Footer.svelte`, `MobileNavDrawer.svelte`, `AccountMenu.svelte`, `account/+layout.svelte`, `src/lib/admin/nav.ts`; grep stub markers; read `static/robots.txt` and `e2e/smoke.spec.ts`.

---

## Summary

| Metric | Count | Notes |
| ------ | ----: | ----- |
| **Stubs** | **6** (+1 partial) | Admin mock/scaffold pages + account mock modes |
| **Orphan routes** | **9** | Static public routes not in header/footer/account/admin nav |
| **Dead nav links** | **0** | All enabled nav `href`s resolve; admin stubs use `disabled: true` |
| **Sitemap gaps** | **24** | No sitemap generator — every nav/footer-linked public route is a gap |

---

## 1. Sitemap source

**Shipped (SEO-001, SEO-002 — 2026-06-30).**

| Location | Finding |
| -------- | ------- |
| `src/routes/sitemap.xml/+server.ts` | GET handler — static nav routes + dynamic catalog/content slugs |
| `src/lib/server/seo/sitemap.ts` | URL collector + XML renderer |
| `src/routes/robots.txt/+server.ts` | Dynamic `Sitemap:` from `PUBLIC_SITE_URL` |
| `static/robots.txt` | Static fallback with production host |

---

## 2. E2E coverage (`e2e/smoke.spec.ts`)

| Route | Covered? |
| ----- | -------- |
| `/` | Yes |
| `/shop` | Yes |
| `/parts` | Yes |
| `/shop/garage-flag-tee` | Yes (add-to-cart) |
| `/builds` | Yes |
| `/blog` | Yes |
| `/about` | Yes |
| `/contact` | Yes |
| `/support` | Yes |
| `/gift-cards` | Yes |
| `/auth/sign-in` | Yes |
| `/sitemap.xml` | Yes (urlset) |
| `/robots.txt` | Yes (Sitemap directive) |
| All other routes | No |

---

## 3. Navigation inventory

### Header / MegaMenu / MobileNav

| Link | Source |
| ---- | ------ |
| `/shop` (+ category query variants) | Shop mega menu |
| `/parts` | Parts mega menu |
| `/deals` (signed in) or `/auth/sign-in?redirect=/deals` | Deals CTA |
| `/loyalty`, `/guides`, `/events`, `/watch`, `/builds`, `/media` | Community dropdown |
| `/gift-cards` | Shop mega menu |
| `/auth/sign-in` | Header utility cluster |
| `/account` (+ drawer links) | `AccountMenu.svelte` when signed in |
| `/admin/dashboard` | Staff panel link when `staffPanel` |

### Footer

| Link |
| ---- |
| `/about`, `/support`, `/contact`, `/support/report-bug`, `/account/orders`, `/wholesale`, `/military` |
| `/shop`, `/parts`, `/gift-cards`, `/builds` |
| `/policies/shipping`, `/policies/refunds`, `/policies/privacy`, `/blog` |

### Account sidebar (`account/+layout.svelte`)

`/account/connections`, `/account/redeem`, `/account/builds`, `/account/orders`, `/account/vehicles`

### Admin sidebar (`src/lib/admin/nav.ts`)

Live routes: `/admin/dashboard`, `/admin/featured`, `/admin/builds`, `/admin/testimonials`, `/admin/youtube`, `/admin/media`, `/admin/users`, `/admin/bug-reports`, `/admin/runtime`  
Disabled labels (no route file): `/admin/commerce/channels`, `/admin/commerce/orders`, `/admin/wholesale`, `/admin/social/ugc`

---

## 4. Public routes vs discovery

| Route | Header | Footer | Account nav | Stub? | Notes |
| ----- | :----: | :----: | :---------: | :---: | ----- |
| `/` | Yes | No | No | No | Homepage |
| `/shop`, `/parts` | Yes | Yes | No | No | Catalog hubs |
| `/shop/[slug]`, `/parts/[category]/*` | No | No | No | No | Listing-driven |
| `/builds`, `/builds/[slug]` | Yes | Yes | No | No | Community |
| `/loyalty`, `/guides`, `/events`, `/watch`, `/media` | Yes | No | No | No | Community |
| `/deals`, `/gift-cards` | Yes | Yes | No | No | Commerce |
| `/blog`, `/blog/[slug]` | No | Yes | No | No | Footer only |
| `/about`, `/support`, `/contact` | No | Yes | No | No | Company |
| `/support/report-bug` | No | Yes | No | No | IP-031 form |
| `/wholesale`, `/military` | No | Yes | No | Partial | Military verify UX when Saleor offline |
| `/policies/*` | No | Yes | No | No | Legal |
| `/tools/tire-calculator`, `/tools/fitment-visualizer` | No | No | No | No | Cross-linked only; no `/tools` index |
| `/brands`, `/brands/[slug]` | No | No | No | No | Homepage `BrandLanes` + PDP breadcrumbs |
| `/cart` | No | No | No | No | Cart drawer button |
| `/checkout`, `/checkout/payment/complete` | No | No | No | No | Commerce flow |
| `/auth/sign-in` | Yes | No | No | No | Auth |
| `/auth/sign-up` | No | No | No | No | Sign-in cross-link only |
| `/account/*` | Yes | Partial | Yes | Partial | See account stubs below |
| `/builds/submit` | No | No | No | No | Redirect → `/account/builds` |
| `/locked` | No | No | No | No | `SITE_LOCKED` ops gate |

### Admin routes (staff-only)

| Route | In nav? | Stub? | Notes |
| ----- | :-----: | :---: | ----- |
| `/admin` | — | No | Redirects → `/admin/dashboard` |
| `/admin/dashboard` | Yes | **Yes** | `@inspiration-scaffold` mock KPIs |
| `/admin/featured`, `/admin/builds`, `/admin/testimonials`, `/admin/youtube` | Yes | No | Live admin UI |
| `/admin/media` | Yes | **Yes** | `mockMedia` gallery section |
| `/admin/users` | Yes | **Yes** | In-memory mock when Supabase offline |
| `/admin/bug-reports` | Yes | **Yes** | Mock fallback banner when Supabase unset |
| `/admin/runtime` | Yes | No | Integration status panel |
| `/admin/commerce/*`, `/admin/wholesale`, `/admin/social/ugc` | Disabled | **Yes** | No `+page` files |

---

## 5. Flagged categories

### Stubs (6 confirmed + 1 partial)

1. `/admin/dashboard` — mock order/wholesale counts, `@inspiration-scaffold` comments
2. `/admin/users` — prototype in-memory users when not on Supabase
3. `/admin/media` — `mockMedia` list alongside upload UI
4. `/admin/bug-reports` — “Showing mock fallback” when Supabase unset
5. `/account/connections` — “Mock mode” OAuth placeholder when provider keys unset
6. `/account/redeem` — mock promo codes when Saleor disconnected
7. `/military` *(partial)* — real copy; verify buttons depend on Saleor checkout

**Not stubs:** `/tools/*` (working calculators), `/about`, `/contact`, `/wholesale`, `/support` — full content/forms despite limited discovery.

### Orphan routes (9 static)

Reachable by URL, not in header/footer/account/admin nav:

1. `/tools/tire-calculator`
2. `/tools/fitment-visualizer`
3. `/brands` (+ `/brands/[slug]` via internal links)
4. `/cart` (drawer button, not nav href)
5. `/checkout`
6. `/checkout/payment/complete`
7. `/auth/sign-up` (sign-in cross-link only)
8. `/locked` (ops hook only)
9. `/builds/submit` (redirect bookmark)

Dynamic catalog/content routes (`/shop/[slug]`, `/parts/*`, `/builds/[slug]`, `/guides/[slug]`, `/watch/[id]`, etc.) are intentionally listing-driven, not nav orphans.

### Sitemap gaps (24)

With **no sitemap**, all nav/footer-linked public static routes are gaps, including:

`/`, `/shop`, `/parts`, `/builds`, `/loyalty`, `/guides`, `/events`, `/watch`, `/media`, `/deals`, `/gift-cards`, `/about`, `/support`, `/contact`, `/support/report-bug`, `/account/orders`, `/wholesale`, `/military`, `/blog`, `/policies/shipping`, `/policies/refunds`, `/policies/privacy`, `/auth/sign-in`, plus account routes linked from account UI (`/account`, `/account/connections`, `/account/redeem`, `/account/builds`, `/account/vehicles`).

Dynamic URLs (products, parts, posts, videos) would need a generator that queries Saleor, Ghost, Supabase, or YouTube sync tables.

### Dead nav links (0)

All **enabled** nav items point to existing routes. Admin disabled items render as non-clickable labels in `AdminSidebar.svelte` — not 404s.

**Minor UX note (not 404):** Tools breadcrumbs label “Tools” but link to the sibling tool route; `/tools` index has no `+page.svelte`.

---

## 6. Recommended follow-ups (not in scope)

| ID | Item | Owner |
| -- | ---- | ----- |
| SEO-001 | Add `src/routes/sitemap.xml/+server.ts` covering nav-linked static routes + dynamic content slugs | code |
| SEO-002 | Add `Sitemap:` directive to `static/robots.txt` | code |
| SEO-003 | Extend smoke tests beyond `/`, `/shop`, `/parts`, one PDP | code |
| AUD-P2-035 | `/military` discoverability — footer link exists; optional checkout cross-link | code |

Track open SEO work in [STATUS.md](../../STATUS.md) when prioritized.
