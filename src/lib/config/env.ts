import { env } from '$env/dynamic/public';

export const config = {
	siteUrl: env.PUBLIC_SITE_URL ?? 'http://localhost:5173',
	cdnBaseUrl: env.PUBLIC_CDN_BASE_URL ?? '',
	saleorApiUrl: env.PUBLIC_SALEOR_API_URL ?? '',
	supabaseUrl: env.PUBLIC_SUPABASE_URL ?? '',
	supabaseAnonKey: env.PUBLIC_SUPABASE_ANON_KEY ?? '',
	defaultLocale: env.PUBLIC_DEFAULT_LOCALE ?? 'en-US',
	defaultCurrency: env.PUBLIC_DEFAULT_CURRENCY ?? 'USD'
} as const;
