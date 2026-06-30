import { mockBrands } from '$lib/data/mock-brands';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({ brands: mockBrands });
