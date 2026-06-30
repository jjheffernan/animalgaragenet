<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
	import CountdownTimer from '$lib/components/marketing/CountdownTimer.svelte';
	import { getHeroCampaign } from '$lib/data/mock/campaigns';

	interface Props {
		campaignImage?: string;
		showCountdown?: boolean;
	}

	let { campaignImage, showCountdown = true }: Props = $props();

	const campaign = getHeroCampaign();
	const bgImage = $derived(
		campaignImage ?? campaign?.heroImage ?? 'https://picsum.photos/seed/aghero/1920/1080'
	);
	const isUpcoming = $derived(
		campaign ? new Date(campaign.availableFrom).getTime() > Date.now() : false
	);
	const countdownTarget = $derived(
		campaign && showCountdown
			? isUpcoming
				? campaign.availableFrom
				: campaign.availableUntil
			: undefined
	);
</script>

<section class="relative flex min-h-[85vh] items-center overflow-hidden">
	<div
		class="absolute inset-0 bg-cover bg-center"
		style="background-image: url('{bgImage}')"
		aria-hidden="true"
	></div>
	<div class="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40"></div>
	<div
		class="absolute inset-0 opacity-20"
		style="background: repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(220,38,38,0.1) 10px, rgba(220,38,38,0.1) 11px)"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
		<AnimatedReveal>
			{#if campaign}
				<p class="text-xs font-bold uppercase tracking-[0.3em] text-red-500">
					{isUpcoming ? 'Drop Incoming' : campaign.name}
				</p>
			{:else}
				<p class="text-xs font-bold uppercase tracking-[0.3em] text-red-500">Built Different</p>
			{/if}
			<h1
				class="mt-4 max-w-3xl font-display text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-7xl"
			>
				Garage<br /><span class="text-red-600">Culture</span><br />Delivered
			</h1>
			<p class="mt-6 max-w-xl text-lg text-zinc-400">
				Merch, media, and the raw energy of the shop floor — Animal Garage is your automotive brand
				touchpoint.
			</p>
			{#if countdownTarget}
				<div class="mt-6">
					<p class="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
						{isUpcoming ? 'Drop starts in' : 'Drop ends in'}
					</p>
					<CountdownTimer endDate={countdownTarget} />
				</div>
			{/if}
			<div class="mt-10 flex flex-wrap gap-4">
				<a
					href={resolve('/shop')}
					class="rounded-sm bg-red-600 px-8 py-4 text-base font-bold uppercase tracking-wider text-white transition hover:bg-red-500"
				>
					Shop the Drop
				</a>
				<a
					href={resolve('/watch')}
					class="rounded-sm border border-zinc-700 px-8 py-4 text-base font-bold uppercase tracking-wider text-zinc-300 transition hover:border-red-600 hover:text-white"
				>
					Watch Builds
				</a>
			</div>
		</AnimatedReveal>
	</div>

	<div
		class="hero-scan absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"
		aria-hidden="true"
	></div>
</section>

<style>
	.hero-scan {
		animation: scan 4s ease-in-out infinite;
	}

	@keyframes scan {
		0%,
		100% {
			opacity: 0.3;
			transform: translateY(0);
		}
		50% {
			opacity: 1;
			transform: translateY(-2px);
		}
	}
</style>
