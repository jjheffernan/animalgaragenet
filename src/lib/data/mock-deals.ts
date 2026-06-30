import type { Deal } from '$lib/types/domain';

export const FALLBACK_SALE_COLLECTION_ID = 'col-8';

export const mockDeals: Deal[] = [
	{
		id: 'deal-1',
		title: 'BC Racing Coilover Sale',
		description: '15% off all BC Racing coilovers this month.',
		discountLabel: '15% OFF',
		productIds: ['p4', 'p5', 'p21', 'p28'],
		active: true,
		expiresAt: '2026-07-31T23:59:59Z'
	},
	{
		id: 'deal-2',
		title: 'Enkei Wheel Clearance',
		description: 'Select Enkei wheels at clearance pricing.',
		discountLabel: 'UP TO $50 OFF',
		productIds: ['p22', 'p29'],
		collectionId: FALLBACK_SALE_COLLECTION_ID,
		active: true
	},
	{
		id: 'deal-3',
		title: 'Exhaust Week',
		description: 'Free shipping on all cat-back and axle-back systems.',
		discountLabel: 'FREE SHIP',
		productIds: ['p8', 'p9', 'p10', 'p20', 'p26'],
		active: true,
		expiresAt: '2026-07-15T23:59:59Z'
	},
	{
		id: 'deal-4',
		title: 'Merch Clearance Pit',
		description: 'Last-chance pricing on clearance apparel and accessories.',
		discountLabel: '30% OFF',
		productIds: ['8', '18', '30', '35', '40'],
		collectionId: 'col-8',
		active: true
	},
	{
		id: 'deal-5',
		title: 'Brake Pad Bundle',
		description: 'Buy pads + rotors, get lines free.',
		discountLabel: 'BUNDLE DEAL',
		productIds: ['p14', 'p15', 'p25'],
		active: true
	},
	{
		id: 'deal-6',
		title: 'Gift Card Bonus',
		description: 'Buy a $100 gift card, get $10 bonus credit.',
		discountLabel: '$10 BONUS',
		productIds: ['33'],
		active: true,
		expiresAt: '2026-08-01T23:59:59Z'
	}
];

export function getActiveDeals(): Deal[] {
	return mockDeals.filter((d) => d.active);
}

export function getActiveDealCount(): number {
	return getActiveDeals().length;
}

export function getDealProductIds(): string[] {
	const ids = new Set<string>();
	for (const deal of getActiveDeals()) {
		deal.productIds.forEach((id) => ids.add(id));
	}
	return [...ids];
}
