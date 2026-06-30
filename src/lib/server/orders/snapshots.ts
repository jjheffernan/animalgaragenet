import { createAdminClient } from '$lib/server/supabase/admin';
import type { OrderSnapshot, OrderStatus } from '$lib/types/order';

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

// @inspiration-scaffold: intentional — see docs/plans/active/inspiration-polish-coordination.md#IP-012
/** Account order history from Saleor mirror table (newest first). */
export async function listOrderSnapshotsForUser(userId: string): Promise<OrderSnapshot[]> {
	const admin = createAdminClient();
	if (!admin) return [];

	const { data, error } = await admin
		.from('order_snapshots')
		.select('*')
		.eq('user_id', userId)
		.order('ordered_at', { ascending: false });

	if (error || !data?.length) return [];
	return data.map(rowToSnapshot);
}

// @inspiration-scaffold: intentional — see docs/plans/active/inspiration-polish-coordination.md#IP-012
/** Upsert from Saleor webhook / sync job (service role). */
export async function upsertOrderSnapshot(
	fields: Omit<OrderSnapshot, 'id' | 'syncedAt'> & { syncedAt?: string }
): Promise<OrderSnapshot | null> {
	const admin = createAdminClient();
	if (!admin) return null;

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
				synced_at: fields.syncedAt ?? new Date().toISOString()
			},
			{ onConflict: 'saleor_order_id' }
		)
		.select('*')
		.single();

	if (error || !data) return null;
	return rowToSnapshot(data);
}
