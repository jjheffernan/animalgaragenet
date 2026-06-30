import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/supabase/admin', () => ({
	createAdminClient: vi.fn()
}));

import { createAdminClient } from '$lib/server/supabase/admin';
import {
	_resetMockStoreForTests,
	createWholesaleInquiry,
	listWholesaleInquiries
} from './repository';

describe('wholesale repository (mock fallback)', () => {
	beforeEach(() => {
		vi.mocked(createAdminClient).mockReturnValue(null);
		_resetMockStoreForTests();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('createWholesaleInquiry stores pending application in mock mode', async () => {
		const inquiry = await createWholesaleInquiry({
			businessName: 'Speed Shop LLC',
			contactName: 'Alex',
			email: 'alex@speedshop.com',
			phone: '555-0100',
			website: 'https://speedshop.com',
			message: 'We run three retail locations and want wholesale pricing on merch.'
		});

		expect(inquiry?.status).toBe('pending');
		expect(inquiry?.businessName).toBe('Speed Shop LLC');
		expect(inquiry?.phone).toBe('555-0100');
	});

	it('listWholesaleInquiries returns mock inquiries', async () => {
		await createWholesaleInquiry({
			businessName: 'First Shop',
			contactName: 'A',
			email: 'a@example.com',
			message: 'First wholesale application with enough detail for validation.'
		});
		await createWholesaleInquiry({
			businessName: 'Second Shop',
			contactName: 'B',
			email: 'b@example.com',
			message: 'Second wholesale application with enough detail for validation.'
		});

		const listed = await listWholesaleInquiries();
		expect(listed).toHaveLength(2);
		expect(listed.map((i) => i.businessName).sort()).toEqual(['First Shop', 'Second Shop']);
	});
});
