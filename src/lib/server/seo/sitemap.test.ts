import { describe, expect, it } from 'vitest';
import {
	collectSitemapUrls,
	renderSitemapXml,
	SITEMAP_STATIC_PATHS
} from '$lib/server/seo/sitemap';

describe('sitemap', () => {
	it('includes nav-linked static paths', () => {
		expect(SITEMAP_STATIC_PATHS).toContain('/shop');
		expect(SITEMAP_STATIC_PATHS).toContain('/policies/privacy');
	});

	it('renders valid urlset XML', () => {
		const xml = renderSitemapXml([
			{ loc: 'https://example.com/shop' },
			{ loc: 'https://example.com/blog/post-1', lastmod: '2026-06-30T12:00:00.000Z' }
		]);

		expect(xml).toContain('<?xml version="1.0"');
		expect(xml).toContain('<loc>https://example.com/shop</loc>');
		expect(xml).toContain('<lastmod>2026-06-30</lastmod>');
		expect(xml).toContain('</urlset>');
	});

	it('collects mock catalog slugs when Saleor is unset', async () => {
		const urls = await collectSitemapUrls('https://example.com');
		const locs = urls.map((u) => u.loc);

		expect(locs).toContain('https://example.com/');
		expect(locs).toContain('https://example.com/shop');
		expect(locs.some((loc) => loc.includes('/shop/'))).toBe(true);
		expect(locs.some((loc) => loc.includes('/parts/'))).toBe(true);
	});
});
