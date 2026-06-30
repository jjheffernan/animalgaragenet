import type { Collection } from '$lib/types/saleor';
import { mockProducts } from './products';

const colImg = (seed: string) => `https://picsum.photos/seed/${seed}/1200/600`;

export const mockCollections: Collection[] = [
	{
		id: 'col-1',
		name: 'Shop Essentials',
		slug: 'shop-essentials',
		description: 'Gear built for the garage floor — tees, hoodies, and daily drivers.',
		backgroundImage: { url: colImg('agcol-essentials'), alt: 'Shop Essentials collection' },
		products: mockProducts.filter((p) => ['apparel', 'accessories'].includes(p.category?.slug ?? ''))
	},
	{
		id: 'col-2',
		name: 'Redline Drop',
		slug: 'redline-drop',
		description: "Limited run — when it's gone, it's gone.",
		backgroundImage: { url: colImg('agcol-redline'), alt: 'Redline Drop collection' },
		products: mockProducts.slice(0, 6)
	},
	{
		id: 'col-3',
		name: 'Gymkhana Energy',
		slug: 'gymkhana-energy',
		description: 'Censor bars, tire smoke, and full-send energy. Gymkhana-inspired campaign gear.',
		backgroundImage: { url: colImg('agcol-gymkhana'), alt: 'Gymkhana Energy collection' },
		products: mockProducts.filter((p) => p.slug.includes('censor') || p.slug.includes('burnout'))
	},
	{
		id: 'col-4',
		name: 'Censor Bar Collection',
		slug: 'censor-bar',
		description: 'The iconic censored look — tees, stickers, and accessories.',
		backgroundImage: { url: colImg('agcol-censor'), alt: 'Censor Bar collection' },
		products: mockProducts.filter((p) => p.name.toLowerCase().includes('censor'))
	},
	{
		id: 'col-5',
		name: 'Driver Gear',
		slug: 'driver-gear',
		description: 'Everything you need behind the wheel — gloves, caps, and more.',
		backgroundImage: { url: colImg('agcol-driver'), alt: 'Driver Gear collection' },
		products: mockProducts.filter(
			(p) => p.category?.slug === 'accessories' || p.category?.slug === 'headwear'
		)
	},
	{
		id: 'col-6',
		name: 'Auto Accessories',
		slug: 'auto-accessories',
		description: 'Air fresheners, license frames, dice, and dash gear for your ride.',
		backgroundImage: { url: colImg('agcol-auto'), alt: 'Auto Accessories collection' },
		products: mockProducts.filter((p) => p.category?.slug === 'auto')
	},
	{
		id: 'col-7',
		name: 'Garage Home',
		slug: 'garage-home',
		description: 'Flags, posters, neon, and shop decor for your space.',
		backgroundImage: { url: colImg('agcol-home'), alt: 'Garage Home collection' },
		products: mockProducts.filter((p) => p.category?.slug === 'home')
	},
	{
		id: 'col-8',
		name: 'Clearance Pit',
		slug: 'clearance',
		description: 'Last-chance deals on past drops. No restocks.',
		backgroundImage: { url: colImg('agcol-clearance'), alt: 'Clearance Pit collection' },
		products: mockProducts.filter((p) => p.tags?.includes('clearance'))
	},
	{
		id: 'col-9',
		name: 'Staff Picks',
		slug: 'staff-picks',
		description: 'Hand-picked favorites from the Animal Garage crew.',
		backgroundImage: { url: colImg('agcol-staff'), alt: 'Staff Picks collection' },
		products: mockProducts.filter((p) => p.tags?.includes('staff-pick'))
	},
	{
		id: 'col-10',
		name: 'Gift Cards',
		slug: 'gift-cards',
		description: 'Give the gift of garage culture. $25–$200 denominations.',
		backgroundImage: { url: colImg('agcol-gift'), alt: 'Gift Cards collection' },
		products: mockProducts.filter((p) => p.productType === 'GIFT_CARD')
	},
	{
		id: 'col-11',
		name: 'Headwear Drop',
		slug: 'headwear-drop',
		description: 'Caps, beanies, and dad hats for every season.',
		backgroundImage: { url: colImg('agcol-headwear'), alt: 'Headwear Drop collection' },
		products: mockProducts.filter((p) => p.category?.name === 'Headwear')
	},
	{
		id: 'col-12',
		name: 'Track Day Kit',
		slug: 'track-day-kit',
		description: 'Everything for your next HPDE — towels, gloves, and windbreakers.',
		backgroundImage: { url: colImg('agcol-track'), alt: 'Track Day Kit collection' },
		products: mockProducts.filter((p) =>
			['track-day-towel', 'driver-gloves', 'zip-up-windbreaker'].includes(p.slug)
		)
	},
	{
		id: 'col-13',
		name: 'Sticker & Slaps',
		slug: 'stickers',
		description: 'Slap stickers, die-cuts, and decal packs.',
		backgroundImage: { url: colImg('agcol-stickers'), alt: 'Sticker collection' },
		products: mockProducts.filter((p) => p.category?.name === 'Stickers')
	}
];

export function getCollectionBySlug(slug: string): Collection | undefined {
	return mockCollections.find((c) => c.slug === slug);
}

export function getShopCollections(): Collection[] {
	return mockCollections.filter((c) => c.slug !== 'clearance');
}
