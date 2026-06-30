# Catalog ribbons (shop + parts)

Shared patterns for **merch category ribbons** and **parts shopping ribbons** on desktop and mobile.

## Shared source of truth

| File | Purpose |
|------|---------|
| `src/lib/ui/catalog-ribbon.ts` | Tailwind class helpers (`categoryPillClass`, shell classes) |
| `src/lib/components/catalog/CategoryPill.svelte` | Category / filter link pill |
| `src/lib/components/catalog/CatalogRibbonShell.svelte` | Sticky ribbon wrapper (shop) |

**Rule:** Do not copy pill or shell classes inline — import from `catalog-ribbon.ts` or use the components.

## Visual spec

### Ribbon shell

```txt
sticky top-[var(--site-header-height)]
border-b border-zinc-800
bg-zinc-950/95 backdrop-blur
z-40
```

Inner container: `mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8`

Nav row: `flex gap-1 py-3` (wrap on narrow parts ribbon)

### Category pill (active + inactive)

| State | Classes |
|-------|---------|
| Base | `rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-widest` |
| Inactive | `text-zinc-400 hover:bg-zinc-800 hover:text-white` |
| Active / open | `bg-red-600 text-white` |

Use `categoryPillClass(active)` or `<CategoryPill href label active />`.

## Where used

| Surface | Component | Notes |
|---------|-----------|-------|
| `/shop` PLP | `CatalogRibbonShell` + `CategoryPill` | Horizontal category row |
| `/parts` PLP | `PartsShoppingRibbon` | Same shell + pills; dropdown triggers use `categoryPillClass(open)` |
| Parts dropdown panels | `PartsNavSections` `layout="dropdown"` | Categories/brands as pill grids |
| Header Parts mega menu | `MegaMenu` | Tab buttons use `categoryPillClass` |
| Mobile drawer Parts | `MobileNavDrawer` | Same tab pills as mega menu |

## Mobile vs desktop

- **Same pill tokens** on mobile and desktop; mobile may use horizontal scroll on tab rows (`overflow-x-auto`).
- Parts ribbon: `flex-wrap` on small screens so pills wrap like shop.
- Touch targets: pills already `py-2 px-4` (≥44px height with text).

## Adding a new ribbon

1. Use `CatalogRibbonShell` or `catalogRibbonShellClass` for sticky bar.
2. Use `CategoryPill` for selectable category links.
3. For dropdown sections, reuse `PartsNavSections` or `categoryPillClass`.
4. Update this doc if tokens change.

## Agent

Use the **`ui-consistency`** subagent (`.cursor/agents/ui-consistency.md`) when changing ribbons, nav tabs, or shared catalog UI.
