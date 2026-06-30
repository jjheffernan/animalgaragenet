import { createAdminClient } from '$lib/server/supabase/admin';
import type { OrderSnapshot, OrderStatus } from '$lib/types/order';

const mockStore = new Map<string, OrderSnapshot>();

function rowToSnapshot(row: Record<string, unknown>): OrderSnapshot {
	return {
		id: String(row.id),
		userId: String(row.user_id),
		saleorOrderId: String(row.saleor_order_id),
		orderNumber: String(row.order_number),
		status: row.status as OrderStatus,
		totalCents: Number(row.total_cents),
		currency: String(row.currency ?? 'USD'),
		trackingNumber: row.tracking_number ? String(row.tracking_number) : null,
		lines: Array.isArray(row.lines) ? row.lines : [],
		orderedAt: String(row.ordered_at),
		syncedAt: String(row.synced_at)
	};
}

function mockSnapshotsForUser(userId: string): OrderSnapshot[] {
	return [...mockStore.values()]
		.filter((s) => s.userId === userId)
		.sort((a, b) => b.orderedAt.localeCompare(a.orderedAt));
}

/** Account order history from Saleor mirror table (newest first). */
export async function listOrderSnapshotsForUser(userId: string): Promise<OrderSnapshot[]> {
	const admin = createAdminClient();
	if (!admin) return mockSnapshotsForUser(userId);

	const { data, error } = await admin
		.from('order_snapshots')
		.select('*')
		.eq('user_id', userId)
		.order('ordered_at', { ascending: false });

	if (error || !data?.length) return [];
	return data.map(rowToSnapshot);
}

/** Upsert from Saleor webhook / sync job (service role). */
export async function upsertOrderSnapshot(
	fields: Omit<OrderSnapshot, 'id' | 'syncedAt'> & { syncedAt?: string }
): Promise<OrderSnapshot | null> {
	const syncedAt = fields.syncedAt ?? new Date().toISOString();
	const admin = createAdminClient();
	if (!admin) {
		const existing = [...mockStore.values()].find(
			(s) => s.saleorOrderId === fields.saleorOrderId
		);
		const snapshot: OrderSnapshot = {
			id: existing?.id ?? crypto.randomUUID(),
			userId: fields.userId,
			saleorOrderId: fields.saleorOrderId,
			orderNumber: fields.orderNumber,
			status: fields.status,
			totalCents: fields.totalCents,
			currency: fields.currency,
			trackingNumber: fields.trackingNumber,
			lines: fields.lines,
			orderedAt: fields.orderedAt,
			syncedAt
		};
		mockStore.set(snapshot.id, snapshot);
		return snapshot;
	}

	const { data, error } = await admin
		.from('order_snapshots')
		.upsert(
			{
				user_id: fields.userId,
				saleor_order_id: fields.saleorOrderId,
				order_number: fields.orderNumber,
				status: fields.status,
				total_cents: fields.totalCents,
				currency: fields.currency,
				tracking_number: fields.trackingNumber,
				lines: fields.lines,
				ordered_at: fields.orderedAt,
				synced_at: syncedAt
			},
			{ onConflict: 'saleor_order_id' }
		)
		.select('*')
		.single();

	if (error || !data) return null;
	return rowToSnapshot(data);
}

/** Test helper */
export function _resetMockStoreForTests(): void {
	mockStore.clear();
}
