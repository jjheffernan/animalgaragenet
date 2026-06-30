<script lang="ts">
	import { resolve } from '$app/paths';
	import { locale } from '$lib/stores/locale.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import LocaleSelector from '$lib/components/navigation/LocaleSelector.svelte';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
	import PageMeta from '$lib/components/shared/PageMeta.svelte';
	import { metaDescriptionFromText } from '$lib/seo/site-meta';
	import MiniProductRow from '$lib/components/catalog/MiniProductRow.svelte';
	import PriceDisplay from '$lib/components/catalog/PriceDisplay.svelte';
	import CatalogKindBadge from '$lib/components/catalog/CatalogKindBadge.svelte';
	import type { Fitment } from '$lib/types/saleor';

	let { data } = $props();
	const product = $derived(data.product);
	const soldOut = $derived(!product.isAvailableForPurchase);

	let selectedVariantId = $state('');
	$effect(() => {
		selectedVariantId = product.variants[0]?.id ?? '';
	});

	function addToCart() {
		if (soldOut || !selectedVariantId) return;
		cart.addItem(product.id, selectedVariantId);
		cart.openDrawer();
	}

	let selectedImage = $state(0);
	const images = $derived(
		product.media.length > 0 ? product.media : product.thumbnail ? [product.thumbnail] : []
	);

	let notifyEmail = $state('');
	function submitNotify(e: Event) {
		e.preventDefault();
		notifyEmail = '';
	}

	function formatFitmentGroup(fitment: Fitment[]): string {
		const years = fitment.map((f) => f.year).sort((a, b) => a - b);
		const first = fitment[0];
		const yearRange =
			years.length > 1 ? `${years[0]}–${years[years.length - 1]}` : String(years[0]);
		const sub = first.submodel ? ` ${first.submodel}` : '';
		return `${yearRange} ${first.make} ${first.model}${sub}`;
	}

	const fitmentGroups = $derived.by(() => {
		if (!product.fitment?.length) return [];
		const groups = new Map<string, Fitment[]>();
		for (const f of product.fitment) {
			const key = `${f.make}|${f.model}|${f.submodel ?? ''}`;
			const list = groups.get(key) ?? [];
			list.push(f);
			groups.set(key, list);
		}
		return [...groups.values()].map(formatFitmentGroup);
	});

	const productDescription = $derived(
		metaDescriptionFromText(product.description || `${product.name} — Animal Garage parts.`)
	);
	const productOgImage = $derived(product.thumbnail?.url ?? product.media[0]?.url ?? undefined);
</script>

<PageMeta
	title={`${product.name} — Animal Garage Parts`}
	description={productDescription}
	image={productOgImage}
/>

<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<nav class="mb-8 text-sm text-zinc-500">
		<a href={resolve('/parts')} class="hover:text-red-500">Parts</a>
		{#if product.category}
			<span class="mx-2">/</span>
			<a href={resolve(`/parts/${product.category.slug}`)} class="hover:text-red-500"
				>{product.category.name}</a
			>
		{/if}
		<span class="mx-2">/</span>
		<span class="text-zinc-300">{product.name}</span>
	</nav>

	<div class="grid gap-12 lg:grid-cols-2">
		<AnimatedReveal>
			<div class="grid gap-4">
				<div class="overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900">
					{#if images[selectedImage]}
						<img
							src={images[selectedImage].url}
							alt={images[selectedImage].alt}
							class="aspect-square w-full object-cover"
						/>
					{/if}
				</div>
				{#if images.length > 1}
					<div class="grid grid-cols-4 gap-2">
						{#each images as img, i (img.id)}
							<button
								type="button"
								onclick={() => (selectedImage = i)}
								class="overflow-hidden rounded-sm border {selectedImage === i
									? 'border-red-600'
									: 'border-zinc-800'}"
							>
								<img
									src={img.url}
									alt={img.alt}
									class="aspect-square w-full object-cover"
									loading="lazy"
								/>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</AnimatedReveal>

		<AnimatedReveal delay={150}>
			<div class="flex items-center gap-2">
				{#if product.category}
					<p class="text-xs font-bold uppercase tracking-widest text-red-500">
						{product.category.name}
					</p>
				{/if}
				<CatalogKindBadge {product} />
			</div>
			<h1
				class="mt-2 font-display text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl"
			>
				{product.name}
			</h1>

			{#if product.brand}
				<p class="mt-3">
					<a
						href={resolve(`/brands/${product.brand.slug}`)}
						class="text-sm font-medium uppercase tracking-wider text-zinc-400 hover:text-red-400"
					>
						{product.brand.name}
					</a>
				</p>
			{/if}

			<div class="mt-4">
				<PriceDisplay {product} />
			</div>
			{#if soldOut}
				<span
					class="mt-2 inline-block rounded-sm bg-zinc-950 px-3 py-1 text-xs font-bold uppercase text-white"
					>Sold Out</span
				>
			{/if}

			<div class="mt-6 flex items-center gap-4">
				<LocaleSelector />
			</div>

			{#if product.variants.length > 1}
				<div class="mt-6">
					<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Variant</p>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each product.variants as variant (variant.id)}
							<button
								type="button"
								onclick={() => (selectedVariantId = variant.id)}
								class="rounded-sm border px-4 py-2 text-sm transition {selectedVariantId ===
								variant.id
									? 'border-red-600 bg-red-600/10 text-white'
									: 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}"
							>
								{variant.name}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<p class="mt-6 leading-relaxed text-zinc-400">{product.description}</p>

			{#if fitmentGroups.length > 0}
				<div class="mt-8 rounded-sm border border-zinc-800 bg-zinc-900/50 p-4">
					<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Vehicle Fitment</p>
					<ul class="mt-3 space-y-1">
						{#each fitmentGroups as group (group)}
							<li class="text-sm text-zinc-300">✓ {group}</li>
						{/each}
					</ul>
					<p class="mt-3 text-xs text-zinc-600">
						Verify fitment for your exact trim before ordering. Contact us if you are unsure.
					</p>
				</div>
			{/if}

			{#if soldOut}
				<form
					class="mt-8 rounded-sm border border-zinc-800 bg-zinc-900/50 p-4"
					onsubmit={submitNotify}
				>
					<p class="text-sm font-bold uppercase tracking-widest text-zinc-300">
						Notify Me When Available
					</p>
					<div class="mt-3 flex gap-2">
						<input
							type="email"
							bind:value={notifyEmail}
							required
							placeholder="Email"
							class="flex-1 rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
						/>
						<button
							type="submit"
							class="rounded-sm bg-red-600 px-4 py-2 text-sm font-bold uppercase text-white hover:bg-red-500"
							>Notify</button
						>
					</div>
				</form>
			{:else}
				<button
					type="button"
					onclick={addToCart}
					class="mt-8 w-full rounded-sm bg-red-600 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500 sm:w-auto"
				>
					Add to Cart — {locale.formatPrice(
						product.pricing.priceRange.start.amount,
						product.pricing.priceRange.start.currency
					)}
				</button>
			{/if}

			<div class="mt-10 grid gap-3 sm:grid-cols-2">
				{#each ['Fitment verified by crew', 'Fast ship on in-stock parts', 'Easy returns', 'Secure checkout'] as perk (perk)}
					<p class="text-xs text-zinc-500">✓ {perk}</p>
				{/each}
			</div>
		</AnimatedReveal>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
	<MiniProductRow products={data.related} title="Related Parts" limit={4} />
</section>
