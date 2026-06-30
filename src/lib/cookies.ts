/**
 * Animal Garage cookie names (`ag_*`).
 *
 * Essential (server, httpOnly): auth/session (Supabase SSR), checkout (`ag-checkout-id`).
 * Preferences (client-readable): promo dismiss, banner rotation.
 * Consent: cookie notice acknowledgement (analytics stub).
 *
 * @see docs/cookies.md
 */

/** User accepted optional cookies (analytics, etc.). `1` = accepted, `0` = essential only. */
export const COOKIE_CONSENT = 'ag_cookie_consent';

/** Promo bar dismissed for this browser. Value `1`. */
export const COOKIE_PROMO_DISMISSED = 'ag_promo_dismissed';

/** Stable promo banner id for A/B rotation across tabs. */
export const COOKIE_PROMO_BANNER_ID = 'ag_promo_banner_id';

/** Default max-age for preference cookies: 30 days. */
export const PREF_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
