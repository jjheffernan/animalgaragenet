# Local Development

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+

## First-time setup

```bash
cd /path/to/animalgaragenet
npm install
cp .env.example .env   # optional — app runs with defaults + mock data
npm run dev
```

Dev server: http://localhost:5173

## Commands

| Command               | Purpose                            |
| --------------------- | ---------------------------------- |
| `npm run dev`         | Start Vite dev server with HMR     |
| `npm run build`       | Production build to `.svelte-kit/` |
| `npm run preview`     | Serve production build locally     |
| `npm run check`       | TypeScript + Svelte type checking  |
| `npm run check:watch` | Type check in watch mode           |
| `npm run lint`        | Prettier check + ESLint            |
| `npm run format`      | Auto-format with Prettier          |

## Pre-PR checklist

```bash
npm run lint
npm run check
npm run build
```

All three must pass before opening a PR.

## Project structure (quick reference)

```
src/
├── routes/           # Pages (+page.svelte, +page.server.ts)
├── lib/
│   ├── components/   # Shared UI
│   ├── config/       # env.ts
│   ├── data/         # Mock catalog
│   ├── i18n/         # Locale helpers
│   ├── server/       # Saleor, Supabase clients
│   ├── stores/       # Svelte 5 state
│   └── types/        # TypeScript interfaces
static/               # Public assets
docs/                 # Documentation
agents/               # AI agent skills
```

## Environment

Not required for prototype development. Mock data works without `.env`.

For Saleor/Supabase testing, copy `.env.example` → `.env` and fill values.

## IDE

Cursor/VS Code with Svelte extension recommended. Project includes `.cursor/` config (committed).

## Troubleshooting

| Issue                           | Fix                                             |
| ------------------------------- | ----------------------------------------------- |
| Type errors after route changes | `npm run prepare` or `npx svelte-kit sync`      |
| Stale `.svelte-kit` cache       | Delete `.svelte-kit/` and rebuild               |
| Port 5173 in use                | `npm run dev -- --port 5174`                    |
| Missing types for routes        | Run `svelte-kit sync` (part of `npm run check`) |

## Agent context

See [agents/AGENTS.md](../../../agents/AGENTS.md) for AI agent conventions and [style guide](../README.md) for full documentation.
