<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedReveal from '$lib/components/shared/AnimatedReveal.svelte';

	let width = $state(225);
	let aspect = $state(45);
	let rim = $state(17);

	const sidewallMm = $derived((width * aspect) / 100);
	const sidewallIn = $derived(sidewallMm / 25.4);
	const diameterIn = $derived(rim + sidewallIn * 2);
	const circumferenceIn = $derived(diameterIn * Math.PI);
	const revsPerMile = $derived(63360 / circumferenceIn);

	// Comparison tire
	let width2 = $state(245);
	let aspect2 = $state(40);
	let rim2 = $state(18);
	const sidewallMm2 = $derived((width2 * aspect2) / 100);
	const sidewallIn2 = $derived(sidewallMm2 / 25.4);
	const diameterIn2 = $derived(rim2 + sidewallIn2 * 2);
</script>

<svelte:head>
	<title>Tire Calculator — Animal Garage Tools</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<nav class="mb-4 text-sm text-zinc-500">
			<a href={resolve('/tools/fitment-visualizer')} class="hover:text-red-500">Tools</a>
			<span class="mx-2">/</span>
			<span class="text-zinc-300">Tire Calculator</span>
		</nav>
		<h1 class="font-display text-4xl font-bold uppercase tracking-wider text-white">Tire Size Calculator</h1>
		<p class="mt-2 text-zinc-400">Width / aspect / rim → overall diameter and revs per mile.</p>
	</div>
</section>

<section class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
	<div class="grid gap-12 lg:grid-cols-2">
		<AnimatedReveal>
			<h2 class="font-display text-lg font-bold uppercase text-white">Primary Tire</h2>
			<div class="mt-4 space-y-4">
				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Width (mm)</span>
					<input type="number" bind:value={width} min="135" max="355" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
				</label>
				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Aspect Ratio</span>
					<input type="number" bind:value={aspect} min="25" max="80" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
				</label>
				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Rim Diameter (in)</span>
					<input type="number" bind:value={rim} min="13" max="24" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
				</label>
			</div>
			<div class="mt-6 rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
				<p class="text-2xl font-bold text-white">{width}/{aspect}R{rim}</p>
				<dl class="mt-4 space-y-2 text-sm">
					<div class="flex justify-between"><dt class="text-zinc-500">Sidewall height</dt><dd class="text-white">{sidewallMm.toFixed(1)} mm ({sidewallIn.toFixed(2)} in)</dd></div>
					<div class="flex justify-between"><dt class="text-zinc-500">Overall diameter</dt><dd class="text-white">{diameterIn.toFixed(2)} in</dd></div>
					<div class="flex justify-between"><dt class="text-zinc-500">Revs per mile</dt><dd class="text-white">{revsPerMile.toFixed(0)}</dd></div>
				</dl>
			</div>
		</AnimatedReveal>

		<AnimatedReveal delay={150}>
			<h2 class="font-display text-lg font-bold uppercase text-white">Compare To</h2>
			<div class="mt-4 space-y-4">
				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Width (mm)</span>
					<input type="number" bind:value={width2} min="135" max="355" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
				</label>
				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Aspect Ratio</span>
					<input type="number" bind:value={aspect2} min="25" max="80" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
				</label>
				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Rim Diameter (in)</span>
					<input type="number" bind:value={rim2} min="13" max="24" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
				</label>
			</div>
			<div class="mt-6 rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
				<p class="text-2xl font-bold text-white">{width2}/{aspect2}R{rim2}</p>
				<dl class="mt-4 space-y-2 text-sm">
					<div class="flex justify-between"><dt class="text-zinc-500">Overall diameter</dt><dd class="text-white">{diameterIn2.toFixed(2)} in</dd></div>
					<div class="flex justify-between"><dt class="text-zinc-500">Difference</dt>
						<dd class="{Math.abs(diameterIn - diameterIn2) < 0.5 ? 'text-green-400' : 'text-yellow-400'}">
							{(diameterIn - diameterIn2) >= 0 ? '+' : ''}{(diameterIn - diameterIn2).toFixed(2)} in
						</dd>
					</div>
				</dl>
			</div>
		</AnimatedReveal>
	</div>
</section>
