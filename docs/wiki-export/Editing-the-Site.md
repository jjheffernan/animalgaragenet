# Editing the Site

Copy-paste recipes for common changes. Routes live in `src/routes/`; shared UI in `src/lib/components/<domain>/` (see `src/lib/components/README.md` in the repo).

## Change hero text

**File:** `src/lib/components/marketing/Hero.svelte`

Edit eyebrow, headline, or subtext. CTA labels/links in same file (`Shop the Drop` → `/shop`, `Watch Builds` → `/media`).

## Add a product to mock data

**File:** `src/lib/data/mock/products.ts`

Add entry to `mockProducts` array using the `product()` helper. Slug becomes URL: `/shop/{slug}`.

Product types: `src/lib/types/saleor.ts`. Mock data mirrors Saleor shape for migration.

When `PUBLIC_SALEOR_API_URL` is set, catalog loaders in `src/lib/server/catalog/` fetch from Saleor instead — see [Saleor Integration](Saleor-Integration).

## Update footer / header links

- **Footer:** `src/lib/components/layout/Footer.svelte` — Explore column
- **Header:** `src/lib/components/layout/Header.svelte` — `links` array

Keep header and footer nav consistent.

## Change homepage section copy

**File:** `src/routes/+page.svelte`

Section headings use `SectionHeading`. Brand story paragraph inline in same file.

## Change site-wide title/meta

**File:** `src/routes/+layout.svelte` — default `<svelte:head>`. Individual pages override locally.

## Add a new page

1. Create folder under `src/routes/` (folder name = URL path).
2. Add `+page.svelte`:

```svelte
<script lang="ts">
	import SectionHeading from '$lib/components/shared/SectionHeading.svelte';
</script>

<svelte:head>
	<title>Contact — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
	<SectionHeading title="Contact" subtitle="Get in touch." />
</section>
```

3. Optional server data: `+page.server.ts` with `PageServerLoad`.
4. Add to `Header.svelte` and `Footer.svelte` nav.
5. Dynamic routes: `src/routes/shop/[slug]/+page.server.ts` receives `params.slug`.

Root layout wraps all pages with Header + Footer automatically.

## Add a new component

1. Create `src/lib/components/<domain>/MyComponent.svelte` (PascalCase; see README for folders).
2. Use Svelte 5 `$props()` with typed interface.
3. Style with Tailwind — dark surfaces `bg-zinc-900`, accent `text-red-500` / `bg-red-600` (see `docs/style-guide/frontend/how-to-change-styling.md`). Admin UI tokens: `src/lib/components/admin/admin-ui.ts`.
4. Import in page: `import MyComponent from '$lib/components/<domain>/MyComponent.svelte'`.
5. Extract when used on 2+ pages or complex; keep single-use markup inline.

Reference components: `shared/SectionHeading.svelte`, `catalog/ProductCard.svelte`, `catalog/ProductGrid.svelte`, `shared/AnimatedReveal.svelte`.

## Mock vs live swap points

Routes call helpers in `src/lib/server/catalog/` — not mock imports directly:

```typescript
import { getShopProducts } from '$lib/server/catalog/products';

export const load: PageServerLoad = async () => {
	const products = await getShopProducts();
	return { products };
};
```

`getShopProducts()`, `getPartsProducts()`, `getCollections()`, etc. call Saleor when `isSaleorEnabled()` and fall back to `src/lib/data/mock/*` on error or missing env.

### Still mock-only

- Homepage videos, UGC, builds, brands, campaigns
- Deal promo banners, blog/guides (Ghost when enabled)
- Related products on PDP, parts YMM filter against Saleor metadata

### Auth / content swap points

| Concern     | Mock                            | Live                                                     |
| ----------- | ------------------------------- | -------------------------------------------------------- |
| Auth        | `ag-session` cookie             | Supabase (`SUPABASE_DATABASE_URL` + `SUPABASE_ANON_KEY`) |
| Catalog     | `src/lib/data/mock/products.ts` | Saleor (`PUBLIC_SALEOR_API_URL`)                         |
| Blog/guides | `src/lib/data/mock/blog.ts`     | Ghost (`GHOST_URL`, `GHOST_CONTENT_API_KEY`)             |

## Verify changes

```bash
npm run dev
npm run check
npm run lint
npm run build
```
