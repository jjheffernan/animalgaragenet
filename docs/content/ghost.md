**Status:** Current — guide category/topic filters wired (`guide-filters.ts`, `/api/content/guide-filters`); re-check when Ghost tag taxonomy changes.

# Ghost CMS

Animal Garage serves **guides** and **blog** posts from [Ghost](https://ghost.org/) via the Content API. When Ghost env vars are unset, the app falls back to mock data in `src/lib/data/mock/guides.ts` and `src/lib/data/mock/blog.ts`.

## Environment

Server-only variables (never expose to the browser):

| Variable                | Description                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| `GHOST_URL`             | Ghost site URL, e.g. `https://<your-ghost-host>` (no trailing slash) |
| `GHOST_CONTENT_API_KEY` | Content API key from Ghost Admin                                     |

Copy from `.env.example` into `.env` for local development.

## Tag convention

Posts are filtered by Ghost tag slug:

| Site section | Required tag | Route                       |
| ------------ | ------------ | --------------------------- |
| Guides       | `guide`      | `/guides`, `/guides/[slug]` |
| Blog         | `blog`       | `/blog`, `/blog/[slug]`     |

Additional tags on a post become:

- **Guides** — first non-`guide` tag → category pill; further tags → topic pills and `topicSlugs` on the mapped `Guide`
- **Blog** — displayed tag chips (all tags except `blog`)

## Guide filters

| Piece            | Location                                                                 |
| ---------------- | ------------------------------------------------------------------------ |
| Filter loader    | `src/lib/server/ghost/guide-filters.ts` — `getGuideFilterOptions()`      |
| Listing wiring   | `src/routes/guides/+page.server.ts` — `?category=` and optional `?topic=` |
| JSON API         | `GET /api/content/guide-filters` — `{ categories, topics, tags, source }` |
| UI               | Category/topic ribbons on `/guides` (reuses shop `CategoryPill`)         |

When `GHOST_URL` and `GHOST_CONTENT_API_KEY` are set, filters hydrate from Ghost guide posts. Otherwise mock guide `category` labels become filter pills.

### Filter ingestion (Content API)

Ghost’s **Content API** is REST (not GraphQL). The filter loader requests published guide posts and aggregates tags:

```
GET {GHOST_URL}/ghost/api/content/posts/
  ?key={GHOST_CONTENT_API_KEY}
  &filter=tag:guide
  &include=tags
  &fields=id,slug,tags
  &limit=all
  &order=published_at desc
```

Tag roles on each post (tags excluding content-type slugs `guide` and `blog`):

| Position | UI / model                         |
| -------- | ---------------------------------- |
| First    | Category pill (`Guide.category`)   |
| Rest     | Topic pills (`Guide.topicSlugs`)   |

Optional reference endpoint for tag metadata (not used by the loader today):

```
GET {GHOST_URL}/ghost/api/content/tags/?key={GHOST_CONTENT_API_KEY}&limit=all
```

Ghost **Admin API** exposes GraphQL for editorial workflows; storefront reads use the Content API above.

### URL params

| Param      | Matches                          |
| ---------- | -------------------------------- |
| `category` | Primary category slug or label   |
| `topic`    | Secondary topic slug (Ghost only) |

Both filters combine with AND logic before pagination.

## Ghost dashboard setup

1. **Create a Ghost site** (Ghost(Pro) or self-hosted).
2. **Settings → Integrations → Add custom integration**
   - Name it e.g. `Animal Garage SvelteKit`
   - Copy the **Content API URL** base (site URL) → `GHOST_URL`
   - Copy the **Content API key** → `GHOST_CONTENT_API_KEY`
3. **Create tags** in Ghost: `guide` and `blog` (slug must match exactly).
4. **Create posts** and assign the appropriate primary tag:
   - Pillar how-to articles → tag `guide` (+ category tag like `wheels`, optional topic tags like `fitment`)
   - News / drops / updates → tag `blog` (+ optional tags like `drops`, `community`)
5. **Publish** posts (drafts are not returned by the Content API).
6. Optional: set **Feature image** (hero), **Excerpt**, and **Meta description** for cards and SEO.

## App integration

| Module                                       | Role                                                     |
| -------------------------------------------- | -------------------------------------------------------- |
| `$lib/server/ghost/client.ts`                | Content API fetch, `isGhostEnabled()`                    |
| `$lib/server/ghost/posts.ts`                 | `listGuides`, `getGuide`, `listBlogPosts`, `getBlogPost` |
| `$lib/server/ghost/guide-filters.ts`         | `getGuideFilterOptions`, category/topic filtering        |
| `$lib/server/ghost/mappers.ts`               | Ghost post → `Guide` / `BlogPost`                        |
| `$lib/components/content/RichContent.svelte` | Renders sanitized Ghost `html` or mock plain content     |

Rendering uses Ghost’s pre-rendered `html` field, sanitized with `isomorphic-dompurify` before `{@html}` output.

## Local development without Ghost

Leave `GHOST_URL` and `GHOST_CONTENT_API_KEY` empty. Mock guides and blog posts load automatically with the legacy plain-text `content` field rendered by `RichContent`. Guide category pills derive from mock `category` strings.

## Audit

See [ghost-audit.md](../audits/ghost-audit.md) for integration readiness score, loader trace, test results, and go-live checklist.
