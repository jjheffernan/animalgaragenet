<script lang="ts">
	import { page } from '$app/state';
	import { defaultOgImageUrl } from '$lib/seo/site-meta';

	interface Props {
		title: string;
		description?: string;
		image?: string;
		type?: 'website' | 'article';
	}

	let { title, description, image, type = 'website' }: Props = $props();

	const ogImage = $derived(image ?? defaultOgImageUrl());
	const canonicalUrl = $derived(page.url.href);
</script>

<svelte:head>
	<title>{title}</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
	<meta property="og:title" content={title} />
	{#if description}
		<meta property="og:description" content={description} />
	{/if}
	<meta property="og:image" content={ogImage} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalUrl} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	{#if description}
		<meta name="twitter:description" content={description} />
	{/if}
	<meta name="twitter:image" content={ogImage} />
</svelte:head>
