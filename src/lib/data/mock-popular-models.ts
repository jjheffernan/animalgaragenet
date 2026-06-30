import type { PopularModel } from '$lib/types/domain';

export const mockPopularModels: PopularModel[] = [
	{
		id: 'pm-civic',
		name: 'Honda Civic',
		slug: 'honda-civic',
		make: 'Honda',
		model: 'Civic',
		heroImage: 'https://picsum.photos/seed/agmodel-civic/800/500',
		description: 'The ultimate tuner platform — Si, Type R, and everything in between.'
	},
	{
		id: 'pm-wrx',
		name: 'Subaru WRX',
		slug: 'subaru-wrx',
		make: 'Subaru',
		model: 'WRX',
		heroImage: 'https://picsum.photos/seed/agmodel-wrx/800/500',
		description: 'Rally-bred AWD. Coils, exhaust, and boost — the WRX mod rabbit hole.'
	},
	{
		id: 'pm-350z',
		name: 'Nissan 350Z',
		slug: 'nissan-350z',
		make: 'Nissan',
		model: '350Z',
		heroImage: 'https://picsum.photos/seed/agmodel-350z/800/500',
		description: 'VQ power, rear-wheel drive, and endless aftermarket support.'
	},
	{
		id: 'pm-miata',
		name: 'Mazda Miata',
		slug: 'mazda-miata',
		make: 'Mazda',
		model: 'Miata',
		heroImage: 'https://picsum.photos/seed/agmodel-miata/800/500',
		description: 'Lightweight legend. The answer is always Miata.'
	},
	{
		id: 'pm-supra',
		name: 'Toyota Supra',
		slug: 'toyota-supra',
		make: 'Toyota',
		model: 'Supra',
		heroImage: 'https://picsum.photos/seed/agmodel-supra/800/500',
		description: 'A90/A91 platform — B58 tuning, aero, and track builds.'
	},
	{
		id: 'pm-mustang',
		name: 'Ford Mustang',
		slug: 'ford-mustang',
		make: 'Ford',
		model: 'Mustang',
		heroImage: 'https://picsum.photos/seed/agmodel-mustang/800/500',
		description: 'American muscle from EcoBoost to Dark Horse.'
	}
];

export function getPopularModelBySlug(slug: string): PopularModel | undefined {
	return mockPopularModels.find((m) => m.slug === slug);
}
