import { getAnalyticsConfig } from '$lib/analytics/config';

/** Consent-gated client analytics hook (AUD-P2-012). Vendor-neutral — wire via env script URL. */
class AnalyticsState {
	enabled = $state(false);
	private scriptLoaded = false;
	private sink: ((path: string) => void) | null = null;

	setEnabled(value: boolean) {
		this.enabled = value;
		if (value) this.initScript();
	}

	/** @internal test hook */
	setSink(fn: ((path: string) => void) | null) {
		this.sink = fn;
	}

	private initScript() {
		if (typeof window === 'undefined' || this.scriptLoaded || !this.enabled) return;

		const { scriptUrl } = getAnalyticsConfig();
		if (!scriptUrl) return;

		const script = document.createElement('script');
		script.src = scriptUrl;
		script.async = true;
		script.defer = true;
		document.head.appendChild(script);
		this.scriptLoaded = true;
	}

	trackPageView(path: string) {
		if (!this.enabled) return;

		if (this.sink) {
			this.sink(path);
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
}

export const analytics = new AnalyticsState();

/** Imperative helpers — preserve call sites from layout / consent. */
export function setAnalyticsEnabled(value: boolean): void {
	analytics.setEnabled(value);
}

/** @internal test hook */
export function setAnalyticsSink(fn: ((path: string) => void) | null): void {
	analytics.setSink(fn);
}

export function trackPageView(path: string): void {
	analytics.trackPageView(path);
}
