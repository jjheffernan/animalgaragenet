# Getting Started

## Prerequisites

- **Node.js** 24+ (Active LTS — use `.nvmrc` or `.node-version`)
- **npm** 10+

```bash
nvm install 24
nvm use          # reads .nvmrc
```

`package.json` declares `"engines": { "node": ">=24.0.0" }`.

## First-time setup

```bash
git clone https://github.com/jjheffernan/animalgaragenet.git
cd animalgaragenet
npm install
cp .env.example .env   # optional — app runs with defaults + mock data
npm run dev
```

Dev server: http://localhost:5173

## Commands

| Command                  | Purpose                                      |
| ------------------------ | -------------------------------------------- |
| `npm run dev`            | Start Vite dev server with HMR               |
| `npm run build`          | Production build to `.svelte-kit/`           |
| `npm run preview`        | Serve production build locally               |
| `npm run check`          | TypeScript + Svelte type checking            |
| `npm run check:watch`    | Type check in watch mode                     |
| `npm run lint`           | Prettier check + ESLint                      |
| `npm run format`         | Auto-format with Prettier                    |
| `npm run test:unit`      | Vitest unit + integration tests              |
| `npm run test:contracts` | Payload / mapper contract tests              |
| `npm run test:e2e`       | Playwright end-to-end tests                  |
| `npm run test:readiness` | Live API smoke probes (skips when env unset) |

## Pre-PR checklist

```bash
npm run lint
npm run check
npm run test:unit
npm run test:contracts
npm run build
bash scripts/check-secrets.sh
npx playwright test e2e/smoke.spec.ts   # optional quick e2e
```

CI runs the full suite including Playwright on push to `dev` / `main`.

## Environment

Not required for prototype development. Mock data works without `.env`.

For Saleor/Supabase testing, copy `.env.example` → `.env` and fill values. See [Environment Variables](Environment-Variables).

## Project structure

```
src/
├── routes/           # Pages (+page.svelte, +page.server.ts)
├── lib/
│   ├── components/   # Shared UI (catalog/, layout/, admin/, …)
│   ├── config/       # env.ts
│   ├── data/         # Mock catalog
│   ├── i18n/         # Locale helpers
│   ├── server/       # Saleor, Supabase clients
│   ├── stores/       # Svelte 5 state
│   └── types/        # TypeScript interfaces
static/               # Public assets
docs/                 # Documentation (see docs/CODER-FLOW.md)
agents/               # AI agent skills
```

## Troubleshooting

| Issue                           | Fix                                              |
| ------------------------------- | ------------------------------------------------ |
| `npm install` engine error      | Upgrade to Node 24 (`nvm use 24`)                |
| Type errors after route changes | `npm run prepare` or `npx svelte-kit sync`       |
| Stale `.svelte-kit` cache       | Delete `.svelte-kit/` and rebuild                |
| Port 5173 in use                | `npm run dev -- --port 5174`                     |
| Missing types for routes        | Run `svelte-kit sync` (part of `npm run check`)  |
| Admin denied locally            | Set `DEV_ADMIN=true` or use quick-login as admin |

## IDE

Cursor/VS Code with Svelte extension recommended. Project includes `.cursor/` config (committed). Link agent skills: `scripts/link-agent-skills.sh`.
