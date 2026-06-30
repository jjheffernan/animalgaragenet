import { config } from '$lib/config/env';

export interface GraphQLResponse<T> {
	data?: T;
	errors?: Array<{ message: string }>;
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
