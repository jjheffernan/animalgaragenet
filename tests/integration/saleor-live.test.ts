/**
 * Env-gated live Saleor integration smoke (AUD-P2-006).
 * Skips when PUBLIC_SALEOR_API_URL is unset — safe in default CI.
 */
import { describe, expect, it } from 'vitest';
import { probeSaleorCatalog, probeSaleorCheckout } from '../../scripts/test-readiness';

const saleorUrl = process.env.PUBLIC_SALEOR_API_URL?.trim() ?? '';
const describeLive = saleorUrl ? describe : describe.skip;

async function saleorGraphql<T>(
	query: string,
	variables: Record<string, unknown> = {}
): Promise<{ data?: T; errors?: Array<{ message: string }> }> {
	const response = await fetch(saleorUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query, variables })
	});

	if (!response.ok) {
		return { errors: [{ message: `HTTP ${response.status}` }] };
	}

	return response.json() as Promise<{ data?: T; errors?: Array<{ message: string }> }>;
}

describeLive('live Saleor integration', () => {
	it('readiness catalog probe passes', async () => {
		const result = await probeSaleorCatalog();
		expect(result.status).toBe('pass');
	});

	it('readiness channel probe passes', async () => {
		const result = await probeSaleorCheckout();
		expect(result.status).toBe('pass');
	});

	it('product detail query returns slug and pricing fields', async () => {
		const channel = process.env.SALEOR_CHANNEL?.trim() || 'default-channel';
		const list = await saleorGraphql<{
			products?: { edges: Array<{ node: { slug: string } }> };
		}>(
			`query Products($channel: String!) {
				products(channel: $channel, first: 1) { edges { node { slug } } }
			}`,
			{ channel }
		);

		expect(list.errors ?? []).toHaveLength(0);
		const slug = list.data?.products?.edges[0]?.node.slug;
		expect(slug).toBeTruthy();
		if (!slug) return;

		const detail = await saleorGraphql<{
			product?: {
				id: string;
				name: string;
				slug: string;
				pricing?: { priceRange?: { start?: { gross?: { amount: number; currency: string } } } };
			} | null;
		}>(
			`query Product($slug: String!, $channel: String!) {
				product(slug: $slug, channel: $channel) {
					id name slug
					pricing { priceRange { start { gross { amount currency } } } }
				}
			}`,
			{ slug, channel }
		);

		expect(detail.errors ?? []).toHaveLength(0);
		expect(detail.data?.product?.slug).toBe(slug);
		expect(detail.data?.product?.pricing?.priceRange?.start?.gross?.currency).toBeTruthy();
	});
});
