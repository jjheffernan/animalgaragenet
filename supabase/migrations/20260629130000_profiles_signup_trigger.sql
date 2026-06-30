-- Auto-provision profiles on signup (runs after initial_profiles creates public.profiles)

comment on table public.profiles is 'App profile row per auth.users — display name only; roles live in auth.users.raw_app_meta_data';
comment on column public.profiles.id is 'Primary key; matches auth.users.id';
comment on column public.profiles.display_name is 'Public display name shown in account and UGC';
comment on column public.profiles.created_at is 'Row creation timestamp';
comment on column public.profiles.updated_at is 'Last profile edit timestamp';

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
