<script lang="ts">
	import { garageLevels, garageXpActions } from '$lib/data/garage-levels';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';

	// TODO: wire garageXp store fully on client
	let currentXp = $state(750);
	const currentLevel = $derived(garageLevels.filter((l) => currentXp >= l.xpRequired).at(-1) ?? garageLevels[0]);
	const nextLevel = $derived(garageLevels.find((l) => l.xpRequired > currentXp));
	const progress = $derived(
		nextLevel
			? ((currentXp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100
			: 100
	);
</script>

<svelte:head>
	<title>Garage Squad — Animal Garage Loyalty</title>
</svelte:head>

<section class="border-b border-zinc-800 bg-zinc-900/50 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<p class="text-xs font-bold uppercase tracking-[0.3em] text-red-500">Loyalty Program</p>
		<h1 class="mt-2 font-display text-4xl font-bold uppercase tracking-wider text-white">Garage Squad</h1>
		<p class="mt-2 text-zinc-400">Earn XP. Unlock perks. Level up your garage game.</p>
	</div>
</section>

<section class="mx-auto max-w-3xl px-4 py-16 sm:px-6">
	<AnimatedReveal>
		<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-8 text-center">
			<p class="text-xs font-bold uppercase tracking-widest text-red-500">Current Level</p>
			<h2 class="mt-2 font-display text-3xl font-bold uppercase text-white">{currentLevel.title}</h2>
			<p class="mt-1 text-zinc-500">Level {currentLevel.level} · {currentXp} XP</p>
			{#if nextLevel}
				<div class="mt-6">
					<div class="h-2 overflow-hidden rounded-full bg-zinc-800">
						<div class="h-full bg-red-600 transition-all" style="width: {progress}%"></div>
					</div>
					<p class="mt-2 text-xs text-zinc-500">{nextLevel.xpRequired - currentXp} XP to {nextLevel.title}</p>
				</div>
			{/if}
		</div>
	</AnimatedReveal>
</section>

<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<SectionHeading title="Earn XP" subtitle="Stack points with every action." />
	</AnimatedReveal>
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each garageXpActions as action (action.id)}
			<div class="rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
				<p class="font-display text-2xl font-bold text-red-500">+{action.xp}</p>
				<p class="mt-1 text-sm text-zinc-400">{action.label}</p>
			</div>
		{/each}
	</div>
</section>

<section class="border-t border-zinc-800 bg-zinc-900/30 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<AnimatedReveal>
			<SectionHeading title="Levels & Perks" />
		</AnimatedReveal>
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each garageLevels as level (level.level)}
				<div class="rounded-sm border p-6 {currentXp >= level.xpRequired ? 'border-red-600/50 bg-red-950/10' : 'border-zinc-800 bg-zinc-900/50'}">
					<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Level {level.level}</p>
					<h3 class="mt-1 font-display font-bold uppercase text-white">{level.title}</h3>
					<p class="mt-1 text-xs text-zinc-600">{level.xpRequired} XP required</p>
					<ul class="mt-4 space-y-1">
						{#each level.perks as perk (perk)}
							<li class="text-sm text-zinc-400">✓ {perk}</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>
