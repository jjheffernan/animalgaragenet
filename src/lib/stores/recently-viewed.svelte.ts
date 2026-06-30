const STORAGE_KEY = 'ag-recently-viewed';
const MAX_ITEMS = 8;

function loadRecent(): string[] {
	if (typeof window === 'undefined') return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as string[]) : [];
	} catch {
		return [];
	}
}

function saveRecent(ids: string[]) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

class RecentlyViewedState {
	productIds = $state<string[]>([]);
	private initialized = false;

	init() {
		if (this.initialized || typeof window === 'undefined') return;
		this.productIds = loadRecent();
		this.initialized = true;
	}

	add(productId: string) {
		this.init();
		const filtered = this.productIds.filter((id) => id !== productId);
		this.productIds = [productId, ...filtered].slice(0, MAX_ITEMS);
		saveRecent(this.productIds);
	}

	clear() {
		this.productIds = [];
		saveRecent(this.productIds);
	}
}

export const recentlyViewed = new RecentlyViewedState();
