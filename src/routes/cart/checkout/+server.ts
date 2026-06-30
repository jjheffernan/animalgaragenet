import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { resolveChannelForLocale } from '$lib/server/saleor/channels';
import { isSaleorEnabled } from '$lib/server/saleor/client';
import {
	addCheckoutLine,
	createCheckout,
	deleteCheckoutLine,
	getCheckoutId,
	setCheckoutId,
	updateCheckoutLine
} from '$lib/server/saleor/checkout';

interface AddLineBody {
	variantId?: string;
	quantity?: number;
}

interface UpdateLineBody {
	lineId?: string;
	quantity?: number;
}

interface DeleteLineBody {
	lineId?: string;
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
	const channel = await resolveChannelForLocale(locale ?? 'en-US');

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

export const PATCH: RequestHandler = async ({ request, cookies }) => {
	if (!isSaleorEnabled()) {
		return json({ error: 'Saleor not configured' }, { status: 503 });
	}

	const checkoutId = getCheckoutId(cookies);
	if (!checkoutId) {
		return json({ error: 'No active checkout' }, { status: 400 });
	}

	const body = (await request.json()) as UpdateLineBody;
	const lineId = body.lineId?.trim();
	const quantity = Math.floor(body.quantity ?? 0);

	if (!lineId) {
		return json({ error: 'lineId is required' }, { status: 400 });
	}

	const checkout =
		quantity <= 0
			? await deleteCheckoutLine(checkoutId, lineId)
			: await updateCheckoutLine(checkoutId, lineId, quantity);

	if (!checkout) {
		return json({ error: 'Failed to update line' }, { status: 502 });
	}

	setCheckoutId(cookies, checkout.id);
	return json({ checkout });
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	if (!isSaleorEnabled()) {
		return json({ error: 'Saleor not configured' }, { status: 503 });
	}

	const checkoutId = getCheckoutId(cookies);
	if (!checkoutId) {
		return json({ error: 'No active checkout' }, { status: 400 });
	}

	const body = (await request.json()) as DeleteLineBody;
	const lineId = body.lineId?.trim();
	if (!lineId) {
		return json({ error: 'lineId is required' }, { status: 400 });
	}

	const checkout = await deleteCheckoutLine(checkoutId, lineId);
	if (!checkout) {
		return json({ error: 'Failed to remove line' }, { status: 502 });
	}

	setCheckoutId(cookies, checkout.id);
	return json({ checkout });
};
