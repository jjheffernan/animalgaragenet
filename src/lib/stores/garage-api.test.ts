import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	addGarageXpToApi,
	loadGarageFromApi,
	resetGarageApiCache,
	saveVehiclesToApi
} from './garage-api';

describe('garage-api client', () => {
	beforeEach(() => {
		resetGarageApiCache();
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('loadGarageFromApi returns guest on 401', async () => {
		vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 401 }));
		expect(await loadGarageFromApi()).toBe('guest');
	});

	it('loadGarageFromApi dedupes concurrent fetches', async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify({ vehicles: [], garageXp: 0, completedActions: [] }), {
				status: 200
			})
		);
		const [a, b] = await Promise.all([loadGarageFromApi(), loadGarageFromApi()]);
		expect(a).toEqual(b);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it('saveVehiclesToApi PUTs vehicles array', async () => {
		vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
		const vehicles = [{ id: 'v1', year: 2020, make: 'Ford', model: 'Mustang' }];
		expect(await saveVehiclesToApi(vehicles)).toBe(true);
		expect(fetch).toHaveBeenCalledWith('/api/account/garage', {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ vehicles })
		});
	});

	it('addGarageXpToApi POSTs amount and clears cache', async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify({ vehicles: [], garageXp: 25, completedActions: ['newsletter'] }), {
				status: 200
			})
		);
		const state = await addGarageXpToApi(25, 'newsletter');
		expect(state?.garageXp).toBe(25);
		vi.mocked(fetch).mockClear();
		await loadGarageFromApi();
		expect(fetch).toHaveBeenCalledTimes(1);
	});
});
