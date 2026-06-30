# Responsive Design

Mobile-first Tailwind utilities throughout. No custom breakpoint config — uses Tailwind defaults.

## Breakpoints

| Prefix | Min width | Typical use                       |
| ------ | --------- | --------------------------------- |
| (none) | 0         | Mobile base styles                |
| `sm:`  | 640px     | Larger phones, small tablets      |
| `md:`  | 768px     | Tablet — desktop nav appears      |
| `lg:`  | 1024px    | Desktop grids (2-col collections) |
| `xl:`  | 1280px    | Wide layouts                      |
| `2xl:` | 1536px    | Extra-wide (rarely used)          |

## Mobile-first rule

Write base styles for mobile, then add breakpoint prefixes for larger screens:

```svelte
<!-- Header: mobile menu hidden on md+ -->
<nav class="hidden items-center gap-8 md:flex">

<!-- Hero headline scales up -->
<h1 class="text-5xl sm:text-7xl">

<!-- Page padding increases -->
<div class="px-4 sm:px-6 lg:px-8">

<!-- Footer stacks, then 3 columns -->
<div class="grid gap-8 md:grid-cols-3">
```

## Layout patterns

| Pattern             | Classes                      | File                   |
| ------------------- | ---------------------------- | ---------------------- |
| Max-width container | `mx-auto max-w-7xl`          | All pages              |
| 2-col on desktop    | `lg:grid-cols-2`             | Homepage brand section |
| Product grid        | `ProductGrid.svelte`         | Responsive auto-fill   |
| Fixed header        | `fixed inset-x-0 top-0 z-50` | Header.svelte          |
| Main offset         | `pt-[73px]`                  | +layout.svelte         |

## Navigation

- **Desktop (`md+`):** Horizontal nav in header
- **Mobile:** Hamburger button → slide-down menu
- Logo text hidden below `sm:` — shows `AG` badge only

## Images

- Hero: full-width background, `min-h-[85vh]`
- Product cards: `aspect-square` thumbnails
- Brand section: `aspect-[4/3]` with `object-cover`

## Testing responsive changes

1. `npm run dev` → resize browser or use DevTools device toolbar
2. Check at 375px (mobile), 768px (tablet), 1280px (desktop)
3. Verify fixed header doesn't overlap content
4. Verify mobile menu opens/closes and links work

## Do not

- Use fixed pixel widths for containers — use `max-w-*` + padding
- Hide critical content on mobile — hide decorative elements only
- Add breakpoint-specific duplicate markup unless nav patterns require it
