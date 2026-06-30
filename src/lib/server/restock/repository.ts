import { createAdminClient } from '$lib/server/supabase/admin';
import { LIMITS, trimToMax } from '$lib/server/validation/limits';
import type { RestockAlert, RestockAlertInput } from '$lib/types/restock-alert';

const mockStore = new Map<string, RestockAlert>();

function rowToAlert(row: Record<string, unknown>): RestockAlert {
	return {
		id: String(row.id),
		email: String(row.email),
		productId: String(row.product_id),
		productSlug: row.product_slug ? String(row.product_slug) : null,
		productName: row.product_name ? String(row.product_name) : null,
		variantId: row.variant_id ? String(row.variant_id) : null,
		userId: row.user_id ? String(row.user_id) : null,
		createdAt: String(row.created_at),
		notifiedAt: row.notified_at ? String(row.notified_at) : null
	};
}

function mockKey(email: string, productId: string): string {
	return `${email.toLowerCase()}:${productId}`;
}

// @inspiration-scaffold: intentional — restock alerts; see docs/plans/active/inspiration-polish-coordination.md#IP-004
export async function createRestockAlert(input: RestockAlertInput): Promise<RestockAlert | null> {
	const email = trimToMax(input.email, LIMITS.contact.email);
	const productId = trimToMax(input.productId, 120);
	if (!email.includes('@') || !productId) return null;

	const admin = createAdminClient();
	if (!admin) {
		const key = mockKey(email, productId);
		if (mockStore.has(key)) return mockStore.get(key)!;
		const alert: RestockAlert = {
			id: crypto.randomUUID(),
			email,
			productId,
			productSlug: input.productSlug ?? null,
			productName: input.productName ?? null,
			variantId: input.variantId ?? null,
			userId: input.userId ?? null,
			createdAt: new Date().toISOString(),
			notifiedAt: null
		};
		mockStore.set(key, alert);
		return alert;
	}

	const { data, error } = await admin
		.from('restock_alerts')
		.upsert(
			{
				email,
				product_id: productId,
				product_slug: input.productSlug ?? null,
				product_name: input.productName ?? null,
				variant_id: input.variantId ?? null,
				user_id: input.userId ?? null
			},
			{ onConflict: 'email,product_id', ignoreDuplicates: false }
		)
		.select('*')
		.single();

	if (error || !data) {
		console.error('restock_alerts upsert failed:', error?.message);
		return null;
	}
	return rowToAlert(data);
}

// @inspiration-scaffold: intentional — batch notify when Saleor stock webhook fires
export async function listPendingRestockAlerts(productId: string): Promise<RestockAlert[]> {
	const admin = createAdminClient();
	if (!admin) {
		return [...mockStore.values()].filter(
			(a) => a.productId === productId && a.notifiedAt === null
		);
	}

	const { data, error } = await admin
		.from('restock_alerts')
		.select('*')
		.eq('product_id', productId)
		.is('notified_at', null);

	if (error || !data) return [];
	return data.map(rowToAlert);
}

/** Test helper */
export function _resetMockStoreForTests(): void {
	mockStore.clear();
}
