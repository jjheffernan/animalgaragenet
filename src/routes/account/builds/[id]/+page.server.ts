import { error, fail, redirect } from '@sveltejs/kit';
import { getBuildLogForUser, updateBuildLog } from '$lib/server/build-logs/repository';
import {
	checkBuildSubmitRateLimit,
	isBuildSubmitHoneypotTripped
} from '$lib/server/build-logs/submit-guard';
import { validateBuildLogFields } from '$lib/server/build-logs/validation';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { user } = await parent();
	const log = await getBuildLogForUser(params.id, user.id);
	if (!log) error(404, 'Build log not found');
	return { log, user };
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
	saveDraft: async ({ request, params, locals }) => {
		const user = locals.session;
		if (!user) throw redirect(303, `/auth/sign-in?redirect=/account/builds/${params.id}`);

		const fields = parseFields(await request.formData());
		const errors = validateBuildLogFields(fields);
		if (Object.keys(errors).length > 0) return fail(400, { errors, intent: 'saveDraft' });

		const existing = await getBuildLogForUser(params.id, user.id);
		if (!existing || existing.status === 'pending' || existing.status === 'approved') {
			return fail(400, { errors: { form: 'Cannot save as draft in current status.' } });
		}

		const log = await updateBuildLog(
			params.id,
			user.id,
			{ ...fields, year: Number.parseInt(fields.year, 10) },
			'draft'
		);
		if (!log) return fail(404, { errors: { form: 'Build log not found' } });
		return { success: true, message: 'Draft saved.' };
	},
	submit: async ({ request, params, locals, getClientAddress }) => {
		const user = locals.session;
		if (!user) throw redirect(303, `/auth/sign-in?redirect=/account/builds/${params.id}`);

		const formData = await request.formData();
		if (isBuildSubmitHoneypotTripped(formData)) {
			return {
				success: true,
				message: 'Build log submitted for review.'
			};
		}
		const rateKey = user.id || getClientAddress();
		if (!checkBuildSubmitRateLimit(rateKey)) {
			return fail(429, { errors: { form: 'Too many submissions. Try again later.' } });
		}

		const fields = parseFields(formData);
		const errors = validateBuildLogFields(fields, { requireComplete: true });
		if (Object.keys(errors).length > 0) return fail(400, { errors, intent: 'submit' });

		const log = await updateBuildLog(
			params.id,
			user.id,
			{ ...fields, year: Number.parseInt(fields.year, 10) },
			'pending'
		);
		if (!log) return fail(404, { errors: { form: 'Build log not found' } });

		return {
			success: true,
			message:
				log.status === 'approved'
					? 'Edits submitted — pending admin approval before going live.'
					: 'Build log submitted for review.'
		};
	}
};
