import type { PartCategory } from '$lib/types/domain';

const catImg = (seed: string) => `https://picsum.photos/seed/${seed}/400/300`;

export const mockPartCategories: PartCategory[] = [
	{
		id: 'pc-wheels',
		name: 'Wheels',
		slug: 'wheels',
		description: 'Aftermarket wheels, spacers, and lug hardware.',
		imageUrl: catImg('agcat-wheels'),
		children: [
			{ id: 'pc-wheels-flow', name: 'Flow Formed', slug: 'flow-formed', imageUrl: catImg('agcat-flow') },
			{ id: 'pc-wheels-forged', name: 'Forged', slug: 'forged', imageUrl: catImg('agcat-forged') },
			{ id: 'pc-wheels-spacers', name: 'Spacers & Adapters', slug: 'spacers', imageUrl: catImg('agcat-spacers') },
			{ id: 'pc-wheels-lugs', name: 'Lug Nuts & Bolts', slug: 'lug-nuts', imageUrl: catImg('agcat-lugs') }
		]
	},
	{
		id: 'pc-suspension',
		name: 'Suspension',
		slug: 'suspension',
		description: 'Coils, springs, arms, and chassis bracing.',
		imageUrl: catImg('agcat-suspension'),
		children: [
			{ id: 'pc-susp-coils', name: 'Coilovers', slug: 'coilovers', imageUrl: catImg('agcat-coils') },
			{ id: 'pc-susp-springs', name: 'Lowering Springs', slug: 'lowering-springs', imageUrl: catImg('agcat-springs') },
			{ id: 'pc-susp-arms', name: 'Control Arms', slug: 'control-arms', imageUrl: catImg('agcat-arms') },
			{ id: 'pc-susp-sway', name: 'Sway Bars', slug: 'sway-bars', imageUrl: catImg('agcat-sway') }
		]
	},
	{
		id: 'pc-exhaust',
		name: 'Exhaust',
		slug: 'exhaust',
		description: 'Cat-backs, axel-backs, headers, and mufflers.',
		imageUrl: catImg('agcat-exhaust'),
		children: [
			{ id: 'pc-exh-catback', name: 'Cat-Back Systems', slug: 'cat-back', imageUrl: catImg('agcat-catback') },
			{ id: 'pc-exh-axle', name: 'Axle-Back', slug: 'axle-back', imageUrl: catImg('agcat-axle') },
			{ id: 'pc-exh-headers', name: 'Headers', slug: 'headers', imageUrl: catImg('agcat-headers') },
			{ id: 'pc-exh-tips', name: 'Tips & Adapters', slug: 'tips', imageUrl: catImg('agcat-tips') }
		]
	},
	{
		id: 'pc-engine',
		name: 'Engine',
		slug: 'engine',
		description: 'Intakes, turbos, tuning, and engine management.',
		imageUrl: catImg('agcat-engine'),
		children: [
			{ id: 'pc-eng-intake', name: 'Cold Air Intakes', slug: 'intakes', imageUrl: catImg('agcat-intake') },
			{ id: 'pc-eng-turbo', name: 'Turbo Kits', slug: 'turbo', imageUrl: catImg('agcat-turbo') },
			{ id: 'pc-eng-intercooler', name: 'Intercoolers', slug: 'intercoolers', imageUrl: catImg('agcat-intercooler') },
			{ id: 'pc-eng-tune', name: 'Engine Management', slug: 'engine-management', imageUrl: catImg('agcat-tune') }
		]
	},
	{
		id: 'pc-brakes',
		name: 'Brakes',
		slug: 'brakes',
		description: 'Rotors, pads, calipers, and brake lines.',
		imageUrl: catImg('agcat-brakes'),
		children: [
			{ id: 'pc-brk-rotors', name: 'Rotors', slug: 'rotors', imageUrl: catImg('agcat-rotors') },
			{ id: 'pc-brk-pads', name: 'Brake Pads', slug: 'pads', imageUrl: catImg('agcat-pads') },
			{ id: 'pc-brk-calipers', name: 'Big Brake Kits', slug: 'bbk', imageUrl: catImg('agcat-bbk') },
			{ id: 'pc-brk-lines', name: 'Brake Lines', slug: 'lines', imageUrl: catImg('agcat-lines') }
		]
	},
	{
		id: 'pc-exterior',
		name: 'Exterior',
		slug: 'exterior',
		description: 'Aero, lips, diffusers, and body kits.',
		imageUrl: catImg('agcat-exterior'),
		children: [
			{ id: 'pc-ext-lips', name: 'Front Lips', slug: 'front-lips', imageUrl: catImg('agcat-lips') },
			{ id: 'pc-ext-wings', name: 'Wings & Spoilers', slug: 'wings', imageUrl: catImg('agcat-wings') },
			{ id: 'pc-ext-diffusers', name: 'Diffusers', slug: 'diffusers', imageUrl: catImg('agcat-diffusers') },
			{ id: 'pc-ext-mirrors', name: 'Mirrors & Covers', slug: 'mirrors', imageUrl: catImg('agcat-mirrors') }
		]
	},
	{
		id: 'pc-interior',
		name: 'Interior',
		slug: 'interior',
		description: 'Shift knobs, seats, gauges, and trim.',
		imageUrl: catImg('agcat-interior'),
		children: [
			{ id: 'pc-int-shifter', name: 'Shift Knobs', slug: 'shift-knobs', imageUrl: catImg('agcat-shifter') },
			{ id: 'pc-int-seats', name: 'Seats & Brackets', slug: 'seats', imageUrl: catImg('agcat-seats') },
			{ id: 'pc-int-gauges', name: 'Gauges', slug: 'gauges', imageUrl: catImg('agcat-gauges') },
			{ id: 'pc-int-trim', name: 'Trim & Accents', slug: 'trim', imageUrl: catImg('agcat-trim') }
		]
	},
	{
		id: 'pc-lights',
		name: 'Lights',
		slug: 'lights',
		description: 'Headlights, taillights, and LED upgrades.',
		imageUrl: catImg('agcat-lights'),
		children: [
			{ id: 'pc-lit-head', name: 'Headlights', slug: 'headlights', imageUrl: catImg('agcat-headlights') },
			{ id: 'pc-lit-tail', name: 'Taillights', slug: 'taillights', imageUrl: catImg('agcat-taillights') },
			{ id: 'pc-lit-fog', name: 'Fog Lights', slug: 'fog-lights', imageUrl: catImg('agcat-fog') },
			{ id: 'pc-lit-led', name: 'LED Bulbs', slug: 'led-bulbs', imageUrl: catImg('agcat-led') }
		]
	},
	{
		id: 'pc-drivetrain',
		name: 'Drivetrain',
		slug: 'drivetrain',
		description: 'Clutches, flywheels, differentials, and mounts.',
		imageUrl: catImg('agcat-drivetrain'),
		children: [
			{ id: 'pc-dt-clutch', name: 'Clutch Kits', slug: 'clutch', imageUrl: catImg('agcat-clutch') },
			{ id: 'pc-dt-flywheel', name: 'Flywheels', slug: 'flywheels', imageUrl: catImg('agcat-flywheel') },
			{ id: 'pc-dt-diff', name: 'Differentials', slug: 'differentials', imageUrl: catImg('agcat-diff') },
			{ id: 'pc-dt-mounts', name: 'Engine Mounts', slug: 'mounts', imageUrl: catImg('agcat-mounts') }
		]
	}
];

export function getPartCategoryBySlug(slug: string): PartCategory | undefined {
	for (const cat of mockPartCategories) {
		if (cat.slug === slug) return cat;
		const child = cat.children?.find((c) => c.slug === slug);
		if (child) return child;
	}
	return undefined;
}

export function getTopLevelPartCategories(): PartCategory[] {
	return mockPartCategories;
}

export function getAllPartCategorySlugs(): string[] {
	const slugs: string[] = [];
	for (const cat of mockPartCategories) {
		slugs.push(cat.slug);
		cat.children?.forEach((c) => slugs.push(c.slug));
	}
	return slugs;
}
