import { readStoredJson, writeStoredJson } from './storage';

const STORAGE_KEY = 'ag-recently-viewed';
const MAX_ITEMS = 8;

class RecentlyViewedState {
	productIds = $state<string[]>([]);
	private initialized = false;

	init() {
		if (this.initialized || typeof window === 'undefined') return;
		this.productIds = readStoredJson<string[]>(STORAGE_KEY, []);
		this.initialized = true;
	}

	add(productId: string) {
		this.init();
		const filtered = this.productIds.filter((id) => id !== productId);
		this.productIds = [productId, ...filtered].slice(0, MAX_ITEMS);
		writeStoredJson(STORAGE_KEY, this.productIds);
	}

	clear() {
		this.productIds = [];
		writeStoredJson(STORAGE_KEY, this.productIds);
	}
}

export const recentlyViewed = new RecentlyViewedState();
