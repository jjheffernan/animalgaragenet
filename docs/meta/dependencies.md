# Dependency upgrades

Internal notes from periodic `npm outdated` audits. Safe for the public repo (no secrets).

## Last audit

**Date:** 2026-06-30  
**Branch:** `dev`  
**Verification:** `npm run test:unit` (371 tests passed)

### Applied (minor / patch)

| Package                 | Change            | Notes                           |
| ----------------------- | ----------------- | ------------------------------- |
| `@supabase/supabase-js` | 2.108.2 → 2.110.0 | Lockfile + `package.json` caret |
| `vite`                  | 8.1.0 → 8.1.1     | Lockfile + `package.json` caret |

SvelteKit (`@sveltejs/kit`), Vitest, Playwright, and `@stripe/stripe-js` were already at the latest versions allowed by current semver ranges; no `package.json` change.

### Deferred (major or breaking)

| Package       | Current                | Latest | Reason                                                                 |
| ------------- | ---------------------- | ------ | ---------------------------------------------------------------------- |
| `@types/node` | 22.x (`^22` → 22.20.0) | 26.x   | Major jump; align with declared Node LTS and CI runtime before bumping |

### Follow-up

- Re-run `npm outdated` after Node/toolchain updates.
- When upgrading `@types/node` to 26+, confirm local and CI Node version and fix any new type errors.
