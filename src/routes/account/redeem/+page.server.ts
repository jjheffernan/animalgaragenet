import { fail } from '@sveltejs/kit';
import { getPromoStatus, redeemCode } from '$lib/server/checkout/promo';
import { isSaleorEnabled } from '$lib/server/saleor/client';
import { MOCK_PROMO_CODES } from '$lib/data/mock/promo-codes';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const status = await getPromoStatus(cookies);
	return {
		saleorEnabled: status.saleorEnabled,
		checkout: status.checkout,
		mockPromo: status.mockPromo,
		mockCodesHint: isSaleorEnabled() ? [] : MOCK_PROMO_CODES.map((p) => p.code)
	};
};

export const actions: Actions = {
	apply: async ({ request, cookies, url, getClientAddress }) => {
		const form = await request.formData();
		const code = String(form.get('code') ?? '').trim();
		const locale = url.searchParams.get('locale') ?? 'en-US';

		const result = await redeemCode(cookies, code, locale, getClientAddress());
		if (!result.ok) {
			return fail(400, { error: result.message, code });
		}

		return {
			success: true,
			message: result.message,
			checkout: result.checkout ?? null,
			mockPromo: result.mockPromo ?? null
		};
	}
};
