<script lang="ts">
	import AnimatedReveal from '$lib/components/AnimatedReveal.svelte';
</script>

<svelte:head>
	<title>Privacy Policy — Animal Garage</title>
</svelte:head>

<section class="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
	<AnimatedReveal>
		<h1 class="font-display text-3xl font-bold uppercase text-white">Privacy Policy</h1>
		<div class="mt-8 space-y-6 text-zinc-400 leading-relaxed">
			<p>Animal Garage respects your privacy. This policy describes how we collect and use your information.</p>
			<h2 class="font-display text-lg font-bold uppercase text-white">Information We Collect</h2>
			<p>Account info, order history, newsletter email, and garage vehicle preferences stored locally and in Supabase (when wired).</p>
			<h2 class="font-display text-lg font-bold uppercase text-white">How We Use It</h2>
			<p>To fulfill orders, personalize your experience, send drop alerts (if subscribed), and improve our shop.</p>
			<h2 class="font-display text-lg font-bold uppercase text-white">Third Parties</h2>
			<p>We use Saleor for commerce, Supabase for auth/CMS, and standard analytics. We do not sell your data.</p>
			<h2 class="font-display text-lg font-bold uppercase text-white">Contact</h2>
			<p>Questions? Reach out via our contact page.</p>
		</div>
	</AnimatedReveal>
</section>
