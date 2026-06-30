-- Pit Lane member deals scheduler (IP-030) — authenticated read, staff CRUD

create table public.pit_lane_deals (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	description text not null,
	discount_label text not null,
	product_ids jsonb not null default '[]',
	collection_id text,
	starts_at timestamptz,
	expires_at timestamptz,
	active boolean not null default true,
	sort_order int not null default 0,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

comment on table public.pit_lane_deals is 'Scheduled Pit Lane member deals surfaced on /deals';
comment on column public.pit_lane_deals.product_ids is 'JSON array of product ids for deal grids';
comment on column public.pit_lane_deals.starts_at is 'Optional publish start; null = immediately eligible when active';
comment on column public.pit_lane_deals.expires_at is 'Optional end; null = no expiry';

create index pit_lane_deals_active_idx on public.pit_lane_deals (active)
	where active = true;
create index pit_lane_deals_schedule_idx on public.pit_lane_deals (starts_at, expires_at);

alter table public.pit_lane_deals enable row level security;

create policy "Authenticated read active pit lane deals"
	on public.pit_lane_deals
	for select
	to authenticated
	using (active = true);

create policy "Staff manage pit lane deals"
	on public.pit_lane_deals
	for all
	to authenticated
	using (public.is_staff())
	with check (public.is_staff());

drop trigger if exists pit_lane_deals_set_updated_at on public.pit_lane_deals;

create trigger pit_lane_deals_set_updated_at
	before update on public.pit_lane_deals
	for each row
	execute function public.set_updated_at();
