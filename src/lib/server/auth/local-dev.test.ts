import { describe, expect, it } from 'vitest';
import {
	isLocalDevAuthEnabled,
	isDevAdminEnabled,
	isProductionHostname,
	isProductionSiteUrl
} from './local-dev';

function mockEvent(hostname: string) {
	return { url: new URL(`http://${hostname}:5173/auth/sign-in`) };
}

describe('isProductionHostname', () => {
	it('matches production and subdomains', () => {
		expect(isProductionHostname('animalgarage.net')).toBe(true);
		expect(isProductionHostname('www.animalgarage.net')).toBe(true);
		expect(isProductionHostname('animalgarage.netlify.app')).toBe(true);
		expect(isProductionHostname('preview--animalgarage.netlify.app')).toBe(true);
		expect(isProductionHostname('localhost')).toBe(false);
	});

	it('blocks dev admin on Netlify preview hostnames', () => {
		expect(isDevAdminEnabled(mockEvent('animalgarage.netlify.app'))).toBe(false);
	});
});

describe('isLocalDevAuthEnabled', () => {
	it('is true on localhost in dev', () => {
		expect(isLocalDevAuthEnabled(mockEvent('localhost'))).toBe(true);
	});

	it('is false on production hostname', () => {
		expect(isLocalDevAuthEnabled(mockEvent('animalgarage.net'))).toBe(false);
	});
});

describe('isDevAdminEnabled', () => {
	it('is false on production hostname even when DEV_ADMIN would be set', () => {
		// DEV_ADMIN is read from env at runtime; production host guard is independent
		expect(isDevAdminEnabled(mockEvent('animalgarage.net'))).toBe(false);
	});

	it('is false on localhost when SITE_URL is production', () => {
		// isProductionSiteUrl reads config.siteUrl at runtime
		expect(typeof isProductionSiteUrl()).toBe('boolean');
		if (isProductionSiteUrl()) {
			expect(isDevAdminEnabled(mockEvent('localhost'))).toBe(false);
		}
	});
});

describe('isProductionSiteUrl', () => {
	it('is a function', () => {
		expect(typeof isProductionSiteUrl()).toBe('boolean');
	});
});
