import type { Product, Fitment, ProductBrand } from '$lib/types/saleor';
import { mockProducts } from './mock-products';

const img = (seed: string, w = 800, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

interface PartOpts {
	id: string;
	name: string;
	slug: string;
	price: number;
	seed: string;
	description: string;
	categorySlug: string;
	categoryName: string;
	brand: ProductBrand;
	fitment: Fitment[];
	tags?: string[];
	soldOut?: boolean;
	compareAtPrice?: number;
}

function part(opts: PartOpts): Product {
	const { id, name, slug, price, seed, description, categorySlug, categoryName, brand, fitment, tags, soldOut, compareAtPrice } = opts;
	return {
		id,
		name,
		slug,
		description,
		thumbnail: { id: `${id}-thumb`, url: img(seed, 600, 600), alt: name, type: 'IMAGE' },
		media: [
			{ id: `${id}-m1`, url: img(seed, 1200, 800), alt: name, type: 'IMAGE' },
			{ id: `${id}-m2`, url: img(`${seed}-d`, 1200, 800), alt: `${name} installed`, type: 'IMAGE' }
		],
		pricing: {
			priceRange: {
				start: { amount: price, currency: 'USD' },
				stop: { amount: price, currency: 'USD' }
			}
		},
		variants: [{ id: `${id}-v1`, name: 'Default', sku: `AG-PART-${id}`, pricing: { price: { amount: price, currency: 'USD' } } }],
		category: { id: `pc-${categorySlug}`, name: categoryName, slug: categorySlug },
		isAvailableForPurchase: !soldOut,
		availableQuantity: soldOut ? 0 : 25,
		productType: 'PART',
		brand,
		fitment,
		tags,
		compareAtPrice: compareAtPrice ? { amount: compareAtPrice, currency: 'USD' } : undefined
	};
}

const enkei: ProductBrand = { id: 'brand-enkei', name: 'Enkei', slug: 'enkei' };
const bcRacing: ProductBrand = { id: 'brand-bc', name: 'BC Racing', slug: 'bc-racing' };
const borla: ProductBrand = { id: 'brand-borla', name: 'Borla', slug: 'borla' };
const aem: ProductBrand = { id: 'brand-aem', name: 'AEM', slug: 'aem' };
const stoptech: ProductBrand = { id: 'brand-stoptech', name: 'StopTech', slug: 'stoptech' };
const apr: ProductBrand = { id: 'brand-apr', name: 'APR', slug: 'apr' };
const mishimoto: ProductBrand = { id: 'brand-mishi', name: 'Mishimoto', slug: 'mishimoto' };
const invidia: ProductBrand = { id: 'brand-invidia', name: 'Invidia', slug: 'invidia' };

const civicFitment: Fitment[] = [
	{ year: 2016, make: 'Honda', model: 'Civic', submodel: 'Si' },
	{ year: 2017, make: 'Honda', model: 'Civic', submodel: 'Si' },
	{ year: 2018, make: 'Honda', model: 'Civic', submodel: 'Si' },
	{ year: 2019, make: 'Honda', model: 'Civic', submodel: 'Si' },
	{ year: 2020, make: 'Honda', model: 'Civic', submodel: 'Si' }
];

const wrxFitment: Fitment[] = [
	{ year: 2015, make: 'Subaru', model: 'WRX' },
	{ year: 2016, make: 'Subaru', model: 'WRX' },
	{ year: 2017, make: 'Subaru', model: 'WRX' },
	{ year: 2018, make: 'Subaru', model: 'WRX' },
	{ year: 2019, make: 'Subaru', model: 'WRX' },
	{ year: 2020, make: 'Subaru', model: 'WRX' }
];

const zFitment: Fitment[] = [
	{ year: 2003, make: 'Nissan', model: '350Z' },
	{ year: 2004, make: 'Nissan', model: '350Z' },
	{ year: 2005, make: 'Nissan', model: '350Z' },
	{ year: 2006, make: 'Nissan', model: '350Z' },
	{ year: 2007, make: 'Nissan', model: '350Z' },
	{ year: 2008, make: 'Nissan', model: '350Z' }
];

export const mockParts: Product[] = [
	part({ id: 'p1', name: 'Enkei RPF1 17×9 +35', slug: 'enkei-rpf1-17x9', price: 389, seed: 'agpart-1', description: 'Legendary lightweight flow-formed wheel. Motorsport proven.', categorySlug: 'wheels', categoryName: 'Wheels', brand: enkei, fitment: civicFitment, tags: ['staff-pick'] }),
	part({ id: 'p2', name: 'Enkei TS-V 18×9.5 +38', slug: 'enkei-tsv-18x95', price: 449, seed: 'agpart-2', description: 'TS-V series with aggressive concave profile.', categorySlug: 'wheels', categoryName: 'Wheels', brand: enkei, fitment: wrxFitment }),
	part({ id: 'p3', name: 'Hub-Centric Wheel Spacers 15mm', slug: 'wheel-spacers-15mm', price: 89, seed: 'agpart-3', description: '6061-T6 aluminum spacers with hub-centric rings.', categorySlug: 'spacers', categoryName: 'Spacers & Adapters', brand: enkei, fitment: civicFitment }),
	part({ id: 'p4', name: 'BC Racing BR Series Coilovers', slug: 'bc-br-coilovers-civic', price: 1195, seed: 'agpart-4', description: '30-way damping adjustment. Swift springs included.', categorySlug: 'coilovers', categoryName: 'Coilovers', brand: bcRacing, fitment: civicFitment, tags: ['staff-pick'] }),
	part({ id: 'p5', name: 'BC Racing DS Series Coilovers', slug: 'bc-ds-coilovers-wrx', price: 1395, seed: 'agpart-5', description: 'Digressive piston design for street and track.', categorySlug: 'coilovers', categoryName: 'Coilovers', brand: bcRacing, fitment: wrxFitment }),
	part({ id: 'p6', name: 'Eibach Pro-Kit Springs', slug: 'eibach-pro-kit-civic', price: 289, seed: 'agpart-6', description: 'Progressive rate lowering springs. ~1.2" drop.', categorySlug: 'lowering-springs', categoryName: 'Lowering Springs', brand: bcRacing, fitment: civicFitment }),
	part({ id: 'p7', name: 'Whiteline Front Sway Bar 24mm', slug: 'whiteline-sway-24mm', price: 249, seed: 'agpart-7', description: 'Adjustable hollow bar with polyurethane bushings.', categorySlug: 'sway-bars', categoryName: 'Sway Bars', brand: bcRacing, fitment: wrxFitment }),
	part({ id: 'p8', name: 'Borla S-Type Cat-Back Exhaust', slug: 'borla-stype-civic', price: 899, seed: 'agpart-8', description: 'Deep aggressive tone without drone. T-304 stainless.', categorySlug: 'cat-back', categoryName: 'Cat-Back Systems', brand: borla, fitment: civicFitment, tags: ['staff-pick'] }),
	part({ id: 'p9', name: 'Invidia N1 Cat-Back', slug: 'invidia-n1-wrx', price: 749, seed: 'agpart-9', description: 'Single exit with burnt titanium tip. Track-ready sound.', categorySlug: 'cat-back', categoryName: 'Cat-Back Systems', brand: invidia, fitment: wrxFitment }),
	part({ id: 'p10', name: 'Borla ATAK Axle-Back', slug: 'borla-atak-350z', price: 649, seed: 'agpart-10', description: 'Maximum volume ATAK series for the VQ platform.', categorySlug: 'axle-back', categoryName: 'Axle-Back', brand: borla, fitment: zFitment }),
	part({ id: 'p11', name: 'AEM Cold Air Intake', slug: 'aem-cai-civic', price: 329, seed: 'agpart-11', description: 'CARB-compliant intake with dryflow filter.', categorySlug: 'intakes', categoryName: 'Cold Air Intakes', brand: aem, fitment: civicFitment }),
	part({ id: 'p12', name: 'AEM Brute Force Intake', slug: 'aem-bfi-wrx', price: 359, seed: 'agpart-12', description: 'Short ram intake for turbo platforms. +15 WHP typical.', categorySlug: 'intakes', categoryName: 'Cold Air Intakes', brand: aem, fitment: wrxFitment }),
	part({ id: 'p13', name: 'Mishimoto Performance Intercooler', slug: 'mishi-intercooler-wrx', price: 899, seed: 'agpart-13', description: '47% greater core volume. Direct bolt-on.', categorySlug: 'intercoolers', categoryName: 'Intercoolers', brand: mishimoto, fitment: wrxFitment, soldOut: true }),
	part({ id: 'p14', name: 'StopTech Sport Rotors (Pair)', slug: 'stoptech-rotors-civic', price: 189, seed: 'agpart-14', description: 'Slotted and drilled front rotors. Coated for corrosion resistance.', categorySlug: 'rotors', categoryName: 'Rotors', brand: stoptech, fitment: civicFitment }),
	part({ id: 'p15', name: 'StopTech Street Performance Pads', slug: 'stoptech-pads-wrx', price: 129, seed: 'agpart-15', description: 'Low dust compound with improved bite over OEM.', categorySlug: 'pads', categoryName: 'Brake Pads', brand: stoptech, fitment: wrxFitment }),
	part({ id: 'p16', name: 'StopTech Big Brake Kit — Front', slug: 'stoptech-bbk-350z', price: 2899, seed: 'agpart-16', description: '4-piston calipers with 328mm two-piece rotors.', categorySlug: 'bbk', categoryName: 'Big Brake Kits', brand: stoptech, fitment: zFitment, tags: ['staff-pick'] }),
	part({ id: 'p17', name: 'APR Carbon Fiber Front Lip', slug: 'apr-lip-civic', price: 549, seed: 'agpart-17', description: 'Pre-preg carbon with UV clear coat. Track tested aero.', categorySlug: 'front-lips', categoryName: 'Front Lips', brand: apr, fitment: civicFitment }),
	part({ id: 'p18', name: 'APR GT Wing — Adjustable', slug: 'apr-gt-wing-wrx', price: 1299, seed: 'agpart-18', description: '6061 billet uprights with Gurney flap included.', categorySlug: 'wings', categoryName: 'Wings & Spoilers', brand: apr, fitment: wrxFitment }),
	part({ id: 'p19', name: 'Mishimoto Oil Cooler Kit', slug: 'mishi-oil-cooler-350z', price: 649, seed: 'agpart-19', description: '19-row stacked plate cooler with AN fittings.', categorySlug: 'engine', categoryName: 'Engine', brand: mishimoto, fitment: zFitment }),
	part({ id: 'p20', name: 'Invidia Downpipe — Catted', slug: 'invidia-downpipe-wrx', price: 449, seed: 'agpart-20', description: 'High-flow catted downpipe. Requires tune.', categorySlug: 'exhaust', categoryName: 'Exhaust', brand: invidia, fitment: wrxFitment }),
	part({ id: 'p21', name: 'BC Racing Rear Camber Arms', slug: 'bc-camber-arms-civic', price: 189, seed: 'agpart-21', description: 'Adjustable rear camber arms. Spherical bearings.', categorySlug: 'control-arms', categoryName: 'Control Arms', brand: bcRacing, fitment: civicFitment }),
	part({ id: 'p22', name: 'Enkei PF01 15×7 +42', slug: 'enkei-pf01-15x7', price: 299, seed: 'agpart-22', description: 'Lightweight track wheel for budget builds.', categorySlug: 'wheels', categoryName: 'Wheels', brand: enkei, fitment: civicFitment, tags: ['clearance'], compareAtPrice: 349 }),
	part({ id: 'p23', name: 'AEM Wideband UEGO Gauge', slug: 'aem-wideband-gauge', price: 199, seed: 'agpart-23', description: 'Digital wideband O2 gauge with data logging output.', categorySlug: 'gauges', categoryName: 'Gauges', brand: aem, fitment: [{ year: 1990, make: 'Universal', model: 'Universal' }] }),
	part({ id: 'p24', name: 'Mishimoto Radiator', slug: 'mishi-radiator-wrx', price: 449, seed: 'agpart-24', description: 'All-aluminum core. 35% greater cooling capacity.', categorySlug: 'engine', categoryName: 'Engine', brand: mishimoto, fitment: wrxFitment }),
	part({ id: 'p25', name: 'StopTech Stainless Brake Lines', slug: 'stoptech-lines-civic', price: 89, seed: 'agpart-25', description: 'DOT-compliant braided stainless lines. Improved pedal feel.', categorySlug: 'lines', categoryName: 'Brake Lines', brand: stoptech, fitment: civicFitment }),
	part({ id: 'p26', name: 'Borla Muffler Delete Kit', slug: 'borla-muffler-delete-350z', price: 199, seed: 'agpart-26', description: 'Replace heavy OEM mufflers with straight-through design.', categorySlug: 'tips', categoryName: 'Tips & Adapters', brand: borla, fitment: zFitment }),
	part({ id: 'p27', name: 'APR Carbon Side Skirts', slug: 'apr-side-skirts-civic', price: 699, seed: 'agpart-27', description: 'Matching carbon side skirts for APR aero kit.', categorySlug: 'exterior', categoryName: 'Exterior', brand: apr, fitment: civicFitment, soldOut: true }),
	part({ id: 'p28', name: 'BC Racing Swift Spring Upgrade', slug: 'bc-swift-springs', price: 249, seed: 'agpart-28', description: 'Swift spec-R springs for BC coilovers. Linear rate.', categorySlug: 'lowering-springs', categoryName: 'Lowering Springs', brand: bcRacing, fitment: wrxFitment }),
	part({ id: 'p29', name: 'Enkei RSF5 18×8.5 +35', slug: 'enkei-rsf5-18x85', price: 419, seed: 'agpart-29', description: 'RSF5 flow-formed with split 5-spoke design.', categorySlug: 'flow-formed', categoryName: 'Flow Formed', brand: enkei, fitment: zFitment }),
	part({ id: 'p30', name: 'AEM Tru-Time Ignition Module', slug: 'aem-ignition-wrx', price: 279, seed: 'agpart-30', description: 'Plug-and-play ignition timing module. +8 WHP typical.', categorySlug: 'engine-management', categoryName: 'Engine Management', brand: aem, fitment: wrxFitment }),
	part({ id: 'p31', name: 'Mishimoto Shift Knob', slug: 'mishi-shift-knob', price: 49, seed: 'agpart-31', description: 'Weighted aluminum shift knob. M16×1.5 adapter included.', categorySlug: 'shift-knobs', categoryName: 'Shift Knobs', brand: mishimoto, fitment: [{ year: 1990, make: 'Universal', model: 'Universal' }] }),
	part({ id: 'p32', name: 'Invidia Front Pipe', slug: 'invidia-front-pipe-wrx', price: 299, seed: 'agpart-32', description: '3" stainless front pipe. Replaces restrictive OEM pipe.', categorySlug: 'headers', categoryName: 'Headers', brand: invidia, fitment: wrxFitment })
];

export function getPartBySlug(slug: string): Product | undefined {
	return mockParts.find((p) => p.slug === slug);
}

export function getPartsByCategory(categorySlug: string): Product[] {
	return mockParts.filter((p) => p.category?.slug === categorySlug);
}

export function searchParts(query: string): Product[] {
	const q = query.toLowerCase().trim();
	if (!q) return [];
	return mockParts.filter(
		(p) =>
			p.name.toLowerCase().includes(q) ||
			p.description.toLowerCase().includes(q) ||
			p.brand?.name.toLowerCase().includes(q) ||
			p.category?.name.toLowerCase().includes(q)
	);
}

export function getAllCatalogProducts(): Product[] {
	return [...mockProducts, ...mockParts];
}
