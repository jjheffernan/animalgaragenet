<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/shared/SectionHeading.svelte';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
	import ListControls from '$lib/components/catalog/ListControls.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Blog — Animal Garage</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">Blog</h1>
		<p class="mt-2 text-zinc-400">News, drops, and shop updates.</p>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading title="Latest Posts" />
	</AnimatedReveal>
	<div class="grid gap-8 sm:grid-cols-2">
		{#each data.posts as post (post.id)}
			<a
				href={resolve(`/blog/${post.slug}`)}
				class="group block overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900"
			>
				<img
					src={post.heroImage}
					alt={post.title}
					class="aspect-[16/9] w-full object-cover"
					loading="lazy"
				/>
				<div class="p-6">
					<p class="text-xs text-zinc-500">{post.publishedAt} · {post.author}</p>
					<h3
						class="mt-2 font-display text-xl font-bold uppercase text-white group-hover:text-red-400"
					>
						{post.title}
					</h3>
					<p class="mt-2 text-zinc-400">{post.excerpt}</p>
					<div class="mt-3 flex gap-2">
						{#each post.tags as tag (tag)}
							<span class="rounded-sm bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500">{tag}</span>
						{/each}
					</div>
				</div>
			</a>
		{/each}
	</div>
	<ListControls pagination={data.pagination} />
</section>
