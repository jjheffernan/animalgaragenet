import type { Product, ProductBrand, Fitment } from '$lib/types/saleor';

const img = (seed: string, w = 800, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

interface ProductOpts {
	id: string;
	name: string;
	slug: string;
	price: number;
	seed: string;
	description: string;
	category: string;
	categorySlug?: string;
	tags?: string[];
	productType?: Product['productType'];
	soldOut?: boolean;
	compareAtPrice?: number;
	brand?: ProductBrand;
	variants?: { name: string; price?: number }[];
	fitment?: Fitment[];
	availableQuantity?: number;
}

function product(opts: ProductOpts): Product {
	const {
		id,
		name,
		slug,
		price,
		seed,
		description,
		category,
		categorySlug,
		tags,
		productType = 'STANDARD',
		soldOut = false,
		compareAtPrice,
		brand,
		variants,
		fitment,
		availableQuantity
	} = opts;

	const variantList = variants?.length
		? variants.map((v, i) => ({
				id: `${id}-v${i + 1}`,
				name: v.name,
				sku: `AG-${id.toUpperCase()}-${i + 1}`,
				pricing: { price: { amount: v.price ?? price, currency: 'USD' } }
			}))
		: [
				{
					id: `${id}-v1`,
					name: 'Default',
					sku: `AG-${id.toUpperCase()}`,
					pricing: { price: { amount: price, currency: 'USD' } }
				}
			];

	const prices = variantList.map((v) => v.pricing.price.amount);

	return {
		id,
		name,
		slug,
		description,
		thumbnail: { id: `${id}-thumb`, url: img(seed, 600, 600), alt: name, type: 'IMAGE' },
		media: [
			{ id: `${id}-m1`, url: img(seed, 1200, 800), alt: name, type: 'IMAGE' },
			{ id: `${id}-m2`, url: img(`${seed}-d`, 1200, 800), alt: `${name} detail`, type: 'IMAGE' }
		],
		pricing: {
			priceRange: {
				start: { amount: Math.min(...prices), currency: 'USD' },
				stop: { amount: Math.max(...prices), currency: 'USD' }
			}
		},
		variants: variantList,
		category: {
			id: `cat-${categorySlug ?? category.toLowerCase().replace(/\s+/g, '-')}`,
			name: category,
			slug: categorySlug ?? category.toLowerCase().replace(/\s+/g, '-')
		},
		isAvailableForPurchase: !soldOut,
		availableQuantity: soldOut ? 0 : (availableQuantity ?? 50),
		tags,
		productType,
		compareAtPrice: compareAtPrice ? { amount: compareAtPrice, currency: 'USD' } : undefined,
		brand,
		fitment
	};
}

const agBrand: ProductBrand = { id: 'brand-ag', name: 'Animal Garage', slug: 'animal-garage' };

const handcraftedMockProducts: Product[] = [
	// Apparel
	product({
		id: '1',
		name: 'Garage Flag Tee',
		slug: 'garage-flag-tee',
		price: 38,
		seed: 'ag-prod-1',
		description:
			'Heavyweight cotton tee with embroidered Animal Garage flag mark. Built for shop days and late-night wrench sessions.',
		category: 'Apparel',
		tags: ['staff-pick'],
		brand: agBrand,
		variants: [
			{ name: 'Black / S', price: 38 },
			{ name: 'Black / M', price: 38 },
			{ name: 'Black / L', price: 38 },
			{ name: 'Black / XL', price: 38 }
		]
	}),
	product({
		id: '2',
		name: 'Redline Hoodie',
		slug: 'redline-hoodie',
		price: 72,
		seed: 'ag-prod-2',
		description: 'Fleece-lined pullover with tonal redline stripe and oversized kangaroo pocket.',
		category: 'Apparel',
		brand: agBrand,
		variants: [
			{ name: 'Charcoal / S', price: 72 },
			{ name: 'Charcoal / M', price: 72 },
			{ name: 'Charcoal / L', price: 72 },
			{ name: 'Charcoal / XL', price: 72 }
		]
	}),
	product({
		id: '3',
		name: 'Burnout Boxy Tee',
		slug: 'burnout-boxy-tee',
		price: 42,
		seed: 'ag-prod-3',
		description: 'Oversized boxy fit with tire smoke graphic across the chest. 240gsm cotton.',
		category: 'Apparel',
		brand: agBrand
	}),
	product({
		id: '4',
		name: 'Pit Lane Long Sleeve',
		slug: 'pit-lane-long-sleeve',
		price: 48,
		seed: 'ag-prod-4',
		description: 'Thermal long sleeve with pit lane stripe sleeves and AG wordmark.',
		category: 'Apparel',
		soldOut: true,
		brand: agBrand
	}),
	product({
		id: '5',
		name: 'Shop Dog Crewneck',
		slug: 'shop-dog-crewneck',
		price: 65,
		seed: 'ag-prod-5',
		description: 'French terry crew with shop dog mascot embroidered on the chest.',
		category: 'Apparel',
		tags: ['staff-pick'],
		brand: agBrand
	}),
	product({
		id: '6',
		name: 'Censor Bar Tee',
		slug: 'censor-bar-tee',
		price: 36,
		seed: 'ag-prod-6',
		description: 'Gymkhana-inspired censored graphic tee. Limited colorway.',
		category: 'Apparel',
		brand: agBrand,
		variants: [
			{ name: 'White / M', price: 36 },
			{ name: 'White / L', price: 36 },
			{ name: 'Black / M', price: 36 },
			{ name: 'Black / L', price: 36 }
		]
	}),
	product({
		id: '7',
		name: 'Garage Squad Jersey',
		slug: 'garage-squad-jersey',
		price: 58,
		seed: 'ag-prod-7',
		description: 'Motorsport mesh jersey with sublimated AG squad graphics.',
		category: 'Apparel',
		brand: agBrand
	}),
	product({
		id: '8',
		name: 'Wrench Life Tank',
		slug: 'wrench-life-tank',
		price: 28,
		seed: 'ag-prod-8',
		description: 'Summer shop tank with vintage AG logo. Relaxed fit.',
		category: 'Apparel',
		tags: ['clearance'],
		compareAtPrice: 34,
		brand: agBrand
	}),
	// Headwear
	product({
		id: '9',
		name: 'Pit Crew Cap',
		slug: 'pit-crew-cap',
		price: 32,
		seed: 'ag-prod-9',
		description:
			'Structured snapback with embroidered pit crew patch and moisture-wicking headband.',
		category: 'Headwear',
		categorySlug: 'accessories',
		tags: ['staff-pick'],
		brand: agBrand,
		variants: [
			{ name: 'Black', price: 32 },
			{ name: 'Navy', price: 32 },
			{ name: 'Red', price: 32 }
		]
	}),
	product({
		id: '10',
		name: 'Redline Dad Hat',
		slug: 'redline-dad-hat',
		price: 28,
		seed: 'ag-prod-10',
		description: 'Unstructured dad hat with redline underbill and AG flag patch.',
		category: 'Headwear',
		categorySlug: 'accessories',
		brand: agBrand
	}),
	product({
		id: '11',
		name: 'Shop Beanie',
		slug: 'shop-beanie',
		price: 24,
		seed: 'ag-prod-11',
		description: 'Ribbed knit beanie with woven AG label. Winter shop essential.',
		category: 'Headwear',
		categorySlug: 'accessories',
		soldOut: true,
		brand: agBrand
	}),
	// Accessories
	product({
		id: '12',
		name: 'Shop Floor Mat',
		slug: 'shop-floor-mat',
		price: 45,
		seed: 'ag-prod-12',
		description: 'Oil-resistant garage mat with debossed logo. Keeps the concrete clean.',
		category: 'Accessories',
		brand: agBrand
	}),
	product({
		id: '13',
		name: 'Carbon Key Tag',
		slug: 'carbon-key-tag',
		price: 18,
		seed: 'ag-prod-13',
		description: 'Real carbon fiber key tag with laser-etched AG monogram.',
		category: 'Accessories',
		brand: agBrand
	}),
	product({
		id: '14',
		name: 'Tool Roll',
		slug: 'tool-roll',
		price: 55,
		seed: 'ag-prod-14',
		description: 'Waxed canvas roll with AG-branded leather tabs. Fits wrenches and sockets.',
		category: 'Accessories',
		tags: ['staff-pick'],
		brand: agBrand
	}),
	product({
		id: '15',
		name: 'Lanyard + Keychain Set',
		slug: 'lanyard-keychain-set',
		price: 16,
		seed: 'ag-prod-15',
		description: 'Woven lanyard with metal keychain and AG enamel charm.',
		category: 'Accessories',
		brand: agBrand
	}),
	product({
		id: '16',
		name: 'Garage Tote Bag',
		slug: 'garage-tote-bag',
		price: 22,
		seed: 'ag-prod-16',
		description: 'Heavy canvas tote with reinforced handles. Parts run approved.',
		category: 'Accessories',
		brand: agBrand
	}),
	product({
		id: '17',
		name: 'Burnout Sticker Pack',
		slug: 'burnout-sticker-pack',
		price: 12,
		seed: 'ag-prod-17',
		description: 'Die-cut vinyl stickers — tire smoke, garage dogs, and redline badges.',
		category: 'Stickers',
		categorySlug: 'accessories',
		brand: agBrand
	}),
	product({
		id: '18',
		name: 'AG Slap Sticker Bundle',
		slug: 'ag-slap-sticker-bundle',
		price: 8,
		seed: 'ag-prod-18',
		description: 'Five large-format slap stickers for your toolbox, helmet, or quarter panel.',
		category: 'Stickers',
		categorySlug: 'accessories',
		tags: ['clearance'],
		compareAtPrice: 12,
		brand: agBrand
	}),
	// Auto
	product({
		id: '19',
		name: 'Garage Scent Air Freshener',
		slug: 'garage-scent-air-freshener',
		price: 8,
		seed: 'ag-prod-19',
		description: 'New car smell meets burnt rubber. Hanging air freshener, 30-day scent.',
		category: 'Auto',
		brand: agBrand,
		variants: [
			{ name: 'Garage Scent', price: 8 },
			{ name: 'Tire Smoke', price: 8 },
			{ name: 'Octane', price: 8 }
		]
	}),
	product({
		id: '20',
		name: 'AG License Plate Frame',
		slug: 'ag-license-plate-frame',
		price: 24,
		seed: 'ag-prod-20',
		description: 'Aluminum license plate frame with laser-cut AG logo. All 50 states.',
		category: 'Auto',
		tags: ['staff-pick'],
		brand: agBrand,
		variants: [
			{ name: 'Black', price: 24 },
			{ name: 'Chrome', price: 28 }
		]
	}),
	product({
		id: '21',
		name: 'Fuzzy Dice — Redline',
		slug: 'fuzzy-dice-redline',
		price: 18,
		seed: 'ag-prod-21',
		description: 'Classic fuzzy dice in AG redline colorway. Mirror hanger included.',
		category: 'Auto',
		brand: agBrand
	}),
	product({
		id: '22',
		name: 'Shift Knob Cover',
		slug: 'shift-knob-cover',
		price: 14,
		seed: 'ag-prod-22',
		description: 'Neoprene shift knob cover with AG embroidery. Universal fit.',
		category: 'Auto',
		soldOut: true,
		brand: agBrand
	}),
	product({
		id: '23',
		name: 'Dashboard Sunshade',
		slug: 'dashboard-sunshade',
		price: 32,
		seed: 'ag-prod-23',
		description: 'Foldable windshield sunshade with full-color AG garage graphic.',
		category: 'Auto',
		brand: agBrand
	}),
	product({
		id: '24',
		name: 'Seat Belt Pads (Pair)',
		slug: 'seat-belt-pads',
		price: 20,
		seed: 'ag-prod-24',
		description: 'Velvet seat belt shoulder pads with embroidered AG logo.',
		category: 'Auto',
		brand: agBrand
	}),
	// Home
	product({
		id: '25',
		name: 'Garage Poster Set',
		slug: 'garage-poster-set',
		price: 28,
		seed: 'ag-prod-25',
		description: 'Three 18×24" prints featuring shop builds, burnout art, and brand heritage.',
		category: 'Home',
		brand: agBrand
	}),
	product({
		id: '26',
		name: 'Shop Flag Banner',
		slug: 'shop-flag-banner',
		price: 35,
		seed: 'ag-prod-26',
		description: '3×5 ft garage flag with reinforced grommets. Indoor/outdoor rated.',
		category: 'Home',
		tags: ['staff-pick'],
		brand: agBrand
	}),
	product({
		id: '27',
		name: 'Neon Sign — AG Logo',
		slug: 'neon-sign-ag-logo',
		price: 120,
		seed: 'ag-prod-27',
		description: 'LED neon-style sign for your garage wall. Dimmer included.',
		category: 'Home',
		soldOut: true,
		brand: agBrand
	}),
	product({
		id: '28',
		name: 'Garage Mug',
		slug: 'garage-mug',
		price: 18,
		seed: 'ag-prod-28',
		description: 'Ceramic mug with heat-reactive AG logo. 12oz capacity.',
		category: 'Home',
		brand: agBrand
	}),
	product({
		id: '29',
		name: 'Shop Clock',
		slug: 'shop-clock',
		price: 42,
		seed: 'ag-prod-29',
		description: 'Industrial wall clock with AG branding. Silent sweep movement.',
		category: 'Home',
		brand: agBrand
	}),
	product({
		id: '30',
		name: 'Garage Coaster Set',
		slug: 'garage-coaster-set',
		price: 16,
		seed: 'ag-prod-30',
		description: 'Set of 4 cork-backed coasters with motorsport-inspired AG graphics.',
		category: 'Home',
		tags: ['clearance'],
		compareAtPrice: 22,
		brand: agBrand
	}),
	// Gift Cards
	product({
		id: '31',
		name: 'Digital Gift Card — $25',
		slug: 'gift-card-25',
		price: 25,
		seed: 'ag-gift-25',
		description: 'Digital gift card delivered via email. Redeemable on merch and parts.',
		category: 'Gift Cards',
		categorySlug: 'gift-cards',
		productType: 'GIFT_CARD',
		brand: agBrand
	}),
	product({
		id: '32',
		name: 'Digital Gift Card — $50',
		slug: 'gift-card-50',
		price: 50,
		seed: 'ag-gift-50',
		description: 'Digital gift card delivered via email. Redeemable on merch and parts.',
		category: 'Gift Cards',
		categorySlug: 'gift-cards',
		productType: 'GIFT_CARD',
		brand: agBrand
	}),
	product({
		id: '33',
		name: 'Digital Gift Card — $100',
		slug: 'gift-card-100',
		price: 100,
		seed: 'ag-gift-100',
		description: 'Digital gift card delivered via email. Redeemable on merch and parts.',
		category: 'Gift Cards',
		categorySlug: 'gift-cards',
		productType: 'GIFT_CARD',
		brand: agBrand
	}),
	product({
		id: '34',
		name: 'Digital Gift Card — $200',
		slug: 'gift-card-200',
		price: 200,
		seed: 'ag-gift-200',
		description: 'Digital gift card delivered via email. Redeemable on merch and parts.',
		category: 'Gift Cards',
		categorySlug: 'gift-cards',
		productType: 'GIFT_CARD',
		brand: agBrand
	}),
	// Clearance / limited
	product({
		id: '35',
		name: 'Legacy Logo Tee',
		slug: 'legacy-logo-tee',
		price: 22,
		seed: 'ag-prod-35',
		description: 'Original AG logo tee from the first drop. Final stock.',
		category: 'Apparel',
		tags: ['clearance'],
		compareAtPrice: 38,
		brand: agBrand
	}),
	product({
		id: '36',
		name: 'Pop-Up Event Tee',
		slug: 'pop-up-event-tee',
		price: 26,
		seed: 'ag-prod-36',
		description: 'Event-exclusive tee from the LA pop-up. Limited sizes remain.',
		category: 'Apparel',
		tags: ['clearance'],
		compareAtPrice: 40,
		soldOut: true,
		brand: agBrand
	}),
	product({
		id: '37',
		name: 'Driver Gloves',
		slug: 'driver-gloves',
		price: 34,
		seed: 'ag-prod-37',
		description: 'Mechanics-style gloves with AG palm grip. Touchscreen compatible.',
		category: 'Accessories',
		tags: ['staff-pick'],
		brand: agBrand,
		variants: [
			{ name: 'S', price: 34 },
			{ name: 'M', price: 34 },
			{ name: 'L', price: 34 },
			{ name: 'XL', price: 34 }
		]
	}),
	product({
		id: '38',
		name: 'Garage Socks (3-Pack)',
		slug: 'garage-socks-3pack',
		price: 20,
		seed: 'ag-prod-38',
		description: 'Crew socks with tire tread sole grip and AG heel tab.',
		category: 'Apparel',
		brand: agBrand
	}),
	product({
		id: '39',
		name: 'Zip-Up Windbreaker',
		slug: 'zip-up-windbreaker',
		price: 88,
		seed: 'ag-prod-39',
		description: 'Lightweight windbreaker with reflective AG hits. Packable hood.',
		category: 'Apparel',
		tags: ['staff-pick'],
		brand: agBrand,
		variants: [
			{ name: 'Black / M', price: 88 },
			{ name: 'Black / L', price: 88 },
			{ name: 'Black / XL', price: 88 }
		]
	}),
	product({
		id: '40',
		name: 'Garage Bandana',
		slug: 'garage-bandana',
		price: 14,
		seed: 'ag-prod-40',
		description: 'Cotton bandana with all-over AG pattern. Head, neck, or pocket.',
		category: 'Accessories',
		tags: ['clearance'],
		compareAtPrice: 18,
		brand: agBrand
	}),
	product({
		id: '41',
		name: 'Track Day Towel',
		slug: 'track-day-towel',
		price: 26,
		seed: 'ag-prod-41',
		description: 'Microfiber towel with AG logo. For sweat, spills, and victory laps.',
		category: 'Accessories',
		soldOut: true,
		brand: agBrand
	}),
	product({
		id: '42',
		name: 'Garage Pin Set',
		slug: 'garage-pin-set',
		price: 15,
		seed: 'ag-prod-42',
		description: 'Enamel pin set — flag, wrench, and shop dog. Soft backing included.',
		category: 'Accessories',
		brand: agBrand
	})
];

const teeNames = [
	'Grid Lock Tee',
	'Drift Mode Tee',
	'Redline Script Tee',
	'Shop Floor Tee',
	'Burnout Club Tee',
	'Garage Nights Tee',
	'Flag Wave Tee',
	'Rev Limit Tee',
	'Paddock Pass Tee',
	'Torque Spec Tee',
	'Flat Out Tee',
	'Grip Lab Tee',
	'Launch Control Tee',
	'Sliding Doors Tee',
	'Heat Cycle Tee'
];

const sweatNames = [
	'Garage Crew Hoodie',
	'Pit Stop Hoodie',
	'Redline Pullover',
	'Shop Warmup Crewneck',
	'Midnight Wrench Hoodie',
	'Garage Fleece Crew',
	'Trackside Hoodie',
	'Oil Stain Hoodie',
	'Garage Layer Hoodie',
	'Cold Start Hoodie',
	'Boxer Engine Crew',
	'Garage Heritage Hoodie',
	'Dyno Room Hoodie',
	'Garage Spec Crew',
	'Oversteer Hoodie'
];

const jacketNames = [
	'Garage Softshell Jacket',
	'Track Day Shell',
	'Redline Bomber',
	'Shop Coach Jacket',
	'Garage Parka',
	'Paddock Shell Jacket',
	'Garage Storm Jacket',
	'Night Shift Jacket',
	'Garage Utility Jacket',
	'Spec R Jacket',
	'Garage Rally Jacket',
	'Cold Pit Jacket',
	'Garage Work Jacket',
	'Grid Walk Jacket',
	'Garage Insulated Jacket'
];

const headwearNames = [
	'Garage Trucker Cap',
	'Redline Beanie',
	'Shop Snapback',
	'Garage Five Panel',
	'Pit Crew Bucket Hat',
	'Garage Wool Cap',
	'Trackside Visor',
	'Garage Mesh Cap',
	'Redline Knit Cap',
	'Shop Floor Cap',
	'Garage Corduroy Cap',
	'Burnout Bucket',
	'Garage Flag Cap',
	'Spec Visor',
	'Garage Dad Cap'
];

const accessoryNames = [
	'Garage Key Lanyard',
	'Shop Wristband Set',
	'Garage Patch Pack',
	'Redline Keychain',
	'Garage Bottle Opener',
	'Shop Zip Pouch',
	'Garage Carabiner',
	'Redline Wallet',
	'Garage Patch Hat',
	'Shop Microfiber Cloth',
	'Garage Desk Mat',
	'Redline Cable Wrap',
	'Garage Badge Set',
	'Shop Pen Set',
	'Garage Cord Organizer'
];

const homeNames = [
	'Garage Wall Print',
	'Shop Blueprint Poster',
	'Garage Throw Blanket',
	'Redline Pillow',
	'Garage Desk Clock',
	'Shop Sign Metal',
	'Garage Candle',
	'Redline Rug',
	'Garage Photo Frame',
	'Shop Blueprint Mug',
	'Garage Shelf Block',
	'Redline Tapestry',
	'Garage Bar Mat',
	'Shop Heritage Print',
	'Garage LED Sign Mini'
];

const autoNames = [
	'Garage Tire Valve Caps',
	'Redline Mirror Tag',
	'Garage Cup Holder Insert',
	'Shop Floor Mats AG',
	'Garage Trunk Organizer',
	'Redline Seat Gap Filler',
	'Garage Sun Strip',
	'Shop Wheel Cleaner Towel',
	'Garage Phone Mount',
	'Redline Pedal Covers',
	'Garage Rear View Charm',
	'Shop Visor Clip',
	'Garage Trunk Badge',
	'Redline Steering Wrap',
	'Garage Dash Tray'
];

function padShopCatalog(base: Product[]): Product[] {
	const result = [...base];
	let id = 100;

	const addProduct = (opts: Omit<ProductOpts, 'id' | 'seed'>) => {
		const nextId = id++;
		result.push(product({ ...opts, id: String(nextId), seed: `ag-prod-gen-${nextId}` }));
	};

	const teeCount = () =>
		result.filter((p) => p.name.toLowerCase().includes('tee') || p.category?.slug === 'apparel')
			.length;
	const sweatCount = () =>
		result.filter(
			(p) =>
				p.name.toLowerCase().includes('hoodie') ||
				p.name.toLowerCase().includes('sweat') ||
				p.name.toLowerCase().includes('crew')
		).length;
	const jacketCount = () => result.filter((p) => p.name.toLowerCase().includes('jacket')).length;
	const headwearCount = () => result.filter((p) => p.category?.slug === 'headwear').length;
	const accessoryCount = () =>
		result.filter((p) => ['accessories', 'stickers'].includes(p.category?.slug ?? '')).length;
	const homeCount = () =>
		result.filter((p) => ['posters', 'home', 'accessories'].includes(p.category?.slug ?? ''))
			.length;
	const autoCount = () =>
		result.filter(
			(p) =>
				p.category?.slug === 'auto' ||
				p.tags?.includes('auto') ||
				p.name.toLowerCase().includes('air freshener') ||
				p.name.toLowerCase().includes('license')
		).length;

	for (const name of teeNames) {
		if (teeCount() >= 22) break;
		addProduct({
			name,
			slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
			price: 34 + (id % 12),
			description: `${name} — heavyweight cotton with AG motorsport graphics.`,
			category: 'Apparel',
			brand: agBrand
		});
	}

	for (const name of sweatNames) {
		if (sweatCount() >= 22) break;
		addProduct({
			name,
			slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
			price: 58 + (id % 20),
			description: `${name} — fleece-lined comfort for cold shop mornings.`,
			category: 'Apparel',
			brand: agBrand
		});
	}

	for (const name of jacketNames) {
		if (jacketCount() >= 22) break;
		addProduct({
			name,
			slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
			price: 98 + (id % 40),
			description: `${name} — weather-ready outerwear with AG redline details.`,
			category: 'Apparel',
			brand: agBrand
		});
	}

	for (const name of headwearNames) {
		if (headwearCount() >= 22) break;
		addProduct({
			name,
			slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
			price: 24 + (id % 14),
			description: `${name} — structured headwear with embroidered AG mark.`,
			category: 'Headwear',
			categorySlug: 'headwear',
			brand: agBrand
		});
	}

	for (const name of accessoryNames) {
		if (accessoryCount() >= 22) break;
		addProduct({
			name,
			slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
			price: 12 + (id % 45),
			description: `${name} — everyday carry with garage-approved durability.`,
			category: 'Accessories',
			brand: agBrand
		});
	}

	for (const name of homeNames) {
		if (homeCount() >= 22) break;
		addProduct({
			name,
			slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
			price: 18 + (id % 60),
			description: `${name} — bring the shop vibe indoors.`,
			category: 'Home',
			brand: agBrand
		});
	}

	for (const name of autoNames) {
		if (autoCount() >= 22) break;
		addProduct({
			name,
			slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
			price: 14 + (id % 35),
			description: `${name} — interior upgrade with AG branding.`,
			category: 'Auto',
			brand: agBrand
		});
	}

	while (result.length < 58) {
		addProduct({
			name: `Garage Essentials Pack ${id - 99}`,
			slug: `garage-essentials-pack-${id - 99}`,
			price: 28 + (id % 15),
			description: 'Curated AG accessories bundle for new crew members.',
			category: 'Accessories',
			brand: agBrand
		});
	}

	return result;
}

export const mockProducts: Product[] = padShopCatalog(handcraftedMockProducts);

export function getProductBySlug(slug: string): Product | undefined {
	return mockProducts.find((p) => p.slug === slug);
}

export function getStaffPickProducts(): Product[] {
	return mockProducts.filter((p) => p.tags?.includes('staff-pick'));
}

export function getClearanceProducts(): Product[] {
	return mockProducts.filter((p) => p.tags?.includes('clearance'));
}

export function getGiftCardProducts(): Product[] {
	return mockProducts.filter((p) => p.productType === 'GIFT_CARD');
}

export function searchProducts(query: string): Product[] {
	const q = query.toLowerCase().trim();
	if (!q) return [];
	return mockProducts.filter(
		(p) =>
			p.name.toLowerCase().includes(q) ||
			p.description.toLowerCase().includes(q) ||
			p.category?.name.toLowerCase().includes(q) ||
			p.brand?.name.toLowerCase().includes(q)
	);
}
