<script lang="ts">
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
</script>

<svelte:head>
	<title>Wholesale — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Wholesale Inquiry</h1>
		<p class="mt-4 text-zinc-400">Interested in carrying Animal Garage at your shop or event? Let us know.</p>

		<form class="mt-10 space-y-6">
			<label class="block">
				<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Business Name</span>
				<input type="text" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
			</label>
			<label class="block">
				<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Contact Email</span>
				<input type="email" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
			</label>
			<label class="block">
				<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Tell Us About Your Business</span>
				<textarea rows="4" class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"></textarea>
			</label>
			<button type="button" disabled class="w-full rounded-sm bg-zinc-800 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
				Submit Inquiry — Coming Soon
			</button>
		</form>
	</AnimatedReveal>
</section>
