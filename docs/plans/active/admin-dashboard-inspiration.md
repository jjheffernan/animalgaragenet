# Admin dashboard inspiration — Flowbite → Animal Garage

**Status:** Active — UI planning reference  
**Created:** 2026-06-30  
**Last updated:** 2026-06-30 (post `4e7d0a9` admin daisyUI pass)  
**Policy:** [SECURITY-PUBLIC.md](../../SECURITY-PUBLIC.md)  
**Inspiration source:** [Flowbite Svelte Admin Dashboard](https://flowbite-svelte.com/admin-dashboard/dashboard) (layout patterns only — we do **not** adopt `flowbite-svelte` components)  
**Design system:** daisyUI 5 scoped to `.admin-shell` in `src/routes/layout.css`; storefront stays zinc/red per [design-tokens.md](../../style-guide/frontend/design-tokens.md). Read `.agents/skills/daisyui/SKILL.md` + component docs (`card`, `stat`, `badge`, `table`, `timeline`, `menu`, `navbar`) before admin UI work.  
**Prior art:** [dashboard-adoption-plan.md](../../archive/dashboard-adoption-plan.md) (DashWind era — shell shipped `3732fb9`; dashboard polish `4e7d0a9`)  
**Tracker cross-ref:** [inspiration-polish-tracker.md](./inspiration-polish-tracker.md) — IP-026 (runtime), IP-025 (users), IP-031 (bug reports)

---

## 1. Flowbite demo audit (patterns to translate)

The Flowbite admin demo (`/admin-dashboard/*`) is a SvelteKit shell with:

| Pattern | Flowbite implementation | Animal Garage equivalent |
| ------- | ----------------------- | ------------------------ |
| Sidebar | `Sidebar` + `SidebarItem` + dropdown groups | `AdminSidebar.svelte` + `ADMIN_NAV` — **shipped** (`menu`, `menu-title`, `menu-disabled`) |
| Topbar | Sticky navbar, page title, profile dropdown | `AdminTopbar.svelte` — **shipped** (`navbar`, `dropdown`, `avatar`; no notifications bell) |
| KPI / stat row | Large number + delta % + period label + icons | Dashboard `stats` row — **shipped** (`4e7d0a9`); no trend deltas yet |
| System health strip | N/A in Flowbite | Dashboard badge row from `getRuntimeStatus()` — **shipped** |
| Chart cards | Area + donut widgets | **Missing** — defer until Saleor analytics ship |
| Activity feed | Vertical timeline with month headers | Dashboard `timeline` — **partial** (UI shipped; data still mock) |
| Data table | Sortable table + status badges + row actions | Users — **shipped** (`table`); YouTube — **partial** (zinc table, not daisyUI) |
| Toolbar | Search, filter chips, export, “Add” CTA | **Missing** on list pages |
| Settings | Multi-section forms, toggles, session list | **No route** — account lives at `/account` |
| CRUD modals | Add/edit/delete user modals | Users inline card forms — **partial** |
| Breadcrumbs | `Breadcrumb` under page title | **Missing** |
| Integration status | N/A in Flowbite demo | `/admin/runtime` + dashboard health strip — **shipped** |

Flowbite sidebar routes (from upstream `Sidebar.svelte`):

- Dashboard, Layouts (demo), CRUD Products/Users, Settings, Pages (pricing/errors), Authentication (demo), Playground (demo)

We intentionally **do not** port demo-only routes (layouts playground, auth samples, pricing).

---

## 2. Current admin inventory

### Shell (`src/routes/admin/+layout.svelte`)

- `data-theme="dark"` on `.admin-shell`; daisyUI plugin root = `.admin-shell` only
- Mobile drawer sidebar + sticky topbar (`navbar`)
- Storefront header offset: 73px

### Components (`src/lib/components/admin/`)

| File | Role | daisyUI |
| ---- | ---- | ------- |
| `AdminSidebar.svelte` | Sectioned nav from `ADMIN_NAV` | `menu`, `menu-title` |
| `AdminTopbar.svelte` | Title, dev badge, profile dropdown | `navbar`, `dropdown`, `badge`, `avatar` |

No shared `AdminStatCard` / `AdminDataTable` primitives yet — patterns are inlined per page.

### Navigation (`src/lib/admin/nav.ts`)

| Section | Route | Scaffolded |
| ------- | ----- | ---------- |
| Overview | `/admin/dashboard` | Yes |
| Commerce | `/admin/commerce/channels`, `/admin/commerce/orders`, `/admin/wholesale` | **Disabled stubs** — do not build UI until routes exist |
| Content | `/admin/featured`, `/admin/builds`, `/admin/testimonials`, `/admin/youtube`, `/admin/media` | Yes |
| Content | `/admin/social/ugc` | **Disabled stub** |
| Users | `/admin/users` | Yes |
| Support | `/admin/bug-reports` | Yes |
| Runtime | `/admin/runtime` | Yes |

### Page maturity (post `4e7d0a9`)

| Route | Data source | UI shape | daisyUI pass | Notes |
| ----- | ----------- | -------- | ------------ | ----- |
| `/admin/dashboard` | `getDashboardStats()` + `getRuntimeStatus()` | Health strip, `stats`, timeline, quick links | Yes | Activity list still `@inspiration-scaffold` mock |
| `/admin/featured` | Supabase CMS | Card forms per section | Yes | Hero + UGC/campaign blocks |
| `/admin/builds` | Supabase | Card queue + `PaginatedListCanvas` | **No** — zinc cards/buttons | Approve/reject |
| `/admin/testimonials` | Supabase | Card queue + pagination | **No** — zinc | Feature checkbox |
| `/admin/youtube` | Supabase | Table + sync form | **No** — zinc table | Reference for table chrome migration |
| `/admin/media` | CDN API + mock | Upload + asset grid | **No** — zinc | Presigned PUT when env set |
| `/admin/users` | Supabase or mock | Invite card + `table` + role defs | Yes | No search/filter toolbar |
| `/admin/bug-reports` | Supabase or mock | Card inbox + `badge` status | Yes | Cards only — no table view |
| `/admin/runtime` | Server booleans | Card grid + cron list | Yes | No Commerce/Content grouping |

---

## 3. Flowbite view → route mapping

| Flowbite view | Our route | Gap | Priority | Status |
| ------------- | --------- | --- | -------- | ------ |
| Dashboard (KPI hero + sales chart) | `/admin/dashboard` | `stats` row shipped; no chart widget; commerce fields mock (`orders`, `revenueLabel`) | P2 | partial |
| Dashboard (statistics tabs — top products/customers) | — | No analytics route; needs Saleor order data | P3 | not started |
| Dashboard (secondary stat cards — products/users) | `/admin/dashboard` | Users + open bugs wired via `getDashboardStats()`; no month-over-month delta | P3 | partial |
| Dashboard (smart chat / team thread) | — | Out of scope — not a garage ops need | — | skip |
| Dashboard (sales by category chart) | — | Needs live catalog + order aggregates | P3 | not started |
| Dashboard (traffic by device) | — | No analytics pipeline | — | skip |
| Dashboard (latest activity timeline) | `/admin/dashboard` | `timeline` UI shipped; needs live rows from builds/bugs/sync | P1 | partial |
| Dashboard (insights / CTA card) | `/admin/runtime` | Health strip summarizes integrations; no “action required” CTA | P3 | partial |
| Dashboard (transactions table) | `/admin/bug-reports`, future orders | No unified events table; bugs are per-card inbox | P2 | partial |
| Sidebar shell | `/admin/*` layout | No nav icons; no collapsible submenus; no pending counts | P2 | shipped |
| Topbar + profile menu | `AdminTopbar.svelte` | No notification bell; title from URL segment only | P3 | shipped |
| CRUD Users (table + modals + export) | `/admin/users` | daisyUI table; no avatars, search, bulk select, export, delete | P2 | partial |
| CRUD Products (table + filters) | `/admin/media` (assets), Saleor TBD | Media is grid not product table; no `/admin/commerce/*` yet | P3 | partial |
| Settings (profile + notifications + sessions) | `/account` (storefront) | No staff settings page | — | skip |
| Integration / status widgets | `/admin/runtime`, dashboard strip | Runtime page shipped; dashboard shows all 6 badges (could trim to top 3) | P2 | shipped |
| Error pages (404/500 demos) | SvelteKit `+error.svelte` | Storefront errors only | — | skip |
| Auth sign-in demo | `/auth/sign-in` | Server Supabase auth — stronger than demo | — | shipped |
| Moderation queues (N/A in Flowbite) | `/admin/builds`, `/admin/testimonials` | Zinc styling off-brand vs rest of admin; share queue card pattern | P1 | partial |
| CMS editor (N/A in Flowbite) | `/admin/featured` | Form-heavy; no live preview pane | P3 | shipped |
| YouTube sync table (N/A in Flowbite) | `/admin/youtube` | Strongest zinc table — migrate to daisyUI `table` | P1 | partial |
| Wholesale / orders (N/A in Flowbite) | `/admin/wholesale`, `/admin/commerce/orders` | Nav disabled — **do not implement UI slices here yet** | — | blocked |
| UGC hub (N/A in Flowbite) | `/admin/social/ugc` | Nav disabled — testimonials cover moderation today | — | blocked |

---

## 4. Design translation cheat sheet

Flowbite uses `Card`, `Badge`, `Table`, `Button` from `flowbite-svelte`. Inside `.admin-shell`, use daisyUI semantic classes (read skill component docs first):

| Flowbite / concept | daisyUI (admin shell) | Storefront (no daisyUI) |
| ------------------ | --------------------- | ----------------------- |
| Card | `card bg-base-200 shadow-sm` + `card-body` | `rounded-sm border border-zinc-800 bg-zinc-900/50 p-6` |
| Stat / KPI | `stats` / `stat` / `stat-title` / `stat-value` / `stat-desc` | Eyebrow + `text-3xl font-bold text-white` |
| Badge (success) | `badge badge-success badge-sm` | `bg-emerald-600/20 text-emerald-400` |
| Badge (warning) | `badge badge-warning` | `bg-amber-600/20 text-amber-400` |
| Badge (neutral) | `badge badge-ghost` | `border border-zinc-700 text-zinc-300` |
| Table | `table` inside `overflow-x-auto` card | zinc thead pattern (legacy admin pages) |
| Primary CTA | `btn btn-primary` | `bg-red-600 hover:bg-red-500` uppercase |
| Page title | `font-display text-2xl font-bold uppercase` + `text-base-content/70` subtitle | same headline scale |
| Timeline | `timeline timeline-vertical timeline-compact` | N/A |
| Nav | `menu menu-sm`, `menu-title`, `menu-active` | Header nav patterns |
| Alert | `alert alert-warning alert-soft` | amber border panel |

Reuse storefront primitives where they already fit admin flows: `PaginatedListCanvas`, `ListControls` on moderation queues.

---

## 5. UI slices to implement (scoped — no disabled-nav work)

Improve **existing routes** only. Do **not** scaffold `/admin/commerce/*`, `/admin/wholesale`, or `/admin/social/ugc`.

### Done in `4e7d0a9` (do not re-implement)

- daisyUI plugin scoped to `.admin-shell`
- Dashboard system health strip + `stats` KPI row + `timeline` + quick links
- Shell: `AdminSidebar` / `AdminTopbar` daisyUI pass
- `getDashboardStats()` server module (orders/revenue mock, users + open bugs live)
- daisyUI pass: `users`, `bug-reports`, `runtime`, `featured`

### Slice 1 — Live recent activity feed (`/admin/dashboard`) **P1**

| Item | Acceptance |
| ---- | ---------- |
| Replace `recentActivity` mock array | Build rows in `+page.server.ts` from pending builds, latest bug reports, last YouTube sync timestamp |
| Table or timeline | Keep `timeline` UI; add type `badge` per row (Build, Bug, Sync, User) |
| “View all” links | Row deep-links to `/admin/builds`, `/admin/bug-reports`, `/admin/youtube` |
| `@inspiration-scaffold` | Comment path to future `admin_activity` Supabase view (extend IP-026) |

### Slice 2 — Content route daisyUI consistency **P1**

| Item | Files | Acceptance |
| ---- | ----- | ---------- |
| Moderation queues | `builds/+page.svelte`, `testimonials/+page.svelte` | `card`, `btn btn-primary` / `btn btn-outline`; match dashboard density |
| YouTube admin | `youtube/+page.svelte` | `table` + `card` form; drop raw zinc classes |
| Media browser | `media/+page.svelte` | `card` sections, `badge` for env flags, `btn` for upload |

### Slice 3 — Nav pending-work indicators **P2**

| Item | Acceptance |
| ---- | ---------- |
| `+layout.server.ts` load | Count pending builds + testimonials (existing repositories) |
| `nav.ts` or layout data | Pass counts to `AdminSidebar` |
| Sidebar UI | `badge badge-error badge-sm` on Builds / Testimonials when count > 0 |

### Slice 4 — List toolbar + table polish **P2**

| Item | Acceptance |
| ---- | ---------- |
| Users search | Client filter by name/email above `table` (no new API) |
| Bug reports | Optional `table` view toggle OR status filter chips (`open` / `resolved`) |
| Shared chrome | Extract `AdminPageHeader.svelte` (title + subtitle + optional actions slot) if 3+ pages need it |

### Slice 5 — Runtime panel enhancement **P2**

| Item | Acceptance |
| ---- | ---------- |
| Group cards | Headings: Commerce (Saleor), Content (Ghost, YouTube), Platform (Supabase, mock guards, site lock) |
| Last-checked | Show server `load` timestamp — no browser-side probing |
| Dashboard strip trim | Optional: show only Saleor + Supabase + site lock on dashboard; link “+3 more” to runtime |

### Deferred (explicitly out of this plan)

- Charts (orders, traffic, category breakdown) — blocked on Saleor + analytics
- `/admin/settings` staff profile — use `/account`
- Commerce admin pages — nav stubs stay disabled
- Notification bell + right drawer — no notification backend
- Full audit log / transactions report — needs schema design
- Export CSV / bulk delete — not requested

---

## 6. Suggested implementation order

1. **Slice 1** — dashboard activity feels “real” without new routes
2. **Slice 2** — visual consistency across content admin
3. **Slice 3** — sidebar signals moderation backlog
4. **Slice 4** — staff efficiency on users + bugs
5. **Slice 5** — runtime readability

---

## 7. Verification

```bash
# Public doc safety (expect no hits except policy exceptions)
rg -i 'jjheffernan|heff-industries|commerce\.animalgarage|cdn\.animalgarage|sk_live|eyJ[A-Za-z0-9_-]+\.' docs/plans/active/admin-dashboard-inspiration.md

npm run lint
npm run test:unit
```

Manual: staff session → `/admin/dashboard` → health strip + stats + timeline; spot-check `/admin/builds` and `/admin/youtube` for zinc/daisyUI drift.

---

_Last updated: 2026-06-30_
