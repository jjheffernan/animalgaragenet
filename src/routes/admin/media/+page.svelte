<script lang="ts">
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import {
		adminBadgeOff,
		adminBadgeOn,
		adminBtnPrimary,
		adminBtnOutline,
		adminCard,
		adminSectionTitle
	} from '$lib/components/admin/admin-ui';
	import { mockMedia } from '$lib/data/mock/media';
	import { config } from '$lib/config/env';
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let selectedFile = $state<File | null>(null);
	let uploadStatus = $state('');
	let uploading = $state(false);

	function handleFileSelect(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		selectedFile = input.files?.[0] ?? null;
		uploadStatus = '';
	}

	async function handleUpload(event: SubmitEvent) {
		event.preventDefault();
		if (!selectedFile) {
			uploadStatus = 'Select a file first.';
			return;
		}

		if (!data.cdnUploadConfigured) {
			uploadStatus =
				'CDN upload is not configured — set PUBLIC_CDN_BASE_URL, S3_BUCKET, and AWS credentials in server env.';
			return;
		}

		uploading = true;
		uploadStatus = '';

		try {
			const slotResponse = await fetch('/api/admin/media/upload-slot', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					filename: selectedFile.name,
					mimeType: selectedFile.type,
					byteSize: selectedFile.size
				})
			});
			const slot = (await slotResponse.json()) as {
				uploadUrl?: string;
				objectKey?: string;
				publicUrl?: string;
				error?: string;
				hint?: string;
			};

			if (!slotResponse.ok) {
				uploadStatus = slot.hint
					? `${slot.error} ${slot.hint}`
					: (slot.error ?? 'Upload slot failed.');
				return;
			}

			if (!slot.uploadUrl) {
				uploadStatus = 'Presigned URL missing from server response.';
				return;
			}

			const putResponse = await fetch(slot.uploadUrl, {
				method: 'PUT',
				headers: { 'Content-Type': selectedFile.type },
				body: selectedFile
			});

			if (!putResponse.ok) {
				uploadStatus = `S3 upload failed (${putResponse.status}).`;
				return;
			}

			if (data.cdnInvalidationConfigured && slot.objectKey) {
				const invalidateResponse = await fetch('/api/admin/media/invalidate', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ objectKey: slot.objectKey })
				});
				if (!invalidateResponse.ok) {
					uploadStatus = `Uploaded to S3, but CDN invalidation failed (${invalidateResponse.status}).`;
					return;
				}
			}

			uploadStatus = `Uploaded "${selectedFile.name}" — public URL: ${slot.publicUrl ?? '(pending CDN)'}`;
			selectedFile = null;
		} catch {
			uploadStatus = 'Network error — try again.';
		} finally {
			uploading = false;
		}
	}

	function cdnUrl(path: string): string {
		const base = config.cdnBaseUrl?.replace(/\/$/, '') ?? '';
		return base ? `${base}/${path}` : path;
	}

	function formatBytes(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		return `${(bytes / 1024).toFixed(1)} KB`;
	}
</script>

<svelte:head>
	<title>Media — Admin</title>
</svelte:head>

