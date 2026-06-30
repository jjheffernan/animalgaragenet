-- User-submitted build logs from /builds/submit (moderation queue)
create table public.build_submissions (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz not null default now(),
	user_id uuid references auth.users (id) on delete set null,
	title text not null,
	year smallint not null check (year >= 1900 and year <= 2099),
	make text not null,
	model text not null,
	email text not null,
	description text not null,
	mod_list text not null,
	status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
	slug text unique
);

create index build_submissions_status_idx on public.build_submissions (status);
create index build_submissions_created_at_idx on public.build_submissions (created_at desc);

alter table public.build_submissions enable row level security;

-- Public form: anonymous and signed-in users may INSERT (email collected in form).
create policy "Allow public build submission inserts"
	on public.build_submissions
	for insert
	to anon, authenticated
	with check (true);

-- No SELECT policy for anon/authenticated — submissions are moderation-only.
-- Reads use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS) or a future admin role policy.
