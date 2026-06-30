# LGTM observability runbook

**Public-safe** — placeholders and patterns only. No production hostnames or secret values.  
**Policy:** [SECURITY-PUBLIC.md](../SECURITY-PUBLIC.md) · **Env template:** [`.env.example`](../../.env.example)

Structured logs (Loki), Prometheus metrics (Mimir), and OTLP trace hooks (Tempo) for the SvelteKit storefront on Netlify.

**Related:** [deployment.md](./deployment.md) (Netlify env checklist)

---

## What ships in-app

| Signal | Mechanism | Where |
| ------ | --------- | ----- |
| Request logs | JSON lines on stdout | `src/hooks.server.ts` → `logHttpRequest()` |
| Metrics | Prometheus text scrape | `GET /api/health/metrics` |
| Trace context | W3C `traceparent` passthrough | `src/lib/server/observability/trace.ts` |
| OTLP export | Env hook point (SDK not bundled yet) | `getOtelExportConfig()` in `src/lib/server/observability/otel.ts` |

Helpers live under `src/lib/server/observability/`:

- `withRequestTiming` — wrap async work and capture `durationMs`
- `resolveRequestId` / `REQUEST_ID_HEADER` (`x-request-id`)
- `passthroughTraceHeaders` — echo valid inbound `traceparent` / `tracestate` on responses

---

## Request log shape (Loki)

Each handled request emits one JSON line:

```json
{
  "level": "info",
  "msg": "http_request",
  "method": "GET",
  "path": "/shop",
  "status": 200,
  "duration_ms": 42,
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736"
}
```

**Labels for Loki parsing (suggested):**

| Field | Use as label? | Notes |
| ----- | ------------- | ----- |
| `msg` | Yes | Always `http_request` |
| `method` | Yes | Low cardinality |
| `status` | Yes | HTTP status code |
| `path` | Careful | Route pathname only — no query string; high cardinality on dynamic slugs |
| `request_id` | No | High cardinality — keep as parsed field for correlation |
| `duration_ms` | No | Numeric field for quantiles in LogQL |

**PII:** Logs intentionally exclude query strings, cookies, client IPs, and user identifiers.

**Response header:** `x-request-id` is set on successful responses for client/support correlation.

---

## Metrics scrape (Mimir / Prometheus)

### Endpoint

```
GET https://<your-site-host>/api/health/metrics
```

`Content-Type: text/plain; version=0.0.4; charset=utf-8`

### Series

| Metric | Type | Labels |
| ------ | ---- | ------ |
| `http_server_requests_total` | counter | `method`, `route`, `status` |
| `http_server_request_duration_seconds` | histogram | `method`, `route`, `status` |
| `storefront_otel_exporter_configured` | gauge | `0` or `1` |

`route` is the SvelteKit route id (`event.route.id`, e.g. `/shop/[slug]`) for low Prometheus cardinality.

### Example Alloy / Prometheus scrape config

```yaml
scrape_configs:
  - job_name: animalgarage-storefront
    metrics_path: /api/health/metrics
    scheme: https
    static_configs:
      - targets: ['<your-site-host>']
    scrape_interval: 30s
```

On Netlify, protect the scrape target if needed (IP allowlist via Netlify Firewall, or scrape from an internal Alloy agent with a shared secret header — not implemented in-app; add when ops requires it).

---

## Traces (Tempo) — OTLP hook point

Full auto-instrumentation is **not** bundled (keeps the serverless bundle small). Env vars are read via `getOtelExportConfig()` for a future `@opentelemetry/sdk-node` init.

### Environment variables

| Variable | Required | Default | Purpose |
| -------- | -------- | ------- | ------- |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | For export | — | e.g. `https://<tempo-or-gateway-host>:4318` |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | No | `http/protobuf` | `http/protobuf` or `grpc` |
| `OTEL_SERVICE_NAME` | No | `animalgarage-storefront` | Service name in Tempo |
| `OTEL_TRACES_SAMPLER` | No | — | e.g. `parentbased_traceidratio` |
| `OTEL_TRACES_SAMPLER_ARG` | No | — | Sample rate, e.g. `0.1` |

Inbound `traceparent` headers are validated and echoed on responses so an edge proxy or future SDK can join traces started upstream.

**Follow-up (when enabling OTLP):** initialize the Node SDK in a dedicated `instrumentation.ts` imported from `hooks.server.ts`, export spans for `resolve()` and outbound Saleor/Supabase fetches, and ship to `OTEL_EXPORTER_OTLP_ENDPOINT`.

---

## Netlify limitations

| Topic | Limitation | Workaround |
| ----- | ---------- | ---------- |
| Logs | Function stdout → Netlify log drain, not a long-lived agent | Ship drains to Loki (Grafana Cloud, self-hosted Alloy) |
| Metrics | No built-in Prometheus sidecar | Scrape `GET /api/health/metrics` over HTTPS |
| Traces | Cold starts; no persistent OTLP batcher unless bundled | Low sample rate; parent-based sampling; consider edge-initiated traces |
| Scraping | Public URL | Firewall / allowlist if metrics must not be public |
| Cron | No native scheduler | External caller for cron routes (unchanged) |

---

## Local dev with Grafana stack

1. Copy env: `cp .env.example .env` and add OTEL placeholders if testing trace config:

   ```bash
   OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
   OTEL_SERVICE_NAME=animalgarage-storefront-local
   ```

2. Run the app: `npm run dev`

3. Tail JSON logs:

   ```bash
   npm run dev 2>&1 | grep http_request
   ```

4. Curl metrics:

   ```bash
   curl -s http://localhost:5173/api/health/metrics
   ```

5. **Optional — Grafana LGTM docker-compose** (Grafana Labs [otel-lgtm](https://github.com/grafana/docker-otel-lgtm) or your own stack):

   - Loki ← promtail or Alloy reading stdout / Netlify drain format
   - Mimir ← scrape `localhost:5173/api/health/metrics`
   - Tempo ← OTLP `:4318` when SDK is wired
   - Grafana ← datasources for all three

6. Import dashboards: start with Grafana Cloud / community **NGINX or generic HTTP** dashboards, retarget labels to `method`, `route`, `status`.

---

## Verification checklist

- [ ] `npm run test:unit` — `metrics.test.ts` passes
- [ ] Dev server emits JSON `http_request` lines per navigation
- [ ] `GET /api/health/metrics` returns Prometheus text after traffic
- [ ] `x-request-id` present on API responses
- [ ] Valid inbound `traceparent` echoed on response (optional manual curl)
- [ ] Netlify log drain pointed at Loki (ops)
- [ ] Prometheus/Alloy scrape job registered (ops)

---

## Related docs

| Doc | Topic |
| --- | ----- |
| [deployment.md](./deployment.md) | Netlify production runbook |
| [overview.md](./overview.md) | CDN, S3, Supabase architecture |
| [testing/readiness-report.md](../testing/readiness-report.md) | External dependency probes |
