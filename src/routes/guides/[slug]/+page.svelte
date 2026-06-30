<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
	import RichContent from '$lib/components/content/RichContent.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.guide.title} — Animal Garage Guides</title>
	<meta name="description" content={data.guide.excerpt} />
</svelte:head>

<article>
	<section class="relative border-b border-zinc-800 py-20">
		<img src={data.guide.heroImage} alt="" class="absolute inset-0 h-full w-full object-cover opacity-30" />
		<div class="absolute inset-0 bg-gradient-to-b from-zinc-950/60 to-zinc-950"></div>
		<div class="relative mx-auto max-w-3xl px-4 sm:px-6">
			<nav class="mb-6 text-sm text-zinc-500">
				<a href={resolve('/guides')} class="hover:text-red-500">Guides</a>
				<span class="mx-2">/</span>
				<span class="text-zinc-300">{data.guide.title}</span>
			</nav>
			<p class="text-xs font-bold uppercase tracking-widest text-red-500">{data.guide.category} · {data.guide.readTimeMinutes} min read</p>
			<h1 class="mt-2 font-display text-4xl font-bold uppercase text-white">{data.guide.title}</h1>
			<p class="mt-4 text-lg text-zinc-400">{data.guide.excerpt}</p>
		</div>
	</section>

	<section class="mx-auto max-w-3xl px-4 py-16 sm:px-6">
		<AnimatedReveal>
			<RichContent html={data.guide.html} content={data.guide.content} />
		</AnimatedReveal>
	</section>

	{#if data.related.length > 0}
		<section class="border-t border-zinc-800 bg-zinc-900/30 py-16">
			<div class="mx-auto max-w-3xl px-4 sm:px-6">
				<h2 class="font-display text-xl font-bold uppercase text-white">Related Guides</h2>
				<div class="mt-6 grid gap-4 sm:grid-cols-2">
					{#each data.related as guide (guide.id)}
						<a href={resolve(`/guides/${guide.slug}`)} class="rounded-sm border border-zinc-800 bg-zinc-900 p-4 hover:border-red-600/50">
							<h3 class="font-medium text-white">{guide.title}</h3>
							<p class="mt-1 text-sm text-zinc-500">{guide.excerpt}</p>
						</a>
					{/each}
				</div>
			</div>
		</section>
	{/if}
</article>
