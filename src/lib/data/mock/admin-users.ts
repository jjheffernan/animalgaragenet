	import type { Role } from '$lib/auth/roles';

export interface MockAdminUser {
	id: string;
	email: string;
	name: string;
	role: Role;
	createdAt: string;
	lastActive: string;
}

export const mockAdminUsers: MockAdminUser[] = [
	{
		id: 'u1',
		email: 'admin@animalgarage.net',
		name: 'Site Admin',
		role: 'admin',
		createdAt: '2025-01-15',
		lastActive: '2026-06-28'
	},
	{
		id: 'u2',
		email: 'editor@animalgarage.net',
		name: 'Content Editor',
		role: 'editor',
		createdAt: '2025-03-02',
		lastActive: '2026-06-27'
	},
	{
		id: 'u3',
		email: 'contributor@animalgarage.net',
		name: 'Build Contributor',
		role: 'contributor',
		createdAt: '2025-06-10',
		lastActive: '2026-06-25'
	},
	{
		id: 'u4',
		email: 'customer@example.com',
		name: 'Garage Fan',
		role: 'customer',
		createdAt: '2026-01-20',
		lastActive: '2026-06-29'
	}
];
