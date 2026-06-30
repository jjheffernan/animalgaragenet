import { error } from '@sveltejs/kit';
import { getVideoById, mockVideos } from '$lib/data/mock-videos';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const video = getVideoById(params.id);
	if (!video) error(404, 'Video not found');
	return { videos: mockVideos, video };
};
