# Saves, Supabase, and cloud sync

## Current behavior (implemented)

### Who can use cloud saves

- **Cloud slots** (`/play/singleplayer?scope=cloud&slot=1|2|3`) require a **signed-in** Supabase user.
- If you open a cloud URL while logged out, you are redirected to **`/login?next=…`** and return to the same play URL after OAuth.
- **Local slots** (`scope=local`) do not use Supabase; they work offline and without login.

### Auto-save vs “run”

- **During a play session** (map open): the game **only** writes to **`localStorage`** (fast, works offline). **No Supabase writes** happen while you are playing.
- **When the session ends** (navigate away, close tab, or browser `pagehide`): the client **upserts** the full map state to **`game_saves`** for cloud slots, then updates slot metadata via **`touchSave`**.

### Restore on another device / session

- On entering a **cloud** play URL while logged in, the app **fetches** `game_saves` and may **hydrate** `localStorage` if the server copy is **newer than** the last successful cloud flush (`vigilante:cloud:lastFlush:…` keys).
- If you have **unsynced local progress** (no flush yet), the server is **not** applied over your local map state.

### Files

- **`lib/cloudSaves.ts`** — `fetchGameSave`, `upsertGameSave`, `applyCloudHydrationIfRemoteNewer`, `markCloudFlush`.
- **`app/play/singleplayer/page.tsx`** — login gate, loading overlay, hydration before `StreetMapScene` mounts.
- **`components/game/StreetMapScene.tsx`** — `cloudSync` prop; flush on unmount + `pagehide`.
- **`lib/auth.tsx`** — `signInWithProvider(provider, next?)` passes `next` into the OAuth `redirectTo` callback query.

## Database

Apply migrations to your Supabase project (`supabase db push` or SQL Editor). **`game_saves`** must exist with RLS for authenticated users.

## Optional follow-ups

- Debounce / retry failed cloud flushes; toast on failure.
- **Shop / buff purchases**: still need UI that updates `purchasedBuffIds` + `resourcePool`.
- **Conflict resolution**: if you need merge beyond `lastFlush`, add timestamps inside `GameState` or server versioning.

## Suggested commit message angle

> Add Supabase cloud save/load for cloud slots (session-end sync, login required, hydrate on load).
