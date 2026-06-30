# E2E testing scope policy

Agents and subagents on `dev` must not run back-to-back full Playwright or manual e2e audits. This policy keeps polish and feature work fast and avoids preview-server contention.

## Default (most tasks)

- Run **unit tests for touched modules only** — e.g. `npm run test:unit -- src/lib/foo/bar.test.ts`
- Run `npm run check` after substantive edits
- Do **not** start `vite preview`, Playwright, or the preview webServer unless the task requires e2e

## Playwright (when allowed)

- Only when the user/task **explicitly** asks for **e2e** or end-to-end verification
- **Or** run **one spec** for the area you changed — e.g. `npx playwright test e2e/account.spec.ts`
- Do **not** run the full suite (`npm run test:e2e`) unless explicitly requested

## Never (unless dedicated e2e task)

- Full manual audit passes
- Updating `docs/testing/e2e-manual-pass-*.md`
- Running all e2e specs in sequence
- Preview server for non-e2e work
- Repeated full e2e passes in the same session or across subagents

## Manual pass ownership

- **One dedicated e2e worker** (explicit e2e or market-readiness task) owns `docs/testing/e2e-manual-pass-*.md`
- Other agents must not create or refresh manual pass docs during polish or feature work

## Related

- Agent context: [agents/AGENTS.md](../../agents/AGENTS.md#e2e-scope-policy)
- Latest manual pass (when run): [e2e-manual-pass-2026-06-30.md](./e2e-manual-pass-2026-06-30.md)
