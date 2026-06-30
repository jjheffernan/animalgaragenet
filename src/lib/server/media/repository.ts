import type { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '$lib/server/supabase/admin';
import { UGC_BUCKET, UPLOAD_URL_TTL_SECONDS, type AllowedImageMime } from './constants';
import { mimeToExtension } from './validation';

export type MediaAssetStatus = 'pending' | 'ready' | 'rejected';

export interface MediaAsset {
	id: string;
	userId: string;
	bucket: string;
	storagePath: string;
	mimeType: string;
	byteSize: number;
	status: MediaAssetStatus;
	createdAt: string;
}

function rowToAsset(row: Record<string, unknown>): MediaAsset {
	return {
		id: String(row.id),
		userId: String(row.user_id),
		bucket: String(row.bucket),
		storagePath: String(row.storage_path),
		mimeType: String(row.mime_type),
		byteSize: Number(row.byte_size),
		status: row.status as MediaAssetStatus,
		createdAt: String(row.created_at)
	};
}

export async function createUploadSlot(
	supabase: SupabaseClient,
	userId: string,
	mimeType: AllowedImageMime,
	byteSize: number
): Promise<{ asset: MediaAsset; signedUrl: string; token: string } | { error: string }> {
	const assetId = crypto.randomUUID();
	const ext = mimeToExtension(mimeType);
	const storagePath = `${userId}/${assetId}.${ext}`;

	const { data: row, error: insertError } = await supabase
		.from('media_assets')
		.insert({
			id: assetId,
			user_id: userId,
			bucket: UGC_BUCKET,
			storage_path: storagePath,
			mime_type: mimeType,
			byte_size: byteSize,
			status: 'pending'
		})
		.select('*')
		.single();

	if (insertError || !row) {
		return { error: insertError?.message ?? 'Could not reserve upload slot.' };
	}

	const { data: signed, error: signError } = await supabase.storage
		.from(UGC_BUCKET)
		.createSignedUploadUrl(storagePath, { upsert: false });

	if (signError || !signed) {
		await supabase.from('media_assets').delete().eq('id', assetId);
		return { error: signError?.message ?? 'Could not create signed upload URL.' };
	}

	return {
		asset: rowToAsset(row),
		signedUrl: signed.signedUrl,
		token: signed.token
	};
}

export async function confirmUpload(
	supabase: SupabaseClient,
	userId: string,
	assetId: string
): Promise<{ asset: MediaAsset } | { error: string }> {
	const { data: row, error: fetchError } = await supabase
		.from('media_assets')
		.select('*')
		.eq('id', assetId)
		.eq('user_id', userId)
		.single();

	if (fetchError || !row) {
		return { error: 'Upload not found.' };
	}

	const asset = rowToAsset(row);
	const { data: listed, error: listError } = await supabase.storage
		.from(UGC_BUCKET)
		.list(asset.storagePath.replace(/\/[^/]+$/, ''), {
			search: asset.storagePath.split('/').pop()
		});

	if (listError || !listed?.length) {
		return { error: 'File was not uploaded. Try again.' };
	}

	const { data: updated, error: updateError } = await supabase
		.from('media_assets')
		.update({ status: 'ready' })
		.eq('id', assetId)
		.eq('user_id', userId)
		.select('*')
		.single();

	if (updateError || !updated) {
		return { error: updateError?.message ?? 'Could not confirm upload.' };
	}

	return { asset: rowToAsset(updated) };
}

export async function deleteMediaAsset(
	supabase: SupabaseClient,
	userId: string,
	assetId: string
): Promise<{ ok: true } | { error: string }> {
	const { data: row, error: fetchError } = await supabase
		.from('media_assets')
		.select('storage_path')
		.eq('id', assetId)
		.eq('user_id', userId)
		.single();

	if (fetchError || !row) {
		return { error: 'Asset not found.' };
	}

	await supabase.storage.from(UGC_BUCKET).remove([String(row.storage_path)]);
	const { error: deleteError } = await supabase.from('media_assets').delete().eq('id', assetId);

	if (deleteError) {
		return { error: deleteError.message };
	}

	return { ok: true };
}

export async function linkMediaToTestimonial(
	testimonialId: string,
	assetIds: string[],
	userId: string
): Promise<void> {
	const admin = createAdminClient();
	if (!admin || assetIds.length === 0) return;

	const { data: assets } = await admin
		.from('media_assets')
		.select('id')
		.in('id', assetIds)
		.eq('user_id', userId)
		.eq('status', 'ready');

	const readyIds = (assets ?? []).map((a) => String(a.id));
	if (readyIds.length === 0) return;

	const rows = readyIds.map((mediaAssetId, index) => ({
		testimonial_id: testimonialId,
		media_asset_id: mediaAssetId,
		sort_order: index
	}));

	await admin.from('testimonial_media').insert(rows);
}

export async function listMediaForTestimonials(
	testimonialIds: string[]
): Promise<Map<string, MediaAsset[]>> {
	const result = new Map<string, MediaAsset[]>();
	if (testimonialIds.length === 0) return result;

	const admin = createAdminClient();
	if (!admin) return result;

	const { data: links } = await admin
		.from('testimonial_media')
		.select('testimonial_id, sort_order, media_assets(*)')
		.in('testimonial_id', testimonialIds)
		.order('sort_order', { ascending: true });

	if (!links) return result;

	for (const link of links) {
		const testimonialId = String(link.testimonial_id);
		const assetRow = link.media_assets as unknown as Record<string, unknown> | null;
		if (!assetRow) continue;
		const asset = rowToAsset(assetRow);
		const existing = result.get(testimonialId) ?? [];
		existing.push(asset);
		result.set(testimonialId, existing);
	}

	return result;
}

/** Signed read URL for approved testimonial media (short TTL). */
export async function signedReadUrl(storagePath: string): Promise<string | null> {
	const admin = createAdminClient();
	if (!admin) return null;

	const { data, error } = await admin.storage
		.from(UGC_BUCKET)
		.createSignedUrl(storagePath, UPLOAD_URL_TTL_SECONDS * 60);

	if (error || !data?.signedUrl) return null;
	return data.signedUrl;
}
