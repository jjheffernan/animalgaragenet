import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

import { createAdminClient } from '$lib/server/supabase/admin';
import {
	_resetMockStoreForTests as resetRestock,
	createRestockAlert
} from '$lib/server/restock/repository';
import {
	_resetMockStoreForTests as resetNewsletter,
	subscribeNewsletter
} from '$lib/server/newsletter/repository';
import { createWholesaleInquiry, _resetMockStoreForTests as resetWholesale } from '$lib/server/wholesale/repository';
import {
	_resetMockStoreForTests as resetFeatured,
	getFeaturedSection
} from '$lib/server/featured-sections/repository';
import {
	_resetMockStoreForTests as resetGaragePrefs,
	addGarageXp,
	getUserGarageState,
	saveUserVehicles
} from '$lib/server/user-preferences/repository';

describe('inspiration scaffold repositories (mock fallback)', () => {
	beforeEach(() => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		resetRestock();
		resetNewsletter();
		resetWholesale();
		resetFeatured();
		resetGaragePrefs();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('createRestockAlert dedupes by email+product in mock mode', async () => {
		const first = await createRestockAlert({
			email: 'driver@example.com',
			productId: 'prod-1',
			productName: 'Hoodie'
		});
		const second = await createRestockAlert({
			email: 'driver@example.com',
			productId: 'prod-1',
			productName: 'Hoodie'
		});
		expect(first?.id).toBe(second?.id);
	});

	it('subscribeNewsletter accepts footer signup in mock mode', async () => {
		const result = await subscribeNewsletter({ email: 'fan@example.com', source: 'footer' });
		expect(result.ok).toBe(true);
		expect(result.subscriber?.email).toBe('fan@example.com');
	});

	it('createWholesaleInquiry stores application in mock mode', async () => {
		const inquiry = await createWholesaleInquiry({
			businessName: 'Speed Shop LLC',
			contactName: 'Alex',
			email: 'alex@speedshop.com',
			message: 'We run three retail locations and want wholesale pricing on merch.'
		});
		expect(inquiry?.status).toBe('pending');
		expect(inquiry?.businessName).toBe('Speed Shop LLC');
	});

	it('getFeaturedSection returns static hero fallback when no active campaign', async () => {
		const hero = await getFeaturedSection('hero');
		expect(hero?.sectionKey).toBe('hero');
		expect(hero?.content.headline).toBe('Garage Culture Delivered');
		expect(hero?.content.subheadline).toContain('Animal Garage');
		expect(hero?.content.image).toBe('https://picsum.photos/seed/aghero/1920/1080');
	});

	it('getUserGarageState and addGarageXp work in mock mode', async () => {
		const empty = await getUserGarageState('user-1');
		expect(empty.vehicles).toEqual([]);
		expect(empty.garageXp).toBe(0);

		const saved = await saveUserVehicles('user-1', [
			{ id: 'v1', year: 2019, make: 'Chevy', model: 'Camaro' }
		]);
		expect(saved).toBe(true);

		const withVehicle = await getUserGarageState('user-1');
		expect(withVehicle.vehicles).toHaveLength(1);

		const xp = await addGarageXp('user-1', 25, 'newsletter');
		expect(xp?.garageXp).toBe(25);
		expect(xp?.completedActions).toContain('newsletter');

		const deduped = await addGarageXp('user-1', 25, 'newsletter');
		expect(deduped?.garageXp).toBe(25);
	});
});
