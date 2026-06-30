-- Phase 1: UGC media assets (Supabase Storage bucket + metadata tables)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
	'ugc',
	'ugc',
	false,
	5242880,
	array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
	file_size_limit = excluded.file_size_limit,
	allowed_mime_types = excluded.allowed_mime_types;

create table public.media_assets (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz not null default now(),
	user_id uuid not null references auth.users (id) on delete cascade,
	bucket text not null default 'ugc',
	storage_path text not null unique,
	mime_type text not null,
	byte_size integer not null check (byte_size > 0 and byte_size <= 5242880),
	status text not null default 'pending'
		check (status in ('pending', 'ready', 'rejected')),
	width integer,
	height integer
);

create table public.testimonial_media (
	testimonial_id uuid not null references public.testimonials (id) on delete cascade,
	media_asset_id uuid not null references public.media_assets (id) on delete cascade,
	sort_order smallint not null default 0,
	primary key (testimonial_id, media_asset_id)
);

create index media_assets_user_id_idx on public.media_assets (user_id);
create index media_assets_status_idx on public.media_assets (status);

alter table public.media_assets enable row level security;
alter table public.testimonial_media enable row level security;

create policy "Users manage own media assets"
	on public.media_assets
	for all
	to authenticated
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);

create policy "Users manage own testimonial media links"
	on public.testimonial_media
	for all
	to authenticated
	using (
		exists (
			select 1
			from public.media_assets ma
			where ma.id = media_asset_id
				and ma.user_id = auth.uid()
		)
	)
	with check (
		exists (
			select 1
			from public.media_assets ma
			where ma.id = media_asset_id
				and ma.user_id = auth.uid()
		)
	);

create policy "Users upload own ugc objects"
	on storage.objects
	for insert
	to authenticated
	with check (
		bucket_id = 'ugc'
		and (storage.foldername(name))[1] = auth.uid()::text
	);

create policy "Users read own ugc objects"
	on storage.objects
	for select
	to authenticated
	using (
		bucket_id = 'ugc'
		and (storage.foldername(name))[1] = auth.uid()::text
	);

create policy "Users update own ugc objects"
	on storage.objects
	for update
	to authenticated
	using (
		bucket_id = 'ugc'
		and (storage.foldername(name))[1] = auth.uid()::text
	)
	with check (
		bucket_id = 'ugc'
		and (storage.foldername(name))[1] = auth.uid()::text
	);

create policy "Users delete own ugc objects"
	on storage.objects
	for delete
	to authenticated
	using (
		bucket_id = 'ugc'
		and (storage.foldername(name))[1] = auth.uid()::text
	);
