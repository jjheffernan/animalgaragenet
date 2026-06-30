import type { PageServerLoad } from './$types';
import { listOrderSnapshotsForUser } from '$lib/server/orders/snapshots';

function snapshotsToDisplayOrders(
	snapshots: Awaited<ReturnType<typeof listOrderSnapshotsForUser>>
) {
	return snapshots.map((s) => ({
		id: s.id,
		orderNumber: s.orderNumber,
		date: s.orderedAt.slice(0, 10),
		status: s.status,
		total: s.totalCents / 100,
		trackingNumber: s.trackingNumber ?? undefined,
		lines: s.lines
	}));
}

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.session?.id;
	if (!userId) {
		return { orders: [], liveOrders: false };
	}

	const snapshots = await listOrderSnapshotsForUser(userId);
	return {
		orders: snapshotsToDisplayOrders(snapshots),
		liveOrders: true
	};
};
