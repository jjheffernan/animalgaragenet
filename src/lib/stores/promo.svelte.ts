const STORAGE_KEY = 'ag-promo-dismissed';

class PromoState {
	dismissed = $state(false);
	private initialized = false;

	init() {
		if (this.initialized || typeof window === 'undefined') return;
		this.dismissed = sessionStorage.getItem(STORAGE_KEY) === '1';
		this.initialized = true;
	}

	dismiss() {
		this.init();
		this.dismissed = true;
		sessionStorage.setItem(STORAGE_KEY, '1');
	}

	get visible() {
		this.init();
		return !this.dismissed;
	}
}

export const promo = new PromoState();
