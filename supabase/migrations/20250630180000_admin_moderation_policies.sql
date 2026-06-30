-- Staff role helper + moderation policies (uses app_metadata.role, never user_metadata)

create or replace function public.is_staff()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
	select coalesce(
		(auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'),
		false
	);
$$;

comment on function public.is_staff() is 'True when JWT app_metadata.role is admin or editor (set via service role only)';

-- build_submissions moderation
create policy "Staff read all build submissions"
	on public.build_submissions
	for select
	to authenticated
	using (public.is_staff());

create policy "Staff update build submissions"
	on public.build_submissions
	for update
	to authenticated
	using (public.is_staff())
	with check (public.is_staff());

-- testimonials moderation
create policy "Staff read all testimonials"
	on public.testimonials
	for select
	to authenticated
	using (public.is_staff());

create policy "Staff update testimonials"
	on public.testimonials
	for update
	to authenticated
	using (public.is_staff())
	with check (public.is_staff());

-- newsletter admin
create policy "Staff read newsletter subscribers"
	on public.newsletter_subscribers
	for select
	to authenticated
	using (public.is_staff());

-- featured sections CMS
create policy "Staff manage featured sections"
	on public.featured_sections
	for all
	to authenticated
	using (public.is_staff())
	with check (public.is_staff());

-- order snapshots admin support
create policy "Staff read all order snapshots"
	on public.order_snapshots
	for select
	to authenticated
	using (public.is_staff());

-- UGC: public read for approved testimonial gallery
create policy "Public read media for approved testimonials"
	on public.media_assets
	for select
	to anon, authenticated
	using (
		status = 'ready'
		and exists (
			select 1
			from public.testimonial_media tm
			join public.testimonials t on t.id = tm.testimonial_id
			where tm.media_asset_id = media_assets.id
				and t.status = 'approved'
		)
	);

create policy "Staff read all media assets"
	on public.media_assets
	for select
	to authenticated
	using (public.is_staff());

create policy "Staff update media assets"
	on public.media_assets
	for update
	to authenticated
	using (public.is_staff())
	with check (public.is_staff());
