import { json } from '@sveltejs/kit';
import { isSocialOAuthConfigured, socialOAuthAuthorizeUrl } from '$lib/auth/social-oauth';
import { SOCIAL_PLATFORMS } from '$lib/data/social-platforms';
import {
	getUserSocialConnections,
	updateUserSocialConnection
} from '$lib/server/social-connections/repository';
import {
	validateConnectionPutBody,
	type ConnectionPutBody
} from '$lib/server/social-connections/validation';
import type { SocialPlatformId } from '$lib/data/social-platforms';
import type { RequestHandler } from './$types';

/**
 * Account social platform connections.
 *
 * @inspiration-scaffold: intentional — replace mock handle entry with OAuth callbacks;
 * see docs/plans/active/inspiration-polish-tracker.md#IP-027
 */
export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const connections = await getUserSocialConnections(locals.session.id);
	const platforms = SOCIAL_PLATFORMS.map((p) => {
		const oauthConfigured = isSocialOAuthConfigured(p.id);
		return {
			id: p.id,
			label: p.label,
			oauthConfigured,
			oauthAuthorizeUrl: oauthConfigured ? socialOAuthAuthorizeUrl(p.id) : null
		};
	});

	return json({
		connections,
		platforms,
		mockMode: platforms.every((p) => !p.oauthConfigured)
	});
};

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	let body: ConnectionPutBody;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const parsed = validateConnectionPutBody(body);
	if (!parsed.ok) {
		return json({ error: parsed.error }, { status: 400 });
	}

	const platform = parsed.platform as SocialPlatformId;
	const oauthConfigured = isSocialOAuthConfigured(platform);

	if (parsed.action === 'connect' && oauthConfigured) {
		return json(
			{
				error: 'OAuth linking not wired yet — use mock handle flow or implement callback route'
			},
			{ status: 501 }
		);
	}

	const next = await updateUserSocialConnection(locals.session.id, platform, {
		action: parsed.action,
		...(parsed.action === 'connect'
			? { handle: parsed.handle!, mock: !oauthConfigured }
			: {})
	});

	if (!next) {
		return json({ error: 'Unable to save connection' }, { status: 500 });
	}

	return json({ ok: true, connections: next });
};
