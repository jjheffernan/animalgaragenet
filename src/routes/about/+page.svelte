<script lang="ts">
	import { resolve } from '$app/paths';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
</script>

<svelte:head>
	<title>About — Animal Garage</title>
</svelte:head>

<section class="relative overflow-hidden border-b border-zinc-800 py-24">
	<div class="absolute inset-0 bg-cover bg-center opacity-30" style="background-image: url('https://picsum.photos/seed/agabout/1920/800')" aria-hidden="true"></div>
	<div class="absolute inset-0 bg-gradient-to-b from-zinc-950/80 to-zinc-950"></div>
	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h1 class="font-display text-5xl font-black uppercase tracking-tight text-white sm:text-6xl">Our Story</h1>
		<p class="mt-4 max-w-2xl text-xl text-zinc-400">Where horsepower meets hustle — and every piece of merch carries the garage DNA.</p>
	</div>
</section>

<!-- TODO: ManifestoBlock component -->
<section class="border-b border-zinc-800 bg-red-950/10 py-20">
	<div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
		<AnimatedReveal>
			<p class="text-xs font-bold uppercase tracking-[0.3em] text-red-500">The Manifesto</p>
			<h2 class="mt-4 font-display text-3xl font-bold uppercase text-white">We Build. We Break. We Rebuild.</h2>
			<p class="mt-6 text-lg leading-relaxed text-zinc-400">
				Animal Garage is not a lifestyle brand pretending to be automotive — we live this. Late nights on the lift, early mornings at the track, and merch that survives both. Culture first, commerce second, chaos always.
			</p>
		</AnimatedReveal>
	</div>
</section>

<section class="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading title="Built in the Garage" />
		<div class="space-y-6 leading-relaxed text-zinc-400">
			<p>
				Animal Garage started as a small shop with big ambitions — a place where late nights, loud exhaust, and creative chaos collide. What began as wrenching on project cars evolved into a full automotive lifestyle brand.
			</p>
			<p>
				We draw from the raw energy of underground car culture — but with our own industrial edge. Redline accents, blacked-out aesthetics, and merch that actually holds up in the shop.
			</p>
			<p>
				Today, Animal Garage is a merchandising-forward digital touchpoint: shop drops, build content, and community — all connected through a headless commerce stack that scales globally.
			</p>
		</div>
	</AnimatedReveal>

	<AnimatedReveal delay={200}>
		<div class="mt-16 grid gap-6 sm:grid-cols-3">
			{#each [{ n: '2019', l: 'Founded' }, { n: '50+', l: 'Builds' }, { n: 'Global', l: 'Shipping' }] as stat (stat.l)}
				<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-6 text-center">
					<p class="font-display text-3xl font-bold text-red-600">{stat.n}</p>
					<p class="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-500">{stat.l}</p>
				</div>
			{/each}
		</div>
	</AnimatedReveal>
</section>

<section class="border-t border-zinc-800 bg-zinc-900/30 py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<AnimatedReveal>
			<SectionHeading title="The Crew" subtitle="The humans behind the horsepower." align="center" />
		</AnimatedReveal>
		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
			{#each [
				{ name: 'Jake "Redline" Torres', role: 'Founder / Lead Builder', seed: 'agteam1' },
				{ name: 'Mia Chen', role: 'Creative Director', seed: 'agteam2' },
				{ name: 'Dre Williams', role: 'Shop Foreman', seed: 'agteam3' },
				{ name: 'Sam Ortiz', role: 'Content Lead', seed: 'agteam4' }
			] as member (member.name)}
				<div class="text-center">
					<img src="https://picsum.photos/seed/{member.seed}/300/300" alt={member.name} class="mx-auto h-32 w-32 rounded-full border-2 border-zinc-800 object-cover" loading="lazy" />
					<h3 class="mt-4 font-bold text-white">{member.name}</h3>
					<p class="text-sm text-zinc-500">{member.role}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
	<div class="grid items-center gap-12 lg:grid-cols-2">
		<AnimatedReveal>
			<SectionHeading title="Brand Story" subtitle="From shop floor to your doorstep." />
			<p class="text-zinc-400">
				Every product we sell passes through our shop first. If it cannot survive grease, heat, and the occasional burnout, it does not make the cut. That is the Animal Garage standard — and it is non-negotiable.
			</p>
		</AnimatedReveal>
		<AnimatedReveal delay={200}>
			<img src="https://picsum.photos/seed/agbrandstory/800/600" alt="Animal Garage shop" class="rounded-sm border border-zinc-800 object-cover" loading="lazy" />
		</AnimatedReveal>
	</div>
</section>
