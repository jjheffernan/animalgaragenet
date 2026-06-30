<script lang="ts">
	import PartsShoppingRibbon from '$lib/components/navigation/PartsShoppingRibbon.svelte';

	let { data, children } = $props();
</script>

{#if data.partsNav}
	<PartsShoppingRibbon
		categories={data.partsNav.categories}
		brands={data.partsNav.brands}
		popularModels={data.partsNav.popularModels}
	/>
{/if}

{@render children()}
