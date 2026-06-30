import { isPromoDismissed, setPromoDismissed } from '$lib/cookies/client';

class PromoState {
	dismissed = $state(false);
	visible = $derived(!this.dismissed);
	private initialized = false;

	init() {
		if (this.initialized || typeof window === 'undefined') return;
		this.dismissed = isPromoDismissed();
		this.initialized = true;
	}

	dismiss() {
		this.init();
		this.dismissed = true;
		setPromoDismissed();
	}
}

export const promo = new PromoState();
