import type { SavedVehicle } from '$lib/types/domain';

export interface GarageApiState {
	vehicles: SavedVehicle[];
	garageXp: number;
	completedActions: string[];
}

let fetchPromise: Promise<GarageApiState | 'guest'> | null = null;

/** Deduped GET — shared by garage + garage-xp stores. */
export function loadGarageFromApi(): Promise<GarageApiState | 'guest'> {
	if (!fetchPromise) {
		fetchPromise = (async () => {
			try {
				const res = await fetch('/api/account/garage');
				if (res.status === 401) return 'guest';
				if (!res.ok) return 'guest';
				return (await res.json()) as GarageApiState;
			} catch {
				return 'guest';
			}
		})();
	}
	return fetchPromise;
}

export function resetGarageApiCache(): void {
	fetchPromise = null;
}

export async function saveVehiclesToApi(vehicles: SavedVehicle[]): Promise<boolean> {
	try {
		const res = await fetch('/api/account/garage', {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ vehicles })
		});
		return res.ok;
	} catch {
		return false;
	}
}

export async function addGarageXpToApi(
	amount: number,
	actionId?: string
): Promise<GarageApiState | null> {
	try {
		const res = await fetch('/api/account/garage', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ amount, actionId })
		});
		if (!res.ok) return null;
		resetGarageApiCache();
		return (await res.json()) as GarageApiState;
	} catch {
		return null;
	}
}
