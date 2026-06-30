import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminGateJsonResponse, resolveAdminGateFromLocals } from '$lib/server/auth/admin-gate';
import { createPresignedUploadUrl, isCdnUploadConfigured } from '$lib/server/media/cdn';
import { validateUploadRequest } from '$lib/server/media/validation';

interface UploadSlotBody {
	filename?: string;
	mimeType?: string;
	byteSize?: number;
}

function sanitizeFilename(filename: string): string {
	return filename.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'upload';
}

/** Admin presigned PUT slot for S3 + CloudFront when env is configured. */
export const POST: RequestHandler = async ({ request, locals }) => {
	const denied = adminGateJsonResponse(resolveAdminGateFromLocals(locals));
	if (denied) return denied;

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

	const validationError = validateUploadRequest(mimeType, byteSize);
	if (validationError) {
		return json({ error: validationError }, { status: 400 });
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
