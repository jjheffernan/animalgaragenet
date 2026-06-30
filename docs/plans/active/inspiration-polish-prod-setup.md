# Inspiration polish — production setup

**Status:** Ops checklist (blocked on Netlify / Supabase / Saleor credentials)  
**Related:** [inspiration-polish-coordination.md](./inspiration-polish-coordination.md), [archive/polish-plan.md](../../archive/polish-plan.md)

Public-safe — no secrets.

---

## Phase 0 — Account & auth (IP-001)

| Variable | Required |
| -------- | -------- |
| `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `PUBLIC_SITE_URL` | Yes |

**Do not set:** `DEV_ADMIN`, `LOCAL_DEV_AUTH`

1. Supabase redirect URLs: preview, production, `http://localhost:5173/auth/callback`
2. `npx tsx --env-file=.env scripts/promote-admin.ts user@email.com admin`
3. `npm run test:readiness` → `supabase-auth`, `supabase-db`

---

## Phase 1 — Live Saleor catalog (IP-002)

| Variable | Required |
| -------- | -------- |
| `PUBLIC_SALEOR_API_URL`, `SALEOR_CHANNEL` | Yes |

Verify: `saleor-catalog` probe; `/shop` ≠ 120 mock products.

---

## Phase 1b — Media uploads (IP-016)

Apply `supabase/migrations/20250630120000_media_assets.sql`; test review photo on `/loyalty`.

---

## Phase 2 — Checkout & payment (IP-003)

Blocked on Saleor Payment App. Uncomment `@saleor-migration` in `checkout.ts`; wire `routes/checkout/payment/+server.ts`. See [saleor-payments.md](../../commerce/saleor-payments.md).

---

## Phase 3 — Content (IP-007, IP-015)

| Service | Env vars |
| ------- | -------- |
| Ghost | `GHOST_URL`, `GHOST_CONTENT_API_KEY` |
| YouTube | `YOUTUBE_API_KEY`, `YOUTUBE_SYNC_SECRET` |

---

## Phase 4 — CDN deferred (IP-013)

`PUBLIC_CDN_BASE_URL`, `S3_*`, `AWS_*` — v1 uses Supabase Storage; stubs in `media/cdn.ts`.

---

## CI hygiene (IP-019)

```bash
bash scripts/check-secrets.sh
npm run format
npm run lint
npm run test:unit
```

_Last updated: June 30, 2026_
