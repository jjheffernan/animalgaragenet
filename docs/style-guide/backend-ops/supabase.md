# Supabase

Planned for auth, newsletter, content metadata, and user preferences — not commerce.

## Current state

**Placeholder:** `src/lib/server/supabase/client.ts`

```typescript
export function getSupabaseConfig(): SupabaseClientConfig | null {
	if (!config.supabaseUrl || !config.supabaseAnonKey) return null;
	return { url, anonKey };
}

export async function createSupabaseClient() {
	// Returns null or stub — @supabase/supabase-js not installed yet
}
```

Missing env vars return `null` gracefully — no crash.

## When to wire up

Phase 4 per [roadmap](../../README.md):

- Auth (magic link / OAuth)
- Newsletter signups
- Featured homepage sections
- Media asset metadata
- User preferences (locale, favorites)

## Installation (future)

```bash
npm install @supabase/supabase-js @supabase/ssr
```

For SvelteKit SSR, use `@supabase/ssr` with cookies in `hooks.server.ts`.

## Env vars

| Variable                    | Scope       | File           |
| --------------------------- | ----------- | -------------- |
| `PUBLIC_SUPABASE_URL`       | Public      | `.env.example` |
| `PUBLIC_SUPABASE_ANON_KEY`  | Public      | `.env.example` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | `.env.example` |

## Planned schema

See [infrastructure.md](../../infrastructure.md#supabase) for table sketches:

- `newsletter_subscribers`
- `featured_sections`
- `media_assets`
- `user_preferences`

## Agent skill

Read `agents/supabase/SKILL.md` (symlinked in `.cursor/skills/supabase/`) before any Supabase work. Also available: `supabase-postgres-best-practices`.

## Security

- Enable RLS on all public-schema tables
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
- Use anon key + RLS for user-facing operations
- Service role only in server routes/Edge Functions

## Do not

- Store product inventory in Supabase — Saleor owns commerce
- Import supabase client in client components without SSR cookie handling
- Commit real Supabase keys
