/** Cache-Control for Ghost-backed list routes (`/guides`, `/blog`). */
export const GHOST_LIST_CACHE_CONTROL =
	'public, max-age=300, s-maxage=300, stale-while-revalidate=600';

/** Cache-Control for Ghost-backed detail routes (`/guides/[slug]`, `/blog/[slug]`). */
export const GHOST_DETAIL_CACHE_CONTROL =
	'public, max-age=600, s-maxage=600, stale-while-revalidate=1800';

type SetHeaders = (headers: Record<string, string>) => void;

export function setGhostListCacheHeaders(setHeaders: SetHeaders): void {
	setHeaders({ 'cache-control': GHOST_LIST_CACHE_CONTROL });
}

export function setGhostDetailCacheHeaders(setHeaders: SetHeaders): void {
	setHeaders({ 'cache-control': GHOST_DETAIL_CACHE_CONTROL });
}
