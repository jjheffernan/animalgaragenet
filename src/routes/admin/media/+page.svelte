<script lang="ts">
	import { mockMedia } from '$lib/data/mock/media';
	import { config } from '$lib/config/env';

	let selectedFile = $state<File | null>(null);
	let uploadStatus = $state('');

	function handleFileSelect(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		selectedFile = input.files?.[0] ?? null;
		uploadStatus = '';
	}

	function handleUpload(event: SubmitEvent) {
		event.preventDefault();
		if (!selectedFile) {
			uploadStatus = 'Select a file first.';
			return;
		}
		uploadStatus = `Queued "${selectedFile.name}" for upload — prototype simulates CDN ingest. Wire S3 presigned URL when infra is ready.`;
	}

	function cdnUrl(path: string): string {
		const base = config.cdnBaseUrl || 'https://cdn.animalgarage.net';
		return `${base.replace(/\/$/, '')}/${path}`;
	}
</script>

<svelte:head>
	<title>Media — Admin</title>
</svelte:head>

<h1 class="font-display text-2xl font-bold uppercase text-white">Media CDN</h1>
<p class="mt-1 text-zinc-400">Asset browser and CDN upload for S3 + CloudFront.</p>

<section class="mt-6 rounded-sm border border-zinc-800 bg-zinc-900/30 p-6">
	<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Environment</h2>
	<dl class="mt-4 space-y-2 font-mono text-xs text-zinc-400">
		<div class="flex flex-wrap gap-2">
			<dt class="text-zinc-600">PUBLIC_CDN_BASE_URL</dt>
			<dd class="text-zinc-300">{config.cdnBaseUrl || '(not set — using default)'}</dd>
		</div>
		<div class="flex flex-wrap gap-2">
			<dt class="text-zinc-600">AWS_S3_BUCKET</dt>
			<dd class="text-zinc-500">Set in server env for uploads</dd>
		</div>
		<div class="flex flex-wrap gap-2">
			<dt class="text-zinc-600">AWS_CLOUDFRONT_DISTRIBUTION_ID</dt>
			<dd class="text-zinc-500">Set for cache invalidation</dd>
		</div>
	</dl>
</section>

<section class="mt-8 rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
	<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Upload</h2>
	<form class="mt-4 flex flex-wrap items-end gap-4" onsubmit={handleUpload}>
		<label class="block">
			<span class="text-xs text-zinc-600">File</span>
			<input
				type="file"
				accept="image/*,video/*"
				onchange={handleFileSelect}
				class="mt-1 block text-sm text-zinc-400 file:mr-4 file:rounded-sm file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:text-white"
			/>
		</label>
		<button
			type="submit"
			class="rounded-sm bg-red-600 px-6 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-500"
		>
			Upload
		</button>
	</form>
	{#if uploadStatus}
		<p class="mt-4 text-sm text-zinc-400">{uploadStatus}</p>
	{/if}
</section>

<section class="mt-8">
	<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Assets</h2>
	<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each mockMedia as item (item.id)}
			<article class="overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900/50">
				<img src={item.thumbnail} alt={item.title} class="aspect-video w-full object-cover" />
				<div class="p-4">
					<p class="font-medium text-white">{item.title}</p>
					<p class="mt-1 text-xs text-zinc-500">{item.type} · {item.category}</p>
					<p class="mt-2 truncate font-mono text-[10px] text-zinc-600" title={cdnUrl(`media/${item.id}`)}>
						{cdnUrl(`media/${item.id}`)}
					</p>
				</div>
			</article>
		{/each}
	</div>
</section>
