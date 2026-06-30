import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { resolveAdminGate } from '$lib/server/auth/admin-gate';
import {
	collectAdminInvalidationKeys,
	invalidateCdnPaths,
	isCdnInvalidationConfigured
} from '$lib/server/media/cdn';

interface InvalidateBody {
	paths?: string[];
	objectKey?: string;
}

/** Admin CloudFront cache invalidation after S3 upload when distribution ID is set. */
export const POST: RequestHandler = async ({ request, locals }) => {
	const gate = resolveAdminGate({
		hasSession: Boolean(locals.session),
		role: locals.session?.role,
		devAdmin: locals.devAdmin
	});

	if (gate !== 'allow') {
		return json({ error: gate === 'sign-in' ? 'Sign in required.' : 'Forbidden.' }, { status: 403 });
	}

	if (!isCdnInvalidationConfigured()) {
		return json(
			{
				error: 'CDN invalidation is not configured.',
				code: 'CDN_INVALIDATION_DISABLED',
				hint: 'Set AWS_CLOUDFRONT_DISTRIBUTION_ID with S3 and AWS credentials.'
			},
			{ status: 503 }
		);
	}

	const body = (await request.json()) as InvalidateBody;
	const collected = collectAdminInvalidationKeys({
		objectKey: body.objectKey,
		paths: body.paths
	});

	if (!collected.ok) {
		return json({ error: collected.error }, { status: 400 });
	}

	const paths = collected.keys;
	const invalidated = await invalidateCdnPaths(paths);
	if (!invalidated) {
		return json({ error: 'Could not invalidate CDN paths.' }, { status: 502 });
	}

	return json({ ok: true, paths });
};
