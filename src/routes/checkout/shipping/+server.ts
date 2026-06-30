import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { ShippingAddressInput } from '$lib/types/checkout';
import {
	getCheckoutId,
	updateDeliveryMethod,
	updateShippingAddress
} from '$lib/server/saleor/checkout';
import { requireSaleorEnabled } from '$lib/server/saleor/checkout-route-helpers';

interface ShippingBody {
	address?: Partial<ShippingAddressInput>;
	deliveryMethodId?: string;
}

function parseAddress(body: Partial<ShippingAddressInput>): ShippingAddressInput | null {
	const firstName = body.firstName?.trim();
	const lastName = body.lastName?.trim();
	const streetAddress1 = body.streetAddress1?.trim();
	const city = body.city?.trim();
	const countryArea = body.countryArea?.trim();
	const postalCode = body.postalCode?.trim();
	const country = body.country?.trim();

	if (!firstName || !lastName || !streetAddress1 || !city || !postalCode || !country) {
		return null;
	}

	return {
		firstName,
		lastName,
		streetAddress1,
		city,
		countryArea: countryArea ?? '',
		postalCode,
		country
	};
}

/** Update shipping address and/or delivery method on the active checkout. */
export const POST: RequestHandler = async ({ request, cookies }) => {
	const disabled = requireSaleorEnabled();
	if (disabled) return disabled;

	const checkoutId = getCheckoutId(cookies);
	if (!checkoutId) {
		return json({ error: 'No active checkout', code: 'NO_CHECKOUT' }, { status: 400 });
	}

	const body = (await request.json()) as ShippingBody;
	const deliveryMethodId = body.deliveryMethodId?.trim();

	if (deliveryMethodId) {
		const result = await updateDeliveryMethod(checkoutId, deliveryMethodId);
		if (!result.ok) {
			return json({ error: result.error, code: 'DELIVERY_METHOD_FAILED' }, { status: 502 });
		}
		return json({ shipping: result.data });
	}

	const address = parseAddress(body.address ?? {});
	if (!address) {
		return json(
			{ error: 'Complete shipping address is required', code: 'INVALID_ADDRESS' },
			{ status: 400 }
		);
	}

	const result = await updateShippingAddress(checkoutId, address);
	if (!result.ok) {
		return json({ error: result.error, code: 'SHIPPING_ADDRESS_FAILED' }, { status: 502 });
	}

	return json({ shipping: result.data });
};
