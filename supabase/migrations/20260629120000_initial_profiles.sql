-- Initial Supabase schema pattern for Animal Garage
-- Apply with: supabase db push (local) or supabase migration up (linked project)

-- Optional profiles table — extends auth.users with app-specific fields.
-- Role for authorization lives in auth.users.raw_app_meta_data (set via service role or triggers).

create table if not exists public.profiles (
	id uuid primary key references auth.users (id) on delete cascade,
	display_name text,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "profiles_select_own"
	on public.profiles
	for select
	to authenticated
	using (auth.uid() = id);

-- Users can update their own profile
create policy "profiles_update_own"
	on public.profiles
	for update
	to authenticated
	using (auth.uid() = id)
	with check (auth.uid() = id);

-- INSERT on signup: use a security definer trigger in a follow-up migration, e.g.:
--
-- create or replace function public.handle_new_user()
-- returns trigger
-- language plpgsql
-- security definer
-- set search_path = ''
-- as $$
-- begin
--   insert into public.profiles (id, display_name)
--   values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
--   return new;
-- end;
-- $$;
--
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute function public.handle_new_user();

-- Admin roles: set via service role only, never user_metadata:
--   update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"editor"}' where id = '...';
