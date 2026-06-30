<script lang="ts">
	import { promo } from '$lib/stores/promo.svelte';
	import { getPromoBannerId, setPromoBannerId } from '$lib/cookies/client';
	import { getActiveBanners } from '$lib/data/mock/banners';
	import { getActiveCampaign } from '$lib/data/mock/campaigns';
	import { resolvePath } from '$lib/utils/paths';
	import CountdownTimer from './CountdownTimer.svelte';

	const banners = getActiveBanners();
	const campaign = getActiveCampaign();

	function pickBannerIndex(): number {
		if (banners.length <= 1) return 0;
		if (typeof window === 'undefined') return 0;
		const stored = getPromoBannerId();
		if (stored) {
			const idx = banners.findIndex((b) => b.id === stored);
			if (idx >= 0) return idx;
		}
		const idx = Math.floor(Math.random() * banners.length);
		setPromoBannerId(banners[idx].id);
		return idx;
	}

	const bannerIndex = pickBannerIndex();

	$effect(() => {
		promo.init();
	});

	const current = $derived(banners[bannerIndex] ?? banners[0]);
	const endDate = $derived(current?.endDate ?? campaign?.availableUntil);
</script>

{#if promo.visible && current}
	<div class="relative bg-red-600 text-white">
		<div class="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 py-2 text-xs font-medium uppercase tracking-wider sm:text-sm">
			<span>{current.message}</span>
			{#if endDate}
				<CountdownTimer {endDate} />
			{/if}
			{#if current.link}
				<a href={resolvePath(current.link)} class="underline hover:no-underline">
					{current.linkLabel ?? 'Learn More'}
				</a>
			{/if}
		</div>
		<button
			type="button"
			class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/80 hover:text-white"
			aria-label="Dismiss promo"
			onclick={() => promo.dismiss()}
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>
{/if}
