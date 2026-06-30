-- Garage Squad member testimonials / reviews (moderation queue)
create table public.testimonials (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	user_id uuid not null references auth.users (id) on delete cascade,
	display_name text not null,
	vehicle_summary text,
	rating smallint not null check (rating >= 1 and rating <= 5),
	title text not null,
	body text not null,
	status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
	loyalty_tier text,
	approved_at timestamptz,
	featured boolean not null default false
);

create index testimonials_status_idx on public.testimonials (status);
create index testimonials_created_at_idx on public.testimonials (created_at desc);
create index testimonials_featured_idx on public.testimonials (featured)
	where featured = true;

alter table public.testimonials enable row level security;

-- Authenticated users may submit their own pending review
create policy "Users insert own testimonials"
	on public.testimonials
	for insert
	to authenticated
	with check (auth.uid() = user_id and status = 'pending');

-- Users can read their own submissions (any status)
create policy "Users read own testimonials"
	on public.testimonials
	for select
	to authenticated
	using (auth.uid() = user_id);

-- Anyone may read approved testimonials (public loyalty / homepage)
create policy "Public read approved testimonials"
	on public.testimonials
	for select
	to anon, authenticated
	using (status = 'approved');

-- Moderation reads/writes use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
