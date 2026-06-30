-- Homepage featured sections and per-user preferences

create table public.featured_sections (
	id uuid primary key default gen_random_uuid(),
	section_key text not null unique,
	content jsonb not null default '{}',
	active boolean not null default true,
	updated_at timestamptz not null default now()
);

comment on table public.featured_sections is 'CMS-style homepage section payloads keyed by section_key (hero, collections, media)';
comment on column public.featured_sections.section_key is 'Stable key used by loaders: hero, collections, media, ugc, etc.';
comment on column public.featured_sections.content is 'JSON document hydrated by SvelteKit loaders';
comment on column public.featured_sections.active is 'When false, section is hidden from public reads';
comment on column public.featured_sections.updated_at is 'Last content publish timestamp';

create index featured_sections_active_idx on public.featured_sections (active)
	where active = true;

create table public.user_preferences (
	user_id uuid primary key references auth.users (id) on delete cascade,
	locale text not null default 'en-US',
	currency text not null default 'USD',
	favorites jsonb not null default '[]',
	updated_at timestamptz not null default now()
);

comment on table public.user_preferences is 'Per-user locale, currency, and saved favorites (not commerce cart)';
comment on column public.user_preferences.user_id is 'Owner; matches auth.users.id';
comment on column public.user_preferences.locale is 'Preferred locale code (e.g. en-US)';
comment on column public.user_preferences.currency is 'Preferred currency code (e.g. USD)';
comment on column public.user_preferences.favorites is 'JSON array of favorite product or content ids';
comment on column public.user_preferences.updated_at is 'Last preference change timestamp';

alter table public.featured_sections enable row level security;
alter table public.user_preferences enable row level security;

-- Public homepage: read active sections only
create policy "Public read active featured sections"
	on public.featured_sections
	for select
	to anon, authenticated
	using (active = true);

-- Users manage their own preferences (SELECT required for UPDATE per Postgres RLS)
create policy "Users read own preferences"
	on public.user_preferences
	for select
	to authenticated
	using (auth.uid() = user_id);

create policy "Users insert own preferences"
	on public.user_preferences
	for insert
	to authenticated
	with check (auth.uid() = user_id);

create policy "Users update own preferences"
	on public.user_preferences
	for update
	to authenticated
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);

drop trigger if exists featured_sections_set_updated_at on public.featured_sections;

create trigger featured_sections_set_updated_at
	before update on public.featured_sections
	for each row
	execute function public.set_updated_at();

drop trigger if exists user_preferences_set_updated_at on public.user_preferences;

create trigger user_preferences_set_updated_at
	before update on public.user_preferences
	for each row
	execute function public.set_updated_at();
