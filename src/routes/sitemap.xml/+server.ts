import { renderSitemapXml, collectSitemapUrls } from '$lib/server/seo/sitemap';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const urls = await collectSitemapUrls();
	const body = renderSitemapXml(urls);

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
