import { afterEach, describe, expect, it, vi } from 'vitest';

const { publicEnv } = vi.hoisted(() => ({
	publicEnv: {} as Record<string, string | undefined>
}));

vi.mock('$env/dynamic/public', () => ({
	get env() {
		return publicEnv;
	}
}));

import { buildAuthCallbackUrl, resolveAuthCallbackOrigin } from './callback-url';

function stubPublicSiteUrl(value: string) {
	publicEnv.PUBLIC_SITE_URL = value;
	vi.stubEnv('PUBLIC_SITE_URL', value);
}

describe('resolveAuthCallbackOrigin', () => {
	afterEach(() => {
		delete publicEnv.PUBLIC_SITE_URL;
		vi.unstubAllEnvs();
	});

	it('prefers request origin on localhost', () => {
		stubPublicSiteUrl('https://animalgarage.net');
		expect(resolveAuthCallbackOrigin('http://localhost:5173')).toBe('http://localhost:5173');
	});

	it('uses configured site URL when request origin is unrelated', () => {
		stubPublicSiteUrl('https://animalgarage.net');
		expect(resolveAuthCallbackOrigin('https://evil.example')).toBe('https://animalgarage.net');
	});

	it('allows Netlify preview origin when site URL is also Netlify', () => {
		stubPublicSiteUrl('https://deploy-abc.netlify.app');
		expect(resolveAuthCallbackOrigin('https://deploy-xyz.netlify.app')).toBe(
			'https://deploy-xyz.netlify.app'
		);
	});
});

describe('buildAuthCallbackUrl', () => {
	afterEach(() => {
		delete publicEnv.PUBLIC_SITE_URL;
		vi.unstubAllEnvs();
	});

	it('builds callback with redirect param', () => {
		stubPublicSiteUrl('http://localhost:5173');
		const url = buildAuthCallbackUrl('http://localhost:5173', '/account');
		expect(url).toBe('http://localhost:5173/auth/callback?redirect=%2Faccount');
	});
});
