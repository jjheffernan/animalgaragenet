> **Status: Archived** — June 2026 H1 shipped work log. For open items see [STATUS.md](../STATUS.md) and [BLOCKERS.md](../BLOCKERS.md).

# Changelog — 2026 H1 (dev branch)

Condensed evidence for work completed before doc consolidation. Commit hashes refer to local `dev` (not necessarily pushed).

## Platform & auth

- Production hostname guards, `ag-session` refusal, sign-in misconfig banner
- OAuth/magic-link callback from request origin (`callback-url.ts`)
- Account menu, local dev auth, `/auth/*`, social connections (IP-027)
- `promote-admin.ts`, `SITE_LOCKED`, `/locked`

## Commerce (Saleor)

- Catalog loaders env-gated; mock fallback guard on production
- Shop filters, collections, faceted search, related products, channels (IP-023)
- Cart line qty/remove, listing quick-add, redeem/promo
- Checkout shipping + payment proxies + Stripe Elements (ops: Payment App)
- Restock alerts + stock webhook handler (IP-004)
- Shipping promo thresholds (IP-024), Pit Lane deals scheduler (IP-030)
- Order mirror webhook (IP-012)

## Content & community

- Ghost guide filters, cache headers, SEO/OG on detail pages
- YouTube sync + watch hub DB preference
- Builds from `build_submissions`, bug report form (IP-031)
- UGC testimonials, review photo uploads (MEDIA-P2), `/media` wall
- Newsletter + user preferences schema (AUD-P2-023)

## Admin & staff

- `/admin/dashboard`, runtime integrations panel, featured CMS, users, bug inbox
- Zinc/red admin shell (unified with storefront — no daisyUI)
- CDN upload + invalidation allowlist (AUD-SEC-001)

## Quality & ops code

- Ponytail dedupe (mock-fallback guard, API POST helper, store storage, `withSaleorCatalog`)
- LGTM structured logs + `/api/health/metrics`
- `sitemap.xml`, dynamic `robots.txt`, extended smoke e2e (SEO-001–003)
- Build submission honeypot + rate limit (MR-SEC-001)
- Analytics consent hook (AUD-P2-012)
- Agent skill symlinks (AUD-P2-020), daisyUI skill removed (AUD-P2-021)
- Migration squash 17→3, readiness CI, 180+ unit tests

## Archived detail trackers

| Doc                                                                                                                          | Contents                 |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| [audit-remediation-2026-06.md](./audit-remediation-2026-06.md)                                                               | Full AUD-P* table        |
| [active-swarm-execution.md](./active-swarm-execution.md)                                                                     | Swarm batch inventory    |
| [ponytail-audit-tracker.md](./ponytail-audit-tracker.md)                                                                     | LOC dedupe batches       |
| [next-steps-tracker.md](./next-steps-tracker.md)                                                                             | Pre-consolidation queue  |
| [batch-2026-07-01.md](./batch-2026-07-01.md) · [02](./batch-2026-07-02.md) · [03-followups](./batch-2026-07-03-followups.md) | July implementer batches |
