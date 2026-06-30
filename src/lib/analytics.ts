import { getAnalyticsConfig } from '$lib/analytics/config';

/** Consent-gated client analytics hook (AUD-P2-012). Vendor-neutral — wire via env script URL. */
let enabled = false;
let scriptLoaded = false;
let sink: ((path: string) => void) | null = null;

export function setAnalyticsEnabled(value: boolean): void {
	enabled = value;
	if (value) initAnalyticsScript();
}

/** @internal test hook */
export function setAnalyticsSink(fn: ((path: string) => void) | null): void {
	sink = fn;
}

function initAnalyticsScript(): void {
	if (typeof window === 'undefined' || scriptLoaded || !enabled) return;

	const { scriptUrl } = getAnalyticsConfig();
	if (!scriptUrl) return;

	const script = document.createElement('script');
	script.src = scriptUrl;
	script.async = true;
	script.defer = true;
	document.head.appendChild(script);
	scriptLoaded = true;
}

export function trackPageView(path: string): void {
	if (!enabled) return;

	if (sink) {
		sink(path);
		return;
	}

	if (typeof window === 'undefined') return;

	const { configured } = getAnalyticsConfig();
	if (configured) {
		window.dispatchEvent(new CustomEvent('ag:pageview', { detail: { path } }));
		const tracker = (window as Window & { agTrackPageView?: (path: string) => void })
			.agTrackPageView;
		tracker?.(path);
		return;
	}

	if (import.meta.env.DEV) {
		console.debug('[analytics]', path);
	}
}
