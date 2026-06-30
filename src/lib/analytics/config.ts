import { env } from '$env/dynamic/public';

export type AnalyticsConfig = {
	/** External script URL when set (Plausible, Umami, self-hosted, etc.). */
	scriptUrl: string | null;
	configured: boolean;
};

/** Env-gated analytics hook point — no vendor SDK bundled (AUD-P2-012). */
export function getAnalyticsConfig(): AnalyticsConfig {
	const scriptUrl = env.PUBLIC_ANALYTICS_SCRIPT_URL?.trim() || null;
	return { scriptUrl, configured: Boolean(scriptUrl) };
}
