> **Status: Archived** — Admin slices shipped. See [STATUS.md](../STATUS.md).

# Admin dashboard inspiration — Flowbite → Animal Garage

**Status:** Active — UI planning reference  
**Created:** 2026-06-30  
**Last updated:** 2026-06-30 (Slot B complete — zinc theme unify + open slices)  
**Policy:** [SECURITY-PUBLIC.md](../../SECURITY-PUBLIC.md)  
**Inspiration source:** [Flowbite Svelte Admin Dashboard](https://flowbite-svelte.com/admin-dashboard/dashboard) (layout patterns only — we do **not** adopt `flowbite-svelte` components)  
**Design system:** Tailwind zinc/red site theme per [design-tokens.md](../../style-guide/frontend/design-tokens.md). Shared admin tokens in `src/lib/components/admin/admin-ui.ts`; no `.admin-shell` or daisyUI plugin.  
**Prior art:** [dashboard-adoption-plan.md](../../archive/dashboard-adoption-plan.md) (DashWind era — shell shipped `3732fb9`; dashboard polish `4e7d0a9`)  
**Tracker cross-ref:** [inspiration-polish-tracker.md](./inspiration-polish-tracker.md) — IP-026 (runtime), IP-025 (users), IP-031 (bug reports)

---

## 1. Flowbite demo audit (patterns to translate)

The Flowbite admin demo (`/admin-dashboard/*`) is a SvelteKit shell with:

| Pattern             | Flowbite implementation                       | Animal Garage equivalent                                                           |
| ------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Sidebar             | `Sidebar` + `SidebarItem` + dropdown groups   | `AdminSidebar.svelte` + `ADMIN_NAV` — **shipped** (zinc menu; pending badges)      |
| Topbar              | Sticky navbar, page title, profile dropdown   | `AdminTopbar.svelte` — **shipped** (zinc navbar; no notifications bell)            |
| KPI / stat row      | Large number + delta % + period label + icons | Dashboard KPI row — **shipped** (zinc cards; no trend deltas yet)                  |
| System health strip | N/A in Flowbite                               | Dashboard badge row from `getRuntimeStatus()` — **shipped** (top 3 + Runtime link) |
| Chart cards         | Area + donut widgets                          | **Missing** — defer until Saleor analytics ship                                    |
| Activity feed       | Vertical timeline with month headers          | Dashboard activity table — **shipped** (live builds/bugs/YouTube)                  |
| Data table          | Sortable table + status badges + row actions  | Users + bug reports — **shipped** (`table` zinc chrome)                            |
| Toolbar             | Search, filter chips, export, “Add” CTA       | Users search + bug status chips — **shipped**                                      |
| Settings            | Multi-section forms, toggles, session list    | **No route** — account lives at `/account`                                         |
| CRUD modals         | Add/edit/delete user modals                   | Users inline card forms — **partial**                                              |
| Breadcrumbs         | `Breadcrumb` under page title                 | **Missing**                                                                        |
| Integration status  | N/A in Flowbite demo                          | `/admin/runtime` + dashboard health strip — **shipped**                            |

Flowbite sidebar routes (from upstream `Sidebar.svelte`):

- Dashboard, Layouts (demo), CRUD Products/Users, Settings, Pages (pricing/errors), Authentication (demo), Playground (demo)

We intentionally **do not** port demo-only routes (layouts playground, auth samples, pricing).

---

## 2. Current admin inventory

### Shell (`src/routes/admin/+layout.svelte`)

- Zinc/red site theme (`bg-zinc-950`); no `data-theme` or `.admin-shell`
- Mobile drawer sidebar + sticky topbar
- Storefront header offset: 73px
- Layout load: `navCounts` for pending builds/testimonials (`badgeKey` on nav items)

### Components (`src/lib/components/admin/`)

| File                     | Role                                                           |
| ------------------------ | -------------------------------------------------------------- |
| `AdminSidebar.svelte`    | Sectioned nav from `ADMIN_NAV`; pending count badges           |
| `AdminTopbar.svelte`     | Title, dev badge, profile dropdown                             |
| `AdminPageHeader.svelte` | Shared page title + subtitle + optional toolbar slot           |
| `admin-ui.ts`            | Shared zinc/red class tokens (card, btn, badge, table, alerts) |

### Navigation (`src/lib/admin/nav.ts`)

| Section  | Route                                                                                       | Scaffolded                                              |
| -------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Overview | `/admin/dashboard`                                                                          | Yes                                                     |
| Commerce | `/admin/commerce/channels`, `/admin/commerce/orders`, `/admin/wholesale`                    | **Disabled stubs** — do not build UI until routes exist |
| Content  | `/admin/featured`, `/admin/builds`, `/admin/testimonials`, `/admin/youtube`, `/admin/media` | Yes                                                     |
| Content  | `/admin/social/ugc`                                                                         | **Disabled stub**                                       |
| Users    | `/admin/users`                                                                              | Yes                                                     |
| Support  | `/admin/bug-reports`                                                                        | Yes                                                     |
| Runtime  | `/admin/runtime`                                                                            | Yes                                                     |

### Page maturity (post Slot B)

| Route                 | Data source                                                             | UI shape                                         | Theme pass | Notes                                             |
| --------------------- | ----------------------------------------------------------------------- | ------------------------------------------------ | ---------- | ------------------------------------------------- |
| `/admin/dashboard`    | `getDashboardStats()` + `getDashboardActivity()` + `getRuntimeStatus()` | Health strip, KPI row, activity table, shortcuts | Yes        | Live activity from builds/bugs/YouTube            |
| `/admin/featured`     | Supabase CMS                                                            | Card forms per section                           | Yes        | Hero + UGC/campaign blocks                        |
| `/admin/builds`       | Supabase                                                                | Card queue + `PaginatedListCanvas`               | Yes        | Approve/reject                                    |
| `/admin/testimonials` | Supabase                                                                | Card queue + pagination                          | Yes        | Feature checkbox                                  |
| `/admin/youtube`      | Supabase                                                                | Table + sync form                                | Yes        | Zinc table chrome                                 |
| `/admin/media`        | CDN API + mock                                                          | Upload + asset grid                              | Yes        | Env badges                                        |
| `/admin/users`        | Supabase or mock                                                        | Invite card + table + role defs                  | Yes        | Client search toolbar                             |
| `/admin/bug-reports`  | Supabase or mock                                                        | Table + status filter chips                      | Yes        | open / resolved / all                             |
| `/admin/runtime`      | Server booleans                                                         | Grouped cards + cron list                        | Yes        | Commerce / Content / Platform groups; `checkedAt` |

---

## 3. Flowbite view → route mapping

| Flowbite view                                        | Our route                                    | Gap                                                    | Priority | Status      |
| ---------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------ | -------- | ----------- |
| Dashboard (KPI hero + sales chart)                   | `/admin/dashboard`                           | KPI row shipped; no chart widget; commerce fields mock | P2       | partial     |
| Dashboard (statistics tabs — top products/customers) | —                                            | No analytics route; needs Saleor order data            | P3       | not started |
| Dashboard (secondary stat cards — products/users)    | `/admin/dashboard`                           | Users + open bugs wired; no month-over-month delta     | P3       | partial     |
| Dashboard (smart chat / team thread)                 | —                                            | Out of scope                                           | —        | skip        |
| Dashboard (sales by category chart)                  | —                                            | Needs live catalog + order aggregates                  | P3       | not started |
| Dashboard (traffic by device)                        | —                                            | No analytics pipeline                                  | —        | skip        |
| Dashboard (latest activity timeline)                 | `/admin/dashboard`                           | Live rows from builds/bugs/YouTube sync                | P1       | **shipped** |
| Dashboard (insights / CTA card)                      | `/admin/runtime`                             | Health strip summarizes integrations                   | P3       | partial     |
| Dashboard (transactions table)                       | `/admin/bug-reports`, future orders          | Bug reports table with filters                         | P2       | partial     |
| Sidebar shell                                        | `/admin/*` layout                            | Pending badges on Builds/Testimonials                  | P2       | **shipped** |
| Topbar + profile menu                                | `AdminTopbar.svelte`                         | No notification bell                                   | P3       | shipped     |
| CRUD Users (table + modals + export)                 | `/admin/users`                               | Table + search; no avatars, bulk select, export        | P2       | partial     |
| CRUD Products (table + filters)                      | `/admin/media` (assets), Saleor TBD          | Media is grid not product table                        | P3       | partial     |
| Settings (profile + notifications + sessions)        | `/account` (storefront)                      | No staff settings page                                 | —        | skip        |
| Integration / status widgets                         | `/admin/runtime`, dashboard strip            | Grouped runtime + dashboard top-3 strip                | P2       | **shipped** |
| Error pages (404/500 demos)                          | SvelteKit `+error.svelte`                    | Storefront errors only                                 | —        | skip        |
| Auth sign-in demo                                    | `/auth/sign-in`                              | Server Supabase auth                                   | —        | shipped     |
| Moderation queues (N/A in Flowbite)                  | `/admin/builds`, `/admin/testimonials`       | Zinc queue cards + shared header                       | P1       | **shipped** |
| CMS editor (N/A in Flowbite)                         | `/admin/featured`                            | Form-heavy; no live preview pane                       | P3       | shipped     |
| YouTube sync table (N/A in Flowbite)                 | `/admin/youtube`                             | Zinc table + card form                                 | P1       | **shipped** |
| Wholesale / orders (N/A in Flowbite)                 | `/admin/wholesale`, `/admin/commerce/orders` | Nav disabled                                           | —        | blocked     |
| UGC hub (N/A in Flowbite)                            | `/admin/social/ugc`                          | Nav disabled                                           | —        | blocked     |

---

## 4. Design translation cheat sheet

Flowbite uses component libraries; Animal Garage admin uses shared zinc/red Tailwind tokens (`admin-ui.ts`):

| Flowbite / concept | Admin (zinc/red)                               | Storefront                                         |
| ------------------ | ---------------------------------------------- | -------------------------------------------------- |
| Card               | `adminCard` / `adminCardFlush`                 | `rounded-sm border border-zinc-800 bg-zinc-900/50` |
| Stat / KPI         | Grid of bordered panels + `text-3xl font-bold` | Eyebrow + bold headline                            |
| Badge (success)    | `adminBadgeOn`                                 | `bg-emerald-600/20 text-emerald-400`               |
| Badge (warning)    | `adminBadgeWarning`                            | `bg-amber-600/20 text-amber-400`                   |
| Badge (neutral)    | `adminBadgeOff`                                | `border border-zinc-700 text-zinc-300`             |
| Table              | `adminTableHead` + zinc tbody                  | Same zinc thead pattern                            |
| Primary CTA        | `adminBtnPrimary`                              | `bg-red-600 hover:bg-red-500` uppercase            |
| Page title         | `AdminPageHeader`                              | `font-display text-2xl uppercase`                  |
| Alert              | `adminAlert*` variants                         | amber/emerald/red border panels                    |

Reuse storefront primitives where they fit: `PaginatedListCanvas`, `ListControls` on moderation queues.

---

## 5. UI slices — status

Improve **existing routes** only. Do **not** scaffold `/admin/commerce/*`, `/admin/wholesale`, or `/admin/social/ugc`.

### Slice 1 — Live recent activity feed (`/admin/dashboard`) **P1** — **shipped**

| Item                                                             | Status |
| ---------------------------------------------------------------- | ------ |
| `getDashboardActivity()` from builds, bugs, YouTube              | Done   |
| Type badges per row                                              | Done   |
| Deep-links to moderation routes                                  | Done   |
| Section “View all” links (builds / bugs / YouTube)               | Done   |
| `@inspiration-scaffold` comment for future `admin_activity` view | Done   |

### Slice 2 — Content route visual consistency **P1** — **shipped**

| Item                              | Status                    |
| --------------------------------- | ------------------------- |
| Builds + testimonials queue cards | Done (`admin-ui` buttons) |
| YouTube table + form              | Done                      |
| Media env badges + upload         | Done                      |

### Slice 3 — Nav pending-work indicators **P2** — **shipped**

| Item                               | Status                                      |
| ---------------------------------- | ------------------------------------------- |
| `+layout.server.ts` pending counts | Done (`builds`, `testimonials`, `openBugs`) |
| Sidebar red count badges           | Done                                        |

### Slice 4 — List toolbar + table polish **P2** — **shipped**

| Item                            | Status |
| ------------------------------- | ------ |
| Users client search             | Done   |
| Bug reports status filter chips | Done   |
| `AdminPageHeader.svelte`        | Done   |

### Slice 5 — Runtime panel enhancement **P2** — **shipped**

| Item                                 | Status            |
| ------------------------------------ | ----------------- |
| Commerce / Content / Platform groups | Done              |
| Server `checkedAt` timestamp         | Done              |
| Dashboard strip (top 3 booleans)     | Done (prior pass) |

### Theme unify — **shipped**

| Item                                                      | Status        |
| --------------------------------------------------------- | ------------- |
| Remove `.admin-shell` + daisyUI classes from admin routes | Done          |
| Single zinc/red token module                              | `admin-ui.ts` |

### Deferred (explicitly out of this plan)

- Charts (orders, traffic, category breakdown) — blocked on Saleor + analytics
- `/admin/settings` staff profile — use `/account`
- Commerce admin pages — nav stubs stay disabled
- Notification bell + right drawer — no notification backend
- Full audit log / transactions report — needs schema design
- Export CSV / bulk delete — not requested

---

## 6. Verification

```bash
rg -i 'jjheffernan|heff-industries|commerce\.animalgarage|cdn\.animalgarage|sk_live|eyJ[A-Za-z0-9_-]+\.' docs/plans/active/admin-dashboard-inspiration.md

npm run lint
npm run test:unit
```

Manual: staff session → `/admin/dashboard` → health strip + stats + activity table; sidebar badges when builds/testimonials pending; `/admin/runtime` grouped cards + timestamp.

---

_Last updated: 2026-06-30_
