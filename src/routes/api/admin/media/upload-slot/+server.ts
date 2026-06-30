import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { resolveAdminGate } from '$lib/server/auth/admin-gate';
import { createPresignedUploadUrl, isCdnUploadConfigured } from '$lib/server/media/cdn';
import {
	ALLOWED_IMAGE_MIMES,
	MAX_UPLOAD_BYTES,
	type AllowedImageMime
} from '$lib/server/media/constants';

interface UploadSlotBody {
	filename?: string;
	mimeType?: string;
	byteSize?: number;
}

function isAllowedAdminMime(mimeType: string): mimeType is AllowedImageMime {
	return (ALLOWED_IMAGE_MIMES as readonly string[]).includes(mimeType);
}

function sanitizeFilename(filename: string): string {
	return filename.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'upload';
}

/** Admin presigned PUT slot for S3 + CloudFront when env is configured. */
export const POST: RequestHandler = async ({ request, locals }) => {
	const gate = resolveAdminGate({
		hasSession: Boolean(locals.session),
		role: locals.session?.role,
		devAdmin: locals.devAdmin
	});

	if (gate !== 'allow') {
		return json({ error: gate === 'sign-in' ? 'Sign in required.' : 'Forbidden.' }, { status: 403 });
	}

	if (!isCdnUploadConfigured()) {
		return json(
			{
				error: 'CDN upload is not configured.',
				code: 'CDN_UPLOAD_DISABLED',
				hint: 'Set PUBLIC_CDN_BASE_URL, S3_BUCKET, S3_REGION, and AWS credentials on the server.'
			},
			{ status: 503 }
		);
	}

	const body = (await request.json()) as UploadSlotBody;
	const mimeType = String(body.mimeType ?? '').trim();
	const byteSize = Number(body.byteSize);
	const filename = sanitizeFilename(String(body.filename ?? 'upload'));

	if (!isAllowedAdminMime(mimeType)) {
		return json({ error: 'Only JPEG, PNG, and WebP images are allowed.' }, { status: 400 });
	}

	if (!Number.isFinite(byteSize) || byteSize <= 0 || byteSize > MAX_UPLOAD_BYTES) {
		return json({ error: `File must be between 1 byte and ${MAX_UPLOAD_BYTES} bytes.` }, { status: 400 });
	}

	const assetId = crypto.randomUUID();
	const objectKey = `media/admin/${assetId}/${filename}`;
	const presigned = await createPresignedUploadUrl(objectKey, mimeType);

	if (!presigned) {
		return json({ error: 'Could not create presigned upload URL.' }, { status: 502 });
	}

	return json({
		uploadUrl: presigned.url,
		objectKey: presigned.key,
		publicUrl: presigned.publicUrl
	});
};
