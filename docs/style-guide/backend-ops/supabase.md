# Supabase

Auth, newsletter, content metadata, and user preferences — not commerce.

## Current state

**Wired:** `@supabase/supabase-js` and `@supabase/ssr` with cookie sessions in `hooks.server.ts`.

| Concern | Location |
|---------|----------|
| SSR client | `src/lib/server/supabase/client.ts` |
| Service role | `src/lib/server/supabase/admin.ts` |
| Session helpers | `src/lib/server/supabase/auth.ts` |
| Browser client | `src/lib/supabase/browser.ts` |
| Local dev auth | `src/lib/server/auth/local-dev.ts` |
| Migrations | `supabase/migrations/` |

Without env vars, auth falls back to mock `ag-session` cookie. Full reference: [integrations/supabase.md](../../integrations/supabase.md).

## Env vars

| Variable                    | Scope       | File           |
| --------------------------- | ----------- | -------------- |
| `PUBLIC_SUPABASE_URL`       | Public      | `.env.example` |
| `PUBLIC_SUPABASE_ANON_KEY`  | Public      | `.env.example` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | `.env.example` |
| `DEV_ADMIN`                 | Server only | Localhost admin bypass |
| `LOCAL_DEV_AUTH`            | Server only | Local quick-login |
| `SITE_LOCKED`               | Server only | Production preview lockdown |

## Roadmap (remaining)

- Newsletter signups
- Featured homepage sections
- User preferences (locale, favorites)
- UGC media — [plans/active/media-uploads.md](../../plans/active/media-uploads.md)

## Planned schema

See [infrastructure/overview.md](../../infrastructure/overview.md#supabase) for table sketches:

- `newsletter_subscribers`
- `featured_sections`
- `media_assets` (sketched in media uploads plan)
- `user_preferences`

## Agent skill

Read `agents/supabase/SKILL.md` (symlinked in `.cursor/skills/supabase/`) before any Supabase work. Also available: `supabase-postgres-best-practices`.

## Security

- Enable RLS on all public-schema tables
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
- Use anon key + RLS for user-facing operations
- Service role only in server routes/Edge Functions
- Never set `DEV_ADMIN` or `LOCAL_DEV_AUTH` on production

## Do not

- Store product inventory in Supabase — Saleor owns commerce
- Import supabase client in client components without SSR cookie handling
- Commit real Supabase keys
