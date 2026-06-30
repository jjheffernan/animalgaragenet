import { fail, redirect } from '@sveltejs/kit';
import { createBuildLogDraft, updateBuildLog } from '$lib/server/build-logs/repository';
import { validateBuildLogFields } from '$lib/server/build-logs/validation';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	return { user };
};

function parseFields(data: FormData) {
	return {
		title: String(data.get('title') ?? '').trim(),
		year: String(data.get('year') ?? '').trim(),
		make: String(data.get('make') ?? '').trim(),
		model: String(data.get('model') ?? '').trim(),
		description: String(data.get('description') ?? '').trim(),
		modList: String(data.get('modList') ?? '').trim()
	};
}

export const actions: Actions = {
	saveDraft: async ({ request, locals }) => {
		const user = locals.session;
		if (!user) throw redirect(303, '/auth/sign-in?redirect=/account/builds/new');

		const fields = parseFields(await request.formData());
		const errors = validateBuildLogFields(fields);
		if (Object.keys(errors).length > 0) return fail(400, { errors, fields, intent: 'saveDraft' });

		const log = await createBuildLogDraft(user.id, user.email, {
			...fields,
			year: Number.parseInt(fields.year, 10)
		});

		throw redirect(303, `/account/builds/${log.id}`);
	},
	submit: async ({ request, locals }) => {
		const user = locals.session;
		if (!user) throw redirect(303, '/auth/sign-in?redirect=/account/builds/new');

		const fields = parseFields(await request.formData());
		const errors = validateBuildLogFields(fields, { requireComplete: true });
		if (Object.keys(errors).length > 0) return fail(400, { errors, fields, intent: 'submit' });

		const log = await createBuildLogDraft(user.id, user.email, {
			...fields,
			year: Number.parseInt(fields.year, 10)
		});
		await updateBuildLog(log.id, user.id, { ...fields, year: Number.parseInt(fields.year, 10) }, 'pending');

		return { success: true, message: 'Build log submitted for review.' };
	}
};
