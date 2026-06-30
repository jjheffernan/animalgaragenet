# Ghost CMS integration audit

**Date:** 2026-06-29  
**Readiness score:** **8 / 10**

Ghost is wired end-to-end for guides and blog. The app is safe to point at a live Ghost instance once env vars and tags are configured. Remaining gaps are mostly SEO polish, observability when the API fails, and broader test coverage.

See [ghost.md](./ghost.md) for setup and tag conventions.

---

## Summary

| Area | Status |
|------|--------|
| Content API client + env gating | Done |
| List/detail loaders + mock fallback | Done |
| Tag convention (`guide`, `blog`) | Done |
| Ghost → domain mappers | Done |
| HTML rendering (DOMPurify) | Done |
| Per-page `<title>` | Done |
| Per-page meta description | Done (detail pages) |
| Open Graph / Twitter cards | Missing |
| Ghost `meta_title` / `meta_description` fields | Not mapped |
| Integration tests (`posts.ts`, `client.ts`) | Missing |
| E2E smoke for `/guides`, `/blog` | Missing |
| API failure observability (when env is set) | Weak — silent mock fallback |

---

## Loader trace

All content routes go through `$lib/server/ghost/posts.ts`, which gates on `isGhostEnabled()` before any network call.

| Route | Loader | Ghost function | Mock fallback |
|-------|--------|----------------|---------------|
| `/` | `+page.server.ts` | `listGuides()` | `mockGuides` |
| `/guides` | `guides/+page.server.ts` | `listGuides()` | `mockGuides` |
| `/guides/[slug]` | `guides/[slug]/+page.server.ts` | `getGuide(slug)` | `getGuideBySlug(slug)` |
| `/blog` | `blog/+page.server.ts` | `listBlogPosts()` | `mockBlogPosts` |
| `/blog/[slug]` | `blog/[slug]/+page.server.ts` | `getBlogPost(slug)` | `getBlogPostBySlug(slug)` |

### Gating layers

1. **`posts.ts`** — Each exported function returns mock data immediately when `!isGhostEnabled()`.
2. **`client.ts`** — `ghostFetch()` returns `null` when disabled; when enabled, non-OK responses and network errors log to `console.error` and return `null`.
3. **`posts.ts` fallback** — When Ghost is enabled but fetch returns empty/null, list functions fall back to full mock arrays; slug functions fall back to mock lookup by slug.

404 handling: detail loaders call `error(404)` when neither Ghost nor mock returns a match.

---

## Tag convention

| Section | Ghost tag slug | API filter | Slug fetch validation |
|---------|----------------|------------|------------------------|
| Guides | `guide` | `filter=tag:guide` | Post must include `guide` tag |
| Blog | `blog` | `filter=tag:blog` | Post must include `blog` tag |

**Category / chips**

- Guides: first tag whose slug is not `guide` → `category`; else `primary_tag.name`; else `"General"`.
- Blog: all tag names except `blog` → `tags[]`.

Documented in [ghost.md](./ghost.md) and enforced in `mappers.ts` + `fetchPostBySlug()`.

---

## Error handling

| Scenario | Behavior |
|----------|----------|
| Env vars unset | Mock only; no fetch |
| HTTP 4xx/5xx | Log + `null` → mock fallback |
| Network error | Log + `null` → mock fallback |
| Empty post list | Mock fallback |
| Slug not found / wrong tag | `null` → mock slug lookup → 404 if still missing |

**Production note:** When `GHOST_*` is set but the API is down or misconfigured, visitors may see stale mock content with no user-visible error. Consider logging/metrics or failing hard in production once Ghost is required.

---

## Rendering & security

- `RichContent.svelte` prefers Ghost `html` (sanitized via `isomorphic-dompurify`); falls back to plain `content` blocks for mocks.
- Allowed tags cover typical article markup (headings, lists, links, images, code, tables).
- `rel` and `loading` are allowed on sanitized elements so Ghost-authored external links and lazy images survive sanitization.

---

## SEO / meta

| Page | `<title>` | `<meta name="description">` | OG / Twitter |
|------|-----------|-------------------------------|--------------|
| `/guides` | Static | Layout default only | None |
| `/guides/[slug]` | `{title} — Animal Garage Guides` | `{excerpt}` | None |
| `/blog` | Static | Layout default only | None |
| `/blog/[slug]` | `{title} — Animal Garage Blog` | `{excerpt}` | None |

Excerpt mapping uses `custom_excerpt` → `excerpt` from Ghost. Dedicated Ghost SEO fields (`meta_title`, `meta_description`) are not read from the API yet.

---

## Tests

### Unit — `src/lib/server/ghost/mappers.test.ts`

```
Test Files  1 passed (1)
     Tests  3 passed (3)
```

Covers guide mapping, guide category fallback via `primary_tag`, and blog mapping with tag filtering.

Included in CI via `npm run test:unit` (`vitest run`).

### Not covered

- `ghostFetch` / `isGhostEnabled()` behavior
- `posts.ts` list/slug + mock fallback paths
- E2E navigation to guides/blog detail pages

---

## Readiness checklist

### Ready for Ghost go-live

- [x] `GHOST_URL` + `GHOST_CONTENT_API_KEY` in `.env.example`
- [x] Server-only env access (`$env/dynamic/private`)
- [x] Content API paths (`/ghost/api/content/posts/`, slug endpoint)
- [x] Tag-based filtering and slug tag validation
- [x] Domain types with `html?` + mock `content` fallback
- [x] All four routes + homepage featured guides
- [x] Mapper unit tests passing in CI
- [x] Detail page meta descriptions (excerpt)

### Before calling it “complete”

- [ ] Create Ghost site; tags `guide` and `blog`
- [ ] Publish at least one post per section; verify on staging with real env
- [ ] Map Ghost `meta_title` / `meta_description` if SEO needs differ from title/excerpt
- [ ] Add `og:title`, `og:description`, `og:image` on detail pages (use `heroImage`)
- [ ] Integration tests for `posts.ts` with mocked `fetch`
- [ ] E2E smoke: `/guides`, `/guides/how-to-choose-wheels`, `/blog`
- [ ] Decide production policy: mock fallback vs hard error when Ghost is configured but unreachable
- [ ] Optional: `Cache-Control` / SvelteKit `setHeaders` for Content API responses

---

## File map

| File | Role |
|------|------|
| `src/lib/server/ghost/client.ts` | `isGhostEnabled()`, `ghostFetch()` |
| `src/lib/server/ghost/posts.ts` | Public API for loaders |
| `src/lib/server/ghost/mappers.ts` | Ghost post → `Guide` / `BlogPost` |
| `src/lib/server/ghost/types.ts` | Ghost API shapes |
| `src/lib/data/mock/guides.ts` | Mock guides |
| `src/lib/data/mock/blog.ts` | Mock blog posts |
| `src/lib/components/RichContent.svelte` | Sanitized HTML renderer |
| `src/routes/guides/**` | Guides UI + loaders |
| `src/routes/blog/**` | Blog UI + loaders |
