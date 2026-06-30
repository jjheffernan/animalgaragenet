<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import CookieConsent from '$lib/components/layout/CookieConsent.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { isSupportedLocale } from '$lib/i18n/locale';
	import { locale } from '$lib/stores/locale.svelte';

	let { children, data } = $props();

	$effect(() => {
		const code = page.url.searchParams.get('locale');
		if (code && isSupportedLocale(code) && code !== locale.code) {
			locale.setLocale(code);
		}
	});
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
