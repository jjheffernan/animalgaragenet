import { paginateFromUrl } from '$lib/pagination';
import { setGhostListCacheHeaders } from '$lib/server/ghost/cache-headers';
import {
	ALL_GUIDE_FILTER,
	filterGuidesByCategory,
	filterGuidesByTopic,
	getGuideFilterOptions,
	resolveGuideFilter
} from '$lib/server/ghost/guide-filters';
import { listGuides } from '$lib/server/ghost/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, setHeaders }) => {
	setGhostListCacheHeaders(setHeaders);
	const filterOptions = await getGuideFilterOptions();
	const category = resolveGuideFilter(url.searchParams.get('category'), filterOptions.categories);
	const topicOptions =
		filterOptions.topics.length > 0
			? [ALL_GUIDE_FILTER, ...filterOptions.topics]
			: [ALL_GUIDE_FILTER];
	const topic = resolveGuideFilter(url.searchParams.get('topic'), topicOptions);

	let allGuides = await listGuides();
	allGuides = filterGuidesByCategory(allGuides, category.slug);
	if (topic.slug !== 'all') {
		allGuides = filterGuidesByTopic(allGuides, topic.slug);
	}

	const { items, pagination } = paginateFromUrl(url, allGuides);

	return {
		guides: items,
		pagination,
		category,
		topic,
		categories: filterOptions.categories,
		topics: filterOptions.topics,
		filterSource: filterOptions.source
	};
};
