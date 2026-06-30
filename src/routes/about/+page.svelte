<script lang="ts">
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
</script>

<svelte:head>
	<title>About — Animal Garage</title>
</svelte:head>

<section class="relative overflow-hidden border-b border-zinc-800 py-24">
	<div
		class="absolute inset-0 bg-cover bg-center opacity-30"
		style="background-image: url('https://picsum.photos/seed/agabout/1920/800')"
		aria-hidden="true"
	></div>
	<div class="absolute inset-0 bg-gradient-to-b from-zinc-950/80 to-zinc-950"></div>
	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h1 class="font-display text-5xl font-black uppercase tracking-tight text-white sm:text-6xl">
			Our Story
		</h1>
		<p class="mt-4 max-w-2xl text-xl text-zinc-400">
			Where horsepower meets hustle — and every piece of merch carries the garage DNA.
		</p>
	</div>
</section>

<section class="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading title="Built in the Garage" />
		<div class="space-y-6 text-zinc-400 leading-relaxed">
			<p>
				Animal Garage started as a small shop with big ambitions — a place where late nights, loud
				exhaust, and creative chaos collide. What began as wrenching on project cars evolved into a
				full automotive lifestyle brand.
			</p>
			<p>
				We draw inspiration from the raw energy of brands like Hoonigan and the underground car
				culture scene — but with our own industrial edge. Redline accents, blacked-out aesthetics,
				and merch that actually holds up in the shop.
			</p>
			<p>
				Today, Animal Garage is a merchandising-forward digital touchpoint: shop drops, build
				content, and community — all connected through a headless commerce stack that scales
				globally.
			</p>
		</div>
	</AnimatedReveal>

	<AnimatedReveal delay={200}>
		<div class="mt-16 grid gap-6 sm:grid-cols-3">
			{#each [{ n: '2019', l: 'Founded' }, { n: '50+', l: 'Builds' }, { n: 'Global', l: 'Shipping' }] as stat}
				<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-6 text-center">
					<p class="font-display text-3xl font-bold text-red-600">{stat.n}</p>
					<p class="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-500">{stat.l}</p>
				</div>
			{/each}
		</div>
	</AnimatedReveal>
</section>
