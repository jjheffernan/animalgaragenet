<script lang="ts">
	import SectionHeading from '$lib/components/shared/SectionHeading.svelte';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';
	import EventsCalendar from '$lib/components/content/EventsCalendar.svelte';
	import ListControls from '$lib/components/catalog/ListControls.svelte';

	type ViewMode = 'list' | 'calendar';

	let { data } = $props();
	let viewMode = $state<ViewMode>('list');
</script>

<svelte:head>
	<title>Events — Animal Garage</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">Events</h1>
		<p class="mt-2 text-zinc-400">Meets, open garage nights, and track days.</p>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
	<div class="mb-10 flex flex-wrap items-end justify-between gap-4">
		<AnimatedReveal>
			<SectionHeading
				title={viewMode === 'list' ? 'Upcoming' : 'Calendar'}
				subtitle={viewMode === 'list'
					? `${data.pagination.total} events`
					: `${data.allEvents.length} total events`}
			/>
		</AnimatedReveal>

		<div role="tablist" aria-label="Events view" class="flex rounded-sm bg-zinc-900 p-1">
			<button
				type="button"
				role="tab"
				class="rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-widest transition {viewMode ===
				'list'
					? 'bg-red-600 text-white'
					: 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}"
				aria-selected={viewMode === 'list'}
				onclick={() => (viewMode = 'list')}
			>
				List
			</button>
			<button
				type="button"
				role="tab"
				class="rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-widest transition {viewMode ===
				'calendar'
					? 'bg-red-600 text-white'
					: 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}"
				aria-selected={viewMode === 'calendar'}
				onclick={() => (viewMode = 'calendar')}
			>
				Calendar
			</button>
		</div>
	</div>

	{#if viewMode === 'list'}
		{#if data.upcomingEvents.length === 0}
			<p class="text-zinc-500">No upcoming events right now. Check back soon.</p>
		{:else}
			<div class="grid gap-6 sm:grid-cols-2">
				{#each data.upcomingEvents as event (event.id)}
					<article class="overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900">
						<img
							src={event.imageUrl}
							alt={event.title}
							class="aspect-[16/9] w-full object-cover"
							loading="lazy"
						/>
						<div class="p-6">
							<p class="text-xs font-bold uppercase tracking-widest text-red-500">
								{new Date(event.startDate).toLocaleDateString(undefined, {
									weekday: 'long',
									month: 'long',
									day: 'numeric',
									year: 'numeric'
								})}
							</p>
							<h2 class="mt-2 font-display text-xl font-bold uppercase text-white">
								{event.title}
							</h2>
							<p class="mt-2 text-sm text-zinc-500">{event.location}</p>
							<p class="mt-3 text-zinc-400">{event.description}</p>
						</div>
					</article>
				{/each}
			</div>
			<ListControls pagination={data.pagination} />
		{/if}
	{:else}
		<EventsCalendar events={data.allEvents} />
	{/if}
</section>
