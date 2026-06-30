<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
	import ListControls from '$lib/components/ListControls.svelte';

	let { data } = $props();
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

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading title="All Guides" subtitle="{data.pagination.total} articles" />
	</AnimatedReveal>
	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.guides as guide (guide.id)}
			<a href={resolve(`/guides/${guide.slug}`)} class="group block overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900">
				<img src={guide.heroImage} alt={guide.title} class="aspect-[16/9] w-full object-cover" loading="lazy" />
				<div class="p-4">
					<p class="text-xs font-bold uppercase tracking-widest text-red-500">{guide.category} · {guide.readTimeMinutes} min read</p>
					<h3 class="mt-1 font-medium text-white group-hover:text-red-400">{guide.title}</h3>
					<p class="mt-2 text-sm text-zinc-500">{guide.excerpt}</p>
				</div>
			</a>
		{/each}
	</div>
	<ListControls pagination={data.pagination} />
</section>
