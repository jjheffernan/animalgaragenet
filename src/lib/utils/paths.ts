import { resolve } from '$app/paths';

/** Typed-route wrapper for dynamic href strings (query params, CMS paths). */
export function resolvePath(path: string): string {
	return (resolve as (url: string) => string)(path);
}
