-- Account-owned build logs: drafts, pending approval, published edits
alter table public.build_submissions
	add column if not exists updated_at timestamptz not null default now();

alter table public.build_submissions drop constraint if exists build_submissions_status_check;

alter table public.build_submissions
	add constraint build_submissions_status_check
	check (status in ('draft', 'pending', 'approved', 'rejected'));

-- Users can read and update their own build logs
create policy "Users read own build logs"
	on public.build_submissions
	for select
	to authenticated
	using (auth.uid() = user_id);

create policy "Users update own build logs"
	on public.build_submissions
	for update
	to authenticated
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);
