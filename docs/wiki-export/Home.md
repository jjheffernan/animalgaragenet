# Animal Garage — Developer Wiki

SvelteKit storefront for **animalgarage.net**. Headless commerce (Saleor), auth/content (Supabase), mock fallbacks for local dev.

## Pages

| Page | Topics |
|------|--------|
| [Getting Started](Getting-Started) | Install, dev server, check/lint/build |
| [Environment Variables](Environment-Variables) | `.env` reference, public vs server-only |
| [Authentication](Authentication) | Supabase, local dev accounts, admin, site lockdown |
| [Editing the Site](Editing-the-Site) | Components, routes, mock vs live swap points |
| [Saleor Integration](Saleor-Integration) | Catalog, checkout scaffold, redeem |
| [Supabase](Supabase) | Migrations, RLS, repositories |
| [Deployment and CI](Deployment-and-CI) | Branches, GitHub Actions, org mirror, Netlify |
| [Testing](Testing) | Unit, contracts, readiness probes |

## Stack

| Layer | Technology |
|-------|------------|
| Framework | SvelteKit 2 + Svelte 5 (runes) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Commerce | Saleor GraphQL (`commerce.animalgarage.net`) |
| Auth / data | Supabase (`@supabase/ssr`) |
| Media CDN | S3 + CloudFront (planned) |
| CMS | Ghost Content API (guides/blog) |
| Adapter | `@sveltejs/adapter-auto` |
| Hosting | Netlify via org mirror repo |

## Branch workflow

`feature/*` → `dev` (CI) → `main` (CI) → sync to `heff-industries/animalgaragenet` → Netlify deploy.

## Repo layout

```
src/routes/           # Pages (+page.svelte, +page.server.ts)
src/lib/components/   # Shared UI
src/lib/server/       # Saleor, Supabase, Ghost (server-only)
src/lib/data/mock/    # Mock catalog when env unset
supabase/migrations/  # SQL + RLS
docs/                 # Source docs (this wiki is derived from docs/)
```
