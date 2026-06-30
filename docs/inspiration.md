# Feature Backlog — Industry Patterns Not Yet Integrated

Living backlog of capabilities identified during Phase 2 research. Items marked **Done** ship in the prototype; everything else is queued for Phase 3+.

No external site names — this doc is the canonical reference for what remains.

---

## Integrated in Phase 2 (Done)

| Capability | Status | Location |
|------------|--------|----------|
| Merch catalog + category tabs | Done | `/shop`, `mock/products.ts` |
| Parts catalog + category nav | Done | `/parts`, `mock/parts.ts` |
| YMM vehicle selector | Done | `VehicleSelector.svelte`, homepage |
| Shop by popular model | Done | `ModelPicker.svelte` |
| Build thread gallery + detail | Done | `/builds`, `/builds/[slug]` |
| Guides + blog | Done | `/guides`, `/blog` |
| Brand lanes | Done | `/brands` |
| Pit Lane Deals (never empty) | Done | `/deals` |
| Gift cards | Done | `/gift-cards` |
| Garage Squad loyalty UI | Done | `/loyalty` |
| Video hub (basic) | Done | `/watch` |
| UGC wall | Done | `UGCWall.svelte`, `/media` |
| Promo bar + countdown | Done | `PromoBar.svelte`, `CountdownTimer.svelte` |
| Mega-menu (shop + parts) | Done | `MegaMenu.svelte` |
| Cart drawer + search modal | Done | `CartDrawer.svelte`, `SearchModal.svelte` |
| Trust blocks | Done | `TrustBlocks.svelte` |
| Tire + fitment calculators | Done | `/tools/*` |
| International locale selector | Done | `LocaleSelector.svelte` |
| Policy page stubs | Done | `/policies/*` |

---

## Phase 3 — Bug Fixes & UX Polish (In Progress)

See [phase3-plan.md](./phase3-plan.md).

| Issue | Priority |
|-------|----------|
| Parts nav button non-functional (hover-only) | P0 |
| Shop nav button non-functional | P0 |
| Search modal not opening | P0 |
| Cart drawer duplicate / not opening | P0 |
| Promo bar dismiss not working | P0 |
| Build thread detail blank page | P0 |
| Double footer / duplicate newsletter on homepage | P1 |
| Support + program pages are stubs | P1 |
| Watch lacks video detail panel + shoppable products | P1 |
| No sign-in / account routes | P1 → **Done (Phase 3 D)** |
| No admin CDN / RBAC panel | P2 → **Done (Phase 3 D)** |
| No YouTube channel auto-sync | P2 |

---

## Not Yet Built — Commerce (Saleor)

| Capability | Notes |
|------------|-------|
| Live Saleor product catalog | Replace all mock loaders |
| Real cart + checkout mutations | Stripe via Saleor |
| Saleor gift card checkout | Wire `/gift-cards` |
| Multi-channel international pricing | Map locale → Saleor channel |
| Shipping zones + threshold promos | Free ship >$X from admin config |
| Variant matrix UI (`+ N more` colors) | PDP enhancement |
| Notify-me restocks → Supabase | Wire `NotifyMeButton` |
| Collection-based shop filters | `?collection=` param handling |
| Unified merch + parts checkout | Single Saleor cart |
| Financing (Affirm/Katapult) | High AOV parts |
| Price match guarantee workflow | Support ticket + refund |

---

## Not Yet Built — Media & CDN

| Capability | Notes |
|------------|-------|
| S3 + CloudFront media URLs | Replace picsum placeholders |
| Admin media upload UI | **Done (placeholder)** — `/admin/media` |
| Campaign hero from CMS | Supabase `featured_sections` |
| Product gallery srcset helpers | Per `animation-media.md` |
| On-domain shoppable video | Timestamp → product hotlinks |
| Video detail drawer with product showcase | `/watch` enhancement |
| **YouTube channel auto-sync** | Admin hooks channels → auto-post videos |
| UGC submission + moderation | Supabase queue |
| Instagram/social ingest | Optional Phase 4 |

