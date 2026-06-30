import { json } from '@sveltejs/kit';
import { createRestockAlert } from '$lib/server/restock/repository';
import { checkRateLimit } from '$lib/server/rate-limit';
import type { RequestHandler } from './$types';

/**
 * POST /api/restock/notify — PDP back-in-stock signup.
 *
 * @inspiration-scaffold: intentional — wire Saleor IN_STOCK webhook to listPendingRestockAlerts;
 * see docs/plans/active/inspiration-polish-coordination.md#IP-004
 */
export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
	const limited = checkRateLimit(`restock:${getClientAddress()}`, 10, 60_000);
	if (!limited.ok) {
		return json({ error: 'Too many requests' }, { status: 429 });
	}

	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const email = String(body.email ?? '').trim();
	const productId = String(body.productId ?? '').trim();
	const productSlug = body.productSlug ? String(body.productSlug) : undefined;
	const productName = body.productName ? String(body.productName) : undefined;
	const variantId = body.variantId ? String(body.variantId) : undefined;

	if (!email.includes('@') || !productId) {
		return json({ error: 'Email and productId are required' }, { status: 400 });
	}

	const alert = await createRestockAlert({
		email,
		productId,
		productSlug,
		productName,
		variantId,
		userId: locals.session?.id ?? null
	});

	if (!alert) {
		return json({ error: 'Unable to save alert' }, { status: 500 });
	}

	return json({ ok: true, id: alert.id });
};
