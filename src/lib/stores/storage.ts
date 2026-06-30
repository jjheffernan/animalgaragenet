/** ponytail: shared guest persistence — session sync stays per-store */

export function readStoredJson<T>(key: string, fallback: T): T {
	if (typeof window === 'undefined') return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}

export function writeStoredJson(key: string, value: unknown): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(key, JSON.stringify(value));
}

export function removeStoredJson(key: string): void {
	if (typeof window === 'undefined') return;
	localStorage.removeItem(key);
}

export function readStoredString(key: string): string | null {
	if (typeof window === 'undefined') return null;
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

export function writeStoredString(key: string, value: string): void {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(key, value);
	} catch {
		// ignore quota / private mode
	}
}
