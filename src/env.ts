import { defineEnvVars } from '@sveltejs/kit/env';

/** Optional string — unset/blank → undefined (matches prior `$env/dynamic` behavior). */
const optional = (input: string | undefined) => {
	const value = input?.trim();
	return value ? value : undefined;
};

export const variables = defineEnvVars({
	// Supabase
	SUPABASE_DATABASE_URL: { schema: optional },
	SUPABASE_ANON_KEY: { schema: optional },
	SUPABASE_SERVICE_ROLE_KEY: { schema: optional },
	PUBLIC_SUPABASE_URL: { public: true, schema: optional },

	// Site / lockdown
	SITE_LOCKED: { schema: optional },
	PUBLIC_SITE_URL: { public: true, schema: optional },
	PUBLIC_DEFAULT_LOCALE: { public: true, schema: optional },
	PUBLIC_DEFAULT_CURRENCY: { public: true, schema: optional },
	PUBLIC_ANALYTICS_SCRIPT_URL: { public: true, schema: optional },
	LOCAL_DEV_AUTH: { schema: optional },
	DEV_ADMIN: { schema: optional },

	// Saleor
	PUBLIC_SALEOR_API_URL: { public: true, schema: optional },
	SALEOR_CHANNEL: { schema: optional },
	SALEOR_LOCALE_CHANNELS: { schema: optional },
	SALEOR_FREE_SHIPPING_THRESHOLDS: { schema: optional },
	SALEOR_WEBHOOK_SECRET: { schema: optional },
	SALEOR_APP_TOKEN: { schema: optional },

	// Ghost
	GHOST_URL: { schema: optional },
	GHOST_CONTENT_API_KEY: { schema: optional },

	// YouTube
	YOUTUBE_API_KEY: { schema: optional },
	YOUTUBE_SYNC_SECRET: { schema: optional },

	// Social OAuth (account linking)
	SOCIAL_INSTAGRAM_CLIENT_ID: { schema: optional },
	SOCIAL_YOUTUBE_CLIENT_ID: { schema: optional },
	SOCIAL_TIKTOK_CLIENT_KEY: { schema: optional },
	SOCIAL_DISCORD_CLIENT_ID: { schema: optional },

	// Support / observability
	BUG_REPORT_WEBHOOK_URL: { schema: optional },
	OTEL_EXPORTER_OTLP_ENDPOINT: { schema: optional },
	OTEL_EXPORTER_OTLP_PROTOCOL: { schema: optional },
	OTEL_SERVICE_NAME: { schema: optional },

	// CDN / S3
	PUBLIC_CDN_BASE_URL: { public: true, schema: optional },
	AWS_ACCESS_KEY_ID: { schema: optional },
	AWS_SECRET_ACCESS_KEY: { schema: optional },
	S3_BUCKET: { schema: optional },
	S3_REGION: { schema: optional },
	AWS_CLOUDFRONT_DISTRIBUTION_ID: { schema: optional }
});
