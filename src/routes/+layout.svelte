<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import { setAnalyticsEnabled, trackPageView } from '$lib/analytics';
	import CookieConsent from '$lib/components/layout/CookieConsent.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { isSupportedLocale } from '$lib/i18n/locale';
	import {
		DEFAULT_SITE_DESCRIPTION,
		SITE_NAME,
		defaultOgImageUrl
	} from '$lib/seo/site-meta';
	import { garage } from '$lib/stores/garage.svelte';
	import { garageXp } from '$lib/stores/garage-xp.svelte';
	import { locale } from '$lib/stores/locale.svelte';

	let { children, data } = $props();

	let lastSessionId = $state<string | null | undefined>(undefined);

	$effect(() => {
		const sessionId = data.session?.id ?? null;
		if (typeof window === 'undefined' || sessionId === lastSessionId) return;
		lastSessionId = sessionId;
		garage.resetForSession();
		garageXp.resetForSession();
		void garage.init();
		void garageXp.init();
	});

	$effect(() => {
		const code = page.url.searchParams.get('locale');
		if (code && isSupportedLocale(code) && code !== locale.code) {
			locale.setLocale(code);
		}
	});

	$effect(() => {
		setAnalyticsEnabled(data.analyticsConsent);
	});

	$effect(() => {
		if (!data.analyticsConsent) return;
		const path = page.url.pathname;
		trackPageView(path);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{SITE_NAME}</title>
	<meta name="description" content={DEFAULT_SITE_DESCRIPTION} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={defaultOgImageUrl()} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
	<Header />
	<main class="flex-1 pt-[var(--site-header-height,4.5rem)]">
		{@render children()}
	</main>
	<Footer />
	<CookieConsent show={data.showCookieConsent} />
</div>
