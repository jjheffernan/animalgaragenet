import type { PageServerLoad } from './$types';
import { getOrdersForAccount } from '$lib/data/mock/orders';

export const load: PageServerLoad = async () => {
	return {
		orders: getOrdersForAccount(),
		liveOrders: false
	};
};
