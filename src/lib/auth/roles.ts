export type Role = 'admin' | 'editor' | 'contributor' | 'customer';

export interface RoleDefinition {
	label: string;
	description: string;
	adminAccess: boolean;
	level: number;
}

export const ROLES: Record<Role, RoleDefinition> = {
	admin: {
		label: 'Admin',
		description: 'Full site access — users, media, CMS, settings',
		adminAccess: true,
		level: 4
	},
	editor: {
		label: 'Editor',
		description: 'Content and media management — no user admin',
		adminAccess: true,
		level: 3
	},
	contributor: {
		label: 'Contributor',
		description: 'Submit builds and UGC — moderation queue only',
		adminAccess: false,
		level: 2
	},
	customer: {
		label: 'Customer',
		description: 'Shop, account, garage — no admin panel',
		adminAccess: false,
		level: 1
	}
};

export const ROLE_OPTIONS = Object.entries(ROLES).map(([value, def]) => ({
	value: value as Role,
	...def
}));

export function hasRole(userRole: Role | null | undefined, required: Role | Role[]): boolean {
	if (!userRole) return false;
	const requiredRoles = Array.isArray(required) ? required : [required];
	if (requiredRoles.includes(userRole)) return true;

	const userLevel = ROLES[userRole]?.level ?? 0;
	const minRequired = Math.min(...requiredRoles.map((r) => ROLES[r]?.level ?? 0));
	return userLevel >= minRequired;
}

export function canAccessAdmin(userRole: Role | null | undefined): boolean {
	return hasRole(userRole, ['editor', 'admin']);
}

export function isValidRole(value: string): value is Role {
	return value in ROLES;
}
