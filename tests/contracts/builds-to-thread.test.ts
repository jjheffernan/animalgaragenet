import { describe, expect, it } from 'vitest';
import { buildLogToThread, parseModList } from '$lib/server/builds/to-thread';
import type { BuildLog } from '$lib/types/build-log';

function buildLogFixture(overrides: Partial<BuildLog> = {}): BuildLog {
	return {
		id: 'log-1',
		userId: 'user-1',
		title: 'Track Civic',
		year: 2020,
		make: 'Honda',
		model: 'Civic',
		email: 'builder@example.com',
		description: 'Full track build.',
		modList: 'Coilovers\nWheels\nExhaust',
		status: 'approved',
		slug: 'track-civic',
		createdAt: '2026-01-01T00:00:00.000Z',
		updatedAt: '2026-01-02T00:00:00.000Z',
		...overrides
	};
}

describe('parseModList', () => {
	it('splits newline-separated mods', () => {
		expect(parseModList('Coilovers\nWheels')).toEqual(['Coilovers', 'Wheels']);
	});

	it('splits comma-separated mods', () => {
		expect(parseModList('Coilovers, Wheels')).toEqual(['Coilovers', 'Wheels']);
	});
});

describe('buildLogToThread', () => {
	it('maps approved build logs to BuildThread shape', () => {
		const thread = buildLogToThread(buildLogFixture(), { featured: true });

		expect(thread).toMatchObject({
			id: 'log-1',
			slug: 'track-civic',
			title: 'Track Civic',
			modList: ['Coilovers', 'Wheels', 'Exhaust'],
			featured: true,
			linkedProductIds: []
		});
		expect(thread.photos[0]).toContain('picsum.photos');
	});
});
