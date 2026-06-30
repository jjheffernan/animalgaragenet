import type { Role } from '$lib/auth/roles';

export interface LocalDevAccount {
	email: string;
	label: string;
	role: Role;
}

/** Predefined local-only accounts — no passwords in repo. */
export const LOCAL_DEV_ACCOUNTS: readonly LocalDevAccount[] = [
	{ email: 'admin@local.dev', label: 'Admin', role: 'admin' },
	{ email: 'editor@local.dev', label: 'Editor', role: 'editor' },
	{ email: 'customer@local.dev', label: 'Customer', role: 'customer' }
] as const;

export function findLocalDevAccount(email: string): LocalDevAccount | undefined {
	return LOCAL_DEV_ACCOUNTS.find((a) => a.email === email);
}
