import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildAuthCallbackUrl, resolveAuthCallbackOrigin } from './callback-url';

describe('resolveAuthCallbackOrigin', () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it('prefers request origin on localhost', () => {
		vi.stubEnv('PUBLIC_SITE_URL', 'https://animalgarage.net');
		expect(resolveAuthCallbackOrigin('http://localhost:5173')).toBe('http://localhost:5173');
	});

	it('uses configured site URL when request origin is unrelated', () => {
		vi.stubEnv('PUBLIC_SITE_URL', 'https://animalgarage.net');
		expect(resolveAuthCallbackOrigin('https://evil.example')).toBe('https://animalgarage.net');
	});

	it('allows Netlify preview origin when site URL is also Netlify', () => {
		vi.stubEnv('PUBLIC_SITE_URL', 'https://deploy-abc.netlify.app');
		expect(resolveAuthCallbackOrigin('https://deploy-xyz.netlify.app')).toBe(
			'https://deploy-xyz.netlify.app'
		);
	});
});

describe('buildAuthCallbackUrl', () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it('builds callback with redirect param', () => {
		vi.stubEnv('PUBLIC_SITE_URL', 'http://localhost:5173');
		const url = buildAuthCallbackUrl('http://localhost:5173', '/account');
		expect(url).toBe('http://localhost:5173/auth/callback?redirect=%2Faccount');
	});
});
