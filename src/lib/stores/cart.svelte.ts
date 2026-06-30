	import type { CheckoutDisplay, MockPromoState } from '$lib/types/checkout';
import type { CartItem } from '$lib/types/domain';
import type { Product } from '$lib/types/saleor';
import { config } from '$lib/config/env';
import {
	filterByCatalogKind,
	getCatalogKind,
	getCatalogProductById
} from '$lib/data/catalog-helpers';
import { getAllCatalogProducts } from '$lib/data/mock/parts';

const STORAGE_KEY = 'ag-cart';

function isSaleorCartEnabled(): boolean {
	return Boolean(config.saleorApiUrl);
}

function loadCart(): CartItem[] {
	if (typeof window === 'undefined') return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as CartItem[]) : [];
	} catch {
		return [];
	}
}

function saveCart(items: CartItem[]) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function dominantCatalogKind(products: Product[]): 'MERCH' | 'PARTS' {
	const counts = { MERCH: 0, PARTS: 0 };
	for (const product of products) {
		counts[getCatalogKind(product)] += 1;
	}
	if (counts.PARTS > counts.MERCH) return 'PARTS';
	return 'MERCH';
}

class CartState {
	items = $state<CartItem[]>([]);
	drawerOpen = $state(false);
	checkout = $state<CheckoutDisplay | null>(null);
	mockPromo = $state<MockPromoState | null>(null);
	private initialized = false;

	init() {
		if (this.initialized || typeof window === 'undefined') return;
		if (!isSaleorCartEnabled()) {
			this.items = loadCart();
		}
		this.initialized = true;
	}

	/** Hydrate Saleor checkout from server load (read-only display). */
	hydrateCheckout(checkout: CheckoutDisplay | null) {
		this.checkout = checkout;
	}

	hydrateMockPromo(promo: MockPromoState | null) {
		this.mockPromo = promo;
	}

	applyPromoResponse(payload: {
		checkout?: CheckoutDisplay | null;
		mockPromo?: MockPromoState | null;
	}) {
		if (payload.checkout) {
			this.checkout = payload.checkout;
		}
		if (payload.mockPromo !== undefined) {
			this.mockPromo = payload.mockPromo;
		}
	}

	get saleorEnabled() {
		return isSaleorCartEnabled();
	}

	get itemCount() {
		if (this.checkout) {
			return this.checkout.lines.reduce((sum, line) => sum + line.quantity, 0);
		}
		return this.items.reduce((sum, i) => sum + i.quantity, 0);
	}

	get subtotal() {
		if (this.checkout) {
			return this.checkout.subtotal.amount;
		}
		const raw = this.items.reduce((sum, item) => {
			const product = getCatalogProductById(item.productId);
			if (!product) return sum;
			const variant = product.variants.find((v) => v.id === item.variantId) ?? product.variants[0];
			return sum + variant.pricing.price.amount * item.quantity;
		}, 0);
		if (this.mockPromo?.percentOff) {
			return raw * (1 - this.mockPromo.percentOff / 100);
		}
		return raw;
	}

	get mockDiscountAmount() {
		if (!this.mockPromo?.percentOff) return 0;
		const raw = this.items.reduce((sum, item) => {
			const product = getCatalogProductById(item.productId);
			if (!product) return sum;
			const variant = product.variants.find((v) => v.id === item.variantId) ?? product.variants[0];
			return sum + variant.pricing.price.amount * item.quantity;
		}, 0);
		return raw - this.subtotal;
	}

	get saleorDiscountAmount() {
		return this.checkout?.discount?.amount ?? 0;
	}

	openDrawer() {
		this.drawerOpen = true;
	}

	closeDrawer() {
		this.drawerOpen = false;
	}

	toggleDrawer() {
		this.drawerOpen = !this.drawerOpen;
	}

	addItem(productId: string, variantId?: string, quantity = 1) {
		this.init();

		if (isSaleorCartEnabled()) {
			void this.addItemSaleor(productId, variantId, quantity);
			return;
		}

		const product = getCatalogProductById(productId);
		if (!product || !product.isAvailableForPurchase) return;

		const vid = variantId ?? product.variants[0]?.id;
		if (!vid) return;

		const existing = this.items.find((i) => i.productId === productId && i.variantId === vid);
		if (existing) {
			existing.quantity += quantity;
			this.items = [...this.items];
		} else {
			this.items = [...this.items, { productId, variantId: vid, quantity }];
		}
		saveCart(this.items);
	}

	private async addItemSaleor(productId: string, variantId: string | undefined, quantity: number) {
		let vid = variantId;

		// Live Saleor variant IDs are not in the mock catalog — skip lookup when variantId is known.
		if (!vid) {
			const product = getCatalogProductById(productId);
			if (!product || !product.isAvailableForPurchase) return;
			vid = product.variants[0]?.id;
		}

		if (!vid) return;

		try {
			const response = await fetch('/cart/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ variantId: vid, quantity })
			});

			if (!response.ok) return;

			const data = (await response.json()) as { checkout?: CheckoutDisplay };
			if (data.checkout) {
				this.checkout = data.checkout;
			}
		} catch {
			// Saleor unavailable — cart stays on last known checkout snapshot.
		}
	}

	removeItem(productId: string, variantId: string) {
		this.init();
		if (isSaleorCartEnabled()) return;

		this.items = this.items.filter(
			(i) => !(i.productId === productId && i.variantId === variantId)
		);
		saveCart(this.items);
	}

	updateQuantity(productId: string, variantId: string, quantity: number) {
		this.init();
		if (isSaleorCartEnabled()) return;

		if (quantity <= 0) {
			this.removeItem(productId, variantId);
			return;
		}
		this.items = this.items.map((i) =>
			i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i
		);
		saveCart(this.items);
	}

	clear() {
		this.items = [];
		this.checkout = null;
		this.mockPromo = null;
		if (!isSaleorCartEnabled()) {
			saveCart(this.items);
		}
	}

	getCartProducts(): { item: CartItem; product: Product }[] {
		this.init();
		return this.items
			.map((item) => {
				const product = getCatalogProductById(item.productId);
				return product ? { item, product } : null;
			})
			.filter((x): x is { item: CartItem; product: Product } => x !== null);
	}

	getUpsellSuggestions(limit = 4): Product[] {
		this.init();
		const cartProducts = this.getCartProducts();
		const cartIds = new Set(this.items.map((i) => i.productId));
		const kind = dominantCatalogKind(cartProducts.map(({ product }) => product));
		const cartCategories = new Set(
			cartProducts.map(({ product }) => product.category?.slug).filter(Boolean)
		);

		const catalog = filterByCatalogKind(getAllCatalogProducts(), kind);
		const related = catalog.filter(
			(p) =>
				!cartIds.has(p.id) &&
				p.isAvailableForPurchase &&
				cartCategories.has(p.category?.slug ?? '')
		);

		if (related.length >= limit) return related.slice(0, limit);

		const filler = catalog.filter(
			(p) => !cartIds.has(p.id) && p.isAvailableForPurchase && p.tags?.includes('staff-pick')
		);
		return [...related, ...filler].slice(0, limit);
	}
}

export const cart = new CartState();
