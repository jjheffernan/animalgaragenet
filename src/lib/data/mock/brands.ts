import type { Brand } from '$lib/types/domain';

const logo = (seed: string) => `https://picsum.photos/seed/${seed}/200/200`;

export const mockBrands: Brand[] = [
	{
		id: 'brand-enkei',
		name: 'Enkei',
		slug: 'enkei',
		logoUrl: logo('agbrand-enkei'),
		description:
			'Japanese wheel manufacturer since 1950. Home of the legendary RPF1 and MAT Process forging.',
		heroImage: 'https://picsum.photos/seed/agbrand-enkei-hero/1200/400'
	},
	{
		id: 'brand-bc-racing',
		name: 'BC Racing',
		slug: 'bc-racing',
		logoUrl: logo('agbrand-bc'),
		description:
			'Affordable coilovers with 30-way damping adjustment. BR, DS, and ER series for every budget.',
		heroImage: 'https://picsum.photos/seed/agbrand-bc-hero/1200/400'
	},
	{
		id: 'brand-borla',
		name: 'Borla',
		slug: 'borla',
		logoUrl: logo('agbrand-borla'),
		description:
			'American exhaust pioneers. S-Type, ATAK, and Touring systems for street and track.',
		heroImage: 'https://picsum.photos/seed/agbrand-borla-hero/1200/400'
	},
	{
		id: 'brand-aem',
		name: 'AEM',
		slug: 'aem',
		logoUrl: logo('agbrand-aem'),
		description: 'Performance intake systems, engine management, and gauges since 1987.',
		heroImage: 'https://picsum.photos/seed/agbrand-aem-hero/1200/400'
	},
	{
		id: 'brand-stoptech',
		name: 'StopTech',
		slug: 'stoptech',
		logoUrl: logo('agbrand-stoptech'),
		description: 'Big brake kits, slotted rotors, and performance pads for street and track.',
		heroImage: 'https://picsum.photos/seed/agbrand-stoptech-hero/1200/400'
	},
	{
		id: 'brand-apr',
		name: 'APR',
		slug: 'apr',
		logoUrl: logo('agbrand-apr'),
		description: 'Carbon fiber aero, tuning, and performance parts. Track-proven aerodynamics.',
		heroImage: 'https://picsum.photos/seed/agbrand-apr-hero/1200/400'
	},
	{
		id: 'brand-mishimoto',
		name: 'Mishimoto',
		slug: 'mishimoto',
		logoUrl: logo('agbrand-mishi'),
		description:
			'Performance cooling, intercoolers, radiators, and oil coolers for enthusiast platforms.',
		heroImage: 'https://picsum.photos/seed/agbrand-mishi-hero/1200/400'
	},
	{
		id: 'brand-invidia',
		name: 'Invidia',
		slug: 'invidia',
		logoUrl: logo('agbrand-invidia'),
		description: 'Japanese exhaust systems — N1, Q300, and Gemini series for popular platforms.',
		heroImage: 'https://picsum.photos/seed/agbrand-invidia-hero/1200/400'
	},
	{
		id: 'brand-whiteline',
		name: 'Whiteline',
		slug: 'whiteline',
		logoUrl: logo('agbrand-whiteline'),
		description: 'Chassis control bushings, sway bars, and alignment products. Activate more grip.',
		heroImage: 'https://picsum.photos/seed/agbrand-whiteline-hero/1200/400'
	},
	{
		id: 'brand-eibach',
		name: 'Eibach',
		slug: 'eibach',
		logoUrl: logo('agbrand-eibach'),
		description: 'Pro-Kit and Sportline lowering springs. OEM+ ride quality with a drop.',
		heroImage: 'https://picsum.photos/seed/agbrand-eibach-hero/1200/400'
	}
];

export function getBrandBySlug(slug: string): Brand | undefined {
	return mockBrands.find((b) => b.slug === slug);
}
