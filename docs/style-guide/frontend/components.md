# Component Conventions

## Location

Shared UI components live under domain folders:

```
src/lib/components/
  layout/ navigation/ catalog/ cart/ commerce/ content/
  marketing/ search/ video/ forms/ shared/ admin/
```

**Index:** `src/lib/components/README.md` (full list by folder).

Legacy flat imports (`$lib/components/Foo.svelte`) were removed in June 2026 — always import with the folder path, e.g. `$lib/components/catalog/ProductCard.svelte`.

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
import ProductCard from '$lib/components/catalog/ProductCard.svelte'; import type {Product} from '$lib/types/saleor';
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

## Paginated list canvas

| Component                    | Purpose                                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| `PaginatedListCanvas.svelte` | Wraps list content with top + bottom `ListControls`, optional `filters` snippet, optional `stickyTop` |
| `ListControls.svelte`        | Per-page select, view toggle (when `view` prop set), pagination nav                                   |

Use `PaginatedListCanvas` on every paginated PLP so filter toolbar and view toggles appear above the first page and below the last item (flanking pagination).

```svelte
<PaginatedListCanvas pagination={data.pagination} view={data.view} stickyTop="catalog">
	<ProductGrid products={data.products} view={data.view} />
</PaginatedListCanvas>
```

- **Top + bottom:** view toggle and per-page select render at top and bottom; page prev/next only at bottom.
- **Mobile:** controls center and wrap on small screens (`flex-wrap`, full-width rows).
- **`stickyTop`:** `'catalog'` (shop) or `'parts'` — pins top toolbar below header + ribbon; shop ribbon needs `syncHeightVar` on `CatalogRibbonShell`.

Optional page-level filters (e.g. media tabs) pass a `filters` snippet — rendered once above controls and once above bottom pagination.
