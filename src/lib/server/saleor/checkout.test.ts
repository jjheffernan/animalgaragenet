import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	CHECKOUT_COOKIE,
	addCheckoutLine,
	clearCheckoutId,
	completeCheckout,
	createCheckout,
	getCheckoutId,
	getCheckoutLines,
	getCheckoutShipping,
	initializePaymentGateway,
	initializeTransaction,
	isPaymentAppConfigured,
	paymentGatewayUnavailablePayload,
	PAYMENT_APP_OPS_HINT,
	PAYMENT_GATEWAY_UNAVAILABLE_CODE,
	processTransaction,
	setCheckoutId,
	stripeReturnDataFromUrl,
	updateDeliveryMethod,
	updateShippingAddress
} from './checkout';
import {
	readStripeClientSecret,
	readStripePublishableKey
} from '$lib/client/checkout/stripe-elements';

vi.mock('./client', () => ({
	isSaleorEnabled: vi.fn(() => true),
	saleorFetch: vi.fn()
}));

vi.mock('./channels', () => ({
	getChannelForLocale: vi.fn(() => 'us')
}));

import { isSaleorEnabled, saleorFetch } from './client';

const saleorCheckoutFixture = {
	id: 'checkout-1',
	lines: [
		{
			id: 'line-1',
			quantity: 2,
			variant: {
				id: 'variant-1',
				name: 'Medium',
				pricing: { price: { gross: { amount: 29.99, currency: 'USD' } } },
				product: {
					id: 'product-1',
					name: 'Garage Flag Tee',
					slug: 'garage-flag-tee',
					thumbnail: { url: 'https://cdn.example.com/tee.jpg', alt: 'Tee' }
				}
			},
			totalPrice: { gross: { amount: 59.98, currency: 'USD' } }
		}
	],
	totalPrice: { gross: { amount: 59.98, currency: 'USD' } }
};

const saleorShippingFixture = {
	...saleorCheckoutFixture,
	shippingPrice: { gross: { amount: 8.5, currency: 'USD' } },
	deliveryMethod: { id: 'ship-1', name: 'Standard' },
	availableShippingMethods: [
		{ id: 'ship-1', name: 'Standard', price: { amount: 8.5, currency: 'USD' } }
	],
	availablePaymentGateways: [{ id: 'saleor.app.payment.stripe', name: 'Stripe', currencies: ['USD'] }]
};

const shippingAddress = {
	firstName: 'Alex',
	lastName: 'Driver',
	streetAddress1: '123 Garage Ln',
	city: 'Austin',
	countryArea: 'TX',
	postalCode: '78701',
	country: 'US'
};

function mockCookies() {
	const store = new Map<string, string>();
	return {
		get: (name: string) => store.get(name),
		set: (name: string, value: string) => {
			store.set(name, value);
		},
		delete: (name: string) => {
			store.delete(name);
		}
	};
}

describe('payment app ops helpers', () => {
	it('builds structured payload for missing Payment App', () => {
		const payload = paymentGatewayUnavailablePayload();
		expect(payload.code).toBe(PAYMENT_GATEWAY_UNAVAILABLE_CODE);
		expect(payload.hint).toBe(PAYMENT_APP_OPS_HINT);
		expect(payload.error).toContain('Payment gateway not available');
	});

	it('isPaymentAppConfigured reflects gateway list', () => {
		expect(
			isPaymentAppConfigured({
				id: 'checkout-1',
				subtotal: { amount: 10, currency: 'USD' },
				shippingPrice: null,
				total: { amount: 10, currency: 'USD' },
				shippingMethods: [],
				selectedShippingMethodId: null,
				paymentGateways: []
			})
		).toBe(false);
		expect(
			isPaymentAppConfigured({
				id: 'checkout-1',
				subtotal: { amount: 10, currency: 'USD' },
				shippingPrice: null,
				total: { amount: 10, currency: 'USD' },
				shippingMethods: [],
				selectedShippingMethodId: null,
				paymentGateways: [{ id: 'saleor.app.payment.stripe', name: 'Stripe', currencies: ['USD'] }]
			})
		).toBe(true);
	});
});

