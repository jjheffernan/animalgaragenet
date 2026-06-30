# Animal Garage — Agent Context

Project context for AI agents working on **animalgarage.net**.

## Project

Automotive brand merchandising/marketing site. Merch-forward digital touchpoint with parts, community, and on-domain media. Headless storefront frontend; Saleor handles commerce on a separate domain.

## Stack

- **SvelteKit 2** + **Svelte 5** (runes mode)
- **TypeScript** (strict)
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **Saleor** — GraphQL headless commerce (external backend)
- **Supabase** — auth, build submissions, newsletter (planned)
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

### Project-specific agent skills

| Skill              | Purpose                                                      |
| ------------------ | ------------------------------------------------------------ |
| `agents/ponytail/` | Minimal-code discipline — YAGNI ladder, reuse before rewrite |
| `agents/caveman/`  | Terse communication mode — fewer tokens, same accuracy       |

Symlinks: `.cursor/skills/ponytail` → `../../agents/ponytail`, `.cursor/skills/caveman` → `../../agents/caveman`

### Upstream skills (also symlinked)

**Svelte plugin** (`svelte-code-writer`, `svelte-core-bestpractices`) and **Supabase plugin** (`supabase`, `supabase-postgres-best-practices`) — see `.cursor/settings.json` (`plugins.*.enabled: true`). Svelte MCP: `list-sections`, `get-documentation`, `svelte-autofixer`. Supabase MCP: schema, migrations, SQL, logs.

Canvas, babysit, review-bugbot, review-security, sdk, daisyui (reference only), and other Cursor default skills live under `agents/` with matching `.cursor/skills/` symlinks.

Install or refresh optional skills: `npx skills add saadeghi/daisyui`, `npx skills add supabase/agent-skills`

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

## Do not

- Commit `.env`, `.env.local`, Supabase local state (`supabase/.temp`, `.branches`), DB dumps, or credential files — see `.gitignore` and `scripts/check-secrets.sh`
- Push to remote unless explicitly asked
- Over-engineer — match existing patterns
- Add heavy dependencies without justification
