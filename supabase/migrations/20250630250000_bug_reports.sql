-- Public bug reports from /support/report-bug

create table public.bug_reports (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz not null default now(),
	email text,
	user_id uuid references auth.users (id) on delete set null,
	category text not null check (category in ('website', 'checkout', 'account', 'shop', 'other')),
	description text not null,
	steps text not null,
	page_url text,
	status text not null default 'open' check (status in ('open', 'triaged', 'resolved', 'closed'))
);

comment on table public.bug_reports is 'User-submitted site bugs from /support/report-bug';

create index bug_reports_status_idx on public.bug_reports (status);
create index bug_reports_created_at_idx on public.bug_reports (created_at desc);
create index bug_reports_user_id_idx on public.bug_reports (user_id) where user_id is not null;

alter table public.bug_reports enable row level security;

create policy "Public bug report insert"
	on public.bug_reports
	for insert
	to anon, authenticated
	with check (true);

create policy "Staff read bug reports"
	on public.bug_reports
	for select
	to authenticated
	using (public.is_staff());

create policy "Staff update bug reports"
	on public.bug_reports
	for update
	to authenticated
	using (public.is_staff())
	with check (public.is_staff());
