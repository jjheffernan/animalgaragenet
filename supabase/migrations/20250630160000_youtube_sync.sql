-- YouTube channel registry and synced video catalog (/watch)

create table public.youtube_channels (
	id uuid primary key default gen_random_uuid(),
	channel_id text not null unique,
	handle text not null,
	title text not null,
	last_synced_at timestamptz,
	created_at timestamptz not null default now()
);

comment on table public.youtube_channels is 'Connected YouTube channels for /watch sync jobs';
comment on column public.youtube_channels.channel_id is 'YouTube channel id (UC...) used by Data API v3';
comment on column public.youtube_channels.handle is 'Public @handle for admin UI';
comment on column public.youtube_channels.title is 'Channel title from YouTube';
comment on column public.youtube_channels.last_synced_at is 'Last successful syncToDatabase run';
comment on column public.youtube_channels.created_at is 'When the channel was connected';

create table public.videos (
	id uuid primary key default gen_random_uuid(),
	youtube_id text not null unique,
	channel_id text not null references public.youtube_channels (channel_id) on delete cascade,
	title text not null,
	description text,
	long_description text,
	thumbnail text,
	duration text,
	published_at timestamptz,
	linked_product_ids jsonb not null default '[]',
	updated_at timestamptz not null default now()
);

comment on table public.videos is 'Synced YouTube uploads for /watch and homepage video rails';
comment on column public.videos.youtube_id is 'YouTube video id; upsert conflict target for sync';
comment on column public.videos.channel_id is 'Parent channel channel_id';
comment on column public.videos.title is 'Video title from YouTube';
comment on column public.videos.description is 'Short description / snippet';
comment on column public.videos.long_description is 'Full description body when available';
comment on column public.videos.thumbnail is 'Highest-res thumbnail URL';
comment on column public.videos.duration is 'ISO 8601 duration from YouTube (e.g. PT12M34S)';
comment on column public.videos.published_at is 'YouTube publishedAt timestamp';
comment on column public.videos.linked_product_ids is 'JSON array of Saleor product ids linked in admin';
comment on column public.videos.updated_at is 'Last sync or admin edit timestamp';

create index videos_channel_id_idx on public.videos (channel_id);
create index videos_published_at_idx on public.videos (published_at desc nulls last);

alter table public.youtube_channels enable row level security;
alter table public.videos enable row level security;

-- Public catalog reads; writes via service role (sync cron / admin API)
create policy "Public read youtube channels"
	on public.youtube_channels
	for select
	to anon, authenticated
	using (true);

create policy "Public read videos"
	on public.videos
	for select
	to anon, authenticated
	using (true);

drop trigger if exists videos_set_updated_at on public.videos;

create trigger videos_set_updated_at
	before update on public.videos
	for each row
	execute function public.set_updated_at();
