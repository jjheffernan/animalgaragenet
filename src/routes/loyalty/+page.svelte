<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import AuthGateDialog from '$lib/components/AuthGateDialog.svelte';
	import { garageLevels, garageXpActions } from '$lib/data/garage-levels';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
	import TestimonialCard from '$lib/components/TestimonialCard.svelte';
	import TestimonialForm from '$lib/components/TestimonialForm.svelte';
	import { garageXp } from '$lib/stores/garage-xp.svelte';
	import { resolvePath } from '$lib/utils/paths';
	import { TESTIMONIAL_STATUS_LABELS } from '$lib/types/testimonial';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	onMount(() => garageXp.init());

	const currentLevel = $derived(garageXp.level);
	const nextLevel = $derived(garageXp.nextLevel);
	const progress = $derived(garageXp.progressToNext);
	const signInHref = resolvePath('/auth/sign-in?redirect=/loyalty');
	const hasPendingReview = $derived(data.userTestimonials.some((t) => t.status === 'pending'));
</script>

<svelte:head>
	<title>Garage Squad — Animal Garage Loyalty</title>
</svelte:head>

<AuthGateDialog
	open={!data.authenticated}
	title="Sign in required"
	description="You need to log in to view Garage Squad loyalty perks and Pit Lane member content."
	{signInHref}
	dismissHref={resolve('/')}
/>

<div
	class={data.authenticated ? '' : 'select-none blur-sm'}
	inert={!data.authenticated}
	aria-hidden={!data.authenticated}
>
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
			<p class="mt-1 text-zinc-500">Level {currentLevel.level} · {garageXp.xp} XP</p>
			{#if nextLevel}
				<div class="mt-6">
					<div class="h-2 overflow-hidden rounded-full bg-zinc-800">
						<div class="h-full bg-red-600 transition-all" style="width: {progress}%"></div>
					</div>
					<p class="mt-2 text-xs text-zinc-500">{nextLevel.xpRequired - garageXp.xp} XP to {nextLevel.title}</p>
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
				<div class="rounded-sm border p-6 {garageXp.xp >= level.xpRequired ? 'border-red-600/50 bg-red-950/10' : 'border-zinc-800 bg-zinc-900/50'}">
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

<section id="reviews" class="border-t border-zinc-800 bg-zinc-950 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<AnimatedReveal>
			<SectionHeading
				title="Squad Stories"
				subtitle="Garage Squad members earn XP when they share their build story."
			/>
		</AnimatedReveal>

		{#if data.approved.length > 0}
			<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.approved as testimonial (testimonial.id)}
					<TestimonialCard {testimonial} />
				{/each}
			</div>
		{:else}
			<p class="mt-8 text-center text-sm text-zinc-500">Be the first to share your Garage Squad story.</p>
		{/if}

		<div class="mx-auto mt-12 max-w-xl rounded-sm border border-zinc-800 bg-zinc-900/50 p-8">
			<h3 class="font-display text-lg font-bold uppercase text-white">Share Your Review</h3>
			<p class="mt-2 text-sm text-zinc-400">
				Tell the squad about your build, your experience, and what loyalty perks mean to you. Approved reviews earn +50 XP.
			</p>

			{#if form?.success}
				<p class="mt-4 rounded-sm border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
					{form.message}
				</p>
			{/if}

			{#if hasPendingReview}
				<p class="mt-4 text-sm text-zinc-500">Your review is awaiting moderation — we'll notify you when it's live.</p>
			{:else}
				<form method="POST" action="?/submit" use:enhance class="mt-6 space-y-4">
					<TestimonialForm
						displayName={data.user?.name ?? ''}
						loyaltyTier={currentLevel.title}
						errors={form?.errors}
						fields={form?.fields}
					/>
					<button
						type="submit"
						class="w-full rounded-sm bg-red-600 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500"
					>
						Submit for review
					</button>
				</form>
			{/if}

			{#if data.userTestimonials.length > 0}
				<div class="mt-8 border-t border-zinc-800 pt-6">
					<p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Your submissions</p>
					<ul class="mt-3 space-y-2">
						{#each data.userTestimonials as testimonial (testimonial.id)}
							<li class="flex items-center justify-between text-sm">
								<span class="text-zinc-400">{testimonial.title}</span>
								<span class="text-xs uppercase tracking-wider text-zinc-600">
									{TESTIMONIAL_STATUS_LABELS[testimonial.status]}
								</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</div>
</section>
</div>
