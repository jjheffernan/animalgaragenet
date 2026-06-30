import type { BuildLog } from '$lib/types/build-log';
import type { BuildThread } from '$lib/types/domain';

export function parseModList(raw: string): string[] {
	return raw
		.split(/\n|,/)
		.map((line) => line.trim())
		.filter(Boolean);
}

/** Map an approved build_submissions row to the public BuildThread shape. */
export function buildLogToThread(log: BuildLog, options: { featured?: boolean } = {}): BuildThread {
	if (!log.slug) {
		throw new Error('Approved build log must have a slug');
	}

	return {
		id: log.id,
		slug: log.slug,
		title: log.title,
		year: log.year,
		make: log.make,
		model: log.model,
		photos: [`https://picsum.photos/seed/ag-build-${log.id}/1200/800`],
		modList: parseModList(log.modList),
		featured: options.featured ?? false,
		description: log.description,
		linkedProductIds: []
	};
}

export function buildLogsToThreads(logs: BuildLog[], featuredCount = 0): BuildThread[] {
	return logs.map((log, index) => buildLogToThread(log, { featured: index < featuredCount }));
}
