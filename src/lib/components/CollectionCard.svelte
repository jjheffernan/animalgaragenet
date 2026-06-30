<script lang="ts">
	import type { Collection } from '$lib/types/saleor';

	interface Props {
		collection: Collection;
	}

	let { collection }: Props = $props();
</script>

<a
	href="/shop?collection={collection.slug}"
	class="group relative block overflow-hidden rounded-sm"
>
	<div class="aspect-[2/1] overflow-hidden bg-zinc-800">
		{#if collection.backgroundImage}
			<img
				src={collection.backgroundImage.url}
				alt={collection.backgroundImage.alt}
				class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
				loading="lazy"
			/>
		{/if}
		<div class="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent"></div>
	</div>
	<div class="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
		<h3 class="font-display text-2xl font-bold uppercase tracking-wider text-white sm:text-3xl">
			{collection.name}
		</h3>
		<p class="mt-2 max-w-md text-sm text-zinc-300">{collection.description}</p>
		<span
			class="mt-4 inline-flex items-center text-xs font-bold uppercase tracking-widest text-red-500 group-hover:text-red-400"
		>
			Shop collection →
		</span>
	</div>
</a>
