-- Create enums for report types and status
create type public.report_type as enum ('pothole', 'flooding', 'debris', 'accident', 'other');
create type public.report_status as enum ('unverified', 'verified', 'resolved', 'rejected');

-- Create table for reports
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  description text,
  type public.report_type not null,
  location geography(point, 4326),
  latitude decimal(9, 6),
  longitude decimal(9, 6),
  status public.report_status default 'unverified',
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create updated_at trigger
create or replace function public.update_reports_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger update_reports_updated_at
before update on public.reports
for each row
execute function public.update_reports_updated_at();

-- Enable RLS
alter table public.reports enable row level security;

-- RLS Policies
create policy "Users can read all reports"
on public.reports
for select
using (true);

create policy "Users can insert own reports"
on public.reports
for insert
with check (auth.uid() = user_id);

create policy "Users can update own reports"
on public.reports
for update
using (auth.uid() = user_id);

create policy "Users can delete own reports"
on public.reports
for delete
using (auth.uid() = user_id);

-- Create index for faster queries
create index reports_user_id_idx on public.reports(user_id);
create index reports_status_idx on public.reports(status);
create index reports_created_at_idx on public.reports(created_at desc);