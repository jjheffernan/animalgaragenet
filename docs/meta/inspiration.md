# Feature Backlog — Industry Patterns Not Yet Integrated

Living backlog of capabilities identified during Phase 2 research. Items marked **Done** ship in the prototype.

**Open work:** [inspiration-polish-coordination.md](../plans/active/inspiration-polish-coordination.md) — canonical tracker with scaffold paths and prod setup.

No external site names — this doc is the canonical reference for what was researched.

---

## Integrated in Phase 2 (Done)

| Capability                    | Status | Location                                   |
| ----------------------------- | ------ | ------------------------------------------ |
| Merch catalog + category tabs | Done   | `/shop`, `mock/products.ts`                |
| Parts catalog + category nav  | Done   | `/parts`, `mock/parts.ts`                  |
| YMM vehicle selector          | Done   | `VehicleSelector.svelte`, homepage         |
| Shop by popular model         | Done   | `ModelPicker.svelte`                       |
| Build thread gallery + detail | Done   | `/builds`, `/builds/[slug]`                |
| Guides + blog                 | Done   | `/guides`, `/blog`                         |
| Brand lanes                   | Done   | `/brands`                                  |
| Pit Lane Deals (never empty)  | Done   | `/deals`                                   |
| Gift cards                    | Done   | `/gift-cards`                              |
| Garage Squad loyalty UI       | Done   | `/loyalty`                                 |
| Video hub (basic)             | Done   | `/watch`                                   |
| UGC wall                      | Done   | `UGCWall.svelte`, `/media`                 |
| Promo bar + countdown         | Done   | `PromoBar.svelte`, `CountdownTimer.svelte` |
| Mega-menu (shop + parts)      | Done   | `MegaMenu.svelte`                          |
| Cart drawer + search modal    | Done   | `CartDrawer.svelte`, `SearchModal.svelte`  |
| Trust blocks                  | Done   | `TrustBlocks.svelte`                       |
| Tire + fitment calculators    | Done   | `/tools/*`                                 |
| International locale selector | Done   | `LocaleSelector.svelte`                    |
| Policy page stubs             | Done   | `/policies/*`                              |

---

## Phase 3 — Bug Fixes & UX Polish (Done)

See [archive/phase3-plan.md](../archive/phase3-plan.md) — workstreams A–D complete (June 2026).

Key fixes: nav buttons, search/cart drawers, promo dismiss, build detail, watch detail panel, sign-in/account routes, admin shell, review photo uploads (Phase 1).

---

## Remaining work (summary)

Full rows, scaffolds, and prod steps live in the [tracker](../plans/active/inspiration-polish-coordination.md). High-level buckets:

| Area        | Examples still open                                      |
| ----------- | -------------------------------------------------------- |
| Commerce    | Live Saleor catalog, checkout/payment, gift card checkout |
| Media & CDN | `featured_sections` CMS, S3/CloudFront Phase 2, YouTube sync |
| Community   | XP + vehicles in Supabase, build moderation, newsletter  |
| Admin       | Real CDN upload, featured sections editor, deal scheduler |
| Discovery   | Faceted parts search, YMM fitment on PLPs, 100k SKU PIM  |
| Motion      | Motion One, view transitions, cart micro-animations      |

Saleor migration swap points use `@saleor-migration` in code (not listed here). New feature scaffolds use `@inspiration-scaffold` — see [decisions.md](./decisions.md#agent-scaffold-markers).

---

## Anti-Patterns to Avoid

- No sales chat popup on page load
- No empty promo/deals modals — always fallback content
- No split merch/parts checkout domains
- No competitor references in public docs or commit messages

---

_Last updated: June 30, 2026 — consolidated into inspiration-polish-coordination_
