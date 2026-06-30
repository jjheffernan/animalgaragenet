export const UGC_BUCKET = 'ugc';

export const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export type AllowedImageMime = (typeof ALLOWED_IMAGE_MIMES)[number];

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const MAX_FILES_PER_TESTIMONIAL = 4;

export const UPLOAD_URL_TTL_SECONDS = 60;
