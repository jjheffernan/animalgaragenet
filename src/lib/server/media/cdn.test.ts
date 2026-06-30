import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { getSignedUrl } = vi.hoisted(() => ({
	getSignedUrl: vi.fn(async () => 'https://s3.example.com/presigned')
}));

vi.mock('@aws-sdk/client-s3', () => ({
	PutObjectCommand: vi.fn(function PutObjectCommand(this: unknown, input: unknown) {
		return input;
	}),
	S3Client: vi.fn()
}));

vi.mock('@aws-sdk/s3-request-presigner', () => ({
	getSignedUrl
}));

vi.mock('$env/dynamic/public', () => ({
	env: { PUBLIC_CDN_BASE_URL: '' }
}));

vi.mock('$env/dynamic/private', () => ({
	env: {
		S3_BUCKET: '',
		S3_REGION: '',
		AWS_ACCESS_KEY_ID: '',
		AWS_SECRET_ACCESS_KEY: ''
	}
}));

import { env as publicEnv } from '$env/dynamic/public';
import { env } from '$env/dynamic/private';
import {
	createPresignedUploadUrl,
	isCdnPublicReadConfigured,
	isCdnUploadConfigured,
	resolveCdnUrl,
	resolveUgcPublicUrl
} from './cdn';

describe('cdn helpers', () => {
	beforeEach(() => {
		publicEnv.PUBLIC_CDN_BASE_URL = '';
		env.S3_BUCKET = '';
		env.S3_REGION = '';
		env.AWS_ACCESS_KEY_ID = '';
		env.AWS_SECRET_ACCESS_KEY = '';
		getSignedUrl.mockClear();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('resolveCdnUrl returns path unchanged when CDN base is unset', () => {
		expect(resolveCdnUrl('ugc/user/photo.jpg')).toBe('ugc/user/photo.jpg');
	});

	it('resolveCdnUrl prefixes object key with CDN base', () => {
		publicEnv.PUBLIC_CDN_BASE_URL = 'https://cdn.animalgarage.net/';
		expect(resolveCdnUrl('ugc/user/photo.jpg')).toBe(
			'https://cdn.animalgarage.net/ugc/user/photo.jpg'
		);
	});

	it('resolveCdnUrl strips leading slash from object key', () => {
		publicEnv.PUBLIC_CDN_BASE_URL = 'https://cdn.animalgarage.net';
		expect(resolveCdnUrl('/ugc/user/photo.jpg')).toBe(
			'https://cdn.animalgarage.net/ugc/user/photo.jpg'
		);
	});

	it('resolveUgcPublicUrl builds bucket path under CDN', () => {
		publicEnv.PUBLIC_CDN_BASE_URL = 'https://cdn.animalgarage.net';
		expect(resolveUgcPublicUrl('user-1/asset.jpg')).toBe(
			'https://cdn.animalgarage.net/ugc/user-1/asset.jpg'
		);
	});

	it('isCdnPublicReadConfigured reflects PUBLIC_CDN_BASE_URL', () => {
		expect(isCdnPublicReadConfigured()).toBe(false);
		publicEnv.PUBLIC_CDN_BASE_URL = 'https://cdn.animalgarage.net';
		expect(isCdnPublicReadConfigured()).toBe(true);
	});

	it('isCdnUploadConfigured requires CDN base, bucket, and AWS credentials', () => {
		expect(isCdnUploadConfigured()).toBe(false);

		publicEnv.PUBLIC_CDN_BASE_URL = 'https://cdn.animalgarage.net';
		env.S3_BUCKET = 'ag-media';
		expect(isCdnUploadConfigured()).toBe(false);

		env.AWS_ACCESS_KEY_ID = 'key';
		env.AWS_SECRET_ACCESS_KEY = 'secret';
		expect(isCdnUploadConfigured()).toBe(true);
	});

	it('createPresignedUploadUrl returns null when upload env is incomplete', async () => {
		expect(await createPresignedUploadUrl('media/test.jpg', 'image/jpeg')).toBeNull();
	});

	it('createPresignedUploadUrl returns presigned PUT metadata when configured', async () => {
		publicEnv.PUBLIC_CDN_BASE_URL = 'https://cdn.animalgarage.net';
		env.S3_BUCKET = 'ag-media';
		env.S3_REGION = 'us-west-2';
		env.AWS_ACCESS_KEY_ID = 'key';
		env.AWS_SECRET_ACCESS_KEY = 'secret';

		const result = await createPresignedUploadUrl('media/test.jpg', 'image/jpeg', 120);
		expect(result).toEqual({
			url: 'https://s3.example.com/presigned',
			key: 'media/test.jpg',
			publicUrl: 'https://cdn.animalgarage.net/media/test.jpg'
		});
		expect(getSignedUrl).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				Bucket: 'ag-media',
				Key: 'media/test.jpg',
				ContentType: 'image/jpeg'
			}),
			{ expiresIn: 120 }
		);
	});
});
