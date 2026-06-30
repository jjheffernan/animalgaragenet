import { describe, expect, it } from 'vitest';
import { MAX_FILES_PER_TESTIMONIAL } from './constants';
import { validateMediaAssetIds, validateUploadRequest } from './validation';

describe('validateUploadRequest', () => {
	it('rejects unsupported mime types', () => {
		expect(validateUploadRequest('application/pdf', 1000)).toMatch(/JPEG/);
	});

	it('accepts valid image uploads', () => {
		expect(validateUploadRequest('image/png', 1024)).toBeNull();
	});

	it('rejects oversized files', () => {
		expect(validateUploadRequest('image/jpeg', 6 * 1024 * 1024)).toMatch(/5 MB/);
	});
});

describe('validateMediaAssetIds', () => {
	it('limits testimonial attachments', () => {
		const ids = Array.from({ length: MAX_FILES_PER_TESTIMONIAL + 1 }, (_, i) => `id-${i}`);
		expect(validateMediaAssetIds(ids)).toMatch(/up to/);
	});
});
