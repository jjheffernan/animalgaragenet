# Local Development

## Prerequisites

- **Node.js** 24+ (Active LTS — see `.nvmrc`)
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

## Local auth shortcuts

Server-only env vars for fast iteration on **localhost only**. Both are ignored on production hostnames (see `isProductionHostname()`). **Never** set them on Netlify.

| Variable              | Purpose                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| `DEV_ADMIN=true`      | Bypass admin role check — access `/admin` without `app_metadata.role`                            |
| `LOCAL_DEV_AUTH=true` | Show quick-login buttons on `/auth/sign-in` when not in Vite `DEV` mode (e.g. `npm run preview`) |

With `npm run dev`, quick-login is enabled automatically on localhost without `LOCAL_DEV_AUTH`.

### Predefined dev accounts

Defined in `src/lib/server/auth/local-dev-accounts.ts` (emails + roles only — no passwords in repo):

| Email                | Role     |
| -------------------- | -------- |
| `admin@local.dev`    | admin    |
| `editor@local.dev`   | editor   |
| `customer@local.dev` | customer |

Guard logic: `src/lib/server/auth/local-dev.ts` (`isLocalDevAuthEnabled`, `isDevAdminEnabled`).

- **Without Supabase keys:** quick-login sets a mock `ag-session` cookie with the chosen role.
- **With Supabase + service role:** upserts the user with `app_metadata.role` and signs in via server-side OTP.

Full auth reference: [integrations/supabase.md](../../integrations/supabase.md).

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

| Issue                           | Fix                                              |
| ------------------------------- | ------------------------------------------------ |
| Type errors after route changes | `npm run prepare` or `npx svelte-kit sync`       |
| Stale `.svelte-kit` cache       | Delete `.svelte-kit/` and rebuild                |
| Port 5173 in use                | `npm run dev -- --port 5174`                     |
| Missing types for routes        | Run `svelte-kit sync` (part of `npm run check`)  |
| Admin denied locally            | Set `DEV_ADMIN=true` or use quick-login as admin |

## Agent context

See [agents/AGENTS.md](../../../agents/AGENTS.md) for AI agent conventions and [style guide](../README.md) for full documentation.
