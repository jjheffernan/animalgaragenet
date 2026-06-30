import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/dynamic/public', () => ({
	env: { PUBLIC_CDN_BASE_URL: '' }
}));

vi.mock('$env/dynamic/private', () => ({
	env: { S3_BUCKET: '' }
}));

import { env as publicEnv } from '$env/dynamic/public';
import { env } from '$env/dynamic/private';
import { isCdnPublicReadConfigured, isCdnUploadConfigured, resolveCdnUrl, resolveUgcPublicUrl } from './cdn';

describe('cdn helpers', () => {
	beforeEach(() => {
		publicEnv.PUBLIC_CDN_BASE_URL = '';
		env.S3_BUCKET = '';
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

	it('isCdnUploadConfigured requires CDN base and S3 bucket', () => {
		expect(isCdnUploadConfigured()).toBe(false);

		publicEnv.PUBLIC_CDN_BASE_URL = 'https://cdn.animalgarage.net';
		expect(isCdnUploadConfigured()).toBe(false);

		env.S3_BUCKET = 'ag-media';
		expect(isCdnUploadConfigured()).toBe(true);
	});
});
