import { json } from '@sveltejs/kit';
import { canAccessAdmin, type Role } from '$lib/auth/roles';

/** Mirrors Supabase `public.is_staff()` — editor and admin via app_metadata.role. */
export type AdminGateResult = 'allow' | 'sign-in' | 'forbidden';

export interface AdminGateInput {
	hasSession: boolean;
	role: Role | null | undefined;
	devAdmin: boolean;
}

export interface AdminGateLocals {
	session?: { role?: Role | null } | null;
	devAdmin: boolean;
}

export function resolveAdminGate(input: AdminGateInput): AdminGateResult {
	if (input.devAdmin || canAccessAdmin(input.role ?? null)) {
		return 'allow';
	}
	if (!input.hasSession) {
		return 'sign-in';
	}
	return 'forbidden';
}

export function resolveAdminGateFromLocals(locals: AdminGateLocals): AdminGateResult {
	return resolveAdminGate({
		hasSession: Boolean(locals.session),
		role: locals.session?.role,
		devAdmin: locals.devAdmin
	});
}

/** Returns a 403 JSON response when gate !== allow; null when allowed. */
export function adminGateJsonResponse(gate: AdminGateResult): Response | null {
	if (gate === 'allow') return null;
	return json({ error: gate === 'sign-in' ? 'Sign in required.' : 'Forbidden.' }, { status: 403 });
}
