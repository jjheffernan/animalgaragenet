# Inspiration + polish coordination

**Status:** Active  
**Created:** 2026-06-30  
**Policy:** [SECURITY-PUBLIC.md](../../SECURITY-PUBLIC.md)

Canonical coordination for [inspiration.md](../../meta/inspiration.md), archived [polish-plan.md](../../archive/polish-plan.md), and [AUDIT-REMEDIATION.md](../AUDIT-REMEDIATION.md). **Do not** add `inspiration-polish-tracker.md` or `inspiration-implementation-tracker.md`.

**Ops:** [inspiration-polish-prod-setup.md](./inspiration-polish-prod-setup.md) · **Markers:** [decisions.md](../../meta/decisions.md#migration-scaffolds-inspiration-scaffold--migration)

---

## Coordination table

| Item | Owner / worker area | Scaffold file | Migration marker | AUDIT ID |
| ---- | ------------------- | ------------- | ---------------- | -------- |
| IP-001 Supabase auth on Netlify | auth / ops | — | — | AUD-P0-001–003 |
| IP-002 Live Saleor catalog | saleor / ops | `src/lib/server/catalog/*.ts` | `@saleor-migration` | AUD-P0-004 |
| IP-003 Checkout + payment | saleor | `checkout.ts`, `checkout-queries.ts`, `routes/checkout/payment/+server.ts` | `@saleor-migration` | AUD-P1-001 |
| IP-004 Notify-me restocks | supabase | `restock/repository.ts`, `api/restock/notify/+server.ts` | `@inspiration-scaffold` | — |
| IP-005 Collection shop filters | saleor | `catalog/shop-collection.ts` | `@inspiration-scaffold` | AUD-P2-001 |
| IP-006 Homepage / campaign CMS | supabase | `featured-sections/repository.ts`, `admin/featured/` | `@inspiration-scaffold` | — |
| IP-007 YouTube channel sync | code | `youtube/sync.ts`, `youtube/repository.ts`, `api/cron/youtube-sync/` | `@inspiration-scaffold` | AUD-P1-005 |
| IP-008 Newsletter signup | supabase | `newsletter/repository.ts`, `api/newsletter/subscribe/` | `@inspiration-scaffold` | AUD-P2-023 |
| IP-009 Garage XP → Supabase | supabase | `user-preferences/repository.ts`, `loyalty/xp-repository.ts` | `@inspiration-scaffold` | — |
| IP-010 Saved vehicle garage | supabase | `garage/vehicles-repository.ts`, `api/account/garage/` | `@inspiration-scaffold` | — |
| IP-011 Wholesale workflow | supabase | `wholesale/repository.ts`, `/wholesale` | `@inspiration-scaffold` | — |
| IP-012 Account order history | saleor / supabase | `orders/snapshots.ts`, `account/orders/` | `@inspiration-scaffold` | — |
| IP-013 CDN S3 + CloudFront (deferred) | media-uploads | `media/cdn.ts` | `@inspiration-scaffold`, `@migration` | — |
| IP-014 Watch hub from DB videos | code | `routes/watch/+page.server.ts`, `watch/[id]/` | `@inspiration-scaffold` | — |
| IP-015 Ghost blog + guides | code / ops | `ghost/posts.ts` | `@inspiration-scaffold` | AUD-P1-008, AUD-P1-009 |
| IP-016 Review photo uploads | supabase | `media/repository.ts`, `ReviewPhotoUpload.svelte` | — (wired) | AUD-P1-004 |
| IP-017 Production auth guards | auth | `local-dev.ts`, `hooks.server.ts`, `AccountMenu.svelte` | — (wired) | AUD-P0-007–008 |
| IP-018 Saleor redeem + promo | saleor | `account/redeem/`, `checkout/promo.ts` | — (wired) | AUD-P1-011 |
| IP-019 CI Prettier drift | code / polish-sweep | `.github/workflows/` | — | AUD-P0-006 |
| IP-020 Build submissions public | supabase | `routes/builds/+page.server.ts` | — | AUD-P1-006 |
| IP-021 UGC testimonials | supabase | `testimonials/repository.ts`, `/admin/testimonials` | — (wired) | AUD-P1-010 |
| IP-022 Featured sections editor | supabase | `/admin/featured` | `@inspiration-scaffold` | — |
| IP-023 Multi-channel pricing | saleor | `saleor/channels.ts` | `@saleor-migration` | — |
| Saleor webhooks | saleor | `api/webhooks/saleor/+server.ts` | `@saleor-migration` | — |

---

## Verification

```bash
npm run test:unit
npm run test:readiness
bash scripts/check-secrets.sh
```

_Last updated: June 30, 2026_
