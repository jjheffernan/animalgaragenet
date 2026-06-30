# Component Conventions

## Location

All shared UI components live in:

```
src/lib/components/
```

Current components:

| Component               | Purpose                    |
| ----------------------- | -------------------------- |
| `AnimatedReveal.svelte` | Fade/slide reveal wrapper  |
| `CollectionCard.svelte` | Collection tile with image |
| `Footer.svelte`         | Site footer                |
| `Header.svelte`         | Fixed nav header           |
| `Hero.svelte`           | Homepage hero section      |
| `LocaleSelector.svelte` | Locale/currency picker     |
| `MediaGallery.svelte`   | Media grid                 |
| `ProductCard.svelte`    | Product tile for grids     |
| `ProductGrid.svelte`    | Responsive product grid    |
| `SectionHeading.svelte` | Section title + subtitle   |
| `CategoryPill.svelte`   | Catalog ribbon category link pill |
| `CatalogRibbonShell.svelte` | Sticky shop/parts ribbon wrapper |
| `PartsShoppingRibbon.svelte` | Parts PLP shopping ribbon |
| `PartsNavSections.svelte` | Shared parts nav panels (mega menu, ribbon, mobile) |

See [catalog-ribbons.md](./catalog-ribbons.md) for ribbon + pill styling rules.

Route-specific markup stays in `src/routes/**/+page.svelte`. Extract to `$lib/components/` when reused on 2+ pages.

## Naming

- **PascalCase** filenames: `ProductCard.svelte`
- **Descriptive nouns** — what it renders, not how (`Hero`, not `HomepageBanner`)
- One default export component per file
- Co-locate component-specific `<style>` blocks in the same file (see `AnimatedReveal.svelte`, `Hero.svelte`)

## Props pattern (Svelte 5)

Use `$props()` with a typed `Props` interface:

```svelte
<script lang="ts">
	import type { Product } from '$lib/types/saleor';

	interface Props {
		product: Product;
	}

	let { product }: Props = $props();
</script>
```

Optional props with defaults:

```svelte
interface Props {
	children: Snippet;
	class?: string;
	delay?: number;
}

let { children, class: className = '', delay = 0 }: Props = $props();
```

**Rules:**

- Rename `class` prop to `className` internally (Svelte reserved word)
- Use `Snippet` + `{@render children()}` for slot-like content
- Import types from `$lib/types/`, not inline duplicates

## Imports

```svelte
import ProductCard from '$lib/components/ProductCard.svelte'; import {locale} from '$lib/stores/locale.svelte';
import type {Product} from '$lib/types/saleor';
```

Path alias `$lib` → `src/lib` (configured in SvelteKit).

## Styling components

- **Tailwind utility classes** in markup — primary approach
- **Scoped `<style>`** only for animations or pseudo-elements Tailwind can't express cleanly
- No CSS modules, no separate `.css` files per component

## State & stores

- Local UI state: `$state()` in the component (e.g. `mobileOpen` in Header)
- Shared locale/currency: import `locale` from `$lib/stores/locale.svelte.ts`
- No global event buses or legacy Svelte stores (`writable`/`readable`)

## Export barrel

`src/lib/index.ts` exists but is minimal. Import components directly by path — no requirement to re-export through the barrel.
