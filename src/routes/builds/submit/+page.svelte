<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
</script>

<svelte:head>
	<title>Submit a Build — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Submit Your Build</h1>
		<p class="mt-4 text-zinc-400">Share your ride with the Garage Squad. Full submission flow coming soon — Supabase-backed.</p>

		<form class="mt-10 space-y-6">
			<label class="block">
				<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Build Title</span>
				<input type="text" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" placeholder="Project Fox" />
			</label>
			<div class="grid gap-4 sm:grid-cols-2">
				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Year</span>
					<input type="number" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" placeholder="2020" />
				</label>
				<label class="block">
					<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Make</span>
					<input type="text" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" placeholder="Honda" />
				</label>
			</div>
			<label class="block">
				<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Model</span>
				<input type="text" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" placeholder="Civic" />
			</label>
			<label class="block">
				<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Description</span>
				<textarea rows="4" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" placeholder="Tell us about your build..."></textarea>
			</label>
			<label class="block">
				<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Mod List</span>
				<textarea rows="4" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" placeholder="One mod per line"></textarea>
			</label>
			<button type="button" disabled class="w-full rounded-sm bg-zinc-800 px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
				Submit — Coming Soon
			</button>
		</form>

		<a href={resolve('/builds')} class="mt-8 inline-block text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400">← Back to builds</a>
	</AnimatedReveal>
</section>
