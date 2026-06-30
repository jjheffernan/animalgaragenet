-- Commerce mirrors, content CMS, forms, and account preferences
-- Squashed from: build_submissions, build_logs_account, testimonials, newsletter_subscribers,
-- content_metadata, youtube_sync, order_snapshots, admin_moderation_policies (non-media),
-- restock_alerts, wholesale_inquiries, account_garage_xp (user_preferences), bug_reports

-- User-submitted build logs from /builds/submit (moderation queue + account drafts)
create table public.build_submissions (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	user_id uuid references auth.users (id) on delete set null,
	title text not null,
	year smallint not null check (year >= 1900 and year <= 2099),
	make text not null,
	model text not null,
	email text not null,
	description text not null,
	mod_list text not null,
	status text not null default 'pending' check (status in ('draft', 'pending', 'approved', 'rejected')),
	slug text unique
);

create index build_submissions_status_idx on public.build_submissions (status);
create index build_submissions_created_at_idx on public.build_submissions (created_at desc);

alter table public.build_submissions enable row level security;

create policy "Allow public build submission inserts"
	on public.build_submissions
	for insert
	to anon, authenticated
	with check (true);

create policy "Users read own build logs"
	on public.build_submissions
	for select
	to authenticated
	using (auth.uid() = user_id);

create policy "Users update own build logs"
	on public.build_submissions
	for update
	to authenticated
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);

create policy "Staff read all build submissions"
	on public.build_submissions
	for select
	to authenticated
	using (public.is_staff());

create policy "Staff update build submissions"
	on public.build_submissions
	for update
	to authenticated
	using (public.is_staff())
	with check (public.is_staff());

-- Garage Squad member testimonials / reviews (moderation queue)
create table public.testimonials (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	user_id uuid not null references auth.users (id) on delete cascade,
	display_name text not null,
	vehicle_summary text,
	rating smallint not null check (rating >= 1 and rating <= 5),
	title text not null,
	body text not null,
	status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
	loyalty_tier text,
	approved_at timestamptz,
	featured boolean not null default false
);

create index testimonials_status_idx on public.testimonials (status);
create index testimonials_created_at_idx on public.testimonials (created_at desc);
create index testimonials_featured_idx on public.testimonials (featured)
	where featured = true;

alter table public.testimonials enable row level security;

create policy "Users insert own testimonials"
	on public.testimonials
	for insert
	to authenticated
	with check (auth.uid() = user_id and status = 'pending');

create policy "Users read own testimonials"
	on public.testimonials
	for select
	to authenticated
	using (auth.uid() = user_id);

create policy "Public read approved testimonials"
	on public.testimonials
	for select
	to anon, authenticated
	using (status = 'approved');

create policy "Staff read all testimonials"
	on public.testimonials
	for select
	to authenticated
	using (public.is_staff());

create policy "Staff update testimonials"
	on public.testimonials
	for update
	to authenticated
	using (public.is_staff())
	with check (public.is_staff());

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

create policy "Public newsletter signup"
	on public.newsletter_subscribers
	for insert
	to anon, authenticated
	with check (
		email is not null
		and length(trim(email)) > 3
		and unsubscribed_at is null
	);

create policy "Staff read newsletter subscribers"
	on public.newsletter_subscribers
	for select
	to authenticated
	using (public.is_staff());

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
	vehicles jsonb not null default '[]',
	social_connections jsonb not null default '{}',
	updated_at timestamptz not null default now()
);

comment on table public.user_preferences is 'Per-user locale, currency, favorites, saved vehicles, and social handles';
comment on column public.user_preferences.user_id is 'Owner; matches auth.users.id';
comment on column public.user_preferences.locale is 'Preferred locale code (e.g. en-US)';
comment on column public.user_preferences.currency is 'Preferred currency code (e.g. USD)';
comment on column public.user_preferences.favorites is 'JSON array of favorite product or content ids';
comment on column public.user_preferences.vehicles is 'JSON array of SavedVehicle objects synced from account garage';
comment on column public.user_preferences.social_connections is 'Per-platform linked handles keyed by platform id (instagram, youtube, tiktok, discord)';
comment on column public.user_preferences.updated_at is 'Last preference change timestamp';

alter table public.featured_sections enable row level security;
alter table public.user_preferences enable row level security;

create policy "Public read active featured sections"
	on public.featured_sections
	for select
	to anon, authenticated
	using (active = true);

create policy "Staff manage featured sections"
	on public.featured_sections
	for all
	to authenticated
	using (public.is_staff())
	with check (public.is_staff());

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

create policy "Users read own order snapshots"
	on public.order_snapshots
	for select
	to authenticated
	using (auth.uid() = user_id);

create policy "Staff read all order snapshots"
	on public.order_snapshots
	for select
	to authenticated
	using (public.is_staff());

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

create policy "Public restock alert signup"
	on public.restock_alerts
	for insert
	to anon, authenticated
	with check (
		email is not null
		and length(trim(email)) > 3
		and product_id is not null
	);

create policy "Staff read restock alerts"
	on public.restock_alerts
	for select
	to authenticated
	using (public.is_staff());

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

-- Public bug reports from /support/report-bug
create table public.bug_reports (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz not null default now(),
	email text,
	user_id uuid references auth.users (id) on delete set null,
	category text not null check (category in ('website', 'checkout', 'account', 'shop', 'other')),
	description text not null,
	steps text not null,
	page_url text,
	status text not null default 'open' check (status in ('open', 'triaged', 'resolved', 'closed'))
);

comment on table public.bug_reports is 'User-submitted site bugs from /support/report-bug';

create index bug_reports_status_idx on public.bug_reports (status);
create index bug_reports_created_at_idx on public.bug_reports (created_at desc);
create index bug_reports_user_id_idx on public.bug_reports (user_id) where user_id is not null;

alter table public.bug_reports enable row level security;

create policy "Public bug report insert"
	on public.bug_reports
	for insert
	to anon, authenticated
	with check (true);

create policy "Staff read bug reports"
	on public.bug_reports
	for select
	to authenticated
	using (public.is_staff());

create policy "Staff update bug reports"
	on public.bug_reports
	for update
	to authenticated
	using (public.is_staff())
	with check (public.is_staff());
