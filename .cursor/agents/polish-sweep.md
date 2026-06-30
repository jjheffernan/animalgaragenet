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
5. **Scaffold markers** — never delete commented blocks tagged `@inspiration-scaffold`, `@migration`, or `@saleor-migration`. These are intentional migration hooks; see [inspiration-polish-coordination.md](../../docs/plans/active/inspiration-polish-coordination.md) and [decisions.md](../../docs/meta/decisions.md#migration-scaffolds-inspiration-scaffold--migration).

## Known stragglers to check (refresh each run)

| Area             | Expected                                                   | Check                           |
| ---------------- | ---------------------------------------------------------- | ------------------------------- |
| Local dev auth   | `local-dev.ts`, sign-in dev buttons                        | Untracked? wired?               |
| Account dropdown | `src/lib/components/navigation/AccountMenu.svelte`, Header | Plain link still?               |
| Production admin | `promote-admin.ts`, `SITE_LOCKED`, `/locked`               | Missing?                        |
| Media uploads    | `docs/plans/active/media-uploads.md`                       | Exists?                         |
| Org sync         | deploy-key mirror on `main`                                | CI prettier blocking auto-sync? |
| Saleor redeem    | `/account/redeem`                                          | Not started?                    |
| Prettier CI      | formatting drift blocking CI                               | `npm run lint`                  |
| Migration scaffolds | `@inspiration-scaffold` / `@saleor-migration` blocks      | Do not delete — inspiration-polish-coordination |

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
- Run `npm run check` + targeted tests after edits.
- Commit only when user asks.
- **Scaffold markers:** Do not remove `@inspiration-scaffold` (`#IP-###` in tracker) or `@saleor-migration` unless implementing that row or Saleor step.

## Output

- Polish plan markdown (in reply only — archived plan: `docs/archive/polish-plan.md`; open work: `docs/plans/active/inspiration-polish-coordination.md`)
- List of files changed if you implement P0/P1 items

Do not commit unless asked.
