import type { PageServerLoad } from './$types';
import { getOrdersForAccount } from '$lib/data/mock/orders';
import { listOrderSnapshotsForUser } from '$lib/server/orders/snapshots';
import { createServerClient } from '$lib/server/supabase/client';

function snapshotsToMockOrders(
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

export const load: PageServerLoad = async (event) => {
	const supabase = createServerClient(event);
	const user = supabase ? (await supabase.auth.getUser()).data.user : null;

	if (user) {
		const snapshots = await listOrderSnapshotsForUser(user.id);
		if (snapshots.length > 0) {
			return {
				orders: snapshotsToMockOrders(snapshots),
				liveOrders: true
			};
		}
	}

	return {
		orders: getOrdersForAccount(),
		liveOrders: false
	};
};
