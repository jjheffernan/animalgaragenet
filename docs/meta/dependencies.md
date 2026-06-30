# Dependency upgrades

Internal notes from periodic `npm outdated` audits. Safe for the public repo (no secrets).

## Last audit

**Date:** 2026-06-30  
**Branch:** `dev`  
**Node:** 24 LTS (`engines`, CI, `.nvmrc`)  
**Verification:** `npm run check`, `npm run test:unit` (477 passed), `npm run test:contracts` (31 passed), `npm run build`

### Applied (minor / patch)

| Package                             | Change            | Notes                       |
| ----------------------------------- | ----------------- | --------------------------- |
| `@sveltejs/kit`                     | ^2.63.0 → ^2.68.0 | Lockfile resolved to 2.68.0 |
| `svelte`                            | ^5.56.1 → ^5.56.4 |                             |
| `svelte-check`                      | ^4.6.0 → ^4.7.1   |                             |
| `tailwindcss` / `@tailwindcss/vite` | ^4.3.0 → ^4.3.2   |                             |
| `eslint`                            | ^10.4.1 → ^10.6.0 |                             |
| `eslint-plugin-svelte`              | ^3.19.0 → ^3.20.0 |                             |
| `typescript-eslint`                 | ^8.60.1 → ^8.62.1 |                             |
| `globals`                           | ^17.6.0 → ^17.7.0 |                             |
| `prettier-plugin-svelte`            | ^4.1.0 → ^4.1.1   |                             |
| `sanitize-html`                     | ^2.17.1 → ^2.17.5 |                             |
| `@types/sanitize-html`              | ^2.16.0 → ^2.16.1 |                             |

Production deps (`@aws-sdk/*`, `@supabase/*`, `@stripe/stripe-js`, `vite`, `vitest`, `playwright`, etc.) were already at the latest versions allowed by current semver ranges; lockfile refreshed via `npm update`.

### Deferred (major or breaking)

| Package       | Current      | Latest | Reason                                                |
| ------------- | ------------ | ------ | ----------------------------------------------------- |
| `@types/node` | 24.x (`^24`) | 26.x   | Stay on Node 24 LTS until runtime upgrades to Node 26 |

### Follow-up

- Re-run `npx npm-check-updates` after toolchain bumps.
- When upgrading `@types/node` to 26+, confirm local and CI Node version and fix any new type errors.
