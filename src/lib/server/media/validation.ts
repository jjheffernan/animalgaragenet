import {
	ALLOWED_IMAGE_MIMES,
	MAX_FILES_PER_TESTIMONIAL,
	MAX_UPLOAD_BYTES,
	type AllowedImageMime
} from './constants';

export function isAllowedImageMime(mimeType: string): mimeType is AllowedImageMime {
	return (ALLOWED_IMAGE_MIMES as readonly string[]).includes(mimeType);
}

export function validateUploadRequest(mimeType: string, byteSize: number): string | null {
	if (!isAllowedImageMime(mimeType)) {
		return 'Only JPEG, PNG, and WebP images are allowed.';
	}
	if (!Number.isFinite(byteSize) || byteSize <= 0) {
		return 'Invalid file size.';
	}
	if (byteSize > MAX_UPLOAD_BYTES) {
		return 'Images must be 5 MB or smaller.';
	}
	return null;
}

export function validateMediaAssetIds(assetIds: string[]): string | null {
	if (assetIds.length > MAX_FILES_PER_TESTIMONIAL) {
		return `You can attach up to ${MAX_FILES_PER_TESTIMONIAL} photos.`;
	}
	return null;
}

export function mimeToExtension(mimeType: AllowedImageMime): string {
	switch (mimeType) {
		case 'image/jpeg':
			return 'jpg';
		case 'image/png':
			return 'png';
		case 'image/webp':
			return 'webp';
	}
}
