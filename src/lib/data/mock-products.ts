import type { Product } from '$lib/types/saleor';

const img = (id: number, w = 800, h = 800) =>
	`https://picsum.photos/seed/ag${id}/${w}/${h}`;

function product(
	id: string,
	name: string,
	slug: string,
	price: number,
	seed: number,
	description: string,
	category: string
): Product {
	return {
		id,
		name,
		slug,
		description,
		thumbnail: { id: `${id}-thumb`, url: img(seed, 600, 600), alt: name, type: 'IMAGE' },
		media: [
			{ id: `${id}-m1`, url: img(seed, 1200, 800), alt: name, type: 'IMAGE' },
			{ id: `${id}-m2`, url: img(seed + 1, 1200, 800), alt: `${name} detail`, type: 'IMAGE' }
		],
		pricing: {
			priceRange: {
				start: { amount: price, currency: 'USD' },
				stop: { amount: price, currency: 'USD' }
			}
		},
		variants: [
			{
				id: `${id}-v1`,
				name: 'Default',
				sku: `AG-${id.toUpperCase()}`,
				pricing: { price: { amount: price, currency: 'USD' } }
			}
		],
		category: { id: `cat-${category}`, name: category, slug: category.toLowerCase().replace(/\s+/g, '-') },
		isAvailableForPurchase: true
	};
}

export const mockProducts: Product[] = [
	product(
		'1',
		'Garage Flag Tee',
		'garage-flag-tee',
		38,
		101,
		'Heavyweight cotton tee with embroidered Animal Garage flag mark. Built for shop days and late-night wrench sessions.',
		'Apparel'
	),
	product(
		'2',
		'Redline Hoodie',
		'redline-hoodie',
		72,
		102,
		'Fleece-lined pullover with tonal redline stripe and oversized kangaroo pocket.',
		'Apparel'
	),
	product(
		'3',
		'Shop Floor Mat',
		'shop-floor-mat',
		45,
		103,
		'Oil-resistant garage mat with debossed logo. Keeps the concrete clean and the vibe right.',
		'Accessories'
	),
	product(
		'4',
		'Carbon Key Tag',
		'carbon-key-tag',
		18,
		104,
		'Real carbon fiber key tag with laser-etched AG monogram.',
		'Accessories'
	),
	product(
		'5',
		'Pit Crew Cap',
		'pit-crew-cap',
		32,
		105,
		'Structured snapback with embroidered pit crew patch and moisture-wicking headband.',
		'Headwear'
	),
	product(
		'6',
		'Garage Poster Set',
		'garage-poster-set',
		28,
		106,
		'Three 18×24" prints featuring shop builds, burnout art, and brand heritage typography.',
		'Posters'
	),
	product(
		'7',
		'Tool Roll',
		'tool-roll',
		55,
		107,
		'Waxed canvas roll with AG-branded leather tabs. Fits wrenches, sockets, and pride.',
		'Accessories'
	),
	product(
		'8',
		'Burnout Sticker Pack',
		'burnout-sticker-pack',
		12,
		108,
		'Die-cut vinyl stickers — tire smoke, garage dogs, and redline badges.',
		'Stickers'
	)
];

export function getProductBySlug(slug: string): Product | undefined {
	return mockProducts.find((p) => p.slug === slug);
}

export function getFeaturedProducts(count = 4): Product[] {
	return mockProducts.slice(0, count);
}
