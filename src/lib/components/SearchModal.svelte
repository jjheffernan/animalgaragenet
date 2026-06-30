<script lang="ts">
	import { resolve } from '$app/paths';
	import { search } from '$lib/stores/search.svelte';
	import { searchProducts } from '$lib/data/mock-products';
	import { searchParts } from '$lib/data/mock-parts';
	import { searchBuilds } from '$lib/data/mock-builds';
	import { searchGuides } from '$lib/data/mock-guides';

	function handleBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) search.closeModal();
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			search.toggle();
		}
		if (e.key === 'Escape') search.closeModal();
	}

	const productResults = $derived(searchProducts(search.query).slice(0, 5));
	const partResults = $derived(searchParts(search.query).slice(0, 5));
	const buildResults = $derived(searchBuilds(search.query).slice(0, 3));
	const guideResults = $derived(searchGuides(search.query).slice(0, 3));
	const hasResults = $derived(
		search.query.length > 0 &&
			(productResults.length + partResults.length + buildResults.length + guideResults.length > 0)
	);

	let inputEl = $state<HTMLInputElement | undefined>();

	$effect(() => {
		if (search.open) {
			inputEl?.focus();
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if search.open}
	<div
		class="fixed inset-0 z-[70] flex items-start justify-center bg-zinc-950/80 px-4 pt-[15vh] backdrop-blur-sm"
		role="presentation"
		onclick={handleBackdrop}
	>
		<div
			class="w-full max-w-xl rounded-sm border border-zinc-800 bg-zinc-950 shadow-2xl"
			role="dialog"
			aria-label="Search"
		>
			<div class="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
				<svg class="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<input
					bind:this={inputEl}
					type="search"
					bind:value={search.query}
					placeholder="Search products, parts, builds, guides…"
					class="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none"
				/>
				<kbd class="hidden rounded-sm border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-500 sm:inline">ESC</kbd>
			</div>

			<div class="max-h-[50vh] overflow-y-auto p-4">
				{#if search.query.length === 0}
					<p class="text-sm text-zinc-500">Start typing to search the garage…</p>
				{:else if !hasResults}
					<p class="text-sm text-zinc-500">No results for "{search.query}"</p>
				{:else}
					{#if productResults.length > 0}
						<p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Shop</p>
						<ul class="mt-2 space-y-1">
							{#each productResults as p (p.id)}
								<li>
									<a
										href={resolve(`/shop/${p.slug}`)}
										class="block rounded-sm px-2 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
										onclick={() => search.closeModal()}
									>
										{p.name}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
					{#if partResults.length > 0}
						<p class="mt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Parts</p>
						<ul class="mt-2 space-y-1">
							{#each partResults as p (p.id)}
								<li>
									<a
										href={resolve(`/parts/${p.category?.slug}/${p.slug}`)}
										class="block rounded-sm px-2 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
										onclick={() => search.closeModal()}
									>
										{p.name}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
					{#if buildResults.length > 0}
						<p class="mt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Builds</p>
						<ul class="mt-2 space-y-1">
							{#each buildResults as b (b.id)}
								<li>
									<a
										href={resolve(`/builds/${b.slug}`)}
										class="block rounded-sm px-2 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
										onclick={() => search.closeModal()}
									>
										{b.title}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
					{#if guideResults.length > 0}
						<p class="mt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Guides</p>
						<ul class="mt-2 space-y-1">
							{#each guideResults as g (g.id)}
								<li>
									<a
										href={resolve(`/guides/${g.slug}`)}
										class="block rounded-sm px-2 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
										onclick={() => search.closeModal()}
									>
										{g.title}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				{/if}
			</div>
		</div>
	</div>
{/if}
