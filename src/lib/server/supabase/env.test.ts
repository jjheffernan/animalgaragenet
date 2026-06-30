import { describe, expect, it } from 'vitest';
import { deriveSupabaseApiUrl, extractProjectRef, resolveSupabaseEnv } from './env';

describe('extractProjectRef', () => {
	it('parses db.<ref>.supabase.co', () => {
		expect(extractProjectRef('db.abcdefghijklmnop.supabase.co')).toBe('abcdefghijklmnop');
	});

	it('parses pooler username postgres.<ref>', () => {
		expect(extractProjectRef('aws-0-us-west-1.pooler.supabase.com', 'postgres.abcdefghijklmnop')).toBe(
			'abcdefghijklmnop'
		);
	});

	it('returns null for local docker host', () => {
		expect(extractProjectRef('127.0.0.1', 'postgres')).toBeNull();
	});
});

describe('deriveSupabaseApiUrl', () => {
	it('derives API URL from direct database connection string', () => {
		const url = deriveSupabaseApiUrl(
			'postgresql://postgres:secret@db.abcdefghijklmnop.supabase.co:5432/postgres'
		);
		expect(url).toBe('https://abcdefghijklmnop.supabase.co');
	});

	it('derives API URL from pooler connection string', () => {
		const url = deriveSupabaseApiUrl(
			'postgresql://postgres.abcdefghijklmnop:secret@aws-0-us-west-1.pooler.supabase.com:6543/postgres'
		);
		expect(url).toBe('https://abcdefghijklmnop.supabase.co');
	});

	it('prefers legacy PUBLIC_SUPABASE_URL when set', () => {
		const url = deriveSupabaseApiUrl(
			'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
			'http://127.0.0.1:54321'
		);
		expect(url).toBe('http://127.0.0.1:54321');
	});

	it('returns null when database URL has no recognizable ref and no legacy URL', () => {
		expect(deriveSupabaseApiUrl('postgresql://postgres:postgres@127.0.0.1:54322/postgres')).toBeNull();
	});
});

describe('resolveSupabaseEnv', () => {
	it('returns config when database URL and anon key are set', () => {
		expect(
			resolveSupabaseEnv({
				SUPABASE_DATABASE_URL:
					'postgresql://postgres:secret@db.abcdefghijklmnop.supabase.co:5432/postgres',
				SUPABASE_ANON_KEY: 'anon-key'
			})
		).toEqual({
			url: 'https://abcdefghijklmnop.supabase.co',
			anonKey: 'anon-key'
		});
	});

	it('returns null when anon key is missing', () => {
		expect(
			resolveSupabaseEnv({
				SUPABASE_DATABASE_URL:
					'postgresql://postgres:secret@db.abcdefghijklmnop.supabase.co:5432/postgres'
			})
		).toBeNull();
	});
});
