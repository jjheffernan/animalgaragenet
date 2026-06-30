import { config } from '$lib/config/env';

/** robots.txt body — Sitemap uses PUBLIC_SITE_URL (SEO-002). */
export function renderRobotsTxt(siteUrl = config.siteUrl): string {
	const origin = siteUrl.replace(/\/$/, '');
	return `# allow crawling everything by default
User-agent: *
Disallow:

Sitemap: ${origin}/sitemap.xml
`;
}
