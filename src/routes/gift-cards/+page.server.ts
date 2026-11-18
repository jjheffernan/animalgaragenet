import { paginateFromUrl } from '#lib/pagination.ts';
import { getGiftCardProducts } from '#lib/server/catalog/products.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const allGiftCards = await getGiftCardProducts();
	const { items, pagination } = paginateFromUrl(url, allGiftCards);

	return {
		giftCards: items,
		pagination
	};
};
