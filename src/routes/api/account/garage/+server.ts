import { json } from '@sveltejs/kit';
import {
	addGarageXp,
	getUserGarageState,
	saveUserVehicles
} from '$lib/server/user-preferences/repository';
import type { SavedVehicle } from '$lib/types/domain';
import type { RequestHandler } from './$types';

/**
 * Account garage sync — vehicles + Garage Squad XP.
 *
 * @inspiration-scaffold: intentional — replace localStorage garage/garage-xp stores;
 * see docs/plans/active/inspiration-polish-tracker.md#IP-009
 */
export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const state = await getUserGarageState(locals.session.id);
	return json(state);
};

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const vehicles = body.vehicles as SavedVehicle[] | undefined;
	if (!Array.isArray(vehicles)) {
		return json({ error: 'vehicles array required' }, { status: 400 });
	}

	const ok = await saveUserVehicles(locals.session.id, vehicles);
	if (!ok) {
		return json({ error: 'Unable to save vehicles' }, { status: 500 });
	}

	return json({ ok: true });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const amount = Number(body.amount ?? 0);
	const actionId = body.actionId ? String(body.actionId) : undefined;
	if (!Number.isFinite(amount) || amount <= 0) {
		return json({ error: 'Invalid XP amount' }, { status: 400 });
	}

	const state = await addGarageXp(locals.session.id, amount, actionId);
	if (!state) {
		return json({ error: 'Unable to award XP' }, { status: 500 });
	}

	return json(state);
};
