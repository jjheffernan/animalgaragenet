<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Campaign } from '$lib/types/domain';
	import { getHeroCampaign } from '$lib/data/mock-campaigns';
	import CountdownTimer from './CountdownTimer.svelte';

	interface Props {
		campaign?: Campaign;
		class?: string;
	}

	let { campaign = getHeroCampaign(), class: className = '' }: Props = $props();

	const isUpcoming = $derived(
		campaign ? new Date(campaign.availableFrom).getTime() > Date.now() : false
	);
	const countdownTarget = $derived(
		campaign ? (isUpcoming ? campaign.availableFrom : campaign.availableUntil) : undefined
	);
</script>

{#if campaign}
	<div class="relative overflow-hidden rounded-sm border border-red-600/30 bg-zinc-900 {className}">
		<img
			src={campaign.heroImage}
			alt={campaign.name}
			class="absolute inset-0 h-full w-full object-cover opacity-30"
		/>
		<div class="relative px-6 py-8 sm:px-8">
			<p class="text-xs font-bold uppercase tracking-[0.3em] text-red-500">
				{isUpcoming ? 'Coming Soon' : 'Live Now'}
			</p>
			<h3 class="mt-2 font-display text-2xl font-black uppercase text-white">{campaign.name}</h3>
			<p class="mt-2 max-w-lg text-sm text-zinc-400">{campaign.description}</p>
			<div class="mt-4 flex flex-wrap items-center gap-4">
				{#if countdownTarget}
					<CountdownTimer endDate={countdownTarget} />
				{/if}
				<a
					href={resolve(`/shop?campaign=${campaign.slug}`)}
					class="rounded-sm bg-red-600 px-6 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-500"
				>
					{isUpcoming ? 'Get Notified' : 'Shop Drop'}
				</a>
			</div>
		</div>
	</div>
{/if}
