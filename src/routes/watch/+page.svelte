<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
	import { getProductsForVideo } from '$lib/data/catalog-helpers';
	import { locale } from '$lib/stores/locale.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Watch — Animal Garage</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">Watch</h1>
		<p class="mt-2 text-zinc-400">Full video hub — builds, events, and shop tours.</p>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading title="All Videos" subtitle="{data.videos.length} videos" />
	</AnimatedReveal>
	<!-- TODO: VideoGrid component -->
	<div class="grid gap-8 lg:grid-cols-2">
		{#each data.videos as video (video.id)}
			<div class="overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900">
				<div class="aspect-video">
					<iframe
						src="https://www.youtube.com/embed/{video.youtubeId}"
						title={video.title}
						class="h-full w-full"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				</div>
				<div class="p-6">
					<h3 class="font-display text-xl font-bold uppercase text-white">{video.title}</h3>
					<p class="mt-2 text-zinc-400">{video.description}</p>
					<span class="mt-2 inline-block text-xs text-zinc-500">{video.duration}</span>
					{#if getProductsForVideo(video).length > 0}
						<div class="mt-4 border-t border-zinc-800 pt-4">
							<p class="text-xs font-bold uppercase tracking-widest text-red-500">Shop This Video</p>
							<div class="mt-2 flex flex-wrap gap-2">
								{#each getProductsForVideo(video) as product (product.id)}
									<a href={resolve(`/shop/${product.slug}`)} class="rounded-sm border border-zinc-700 px-3 py-1 text-sm text-zinc-300 hover:border-red-600">
										{product.name} — {locale.formatPrice(product.pricing.priceRange.start.amount)}
									</a>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</section>
