# Animal Garage — Development Roadmap

Architecture, phases, and integration plans for **animalgarage.net**.

## Vision

A highly animated, media-heavy automotive brand site — merchandising-forward digital marketing with parts, community, and on-domain media. The frontend is a SvelteKit headless storefront; commerce runs on Saleor at a separate domain; media ships via CDN; non-commerce data lives in Supabase.

## Stack

| Layer          | Technology                         | Role                                        |
| -------------- | ---------------------------------- | ------------------------------------------- |
| Frontend       | SvelteKit 2, Svelte 5, Tailwind v4 | SSR/SSG storefront & marketing              |
| Commerce       | Saleor (GraphQL)                   | Products, cart, checkout, shipping          |
| Auth & content | Supabase                           | Auth, newsletter, CMS metadata, preferences |
| Media          | S3 + CloudFront                    | Images, video thumbnails, static assets     |
| Hosting        | TBD (adapter-auto)                 | Deploy target selected per environment      |

## Project phases

### Phase 1 — Prototype (complete)

- [x] SvelteKit scaffold with TypeScript, ESLint, Prettier, Tailwind
- [x] Click-through pages: Home, Shop, Product, About, Media
- [x] Mock Saleor-shaped product data
- [x] Locale/currency hooks for international readiness
- [x] GraphQL client structure (placeholder)
- [x] Documentation & agent compatibility

### Phase 2 — Commerce integration

- [x] Connect Saleor GraphQL — partial: env-gated catalog loaders, cart scaffold (`docs/saleor-audit.md`)
- [x] Channel-aware pricing — partial: locale → channel map in `src/lib/server/saleor/channels.ts`
- [ ] Stripe/payment flow via Saleor
- [ ] International shipping zones and rate calculation
- [ ] Replace mock data with live API calls (mock fallback when `PUBLIC_SALEOR_API_URL` unset)

### Phase 3 — Media & CDN

- [ ] S3 bucket for media uploads
- [ ] CloudFront distribution in front of S3
- [ ] Migrate placeholder images to CDN URLs
- [ ] Video thumbnail pipeline
- [ ] Responsive image srcset helpers

### Phase 4 — Supabase services

- [x] Auth (magic link / OAuth) — `/auth/*`, mock `ag-session` fallback without keys (`docs/supabase.md`)
- [ ] Newsletter signups
- [ ] User preferences (locale, favorites)
- [ ] Content metadata for dynamic homepage sections
- [ ] Featured media/collection pre-selection

### Phase 5 — Polish & launch

- [ ] Advanced animations (scroll-driven, page transitions)
- [ ] SEO, OG tags, structured data
- [ ] Analytics
- [ ] Performance audit (LCP, CLS)
- [ ] Production deploy pipeline

## Branch workflow

See [CONTRIBUTING.md](../CONTRIBUTING.md):

- Feature branches from `dev`
- Merge to `dev` for staging
- Merge `dev` → `main` for production

## Directory structure

```
animalgaragenet/
├── agents/           # AGENTS.md + symlinked Cursor skills
├── docs/             # Architecture & planning
├── src/
│   ├── lib/
│   │   ├── components/
│   │   ├── config/
│   │   ├── data/         # Mock data (temporary)
│   │   ├── i18n/
│   │   ├── server/       # Saleor, Supabase clients
│   │   ├── stores/
│   │   └── types/
│   └── routes/
├── static/
└── .cursor/skills/   # Symlinks to agents skills
```

## Environment variables

Copy `.env.example` to `.env`. See [infrastructure.md](./infrastructure.md) for details.

## Related docs

- **[Feature backlog](./inspiration.md)** — integrated vs remaining capabilities
- **[Phase 3 plan](./phase3-plan.md)** — current bug fixes and workstreams
- **[Architecture decisions](./decisions.md)** — persistent product/tech choices
- **[Style guide](./style-guide/README.md)** — comprehensive dev reference
- [Site audit](./audit.md) — security, gaps, and fix log
- [Infrastructure (CDN, S3, Supabase)](./infrastructure.md)
- [Saleor integration](./saleor.md)
- [Animation & media strategy](./animation-media.md)
