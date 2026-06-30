import type { PageServerLoad } from './$types';

/** Overview stats use mock counts until Saleor and Supabase admin queries ship. */
export const load: PageServerLoad = async ({ parent }) => {
	return parent();
};
