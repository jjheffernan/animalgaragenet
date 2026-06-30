# Ghost CMS

Animal Garage serves **guides** and **blog** posts from [Ghost](https://ghost.org/) via the Content API. When Ghost env vars are unset, the app falls back to mock data in `src/lib/data/mock/guides.ts` and `src/lib/data/mock/blog.ts`.

## Environment

Server-only variables (never expose to the browser):

| Variable | Description |
|----------|-------------|
| `GHOST_URL` | Ghost site URL, e.g. `https://content.animalgarage.net` (no trailing slash) |
| `GHOST_CONTENT_API_KEY` | Content API key from Ghost Admin |

Copy from `.env.example` into `.env` for local development.

## Tag convention

Posts are filtered by Ghost tag slug:

| Site section | Required tag | Route |
|--------------|--------------|-------|
| Guides | `guide` | `/guides`, `/guides/[slug]` |
| Blog | `blog` | `/blog`, `/blog/[slug]` |

Additional tags on a post become:

- **Guides** — category label (first tag that is not `guide`)
- **Blog** — displayed tag chips (all tags except `blog`)

## Ghost dashboard setup

1. **Create a Ghost site** (Ghost(Pro) or self-hosted).
2. **Settings → Integrations → Add custom integration**
   - Name it e.g. `Animal Garage SvelteKit`
   - Copy the **Content API URL** base (site URL) → `GHOST_URL`
   - Copy the **Content API key** → `GHOST_CONTENT_API_KEY`
3. **Create tags** in Ghost: `guide` and `blog` (slug must match exactly).
4. **Create posts** and assign the appropriate primary tag:
   - Pillar how-to articles → tag `guide` (+ optional category tags like `Wheels`, `Suspension`)
   - News / drops / updates → tag `blog` (+ optional tags like `drops`, `community`)
5. **Publish** posts (drafts are not returned by the Content API).
6. Optional: set **Feature image** (hero), **Excerpt**, and **Meta description** for cards and SEO.

## App integration

| Module | Role |
|--------|------|
| `$lib/server/ghost/client.ts` | Content API fetch, `isGhostEnabled()` |
| `$lib/server/ghost/posts.ts` | `listGuides`, `getGuide`, `listBlogPosts`, `getBlogPost` |
| `$lib/server/ghost/mappers.ts` | Ghost post → `Guide` / `BlogPost` |
| `$lib/components/RichContent.svelte` | Renders sanitized Ghost `html` or mock plain content |

Rendering uses Ghost’s pre-rendered `html` field, sanitized with `isomorphic-dompurify` before `{@html}` output.

## Local development without Ghost

Leave `GHOST_URL` and `GHOST_CONTENT_API_KEY` empty. Mock guides and blog posts load automatically with the legacy plain-text `content` field rendered by `RichContent`.

## Audit

See [ghost-audit.md](./ghost-audit.md) for integration readiness score, loader trace, test results, and go-live checklist.
