---
name: external-api-readiness
description: Live and config readiness checks for all external APIs (Supabase, Saleor, Ghost, OAuth, YouTube). Updates docs/testing/external-dependencies.md and docs/testing/readiness-report.md.
---

## When invoked

1. Read `docs/testing/external-dependencies.md`.
2. Check `.env` / `.env.example` for required vars.
3. Run `npm run test:readiness` if present; otherwise create it.
4. Probe each service (read-only) when credentials exist; skip gracefully when unset.
5. Write `docs/testing/readiness-report.md` with pass/fail/skip per dependency.
6. Update [inspiration-polish-coordination.md](../../docs/plans/active/inspiration-polish-coordination.md) from failures.
7. Do not commit unless asked.

## Probes (safe, read-only)

| ID              | Probe                                                                      |
| --------------- | -------------------------------------------------------------------------- |
| supabase-auth   | `GET /auth/v1/health` or list users count via service role (no writes)     |
| supabase-db     | `select 1` on `testimonials` limit 0 via admin client                      |
| saleor-catalog  | GraphQL `{ shop { name } }` or products first:1                            |
| saleor-checkout | checkoutCreate empty lines (optional — may create junk; prefer query only) |
| ghost-cms       | GET `/ghost/api/content/posts/?limit=1`                                    |
| youtube-sync    | channels list with API key                                                 |

Output gaps as actionable todos for implementation agents.
