-- Account garage sync: saved vehicles + Garage Squad XP on profiles

alter table public.user_preferences
	add column if not exists vehicles jsonb not null default '[]';

comment on column public.user_preferences.vehicles is 'JSON array of SavedVehicle objects synced from account garage';

alter table public.profiles
	add column if not exists garage_xp integer not null default 0,
	add column if not exists garage_xp_actions jsonb not null default '[]';

comment on column public.profiles.garage_xp is 'Garage Squad loyalty XP total';
comment on column public.profiles.garage_xp_actions is 'JSON array of completed action ids (dedupe)';
