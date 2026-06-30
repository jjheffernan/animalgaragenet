<script lang="ts">
	import type { Testimonial } from '$lib/types/testimonial';

	interface Props {
		testimonial: Testimonial;
		compact?: boolean;
	}

	let { testimonial, compact = false }: Props = $props();

	const photoUrls = $derived(testimonial.photoUrls ?? []);
</script>

<article class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-6 {compact ? '' : 'h-full'}">
	<div class="flex items-start justify-between gap-4">
		<div>
			<p class="text-xs font-bold uppercase tracking-widest text-red-500">
				{testimonial.displayName}
			</p>
			{#if testimonial.vehicleSummary}
				<p class="mt-0.5 text-xs text-zinc-500">{testimonial.vehicleSummary}</p>
			{/if}
		</div>
		<div class="flex shrink-0 gap-0.5" aria-label="{testimonial.rating} out of 5 stars">
			{#each [1, 2, 3, 4, 5] as star (star)}
				<svg
					class="h-4 w-4 {star <= testimonial.rating ? 'text-red-500' : 'text-zinc-700'}"
					fill="currentColor"
					viewBox="0 0 20 20"
					aria-hidden="true"
				>
					<path
						d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
					/>
				</svg>
			{/each}
		</div>
	</div>
	<h3 class="mt-3 font-display text-lg font-bold uppercase text-white">{testimonial.title}</h3>
	{#if photoUrls.length > 0}
		<ul class="mt-3 flex flex-wrap gap-2" aria-label="Review photos">
			{#each photoUrls as url, index (url)}
				<li>
					<img
						src={url}
						alt=""
						class="h-16 w-16 rounded-sm object-cover"
						loading={index === 0 ? 'eager' : 'lazy'}
					/>
				</li>
			{/each}
		</ul>
	{/if}
	<p class="mt-2 text-sm text-zinc-400 {compact ? 'line-clamp-3' : ''}">{testimonial.body}</p>
	{#if testimonial.loyaltyTier}
		<p class="mt-4 text-xs text-zinc-600">Garage Squad · {testimonial.loyaltyTier}</p>
	{/if}
</article>
