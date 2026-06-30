# Ponytail audit tracker

**Created:** 2026-06-30  
**Branch:** `dev`  
**Policy:** [SECURITY-PUBLIC.md](../../SECURITY-PUBLIC.md) — no infra hostnames or secrets in this doc.

Server-side LOC / dedupe / guard tightening. **No** copy, layout, CSS, or visual `.svelte` markup changes.

**Related:** [AUDIT-REMEDIATION.md](../AUDIT-REMEDIATION.md) — AUD-P0-009 (catalog fallback gate), AUD-P1-009 (Ghost fallback gate)

---

## Summary

| Batch | Items | Focus | Status |
| ----- | ----- | ----- | ------ |
| **P1** | 2 | Shared mock-fallback guard; dead validation aliases | **done** |
| **P2** | 3 | API POST boilerplate; admin upload validation; store localStorage | **done** |
| **P3** | 3 | Oversized checkout module; catalog try/catch repetition; form stub dead paths | **done** — PT-P3-001 YAGNI-deferred |

---

## Batch P1 — smallest high-impact (≤200 LOC)

| Batch | ID | File(s) | Issue | Ponytail fix | LOC est | Status |
| ----- | -- | ------- | ----- | ------------ | ------- | ------ |
| P1 | PT-P1-001 | `catalog/fallback.ts`, `ghost/fallback.ts` | Identical production mock-fallback guard (AUD-P0-009 / AUD-P1-009) | Extract `guardProductionMockFallback` in `mock-fallback-guard.ts`; thin domain wrappers | −25 | **done** |
| P1 | PT-P1-002 | `validation/limits.ts`, `limits.test.ts` | `clampText` duplicates `trimToMax`; unused `FIELD_LIMITS` alias | Delete aliases; test `trimToMax` only | −8 | **done** |

---

## Batch P2 — API + client-store dedupe

| Batch | ID | File(s) | Issue | Ponytail fix | LOC est | Status |
| ----- | -- | ------- | ----- | ------------ | ------- | ------ |
| P2 | PT-P2-001 | `routes/api/newsletter/subscribe`, `restock/notify`, `support/bug-report` | Repeated rate-limit + JSON parse + 429/400 responses | Shared `parseRateLimitedJsonPost` helper (existing `checkRateLimit` pattern) | −30 | **done** |
| P2 | PT-P2-002 | `routes/api/admin/media/upload-slot`, `media/validation.ts` | Admin route re-implements mime/size checks already in `validateUploadRequest` | Reuse `isAllowedImageMime` + `validateUploadRequest` | −15 | **done** |
| P2 | PT-P2-003 | `stores/garage.svelte.ts`, `garage-xp.svelte.ts`, `recently-viewed.svelte.ts`, `cart.svelte.ts`, `locale.svelte.ts` | Copy-paste localStorage load/save/clear; cart mock subtotal + Saleor fetch dupes | `storage.ts` helpers; `mockItemsRawSubtotal` + `mutateCheckout`; locale uses `current.currency` | −35 | **done** |

---

## Batch P3 — larger refactors (defer)

| Batch | ID | File(s) | Issue | Ponytail fix | LOC est | Status |
| ----- | -- | ------- | ----- | ------------ | ------- | ------ |
| P3 | PT-P3-001 | `saleor/checkout.ts` (624 LOC) | Monolithic checkout module | **YAGNI — ponytail:** single caller graph; keep monolith until queries vs mutations import sites diverge | 0 | **deferred** |
| P3 | PT-P3-002 | `catalog/parts.ts`, `products.ts`, `collections.ts` | Repeated `isSaleorEnabled` try/catch + `guardMockCatalogFallback` blocks | Inner `withSaleorCatalog` helper wrapping fetch fn | −40 | **done** |
| P3 | PT-P3-003 | `forms/submit.ts` | `submitFormStub` generic path always mock-success; dead `createAdminClient` branch | Remove unreachable generic insert stub or wire one table | −10 | **done** |

---

## Audit notes (Phase 1 scan)

- **Catalog / Saleor:** Fallback guard used in 8 modules (`products`, `parts`, `search`, `collections`, `related`, `shop-filters`, `parts-filters`, `shop-collection`). Pattern is consistent; consolidation belongs in P3.
- **Ghost:** `guide-filters.ts` and `posts.ts` use `guardMockGhostFallback`; no duplicate fetch logic beyond fallback gate.
- **API routes:** 16 handlers; public POST endpoints share rate-limit + JSON parse (P2). Filter GET routes are already thin wrappers.
- **Stores:** Guest localStorage persistence duplicated across 4 stores (P2); session sync logic stays per-store.
- **Security:** No new trust-boundary changes in P1; existing production gates preserved via shared guard.
- **Ponytail (PT-P3-001):** YAGNI — `checkout.ts` has one caller graph today; speculative split adds files without a second consumer. Revisit when queries or mutations are imported independently elsewhere.
