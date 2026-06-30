-- Footer / marketing newsletter signups (not commerce)

create table public.newsletter_subscribers (
	id uuid primary key default gen_random_uuid(),
	email text not null,
	locale text not null default 'en-US',
	source text not null default 'footer',
	subscribed_at timestamptz not null default now(),
	unsubscribed_at timestamptz,
	constraint newsletter_subscribers_email_unique unique (email)
);

comment on table public.newsletter_subscribers is 'Marketing newsletter opt-ins from footer and landing pages';
comment on column public.newsletter_subscribers.email is 'Subscriber email address (unique)';
comment on column public.newsletter_subscribers.locale is 'Locale at signup time (e.g. en-US)';
comment on column public.newsletter_subscribers.source is 'Signup surface: footer, homepage, checkout, etc.';
comment on column public.newsletter_subscribers.subscribed_at is 'When the subscriber opted in';
comment on column public.newsletter_subscribers.unsubscribed_at is 'When the subscriber opted out; null while active';

create index newsletter_subscribers_subscribed_at_idx on public.newsletter_subscribers (subscribed_at desc);

alter table public.newsletter_subscribers enable row level security;

-- Public signup form: allow insert only (no reads — prevents email harvesting)
create policy "Public newsletter signup"
	on public.newsletter_subscribers
	for insert
	to anon, authenticated
	with check (
		email is not null
		and length(trim(email)) > 3
		and unsubscribed_at is null
	);

-- Admin list/export uses SUPABASE_SERVICE_ROLE_KEY or staff policy in admin_moderation migration
