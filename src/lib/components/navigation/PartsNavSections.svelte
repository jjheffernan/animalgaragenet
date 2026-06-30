<script lang="ts">
	import { resolve } from '$app/paths';
	import VehicleSelector from '$lib/components/catalog/VehicleSelector.svelte';
	import CategoryPill from '$lib/components/catalog/CategoryPill.svelte';
	import {
		buildPartsFilterUrl,
		PARTS_BUILD_TYPES,
		type PartsFilterState
	} from '$lib/data/parts-filters';
	import { categoryPillClass, ribbonSectionLabelClass } from '$lib/ui/catalog-ribbon';
	import type { Brand, PartCategory, PopularModel } from '$lib/types/domain';

	type Layout = 'megamenu' | 'dropdown' | 'mobile';
	type Section = 'categories' | 'brands' | 'vehicle' | 'build';

	interface Props {
		layout: Layout;
		section?: Section;
		categories: PartCategory[];
		brands: Brand[];
		popularModels: PopularModel[];
		filterHref?: (updates: Partial<PartsFilterState> & { resetPage?: boolean }) => string;
		isActiveFilter?: (key: string, value?: string) => boolean;
		onNavigate?: () => void;
		brandLimit?: number;
		modelLimit?: number;
	}

	let {
		layout,
		section = 'categories',
		categories,
		brands,
		popularModels,
		filterHref = (updates) => buildPartsFilterUrl('/parts', new URLSearchParams(), updates),
		isActiveFilter = () => false,
		onNavigate,
		brandLimit = brands.length,
		modelLimit = popularModels.length
	}: Props = $props();

	const visibleBrands = $derived(brands.slice(0, brandLimit));
	const sortedAlphabeticalBrands = $derived(
		[...brands]
			.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
			.slice(0, brandLimit)
	);
	const visibleModels = $derived(popularModels.slice(0, modelLimit));
	const isMegamenu = $derived(layout === 'megamenu');
	const isMobile = $derived(layout === 'mobile');

	function handleNavigate() {
		onNavigate?.();
	}
</script>

