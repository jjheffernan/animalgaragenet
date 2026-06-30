<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
</script>

<svelte:head>
	<title>Checkout — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Checkout</h1>
		<p class="mt-4 text-zinc-400">Payment integration coming soon — Saleor checkout placeholder.</p>

		<form class="mt-10 space-y-6">
			<fieldset class="space-y-4">
				<legend class="text-sm font-bold uppercase tracking-widest text-zinc-500">Shipping</legend>
				<input type="text" placeholder="Full name" class="w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
				<input type="text" placeholder="Address" class="w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
				<div class="grid gap-4 sm:grid-cols-2">
					<input type="text" placeholder="City" class="rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
					<input type="text" placeholder="ZIP" class="rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
				</div>
			</fieldset>
			<button type="button" disabled class="w-full rounded-sm bg-zinc-800 py-4 text-sm font-bold uppercase tracking-wider text-zinc-500">
				Place Order — Coming Soon
			</button>
		</form>

		<a href={resolve('/cart')} class="mt-8 inline-block text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400">← Back to cart</a>
	</AnimatedReveal>
</section>
