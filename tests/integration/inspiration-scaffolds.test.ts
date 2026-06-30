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

describe('inspiration scaffold repositories (mock fallback)', () => {
	beforeEach(() => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		resetRestock();
		resetNewsletter();
		resetWholesale();
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
});
