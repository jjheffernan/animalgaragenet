import type { Collection } from '$lib/types/saleor';
import { mockProducts } from './mock-products';

export const mockCollections: Collection[] = [
	{
		id: 'col-1',
		name: 'Shop Essentials',
		slug: 'shop-essentials',
		description: 'Gear built for the garage floor.',
		backgroundImage: {
			url: 'https://picsum.photos/seed/agcol1/1200/600',
			alt: 'Shop Essentials collection'
		},
		products: mockProducts.slice(0, 4)
	},
	{
		id: 'col-2',
		name: 'Redline Drop',
		slug: 'redline-drop',
		description: 'Limited run — when it\'s gone, it\'s gone.',
		backgroundImage: {
			url: 'https://picsum.photos/seed/agcol2/1200/600',
			alt: 'Redline Drop collection'
		},
		products: mockProducts.slice(4, 8)
	}
];
