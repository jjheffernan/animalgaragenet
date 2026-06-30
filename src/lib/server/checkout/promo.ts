import type { Cookies } from '@sveltejs/kit';
import { findMockPromoCode, normalizePromoCode } from '$lib/data/mock/promo-codes';
import { checkRateLimit } from '$lib/server/rate-limit';
import { LIMITS } from '$lib/server/validation/limits';
import type { CheckoutDisplay, MockPromoState } from '$lib/types/checkout';
import { getChannelForLocale } from '$lib/server/saleor/channels';
import { isSaleorEnabled } from '$lib/server/saleor/client';
import {
	applyPromoCode,
	ensureCheckout,
	getCheckoutId,
	getCheckoutLines,
	removePromoCode,
	setCheckoutId
} from '$lib/server/saleor/checkout';

export const MOCK_PROMO_COOKIE = 'ag-mock-promo';

const PROMO_RATE_LIMIT = 10;
const PROMO_RATE_WINDOW_MS = 60_000;

export interface PromoRedeemResult {
	ok: boolean;
	message: string;
	checkout?: CheckoutDisplay | null;
	mockPromo?: MockPromoState | null;
}

function parseMockPromoCookie(raw: string | undefined): MockPromoState | null {
	if (!raw) return null;
	try {
		return JSON.parse(raw) as MockPromoState;
	} catch {
		const promo = findMockPromoCode(raw);
		return promo ? { code: promo.code, label: promo.label, percentOff: promo.percentOff } : null;
	}
}

export function getMockPromo(cookies: Cookies): MockPromoState | null {
	return parseMockPromoCookie(cookies.get(MOCK_PROMO_COOKIE));
}

export function setMockPromo(cookies: Cookies, promo: MockPromoState): void {
	cookies.set(MOCK_PROMO_COOKIE, JSON.stringify(promo), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 7
	});
}

export function clearMockPromo(cookies: Cookies): void {
	cookies.delete(MOCK_PROMO_COOKIE, { path: '/' });
}

export async function redeemCode(
	cookies: Cookies,
	rawCode: string,
	locale = 'en-US',
	clientKey?: string
): Promise<PromoRedeemResult> {
	if (clientKey) {
		const rate = checkRateLimit(`promo:${clientKey}`, PROMO_RATE_LIMIT, PROMO_RATE_WINDOW_MS);
		if (!rate.ok) {
			return { ok: false, message: 'Too many attempts. Try again in a minute.' };
		}
	}

	const code = normalizePromoCode(rawCode).slice(0, LIMITS.promoCode);
	if (!code) {
		return { ok: false, message: 'Enter a code.' };
	}

	if (isSaleorEnabled()) {
		const channel = getChannelForLocale(locale);
		const ensured = await ensureCheckout(cookies, channel);
		if ('error' in ensured) {
			return { ok: false, message: ensured.error };
		}

		const existing = (await getCheckoutLines(ensured.checkoutId))?.voucherCodes ?? [];
		const result = await applyPromoCode(ensured.checkoutId, code, existing);
		if ('error' in result) {
			return { ok: false, message: result.error };
		}

		setCheckoutId(cookies, result.checkout.id);
		return {
			ok: true,
			message: result.checkout.discountName
				? `Applied: ${result.checkout.discountName}`
				: 'Code applied to your cart.',
			checkout: result.checkout
		};
	}

	const promo = findMockPromoCode(code);
	if (!promo) {
		return { ok: false, message: 'Invalid or expired code.' };
	}

	const mockPromo: MockPromoState = {
		code: promo.code,
		label: promo.label,
		percentOff: promo.percentOff
	};
	setMockPromo(cookies, mockPromo);

	return {
		ok: true,
		message: `Applied: ${promo.label}`,
		mockPromo
	};
}

export async function clearCode(
	cookies: Cookies,
	rawCode: string,
	locale = 'en-US'
): Promise<PromoRedeemResult> {
	const code = normalizePromoCode(rawCode);

	if (isSaleorEnabled()) {
		const checkoutId = getCheckoutId(cookies);
		if (!checkoutId || !code) {
			return { ok: false, message: 'No code to remove.' };
		}

		const existing = (await getCheckoutLines(checkoutId))?.voucherCodes ?? [];
		const result = await removePromoCode(checkoutId, code, existing);
		if ('error' in result) {
			return { ok: false, message: result.error };
		}

		setCheckoutId(cookies, result.checkout.id);
		return {
			ok: true,
			message: 'Code removed.',
			checkout: result.checkout
		};
	}

	clearMockPromo(cookies);
	return { ok: true, message: 'Code removed.', mockPromo: null };
}

export async function getPromoStatus(cookies: Cookies): Promise<{
	saleorEnabled: boolean;
	checkout: CheckoutDisplay | null;
	mockPromo: MockPromoState | null;
}> {
	const saleorEnabled = isSaleorEnabled();
	if (saleorEnabled) {
		const checkoutId = getCheckoutId(cookies);
		const checkout = checkoutId ? await getCheckoutLines(checkoutId) : null;
		return { saleorEnabled, checkout, mockPromo: null };
	}

	return { saleorEnabled, checkout: null, mockPromo: getMockPromo(cookies) };
}
