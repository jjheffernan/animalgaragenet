# Project status

**Last updated:** 2026-06-30  
**Coder entry point:** [CODER-FLOW.md](./CODER-FLOW.md)  
**Ops blockers (canonical):** [BLOCKERS.md](./BLOCKERS.md)  
**Public doc policy:** [SECURITY-PUBLIC.md](./SECURITY-PUBLIC.md)

---

## Open — in-repo code

| ID     | Item                 | Notes                                                                                                                             |
| ------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| IP-029 | Scroll motion system | `AnimatedReveal` + IO baseline shipped; full `@motionone/svelte` deferred — [animations.md](./style-guide/frontend/animations.md) |

_No other unblocked code rows._ Everything else is **ops-blocked** ([BLOCKERS.md](./BLOCKERS.md)) or **done** ([archive/changelog-2026-H1.md](./archive/changelog-2026-H1.md)).

---

## Partial — code done, ops gate

| ID                  | Item                       | Ops action                                                                                                 |
| ------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| AUD-P1-001 / IP-003 | Checkout + Stripe Elements | Enable Stripe Payment App on Saleor channel — [commerce/saleor-payments.md](./commerce/saleor-payments.md) |
| media-uploads       | UGC API + admin media      | `supabase db push` + bucket `ugc` — [plans/active/media-uploads.md](./plans/active/media-uploads.md)       |

---

## Ops summary

**19 blockers** — full list and launch order: [BLOCKERS.md](./BLOCKERS.md)  
**Runbook:** [infrastructure/deployment.md](./infrastructure/deployment.md)

---

## Shipped (summary)

Major June–July 2026 delivery: auth guards, Saleor catalog/checkout scaffold, admin dashboard, LGTM hooks, ponytail dedupe, SEO sitemap, security hardening, inspiration IP-* features, migration squash.

**Full evidence table:** [archive/changelog-2026-H1.md](./archive/changelog-2026-H1.md)

---

## Verify

```bash
npm run test:unit
npm run test:contracts
npm run test:readiness
bash scripts/check-secrets.sh
```
