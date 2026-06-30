<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import CookieConsent from '$lib/components/layout/CookieConsent.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Animal Garage</title>
	<meta
		name="description"
		content="Animal Garage — automotive brand merchandising, media, and culture."
	/>
</svelte:head>

<div class="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
	<Header />
	<main class="flex-1 pt-[var(--site-header-height,4.5rem)]">
		{@render children()}
	</main>
	<Footer />
	<CookieConsent show={data.showCookieConsent} />
</div>
