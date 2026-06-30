import { getOtelExportConfig } from './otel';

const DURATION_BUCKETS_SEC = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];

type MetricKey = string;

function labelKey(labels: Record<string, string>): MetricKey {
	return Object.entries(labels)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([k, v]) => `${k}="${escapeLabel(v)}"`)
		.join(',');
}

function escapeLabel(value: string): string {
	return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function formatLabels(labels: Record<string, string>): string {
	const body = labelKey(labels);
	return body ? `{${body}}` : '';
}

const requestTotals = new Map<MetricKey, number>();
const durationCounts = new Map<MetricKey, number>();
const durationSums = new Map<MetricKey, number>();
const durationBuckets = new Map<MetricKey, Map<number, number>>();

function requestLabels(method: string, route: string, status: number): Record<string, string> {
	return {
		method: method.toUpperCase(),
		route,
		status: String(status)
	};
}

function incrementMap(map: Map<MetricKey, number>, key: MetricKey, delta = 1): void {
	map.set(key, (map.get(key) ?? 0) + delta);
}

/** Record one HTTP request for the Prometheus scrape endpoint. */
export function recordHttpRequest(
	method: string,
	route: string,
	status: number,
	durationMs: number
): void {
	const labels = requestLabels(method, route, status);
	const key = labelKey(labels);
	const durationSec = durationMs / 1000;

	incrementMap(requestTotals, key);
	incrementMap(durationCounts, key);
	incrementMap(durationSums, key, durationSec);

	const buckets = durationBuckets.get(key) ?? new Map<number, number>();
	for (const le of DURATION_BUCKETS_SEC) {
		if (durationSec <= le) {
			buckets.set(le, (buckets.get(le) ?? 0) + 1);
		}
	}
	durationBuckets.set(key, buckets);
}

export function renderPrometheusMetrics(): string {
	const lines: string[] = [];

	lines.push('# HELP http_server_requests_total Total HTTP requests handled by the storefront.');
	lines.push('# TYPE http_server_requests_total counter');
	for (const [key, value] of [...requestTotals.entries()].sort(([a], [b]) => a.localeCompare(b))) {
		lines.push(`http_server_requests_total{${key}} ${value}`);
	}

	lines.push('# HELP http_server_request_duration_seconds HTTP request duration in seconds.');
	lines.push('# TYPE http_server_request_duration_seconds histogram');
	for (const [key, buckets] of [...durationBuckets.entries()].sort(([a], [b]) =>
		a.localeCompare(b)
	)) {
		for (const le of DURATION_BUCKETS_SEC) {
			lines.push(
				`http_server_request_duration_seconds_bucket{${key},le="${le}"} ${buckets.get(le) ?? 0}`
			);
		}
		lines.push(
			`http_server_request_duration_seconds_bucket{${key},le="+Inf"} ${durationCounts.get(key) ?? 0}`
		);
		lines.push(
			`http_server_request_duration_seconds_sum{${key}} ${formatFloat(durationSums.get(key) ?? 0)}`
		);
		lines.push(
			`http_server_request_duration_seconds_count{${key}} ${durationCounts.get(key) ?? 0}`
		);
	}

	const otel = getOtelExportConfig();
	lines.push(
		'# HELP storefront_otel_exporter_configured Whether OTEL_EXPORTER_OTLP_ENDPOINT is set.'
	);
	lines.push('# TYPE storefront_otel_exporter_configured gauge');
	lines.push(`storefront_otel_exporter_configured ${otel.configured ? 1 : 0}`);

	return `${lines.join('\n')}\n`;
}

function formatFloat(value: number): string {
	if (!Number.isFinite(value)) return '0';
	return String(value);
}

/** Vitest-only reset for in-memory counters. */
export function _resetMetricsForTests(): void {
	requestTotals.clear();
	durationCounts.clear();
	durationSums.clear();
	durationBuckets.clear();
}
