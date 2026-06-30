import { env as privateEnv } from '$env/dynamic/private';
import { config } from '$lib/config/env';

export interface GraphQLResponse<T> {
	data?: T;
	errors?: Array<{ message: string }>;
}

export function getSaleorChannel(): string {
	return privateEnv.SALEOR_CHANNEL ?? 'default-channel';
}

// @saleor-migration: intentional — env gate; see docs/commerce/saleor.md#quick-migration
/** True when `PUBLIC_SALEOR_API_URL` is set — live catalog reads are allowed. */
export function isSaleorEnabled(): boolean {
	return Boolean(config.saleorApiUrl);
}

export async function saleorFetch<T>(
	query: string,
	variables: Record<string, unknown> = {}
): Promise<GraphQLResponse<T>> {
	const url = config.saleorApiUrl;

	if (!url) {
		return { data: undefined, errors: [{ message: 'PUBLIC_SALEOR_API_URL not configured' }] };
	}

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ query, variables })
	});

	if (!response.ok) {
		return { errors: [{ message: `Saleor API error: ${response.status}` }] };
	}

	return response.json();
}
