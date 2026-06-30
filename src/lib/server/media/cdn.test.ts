import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const send = vi.fn();
const getSignedUrl = vi.fn();

vi.mock('@aws-sdk/client-cloudfront', () => ({
	CloudFrontClient: class {
		send = send;
	},
	CreateInvalidationCommand: class {
		constructor(input: unknown) {
			Object.assign(this, input);
		}
	}
}));

vi.mock('@aws-sdk/client-s3', () => ({
	S3Client: class {},
	PutObjectCommand: class {
		constructor(input: unknown) {
			Object.assign(this, input);
		}
	}
}));

vi.mock('@aws-sdk/s3-request-presigner', () => ({
	getSignedUrl
}));

vi.mock('$env/dynamic/private', () => ({
	env: {
		S3_BUCKET: 'animalgarage-media',
		S3_REGION: 'us-west-2',
		AWS_ACCESS_KEY_ID: 'test-key',
		AWS_SECRET_ACCESS_KEY: 'test-secret',
		AWS_CLOUDFRONT_DISTRIBUTION_ID: 'E1234567890'
	}
}));

vi.mock('$env/dynamic/public', () => ({
	env: {
		PUBLIC_CDN_BASE_URL: 'https://cdn.animalgarage.net'
	}
}));

describe('cdn invalidation', () => {
	beforeEach(() => {
		send.mockReset();
		send.mockResolvedValue({});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('invalidateCdnPaths returns false when paths are empty', async () => {
		const { invalidateCdnPaths } = await import('./cdn');
		await expect(invalidateCdnPaths([])).resolves.toBe(false);
		expect(send).not.toHaveBeenCalled();
	});

	it('invalidateCdnPaths creates CloudFront invalidation for object keys', async () => {
		const { invalidateCdnPaths } = await import('./cdn');
		const key = 'media/admin/550e8400-e29b-41d4-a716-446655440000/asset.jpg';
		await expect(invalidateCdnPaths([key])).resolves.toBe(true);
		expect(send).toHaveBeenCalledWith(
			expect.objectContaining({
				DistributionId: 'E1234567890',
				InvalidationBatch: expect.objectContaining({
					Paths: {
						Quantity: 1,
						Items: [`/${key}`]
					}
				})
			})
		);
	});

	it('invalidateCdnPaths rejects wildcard paths', async () => {
		const { invalidateCdnPaths } = await import('./cdn');
		await expect(invalidateCdnPaths(['/*'])).resolves.toBe(false);
		expect(send).not.toHaveBeenCalled();
	});

	it('invalidateCdnPaths rejects keys outside media/admin/', async () => {
		const { invalidateCdnPaths } = await import('./cdn');
		await expect(invalidateCdnPaths(['ugc/user/photo.jpg'])).resolves.toBe(false);
		expect(send).not.toHaveBeenCalled();
	});

	it('invalidateCdnPaths rejects path traversal', async () => {
		const { invalidateCdnPaths } = await import('./cdn');
		await expect(invalidateCdnPaths(['media/admin/../etc/passwd'])).resolves.toBe(false);
		expect(send).not.toHaveBeenCalled();
	});

	it('collectAdminInvalidationKeys prefers objectKey and dedupes paths', async () => {
		const { collectAdminInvalidationKeys } = await import('./cdn');
		const key = 'media/admin/550e8400-e29b-41d4-a716-446655440000/hero.jpg';
		const result = collectAdminInvalidationKeys({
			objectKey: key,
			paths: [`/${key}`, 'media/admin/00000000-0000-4000-8000-000000000001/other.png']
		});
		expect(result).toEqual({
			ok: true,
			keys: [key, 'media/admin/00000000-0000-4000-8000-000000000001/other.png']
		});
	});

	it('collectAdminInvalidationKeys rejects more than ten paths', async () => {
		const { collectAdminInvalidationKeys, MAX_CDN_INVALIDATION_PATHS } = await import('./cdn');
		const paths = Array.from(
			{ length: MAX_CDN_INVALIDATION_PATHS + 1 },
			(_, index) =>
				`media/admin/00000000-0000-4000-8000-${String(index).padStart(12, '0')}/file.jpg`
		);
		const result = collectAdminInvalidationKeys({ paths });
		expect(result.ok).toBe(false);
	});

	it('isCdnInvalidationConfigured is true when distribution ID is set', async () => {
		const { isCdnInvalidationConfigured } = await import('./cdn');
		expect(isCdnInvalidationConfigured()).toBe(true);
	});
});
