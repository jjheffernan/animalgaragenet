import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { UGC_BUCKET } from './constants';

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
	return Boolean(publicEnv.PUBLIC_CDN_BASE_URL?.trim() && env.S3_BUCKET?.trim());
}

// @migration: intentional — presigned PUT for admin /admin/media upload UI; see docs/plans/active/inspiration-polish-tracker.md#IP-013
// export async function createPresignedUploadUrl(
// 	key: string,
// 	contentType: string,
// 	expiresInSeconds = 300
// ): Promise<{ url: string; fields: Record<string, string> } | null> {
// 	if (!isCdnUploadConfigured()) return null;
// 	return null;
// }

// @migration: intentional — CloudFront invalidation after asset replace; see docs/plans/active/inspiration-polish-tracker.md#IP-013
// export async function invalidateCdnPaths(paths: string[]): Promise<boolean> {
// 	if (!isCdnUploadConfigured() || !env.AWS_CLOUDFRONT_DISTRIBUTION_ID) return false;
// 	return false;
// }
