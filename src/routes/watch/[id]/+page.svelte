<script lang="ts">
	import WatchHub from '$lib/components/WatchHub.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.video.title} — Watch — Animal Garage</title>
</svelte:head>

<WatchHub videos={data.videos} initialVideoId={data.video.id} />
