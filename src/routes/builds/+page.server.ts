import { mockBuilds } from '$lib/data/mock-builds';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({ builds: mockBuilds });
