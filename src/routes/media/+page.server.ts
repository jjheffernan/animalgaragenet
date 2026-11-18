import type { MediaItem } from '#lib/data/mock/media.ts';
import { mockMedia } from '#lib/data/mock/media.ts';
import { mockUGC } from '#lib/data/mock/ugc.ts';
import { paginateFromUrl } from '#lib/pagination.ts';
import { listApprovedUgcGalleryItems } from '#lib/server/media/repository.ts';
import { createAdminClient } from '#lib/server/supabase/admin.ts';
import {
	listApprovedTestimonials,
	listFeaturedTestimonials
} from '#lib/server/testimonials/repository.ts';
import { enrichTestimonialsWithPhotos } from '#lib/server/media/repository.ts';
import { testimonialsToUgcItems } from '#lib/server/testimonials/to-ugc.ts';
import { loadWatchHubVideos } from '#lib/server/youtube/public.ts';
import type { UGCItem, Video } from '#lib/types/domain.ts';
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
	const source = featured.length > 0 ? featured : await listApprovedTestimonials(48);
	return testimonialsToUgcItems(await enrichTestimonialsWithPhotos(source));
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
			const { listVideos } = await loadWatchHubVideos();
			const result = paginateFromUrl(url, listVideos);
			videos = result.items;
			pagination = result.pagination;
			break;
		}
		case 'photos': {
			const ugcPhotos = await listApprovedUgcGalleryItems(200);
			const photoItems: MediaItem[] =
				ugcPhotos.length > 0
					? ugcPhotos.map((item) => ({
							id: item.id,
							title: item.title,
							type: 'image' as const,
							thumbnail: item.thumbnail,
							src: item.src,
							category: 'Community'
						}))
					: mockMedia.filter((item) => item.type === 'image');
			const result = paginateFromUrl(url, photoItems);
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
