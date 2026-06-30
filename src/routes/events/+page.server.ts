import { getAllEvents, getUpcomingEvents } from '$lib/data/mock/events';
import { paginateFromUrl } from '$lib/pagination';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const allUpcoming = getUpcomingEvents();
	const { items, pagination } = paginateFromUrl(url, allUpcoming);

	return {
		upcomingEvents: items,
		pagination,
		allEvents: getAllEvents()
	};
};