describe('checkout cookie helpers', () => {
	it('stores and clears checkout id in cookies', () => {
		const cookies = mockCookies();

		expect(getCheckoutId(cookies as never)).toBeUndefined();

		setCheckoutId(cookies as never, 'checkout-abc');
		expect(getCheckoutId(cookies as never)).toBe('checkout-abc');
		expect(cookies.get(CHECKOUT_COOKIE)).toBe('checkout-abc');

		clearCheckoutId(cookies as never);
		expect(getCheckoutId(cookies as never)).toBeUndefined();
	});
});

describe('createCheckout', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
	});

	it('returns null when Saleor is disabled', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(false);

		expect(await createCheckout()).toBeNull();
		expect(saleorFetch).not.toHaveBeenCalled();
	});

	it('returns checkout id from Saleor response', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: { checkoutCreate: { checkout: saleorCheckoutFixture, errors: [] } }
		});

		expect(await createCheckout('us')).toBe('checkout-1');
	});

	it('returns null when Saleor reports errors', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: { checkoutCreate: { checkout: null, errors: [{ message: 'Channel not found' }] } }
		});

		expect(await createCheckout()).toBeNull();
	});
});

describe('addCheckoutLine', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
	});

	it('maps Saleor checkout lines to display shape', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: { checkoutLinesAdd: { checkout: saleorCheckoutFixture, errors: [] } }
		});

		const checkout = await addCheckoutLine('checkout-1', 'variant-1', 2);

		expect(checkout).toMatchObject({
			id: 'checkout-1',
			subtotal: { amount: 59.98, currency: 'USD' },
			lines: [
				{
					variantId: 'variant-1',
					productSlug: 'garage-flag-tee',
					quantity: 2,
					lineTotal: { amount: 59.98, currency: 'USD' }
				}
			]
		});
	});

	it('returns null when line add fails', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			errors: [{ message: 'Network error' }]
		});

		expect(await addCheckoutLine('checkout-1', 'variant-1', 1)).toBeNull();
	});
});

describe('getCheckoutLines', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
	});

	it('returns mapped checkout for valid id', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: { checkout: saleorCheckoutFixture }
		});

		const checkout = await getCheckoutLines('checkout-1');
		expect(checkout?.lines).toHaveLength(1);
	});

	it('returns null when checkout is missing', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: { checkout: null }
		});

		expect(await getCheckoutLines('missing')).toBeNull();
	});
});

describe('updateShippingAddress', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
	});

	it('returns error when Saleor is disabled', async () => {
		vi.mocked(isSaleorEnabled).mockReturnValue(false);
		const result = await updateShippingAddress('checkout-1', shippingAddress);
		expect(result).toEqual({ ok: false, error: 'Saleor not configured' });
	});

	it('maps available shipping methods', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: {
				checkoutShippingAddressUpdate: {
					checkout: {
						...saleorShippingFixture,
						deliveryMethod: null,
						availablePaymentGateways: []
					},
					errors: []
				}
			}
		});

		const result = await updateShippingAddress('checkout-1', shippingAddress);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.data.shippingMethods).toHaveLength(1);
		expect(result.data.shippingMethods[0]?.id).toBe('ship-1');
	});
});

describe('updateDeliveryMethod', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
	});

	it('exposes payment gateways after delivery method is set', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: {
				checkoutDeliveryMethodUpdate: { checkout: saleorShippingFixture, errors: [] }
			}
		});

		const result = await updateDeliveryMethod('checkout-1', 'ship-1');
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.data.selectedShippingMethodId).toBe('ship-1');
		expect(result.data.paymentGateways[0]?.id).toBe('saleor.app.payment.stripe');
	});
});

describe('getCheckoutShipping', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
	});

	it('returns checkout lines and shipping snapshot', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: { checkout: saleorShippingFixture }
		});

		const snapshot = await getCheckoutShipping('checkout-1');
		expect(snapshot?.checkout.lines).toHaveLength(1);
		expect(snapshot?.shipping.paymentGateways).toHaveLength(1);
	});
});

