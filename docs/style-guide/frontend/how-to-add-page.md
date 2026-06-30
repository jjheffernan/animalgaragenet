# How to Add a New Page

Step-by-step guide for adding a route to the SvelteKit app.

## 1. Create the route folder

Routes live in `src/routes/`. Folder name = URL path.

| URL             | Folder                              |
| --------------- | ----------------------------------- |
| `/contact`      | `src/routes/contact/`               |
| `/shop/sale`    | `src/routes/shop/sale/`             |
| `/blog/my-post` | `src/routes/blog/[slug]/` (dynamic) |

## 2. Create `+page.svelte`

Minimal static page:

```svelte
<script lang="ts">
	import SectionHeading from '$lib/components/shared/SectionHeading.svelte';
</script>

<svelte:head>
	<title>Contact — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
	<SectionHeading title="Contact" subtitle="Get in touch." />
	<p class="text-zinc-400">Content here.</p>
</section>
```

The root layout (`+layout.svelte`) wraps all pages with Header + Footer automatically.

## 3. Add server data (optional)

If the page needs data fetched at request time, add `+page.server.ts`:

```typescript
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { items: [] };
};
```

Access in the page via `$props()` (Svelte 5):

```svelte
<script lang="ts">
	let { data } = $props();
</script>
```

Or use the traditional pattern with `export let data` — but this project prefers `$props()` for new code.

**Note:** SvelteKit page data is typically accessed as:

```svelte
<script lang="ts">
	let { data } = $props();
</script>
```

## 4. Add to navigation

Update both:

- `src/lib/components/layout/Header.svelte` — add to `links` array
- `src/lib/components/layout/Footer.svelte` — add to Explore list

## 5. Dynamic routes

For `/shop/[slug]`-style pages:

```
src/routes/shop/[slug]/+page.svelte
src/routes/shop/[slug]/+page.server.ts
```

Server load receives `params.slug`:

```typescript
export const load: PageServerLoad = async ({ params }) => {
	// fetch by params.slug
};
```

See existing: `src/routes/shop/[slug]/+page.server.ts`

## 6. Verify

```bash
npm run dev
# Visit http://localhost:5173/your-page
npm run check
npm run build
```

## Examples in codebase

| Route          | Files                             |
| -------------- | --------------------------------- |
| `/`            | `src/routes/+page.svelte`         |
| `/shop`        | `+page.svelte`, `+page.server.ts` |
| `/shop/[slug]` | `+page.svelte`, `+page.server.ts` |
| `/about`       | `src/routes/about/+page.svelte`   |
| `/media`       | `src/routes/media/+page.svelte`   |

## Do not

- Create pages outside `src/routes/`
- Duplicate Header/Footer — layout handles it
- Put server secrets in `+page.svelte` — use `+page.server.ts` or `+server.ts`
