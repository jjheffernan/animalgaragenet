import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';
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

function awsCredentials() {
	return {
		accessKeyId: env.AWS_ACCESS_KEY_ID!.trim(),
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY!.trim()
	};
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

/** True when CloudFront invalidation can run after admin uploads. */
export function isCdnInvalidationConfigured(): boolean {
	return Boolean(isCdnUploadConfigured() && env.AWS_CLOUDFRONT_DISTRIBUTION_ID?.trim());
}

/** Max CloudFront paths per invalidation request (API + SDK guard). */
export const MAX_CDN_INVALIDATION_PATHS = 10;

/**
 * Admin upload-slot object keys: `media/admin/{uuid}/{filename}`.
 * Rejects wildcards (`*`), traversal (`..`), and keys outside the admin media prefix.
 */
const ADMIN_MEDIA_OBJECT_KEY =
	/^media\/admin\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/[a-zA-Z0-9._-]+$/i;

export function isAllowedCdnInvalidationKey(input: string): boolean {
	const trimmed = String(input).trim();
	if (!trimmed || trimmed.includes('*') || trimmed.includes('..')) return false;

	const key = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
	if (!key.startsWith('media/admin/')) return false;

	return ADMIN_MEDIA_OBJECT_KEY.test(key);
}

export function normalizeCdnInvalidationKey(input: string): string | null {
	const trimmed = String(input).trim();
	if (!isAllowedCdnInvalidationKey(trimmed)) return null;
	return trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
}

export interface CdnInvalidationRequest {
	paths?: unknown;
	objectKey?: unknown;
}

export type AdminInvalidationKeyResult =
	| { ok: true; keys: string[] }
	| { ok: false; error: string };

/** Collect and validate admin CDN invalidation keys (`objectKey` first, then `paths`). */
export function collectAdminInvalidationKeys(
	body: CdnInvalidationRequest
): AdminInvalidationKeyResult {
	const raw: string[] = [];

	if (body.objectKey != null) {
		raw.push(String(body.objectKey));
	}
	if (Array.isArray(body.paths)) {
		raw.push(...body.paths.map((path) => String(path)));
	}

	if (!raw.length) {
		return { ok: false, error: 'Provide at least one CDN path or objectKey.' };
	}

	const keys: string[] = [];
	const seen = new Set<string>();

	for (const item of raw) {
		const key = normalizeCdnInvalidationKey(item);
		if (!key) {
			return {
				ok: false,
				error:
					'Invalid CDN path. Only admin media object keys from the upload-slot flow are allowed.'
			};
		}
		if (!seen.has(key)) {
			seen.add(key);
			keys.push(key);
		}
	}

	if (keys.length > MAX_CDN_INVALIDATION_PATHS) {
		return {
			ok: false,
			error: `At most ${MAX_CDN_INVALIDATION_PATHS} paths per invalidation request.`
		};
	}

	return { ok: true, keys };
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
		credentials: awsCredentials()
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

/** CloudFront invalidation after asset replace — see inspiration-polish-tracker IP-013 / BATCH-020. */
export async function invalidateCdnPaths(paths: string[]): Promise<boolean> {
	if (!isCdnInvalidationConfigured() || !paths.length) return false;

	const keys = paths.map((path) => normalizeCdnInvalidationKey(path)).filter(Boolean) as string[];
	if (!keys.length || keys.length > MAX_CDN_INVALIDATION_PATHS) return false;

	const distributionId = env.AWS_CLOUDFRONT_DISTRIBUTION_ID!.trim();
	const items = keys.map((key) => `/${key}`);

	const client = new CloudFrontClient({
		region: 'us-east-1',
		credentials: awsCredentials()
	});

	await client.send(
		new CreateInvalidationCommand({
			DistributionId: distributionId,
			InvalidationBatch: {
				CallerReference: `ag-${Date.now()}-${crypto.randomUUID()}`,
				Paths: {
					Quantity: items.length,
					Items: items
				}
			}
		})
	);

	return true;
}
