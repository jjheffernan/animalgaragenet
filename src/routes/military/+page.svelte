<script lang="ts">
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
</script>

<svelte:head>
	<title>Military Discount — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Military Discount</h1>
		<p class="mt-4 text-lg text-zinc-400">15% off for active duty, veterans, and their families. Thank you for your service.</p>

		<div class="mt-10 space-y-6 text-zinc-400 leading-relaxed">
			<h2 class="font-display text-lg font-bold uppercase text-white">How It Works</h2>
			<p>Verify your status through our ID.me integration (coming soon). Once verified, your discount applies automatically at checkout.</p>
			<h2 class="font-display text-lg font-bold uppercase text-white">Eligible</h2>
			<ul class="list-inside list-disc space-y-2">
				<li>Active duty military</li>
				<li>Veterans</li>
				<li>Reservists and National Guard</li>
				<li>Military spouses and dependents</li>
			</ul>
			<h2 class="font-display text-lg font-bold uppercase text-white">Restrictions</h2>
			<p>Cannot be combined with other promo codes. Excludes gift cards and clearance items.</p>
		</div>
	</AnimatedReveal>
</section>
