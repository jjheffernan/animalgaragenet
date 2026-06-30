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
		await expect(invalidateCdnPaths(['media/admin/asset.jpg'])).resolves.toBe(true);
		expect(send).toHaveBeenCalledWith(
			expect.objectContaining({
				DistributionId: 'E1234567890',
				InvalidationBatch: expect.objectContaining({
					Paths: {
						Quantity: 1,
						Items: ['/media/admin/asset.jpg']
					}
				})
			})
		);
	});

	it('isCdnInvalidationConfigured is true when distribution ID is set', async () => {
		const { isCdnInvalidationConfigured } = await import('./cdn');
		expect(isCdnInvalidationConfigured()).toBe(true);
	});
});