---

## Not Yet Built — Community & Auth

| Capability | Notes |
|------------|-------|
| Supabase auth (magic link + OAuth) | Wired at `/auth/*` — live with keys; mock `ag-session` without. Local quick-login on localhost (`docs/supabase.md`) |
| User account dashboard | **Done** — `/account` (profile, XP, vehicles, orders placeholder) |
| Build thread submit → Supabase | `/builds/submit` backend |
| Build of the Month voting | Gamification |
| Garage XP wired to real actions | `garage-xp.svelte.ts` → Supabase |
| User vehicle garage (saved YMM) | Persist beyond localStorage |
| Newsletter → Supabase | `newsletter_signups` table |
| Discord support integration | Footer CTA only (no popup) |

---

## Not Yet Built — Admin & RBAC

### Built in Phase 3 (Workstream D)

| Capability | Status | Location |
|------------|--------|----------|
| Admin panel shell | Done | `/admin` layout + sidebar nav |
| User management (create, roles) | Done (mock) | `/admin/users` |
| CDN asset browser + upload UI | Done (placeholder) | `/admin/media` |
| RBAC role definitions | Done | `src/lib/auth/roles.ts`, `hooks.server.ts` |
| Session guard (dev mock) | Done | `ag-session` cookie, `DEV_ADMIN=true` |

### Roles

| Role | Admin access | Capabilities |
|------|--------------|--------------|
| `admin` | Yes | Full site — users, media, CMS, settings |
| `editor` | Yes | Content and media — no user admin |
| `contributor` | No | Submit builds/UGC — moderation queue only |
| `customer` | No | Shop, account, garage |

Admin routes require `editor` or `admin` role, or `DEV_ADMIN=true` in server env for local development.

### Still queued

| Capability | Notes |
|------------|-------|
| Supabase-backed user CRUD | Replace mock table in `/admin/users` |
| Real CDN upload (S3 presigned) | Wire `/admin/media` upload to S3 + CloudFront invalidation |
| Site banners / promo CMS | Replace mock/banners |
| Featured sections editor | Homepage CMS |
| YouTube channel manager | Channel ID → sync cron (Workstream B) |
| Build moderation queue | Approve/reject submissions |
| Deal / campaign scheduler | Pit Lane Deals CMS |

---

## Not Yet Built — Discovery & Scale

| Capability | Notes |
|------------|-------|
| Faceted parts search | Saleor attributes (exhaust type, CARB, etc.) |
| Full YMM fitment filtering on PLPs | Saleor metadata |
| 100k+ SKU catalog | PIM integration |
| Shop-by-vehicle deep links | Model → collection mapping |
| Sponsored / featured product slots | Admin configurable |
| Recently viewed (server-side) | Account sync |
| Open box / rebate channels | Deal types |
| Military / first responder verification | Third-party ID service |
| Wholesale application workflow | Form → Supabase → email |
| Events RSVP + ticketing | Optional |

---

## Not Yet Built — Motion & Delight

| Capability | Notes |
|------------|-------|
| `@motionone/svelte` scroll system | Per `animation-media.md` |
| SvelteKit view transitions | Shop ↔ PDP ↔ media |
| Cart add micro-animation | Bounce + toast |
| Drop countdown on hero | Wire campaign CMS |
| Scratch-off post-purchase promos | Saleor voucher |
| Burnout Board leaderboard | Referral gamification |
| Sticker pack loyalty rewards | Low-cost perks |
| Personality empty states | Branded copy everywhere |

---

## Anti-Patterns to Avoid

- No sales chat popup on page load
- No empty promo/deals modals — always fallback content
- No split merch/parts checkout domains
- No competitor references in public docs or commit messages

---

*Last updated: June 2026*
