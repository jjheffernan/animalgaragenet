import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { UGC_BUCKET } from './constants';

export interface PresignedUpload {
	url: string;
	key: string;
	publicUrl: string;
}

/**
 * Resolve public media URL — Phase 2 migrates from Supabase Storage to S3 + CloudFront.
 * When `PUBLIC_CDN_BASE_URL` is unset, returns the path unchanged (caller may prefix origin).
 */
export function resolveCdnUrl(objectKey: string): string {
	const base = publicEnv.PUBLIC_CDN_BASE_URL?.replace(/\/$/, '');
	if (!base || !objectKey) return objectKey;
	const key = objectKey.startsWith('/') ? objectKey.slice(1) : objectKey;
	return `${base}/${key}`;
}

/** Public UGC asset URL — prefers CDN when configured, otherwise returns notice storage path. */
export function resolveUgcPublicUrl(storagePath: string): string {
	if (!storagePath) return storagePath;
	return resolveCdnUrl(`${UGC_BUCKET}/${storagePath}`);
}

/** True when a CDN base is set (read URLs can skip signed Supabase URLs). */
export function isCdnPublicReadConfigured(): boolean {
	return Boolean(publicEnv.PUBLIC_CDN_BASE_URL?.trim());
}

/** True when CloudFront/S3 env is configured for presigned admin uploads. */
export function isCdnUploadConfigured(): boolean {
	return Boolean(
		publicEnv.PUBLIC_CDN_BASE_URL?.trim() &&
			env.S3_BUCKET?.trim() &&
			env.AWS_ACCESS_KEY_ID?.trim() &&
			env.AWS_SECRET_ACCESS_KEY?.trim()
	);
}

/** Presigned PUT for admin `/admin/media` upload UI when S3 env is set. */
export async function createPresignedUploadUrl(
	key: string,
	contentType: string,
	expiresInSeconds = 300
): Promise<PresignedUpload | null> {
	if (!isCdnUploadConfigured()) return null;

	const bucket = env.S3_BUCKET!.trim();
	const region = env.S3_REGION?.trim() || 'us-west-2';
	const objectKey = key.startsWith('/') ? key.slice(1) : key;

	const client = new S3Client({
		region,
		credentials: {
			accessKeyId: env.AWS_ACCESS_KEY_ID!.trim(),
			secretAccessKey: env.AWS_SECRET_ACCESS_KEY!.trim()
		}
	});

	const command = new PutObjectCommand({
		Bucket: bucket,
		Key: objectKey,
		ContentType: contentType
	});

	const url = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });

	return {
		url,
		key: objectKey,
		publicUrl: resolveCdnUrl(objectKey)
	};
}

// @migration: intentional — CloudFront invalidation after asset replace; see docs/plans/active/inspiration-polish-tracker.md#IP-013
// export async function invalidateCdnPaths(paths: string[]): Promise<boolean> {
// 	if (!isCdnUploadConfigured() || !env.AWS_CLOUDFRONT_DISTRIBUTION_ID) return false;
// 	return false;
// }
