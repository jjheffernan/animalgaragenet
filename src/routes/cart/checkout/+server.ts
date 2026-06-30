import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getChannelForLocale } from '$lib/server/saleor/channels';
import { isSaleorEnabled } from '$lib/server/saleor/client';
import {
	addCheckoutLine,
	createCheckout,
	getCheckoutId,
	setCheckoutId
} from '$lib/server/saleor/checkout';

interface AddLineBody {
	variantId?: string;
	quantity?: number;
}

/** Server-side cart mutations — keeps Saleor app token off the browser. */
export const POST: RequestHandler = async ({ request, cookies, url }) => {
	if (!isSaleorEnabled()) {
		return json({ error: 'Saleor not configured' }, { status: 503 });
	}

	const body = (await request.json()) as AddLineBody;
	const variantId = body.variantId?.trim();
	const quantity = Math.max(1, Math.floor(body.quantity ?? 1));

	if (!variantId) {
		return json({ error: 'variantId is required' }, { status: 400 });
	}

	const locale = url.searchParams.get('locale') ?? undefined;
	const channel = getChannelForLocale(locale ?? 'en-US');

	let checkoutId = getCheckoutId(cookies);
	if (!checkoutId) {
		checkoutId = (await createCheckout(channel)) ?? undefined;
		if (!checkoutId) {
			return json({ error: 'Failed to create checkout' }, { status: 502 });
		}
		setCheckoutId(cookies, checkoutId);
	}

	const checkout = await addCheckoutLine(checkoutId, variantId, quantity);
	if (!checkout) {
		return json({ error: 'Failed to add line' }, { status: 502 });
	}

	setCheckoutId(cookies, checkout.id);
	return json({ checkout });
};
