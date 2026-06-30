import { beforeEach, describe, expect, it } from 'vitest';
import { mockParts } from '$lib/data/mock/parts';
import { mockProducts } from '$lib/data/mock/products';
import { getCatalogKind } from '$lib/data/catalog-helpers';
import { cart } from './cart.svelte';

const availableMerch = mockProducts.find((p) => p.isAvailableForPurchase)!;
const soldOutMerch = mockProducts.find((p) => !p.isAvailableForPurchase);
const availablePart = mockParts.find((p) => p.isAvailableForPurchase)!;

beforeEach(() => {
	cart.clear();
	cart.closeDrawer();
});

describe('cart store', () => {
	it('adds items and merges quantities for the same variant', () => {
		cart.addItem(availableMerch.id);
		expect(cart.itemCount).toBe(1);

		cart.addItem(availableMerch.id, availableMerch.variants[0].id, 2);
		expect(cart.itemCount).toBe(3);
	});

	it('does not add unavailable products', () => {
		if (soldOutMerch) {
			cart.addItem(soldOutMerch.id);
			expect(cart.itemCount).toBe(0);
		}
	});

	it('removes items and clears quantity via updateQuantity(0)', () => {
		const variantId = availableMerch.variants[0].id;
		cart.addItem(availableMerch.id, variantId, 2);
		cart.updateQuantity(availableMerch.id, variantId, 0);
		expect(cart.itemCount).toBe(0);
	});

	it('calculates subtotal from variant pricing', () => {
		const variantId = availableMerch.variants[0].id;
		cart.addItem(availableMerch.id, variantId, 2);
		const unitPrice = availableMerch.variants[0].pricing.price.amount;
		expect(cart.subtotal).toBe(unitPrice * 2);
	});

	it('suggests upsells in the dominant cart catalog kind', () => {
		cart.addItem(availablePart.id);
		const upsells = cart.getUpsellSuggestions(4);

		expect(upsells.length).toBeGreaterThan(0);
		expect(upsells.every((p) => getCatalogKind(p) === 'PARTS')).toBe(true);
		expect(upsells.every((p) => p.id !== availablePart.id)).toBe(true);
	});
});
