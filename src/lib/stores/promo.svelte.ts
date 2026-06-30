const STORAGE_KEY = 'ag-promo-dismissed';

class PromoState {
	dismissed = $state(false);
	visible = $derived(!this.dismissed);
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
}

export const promo = new PromoState();
