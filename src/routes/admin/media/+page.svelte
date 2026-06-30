<script lang="ts">
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import {
		adminBadgeOff,
		adminBadgeOn,
		adminBtnPrimary,
		adminCard,
		adminSectionTitle
	} from '$lib/components/admin/admin-ui';
	import { mockMedia } from '$lib/data/mock/media';
	import { config } from '$lib/config/env';

	let { data } = $props();

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
				uploadStatus = slot.hint ? `${slot.error} ${slot.hint}` : (slot.error ?? 'Upload slot failed.');
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
		const base = config.cdnBaseUrl || 'https://cdn.animalgarage.net';
		return `${base.replace(/\/$/, '')}/${path}`;
	}
</script>

<svelte:head>
	<title>Media — Admin</title>
</svelte:head>

<div class="space-y-8">
	<AdminPageHeader
		title="Media CDN"
		subtitle="Asset browser and CDN upload for S3 + CloudFront."
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

	<section>
		<h2 class={adminSectionTitle}>Assets</h2>
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
