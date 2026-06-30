import { afterEach, describe, expect, it } from 'vitest';
import {
	_resetMockStoreForTests,
	createBuildLogDraft,
	getBuildLogForUser,
	listBuildLogsForUser,
	listPendingBuildLogs,
	moderateBuildLog,
	updateBuildLog
} from './repository';

const fields = {
	title: 'Track Civic',
	year: 2018,
	make: 'Honda',
	model: 'Civic',
	description: 'Full track build with coilovers, wheels, and aero upgrades.',
	modList: 'BC coilovers, Enkei RPF1'
};

describe('build-logs repository (mock fallback)', () => {
	afterEach(() => {
		_resetMockStoreForTests();
	});

	it('creates draft and lists for owner only', async () => {
		const draft = await createBuildLogDraft('user-1', 'one@example.com', fields);

		expect(draft.status).toBe('draft');
		expect(draft.userId).toBe('user-1');

		const mine = await listBuildLogsForUser('user-1');
		expect(mine).toHaveLength(1);
		expect(await getBuildLogForUser(draft.id, 'user-2')).toBeNull();
	});

	it('updates draft and submits as pending', async () => {
		const draft = await createBuildLogDraft('user-1', 'one@example.com', fields);

		const updated = await updateBuildLog(
			draft.id,
			'user-1',
			{ ...fields, title: 'Time Attack Civic' },
			'pending'
		);

		expect(updated?.title).toBe('Time Attack Civic');
		expect(updated?.status).toBe('pending');
		expect(await listPendingBuildLogs()).toHaveLength(1);
	});

	it('moderates pending logs with optional slug', async () => {
		const draft = await createBuildLogDraft('user-2', 'two@example.com', fields);
		await updateBuildLog(draft.id, 'user-2', fields, 'pending');

		expect(await moderateBuildLog(draft.id, 'approved', 'track-civic')).toBe(true);

		const approved = await getBuildLogForUser(draft.id, 'user-2');
		expect(approved?.status).toBe('approved');
		expect(approved?.slug).toBe('track-civic');
		expect(await listPendingBuildLogs()).toHaveLength(0);
	});
});
