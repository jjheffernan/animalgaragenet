<script lang="ts">
import { MAX_FILES_PER_TESTIMONIAL } from '$lib/server/media/constants';

export interface UploadedPhoto {
	assetId: string;
	previewUrl: string;
}

interface Props {
	disabled?: boolean;
	onchange?: (assetIds: string[]) => void;
}

let { disabled = false, onchange }: Props = $props();

let photos = $state<UploadedPhoto[]>([]);
let uploading = $state(false);
let error = $state<string | null>(null);

function notifyChange() {
	onchange?.(photos.map((p) => p.assetId));
}

async function uploadFile(file: File) {
	if (photos.length >= MAX_FILES_PER_TESTIMONIAL) {
		error = `You can attach up to ${MAX_FILES_PER_TESTIMONIAL} photos.`;
		return;
	}

	uploading = true;
	error = null;

	try {
		const slotRes = await fetch('/api/media/upload-slot', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ mimeType: file.type, byteSize: file.size })
		});
		const slot = (await slotRes.json()) as {
			error?: string;
			assetId?: string;
			signedUrl?: string;
			token?: string;
		};

		if (!slotRes.ok || !slot.assetId || !slot.signedUrl) {
			error = slot.error ?? 'Could not start upload.';
			return;
		}

		const putRes = await fetch(slot.signedUrl, {
			method: 'PUT',
			headers: {
				'Content-Type': file.type,
				...(slot.token ? { 'x-upsert': 'false' } : {})
			},
			body: file
		});

		if (!putRes.ok) {
			error = 'Upload failed. Try again.';
			await fetch(`/api/media/${slot.assetId}`, { method: 'DELETE' });
			return;
		}

		const confirmRes = await fetch('/api/media/confirm', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ assetId: slot.assetId })
		});
		const confirmed = (await confirmRes.json()) as { error?: string };

		if (!confirmRes.ok) {
			error = confirmed.error ?? 'Could not confirm upload.';
			return;
		}

		const previewUrl = URL.createObjectURL(file);
		photos = [...photos, { assetId: slot.assetId, previewUrl }];
		notifyChange();
	} catch {
		error = 'Upload failed. Check your connection and try again.';
	} finally {
		uploading = false;
	}
}

async function removePhoto(assetId: string) {
	const photo = photos.find((p) => p.assetId === assetId);
	if (photo) URL.revokeObjectURL(photo.previewUrl);

	await fetch(`/api/media/${assetId}`, { method: 'DELETE' });
	photos = photos.filter((p) => p.assetId !== assetId);
	notifyChange();
}

function onFileChange(event: Event) {
	const input = event.currentTarget as HTMLInputElement;
	const files = input.files;
	if (!files?.length) return;

	for (const file of files) {
		if (photos.length >= MAX_FILES_PER_TESTIMONIAL) break;
		void uploadFile(file);
	}
	input.value = '';
}
</script>

<div class="space-y-3">
	<label class="block">
		<span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Photos (optional)</span>
		<input
			type="file"
			accept="image/jpeg,image/png,image/webp"
			multiple
			disabled={disabled || uploading || photos.length >= MAX_FILES_PER_TESTIMONIAL}
			onchange={onFileChange}
			class="mt-1 block w-full text-sm text-zinc-400 file:mr-4 file:rounded-sm file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-wider file:text-white hover:file:bg-zinc-700 disabled:opacity-50"
		/>
	</label>
	<p class="text-xs text-zinc-600">Up to {MAX_FILES_PER_TESTIMONIAL} images, 5 MB each. JPEG, PNG, or WebP.</p>

	{#if error}
		<p class="text-xs text-red-500">{error}</p>
	{/if}

	{#if uploading}
		<p class="text-xs text-zinc-500">Uploading…</p>
	{/if}

	{#if photos.length > 0}
		<ul class="flex flex-wrap gap-2">
			{#each photos as photo (photo.assetId)}
				<li class="relative">
					<img src={photo.previewUrl} alt="" class="h-16 w-16 rounded-sm object-cover" />
					<button
						type="button"
						class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-xs text-zinc-300 ring-1 ring-zinc-700 hover:text-red-400"
						aria-label="Remove photo"
						disabled={disabled}
						onclick={() => removePhoto(photo.assetId)}
					>
						×
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	{#each photos as photo (photo.assetId)}
		<input type="hidden" name="mediaAssetIds" value={photo.assetId} />
	{/each}
</div>
