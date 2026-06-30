<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Builds — Animal Garage</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">Build Threads</h1>
				<p class="mt-2 text-zinc-400">Real cars, real mods, real stories from the squad.</p>
			</div>
			<a href={resolve('/builds/submit')} class="rounded-sm bg-red-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-500">
				Submit Your Build
			</a>
		</div>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading title="All Builds" subtitle="{data.builds.length} threads" />
	</AnimatedReveal>
	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.builds as build (build.id)}
			<a href={resolve(`/builds/${build.slug}`)} class="group block overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900">
				<img src={build.photos[0]} alt={build.title} class="aspect-[16/10] w-full object-cover transition group-hover:scale-105" loading="lazy" />
				<div class="p-4">
					<p class="text-xs font-bold uppercase tracking-widest text-red-500">{build.year} {build.make} {build.model}</p>
					<h3 class="mt-1 font-display font-bold uppercase text-white">{build.title}</h3>
					<p class="mt-2 line-clamp-2 text-sm text-zinc-500">{build.description}</p>
				</div>
			</a>
		{/each}
	</div>
</section>
