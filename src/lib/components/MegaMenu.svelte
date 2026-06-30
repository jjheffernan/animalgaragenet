<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import PartsNavSections from '$lib/components/PartsNavSections.svelte';
	import { buildPartsFilterUrl } from '$lib/data/parts-filters';
	import { categoryPillClass } from '$lib/ui/catalog-ribbon';
	import { resolvePath } from '$lib/utils/paths';

	interface Props {
		type: 'shop' | 'parts';
		open?: boolean;
		onclose?: () => void;
		onhover?: () => void;
		onleave?: () => void;
	}

	type PartsTab = 'categories' | 'vehicle' | 'brands' | 'build';

	let { type, open = false, onclose, onhover, onleave }: Props = $props();

	const partsTabs: { id: PartsTab; label: string }[] = [
		{ id: 'categories', label: 'Shop by Category' },
		{ id: 'vehicle', label: 'Shop by Vehicle' },
		{ id: 'brands', label: 'Shop by Brand' },
		{ id: 'build', label: 'Shop by Build' }
	];

	let activePartsTab = $state<PartsTab>('categories');

	$effect(() => {
		if (!open) {
			activePartsTab = 'categories';
		}
	});

	const shopCategories = [
		{ label: 'All Shop', href: '/shop' },
		{ label: 'Tees', href: '/shop?category=TEES' },
		{ label: 'Hoodies', href: '/shop?category=SWEATSHIRTS' },
		{ label: 'Jackets', href: '/shop?category=JACKETS' },
		{ label: 'Headwear', href: '/shop?category=HEADWEAR' },
		{ label: 'Accessories', href: '/shop?category=ACCESSORIES' },
		{ label: 'Home', href: '/shop?category=HOME' },
		{ label: 'Auto', href: '/shop?category=AUTO' },
		{ label: 'Gift Cards', href: '/gift-cards' }
	];

	const collections = $derived($page.data.shopCollections ?? []);
	const partsNav = $derived($page.data.partsNav);

	function partsFilterHref(updates: Parameters<typeof buildPartsFilterUrl>[2]) {
		return resolvePath(buildPartsFilterUrl('/parts', new URLSearchParams(), updates));
	}
</script>

{#if open}
	<div
		class="absolute inset-x-0 top-full z-50 pt-1"
		role="presentation"
		onmouseenter={onhover}
		onmouseleave={onleave}
	>
		<div class="border-b border-zinc-800 bg-zinc-950 shadow-2xl" role="menu">
			<div class="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
				{#if type === 'shop'}
					<div>
						<div class="flex items-end justify-between gap-4">
							<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Categories</p>
							<a
								href={resolve('/shop')}
								class="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
							>
								All shop →
							</a>
						</div>
						<ul class="mt-2 grid grid-cols-3 gap-x-4 gap-y-0.5 sm:grid-cols-4 lg:grid-cols-5">
							{#each shopCategories as cat (cat.href)}
								<li>
									<a
										href={resolvePath(cat.href)}
										class="block py-1 text-sm font-medium text-zinc-300 transition hover:text-red-400"
										role="menuitem"
									>
										{cat.label}
									</a>
								</li>
							{/each}
						</ul>

						{#if collections.length > 0}
							<div class="mt-3 border-t border-zinc-800/80 pt-3">
								<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Collections</p>
								<ul class="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
									{#each collections as col (col.id)}
										<li class="shrink-0">
											<a
												href={resolvePath(`/shop?collection=${col.slug}`)}
												class="block rounded-sm border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-red-600/40 hover:text-red-400"
												role="menuitem"
											>
												{col.name}
											</a>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
				{:else if partsNav}
					<div
						class="mb-3 flex flex-wrap gap-1 border-b border-zinc-800 pb-3"
						role="tablist"
						aria-label="Parts shopping modes"
					>
						{#each partsTabs as tab (tab.id)}
							<button
								type="button"
								role="tab"
								aria-selected={activePartsTab === tab.id}
								class={categoryPillClass(activePartsTab === tab.id)}
								onclick={() => (activePartsTab = tab.id)}
							>
								{tab.label}
							</button>
						{/each}
					</div>
					<div role="tabpanel">
						<PartsNavSections
							layout="megamenu"
							section={activePartsTab}
							categories={partsNav.categories}
							brands={partsNav.brands}
							popularModels={partsNav.popularModels}
							filterHref={partsFilterHref}
							onNavigate={onclose}
						/>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
