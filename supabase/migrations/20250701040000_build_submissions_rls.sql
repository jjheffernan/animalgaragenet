-- MR-SEC-001: block anon direct inserts; authenticated rows must match auth.uid()
drop policy if exists "Allow public build submission inserts" on public.build_submissions;

create policy "Authenticated users insert own build submissions"
	on public.build_submissions
	for insert
	to authenticated
	with check (auth.uid() = user_id);
