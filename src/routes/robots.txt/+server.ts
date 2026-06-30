import { renderRobotsTxt } from '$lib/server/seo/robots';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response(renderRobotsTxt(), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