describe('initializePaymentGateway', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
	});

	it('returns gateway config data when Payment App is live', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: {
				paymentGatewayInitialize: {
					gatewayConfigs: [
						{
							id: 'saleor.app.payment.stripe',
							data: { stripePublishableKey: 'pk_test_123' },
							errors: []
						}
					],
					errors: []
				}
			}
		});

		const result = await initializePaymentGateway(
			'checkout-1',
			'saleor.app.payment.stripe',
			59.98
		);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.data).toMatchObject({ stripePublishableKey: 'pk_test_123' });
	});

	it('returns structured error when gateway config is missing', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: {
				paymentGatewayInitialize: {
					gatewayConfigs: [],
					errors: []
				}
			}
		});

		const result = await initializePaymentGateway('checkout-1', 'saleor.app.payment.stripe');
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.error).toContain('Payment gateway not available');
	});
});

describe('completeCheckout', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
	});

	it('returns order id on success', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: {
				checkoutComplete: {
					order: { id: 'order-99' },
					errors: []
				}
			}
		});

		const result = await completeCheckout('checkout-1');
		expect(result).toEqual({ ok: true, data: { orderId: 'order-99' } });
	});
});

describe('initializeTransaction', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
	});

	it('returns transaction id and client secret data', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: {
				transactionInitialize: {
					transaction: { id: 'tx-1' },
					transactionEvent: { type: 'CHARGE_ACTION_REQUIRED' },
					data: { stripeClientSecret: 'pi_secret_123' },
					errors: []
				}
			}
		});

		const result = await initializeTransaction(
			'checkout-1',
			'saleor.app.payment.stripe',
			68.48,
			{},
			'idempotency-1'
		);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.data.transactionId).toBe('tx-1');
		expect(result.data.eventType).toBe('CHARGE_ACTION_REQUIRED');
		expect(readStripeClientSecret(result.data.data)).toBe('pi_secret_123');
	});
});

describe('processTransaction', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(isSaleorEnabled).mockReturnValue(true);
	});

	it('returns event type after 3DS redirect sync', async () => {
		vi.mocked(saleorFetch).mockResolvedValue({
			data: {
				transactionProcess: {
					transactionEvent: { type: 'CHARGE_SUCCESS' },
					data: {},
					errors: []
				}
			}
		});

		const result = await processTransaction('tx-1', { paymentIntentId: 'pi_abc' });
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.data.eventType).toBe('CHARGE_SUCCESS');
	});
});

describe('stripeReturnDataFromUrl', () => {
	it('maps Stripe redirect query params', () => {
		const params = new URLSearchParams({
			payment_intent: 'pi_abc',
			payment_intent_client_secret: 'pi_secret',
			redirect_status: 'succeeded'
		});

		expect(stripeReturnDataFromUrl(params)).toEqual({
			paymentIntentId: 'pi_abc',
			paymentIntentClientSecret: 'pi_secret',
			redirectStatus: 'succeeded'
		});
	});

	it('returns undefined when payment_intent is missing', () => {
		expect(stripeReturnDataFromUrl(new URLSearchParams())).toBeUndefined();
	});
});

describe('readStripePublishableKey', () => {
	it('extracts publishable key from gateway config', () => {
		expect(readStripePublishableKey({ stripePublishableKey: 'pk_test_123' })).toBe('pk_test_123');
		expect(readStripePublishableKey({})).toBeNull();
	});
});

describe('payment app gate helpers', () => {
	it('isPaymentAppConfigured reflects available gateways', () => {
		expect(isPaymentAppConfigured(null)).toBe(false);
		expect(
			isPaymentAppConfigured({
				subtotal: { amount: 10, currency: 'USD' },
				shippingPrice: null,
				total: { amount: 10, currency: 'USD' },
				shippingMethods: [],
				selectedShippingMethodId: null,
				paymentGateways: []
			})
		).toBe(false);
		expect(
			isPaymentAppConfigured({
				subtotal: { amount: 10, currency: 'USD' },
				shippingPrice: null,
				total: { amount: 10, currency: 'USD' },
				shippingMethods: [],
				selectedShippingMethodId: null,
				paymentGateways: [{ id: 'saleor.app.payment.stripe', name: 'Stripe', currencies: ['USD'] }]
			})
		).toBe(true);
	});

	it('paymentGatewayUnavailablePayload includes ops hint without Stripe env', () => {
		const payload = paymentGatewayUnavailablePayload();
		expect(payload.code).toBe(PAYMENT_GATEWAY_UNAVAILABLE_CODE);
		expect(payload.hint).toBe(PAYMENT_APP_OPS_HINT);
		expect(payload.hint).not.toContain('STRIPE_');
	});
});
