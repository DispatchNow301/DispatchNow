-- Create enum for request status
create type public.request_status as enum ('pending', 'approved', 'rejected', 'fulfilled');

-- Create table for requests
create table public.requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  status public.request_status default 'pending',
  resource_type public.resource_type not null,
  quantity int not null check (quantity > 0),
  latitude decimal(9, 6),
  longitude decimal(9, 6),
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create updated_at trigger
create or replace function public.update_requests_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger update_requests_updated_at
before update on public.requests
for each row
execute function public.update_requests_updated_at();

-- Enable RLS
alter table public.requests enable row level security;

-- RLS Policies
create policy "Anyone can read requests"
on public.requests
for select
using (true);

create policy "Users can create own requests"
on public.requests
for insert
with check (auth.uid() = requester_id);

create policy "Requesters can update own requests"
on public.requests
for update
using (auth.uid() = requester_id);

create policy "Only Authority can approve/reject requests"
on public.requests
for update
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and tier = 3
  )
)
with check (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and tier = 3
  )
);

-- Create indexes
create index requests_requester_id_idx on public.requests(requester_id);
create index requests_status_idx on public.requests(status);
create index requests_resource_type_idx on public.requests(resource_type);
create index requests_created_at_idx on public.requests(created_at desc);