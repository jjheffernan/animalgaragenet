import { createAdminClient } from '$lib/server/supabase/admin';
import type { SavedVehicle } from '$lib/types/domain';

export interface UserGarageState {
	vehicles: SavedVehicle[];
	garageXp: number;
	completedActions: string[];
}

const mockGarage = new Map<string, UserGarageState>();

function defaultState(): UserGarageState {
	return { vehicles: [], garageXp: 0, completedActions: [] };
}

// @inspiration-scaffold: intentional — account garage sync; see docs/plans/active/inspiration-polish-tracker.md#IP-010
export async function getUserGarageState(userId: string): Promise<UserGarageState> {
	const admin = createAdminClient();
	if (!admin) {
		return mockGarage.get(userId) ?? defaultState();
	}

	const [prefsResult, profileResult] = await Promise.all([
		admin.from('user_preferences').select('vehicles').eq('user_id', userId).maybeSingle(),
		admin.from('profiles').select('garage_xp, garage_xp_actions').eq('id', userId).maybeSingle()
	]);

	const vehicles = Array.isArray(prefsResult.data?.vehicles)
		? (prefsResult.data.vehicles as SavedVehicle[])
		: [];
	const garageXp = Number(profileResult.data?.garage_xp ?? 0);
	const completedActions = Array.isArray(profileResult.data?.garage_xp_actions)
		? (profileResult.data.garage_xp_actions as string[])
		: [];

	return { vehicles, garageXp, completedActions };
}

export async function saveUserVehicles(userId: string, vehicles: SavedVehicle[]): Promise<boolean> {
	const admin = createAdminClient();
	if (!admin) {
		const state = mockGarage.get(userId) ?? defaultState();
		mockGarage.set(userId, { ...state, vehicles });
		return true;
	}

	const { error } = await admin
		.from('user_preferences')
		.upsert({ user_id: userId, vehicles }, { onConflict: 'user_id' });

	if (error) {
		console.error('user_preferences vehicles upsert failed:', error.message);
		return false;
	}
	return true;
}

// @inspiration-scaffold: intentional — wire garageXp.addXp server-side dedupe; see docs/plans/active/inspiration-polish-tracker.md#IP-009
export async function addGarageXp(
	userId: string,
	amount: number,
	actionId?: string
): Promise<UserGarageState | null> {
	const current = await getUserGarageState(userId);
	if (actionId && current.completedActions.includes(actionId)) return current;

	const completedActions = actionId
		? [...current.completedActions, actionId]
		: current.completedActions;
	const garageXp = current.garageXp + amount;
	const next = { ...current, garageXp, completedActions };

	const admin = createAdminClient();
	if (!admin) {
		mockGarage.set(userId, next);
		return next;
	}

	const { error } = await admin
		.from('profiles')
		.update({ garage_xp: garageXp, garage_xp_actions: completedActions })
		.eq('id', userId);

	if (error) {
		console.error('profiles garage_xp update failed:', error.message);
		return null;
	}
	return next;
}

/** Test helper */
export function _resetMockStoreForTests(): void {
	mockGarage.clear();
}
