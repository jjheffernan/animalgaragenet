import { createAdminClient } from '$lib/server/supabase/admin';
import { LIMITS, trimToMax } from '$lib/server/validation/limits';
import type { NewsletterSignupInput, NewsletterSubscriber } from '$lib/types/newsletter';

const mockStore = new Map<string, NewsletterSubscriber>();

function rowToSubscriber(row: Record<string, unknown>): NewsletterSubscriber {
	return {
		id: String(row.id),
		email: String(row.email),
		locale: String(row.locale),
		source: String(row.source),
		subscribedAt: String(row.subscribed_at),
		unsubscribedAt: row.unsubscribed_at ? String(row.unsubscribed_at) : null
	};
}

// @inspiration-scaffold: intentional — newsletter footer signup; see docs/plans/active/inspiration-polish-coordination.md#IP-008
export async function subscribeNewsletter(
	input: NewsletterSignupInput
): Promise<{ ok: boolean; subscriber?: NewsletterSubscriber }> {
	const email = trimToMax(input.email, LIMITS.contact.email).toLowerCase();
	if (!email.includes('@')) return { ok: false };

	const locale = input.locale ?? 'en-US';
	const source = input.source ?? 'footer';

	const admin = createAdminClient();
	if (!admin) {
		if (mockStore.has(email)) {
			return { ok: true, subscriber: mockStore.get(email) };
		}
		const subscriber: NewsletterSubscriber = {
			id: crypto.randomUUID(),
			email,
			locale,
			source,
			subscribedAt: new Date().toISOString(),
			unsubscribedAt: null
		};
		mockStore.set(email, subscriber);
		return { ok: true, subscriber };
	}

	const { data, error } = await admin
		.from('newsletter_subscribers')
		.upsert(
			{ email, locale, source, unsubscribed_at: null },
			{ onConflict: 'email', ignoreDuplicates: false }
		)
		.select('*')
		.single();

	if (error) {
		console.error('newsletter_subscribers upsert failed:', error.message);
		return { ok: false };
	}
	return { ok: true, subscriber: data ? rowToSubscriber(data) : undefined };
}

// @inspiration-scaffold: intentional — admin export; wire /admin/newsletter when needed
export async function listNewsletterSubscribers(limit = 100): Promise<NewsletterSubscriber[]> {
	const admin = createAdminClient();
	if (!admin) {
		return [...mockStore.values()]
			.filter((s) => !s.unsubscribedAt)
			.sort((a, b) => b.subscribedAt.localeCompare(a.subscribedAt))
			.slice(0, limit);
	}

	const { data, error } = await admin
		.from('newsletter_subscribers')
		.select('*')
		.is('unsubscribed_at', null)
		.order('subscribed_at', { ascending: false })
		.limit(limit);

	if (error || !data) return [];
	return data.map(rowToSubscriber);
}

/** Test helper */
export function _resetMockStoreForTests(): void {
	mockStore.clear();
}
