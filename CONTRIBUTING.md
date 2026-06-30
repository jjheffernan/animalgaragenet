# Contributing

## Branch workflow

```
main          ← production releases
  ↑
dev           ← staging / integration
  ↑
feature/*     ← individual features
```

1. Branch from `dev`: `git checkout dev && git pull && git checkout -b feature/my-feature`
2. Open PR into `dev` for staging review
3. After QA on staging, merge `dev` → `main` for production release

Do not commit directly to `main` except release merges from `dev`.

## Development

```bash
npm install
cp .env.example .env   # fill in values locally — never commit .env
npm run dev
```

Run `npm run check` and `npm run lint` before opening a PR.

## Branch protection (recommended)

Configure on GitHub for team repos:

| Branch | Settings                                                 |
| ------ | -------------------------------------------------------- |
| `main` | Require PR, require status checks (`CI`), no direct push |
| `dev`  | Require PR, require status checks (`CI`)                 |

CI workflow: `.github/workflows/ci.yml` (lint, check, build on PRs to `dev` and `main`).

## Conventions

- SvelteKit 2 / Svelte 5 with runes
- TypeScript strict mode
- Tailwind CSS v4 for styling
- Mock data in `src/lib/data/` until Saleor/Supabase are wired
- Server clients in `src/lib/server/`

See [agents/AGENTS.md](agents/AGENTS.md) for AI agent context and [docs/README.md](docs/README.md) for the full roadmap.
