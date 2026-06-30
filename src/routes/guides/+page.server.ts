import { mockGuides } from '$lib/data/mock-guides';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({ guides: mockGuides });
