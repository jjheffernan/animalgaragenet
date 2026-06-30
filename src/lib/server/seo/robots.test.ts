import { describe, expect, it } from 'vitest';
import { renderRobotsTxt } from '$lib/server/seo/robots';

describe('robots.txt', () => {
	it('includes Sitemap from site URL', () => {
		const body = renderRobotsTxt('https://example.com/');
		expect(body).toContain('Sitemap: https://example.com/sitemap.xml');
		expect(body).toContain('User-agent: *');
	});
});
