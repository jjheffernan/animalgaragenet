<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status} — Animal Garage</title>
</svelte:head>

<section
	class="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8"
>
	<p class="text-6xl font-black text-red-600">{$page.status}</p>
	<h1 class="mt-4 font-display text-2xl font-bold uppercase tracking-widest text-white">
		{#if $page.status === 404}
			Page not found
		{:else}
			Something went wrong
		{/if}
	</h1>
	<p class="mt-4 max-w-md text-zinc-400">
		{$page.error?.message ?? 'The page you requested could not be loaded.'}
	</p>
	<a
		href={resolve('/')}
		class="mt-8 inline-block rounded-sm bg-red-600 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-500"
	>
		Back to home
	</a>
</section>
