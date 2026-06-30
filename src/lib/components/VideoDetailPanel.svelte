<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Video } from '$lib/types/domain';
	import type { Product } from '$lib/types/saleor';
	import { getProductsForVideo } from '$lib/data/catalog-helpers';
	import { getRelatedVideos } from '$lib/data/mock-videos';
	import { cart } from '$lib/stores/cart.svelte';
	import { videoPanel } from '$lib/stores/video-panel.svelte';
	import PriceDisplay from './PriceDisplay.svelte';
	import VideoCard from './VideoCard.svelte';

	interface Props {
		onclose?: () => void;
	}

	let { onclose }: Props = $props();

	const video = $derived(videoPanel.video);
	const products = $derived(video ? getProductsForVideo(video) : []);
	const related = $derived(video ? getRelatedVideos(video) : []);

	function handleBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) close();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && videoPanel.open) close();
	}

	function close() {
		videoPanel.close();
		onclose?.();
	}

	function productHref(product: Product): string {
		if (product.id.startsWith('p')) {
			return resolve(`/parts/${product.category?.slug}/${product.slug}`);
		}
		return resolve(`/shop/${product.slug}`);
	}

	function formatDate(iso?: string): string | null {
		if (!iso) return null;
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function handleAddToCart(product: Product) {
		cart.addItem(product.id);
		cart.openDrawer();
	}

	function openRelated(v: Video) {
		videoPanel.openVideo(v);
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if videoPanel.open && video}
	<div
		class="fixed inset-0 z-[55] flex justify-end bg-zinc-950/80 backdrop-blur-sm"
		role="presentation"
		onclick={handleBackdrop}
	>
		<div
			class="flex h-full w-full max-w-3xl flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl"
			role="dialog"
			aria-label={video.title}
			tabindex="-1"
		>
			<div class="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
				<h2 class="font-display text-lg font-bold uppercase tracking-wider text-white line-clamp-1">
					{video.title}
				</h2>
				<button
					type="button"
					class="shrink-0 text-zinc-400 hover:text-white"
					aria-label="Close video"
					onclick={close}
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<div class="flex-1 overflow-y-auto">
				<div class="aspect-video bg-zinc-900">
					<iframe
						src="https://www.youtube.com/embed/{video.youtubeId}?autoplay=1"
						title={video.title}
						class="h-full w-full"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				</div>

				<div class="space-y-6 p-6">
					<div>
						<div class="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
							{#if formatDate(video.publishedAt)}
								<span>Published {formatDate(video.publishedAt)}</span>
							{/if}
							<span>{video.duration}</span>
						</div>
						<p class="mt-3 text-sm leading-relaxed text-zinc-300">
							{video.longDescription ?? video.description}
						</p>
					</div>

					{#if products.length > 0}
						<div>
							<h3 class="text-xs font-bold uppercase tracking-widest text-red-500">
								Products in this video
							</h3>
							<div class="mt-4 grid gap-4 sm:grid-cols-2">
								{#each products as product (product.id)}
									{@const soldOut = !product.isAvailableForPurchase || product.availableQuantity === 0}
									<article class="overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900">
										<a href={productHref(product)} class="block">
											{#if product.thumbnail}
												<img
													src={product.thumbnail.url}
													alt={product.name}
													class="aspect-square w-full object-cover"
													loading="lazy"
												/>
											{/if}
										</a>
										<div class="p-3">
											{#if product.brand}
												<p class="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
													{product.brand.name}
												</p>
											{/if}
											<a
												href={productHref(product)}
												class="mt-1 block text-sm font-medium text-white hover:text-red-400"
											>
												{product.name}
											</a>
											<div class="mt-2 flex items-center justify-between gap-2">
												<PriceDisplay {product} />
												{#if !soldOut}
													<button
														type="button"
														class="shrink-0 rounded-sm bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-red-500"
														onclick={() => handleAddToCart(product)}
													>
														Add
													</button>
												{:else}
													<span class="text-[10px] font-bold uppercase text-zinc-500">Sold out</span>
												{/if}
											</div>
										</div>
									</article>
								{/each}
							</div>
						</div>
					{/if}

					{#if related.length > 0}
						<div>
							<h3 class="text-xs font-bold uppercase tracking-widest text-zinc-400">Related videos</h3>
							<div class="mt-4 grid gap-4 sm:grid-cols-2">
								{#each related as relatedVideo (relatedVideo.id)}
									<VideoCard video={relatedVideo} onclick={() => openRelated(relatedVideo)} compact />
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
