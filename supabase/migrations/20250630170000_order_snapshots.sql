-- Saleor order mirror for /account order history (read-only cache)

create table public.order_snapshots (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references auth.users (id) on delete cascade,
	saleor_order_id text not null unique,
	order_number text not null,
	status text not null
		check (status in ('processing', 'shipped', 'delivered', 'cancelled')),
	total_cents integer not null check (total_cents >= 0),
	currency text not null default 'USD',
	tracking_number text,
	lines jsonb not null default '[]',
	ordered_at timestamptz not null,
	synced_at timestamptz not null default now()
);

comment on table public.order_snapshots is 'Cached Saleor orders for account dashboard; populated by server webhooks/sync';
comment on column public.order_snapshots.user_id is 'Account owner matched from Saleor customer email or id';
comment on column public.order_snapshots.saleor_order_id is 'Saleor order global id; upsert conflict target';
comment on column public.order_snapshots.order_number is 'Human-readable order number (e.g. AG-1042)';
comment on column public.order_snapshots.status is 'Fulfillment status mirrored from Saleor';
comment on column public.order_snapshots.total_cents is 'Order total in minor currency units';
comment on column public.order_snapshots.currency is 'ISO 4217 currency code';
comment on column public.order_snapshots.tracking_number is 'Carrier tracking number when shipped';
comment on column public.order_snapshots.lines is 'JSON array of line items: productName, variantName, quantity, unitPrice';
comment on column public.order_snapshots.ordered_at is 'Saleor order creation time';
comment on column public.order_snapshots.synced_at is 'Last mirror refresh from Saleor';

create index order_snapshots_user_id_idx on public.order_snapshots (user_id);
create index order_snapshots_ordered_at_idx on public.order_snapshots (ordered_at desc);

alter table public.order_snapshots enable row level security;

-- Account page: users read their own order history
create policy "Users read own order snapshots"
	on public.order_snapshots
	for select
	to authenticated
	using (auth.uid() = user_id);

-- Inserts/updates/deletes use SUPABASE_SERVICE_ROLE_KEY (Saleor webhook handler)
