import { renderPrometheusMetrics } from '$lib/server/observability/metrics';
import type { RequestHandler } from './$types';

/** Prometheus text exposition for Grafana Mimir / Alloy scrape targets. */
export const GET: RequestHandler = async () => {
	return new Response(renderPrometheusMetrics(), {
		headers: {
			'content-type': 'text/plain; version=0.0.4; charset=utf-8',
			'cache-control': 'no-store'
		}
	});
};
