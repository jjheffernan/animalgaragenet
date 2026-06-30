import type { MediaItem } from '$lib/data/mock/media';
import { mockMedia } from '$lib/data/mock/media';
import { mockUGC } from '$lib/data/mock/ugc';
import { mockVideos } from '$lib/data/mock/videos';
import { paginateFromUrl } from '$lib/pagination';
import { createAdminClient } from '$lib/server/supabase/admin';
import {
	listApprovedTestimonials,
	listFeaturedTestimonials
} from '$lib/server/testimonials/repository';
import { testimonialsToUgcItems } from '$lib/server/testimonials/to-ugc';
import type { UGCItem, Video } from '$lib/types/domain';
import type { PageServerLoad } from './$types';

const MEDIA_TABS = ['all', 'videos', 'photos', 'ugc'] as const;
export type MediaTab = (typeof MEDIA_TABS)[number];

/** UGC wall items — Supabase testimonials when configured, mock otherwise. */
export async function _loadMediaUgcItems(): Promise<UGCItem[]> {
	const admin = createAdminClient();
	if (!admin) {
		return mockUGC;
	}

	const featured = await listFeaturedTestimonials(48);
	const source =
		featured.length > 0 ? featured : await listApprovedTestimonials(48);
	return testimonialsToUgcItems(source);
}

export const load: PageServerLoad = async ({ url }) => {
	const rawTab = url.searchParams.get('tab')?.toLowerCase() ?? 'all';
	const tab = (MEDIA_TABS.includes(rawTab as MediaTab) ? rawTab : 'all') as MediaTab;

	let videos: Video[] = [];
	let mediaItems: MediaItem[] = [];
	let ugcItems: UGCItem[] = [];
	let pagination;

	switch (tab) {
		case 'videos': {
			const result = paginateFromUrl(url, mockVideos);
			videos = result.items;
			pagination = result.pagination;
			break;
		}
		case 'photos': {
			const result = paginateFromUrl(
				url,
				mockMedia.filter((item) => item.type === 'image')
			);
			mediaItems = result.items;
			pagination = result.pagination;
			break;
		}
		case 'ugc': {
			const allUgc = await _loadMediaUgcItems();
			const result = paginateFromUrl(url, allUgc);
			ugcItems = result.items;
			pagination = result.pagination;
			break;
		}
		default: {
			const result = paginateFromUrl(url, mockMedia);
			mediaItems = result.items;
			pagination = result.pagination;
		}
	}

	return {
		tab,
		videos,
		mediaItems,
		ugcItems,
		pagination
	};
};
