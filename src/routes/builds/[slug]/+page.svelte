<script lang="ts">
	import { resolve } from '$app/paths';
	import ProductGrid from '$lib/components/catalog/ProductGrid.svelte';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';

	let { data } = $props();
	let selectedPhoto = $state(0);
</script>

<svelte:head>
	<title>{data.build.title} — Animal Garage Builds</title>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<nav class="mb-8 text-sm text-zinc-500">
		<a href={resolve('/builds')} class="hover:text-red-500">Builds</a>
		<span class="mx-2">/</span>
		<span class="text-zinc-300">{data.build.title}</span>
	</nav>

	<div class="grid gap-12 lg:grid-cols-2">
		<AnimatedReveal>
			<div class="grid gap-4">
				<img
					src={data.build.photos[selectedPhoto]}
					alt={data.build.title}
					class="aspect-[16/10] w-full rounded-sm border border-zinc-800 object-cover"
				/>
				{#if data.build.photos.length > 1}
					<div class="grid grid-cols-4 gap-2">
						{#each data.build.photos as photo, i (photo)}
							<button
								type="button"
								onclick={() => (selectedPhoto = i)}
								class="overflow-hidden rounded-sm border {selectedPhoto === i
									? 'border-red-600'
									: 'border-zinc-800'}"
							>
								<img src={photo} alt="" class="aspect-square w-full object-cover" loading="lazy" />
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</AnimatedReveal>

		<AnimatedReveal delay={150}>
			<p class="text-xs font-bold uppercase tracking-widest text-red-500">
				{data.build.year}
				{data.build.make}
				{data.build.model}{data.build.submodel ? ` ${data.build.submodel}` : ''}
			</p>
			<h1 class="mt-2 font-display text-4xl font-bold uppercase text-white">{data.build.title}</h1>
			<p class="mt-4 leading-relaxed text-zinc-400">{data.build.description}</p>

			<div class="mt-8">
				<h2 class="text-sm font-bold uppercase tracking-widest text-zinc-500">Mod List</h2>
				<ul class="mt-3 space-y-2">
					{#each data.build.modList as mod (mod)}
						<li class="flex items-center gap-2 text-zinc-300">
							<span class="text-red-500">→</span>
							{mod}
						</li>
					{/each}
				</ul>
			</div>
		</AnimatedReveal>
	</div>
</section>

{#if data.products.length > 0}
	<section class="border-t border-zinc-800 bg-zinc-900/30 py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h2 class="mb-8 font-display text-2xl font-bold uppercase text-white">Shop This Build</h2>
			<ProductGrid products={data.products} />
		</div>
	</section>
{/if}
