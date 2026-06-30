-- Core auth helpers, profiles, and staff role check
-- Squashed from: updated_at_helper, initial_profiles, profiles_signup_trigger, account_garage_xp (profiles columns)

-- Shared trigger helper for updated_at columns
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

comment on function public.set_updated_at() is 'Trigger helper: set updated_at to now() on row update';

-- Profiles — extends auth.users with app-specific fields.
-- Role for authorization lives in auth.users.raw_app_meta_data (set via service role or scripts).
create table public.profiles (
	id uuid primary key references auth.users (id) on delete cascade,
	display_name text,
	garage_xp integer not null default 0,
	garage_xp_actions jsonb not null default '[]',
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

comment on table public.profiles is 'App profile row per auth.users — display name and Garage Squad XP; roles live in auth.users.raw_app_meta_data';
comment on column public.profiles.id is 'Primary key; matches auth.users.id';
comment on column public.profiles.display_name is 'Public display name shown in account and UGC';
comment on column public.profiles.garage_xp is 'Garage Squad loyalty XP total';
comment on column public.profiles.garage_xp_actions is 'JSON array of completed action ids (dedupe)';
comment on column public.profiles.created_at is 'Row creation timestamp';
comment on column public.profiles.updated_at is 'Last profile edit timestamp';

alter table public.profiles enable row level security;

create policy "profiles_select_own"
	on public.profiles
	for select
	to authenticated
	using (auth.uid() = id);

create policy "profiles_update_own"
	on public.profiles
	for update
	to authenticated
	using (auth.uid() = id)
	with check (auth.uid() = id);

-- Auto-provision profiles on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
	insert into public.profiles (id, display_name)
	values (
		new.id,
		coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
	);
	return new;
end;
$$;

comment on function public.handle_new_user() is 'Trigger: insert profiles row when auth.users row is created';

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
	after insert on auth.users
	for each row
	execute function public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
	before update on public.profiles
	for each row
	execute function public.set_updated_at();

-- Staff role helper (uses app_metadata.role, never user_metadata)
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
