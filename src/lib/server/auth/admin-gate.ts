import { canAccessAdmin, type Role } from '$lib/auth/roles';

/** Mirrors Supabase `public.is_staff()` — editor and admin via app_metadata.role. */
export type AdminGateResult = 'allow' | 'sign-in' | 'forbidden';

export interface AdminGateInput {
	hasSession: boolean;
	role: Role | null | undefined;
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
