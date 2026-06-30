-- Shared trigger helper for updated_at columns

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

comment on function public.set_updated_at() is 'Trigger helper: set updated_at to now() on row update';
