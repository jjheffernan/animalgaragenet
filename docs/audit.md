# Site Audit — June 2026

Audit of animalgaragenet prototype on `dev` branch. Run after infrastructure/docs changes.

## Summary

| Category          | Status                 | Notes                                           |
| ----------------- | ---------------------- | ----------------------------------------------- |
| `.gitignore`      | **PASS** (fixed)       | Added IDE, logs, coverage, temp files           |
| Security / config | **PASS** (fixed)       | No secrets committed; env mismatch fixed        |
| Code gaps         | **PASS** (partial fix) | Error page added; known Phase 1 gaps documented |
| Documentation     | **PASS**               | Style guide created; docs linked                |
| Dependencies      | **PASS**               | Current for SvelteKit 2 / Svelte 5 stack        |

---

## 1. `.gitignore`

**Status: PASS (fixes applied)**

### Was covered

- `node_modules`, `.env`, `.env.*` (with `!.env.example`)
- `.svelte-kit`, `/build`, platform output (`.output`, `.vercel`, `.netlify`)
- OS files (`.DS_Store`, `Thumbs.db`)
- Vite timestamp files

### Gaps found & fixed (June 2026 — pre-push hardening)

- Supabase CLI local state: `supabase/.branches`, `supabase/.temp`, `supabase/.env*`, `.supabase/`
- Database dumps / local DB files: `*.dump`, `*.sqlite`, `*.db`, `pgdata/`, etc.
- Credential material: `*.pem`, `*.key`, `credentials.json`, `service-account*.json`, `secrets/`
- Playwright stored auth: `playwright/.auth/`
- `supabase/.gitignore` for CLI-local files; `scripts/check-secrets.sh` + CI guard step
- `.env.example` documents all server-only vars (YouTube sync, Ghost, Supabase service role)

### Intentionally tracked

- `.env.example` — placeholders only
- `supabase/migrations/*.sql` — schema + RLS policies (no row data)
- `.cursor/` project agents/settings (no secrets)

---

## 2. Security / config

**Status: PASS (fixes applied)**

### Secrets

- **PASS:** No `.env` or real credentials in git history (checked via grep)
- **PASS:** `.env.example` uses placeholders only
- **PASS:** `SUPABASE_SERVICE_ROLE_KEY` and AWS keys are server-only vars in `.env.example`

### `env.ts` handling

- **PASS:** Public config uses `$env/dynamic/public` with safe fallbacks
- **FIXED:** Removed `saleorChannel` from shared `config` — was reading nonexistent `PUBLIC_SALEOR_CHANNEL` while `.env.example` defines server-only `SALEOR_CHANNEL`
- **FIXED:** Added `getSaleorChannel()` in `src/lib/server/saleor/client.ts` reading `$env/dynamic/private`

### Remaining notes

- `@supabase/supabase-js` and `@supabase/ssr` installed — mock `ag-session` fallback when env unset
- Saleor client gracefully handles missing API URL (returns error object, no throw)

---

## 3. Code gaps

**Status: PASS with known Phase 1 limitations**

### Fixed

| Issue                         | Fix                                                    |
| ----------------------------- | ------------------------------------------------------ |
| Missing `+error.svelte`       | Added branded error page at `src/routes/+error.svelte` |
| `SALEOR_CHANNEL` env mismatch | Server-only read in saleor client                      |
| ESLint navigation/each-key    | Links use `resolve()` from `$app/paths`; `{#each}` keys added |
| Prettier formatting drift     | Formatted codebase for CI compatibility                |

### Known gaps (not blocking prototype)

| Issue                                                | Severity | Notes                                            |
| ---------------------------------------------------- | -------- | ------------------------------------------------ |
| No cart/checkout                                     | Expected | Phase 2 — Saleor integration                     |
| Homepage imports mock data in component              | Low      | Move to `+page.server.ts` before Saleor swap     |
| No `prefers-reduced-motion`                          | Medium   | Documented in style guide a11y section           |
| No custom 404 page content for unknown products only | Low      | Generic error page handles 404                   |
| `LocaleSelector` not in Header                       | Low      | Component exists, not wired to nav               |
| No SEO/OG tags per page                              | Medium   | Phase 5                                          |
| No tests                                             | **Done** | 180+ unit/contract/integration tests — `npm run test:unit` |
| No `svelte.config.js` file                           | Info     | Config lives in `vite.config.ts` (valid for SK2) |

### TODO/FIXME scan

- **PASS:** No blocking `TODO`/`FIXME` in `src/`

### Routes verified

| Route          | Status                                  |
| -------------- | --------------------------------------- |
| `/`            | OK                                      |
| `/shop`        | OK                                      |
| `/shop/[slug]` | OK (404 via `error()` for unknown slug) |
| `/about`       | OK                                      |
| `/media`       | OK                                      |

---

## 4. Documentation gaps

**Status: PASS (fixed)**

### Created

- `/docs/style-guide/` — full developer reference (frontend, business logic, backend ops)
- `/docs/audit.md` — this file
- Updated `/docs/README.md` with style guide link

### Pre-existing (still valid)

- `docs/infrastructure.md`, `docs/saleor.md`, `docs/animation-media.md`
- `CONTRIBUTING.md`, `agents/AGENTS.md`

---

## 5. Dependencies

**Status: PASS**

### Core stack (current)

| Package         | Version | Notes              |
| --------------- | ------- | ------------------ |
| `@sveltejs/kit` | ^2.63.0 | Current            |
| `svelte`        | ^5.56.1 | Runes mode         |
| `tailwindcss`   | ^4.3.0  | v4 via Vite plugin |
| `vite`          | ^8.0.16 | Current            |
| `typescript`    | ^6.0.3  | Current            |

### Missing (planned, not critical)

| Package                                  | When                     |
| ---------------------------------------- | ------------------------ |
| `@supabase/supabase-js`, `@supabase/ssr` | Phase 4                  |
| Platform adapter (e.g. `adapter-node`)   | Before production deploy |

### `engines` field

- **Note:** `package.json` has no `engines` field — CI uses Node 22 LTS

---

## Build verification

Run after changes:

```bash
npm run lint
npm run check
npm run build
```

Results recorded in commit message / CI.

---

## Fixes applied in this audit

1. Expanded `.gitignore`
2. Fixed `SALEOR_CHANNEL` server/client env boundary
3. Added `src/routes/+error.svelte`
4. Created comprehensive style guide
5. Installed ponytail + caveman agent skills
6. Added GitHub CI, PR template, issue templates, dependabot
