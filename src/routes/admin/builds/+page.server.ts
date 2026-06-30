import { fail } from '@sveltejs/kit';
import { listPendingBuildLogs, moderateBuildLog } from '$lib/server/build-logs/repository';
import { paginateFromUrl } from '$lib/pagination';
import type { Actions, PageServerLoad } from './$types';

function slugify(title: string, year: number, make: string, model: string): string {
	return `${year}-${make}-${model}-${title}`
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 80);
}

export const load: PageServerLoad = async ({ url }) => {
	const allPending = await listPendingBuildLogs();
	const { items, pagination } = paginateFromUrl(url, allPending);
	return { pending: items, pagination };
};

export const actions: Actions = {
	approve: async ({ request }) => {
		const data = await request.formData();
		const id = String(data.get('id') ?? '');
		const title = String(data.get('title') ?? '');
		const year = Number(data.get('year'));
		const make = String(data.get('make') ?? '');
		const model = String(data.get('model') ?? '');
		if (!id) return fail(400, { error: 'Missing build log id' });

		const ok = await moderateBuildLog(id, 'approved', slugify(title, year, make, model));
		if (!ok) return fail(500, { error: 'Could not approve build log' });
		return { success: true };
	},
	reject: async ({ request }) => {
		const id = String((await request.formData()).get('id') ?? '');
		if (!id) return fail(400, { error: 'Missing build log id' });
		const ok = await moderateBuildLog(id, 'rejected');
		if (!ok) return fail(500, { error: 'Could not reject build log' });
		return { success: true };
	}
};
