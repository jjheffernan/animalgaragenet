<script lang="ts">
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
</script>

<svelte:head>
	<title>Contact — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Contact</h1>
		<p class="mt-4 text-zinc-400">Questions, wholesale, or just want to talk builds? Hit us up.</p>

		<form class="mt-10 space-y-6">
			<label class="block">
				<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Name</span>
				<input type="text" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
			</label>
			<label class="block">
				<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Email</span>
				<input type="email" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
			</label>
			<label class="block">
				<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Message</span>
				<textarea rows="5" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"></textarea>
			</label>
			<button type="button" disabled class="w-full rounded-sm bg-zinc-800 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
				Send — Coming Soon
			</button>
		</form>

		<p class="mt-8 text-sm text-zinc-500">Or join our Discord for faster support.</p>
	</AnimatedReveal>
</section>
