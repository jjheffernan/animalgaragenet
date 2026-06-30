<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
	import RichContent from '$lib/components/content/RichContent.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.post.title} — Animal Garage Blog</title>
	<meta name="description" content={data.post.excerpt} />
</svelte:head>

<article>
	<section class="relative border-b border-zinc-800 py-20">
		<img src={data.post.heroImage} alt="" class="absolute inset-0 h-full w-full object-cover opacity-30" />
		<div class="absolute inset-0 bg-gradient-to-b from-zinc-950/60 to-zinc-950"></div>
		<div class="relative mx-auto max-w-3xl px-4 sm:px-6">
			<nav class="mb-6 text-sm text-zinc-500">
				<a href={resolve('/blog')} class="hover:text-red-500">Blog</a>
				<span class="mx-2">/</span>
				<span class="text-zinc-300">{data.post.title}</span>
			</nav>
			<p class="text-xs text-zinc-500">{data.post.publishedAt} · {data.post.author}</p>
			<h1 class="mt-2 font-display text-4xl font-bold uppercase text-white">{data.post.title}</h1>
		</div>
	</section>

	<section class="mx-auto max-w-3xl px-4 py-16 sm:px-6">
		<AnimatedReveal>
			<RichContent html={data.post.html} content={data.post.content} />
			<div class="mt-8 flex gap-2">
				{#each data.post.tags as tag (tag)}
					<span class="rounded-sm bg-zinc-800 px-2 py-1 text-xs text-zinc-500">{tag}</span>
				{/each}
			</div>
		</AnimatedReveal>
	</section>
</article>
