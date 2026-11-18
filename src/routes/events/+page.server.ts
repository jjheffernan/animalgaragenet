import { getAllEvents, getUpcomingEvents } from '#lib/data/mock/events.ts';
import { paginateFromUrl } from '#lib/pagination.ts';
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
