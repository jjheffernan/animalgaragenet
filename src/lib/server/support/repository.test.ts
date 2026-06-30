import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

import { createAdminClient } from '$lib/server/supabase/admin';
import { _resetMockStoreForTests, createBugReport, listBugReports } from './repository';

describe('bug report repository (mock fallback)', () => {
	beforeEach(() => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		_resetMockStoreForTests();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('createBugReport stores open report in mock mode', async () => {
		const report = await createBugReport({
			email: 'driver@example.com',
			category: 'website',
			description: 'Checkout spinner never stops after submitting payment details.',
			steps: '1. Add item 2. Checkout 3. Pay 4. Spinner forever',
			pageUrl: '/checkout'
		});

		expect(report?.status).toBe('open');
		expect(report?.category).toBe('website');
		expect(report?.pageUrl).toBe('/checkout');
	});

	it('listBugReports returns mock reports newest first', async () => {
		await createBugReport({
			email: 'a@example.com',
			category: 'shop',
			description: 'Product image missing on the parts category page for filters.',
			steps: '1. Browse parts 2. Open filters category 3. Image blank'
		});
		await createBugReport({
			email: 'b@example.com',
			category: 'account',
			description: 'Order history page shows a blank list after successful login.',
			steps: '1. Sign in 2. Open orders 3. List empty'
		});

		const listed = await listBugReports();
		expect(listed).toHaveLength(2);
	});
});
