-- Vigilante: cloud game saves + multiplayer session tables
-- GameState (StreetMapScene) includes: level, incidents, resourcePool, ownedVigilanteIds, etc.
-- Resources live inside state JSON; no separate resource table required unless you normalize later.

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Cloud saves: one row per authenticated user per slot (1–3)
-- state: full GameState JSON (resourcePool, incidents, recruitLeads, …)
-- ---------------------------------------------------------------------------
create table public.game_saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  slot_index smallint not null check (slot_index between 1 and 3),
  title text not null default 'Save',
  -- Full persisted map state; bump schema_version when breaking changes occur in the client.
  state jsonb not null default '{}'::jsonb,
  schema_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slot_index)
);

create index game_saves_user_updated_idx on public.game_saves (user_id, updated_at desc);

create trigger game_saves_set_updated_at
  before update on public.game_saves
  for each row
  execute procedure public.set_updated_at();

comment on table public.game_saves is
  'Cloud save slots; state mirrors localStorage GameState from StreetMapScene (resourcePool, careerStats, purchasedBuffIds, …).';

-- ---------------------------------------------------------------------------
-- Multiplayer: host-created room + members (for future realtime sync)
-- ---------------------------------------------------------------------------
create table public.multiplayer_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null
    check (char_length(room_code) >= 4 and char_length(room_code) <= 8),
  host_user_id uuid not null references auth.users (id) on delete cascade,
  -- Optional link to the host''s cloud save used as session seed / roster source
  host_game_save_id uuid references public.game_saves (id) on delete set null,
  status text not null default 'open'
    check (status in ('open', 'active', 'closed')),
  -- Shared session payload (positions, incidents, pooled resources, etc.) — evolve as needed
  session_state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (room_code)
);

create index multiplayer_rooms_host_idx on public.multiplayer_rooms (host_user_id);
create index multiplayer_rooms_status_idx on public.multiplayer_rooms (status);

create trigger multiplayer_rooms_set_updated_at
  before update on public.multiplayer_rooms
  for each row
  execute procedure public.set_updated_at();

create table public.multiplayer_room_members (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.multiplayer_rooms (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'participant' check (role in ('host', 'participant')),
  joined_at timestamptz not null default now(),
  unique (room_id, user_id)
);

create index multiplayer_room_members_user_idx on public.multiplayer_room_members (user_id);
create index multiplayer_room_members_room_idx on public.multiplayer_room_members (room_id);

comment on table public.multiplayer_rooms is
  'Matchmaking / shared state for multiplayer; pair with Realtime or polling.';
comment on column public.multiplayer_rooms.session_state is
  'Authoritative or merged game state for the room; structure aligns with client multiplayer sync layer.';

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.game_saves enable row level security;
alter table public.multiplayer_rooms enable row level security;
alter table public.multiplayer_room_members enable row level security;

-- game_saves: only the owner
create policy "Users manage own game_saves"
  on public.game_saves
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- multiplayer_rooms: host full access; members can read
create policy "Hosts manage their multiplayer_rooms"
  on public.multiplayer_rooms
  for all
  to authenticated
  using (auth.uid() = host_user_id)
  with check (auth.uid() = host_user_id);

create policy "Members can view multiplayer_rooms"
  on public.multiplayer_rooms
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.multiplayer_room_members m
      where m.room_id = multiplayer_rooms.id
        and m.user_id = auth.uid()
    )
  );

-- Members: own row, or any row in a room you belong to (lobby UI)
create policy "Users see own room memberships"
  on public.multiplayer_room_members
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Members see others in same room"
  on public.multiplayer_room_members
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.multiplayer_room_members m2
      where m2.room_id = multiplayer_room_members.room_id
        and m2.user_id = auth.uid()
    )
  );

create policy "Hosts see members in their rooms"
  on public.multiplayer_room_members
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.multiplayer_rooms r
      where r.id = multiplayer_room_members.room_id
        and r.host_user_id = auth.uid()
    )
  );

create policy "Hosts add room members"
  on public.multiplayer_room_members
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.multiplayer_rooms r
      where r.id = room_id
        and r.host_user_id = auth.uid()
    )
  );

create policy "Users join room (self insert as participant)"
  on public.multiplayer_room_members
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and role = 'participant'
    and exists (
      select 1
      from public.multiplayer_rooms r
      where r.id = room_id
        and r.status = 'open'
    )
  );

create policy "Users leave room (delete own membership)"
  on public.multiplayer_room_members
  for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "Hosts remove room members"
  on public.multiplayer_room_members
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.multiplayer_rooms r
      where r.id = multiplayer_room_members.room_id
        and r.host_user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Realtime (optional): enable row replication for multiplayer sync
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.multiplayer_rooms;
