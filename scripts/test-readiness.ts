/**
 * Live read-only probes for external API readiness.
 *
 * Usage:
 *   npm run test:readiness
 *   npx tsx --env-file=.env scripts/test-readiness.ts
 *
 * Skips probes when required env vars are unset. Exits 1 if any probe fails.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { resolveSupabaseEnv } from '../src/lib/server/supabase/env';

function loadEnvFile(): void {
	const path = resolve(process.cwd(), '.env');
	if (!existsSync(path)) return;
	for (const line of readFileSync(path, 'utf8').split('\n')) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const m = trimmed.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
		if (m && !process.env[m[1]]) {
			process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
		}
	}
}

loadEnvFile();

type Status = 'pass' | 'fail' | 'skip';

export interface ProbeResult {
	id: string;
	status: Status;
	notes: string;
	requiredEnv: string[];
}

const OAUTH_PROVIDERS = ['google', 'discord', 'azure'] as const;

function env(name: string): string {
	return process.env[name]?.trim() ?? '';
}

function missing(...names: string[]): string[] {
	return names.filter((name) => !env(name));
}

function skip(id: string, notes: string, requiredEnv: string[]): ProbeResult {
	return { id, status: 'skip', notes, requiredEnv };
}

function pass(id: string, notes: string, requiredEnv: string[]): ProbeResult {
	return { id, status: 'pass', notes, requiredEnv };
}

function fail(id: string, notes: string, requiredEnv: string[]): ProbeResult {
	return { id, status: 'fail', notes, requiredEnv };
}

async function probeSupabaseAuth(): Promise<ProbeResult> {
	const requiredEnv = ['SUPABASE_DATABASE_URL', 'SUPABASE_ANON_KEY'];
	const unset = missing(...requiredEnv);
	if (unset.length) {
		return skip('supabase-auth', `Missing: ${unset.join(', ')}`, requiredEnv);
	}

	const cfg = resolveSupabaseEnv(process.env);
	if (!cfg) {
		return skip(
			'supabase-auth',
			'Could not derive API URL from SUPABASE_DATABASE_URL (set PUBLIC_SUPABASE_URL for local dev)',
			[...requiredEnv, 'PUBLIC_SUPABASE_URL (local dev fallback)']
		);
	}

	const url = cfg.url.replace(/\/$/, '');
	const anonKey = cfg.anonKey;

	try {
		const response = await fetch(`${url}/auth/v1/health`, {
			headers: { apikey: anonKey }
		});

		if (!response.ok) {
			return fail('supabase-auth', `Health check HTTP ${response.status}`, requiredEnv);
		}

		const body = (await response.json()) as { version?: string };
		return pass(
			'supabase-auth',
			body.version ? `Auth healthy (v${body.version})` : 'Auth health OK',
			requiredEnv
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return fail('supabase-auth', message, requiredEnv);
	}
}

async function probeSupabaseDb(): Promise<ProbeResult> {
	const requiredEnv = ['SUPABASE_DATABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
	const unset = missing(...requiredEnv);
	if (unset.length) {
		return skip('supabase-db', `Missing: ${unset.join(', ')}`, requiredEnv);
	}

	const cfg = resolveSupabaseEnv(process.env);
	if (!cfg) {
		return skip(
			'supabase-db',
			'Could not derive API URL from SUPABASE_DATABASE_URL (set PUBLIC_SUPABASE_URL for local dev)',
			[...requiredEnv, 'PUBLIC_SUPABASE_URL (local dev fallback)']
		);
	}

	const admin = createClient(cfg.url, env('SUPABASE_SERVICE_ROLE_KEY'), {
		auth: { persistSession: false, autoRefreshToken: false }
	});

	const { error } = await admin.from('testimonials').select('id').limit(0);

	if (error) {
		return fail('supabase-db', error.message, requiredEnv);
	}

	return pass('supabase-db', 'testimonials table reachable (select limit 0)', requiredEnv);
}

async function saleorGraphql<T>(
	query: string,
	variables: Record<string, unknown> = {}
): Promise<{ data?: T; errors?: Array<{ message: string }> }> {
	const url = env('PUBLIC_SALEOR_API_URL');
	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query, variables })
	});

	if (!response.ok) {
		return { errors: [{ message: `HTTP ${response.status}` }] };
	}

	return response.json() as Promise<{ data?: T; errors?: Array<{ message: string }> }>;
}

export async function probeSaleorCatalog(): Promise<ProbeResult> {
	const requiredEnv = ['PUBLIC_SALEOR_API_URL', 'SALEOR_CHANNEL'];
	const unset = missing('PUBLIC_SALEOR_API_URL');
	if (unset.length) {
		return skip('saleor-catalog', `Missing: ${unset.join(', ')}`, requiredEnv);
	}

	const channel = env('SALEOR_CHANNEL') || 'default-channel';
	const result = await saleorGraphql<{
		products?: { edges: Array<{ node: { name: string } }> };
	}>(
		`query Products($channel: String!, $first: Int!) {
			products(channel: $channel, first: $first) {
				edges { node { name } }
			}
		}`,
		{ channel, first: 1 }
	);

	if (result.errors?.length) {
		return fail('saleor-catalog', result.errors.map((e) => e.message).join('; '), requiredEnv);
	}

	const count = result.data?.products?.edges.length ?? 0;
	return pass(
		'saleor-catalog',
		count > 0 ? `Products query OK (${count} row)` : 'Products query OK (empty catalog)',
		requiredEnv
	);
}

export async function probeSaleorCheckout(): Promise<ProbeResult> {
	const requiredEnv = ['PUBLIC_SALEOR_API_URL', 'SALEOR_CHANNEL'];
	const unset = missing('PUBLIC_SALEOR_API_URL');
	if (unset.length) {
		return skip('saleor-checkout', `Missing: ${unset.join(', ')}`, requiredEnv);
	}

	const channelSlug = env('SALEOR_CHANNEL') || 'default-channel';
	const result = await saleorGraphql<{
		channel?: { id: string; name: string; slug: string } | null;
	}>(
		`query Channel($slug: String!) {
			channel(slug: $slug) { id name slug currencyCode }
		}`,
		{ slug: channelSlug }
	);

	if (result.errors?.length) {
		return fail('saleor-checkout', result.errors.map((e) => e.message).join('; '), requiredEnv);
	}

	if (!result.data?.channel) {
		return fail('saleor-checkout', `Channel "${channelSlug}" not found`, requiredEnv);
	}

	return pass(
		'saleor-checkout',
		`Channel "${result.data.channel.name}" (${result.data.channel.slug}) ready`,
		requiredEnv
	);
}

async function probeGhostCms(): Promise<ProbeResult> {
	const requiredEnv = ['GHOST_URL', 'GHOST_CONTENT_API_KEY'];
	const unset = missing(...requiredEnv);
	if (unset.length) {
		return skip('ghost-cms', `Missing: ${unset.join(', ')}`, requiredEnv);
	}

	const base = env('GHOST_URL').replace(/\/$/, '');
	const url = new URL(`${base}/ghost/api/content/posts/`);
	url.searchParams.set('key', env('GHOST_CONTENT_API_KEY'));
	url.searchParams.set('limit', '1');

	try {
		const response = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
		if (!response.ok) {
			return fail('ghost-cms', `HTTP ${response.status} ${response.statusText}`, requiredEnv);
		}

		const body = (await response.json()) as { posts?: unknown[] };
		const count = body.posts?.length ?? 0;
		return pass('ghost-cms', `Posts list OK (${count} post)`, requiredEnv);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return fail('ghost-cms', message, requiredEnv);
	}
}

async function probeYoutubeSync(): Promise<ProbeResult> {
	const requiredEnv = ['YOUTUBE_API_KEY'];
	const unset = missing('YOUTUBE_API_KEY');
	if (unset.length) {
		return skip('youtube-sync', `Missing: ${unset.join(', ')}`, requiredEnv);
	}

	const channelId = 'UC_x5XG1OV2P6uZZ5FSM9Ttw';
	const url = new URL('https://www.googleapis.com/youtube/v3/channels');
	url.searchParams.set('part', 'snippet');
	url.searchParams.set('id', channelId);
	url.searchParams.set('key', env('YOUTUBE_API_KEY'));

	try {
		const response = await fetch(url.toString());
		const body = (await response.json()) as {
			error?: { message: string };
			items?: Array<{ id: string }>;
		};

		if (!response.ok || body.error) {
			return fail('youtube-sync', body.error?.message ?? `HTTP ${response.status}`, requiredEnv);
		}

		if (!body.items?.length) {
			return fail('youtube-sync', 'channels.list returned no items', requiredEnv);
		}

		return pass('youtube-sync', `channels.list OK (${body.items[0].id})`, requiredEnv);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return fail('youtube-sync', message, requiredEnv);
	}
}

async function probeOAuthProvider(
	provider: (typeof OAUTH_PROVIDERS)[number]
): Promise<ProbeResult> {
	const id = `oauth-${provider}`;
	const requiredEnv = ['SUPABASE_DATABASE_URL', 'SUPABASE_ANON_KEY'];
	const unset = missing(...requiredEnv);
	if (unset.length) {
		return skip(id, `Missing: ${unset.join(', ')}`, [
			...requiredEnv,
			'Supabase dashboard OAuth config'
		]);
	}

	const cfg = resolveSupabaseEnv(process.env);
	if (!cfg) {
		return skip(
			id,
			'Could not derive API URL from SUPABASE_DATABASE_URL (set PUBLIC_SUPABASE_URL for local dev)',
			[...requiredEnv, 'PUBLIC_SUPABASE_URL (local dev fallback)']
		);
	}

	const url = cfg.url.replace(/\/$/, '');
	const anonKey = cfg.anonKey;

	try {
		const response = await fetch(`${url}/auth/v1/settings`, {
			headers: { apikey: anonKey }
		});

		if (!response.ok) {
			return fail(id, `Settings HTTP ${response.status}`, requiredEnv);
		}

		const body = (await response.json()) as {
			external?: Record<string, boolean>;
		};

		const enabled = body.external?.[provider] === true;
		if (!enabled) {
			return fail(id, `${provider} provider not enabled in Supabase Auth`, requiredEnv);
		}

		return pass(id, `${provider} enabled in Auth settings`, requiredEnv);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return fail(id, message, requiredEnv);
	}
}

async function probeCdnS3(): Promise<ProbeResult> {
	const requiredEnv = ['PUBLIC_CDN_BASE_URL', 'S3_BUCKET', 'S3_REGION'];
	const unset = missing(...requiredEnv);
	if (unset.length) {
		return skip('cdn-s3', `Missing: ${unset.join(', ')} (integration not wired)`, requiredEnv);
	}

	const cdnUrl = env('PUBLIC_CDN_BASE_URL').replace(/\/$/, '');

	try {
		const response = await fetch(cdnUrl, { method: 'HEAD', redirect: 'follow' });
		if (!response.ok && response.status !== 403) {
			return fail('cdn-s3', `CDN HEAD HTTP ${response.status}`, requiredEnv);
		}

		const awsUnset = missing('AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY');
		const awsNote = awsUnset.length
			? `CDN reachable; S3 credentials unset (${awsUnset.join(', ')})`
			: 'CDN reachable; S3 credentials present (upload path not wired in app)';

		return pass('cdn-s3', awsNote, requiredEnv);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return fail('cdn-s3', message, requiredEnv);
	}
}

function probeNetlifyDeploy(): ProbeResult {
	const requiredEnv = ['ORG_REPO_DEPLOY_KEY'];
	const unset = missing('ORG_REPO_DEPLOY_KEY');
	if (unset.length) {
		return skip(
			'netlify-deploy',
			'Manual GitHub Actions workflow — verify org mirror sync after merge',
			requiredEnv
		);
	}

	return pass('netlify-deploy', 'ORG_REPO_DEPLOY_KEY set (workflow not probed)', requiredEnv);
}

export async function runReadinessProbes(): Promise<ProbeResult[]> {
	return [
		await probeSupabaseAuth(),
		await probeSupabaseDb(),
		await probeSaleorCatalog(),
		await probeSaleorCheckout(),
		await probeGhostCms(),
		await probeYoutubeSync(),
		...(await Promise.all(OAUTH_PROVIDERS.map((p) => probeOAuthProvider(p)))),
		await probeCdnS3(),
		probeNetlifyDeploy()
	];
}

function printResults(results: ProbeResult[]): void {
	const icon: Record<Status, string> = { pass: '✓', fail: '✗', skip: '○' };

	console.log('\nExternal API readiness\n');
	for (const result of results) {
		console.log(
			`  ${icon[result.status]} ${result.id.padEnd(18)} ${result.status.toUpperCase().padEnd(5)} ${result.notes}`
		);
	}

	const passed = results.filter((r) => r.status === 'pass').length;
	const failed = results.filter((r) => r.status === 'fail').length;
	const skipped = results.filter((r) => r.status === 'skip').length;

	console.log(
		`\n${passed} passed, ${failed} failed, ${skipped} skipped (${results.length} total)\n`
	);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
	const results = await runReadinessProbes();
	printResults(results);

	if (results.some((r) => r.status === 'fail')) {
		process.exit(1);
	}
}
