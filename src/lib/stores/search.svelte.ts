import { locale } from '$lib/stores/locale.svelte';
import { searchProducts } from '$lib/data/mock/products';
import { searchParts } from '$lib/data/mock/parts';
import { searchBuilds } from '$lib/data/mock/builds';
import { searchGuides } from '$lib/data/mock/guides';
import type { CatalogSearchResults } from '$lib/server/catalog/search';

class SearchState {
	open = $state(false);
	query = $state('');
	apiResults = $state<CatalogSearchResults | null>(null);
	useMockFallback = $state(false);
	searching = $state(false);

	productResults = $derived(
		(this.useMockFallback ? searchProducts(this.query) : (this.apiResults?.products ?? [])).slice(
			0,
			5
		)
	);
	partResults = $derived(
		(this.useMockFallback ? searchParts(this.query) : (this.apiResults?.parts ?? [])).slice(0, 5)
	);
	buildResults = $derived(
		(this.useMockFallback ? searchBuilds(this.query) : (this.apiResults?.builds ?? [])).slice(0, 3)
	);
	guideResults = $derived(
		(this.useMockFallback ? searchGuides(this.query) : (this.apiResults?.guides ?? [])).slice(0, 3)
	);
	hasResults = $derived(
		this.query.length > 0 &&
			this.productResults.length +
				this.partResults.length +
				this.buildResults.length +
				this.guideResults.length >
				0
	);

	openModal() {
		this.open = true;
	}

	closeModal() {
		this.open = false;
		this.query = '';
		this.apiResults = null;
		this.useMockFallback = false;
		this.searching = false;
	}

	toggle() {
		if (this.open) this.closeModal();
		else this.openModal();
	}

	setQuery(q: string) {
		this.query = q;
	}

	/** Debounced catalog search; return cleanup for `$effect`. */
	scheduleSearch(query: string, localeCode = locale.code): () => void {
		const q = query.trim();
		if (!q) {
			this.apiResults = null;
			this.useMockFallback = false;
			this.searching = false;
			return () => {};
		}

		const controller = new AbortController();
		this.searching = true;

		const timer = setTimeout(async () => {
			try {
				const params = new URLSearchParams({ q, locale: localeCode });
				const res = await fetch(`/api/catalog/search?${params}`, { signal: controller.signal });
				if (!res.ok) throw new Error('Search request failed');
				this.apiResults = (await res.json()) as CatalogSearchResults;
				this.useMockFallback = false;
			} catch {
				if (controller.signal.aborted) return;
				this.useMockFallback = true;
				this.apiResults = null;
			} finally {
				if (!controller.signal.aborted) this.searching = false;
			}
		}, 200);

		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	}
}

export const search = new SearchState();
