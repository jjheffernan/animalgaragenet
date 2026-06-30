<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
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
	<main class="flex-1 pt-[73px]">
		{@render children()}
	</main>
	<Footer />
</div>
