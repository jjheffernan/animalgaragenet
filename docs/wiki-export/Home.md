# Animal Garage — Developer Wiki

SvelteKit storefront for the Animal Garage brand site. Headless commerce (Saleor), auth and app data (Supabase), Ghost CMS for guides/blog, mock fallbacks for local dev.

> **Public wiki notice:** This wiki is intentionally high-level. It does **not** list production hostnames, cloud account names, bucket names, regions, or secret/credential variable names. Clone the repo and use `.env.example` plus team-maintained ops docs for environment-specific values.

## Pages

| Page                                           | Topics                                             |
| ---------------------------------------------- | -------------------------------------------------- |
| [Getting Started](Getting-Started)             | Install, dev server, check/lint/build              |
| [Environment Variables](Environment-Variables) | `.env` reference, public vs server-only            |
| [Authentication](Authentication)               | Supabase, local dev accounts, admin, site lockdown |
| [Editing the Site](Editing-the-Site)           | Components, routes, mock vs live swap points       |
| [Saleor Integration](Saleor-Integration)       | Catalog, checkout scaffold, payments gate          |
| [Supabase](Supabase)                           | Migrations, RLS, repositories                      |
| [Deployment and CI](Deployment-and-CI)         | Branches, GitHub Actions, deploy mirror            |
| [Testing](Testing)                             | Unit, contracts, e2e, readiness probes             |

## Stack

| Layer         | Technology                                             |
| ------------- | ------------------------------------------------------ |
| Runtime       | **Node.js 24** LTS (see `.nvmrc`)                      |
| Framework     | SvelteKit 2 + Svelte 5 (runes)                         |
| Language      | TypeScript (strict)                                    |
| Styling       | Tailwind CSS v4 (`@tailwindcss/vite`) — zinc/red theme |
| Commerce      | Saleor GraphQL (separate backend host)                 |
| Auth / data   | Supabase (`@supabase/ssr`)                             |
| Media CDN     | Object storage + CDN (env-gated)                       |
| CMS           | Ghost Content API (guides/blog)                        |
| Observability | Structured logs, `/api/metrics` (LGTM-ready hooks)     |
| Adapter       | `@sveltejs/adapter-auto`                               |
| Hosting       | Netlify (via organization deploy mirror)               |

## Branch workflow

`feature/*` → `dev` (CI) → `main` (CI) → organization deploy mirror → Netlify.

## Repo docs (clone required)

| Doc                       | Purpose                               |
| ------------------------- | ------------------------------------- |
| `docs/CODER-FLOW.md`      | Single contributor entry point        |
| `docs/STATUS.md`          | Open code vs ops-blocked work         |
| `docs/BLOCKERS.md`        | Netlify / Saleor / Supabase ops gates |
| `docs/SECURITY-PUBLIC.md` | What must not appear in public docs   |

## Repo layout

```
src/routes/           # Pages (+page.svelte, +page.server.ts)
src/lib/components/   # Shared UI (domain folders)
src/lib/server/       # Saleor, Supabase, Ghost (server-only)
src/lib/data/mock/    # Mock catalog when env unset
src/routes/admin/     # Admin dashboard (zinc/red Tailwind)
supabase/migrations/  # SQL + RLS
docs/wiki-export/     # Source for this wiki
```
