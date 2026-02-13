-- Create enums for incident status and priority
create type public.incident_status as enum ('active', 'paused', 'closed');
create type public.incident_priority as enum ('low', 'medium', 'high');

-- Create table for incidents
create table public.incidents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status public.incident_status default 'active',
  priority public.incident_priority default 'medium',
  report_id uuid references public.reports(id) on delete set null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  closed_at timestamp with time zone
);

-- Create updated_at trigger
create or replace function public.update_incidents_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger update_incidents_updated_at
before update on public.incidents
for each row
execute function public.update_incidents_updated_at();

-- Create closed_at trigger (set when status changes to closed)
create or replace function public.update_incidents_closed_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'closed' and old.status != 'closed' then
    new.closed_at = timezone('utc'::text, now());
  elsif new.status != 'closed' then
    new.closed_at = null;
  end if;
  return new;
end;
$$;

create trigger update_incidents_closed_at
before update on public.incidents
for each row
execute function public.update_incidents_closed_at();

-- Enable RLS
alter table public.incidents enable row level security;

-- RLS Policies
create policy "Anyone can read incidents"
on public.incidents
for select
using (true);

create policy "Authority can create incidents"
on public.incidents
for insert
with check (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and tier = 3
  )
);

create policy "Authority can update incidents"
on public.incidents
for update
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and tier = 3
  )
);

create policy "Authority can delete incidents"
on public.incidents
for delete
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and tier = 3
  )
);

-- Create indexes
create index incidents_status_idx on public.incidents(status);
create index incidents_priority_idx on public.incidents(priority);
create index incidents_report_id_idx on public.incidents(report_id);
create index incidents_created_by_idx on public.incidents(created_by);
create index incidents_created_at_idx on public.incidents(created_at desc);