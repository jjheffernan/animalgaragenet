<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';

	let offset = $state(-10);
	let width = $state(9.5);
	let rimWidth = $state(10);

	// Simplified visualization: positive offset = tucked in, negative = poke
	const pokeIn = $derived(((rimWidth - width) / 2 + offset / 25.4));
	const visualOffset = $derived(Math.max(-40, Math.min(40, -offset)));
</script>

<svelte:head>
	<title>Fitment Visualizer — Animal Garage Tools</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<nav class="mb-4 text-sm text-zinc-500">
			<a href={resolve('/tools/tire-calculator')} class="hover:text-red-500">Tools</a>
			<span class="mx-2">/</span>
			<span class="text-zinc-300">Fitment Visualizer</span>
		</nav>
		<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">Fitment Visualizer</h1>
		<p class="mt-2 text-zinc-400">Offset visualization — see poke vs tuck before you buy.</p>
	</div>
</section>

<section class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
	<div class="grid gap-12 lg:grid-cols-2">
		<AnimatedReveal>
			<div class="space-y-4">
				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Offset (mm)</span>
					<input type="range" bind:value={offset} min="-50" max="55" class="mt-2 w-full accent-red-600" />
					<p class="mt-1 text-white">{offset} mm</p>
				</label>
				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Tire Width (in)</span>
					<input type="number" bind:value={width} min="7" max="14" step="0.5" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
				</label>
				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Rim Width (in)</span>
					<input type="number" bind:value={rimWidth} min="7" max="14" step="0.5" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
				</label>
			</div>
			<div class="mt-6 rounded-sm border border-zinc-800 bg-zinc-900/50 p-6 text-sm">
				<p class="text-zinc-400">Estimated lip poke: <strong class="text-white">{pokeIn.toFixed(2)} in</strong></p>
				<p class="mt-2 text-xs text-zinc-600">Placeholder calculation — full 3D visualizer in Phase 3.</p>
			</div>
		</AnimatedReveal>

		<AnimatedReveal delay={150}>
			<!-- TODO: full FitmentVisualizer component with 3D/canvas -->
			<div class="relative flex h-64 items-center justify-center rounded-sm border border-zinc-800 bg-zinc-900">
				<div class="absolute h-48 w-48 rounded-full border-4 border-zinc-700 bg-zinc-800" aria-hidden="true"></div>
				<div
					class="absolute h-40 rounded-sm border-2 border-red-600 bg-red-600/20 transition-transform duration-300"
					style="width: {width * 12}px; transform: translateX({visualOffset}px)"
					aria-label="Wheel visualization"
				></div>
				<div class="absolute bottom-4 text-xs text-zinc-500">
					{offset < 0 ? 'Poke ←' : offset > 0 ? '→ Tuck' : 'Neutral'}
				</div>
			</div>
		</AnimatedReveal>
	</div>
</section>
