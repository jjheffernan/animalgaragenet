import { mockBuilds, getBuildBySlug as getMockBuildBySlug } from '#lib/data/mock/builds.ts';
import {
	listApprovedBuildLogs,
	getApprovedBuildLogBySlug
} from '#lib/server/build-logs/repository.ts';
import { createAdminClient } from '#lib/server/supabase/admin.ts';
import { buildLogToThread, buildLogsToThreads } from '#lib/server/builds/to-thread.ts';
import type { BuildThread } from '#lib/types/domain.ts';

export async function listPublicBuilds(): Promise<BuildThread[]> {
	const admin = createAdminClient();
	if (!admin) return mockBuilds;

	const logs = await listApprovedBuildLogs();
	if (logs.length === 0) return mockBuilds;

	return buildLogsToThreads(logs);
}

export async function getFeaturedPublicBuilds(limit = 3): Promise<BuildThread[]> {
	const admin = createAdminClient();
	if (!admin) return mockBuilds.filter((b) => b.featured).slice(0, limit);

	const logs = await listApprovedBuildLogs(limit);
	if (logs.length === 0) {
		return mockBuilds.filter((b) => b.featured).slice(0, limit);
	}

	return buildLogsToThreads(logs, limit);
}

export async function getPublicBuildBySlug(slug: string): Promise<BuildThread | null> {
	const admin = createAdminClient();
	if (!admin) return getMockBuildBySlug(slug) ?? null;

	const log = await getApprovedBuildLogBySlug(slug);
	if (!log) return getMockBuildBySlug(slug) ?? null;

	return buildLogToThread(log);
}
