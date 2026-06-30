---
name: saleor-redeem
description: Saleor voucher, promo code, and gift-card redemption UX for Animal Garage. Use when building redeem sections, applying checkout promo codes, or wiring Saleor-generated codes.
---

You own the **redeem** experience — entering codes generated in Saleor admin.

## Product goals

1. **Account redeem section** — `/account/redeem` (or loyalty sub-section) where signed-in users enter codes.
2. **Checkout promo** — apply/remove voucher on `/cart` and `/checkout` when Saleor checkout is active.
3. **Gift card balance** — display applied gift card credit when Saleor returns it on checkout.

## Saleor API (GraphQL)

When `isSaleorEnabled()`:

| Operation | Mutation / query | Notes |
|-----------|------------------|-------|
| Apply code | `checkoutAddPromoCode(checkoutId, promoCode)` | Voucher or gift card code |
| Remove code | `checkoutRemovePromoCode(checkoutId, promoCodeId)` | |
| Read applied | `checkout { discount { ... } giftCards { ... } }` | Extend `CHECKOUT_GET` |

Add mutations to `src/lib/server/saleor/checkout-queries.ts` and handlers in `checkout.ts`.

## UX

- **Account `/account/redeem`**: form with code input, success/error messages, link to cart if code applied to active checkout cookie (`ag-checkout-id`).
- **Cart drawer / checkout**: compact "Have a code?" collapse; reuse same server action.
- **Mock fallback**: when Saleor unset, validate against `src/lib/data/mock/promo-codes.ts` (dev only) or show "connect Saleor" message.
- Add nav link in account sidebar + account header dropdown.

## Validation

- Trim + uppercase codes; max length 64
- Rate-limit apply attempts server-side (simple in-memory or Supabase row — ponytail: defer until abuse seen)

## Files to touch

| Path | Role |
|------|------|
| `src/routes/account/redeem/+page.svelte` | Redeem UI |
| `src/routes/account/redeem/+page.server.ts` | `applyCode` action |
| `src/lib/server/saleor/checkout-queries.ts` | Promo mutations |
| `src/lib/server/saleor/checkout.ts` | `applyPromoCode`, `removePromoCode` |
| `src/routes/cart/checkout/+server.ts` or new `/api/checkout/promo` | API for cart |
| `src/lib/components/cart/CartDrawer.svelte` | Inline code entry |
| `docs/commerce/saleor.md` | Redeem section |

## Style

- Zinc/red Tailwind only (no daisyUI); match `ListControls` / account forms.
- Svelte MCP `svelte-autofixer` on new components.

## Output

- User flow: enter code → applied to checkout or stored for next cart
- Mock vs live behavior table

Do not commit unless asked.
