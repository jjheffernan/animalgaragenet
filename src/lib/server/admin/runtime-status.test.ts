import { describe, expect, it } from 'vitest';
import { getRuntimeStatus, listRuntimeCronTriggers } from './runtime-status';

describe('getRuntimeStatus', () => {
	it('returns boolean flags only', () => {
		const status = getRuntimeStatus();
		expect(typeof status.saleorEnabled).toBe('boolean');
		expect(typeof status.ghostEnabled).toBe('boolean');
		expect(typeof status.supabaseConfigured).toBe('boolean');
		expect(typeof status.mockGuardsActive).toBe('boolean');
		expect(typeof status.youtubeSyncConfigured).toBe('boolean');
		expect(typeof status.siteLocked).toBe('boolean');
	});
});

describe('listRuntimeCronTriggers', () => {
	it('includes youtube sync scaffold entry', () => {
		const triggers = listRuntimeCronTriggers();
		expect(triggers.some((t) => t.id === 'youtube-sync')).toBe(true);
		expect(triggers[0]?.path).toMatch(/^\/api\/cron\//);
	});
});
