# Animal Garage — Agent Context

Project context for AI agents working on **animalgarage.net**.

## Project

Automotive brand merchandising/marketing site. Merch-forward digital touchpoint with parts, community, and on-domain media. Headless storefront frontend; Saleor handles commerce on a separate domain.

## Stack

- **SvelteKit 2** + **Svelte 5** (runes mode)
- **TypeScript** (strict)
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **Saleor** — GraphQL headless commerce (external backend)
- **Supabase** — auth, build submissions, newsletter, user preferences
- **S3 + CloudFront** — media CDN (planned)
- **Adapter:** auto (via vite.config.ts)

## Conventions

- Minimal comments; self-explanatory code
- Mock data in `src/lib/data/` with env-gated Saleor/Ghost/Supabase swap points
- Server-only code in `src/lib/server/`
- Svelte 5 runes: `$state`, `$derived`, `$props`, `$effect`
- Components in `src/lib/components/`
- Types in `src/lib/types/`
- Path alias: `$lib` → `src/lib`

## Branch workflow

```
feature/* → dev → main
```

- Branch from `dev` for all features
- PR to `dev` for staging
- Merge `dev` → `main` for production
- Do not push secrets; use `.env.example` as template

## Key files

| Path                              | Purpose                          |
| --------------------------------- | -------------------------------- |
| `src/lib/server/saleor/`          | GraphQL client & queries         |
| `src/lib/server/supabase/`        | Supabase SSR auth & admin client |
| `src/lib/server/ghost/`           | Ghost CMS Content API            |
| `src/lib/server/build-logs/`      | Account build log submissions    |
| `src/lib/stores/locale.svelte.ts` | Locale/currency state            |
| `src/lib/data/mock/`              | Placeholder catalog & media      |
| `docs/`                           | Architecture & integration plans |
| `.env.example`                    | Environment variable template    |

## Commerce architecture

- Frontend never owns product inventory — Saleor is source of truth
- `PUBLIC_SALEOR_API_URL` points to external GraphQL endpoint
- Product types mirror Saleor shape for easy swap from mock → live
- International: locale store maps to channels/shipping regions

## Skills

Project skills are symlinked in this directory and `.cursor/skills/`. Read the relevant `SKILL.md` before working on Supabase, PR workflows, etc.

### Fresh clone — symlink onboarding

After `git clone`, several `agents/*` entries are **symlinks to machine-local paths** and may show as broken until Cursor is installed:

| Kind                    | Examples                                                      | Target                                         | Fix                                                                   |
| ----------------------- | ------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| **Repo-owned**          | `ponytail`, `caveman`                                         | Real directories in `agents/`                  | Always works                                                          |
| **Cursor IDE defaults** | `automate`, `babysit`, `sdk`, `review-*`, …                   | `~/.cursor/skills-cursor/<name>`               | Install [Cursor](https://cursor.com); run repair script below         |
| **Plugin cache**        | `supabase`, `svelte-code-writer`, `svelte-core-bestpractices` | Cursor plugin cache under `~/.cursor/plugins/` | Enable plugins in `.cursor/settings.json` (`plugins.*.enabled: true`) |

**Repair symlinks** (safe to re-run):

```bash
bash scripts/link-agent-skills.sh
```

**Verify:**

```bash
ls -la agents/ponytail agents/automate .cursor/skills/ponytail
test -f agents/ponytail/SKILL.md && echo OK
```

Broken `agents/automate` with missing `~/.cursor/skills-cursor/automate` is expected on machines without Cursor — agents still work; only those skill files are unavailable.

Optional upstream refresh: `npx skills add supabase/agent-skills`

### Project-specific agent skills

| Skill              | Purpose                                                      |
| ------------------ | ------------------------------------------------------------ |
| `agents/ponytail/` | Minimal-code discipline — YAGNI ladder, reuse before rewrite |
| `agents/caveman/`  | Terse communication mode — fewer tokens, same accuracy       |

Symlinks: `.cursor/skills/ponytail` → `../../agents/ponytail`, `.cursor/skills/caveman` → `../../agents/caveman`

### Upstream skills (also symlinked)

**Svelte plugin** (`svelte-code-writer`, `svelte-core-bestpractices`) and **Supabase plugin** (`supabase`, `supabase-postgres-best-practices`) — see `.cursor/settings.json` (`plugins.*.enabled: true`). Svelte MCP: `list-sections`, `get-documentation`, `svelte-autofixer`. Supabase MCP: schema, migrations, SQL, logs.

Canvas, babysit, review-bugbot, review-security, sdk, and other Cursor default skills live under `agents/` with matching `.cursor/skills/` symlinks (see **Fresh clone** above).

Install or refresh optional skills: `npx skills add supabase/agent-skills`

### Project-specific Cursor agents

Specs in `.cursor/agents/` — see [docs/README.md](../docs/README.md#cursor-agent-specs) for the full index.

| Agent                     | Use when                                          |
| ------------------------- | ------------------------------------------------- |
| `local-dev-auth`          | Local test sign-in, `DEV_ADMIN`, no prod exposure |
| `account-nav`             | Account menu dropdown, header auth UX             |
| `production-admin`        | `promote-admin`, site lockdown, Netlify admin     |
| `media-uploads`           | UGC/review uploads, Supabase Storage vs S3        |
| `saleor-redeem`           | `/account/redeem`, Saleor promo/gift codes        |
| `saleor-readiness`        | Pre-launch Saleor gap audit                       |
| `polish-sweep`            | Finish straggling edits from multi-agent sessions |
| `docs-updater`            | Sync `docs/` with codebase                        |
| `ui-consistency`          | Ribbons, pills, mobile nav patterns               |
| `git-commit-orchestrator` | Large diff → ordered commits                      |
| `market-readiness`        | Live deploy audit; mock vs live gaps              |
| `saleor-readiness`        | Pre-launch Saleor gap audit                       |
| `external-api-readiness`  | External API probe + readiness report             |
| `security-hardening`      | AuthZ, validation, cookies, XSS audit             |

## Commands

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run check    # Type check
npm run lint     # Lint
npm run test     # Unit + e2e
npm run test:unit
npm run test:e2e
```

## E2E scope policy

Subagents must not run back-to-back full Playwright or manual e2e audits. See [docs/testing/e2e-policy.md](../docs/testing/e2e-policy.md).

### Default (most tasks)

- **Unit tests for touched modules only** — e.g. `npm run test:unit -- src/lib/foo/bar.test.ts`
- Run `npm run check` after substantive edits
- Do **not** start `vite preview`, Playwright, or the preview webServer unless the task requires e2e

### Playwright (when allowed)

- Only when the user/task **explicitly** asks for **e2e** or end-to-end verification
- **Or** run **one spec** for the area you changed — e.g. `npx playwright test e2e/account.spec.ts`
- Do **not** run `npm run test:e2e` (full suite) unless explicitly requested

### Never (unless dedicated e2e task)

- Full manual audit passes or updating `docs/testing/e2e-manual-pass-*.md`
- Running all e2e specs in sequence
- Preview server for non-e2e work
- Repeated full e2e passes in the same session or across subagents

### Manual pass ownership

- **One dedicated e2e worker** (explicit e2e / market-readiness task) owns `docs/testing/e2e-manual-pass-*.md`
- Other agents must not create or refresh manual pass docs during polish or feature work

## Do not

- Commit `.env`, `.env.local`, Supabase local state (`supabase/.temp`, `.branches`), DB dumps, or credential files — see `.gitignore` and `scripts/check-secrets.sh`
- Push to remote unless explicitly asked
- Over-engineer — match existing patterns
- Add heavy dependencies without justification
