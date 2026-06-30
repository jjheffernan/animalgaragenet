# Animation & Media Strategy

Visual and motion design plan for Animal Garage.

## Aesthetic

- **Palette:** Near-black backgrounds (`#09090b`), zinc grays, red accents (`#dc2626`)
- **Typography:** Bold uppercase display headings, industrial feel
- **Reference:** Hoonigan, BigTime, Speeed — raw garage energy, not polished corporate

## Current implementation (Phase 1)

- CSS transitions on hover (product cards, collection cards)
- `AnimatedReveal` component — fade + translate on mount with staggered delays
- Hero scan-line animation (CSS keyframes)
- Tailwind utility classes for layout and responsive design
- **No heavy animation libraries** — keeps bundle small

## Phase 2 — Enhanced motion

Consider adding only when needed:

| Library | Use case |
| ------- | -------- |
| `@motionone/svelte` | Scroll-triggered reveals, staggered lists |
| Svelte transitions | Page route changes |
| CSS `@view-transition` | Native page transitions (progressive enhancement) |

Guidelines:

- Respect `prefers-reduced-motion`
- Animate transform/opacity only (GPU-friendly)
- Avoid layout-thrashing properties (width, height, top)

## Media-heavy pages

### Homepage hydration

Pre-selected content loaded server-side, hydrated client-side:

1. Supabase `featured_sections` defines active hero, collections, media IDs
2. Server load fetches metadata + CDN URLs
3. Client hydrates interactive elements (video play, carousel)

### Gallery (`/media`)

- Grid layout with lazy-loaded images
- Video items show play overlay; click opens modal or inline player
- Thumbnails from CDN (`/thumbnails/{id}.jpg`)
- Full video from CDN or embed (YouTube/Vimeo for long-form)

### Product pages

- Hero image + gallery grid
- Future: zoom on hover, variant image swap
- CDN srcset for responsive sizes:

```html
<img
  src="{cdn}/products/{slug}/800.webp"
  srcset="
    {cdn}/products/{slug}/400.webp 400w,
    {cdn}/products/{slug}/800.webp 800w,
    {cdn}/products/{slug}/1200.webp 1200w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

## Placeholder strategy (prototype)

- `picsum.photos` with deterministic seeds (`seed/ag101`) — no broken images
- Replace with S3/CloudFront URLs in Phase 3
- Local SVG brand marks in `/static/` and `/src/lib/assets/`

## Performance targets

| Metric | Target |
| ------ | ------ |
| LCP | < 2.5s |
| CLS | < 0.1 |
| Hero image | Preload, priority fetch |
| Below-fold | `loading="lazy"` |
| Video | Poster image only until play |

## Accessibility

- All motion respects `prefers-reduced-motion: reduce`
- Video controls keyboard-accessible
- Alt text on all product/media images
- Focus states on interactive elements (shop links, locale selector)
