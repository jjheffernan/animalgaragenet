import { getUpcomingEvents } from '$lib/data/mock-events';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({ events: getUpcomingEvents() });
