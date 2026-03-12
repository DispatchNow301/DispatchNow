-- Create table for profiles

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  tier int default 1 check (tier in (1,2,3))
);

-- Function/Trigger to add to profiles from auth table in Supabase

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, tier)
  values (new.id, new.email, 1);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Enable RLS

alter table public.profiles enable row level security;

create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

create policy "Users can delete own profile"
on public.profiles
for delete
using (auth.uid() = id);



