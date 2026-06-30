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
import { locale } from '$lib/stores/locale.svelte';
import { readStoredJson, writeStoredJson } from './storage';

const STORAGE_KEY = 'ag-cart';

function isSaleorCartEnabled(): boolean {
	return Boolean(config.saleorApiUrl);
}

function checkoutApiUrl(path = '/cart/checkout'): string {
	return `${path}?locale=${encodeURIComponent(locale.code)}`;
}

function mockItemsRawSubtotal(items: CartItem[]): number {
	return items.reduce((sum, item) => {
		const product = getCatalogProductById(item.productId);
		if (!product) return sum;
		const variant = product.variants.find((v) => v.id === item.variantId) ?? product.variants[0];
		return sum + variant.pricing.price.amount * item.quantity;
	}, 0);
}

async function mutateCheckout(
	method: 'POST' | 'PATCH' | 'DELETE',
	body: Record<string, unknown>
): Promise<CheckoutDisplay | null> {
	try {
		const response = await fetch(checkoutApiUrl(), {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		if (!response.ok) return null;
		const data = (await response.json()) as { checkout?: CheckoutDisplay };
		return data.checkout ?? null;
	} catch {
		return null;
	}
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
			this.items = readStoredJson<CartItem[]>(STORAGE_KEY, []);
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
		const raw = mockItemsRawSubtotal(this.items);
		if (this.mockPromo?.percentOff) {
			return raw * (1 - this.mockPromo.percentOff / 100);
		}
		return raw;
	}

	get subtotalCurrency() {
		if (this.checkout) return this.checkout.subtotal.currency;
		return config.defaultCurrency;
	}

	get mockDiscountAmount() {
		if (!this.mockPromo?.percentOff) return 0;
		return mockItemsRawSubtotal(this.items) - this.subtotal;
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
			// @saleor-migration: intentional — live add-line via POST /cart/checkout; see docs/commerce/saleor.md#quick-migration
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
		writeStoredJson(STORAGE_KEY, this.items);
	}

	private async addItemSaleor(_productId: string, variantId: string | undefined, quantity: number) {
		const vid = variantId?.trim();
		if (!vid) return;

		const checkout = await mutateCheckout('POST', { variantId: vid, quantity });
		if (checkout) this.checkout = checkout;
	}

	removeItem(productId: string, variantId: string) {
		this.init();
		if (isSaleorCartEnabled()) {
			const line = this.checkout?.lines.find(
				(l) => l.productId === productId && l.variantId === variantId
			);
			if (line) void this.removeSaleorLine(line.id);
			return;
		}

		this.items = this.items.filter(
			(i) => !(i.productId === productId && i.variantId === variantId)
		);
		writeStoredJson(STORAGE_KEY, this.items);
	}

	updateQuantity(productId: string, variantId: string, quantity: number) {
		this.init();
		if (isSaleorCartEnabled()) {
			const line = this.checkout?.lines.find(
				(l) => l.productId === productId && l.variantId === variantId
			);
			if (line) void this.updateSaleorLineQuantity(line.id, quantity);
			return;
		}

		if (quantity <= 0) {
			this.removeItem(productId, variantId);
			return;
		}
		this.items = this.items.map((i) =>
			i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i
		);
		writeStoredJson(STORAGE_KEY, this.items);
	}

	updateSaleorLineQuantity(lineId: string, quantity: number) {
		if (!isSaleorCartEnabled()) return;
		void mutateCheckout('PATCH', { lineId, quantity }).then((checkout) => {
			if (checkout) this.checkout = checkout;
		});
	}

	removeSaleorLine(lineId: string) {
		if (!isSaleorCartEnabled()) return;
		void mutateCheckout('DELETE', { lineId }).then((checkout) => {
			if (checkout) this.checkout = checkout;
		});
	}

	clear() {
		this.items = [];
		this.checkout = null;
		this.mockPromo = null;
		if (!isSaleorCartEnabled()) {
			writeStoredJson(STORAGE_KEY, this.items);
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
				!cartIds.has(p.id) && p.isAvailableForPurchase && cartCategories.has(p.category?.slug ?? '')
		);

		if (related.length >= limit) return related.slice(0, limit);

		const filler = catalog.filter(
			(p) => !cartIds.has(p.id) && p.isAvailableForPurchase && p.tags?.includes('staff-pick')
		);
		return [...related, ...filler].slice(0, limit);
	}
}

export const cart = new CartState();
