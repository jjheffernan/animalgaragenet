import { listPendingBuildLogs } from '$lib/server/build-logs/repository';
import { listBugReports } from '$lib/server/support/repository';
import { listYouTubeChannels } from '$lib/server/youtube/repository';

export type DashboardActivityType = 'build' | 'bug' | 'youtube';

export interface DashboardActivityItem {
	at: string;
	type: DashboardActivityType;
	summary: string;
	href: string;
}

function formatWhen(iso: string): string {
	const date = new Date(iso);
	return Number.isNaN(date.getTime())
		? iso
		: date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

/** Recent admin events from existing sources — no dedicated activity table yet. */
export async function getDashboardActivity(limit = 8): Promise<DashboardActivityItem[]> {
	const items: DashboardActivityItem[] = [];

	const [pendingBuilds, reports, channels] = await Promise.all([
		listPendingBuildLogs(),
		listBugReports(5),
		listYouTubeChannels()
	]);

	if (pendingBuilds.length > 0) {
		const latest = pendingBuilds[pendingBuilds.length - 1]!;
		items.push({
			at: latest.createdAt,
			type: 'build',
			summary:
				pendingBuilds.length === 1
					? `Build pending review: "${latest.title}"`
					: `${pendingBuilds.length} builds pending review (latest: "${latest.title}")`,
			href: '/admin/builds'
		});
	}

	for (const report of reports) {
		items.push({
			at: report.createdAt,
			type: 'bug',
			summary: report.description,
			href: '/admin/bug-reports'
		});
	}

	const syncedChannels = channels
		.filter((channel) => channel.lastSyncedAt)
		.sort((a, b) => (b.lastSyncedAt ?? '').localeCompare(a.lastSyncedAt ?? ''));

	for (const channel of syncedChannels.slice(0, 2)) {
		items.push({
			at: channel.lastSyncedAt!,
			type: 'youtube',
			summary: `YouTube sync completed for ${channel.handle || channel.title}`,
			href: '/admin/youtube'
		});
	}

	return items
		.sort((a, b) => b.at.localeCompare(a.at))
		.slice(0, limit)
		.map((item) => ({ ...item, at: formatWhen(item.at) }));
}
