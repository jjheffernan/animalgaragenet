import { createAdminClient } from '$lib/server/supabase/admin';
import type { BuildLog, BuildLogStatus } from '$lib/types/build-log';

const mockStore = new Map<string, BuildLog>();

function rowToLog(row: Record<string, unknown>): BuildLog {
	return {
		id: String(row.id),
		userId: String(row.user_id),
		title: String(row.title),
		year: Number(row.year),
		make: String(row.make),
		model: String(row.model),
		email: String(row.email),
		description: String(row.description),
		modList: String(row.mod_list),
		status: row.status as BuildLogStatus,
		slug: row.slug ? String(row.slug) : null,
		createdAt: String(row.created_at),
		updatedAt: String(row.updated_at ?? row.created_at)
	};
}

function mockLog(userId: string, email: string, fields: Omit<BuildLog, 'id' | 'userId' | 'email' | 'createdAt' | 'updatedAt'>): BuildLog {
	const now = new Date().toISOString();
	const id = crypto.randomUUID();
	const log: BuildLog = {
		id,
		userId,
		email,
		createdAt: now,
		updatedAt: now,
		...fields
	};
	mockStore.set(id, log);
	return log;
}

export async function listBuildLogsForUser(userId: string): Promise<BuildLog[]> {
	const admin = createAdminClient();
	if (!admin) {
		return [...mockStore.values()].filter((l) => l.userId === userId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
	}

	const { data, error } = await admin
		.from('build_submissions')
		.select('*')
		.eq('user_id', userId)
		.order('updated_at', { ascending: false });

	if (error || !data) return [];
	return data.map(rowToLog);
}

export async function getBuildLogForUser(id: string, userId: string): Promise<BuildLog | null> {
	const admin = createAdminClient();
	if (!admin) {
		const log = mockStore.get(id);
		return log?.userId === userId ? log : null;
	}

	const { data, error } = await admin.from('build_submissions').select('*').eq('id', id).eq('user_id', userId).maybeSingle();
	if (error || !data) return null;
	return rowToLog(data);
}

export async function createBuildLogDraft(
	userId: string,
	email: string,
	fields: {
		title: string;
		year: number;
		make: string;
		model: string;
		description: string;
		modList: string;
	}
): Promise<BuildLog> {
	const admin = createAdminClient();
	if (!admin) {
		return mockLog(userId, email, { ...fields, status: 'draft', slug: null });
	}

	const { data, error } = await admin
		.from('build_submissions')
		.insert({
			user_id: userId,
			email,
			title: fields.title,
			year: fields.year,
			make: fields.make,
			model: fields.model,
			description: fields.description,
			mod_list: fields.modList,
			status: 'draft',
			slug: null
		})
		.select('*')
		.single();

	if (error || !data) throw new Error(error?.message ?? 'Failed to create build log');
	return rowToLog(data);
}

export async function updateBuildLog(
	id: string,
	userId: string,
	fields: {
		title: string;
		year: number;
		make: string;
		model: string;
		description: string;
		modList: string;
	},
	status: BuildLogStatus
): Promise<BuildLog | null> {
	const admin = createAdminClient();
	if (!admin) {
		const existing = mockStore.get(id);
		if (!existing || existing.userId !== userId) return null;
		const updated: BuildLog = {
			...existing,
			...fields,
			status,
			updatedAt: new Date().toISOString()
		};
		mockStore.set(id, updated);
		return updated;
	}

	const { data, error } = await admin
		.from('build_submissions')
		.update({
			title: fields.title,
			year: fields.year,
			make: fields.make,
			model: fields.model,
			description: fields.description,
			mod_list: fields.modList,
			status,
			updated_at: new Date().toISOString()
		})
		.eq('id', id)
		.eq('user_id', userId)
		.select('*')
		.single();

	if (error || !data) return null;
	return rowToLog(data);
}

export async function listPendingBuildLogs(): Promise<BuildLog[]> {
	const admin = createAdminClient();
	if (!admin) {
		return [...mockStore.values()].filter((l) => l.status === 'pending').sort((a, b) => a.createdAt.localeCompare(b.createdAt));
	}

	const { data, error } = await admin
		.from('build_submissions')
		.select('*')
		.eq('status', 'pending')
		.order('created_at', { ascending: true });

	if (error || !data) return [];
	return data.map(rowToLog);
}

export async function moderateBuildLog(
	id: string,
	decision: 'approved' | 'rejected',
	slug?: string
): Promise<boolean> {
	const admin = createAdminClient();
	if (!admin) {
		const log = mockStore.get(id);
		if (!log) return false;
		log.status = decision;
		if (decision === 'approved' && slug) log.slug = slug;
		log.updatedAt = new Date().toISOString();
		mockStore.set(id, log);
		return true;
	}

	const patch: Record<string, unknown> = {
		status: decision,
		updated_at: new Date().toISOString()
	};
	if (decision === 'approved' && slug) patch.slug = slug;

	const { error } = await admin.from('build_submissions').update(patch).eq('id', id);
	return !error;
}
