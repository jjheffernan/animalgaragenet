---
name: polish-sweep
description: Session polish agent for Animal Garage. Crawls chat context, git working tree, and codebase for unfinished edits from prior agent work; produces and executes a focused polishing plan.
---

You close the gap between **intended work** and **landed code** after multi-agent sessions.

## When invoked

1. **Git state** — `git status`, `git diff`, untracked files under `src/`, `.cursor/agents/`, `docs/`, `scripts/`.
2. **Chat context** — user messages + agent summaries in the current thread; note promised but missing deliverables.
3. **Code signals** — grep for `TODO`, `prototype`, `Awaiting Saleor`, `wire when`, empty stubs, untracked agent outputs.
4. **Prior agent specs** — read `.cursor/agents/*.md` and check if implementation exists.
5. **Scaffold markers** — never delete commented blocks tagged `@inspiration-scaffold`, `@migration`, or `@saleor-migration`. These are intentional migration hooks; see [inspiration-polish-tracker.md](../../docs/plans/active/inspiration-polish-tracker.md) and [decisions.md](../../docs/meta/decisions.md#migration-scaffolds-inspiration-scaffold--migration).

## Known stragglers to check (refresh each run)

| Area                | Expected                                                   | Check                                                       |
| ------------------- | ---------------------------------------------------------- | ----------------------------------------------------------- |
| Local dev auth      | `local-dev.ts`, sign-in dev buttons                        | Untracked? wired?                                           |
| Account dropdown    | `src/lib/components/navigation/AccountMenu.svelte`, Header | Plain link still?                                           |
| Production admin    | `promote-admin.ts`, `SITE_LOCKED`, `/locked`               | Missing?                                                    |
| Media uploads       | `docs/plans/active/media-uploads.md`                       | Exists?                                                     |
| Org sync            | deploy-key mirror on `main`                                | CI prettier blocking auto-sync?                             |
| Saleor redeem       | `/account/redeem`                                          | Not started?                                                |
| Prettier CI         | formatting drift blocking CI                               | Resolved — commit `63eb20a`; run `npm run lint` before push |
| Migration scaffolds | `@inspiration-scaffold` / `@saleor-migration` blocks       | Do not delete — inspiration-polish-tracker                  |

## Polishing plan output

```markdown
# Polish plan — {date}

## P0 — Broken / user-reported (do first)

## P1 — Started but uncommitted

## P2 — Documented but not implemented

## P3 — Nice-to-have

## Execution order (max 5 items this session)
```

## Execution rules

- Ponytail: smallest diffs; finish started work before new features.
- Do not touch root `README.md` unless asked.
- Run `npm run check` + **unit tests for touched modules only** after edits.
- Commit only when user asks.
- **Scaffold markers:** Do not remove `@inspiration-scaffold` (`#IP-###` in tracker) or `@saleor-migration` unless implementing that row or Saleor step.

## E2E scope policy

Polish-sweep is **not** an e2e task. Do not run Playwright, start preview, or refresh manual pass docs.

| Do                                                  | Don't                                                |
| --------------------------------------------------- | ---------------------------------------------------- |
| `npm run test:unit -- <path>` for files you changed | `npm run test:e2e` or full Playwright suite          |
| `npm run check` after edits                         | `vite preview` / Playwright webServer                |
| —                                                   | Create or update `docs/testing/e2e-manual-pass-*.md` |

Playwright is allowed only when the user **explicitly** asks for e2e, or you run **one spec** for the area changed (e.g. `npx playwright test e2e/account.spec.ts`). Manual pass docs are owned by a **dedicated e2e worker** on explicit e2e tasks — see [e2e-policy.md](../../docs/testing/e2e-policy.md) and [AGENTS.md](../../agents/AGENTS.md#e2e-scope-policy).

## Output

- Polish plan markdown (in reply only — archived plan: `docs/archive/polish-plan.md`; open work: `docs/plans/active/inspiration-polish-tracker.md`)
- List of files changed if you implement P0/P1 items

Do not commit unless asked.
