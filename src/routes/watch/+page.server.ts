import { mockVideos } from '$lib/data/mock-videos';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({ videos: mockVideos });
