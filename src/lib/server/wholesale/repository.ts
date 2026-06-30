import { createAdminClient } from '$lib/server/supabase/admin';
import { LIMITS, trimToMax } from '$lib/server/validation/limits';
import type { WholesaleInquiry, WholesaleInquiryInput } from '$lib/types/wholesale';

const mockStore: WholesaleInquiry[] = [];

function rowToInquiry(row: Record<string, unknown>): WholesaleInquiry {
	return {
		id: String(row.id),
		businessName: String(row.business_name),
		contactName: String(row.contact_name),
		email: String(row.email),
		phone: row.phone ? String(row.phone) : null,
		website: row.website ? String(row.website) : null,
		message: String(row.message),
		status: row.status as WholesaleInquiry['status'],
		createdAt: String(row.created_at)
	};
}

// @inspiration-scaffold: intentional — /wholesale form persistence; see docs/plans/active/inspiration-polish-tracker.md#IP-011
export async function createWholesaleInquiry(
	input: WholesaleInquiryInput
): Promise<WholesaleInquiry | null> {
	const limits = LIMITS.wholesale;
	const payload = {
		business_name: trimToMax(input.businessName, limits.businessName),
		contact_name: trimToMax(input.contactName, limits.contactName),
		email: trimToMax(input.email, limits.email),
		phone: input.phone ? trimToMax(input.phone, limits.phone) : null,
		website: input.website ? trimToMax(input.website, limits.website) : null,
		message: trimToMax(input.message, limits.message),
		status: 'pending' as const
	};

	const admin = createAdminClient();
	if (!admin) {
		const inquiry: WholesaleInquiry = {
			id: crypto.randomUUID(),
			businessName: payload.business_name,
			contactName: payload.contact_name,
			email: payload.email,
			phone: payload.phone,
			website: payload.website,
			message: payload.message,
			status: 'pending',
			createdAt: new Date().toISOString()
		};
		mockStore.push(inquiry);
		return inquiry;
	}

	const { data, error } = await admin.from('wholesale_inquiries').insert(payload).select('*').single();

	if (error || !data) {
		console.error('wholesale_inquiries insert failed:', error?.message);
		return null;
	}
	return rowToInquiry(data);
}

// @inspiration-scaffold: intentional — admin wholesale queue (future /admin/wholesale)
export async function listWholesaleInquiries(limit = 50): Promise<WholesaleInquiry[]> {
	const admin = createAdminClient();
	if (!admin) {
		return [...mockStore]
			.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
			.slice(0, limit);
	}

	const { data, error } = await admin
		.from('wholesale_inquiries')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(limit);

	if (error || !data) return [];
	return data.map(rowToInquiry);
}

/** Test helper */
export function _resetMockStoreForTests(): void {
	mockStore.length = 0;
}
