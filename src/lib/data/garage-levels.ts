import type { GarageLevel, GarageXpAction } from '$lib/types/domain';

export const garageLevels: GarageLevel[] = [
	{ level: 1, title: 'Parking Lot Rookie', xpRequired: 0, perks: ['Welcome sticker pack'] },
	{ level: 2, title: 'Pit Crew', xpRequired: 100, perks: ['5% merch discount'] },
	{
		level: 3,
		title: 'Wrench Turner',
		xpRequired: 300,
		perks: ['Early drop access', 'Free shipping on parts']
	},
	{
		level: 4,
		title: 'Grid Starter',
		xpRequired: 600,
		perks: ['10% merch discount', 'Exclusive colorways']
	},
	{
		level: 5,
		title: 'Garage Squad OG',
		xpRequired: 1000,
		perks: ['15% sitewide', 'Build of the Month eligibility', 'VIP event access']
	}
];

export const garageXpActions: GarageXpAction[] = [
	{ id: 'first-order', label: 'Place your first order', xp: 50 },
	{ id: 'submit-build', label: 'Submit a build thread', xp: 100 },
	{ id: 'newsletter', label: 'Join the newsletter', xp: 25 },
	{ id: 'share-media', label: 'Share garage media', xp: 30 },
	{ id: 'refer-friend', label: 'Refer a friend', xp: 75 }
];
