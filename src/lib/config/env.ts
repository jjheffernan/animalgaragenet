import {
	PUBLIC_SITE_URL,
	PUBLIC_CDN_BASE_URL,
	PUBLIC_SALEOR_API_URL,
	PUBLIC_DEFAULT_LOCALE,
	PUBLIC_DEFAULT_CURRENCY
} from '$app/env/public';

/**
 * Public runtime config (browser-safe).
 *
 * Saleor headless commerce (backend on separate domain):
 * - `PUBLIC_SALEOR_API_URL` — GraphQL endpoint, e.g. `https://commerce.animalgarage.net/graphql/`
 * - `SALEOR_CHANNEL` — server-only channel slug (default `default-channel`); read via
 *   `getSaleorChannel()` in `#lib/server/saleor/client.ts`, not exposed here
 *
 * Ghost CMS (guides + blog, server-only):
 * - `GHOST_URL` — site URL, e.g. `https://content.animalgarage.net`
 * - `GHOST_CONTENT_API_KEY` — Content API key; read via `#lib/server/ghost/client.ts`
 *
 * See `.env.example` for all variables.
 */
export const config = {
	siteUrl: PUBLIC_SITE_URL || 'http://localhost:5173',
	cdnBaseUrl: PUBLIC_CDN_BASE_URL || '',
	/** Saleor GraphQL URL (`PUBLIC_SALEOR_API_URL`). Empty disables live API calls. */
	saleorApiUrl: PUBLIC_SALEOR_API_URL || '',
	defaultLocale: PUBLIC_DEFAULT_LOCALE || 'en-US',
	defaultCurrency: PUBLIC_DEFAULT_CURRENCY || 'USD'
} as const;
