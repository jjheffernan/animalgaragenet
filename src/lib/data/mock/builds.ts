import type { BuildThread } from '$lib/types/domain';

const photo = (seed: string) => `https://picsum.photos/seed/${seed}/1200/800`;

export const mockBuilds: BuildThread[] = [
	{
		id: 'b1',
		slug: 'project-redline-civic',
		title: 'Project Redline — FK8 Type R',
		year: 2020,
		make: 'Honda',
		model: 'Civic',
		submodel: 'Type R',
		photos: [photo('agbuild-1a'), photo('agbuild-1b'), photo('agbuild-1c'), photo('agbuild-1d')],
		modList: [
			'BC Racing BR Coilovers',
			'Enkei RPF1 18×9.5',
			'Borla S-Type Exhaust',
			'APR Carbon Lip',
			'StopTech BBK'
		],
		featured: true,
		description: 'Full send FK8 build — track days, canyon runs, and daily duty.',
		linkedProductIds: ['p1', 'p4', 'p8', 'p17']
	},
	{
		id: 'b2',
		slug: 'boosted-wrx-daily',
		title: 'Boosted WRX Daily',
		year: 2019,
		make: 'Subaru',
		model: 'WRX',
		submodel: 'Premium',
		photos: [photo('agbuild-2a'), photo('agbuild-2b'), photo('agbuild-2c')],
		modList: [
			'Invidia N1 Cat-Back',
			'AEM Cold Air Intake',
			'Mishimoto Intercooler',
			'BC DS Coilovers'
		],
		featured: true,
		description: '400 WHP daily driver that still gets 28 MPG on the highway.',
		linkedProductIds: ['p5', 'p9', 'p12', 'p13']
	},
	{
		id: 'b3',
		slug: 'midnight-350z',
		title: 'Midnight 350Z',
		year: 2006,
		make: 'Nissan',
		model: '350Z',
		submodel: 'Track',
		photos: [photo('agbuild-3a'), photo('agbuild-3b'), photo('agbuild-3c')],
		modList: ['Enkei RSF5 Wheels', 'StopTech BBK', 'Borla ATAK Axle-Back', 'Mishimoto Oil Cooler'],
		featured: false,
		description: 'VQ35DE with bolt-ons and a whole lot of attitude.',
		linkedProductIds: ['p10', 'p16', 'p19', 'p29']
	},
	{
		id: 'b4',
		slug: 'budget-civic-si',
		title: 'Budget Civic Si Build',
		year: 2017,
		make: 'Honda',
		model: 'Civic',
		submodel: 'Si',
		photos: [photo('agbuild-4a'), photo('agbuild-4b')],
		modList: ['Eibach Pro-Kit Springs', 'Enkei PF01 Wheels', 'AEM Intake', 'Invidia Exhaust'],
		featured: false,
		description: 'Proof you can build a fun car for under $3K in mods.',
		linkedProductIds: ['p6', 'p11', 'p22']
	},
	{
		id: 'b5',
		slug: 'widebody-mustang-gt',
		title: 'Widebody Mustang GT',
		year: 2022,
		make: 'Ford',
		model: 'Mustang',
		submodel: 'GT',
		photos: [photo('agbuild-5a'), photo('agbuild-5b'), photo('agbuild-5c'), photo('agbuild-5d')],
		modList: ['Widebody Kit', 'Supercharger', 'Coilovers', 'Forged Wheels', 'Big Brake Kit'],
		featured: true,
		description: '700 WHP widebody Coyote — show car and weekend warrior.',
		linkedProductIds: ['p4', 'p14', 'p16', 'p1']
	},
	{
		id: 'b6',
		slug: 'a90-supra-track',
		title: 'A90 Supra Track Weapon',
		year: 2021,
		make: 'Toyota',
		model: 'Supra',
		submodel: '3.0 Premium',
		photos: [photo('agbuild-6a'), photo('agbuild-6b'), photo('agbuild-6c')],
		modList: ['Downpipe + Tune', 'Coilovers', 'Aero Package', 'Lightweight Wheels'],
		featured: false,
		description: 'B58 tuned to 500 WHP with full track aero.',
		linkedProductIds: ['p17', 'p4', 'p1']
	},
	{
		id: 'b7',
		slug: 'stance-brz',
		title: 'Stance BRZ',
		year: 2018,
		make: 'Subaru',
		model: 'BRZ',
		submodel: 'tS',
		photos: [photo('agbuild-7a'), photo('agbuild-7b')],
		modList: ['Air Suspension', 'Work Meister Wheels', 'Custom Exhaust', 'Fender Roll'],
		featured: false,
		description: 'Static-ish stance BRZ with perfect fitment.',
		linkedProductIds: ['p2', 'p9', 'p10']
	},
	{
		id: 'b8',
		slug: 'restomod-240sx',
		title: 'Restomod 240SX',
		year: 1995,
		make: 'Nissan',
		model: '240SX',
		submodel: 'SE',
		photos: [photo('agbuild-8a'), photo('agbuild-8b'), photo('agbuild-8c')],
		modList: ['SR20DET Swap', 'Coilovers', 'Roll Cage', 'Bucket Seats'],
		featured: false,
		description: 'Classic S14 with modern power and old-school style.',
		linkedProductIds: ['p4', 'p10', 'p16']
	},
	{
		id: 'b9',
		slug: 'gr-corolla-hooligan',
		title: 'GR Corolla Hooligan',
		year: 2024,
		make: 'Toyota',
		model: 'Corolla',
		submodel: 'GR Corolla',
		photos: [photo('agbuild-9a'), photo('agbuild-9b')],
		modList: ['Intake', 'Exhaust', 'Lowering Springs', 'Lightweight Wheels'],
		featured: true,
		description: 'Three-cylinder fury with rally roots.',
		linkedProductIds: ['p11', 'p9', 'p6', 'p1']
	},
	{
		id: 'b10',
		slug: 'bmw-m2-cs',
		title: 'M2 CS Canyon Carver',
		year: 2020,
		make: 'BMW',
		model: 'M2',
		submodel: 'CS',
		photos: [photo('agbuild-10a'), photo('agbuild-10b'), photo('agbuild-10c')],
		modList: ['Coilovers', 'Carbon Aero', 'Exhaust', 'Track Pads'],
		featured: false,
		description: 'The last great small BMW M car, dialed for the canyons.',
		linkedProductIds: ['p4', 'p8', 'p14', 'p15']
	},
	{
		id: 'b11',
		slug: 'miata-na-track',
		title: 'NA Miata Track Toy',
		year: 1994,
		make: 'Mazda',
		model: 'Miata',
		photos: [photo('agbuild-11a'), photo('agbuild-11b')],
		modList: ['Roll Bar', 'Coilovers', 'Bucket Seat', '6-Speed Swap'],
		featured: false,
		description: '1.8L NA Miata built purely for HPDE weekends.',
		linkedProductIds: ['p4', 'p6', 'p22']
	},
	{
		id: 'b12',
		slug: 's2000-ap2-legend',
		title: 'AP2 S2000 Legend',
		year: 2006,
		make: 'Honda',
		model: 'S2000',
		submodel: 'CR',
		photos: [photo('agbuild-12a'), photo('agbuild-12b'), photo('agbuild-12c')],
		modList: ['Supercharger', 'Coilovers', 'Big Brake Kit', 'Hardtop'],
		featured: true,
		description: 'The F22C screamer — supercharged and canyon ready.',
		linkedProductIds: ['p4', 'p14', 'p16', 'p8']
	}
];

export function getBuildBySlug(slug: string): BuildThread | undefined {
	return mockBuilds.find((b) => b.slug === slug);
}

export function getFeaturedBuilds(): BuildThread[] {
	return mockBuilds.filter((b) => b.featured);
}

export function searchBuilds(query: string): BuildThread[] {
	const q = query.toLowerCase().trim();
	if (!q) return [];
	return mockBuilds.filter(
		(b) =>
			b.title.toLowerCase().includes(q) ||
			b.make.toLowerCase().includes(q) ||
			b.model.toLowerCase().includes(q) ||
			b.modList.some((m) => m.toLowerCase().includes(q))
	);
}
