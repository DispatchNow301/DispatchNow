-- Create enum for resource types
create type public.resource_type as enum ('water', 'blanket', 'food', 'medical', 'shelter', 'other');

-- Create table for resources
create table public.resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.resource_type not null,
  quantity int not null default 0 check (quantity >= 0),
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create updated_at trigger
create or replace function public.update_resources_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger update_resources_updated_at
before update on public.resources
for each row
execute function public.update_resources_updated_at();

-- Enable RLS
alter table public.resources enable row level security;

-- RLS Policies
create policy "Anyone can read resources"
on public.resources
for select
using (true);

create policy "Only Authority can insert resources"
on public.resources
for insert
with check (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and tier = 3
  )
);

create policy "Only Authority can update resources"
on public.resources
for update
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and tier = 3
  )
);

create policy "Only Authority can delete resources"
on public.resources
for delete
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and tier = 3
  )
);

-- Create indexes
create index resources_type_idx on public.resources(type);
create index resources_created_at_idx on public.resources(created_at desc);