{#if isMegamenu && section === 'categories'}
	<div class="flex items-end justify-between gap-4">
		<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Categories</p>
		<a
			href={resolve('/parts')}
			class="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
			onclick={handleNavigate}
		>
			All parts →
		</a>
	</div>
	<ul class="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 lg:grid-cols-4">
		{#each categories as cat (cat.id)}
			<li>
				<a
					href={resolve(`/parts/${cat.slug}`)}
					class="block py-1 text-sm font-medium text-zinc-300 transition hover:text-red-400"
					role="menuitem"
					onclick={handleNavigate}
				>
					{cat.name}
				</a>
				{#if cat.children}
					<ul class="ml-3 space-y-0.5">
						{#each cat.children as child (child.id)}
							<li>
								<a
									href={resolve(`/parts/${child.slug}`)}
									class="block py-0.5 text-xs text-zinc-500 transition hover:text-red-400"
									role="menuitem"
									onclick={handleNavigate}
								>
									{child.name}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</li>
		{/each}
	</ul>
{:else if isMegamenu && section === 'brands'}
	<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Shop by Brand</p>
	<ul class="mt-2 grid grid-cols-2 gap-x-6 gap-y-0.5 sm:grid-cols-3 lg:grid-cols-4">
		{#each sortedAlphabeticalBrands as brand (brand.id)}
			<li>
				<a
					href={filterHref({ brand: brand.slug })}
					class="block py-1 text-sm text-zinc-300 transition hover:text-red-400"
					role="menuitem"
					onclick={handleNavigate}
				>
					{brand.name}
				</a>
			</li>
		{/each}
	</ul>
{:else if isMegamenu && section === 'vehicle'}
	<div class="grid gap-6 lg:grid-cols-2">
		<div>
			<p class="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">
				Year · Make · Model
			</p>
			<VehicleSelector compact />
		</div>
		<div>
			<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Popular Models</p>
			<ul class="mt-2 grid grid-cols-1 gap-0.5 sm:grid-cols-2">
				{#each visibleModels as model (model.id)}
					<li>
						<a
							href={filterHref({
								make: model.make,
								model: model.model,
								year: undefined,
								submodel: undefined
							})}
							class="block rounded-sm py-1 text-sm text-zinc-300 transition hover:text-red-400"
							role="menuitem"
							onclick={handleNavigate}
						>
							{model.name}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{:else if isMegamenu && section === 'build'}
	<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Shop by Build</p>
	<ul class="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
		{#each PARTS_BUILD_TYPES as build (build.slug)}
			<li>
				<a
					href={filterHref({ build: build.slug })}
					class="block rounded-sm border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 transition hover:border-red-600/40 hover:bg-zinc-900"
					role="menuitem"
					onclick={handleNavigate}
				>
					<span class="block text-sm font-medium uppercase tracking-wider text-zinc-200">
						{build.label}
					</span>
					<span class="mt-0.5 block text-xs text-zinc-500">{build.description}</span>
				</a>
			</li>
		{/each}
	</ul>
{:else if isMobile && section === 'categories'}
	<div class="flex items-end justify-between gap-4">
		<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Categories</p>
		<a
			href={resolve('/parts')}
			class="text-[10px] font-bold uppercase tracking-widest text-red-500 transition hover:text-red-400"
			onclick={handleNavigate}
		>
			All parts →
		</a>
	</div>
	<ul class="mt-2 max-h-64 space-y-0.5 overflow-y-auto">
		{#each categories as cat (cat.id)}
			<li>
				<a
					href={resolve(`/parts/${cat.slug}`)}
					class="block py-2.5 text-sm font-medium uppercase tracking-wider text-zinc-300 transition hover:text-red-400"
					role="menuitem"
					onclick={handleNavigate}
				>
					{cat.name}
				</a>
				{#if cat.children}
					<ul class="ml-3 space-y-0.5 border-l border-zinc-800/80 pl-3">
						{#each cat.children as child (child.id)}
							<li>
								<a
									href={resolve(`/parts/${child.slug}`)}
									class="block py-2 text-xs uppercase tracking-wider text-zinc-500 transition hover:text-red-400"
									role="menuitem"
									onclick={handleNavigate}
								>
									{child.name}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</li>
		{/each}
	</ul>
{:else if isMobile && section === 'brands'}
	<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Shop by Brand</p>
	<ul class="mt-2 max-h-64 space-y-0.5 overflow-y-auto">
		{#each sortedAlphabeticalBrands as brand (brand.id)}
			<li>
				<a
					href={filterHref({ brand: brand.slug })}
					class="block py-2.5 text-sm font-medium uppercase tracking-wider text-zinc-300 transition hover:text-red-400"
					role="menuitem"
					onclick={handleNavigate}
				>
					{brand.name}
				</a>
			</li>
		{/each}
	</ul>
{:else if isMobile && section === 'vehicle'}
	<p class="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">Year · Make · Model</p>
	<VehicleSelector compact />
	<p class="mb-2 mt-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Popular Models</p>
	<ul class="space-y-0.5">
		{#each visibleModels as model (model.id)}
			<li>
				<a
					href={filterHref({
						make: model.make,
						model: model.model,
						year: undefined,
						submodel: undefined
					})}
					class="block rounded-sm py-2.5 text-sm font-medium uppercase tracking-wider text-zinc-300 transition hover:text-red-400"
					role="menuitem"
					onclick={handleNavigate}
				>
					{model.name}
				</a>
			</li>
		{/each}
	</ul>
{:else if isMobile && section === 'build'}
	<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Shop by Build</p>
	<ul class="mt-2 space-y-2">
		{#each PARTS_BUILD_TYPES as build (build.slug)}
			<li>
				<a
					href={filterHref({ build: build.slug })}
					class="block rounded-sm border border-zinc-800 bg-zinc-900/50 px-3 py-3 transition hover:border-red-600/40 hover:bg-zinc-900"
					role="menuitem"
					onclick={handleNavigate}
				>
					<span class="block text-sm font-medium uppercase tracking-wider text-zinc-200">
						{build.label}
					</span>
					<span class="mt-0.5 block text-xs text-zinc-500">{build.description}</span>
				</a>
			</li>
		{/each}
	</ul>
{:else if section === 'categories'}
	<p class="px-4 pb-2 {ribbonSectionLabelClass}">Categories</p>
	<div class="flex max-h-80 flex-wrap gap-1 overflow-y-auto px-4 pb-3">
		{#each categories as cat (cat.id)}
			<CategoryPill
				href={resolve(`/parts/${cat.slug}`)}
				label={cat.name}
				onclick={handleNavigate}
			/>
			{#if cat.children}
				{#each cat.children as child (child.id)}
					<CategoryPill
						href={resolve(`/parts/${child.slug}`)}
						label={child.name}
						class="opacity-90"
						onclick={handleNavigate}
					/>
				{/each}
			{/if}
		{/each}
	</div>
{:else if section === 'brands'}
	<p class="px-4 pb-2 {ribbonSectionLabelClass}">Brands</p>
	<div class="flex max-h-72 flex-wrap gap-1 overflow-y-auto px-4 pb-3">
		{#each visibleBrands as brand (brand.id)}
			<CategoryPill
				href={filterHref({ brand: brand.slug })}
				label={brand.name}
				active={isActiveFilter('brand', brand.slug)}
				onclick={handleNavigate}
			/>
		{/each}
	</div>
{:else if section === 'vehicle'}
	<p class="mb-3 px-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
		Year · Make · Model
	</p>
	<div class="px-4">
		<VehicleSelector compact />
	</div>
	<p class="mb-2 mt-4 px-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
		Popular Models
	</p>
	<ul class="grid gap-1 px-4">
		{#each visibleModels as model (model.id)}
			<li role="none">
				<a
					href={filterHref({
						make: model.make,
						model: model.model,
						year: undefined,
						submodel: undefined
					})}
					role="menuitem"
					class="block rounded-sm px-2 py-1.5 text-sm text-zinc-300 transition hover:bg-zinc-900/80 hover:text-red-400"
					onclick={handleNavigate}
				>
					{model.name}
				</a>
			</li>
		{/each}
	</ul>
{:else if section === 'build'}
	<p class="px-4 pb-1 text-xs font-bold uppercase tracking-widest text-zinc-500">Build Type</p>
	<ul>
		{#each PARTS_BUILD_TYPES as build (build.slug)}
			<li role="none">
				<a
					href={filterHref({ build: build.slug })}
					role="menuitem"
					class="block px-4 py-2.5 transition hover:bg-zinc-900/80 {isActiveFilter(
						'build',
						build.slug
					)
						? 'bg-zinc-900/50'
						: ''}"
					onclick={handleNavigate}
				>
					<span
						class="block text-sm font-medium uppercase tracking-wider {isActiveFilter(
							'build',
							build.slug
						)
							? 'text-red-400'
							: 'text-zinc-300'}"
					>
						{build.label}
					</span>
					<span class="mt-0.5 block text-xs text-zinc-500">{build.description}</span>
				</a>
			</li>
		{/each}
	</ul>
{/if}
