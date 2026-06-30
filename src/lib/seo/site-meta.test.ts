import { describe, expect, it, vi } from 'vitest';
import {
	DEFAULT_OG_IMAGE_PATH,
	DEFAULT_SITE_DESCRIPTION,
	SITE_NAME,
	absoluteSiteUrl,
	defaultOgImageUrl,
	metaDescriptionFromText
} from './site-meta';

vi.mock('$lib/config/env', () => ({
	config: { siteUrl: 'https://animalgarage.net' }
}));

describe('site-meta', () => {
	it('exposes site defaults', () => {
		expect(SITE_NAME).toBe('Animal Garage');
		expect(DEFAULT_SITE_DESCRIPTION).toContain('Animal Garage');
		expect(DEFAULT_OG_IMAGE_PATH).toBe('/logo.svg');
	});

	it('builds absolute URLs from site config', () => {
		expect(absoluteSiteUrl()).toBe('https://animalgarage.net');
		expect(absoluteSiteUrl('/shop')).toBe('https://animalgarage.net/shop');
		expect(defaultOgImageUrl()).toBe('https://animalgarage.net/logo.svg');
	});

	it('strips HTML and truncates meta descriptions', () => {
		const html = '<p>Hello <strong>world</strong></p>';
		expect(metaDescriptionFromText(html)).toBe('Hello world');
		expect(metaDescriptionFromText('x'.repeat(200)).length).toBeLessThanOrEqual(160);
	});
});
