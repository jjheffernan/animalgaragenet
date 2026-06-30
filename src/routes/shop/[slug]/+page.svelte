<script lang="ts">
	import { locale } from '$lib/stores/locale.svelte';
	import LocaleSelector from '$lib/components/LocaleSelector.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';

	let { data } = $props();
	const product = $derived(data.product);
</script>

<svelte:head>
	<title>{product.name} — Animal Garage</title>
</svelte:head>

{#if product}
	<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<nav class="mb-8 text-sm text-zinc-500">
			<a href="/shop" class="hover:text-red-500">Shop</a>
			<span class="mx-2">/</span>
			<span class="text-zinc-300">{product.name}</span>
		</nav>

		<div class="grid gap-12 lg:grid-cols-2">
			<AnimatedReveal>
				<div class="grid gap-4">
					<div class="overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900">
						{#if product.thumbnail}
							<img
								src={product.thumbnail.url}
								alt={product.thumbnail.alt}
								class="aspect-square w-full object-cover"
							/>
						{/if}
					</div>
					{#if product.media.length > 1}
						<div class="grid grid-cols-2 gap-4">
							{#each product.media.slice(1) as media (media.id)}
								<img
									src={media.url}
									alt={media.alt}
									class="aspect-square rounded-sm border border-zinc-800 object-cover"
									loading="lazy"
								/>
							{/each}
						</div>
					{/if}
				</div>
			</AnimatedReveal>

			<AnimatedReveal delay={150}>
				{#if product.category}
					<p class="text-xs font-bold uppercase tracking-widest text-red-500">
						{product.category.name}
					</p>
				{/if}
				<h1 class="mt-2 font-display text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
					{product.name}
				</h1>
				<p class="mt-4 text-2xl font-medium text-white">
					{locale.formatPrice(product.pricing.priceRange.start.amount)}
				</p>

				<div class="mt-6 flex items-center gap-4">
					<LocaleSelector />
				</div>

				<p class="mt-6 leading-relaxed text-zinc-400">{product.description}</p>

				<div class="mt-8 rounded-sm border border-zinc-800 bg-zinc-900/50 p-4">
					<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Shipping</p>
					<p class="mt-2 text-sm text-zinc-400">
						Available to: {locale.current.shippingRegions.join(', ')}. International rates calculated at
						checkout (Saleor).
					</p>
				</div>

				<button
					type="button"
					class="mt-8 w-full rounded-sm bg-red-600 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500 sm:w-auto"
					disabled
				>
					Add to Cart — Coming Soon
				</button>
			</AnimatedReveal>
		</div>
	</section>
{/if}