<div class="space-y-8">
	<AdminPageHeader
		title="Media"
		subtitle="Supabase UGC bucket and optional S3 + CloudFront admin uploads."
	/>

	<section class={adminCard}>
		<h2 class={adminSectionTitle}>Environment</h2>
		<dl class="mt-4 space-y-3 font-mono text-xs text-zinc-400">
			<div class="flex flex-wrap items-center gap-2">
				<dt class="text-zinc-600">PUBLIC_CDN_BASE_URL</dt>
				<dd class="text-zinc-300">{config.cdnBaseUrl || '(not set — using default)'}</dd>
			</div>
			<div class="flex flex-wrap items-center gap-2">
				<dt class="text-zinc-600">S3_BUCKET</dt>
				<dd>
					<span class={data.cdnUploadConfigured ? adminBadgeOn : adminBadgeOff}>
						{data.cdnUploadConfigured ? 'Configured' : 'Not configured'}
					</span>
				</dd>
			</div>
			<div class="flex flex-wrap items-center gap-2">
				<dt class="text-zinc-600">AWS_CLOUDFRONT_DISTRIBUTION_ID</dt>
				<dd>
					<span class={data.cdnInvalidationConfigured ? adminBadgeOn : adminBadgeOff}>
						{data.cdnInvalidationConfigured ? 'Configured' : 'Not configured'}
					</span>
				</dd>
			</div>
		</dl>
	</section>

	<section class={adminCard}>
		<h2 class={adminSectionTitle}>Upload</h2>
		<form class="mt-4 flex flex-wrap items-end gap-4" onsubmit={handleUpload}>
			<label class="block">
				<span class="text-xs text-zinc-600">File</span>
				<input
					type="file"
					accept="image/jpeg,image/png,image/webp"
					onchange={handleFileSelect}
					class="mt-1 block text-sm text-zinc-400 file:mr-4 file:rounded-sm file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:text-white"
				/>
			</label>
			<button type="submit" disabled={uploading} class="{adminBtnPrimary} disabled:opacity-50">
				{uploading ? 'Uploading…' : 'Upload'}
			</button>
		</form>
		{#if uploadStatus}
			<p class="mt-4 text-sm text-zinc-400">{uploadStatus}</p>
		{/if}
	</section>

	<section class={adminCard}>
		<div class="flex flex-wrap items-center justify-between gap-4">
			<h2 class={adminSectionTitle}>UGC bucket (`media_assets`)</h2>
			<form method="POST" action="?/cleanupOrphans" use:enhance>
				<button type="submit" class={adminBtnOutline}>Purge stale pending (24h)</button>
			</form>
		</div>
		{#if form?.cleanup}
			<p class="mt-3 text-sm text-zinc-400">
				Removed {form.cleanup.deleted} abandoned pending upload{form.cleanup.deleted === 1
					? ''
					: 's'}.
			</p>
		{/if}
		{#if !data.ugcConfigured}
			<p class="mt-4 text-sm text-zinc-500">
				Supabase is not configured — UGC list requires `SUPABASE_*` env and service role key.
			</p>
		{:else if data.ugcAssets.length === 0}
			<p class="mt-4 text-sm text-zinc-500">No `media_assets` rows yet.</p>
		{:else}
			<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.ugcAssets as asset (asset.id)}
					<article class="overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900/50">
						{#if asset.previewUrl}
							<img src={asset.previewUrl} alt="" class="aspect-video w-full object-cover" />
						{:else}
							<div
								class="flex aspect-video items-center justify-center bg-zinc-950 text-xs text-zinc-600"
							>
								No preview
							</div>
						{/if}
						<div class="space-y-2 p-4">
							<div class="flex flex-wrap items-center gap-2">
								<span class={asset.status === 'ready' ? adminBadgeOn : adminBadgeOff}
									>{asset.status}</span
								>
								<span class="text-xs text-zinc-500">{formatBytes(asset.byteSize)}</span>
							</div>
							<p class="truncate font-mono text-[10px] text-zinc-600" title={asset.storagePath}>
								{asset.storagePath}
							</p>
							<form method="POST" action="?/deleteAsset" use:enhance class="pt-1">
								<input type="hidden" name="id" value={asset.id} />
								<button
									type="submit"
									class="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300"
								>
									Delete
								</button>
							</form>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</section>

	<section>
		<h2 class={adminSectionTitle}>CDN mock gallery</h2>
		<p class="mt-2 text-sm text-zinc-500">Reference tiles until S3 inventory API ships.</p>
		<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each mockMedia as item (item.id)}
				<article class="overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900/50">
					<img src={item.thumbnail} alt={item.title} class="aspect-video w-full object-cover" />
					<div class="p-4">
						<p class="font-medium text-white">{item.title}</p>
						<p class="mt-1 text-xs text-zinc-500">{item.type} · {item.category}</p>
						<p
							class="mt-2 truncate font-mono text-[10px] text-zinc-600"
							title={cdnUrl(`media/${item.id}`)}
						>
							{cdnUrl(`media/${item.id}`)}
						</p>
					</div>
				</article>
			{/each}
		</div>
	</section>
</div>
