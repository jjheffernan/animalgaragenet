import { afterEach, describe, expect, it } from 'vitest';
import {
	_resetMetricsForTests,
	recordHttpRequest,
	renderPrometheusMetrics
} from './metrics';

afterEach(() => {
	_resetMetricsForTests();
});

describe('renderPrometheusMetrics', () => {
	it('exposes counter and histogram after recording a request', () => {
		recordHttpRequest('GET', '/api/health/metrics', 200, 12);

		const body = renderPrometheusMetrics();

		expect(body).toContain('# TYPE http_server_requests_total counter');
		expect(body).toContain(
			'http_server_requests_total{method="GET",route="/api/health/metrics",status="200"} 1'
		);
		expect(body).toContain('# TYPE http_server_request_duration_seconds histogram');
		expect(body).toContain('http_server_request_duration_seconds_count{method="GET"');
		expect(body).toContain('# TYPE storefront_otel_exporter_configured gauge');
	});
});
