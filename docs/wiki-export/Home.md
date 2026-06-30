# Animal Garage — Developer Wiki

SvelteKit storefront for the Animal Garage brand site. Headless commerce (Saleor), auth/content (Supabase), mock fallbacks for local dev.

> **Public wiki notice:** This wiki is intentionally high-level. It does **not** list production hostnames, cloud account names, bucket names, regions, or secret/credential variable names. Clone the repo and use `.env.example` plus team-maintained ops docs for environment-specific values.

## Pages

| Page | Topics |
|------|--------|
| [Getting Started](Getting-Started) | Install, dev server, check/lint/build |
| [Environment Variables](Environment-Variables) | `.env` reference, public vs server-only |
| [Authentication](Authentication) | Supabase, local dev accounts, admin, site lockdown |
| [Editing the Site](Editing-the-Site) | Components, routes, mock vs live swap points |
| [Saleor Integration](Saleor-Integration) | Catalog, checkout scaffold, redeem |
| [Supabase](Supabase) | Migrations, RLS, repositories |
| [Deployment and CI](Deployment-and-CI) | Branches, GitHub Actions, deploy mirror |
| [Testing](Testing) | Unit, contracts, readiness probes |

## Stack

| Layer | Technology |
|-------|------------|
| Framework | SvelteKit 2 + Svelte 5 (runes) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Commerce | Saleor GraphQL (separate backend host) |
| Auth / data | Supabase (`@supabase/ssr`) |
| Media CDN | Object storage + CDN (planned) |
| CMS | Ghost Content API (guides/blog) |
| Adapter | `@sveltejs/adapter-auto` |
| Hosting | Netlify (via deploy mirror repo) |

## Branch workflow

`feature/*` → `dev` (CI) → `main` (CI) → organization deploy mirror → Netlify.

## Repo layout

```
src/routes/           # Pages (+page.svelte, +page.server.ts)
src/lib/components/   # Shared UI
src/lib/server/       # Saleor, Supabase, Ghost (server-only)
src/lib/data/mock/    # Mock catalog when env unset
supabase/migrations/  # SQL + RLS
docs/                 # Source docs (wiki derived from docs/wiki-export/)
```
