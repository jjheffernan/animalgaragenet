# Admin dashboard inspiration — Flowbite → Animal Garage

**Status:** Active — UI planning reference  
**Created:** 2026-06-30  
**Policy:** [SECURITY-PUBLIC.md](../../SECURITY-PUBLIC.md)  
**Inspiration source:** [Flowbite Svelte Admin Dashboard](https://flowbite-svelte.com/admin-dashboard/dashboard) (layout patterns only — we do **not** adopt Flowbite components)  
**Design system:** Tailwind zinc/red per [design-tokens.md](../../style-guide/frontend/design-tokens.md) and [components.md](../../style-guide/frontend/components.md). daisyUI was removed; treat `.agents/skills/daisyui/SKILL.md` as reference-only for semantic equivalents (card → bordered zinc surface, stat → KPI tile, badge → status pill, table → `overflow-x-auto` + zinc thead).  
**Prior art:** [dashboard-adoption-plan.md](../../archive/dashboard-adoption-plan.md) (DashWind/daisyUI era — shell shipped in `3732fb9`)  
**Tracker cross-ref:** [inspiration-polish-tracker.md](./inspiration-polish-tracker.md) — IP-026 (runtime), IP-025 (users), IP-031 (bug reports)

---

## 1. Flowbite demo audit (patterns to translate)

The Flowbite admin demo (`/admin-dashboard/*`) is a SvelteKit shell with:

| Pattern | Flowbite implementation | Animal Garage equivalent |
| ------- | ----------------------- | ------------------------ |
| Sidebar | `Sidebar` + `SidebarItem` + dropdown groups | `AdminSidebar.svelte` + `ADMIN_NAV` in `nav.ts` — **shipped** |
| Topbar | Sticky navbar, page title, profile dropdown | `AdminTopbar.svelte` — **shipped** (no notifications bell) |
| KPI / stat row | Large number + delta % + period label | Dashboard `+page.svelte` — **partial** (counts only, no deltas) |
| Chart cards | Apex/Chart.js area + donut widgets | **Missing** — defer until commerce analytics ship |
| Activity feed | Vertical timeline with month headers | Dashboard recent activity — **partial** (flat `<ul>`, mock data) |
| Data table | Sortable table + status badges + row actions | Users + YouTube — **partial**; bug reports use cards |
| Toolbar | Search, filter chips, export, “Add” CTA | **Missing** on list pages |
| Settings | Multi-section forms, toggles, session list | **No route** — account lives at `/account` |
| CRUD modals | Add/edit/delete user modals | Users inline forms — **partial** |
| Breadcrumbs | `Breadcrumb` under page title | **Missing** |
| Integration status | N/A in Flowbite demo | `/admin/runtime` — **shipped** (not surfaced on dashboard) |

Flowbite sidebar routes (from upstream `Sidebar.svelte`):

- Dashboard, Layouts (demo), CRUD Products/Users, Settings, Pages (pricing/errors), Authentication (demo), Playground (demo)

We intentionally **do not** port demo-only routes (layouts playground, auth samples, pricing).

---

## 2. Current admin inventory

### Shell (`src/routes/admin/+layout.svelte`)

- Mobile drawer sidebar + sticky topbar
- Zinc-950 canvas, red accents, 73px storefront header offset
- Components: `AdminSidebar.svelte`, `AdminTopbar.svelte` only (no shared stat/table primitives yet)

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

### Page maturity

| Route | Data source | UI shape | Notes |
| ----- | ----------- | -------- | ----- |
| `/admin/dashboard` | Mock + session | KPI grid, quick links, activity list | `@inspiration-scaffold` on commerce KPIs + activity |
| `/admin/featured` | Supabase CMS | Form sections | Hero + UGC/campaign blocks |
| `/admin/builds` | Supabase | Card queue + `PaginatedListCanvas` | Approve/reject |
| `/admin/testimonials` | Supabase | Card queue + pagination | Feature checkbox |
| `/admin/youtube` | Supabase | Table + sync actions | Strongest table pattern in admin |
| `/admin/media` | CDN API + mock | Upload form + asset grid | Presigned PUT when env set |
| `/admin/users` | Supabase or mock | Invite form + table + role defs | Live role updates |
| `/admin/bug-reports` | Supabase or mock | Card inbox | Read-only |
| `/admin/runtime` | Server booleans | Status card grid + cron list | No secrets in UI |

---

## 3. Flowbite view → route mapping

| Flowbite view | Our route | Gap | Priority | Status |
| ------------- | --------- | --- | -------- | ------ |
| Dashboard (KPI hero + sales chart) | `/admin/dashboard` | No chart widget; KPIs lack trend deltas and deep links; commerce row is mock | P1 | partial |
| Dashboard (statistics tabs — top products/customers) | — | No analytics route; needs Saleor order data | P3 | not started |
| Dashboard (secondary stat cards — products/users) | `/admin/dashboard` | Users/media/YouTube counts exist; no month-over-month delta | P2 | partial |
| Dashboard (smart chat / team thread) | — | Out of scope — not a garage ops need | — | skip |
| Dashboard (sales by category chart) | — | Needs live catalog + order aggregates | P3 | not started |
| Dashboard (traffic by device) | — | No analytics pipeline | — | skip |
| Dashboard (latest activity timeline) | `/admin/dashboard` | Flat mock list; should be table/timeline with type badges + “View all” | P1 | partial |
| Dashboard (insights / CTA card) | `/admin/runtime` | Integration warnings not summarized on dashboard | P2 | partial |
| Dashboard (transactions table) | `/admin/bug-reports`, future orders | No unified “recent events” table; bug reports are cards not table | P2 | partial |
| Sidebar shell | `/admin/*` layout | No nav icons; no collapsible submenus | P3 | shipped |
| Topbar + profile menu | `AdminTopbar.svelte` | No notification bell; title from URL segment only | P3 | shipped |
| CRUD Users (table + modals + export) | `/admin/users` | No avatars, bulk select, export, delete; inline role select only | P2 | partial |
| CRUD Products (table + filters) | `/admin/media` (assets), Saleor TBD | Media is grid not product table; no `/admin/commerce/*` yet | P3 | partial |
| Settings (profile + notifications + sessions) | `/account` (storefront) | No staff settings page; runtime covers env not profile | P3 | skip |
| Integration / status widgets | `/admin/runtime` | Strong page; not embedded on dashboard | P1 | shipped (page only) |
| Error pages (404/500 demos) | SvelteKit `+error.svelte` | Storefront errors only | P3 | skip |
| Auth sign-in demo | `/auth/sign-in` | Server Supabase auth — stronger than demo | — | shipped |
| Moderation queues (N/A in Flowbite) | `/admin/builds`, `/admin/testimonials` | Card lists work; could share queue row component | P2 | partial |
| CMS editor (N/A in Flowbite) | `/admin/featured` | Form-heavy; no preview pane | P3 | shipped |
| YouTube sync table (N/A in Flowbite) | `/admin/youtube` | Reference table styling for other admin lists | P2 | shipped |
| Wholesale / orders (N/A in Flowbite) | `/admin/wholesale`, `/admin/commerce/orders` | Nav disabled — **do not implement UI slices here yet** | — | blocked |
| UGC hub (N/A in Flowbite) | `/admin/social/ugc` | Nav disabled — testimonials cover moderation today | — | blocked |

---

## 4. Design translation cheat sheet

Flowbite uses `Card`, `Badge`, `Table`, `Button` from `flowbite-svelte`. Map to our Tailwind conventions:

| Flowbite / daisyUI concept | Animal Garage pattern |
| -------------------------- | --------------------- |
| Card | `rounded-sm border border-zinc-800 bg-zinc-900/50 p-6` |
| Stat / KPI | Uppercase eyebrow `text-xs font-bold uppercase tracking-widest text-zinc-500` + `text-3xl font-bold text-white` |
| Badge (success) | `rounded-sm bg-emerald-600/20 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-400` |
| Badge (warning) | `bg-amber-600/20 text-amber-400` (see runtime cron cards) |
| Badge (neutral) | `border border-zinc-700 … text-zinc-300` (bug report status) |
| Table | `overflow-x-auto rounded-sm border border-zinc-800` + zinc thead (see `/admin/users`, `/admin/youtube`) |
| Primary CTA | `rounded-sm bg-red-600 … hover:bg-red-500` + uppercase label |
| Page title block | `font-display text-2xl font-bold uppercase text-white` + `text-zinc-400` subtitle |
| Toolbar | Future: flex row with search `input` + filter chips + right-aligned actions |
| Timeline | Vertical list with date column + event type badge — extend dashboard activity section |

Reuse existing primitives before adding admin-only components: `PaginatedListCanvas`, `ListControls` patterns from catalog PLPs.

---

## 5. UI slices to implement (scoped — no disabled-nav work)

These slices improve **existing routes** only. They do **not** scaffold `/admin/commerce/*`, `/admin/wholesale`, or `/admin/social/ugc`.

### Slice A — Shared admin primitives (foundation)

| Item | Files | Acceptance |
| ---- | ----- | ---------- |
| `AdminStatCard.svelte` | `$lib/components/admin/` | Props: label, value, hint, optional `href`, optional delta string (e.g. `↑12%`) |
| `AdminSectionCard.svelte` | same | Title eyebrow + default slot — replaces repeated `section` wrappers |
| `AdminStatusBadge.svelte` | same | Variants: `on`, `off`, `warning`, `neutral` — unify runtime + bug reports |

### Slice B — Dashboard KPI row upgrade (`/admin/dashboard`)

| Item | Acceptance |
| ---- | ---------- |
| Refactor KPI grid to `AdminStatCard` | Four live stats link to `/admin/users`, `/admin/media`, `/admin/youtube`, account |
| Commerce KPI row | Keep mock values + `@inspiration-scaffold` until Saleor orders route ships; visually de-emphasize (muted border) |
| Integration snapshot strip | Top 3 booleans from `runtime-status` (Saleor, Supabase, site lock) with link to `/admin/runtime` |
| Remove duplicate quick-link prose where stat cards link directly | Quick links section becomes “Staff shortcuts” for moderation only |

### Slice C — Recent activity table (`/admin/dashboard`)

| Item | Acceptance |
| ---- | ---------- |
| Replace mock `<ul>` with compact table | Columns: When, Type (badge), Summary, Link |
| Seed from existing sources first | Pending builds count, latest bug report, last YouTube sync timestamp — no new DB table required for v1 |
| `@inspiration-scaffold` | Document path to future `admin_activity` Supabase view in tracker IP row (new or extend IP-026) |

### Slice D — `AdminDataTable` + toolbar (`/admin/users`, `/admin/bug-reports`)

| Item | Acceptance |
| ---- | ---------- |
| Extract table chrome from users page | Sticky thead, zebra optional, responsive `min-w` |
| Optional toolbar snippet | Search by email/name on users; filter by status on bug reports |
| Bug reports | Offer table view toggle alongside existing cards (or migrate to table only) |
| Do not add export/delete until product asks | Flowbite export button is out of scope for v1 |

### Slice E — Topbar + sidebar polish

| Item | Acceptance |
| ---- | ---------- |
| Breadcrumb or section context under title | e.g. `Content / YouTube` from `ADMIN_NAV` parent |
| Sidebar icons (optional) | Heroicons outline matching section — behind nav item `icon` field already in `nav.ts` |
| Pending-work indicators | Badge count on Builds/Testimonials nav items when `pending.length > 0` (server load in layout) |

### Slice F — Runtime panel enhancement (`/admin/runtime`)

| Item | Acceptance |
| ---- | ---------- |
| Group cards: Commerce / Content / Platform | Visual grouping only — same booleans |
| Last-checked timestamp | Display `load` time; no external probing in browser |
| Embed mini-widget on dashboard | 3-card subset (Slice B) — avoid duplicating full runtime page |

### Deferred (explicitly out of this plan)

- Charts (orders, traffic, category breakdown) — blocked on Saleor + analytics
- `/admin/settings` staff profile — use `/account`
- Commerce admin pages — nav stubs stay disabled
- Notification bell + right drawer — no notification backend
- Full audit log / transactions report — needs schema design

---

## 6. Suggested implementation order

1. **Slice A** — primitives (unblocks B–F)
2. **Slice B + C** — dashboard feels “complete” without new routes
3. **Slice F** — runtime grouping + dashboard embed
4. **Slice D** — table consistency on users + bug reports
5. **Slice E** — nav polish + pending badges

---

## 7. Verification

```bash
# Public doc safety (expect no hits except policy exceptions)
rg -i 'jjheffernan|heff-industries|commerce\.animalgarage|cdn\.animalgarage|sk_live|eyJ[A-Za-z0-9_-]+\.' docs/plans/active/admin-dashboard-inspiration.md

npm run lint
npm run test:unit
```

Manual: sign in as staff → `/admin/dashboard` → confirm KPI links, activity table, runtime strip; resize to mobile drawer.

---

_Last updated: 2026-06-30_
