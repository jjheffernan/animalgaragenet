import {
	OTEL_EXPORTER_OTLP_ENDPOINT,
	OTEL_EXPORTER_OTLP_PROTOCOL,
	OTEL_SERVICE_NAME
} from '$app/env/private';

export type OtelExportConfig = {
	endpoint: string | null;
	protocol: string;
	serviceName: string;
	configured: boolean;
};

/**
 * Read OTLP env for future SDK wiring (Tempo).
 * When `configured` is true, initialize `@opentelemetry/sdk-node` in a follow-up.
 */
export function getOtelExportConfig(): OtelExportConfig {
	const endpoint = OTEL_EXPORTER_OTLP_ENDPOINT?.trim() || null;
	const protocol = OTEL_EXPORTER_OTLP_PROTOCOL?.trim() || 'http/protobuf';
	const serviceName = OTEL_SERVICE_NAME?.trim() || 'animalgarage-storefront';

	return {
		endpoint,
		protocol,
		serviceName,
		configured: Boolean(endpoint)
	};
}
