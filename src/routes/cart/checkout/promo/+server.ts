import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { clearCode, getPromoStatus, redeemCode } from '$lib/server/checkout/promo';

interface PromoBody {
	code?: string;
}

export const GET: RequestHandler = async ({ cookies }) => {
	const status = await getPromoStatus(cookies);
	return json(status);
};

export const POST: RequestHandler = async ({ request, cookies, url, getClientAddress }) => {
	const body = (await request.json()) as PromoBody;
	const code = String(body.code ?? '').trim();
	const locale = url.searchParams.get('locale') ?? 'en-US';

	const result = await redeemCode(cookies, code, locale, getClientAddress());
	if (!result.ok) {
		return json({ error: result.message }, { status: 400 });
	}

	return json({
		message: result.message,
		checkout: result.checkout ?? null,
		mockPromo: result.mockPromo ?? null
	});
};

export const DELETE: RequestHandler = async ({ request, cookies, url }) => {
	const body = (await request.json()) as PromoBody;
	const code = String(body.code ?? '').trim();
	const locale = url.searchParams.get('locale') ?? 'en-US';

	const result = await clearCode(cookies, code, locale);
	if (!result.ok) {
		return json({ error: result.message }, { status: 400 });
	}

	return json({
		message: result.message,
		checkout: result.checkout ?? null,
		mockPromo: result.mockPromo ?? null
	});
};
