<script lang="ts">
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
</script>

<svelte:head>
	<title>Shipping Policy — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Shipping Policy</h1>
		<div class="mt-8 space-y-6 text-zinc-400 leading-relaxed">
			<p>Orders ship within 2 business days for in-stock merch. Parts may require additional processing time.</p>
			<h2 class="font-display text-lg font-bold uppercase text-white">Domestic (US)</h2>
			<p>Standard shipping 5–7 business days. Free shipping on orders over $75.</p>
			<h2 class="font-display text-lg font-bold uppercase text-white">International</h2>
			<p>Rates calculated at checkout via Saleor. Duties and taxes may apply.</p>
			<h2 class="font-display text-lg font-bold uppercase text-white">Tracking</h2>
			<p>You will receive a tracking number by email once your order ships.</p>
		</div>
	</AnimatedReveal>
</section>
