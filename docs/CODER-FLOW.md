# Coder flow — start here

Single path for day-to-day development. Avoid duplicating status across trackers.

---

## 1. What to work on

| Question                                | Doc                                                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------ |
| Any in-repo code left?                  | [STATUS.md](./STATUS.md) § Open                                                            |
| Blocked on Netlify / Saleor / Supabase? | [BLOCKERS.md](./BLOCKERS.md)                                                               |
| Feature scaffold / prod setup for IP-*? | [plans/active/inspiration-polish-tracker.md](./plans/active/inspiration-polish-tracker.md) |
| Launch phases / mock vs live gaps?      | [plans/active/market-readiness.md](./plans/active/market-readiness.md)                     |
| Media uploads apply on Supabase?        | [plans/active/media-uploads.md](./plans/active/media-uploads.md)                           |

---

## 2. How to build

| Task                        | Doc                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Local setup + conventions   | [style-guide/quick-start.md](./style-guide/quick-start.md)                                                         |
| Svelte patterns             | [style-guide/frontend/svelte-patterns.md](./style-guide/frontend/svelte-patterns.md)                               |
| Server vs client boundaries | [style-guide/business-logic/server-client-boundaries.md](./style-guide/business-logic/server-client-boundaries.md) |
| Mock → Saleor swap points   | [style-guide/business-logic/mock-to-saleor.md](./style-guide/business-logic/mock-to-saleor.md)                     |
| Env vars                    | [style-guide/business-logic/env-config.md](./style-guide/business-logic/env-config.md) · `.env.example`            |
| Styling (zinc/red Tailwind) | [style-guide/frontend/how-to-change-styling.md](./style-guide/frontend/how-to-change-styling.md)                   |
| Agent skills                | [agents/AGENTS.md](../agents/AGENTS.md) · `scripts/link-agent-skills.sh`                                           |

Markers in code: `@inspiration-scaffold` · `@saleor-migration` — [meta/decisions.md](./meta/decisions.md)

---

## 3. Verify before PR

```bash
npm run lint
npm run check
npm run test:unit
npm run test:contracts
npm run test:readiness    # needs .env
bash scripts/check-secrets.sh
npx playwright test e2e/smoke.spec.ts   # optional; see testing/e2e-policy.md
```

---

## 4. Deploy & ops

| Task                         | Doc                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------ |
| Production checklist         | [infrastructure/deployment.md](./infrastructure/deployment.md)                 |
| LGTM logs / metrics / traces | [infrastructure/observability-lgtm.md](./infrastructure/observability-lgtm.md) |
| External API readiness       | [testing/external-dependencies.md](./testing/external-dependencies.md)         |

---

## 5. Integration reference (not trackers)

| Area            | Doc                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------- |
| Saleor          | [commerce/saleor.md](./commerce/saleor.md) · [audits/saleor-audit.md](./audits/saleor-audit.md) |
| Ghost           | [content/ghost.md](./content/ghost.md) · [audits/ghost-audit.md](./audits/ghost-audit.md)       |
| Auth / OAuth    | [auth/oauth.md](./auth/oauth.md)                                                                |
| Supabase schema | [infrastructure/supabase-schema.md](./infrastructure/supabase-schema.md)                        |

---

## Archived trackers (do not update)

Completed batch plans, swarm inventories, and audit remediation tables moved to [archive/](./archive/). Use git history if you need a closed `AUD-*` or `IP-*` row.
