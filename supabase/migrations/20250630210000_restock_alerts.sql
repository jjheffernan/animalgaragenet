-- PDP restock notifications (NotifyMeButton → Supabase)

create table public.restock_alerts (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz not null default now(),
	email text not null,
	product_id text not null,
	product_slug text,
	product_name text,
	variant_id text,
	user_id uuid references auth.users (id) on delete set null,
	notified_at timestamptz,
	constraint restock_alerts_email_product_unique unique (email, product_id)
);

comment on table public.restock_alerts is 'Back-in-stock email alerts from PDP Notify Me forms';
comment on column public.restock_alerts.product_id is 'Saleor product id or mock product id';
comment on column public.restock_alerts.notified_at is 'When alert email was sent; null while pending';

create index restock_alerts_product_id_idx on public.restock_alerts (product_id);
create index restock_alerts_pending_idx on public.restock_alerts (notified_at)
	where notified_at is null;

alter table public.restock_alerts enable row level security;

-- Public signup: insert only (no reads — prevents email harvesting)
create policy "Public restock alert signup"
	on public.restock_alerts
	for insert
	to anon, authenticated
	with check (
		email is not null
		and length(trim(email)) > 3
		and product_id is not null
	);

-- Staff export / fulfillment uses service role or staff policy
create policy "Staff read restock alerts"
	on public.restock_alerts
	for select
	to authenticated
	using (public.is_staff());
