# Quick Start — Common Tasks

Copy-paste recipes for the most frequent changes. Each task points to real files.

## Change hero text

**File:** `src/lib/components/Hero.svelte`

1. Open the component.
2. Edit the eyebrow (`Built Different`), headline (`Garage Culture Delivered`), or subtext paragraph.
3. Save — Vite hot-reloads automatically with `npm run dev`.

Example — change the headline:

```svelte
<h1 class="mt-4 max-w-3xl font-display text-5xl ...">
	Garage<br /><span class="text-red-600">Culture</span><br />Delivered
</h1>
```

CTA button labels and links are in the same file (`Shop the Drop` → `/shop`, `Watch Builds` → `/media`).

## Add a product to mock data

**File:** `src/lib/data/mock-products.ts`

1. Add a new entry to the `mockProducts` array using the `product()` helper.
2. Provide: id, name, slug, price, seed (for picsum image), description, category.
3. The slug becomes the URL: `/shop/{slug}`.

Example:

```typescript
product(
	'9',
	'Shift Knob',
	'shift-knob',
	42,
	109,
	'Billet aluminum shift knob with engraved AG logo.',
	'Accessories'
);
```

4. Optionally expose it on the homepage by adjusting `getFeaturedProducts()` count or order.

Product types are defined in `src/lib/types/saleor.ts`. Mock data mirrors Saleor's shape for easy migration.

## Update footer links

**File:** `src/lib/components/Footer.svelte`

The **Explore** column lists nav links:

```svelte
<li><a href="/shop" class="hover:text-red-500">Shop</a></li>
<li><a href="/media" class="hover:text-red-500">Media</a></li>
<li><a href="/about" class="hover:text-red-500">About</a></li>
```

Add, remove, or change `href` and label text. Match header links in `src/lib/components/Header.svelte` for consistency.

## Change homepage section copy

**File:** `src/routes/+page.svelte`

Section headings use `SectionHeading`:

```svelte
<SectionHeading title="Featured Collections" subtitle="Curated drops from the shop floor." />
```

Brand story paragraph and links are inline in the same file (~lines 55–65).

## Change site-wide title/meta

**File:** `src/routes/+layout.svelte`

Default `<title>` and `<meta name="description">` live in `<svelte:head>`. Individual pages override with their own `<svelte:head>` blocks.

## Run checks before committing

```bash
npm run check   # TypeScript + Svelte
npm run lint    # Prettier + ESLint
npm run build   # Production build
```
