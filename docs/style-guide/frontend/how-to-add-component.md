# How to Add a New Component

## 1. Create the file

Pick a **domain folder** under `src/lib/components/` (see `src/lib/components/README.md`):

```
src/lib/components/marketing/MyComponent.svelte   # homepage / promo
src/lib/components/catalog/MyComponent.svelte     # shop / parts UI
src/lib/components/shared/MyComponent.svelte      # tiny cross-route primitives
```

PascalCase filename matching the component's purpose.

## 2. Scaffold with Svelte 5 patterns

```svelte
<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
	}

	let { title, subtitle = '' }: Props = $props();
</script>

<div class="rounded-sm border border-zinc-800 bg-zinc-900 p-4">
	<h3 class="font-medium text-white">{title}</h3>
	{#if subtitle}
		<p class="mt-1 text-sm text-zinc-400">{subtitle}</p>
	{/if}
</div>
```

## 3. Use typed props from shared types

When rendering domain objects, import types:

```svelte
<script lang="ts">
	import type { Product } from '$lib/types/saleor';

	interface Props {
		product: Product;
	}

	let { product }: Props = $props();
</script>
```

## 4. Style with Tailwind

Match existing component patterns:

- Dark surfaces: `bg-zinc-900`, borders `border-zinc-800`
- Accent: `text-red-500`, hover `hover:text-red-400`
- Container spacing: `p-4`, `gap-6`

Add scoped `<style>` only for animations (see `AnimatedReveal.svelte`).

## 5. Import in a page

```svelte
<script lang="ts">
	import MyComponent from '$lib/components/marketing/MyComponent.svelte';
</script>

<MyComponent title="Hello" subtitle="World" />
```

## 6. Wrap with AnimatedReveal (optional)

For homepage-style entrance animations:

```svelte
<AnimatedReveal delay={100}>
	<MyComponent title="Hello" />
</AnimatedReveal>
```

## 7. Verify

```bash
npm run check
npm run lint
```

## When to extract vs inline

| Extract to component          | Keep inline in page        |
| ----------------------------- | -------------------------- |
| Used on 2+ pages              | Single-use layout          |
| Complex logic/styling         | Simple one-off markup      |
| Reusable pattern (card, grid) | Page-specific hero variant |

## Reference components

Study these for patterns:

- **Simple presentational:** `shared/SectionHeading.svelte`
- **Domain object display:** `catalog/ProductCard.svelte`
- **List wrapper:** `catalog/ProductGrid.svelte`
- **Animation wrapper:** `shared/AnimatedReveal.svelte`
- **Layout chrome:** `layout/Header.svelte`, `layout/Footer.svelte`
