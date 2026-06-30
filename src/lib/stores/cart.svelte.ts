import type { CartItem } from '$lib/types/domain';
import type { Product } from '$lib/types/saleor';
import { mockProducts, getProductById } from '$lib/data/mock-products';
import { mockParts } from '$lib/data/mock-parts';

const STORAGE_KEY = 'ag-cart';

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

function findProduct(productId: string): Product | undefined {
	return getProductById(productId) ?? mockParts.find((p) => p.id === productId);
}

class CartState {
	items = $state<CartItem[]>([]);
	drawerOpen = $state(false);
	private initialized = false;

	init() {
		if (this.initialized || typeof window === 'undefined') return;
		this.items = loadCart();
		this.initialized = true;
	}

	get itemCount() {
		return this.items.reduce((sum, i) => sum + i.quantity, 0);
	}

	get subtotal() {
		return this.items.reduce((sum, item) => {
			const product = findProduct(item.productId);
			if (!product) return sum;
			const variant = product.variants.find((v) => v.id === item.variantId) ?? product.variants[0];
			return sum + variant.pricing.price.amount * item.quantity;
		}, 0);
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
		const product = findProduct(productId);
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

	removeItem(productId: string, variantId: string) {
		this.init();
		this.items = this.items.filter(
			(i) => !(i.productId === productId && i.variantId === variantId)
		);
		saveCart(this.items);
	}

	updateQuantity(productId: string, variantId: string, quantity: number) {
		this.init();
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
		saveCart(this.items);
	}

	getCartProducts(): { item: CartItem; product: Product }[] {
		this.init();
		return this.items
			.map((item) => {
				const product = findProduct(item.productId);
				return product ? { item, product } : null;
			})
			.filter((x): x is { item: CartItem; product: Product } => x !== null);
	}

	getUpsellSuggestions(limit = 4): Product[] {
		this.init();
		const cartIds = new Set(this.items.map((i) => i.productId));
		const cartCategories = new Set(
			this.getCartProducts()
				.map(({ product }) => product.category?.slug)
				.filter(Boolean)
		);

		const allProducts = [...mockProducts, ...mockParts];
		const related = allProducts.filter(
			(p) =>
				!cartIds.has(p.id) &&
				p.isAvailableForPurchase &&
				cartCategories.has(p.category?.slug ?? '')
		);

		if (related.length >= limit) return related.slice(0, limit);

		const filler = allProducts.filter(
			(p) => !cartIds.has(p.id) && p.isAvailableForPurchase && p.tags?.includes('staff-pick')
		);
		return [...related, ...filler].slice(0, limit);
	}
}

export const cart = new CartState();
