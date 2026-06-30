import { getGiftCardProducts } from '$lib/data/mock-products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({ giftCards: getGiftCardProducts() });
