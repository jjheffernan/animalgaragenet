-- Wholesale application workflow (/wholesale form)

create table public.wholesale_inquiries (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz not null default now(),
	business_name text not null,
	contact_name text not null,
	email text not null,
	phone text,
	website text,
	message text not null,
	status text not null default 'pending' check (status in ('pending', 'reviewing', 'approved', 'rejected'))
);

comment on table public.wholesale_inquiries is 'B2B wholesale applications from /wholesale';

create index wholesale_inquiries_status_idx on public.wholesale_inquiries (status);
create index wholesale_inquiries_created_at_idx on public.wholesale_inquiries (created_at desc);

alter table public.wholesale_inquiries enable row level security;

create policy "Public wholesale inquiry insert"
	on public.wholesale_inquiries
	for insert
	to anon, authenticated
	with check (true);

create policy "Staff read wholesale inquiries"
	on public.wholesale_inquiries
	for select
	to authenticated
	using (public.is_staff());

create policy "Staff update wholesale inquiries"
	on public.wholesale_inquiries
	for update
	to authenticated
	using (public.is_staff())
	with check (public.is_staff());
