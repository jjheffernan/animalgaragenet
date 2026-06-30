<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';

	let offset = $state(-10);
	let width = $state(9.5);
	let rimWidth = $state(10);

	const pokeIn = $derived((rimWidth - width) / 2 + offset / 25.4);
	const visualOffset = $derived(Math.max(-40, Math.min(40, -offset)));
	const fitmentLabel = $derived(
		offset < -5 ? 'Poke (extends outward)' : offset > 5 ? 'Tuck (recessed inward)' : 'Flush / neutral'
	);
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
					<p class="mt-1 text-white">{offset} mm — {fitmentLabel}</p>
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
				<p class="mt-2 text-xs text-zinc-500">
					Positive offset tucks the wheel inward; negative offset pushes it outward. Compare against your fender clearance before ordering.
				</p>
			</div>
		</AnimatedReveal>

		<AnimatedReveal delay={150}>
			<div class="relative flex h-72 items-center justify-center rounded-sm border border-zinc-800 bg-zinc-900">
				<p class="absolute left-4 top-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600">Fender line</p>
				<div class="absolute left-1/2 top-8 h-48 w-px -translate-x-1/2 bg-zinc-600" aria-hidden="true"></div>
				<div class="absolute h-48 w-48 rounded-full border-4 border-zinc-700 bg-zinc-800" aria-hidden="true"></div>
				<div
					class="absolute h-40 rounded-sm border-2 border-red-600 bg-red-600/20 transition-transform duration-300"
					style="width: {width * 12}px; transform: translateX({visualOffset}px)"
					aria-label="Wheel visualization"
				></div>
				<div class="absolute bottom-4 left-0 right-0 flex justify-between px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
					<span>← Poke</span>
					<span class="text-red-500">{fitmentLabel}</span>
					<span>Tuck →</span>
				</div>
			</div>
		</AnimatedReveal>
	</div>
</section>

<section class="border-t border-zinc-800 bg-zinc-900/30 py-16">
	<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
		<AnimatedReveal>
			<h2 class="font-display text-xl font-bold uppercase text-white">Fitment Guide Tips</h2>
			<ul class="mt-6 space-y-4 text-sm leading-relaxed text-zinc-400">
				<li>
					<strong class="text-zinc-300">Measure twice.</strong> Check inner fender clearance with the suspension compressed — especially on lowered cars.
				</li>
				<li>
					<strong class="text-zinc-300">Match tire to rim.</strong> Stretching a narrow tire on a wide rim changes the effective contact patch and sidewall profile.
				</li>
				<li>
					<strong class="text-zinc-300">Spacers change effective offset.</strong> A 15 mm spacer reduces offset by 15 mm — factor that in when comparing wheels.
				</li>
				<li>
					<strong class="text-zinc-300">Hub-centric matters.</strong> Always use hub-centric rings or OEM-fit wheels to avoid vibration at speed.
				</li>
				<li>
					<strong class="text-zinc-300">When in doubt, ask.</strong> Our parts team can confirm fitment for your year/make/model before you commit.
				</li>
			</ul>
		</AnimatedReveal>
	</div>
</section>
