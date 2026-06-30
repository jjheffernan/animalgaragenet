<script lang="ts">
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import MediaGallery from '$lib/components/MediaGallery.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
	import { mockMedia } from '$lib/data/mock-media';
</script>

<svelte:head>
	<title>Media — Animal Garage</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">Media</h1>
		<p class="mt-2 text-zinc-400">
			Builds, events, and behind-the-scenes from the Animal Garage crew.
		</p>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading
			title="Gallery"
			subtitle="Video and photo content — CDN-hosted media in production."
			align="center"
		/>
	</AnimatedReveal>
	<MediaGallery items={mockMedia} />
</section>

<section class="border-t border-zinc-800 bg-zinc-900/30 py-16">
	<div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
		<p class="text-sm text-zinc-500">
			Media assets will be served from S3/CloudFront. Supabase stores metadata, tags, and featured
			placement for dynamic homepage hydration.
		</p>
	</div>
</section>
