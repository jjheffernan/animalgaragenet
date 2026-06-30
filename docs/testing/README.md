# Testing docs

| Doc | Purpose |
| --- | --- |
| [e2e-policy.md](./e2e-policy.md) | **E2E scope policy** — when agents may run Playwright vs unit tests only |
| [e2e-manual-pass-2026-06-30.md](./e2e-manual-pass-2026-06-30.md) | Latest full manual e2e pass (dedicated e2e worker only) |
| [external-dependencies.md](./external-dependencies.md) | Integration registry |
| [readiness-report.md](./readiness-report.md) | Live probe results |
| [security-hardening.md](./security-hardening.md) | Security changelog |

**Default for agents:** unit tests on touched modules only. Full Playwright and manual pass doc updates require an explicit e2e task — see [e2e-policy.md](./e2e-policy.md).
