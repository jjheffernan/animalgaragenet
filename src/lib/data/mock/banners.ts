import type { PromoBanner } from '$lib/types/domain';

export const mockBanners: PromoBanner[] = [
	{
		id: 'banner-1',
		message: 'FREE SHIPPING on orders over $75 — domestic US',
		link: '/shop',
		linkLabel: 'Shop Now'
	},
	{
		id: 'banner-2',
		message: 'REDLINE DROP — Limited stock remaining',
		link: '/shop?collection=redline-drop',
		linkLabel: 'Grab Yours',
		endDate: '2026-07-15T23:59:59Z'
	}
];

export const FREE_SHIP_THRESHOLD = 75;

export function getActiveBanners(): PromoBanner[] {
	return mockBanners;
}
