-- Account social platform links (OAuth handles until provider keys ship)
-- RLS: existing user_preferences policies cover this column (auth.uid() = user_id).

alter table public.user_preferences
	add column if not exists social_connections jsonb not null default '{}';

comment on column public.user_preferences.social_connections is 'Per-platform linked handles keyed by platform id (instagram, youtube, tiktok, discord)';
