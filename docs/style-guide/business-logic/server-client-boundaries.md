# Server vs Client Boundaries

SvelteKit enforces a clear split between server-only and browser code.

## Rules

| Runs on server only       | Runs on client (browser)                   |
| ------------------------- | ------------------------------------------ |
| `+page.server.ts`         | `+page.svelte` (interactive parts)         |
| `+server.ts` (API routes) | `.svelte` components with `$state`, events |
| `src/lib/server/**`       | `src/lib/stores/*.svelte.ts`               |
| `$env/dynamic/private`    | `$env/dynamic/public`                      |
| `$env/static/private`     | `$env/static/public`                       |

## Server-only code

**Directory:** `src/lib/server/`

```
src/lib/server/
├── saleor/
│   ├── client.ts      # GraphQL fetch — uses server env
│   └── queries.ts     # Query strings
└── supabase/
    └── client.ts      # Supabase setup (placeholder)
```

**Never import `src/lib/server/` from client components.** SvelteKit will error at build time if private env leaks to the client bundle.

## Public env (`PUBLIC_*`)

Safe for browser. Defined in `.env.example`:

- `PUBLIC_SITE_URL`
- `PUBLIC_CDN_BASE_URL`
- `PUBLIC_SALEOR_API_URL`
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `PUBLIC_DEFAULT_LOCALE`
- `PUBLIC_DEFAULT_CURRENCY`

Accessed via `src/lib/config/env.ts` (uses `$env/dynamic/public`).

## Private env (server only)

Never exposed to browser:

- `SALEOR_CHANNEL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `S3_BUCKET`, `S3_REGION`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

Read these in `+page.server.ts` or `src/lib/server/` modules using `$env/dynamic/private`.

## Data loading pattern

```
+page.server.ts  →  fetch data (mock or API)
       ↓
+page.svelte     →  receive `data` prop, render
       ↓
components       →  display + client interactivity
```

Server loaders run on every request (or at build time for prerendered pages). Client components handle UI state only.

## Shared config

`src/lib/config/env.ts` contains **public** config only — safe to import from client stores (`locale.svelte.ts`).

Server-only values (like `SALEOR_CHANNEL`) are read directly in server modules, not in shared config.

## Actions & forms (future)

Checkout and auth will use SvelteKit form actions in `+page.server.ts`:

```typescript
export const actions = {
	default: async ({ request }) => {
		/* server only */
	}
};
```

## Checklist

- [ ] API keys and secrets only in server files
- [ ] GraphQL mutations for checkout run server-side
- [ ] Mock data imports OK in server loaders (data is serializable)
- [ ] No `fetch()` to Saleor from client components for catalog (use loaders)
