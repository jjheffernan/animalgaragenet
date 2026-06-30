<script lang="ts">
	import WatchHub from '$lib/components/WatchHub.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Watch — Animal Garage</title>
</svelte:head>

<WatchHub videos={data.videos} pagination={data.pagination} featuredVideo={data.featuredVideo} />
