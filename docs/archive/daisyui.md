**Status:** Stale  
**Archived:** 2026-06-30  
**See instead:** [design-tokens.md](../style-guide/frontend/design-tokens.md) (Tailwind zinc styling)

# daisyUI — removed

**Status:** Deprecated / removed (June 2026)

The Animal Garage storefront uses **pure Tailwind zinc styling** again — no daisyUI plugin or component classes (`btn`, `badge`, `card`, `collapse`, `menu`, `base-*`, etc.).

## Current approach

- `src/routes/layout.css` — plain `@import 'tailwindcss'` + `@theme` brand tokens only
- Surfaces: `bg-zinc-950`, `bg-zinc-900`, `border-zinc-800`
- Text: `text-zinc-100`, `text-zinc-400`, `hover:text-red-400`
- CTAs: `bg-red-600`, `hover:bg-red-500`, `rounded-sm`, uppercase tracking

## Agent skill (reference only)

The daisyUI agent skill remains at `agents/daisyui` for future reference. It is **not** used by the live storefront.

```bash
npx skills add saadeghi/daisyui
```

## History

daisyUI 5 was briefly adopted with custom `animalgarage-light` / `animalgarage-dark` themes, `ThemeToggle`, and semantic `base-*` tokens. That experiment was reverted in favor of the original pit-lane zinc aesthetic.

## References

- [AG design tokens](./style-guide/frontend/design-tokens.md)
- [daisyUI docs](https://daisyui.com/) (external, not installed)
