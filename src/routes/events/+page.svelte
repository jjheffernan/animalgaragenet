<script lang="ts">
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';

	let { data } = $props();
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
	<AnimatedReveal>
		<SectionHeading title="Upcoming" subtitle="{data.events.length} events" />
	</AnimatedReveal>
	<div class="grid gap-6 sm:grid-cols-2">
		{#each data.events as event (event.id)}
			<article class="overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900">
				<img src={event.imageUrl} alt={event.title} class="aspect-[16/9] w-full object-cover" loading="lazy" />
				<div class="p-6">
					<p class="text-xs font-bold uppercase tracking-widest text-red-500">
						{new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
					</p>
					<h2 class="mt-2 font-display text-xl font-bold uppercase text-white">{event.title}</h2>
					<p class="mt-2 text-sm text-zinc-500">{event.location}</p>
					<p class="mt-3 text-zinc-400">{event.description}</p>
				</div>
			</article>
		{/each}
	</div>
</section>
