<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/shared/SectionHeading.svelte';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
	import PaginatedListCanvas from '$lib/components/catalog/PaginatedListCanvas.svelte';
	import CatalogRibbonShell from '$lib/components/catalog/CatalogRibbonShell.svelte';
	import CategoryPill from '$lib/components/catalog/CategoryPill.svelte';
	import type { GuideFilterOption } from '$lib/server/ghost/guide-filters';
	import { catalogRibbonNavClass } from '$lib/ui/catalog-ribbon';

	let { data } = $props();

	function buildGuideHref(updates: { category?: string; topic?: string }): string {
		const params = new URLSearchParams();
		const category = updates.category ?? data.category.slug;
		const topic = updates.topic ?? data.topic.slug;

		if (category !== 'all') params.set('category', category);
		if (topic !== 'all') params.set('topic', topic);

		const qs = params.toString();
		return qs ? resolve(`/guides?${qs}`) : resolve('/guides');
	}

	function categoryHref(cat: GuideFilterOption) {
		return buildGuideHref({ category: cat.slug });
	}

	function topicHref(topic: GuideFilterOption) {
		return buildGuideHref({ topic: topic.slug });
	}

	const topicOptions = $derived(
		data.topics.length > 0 ? [{ slug: 'all', label: 'ALL' } as GuideFilterOption, ...data.topics] : []
	);

	const sectionTitle = $derived(
		data.category.slug === 'all' && data.topic.slug === 'all'
			? 'All Guides'
			: [data.category.slug !== 'all' ? data.category.label : null, data.topic.slug !== 'all' ? data.topic.label : null]
					.filter(Boolean)
					.join(' · ') || 'All Guides'
	);
</script>

<svelte:head>
	<title>Guides — Animal Garage</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">Guides</h1>
		<p class="mt-2 text-zinc-400">Pillar content — learn before you wrench.</p>
	</div>
</section>

<div>
	<CatalogRibbonShell ariaLabel="Guide categories">
		<nav class={catalogRibbonNavClass} aria-label="Guide categories">
			{#each data.categories as cat (cat.slug)}
				<CategoryPill
					href={categoryHref(cat)}
					label={cat.label}
					active={data.category.slug === cat.slug}
				/>
			{/each}
		</nav>
	</CatalogRibbonShell>

	{#if topicOptions.length > 0}
		<CatalogRibbonShell ariaLabel="Guide topics">
			<nav class={catalogRibbonNavClass} aria-label="Guide topics">
				{#each topicOptions as topic (topic.slug)}
					<CategoryPill
						href={topicHref(topic)}
						label={topic.label}
						active={data.topic.slug === topic.slug}
					/>
				{/each}
			</nav>
		</CatalogRibbonShell>
	{/if}

	<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
		<AnimatedReveal>
			<SectionHeading title={sectionTitle} subtitle="{data.pagination.total} articles" />
		</AnimatedReveal>
		<PaginatedListCanvas pagination={data.pagination}>
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.guides as guide (guide.id)}
					<a
						href={resolve(`/guides/${guide.slug}`)}
						class="group block overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900"
					>
						<img
							src={guide.heroImage}
							alt={guide.title}
							class="aspect-[16/9] w-full object-cover"
							loading="lazy"
						/>
						<div class="p-4">
							<p class="text-xs font-bold uppercase tracking-widest text-red-500">
								{guide.category} · {guide.readTimeMinutes} min read
							</p>
							<h3 class="mt-1 font-medium text-white group-hover:text-red-400">{guide.title}</h3>
							<p class="mt-2 text-sm text-zinc-500">{guide.excerpt}</p>
						</div>
					</a>
				{/each}
			</div>
		</PaginatedListCanvas>
	</section>
</div>
