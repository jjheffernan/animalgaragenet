import { setAnalyticsEnabled, trackPageView } from '$lib/analytics.svelte';
import { getCookieConsent, setCookieConsent } from '$lib/cookies/client';

/**
 * Reactive cookie-consent state. Cookie parse/serialize stays in `$lib/cookies/client`.
 */
class ConsentState {
	/** `undefined` until answered; mirrors cookie after init. */
	value = $state<boolean | undefined>(undefined);
	dismissed = $state(false);
	ready = $state(false);

	needsConsent = $derived(this.ready && this.value === undefined && !this.dismissed);

	init() {
		if (this.ready || typeof window === 'undefined') return;
		this.value = getCookieConsent();
		this.ready = true;
		if (this.value === true) setAnalyticsEnabled(true);
		if (this.value === false) setAnalyticsEnabled(false);
	}

	accept() {
		this.init();
		setCookieConsent(true);
		this.value = true;
		this.dismissed = true;
		setAnalyticsEnabled(true);
		if (typeof window !== 'undefined') {
			trackPageView(window.location.pathname);
		}
	}

	decline() {
		this.init();
		setCookieConsent(false);
		this.value = false;
		this.dismissed = true;
		setAnalyticsEnabled(false);
	}
}

export const consent = new ConsentState();
