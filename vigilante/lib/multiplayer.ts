import { getSupabaseBrowserClient } from "./supabaseClient";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
    MarkerKind,
    MultiplayerBombDefusalSessionRow,
    MultiplayerBombDefusalStatus,
    MultiplayerMarkerRow,
    MultiplayerPlayer,
    MultiplayerSession,
} from "./gameTypes";
import type { BombDefusalSession } from "@/components/minigames/bomb-defusal/types";

// Lazy-initialise instead of calling at module scope.
let _supabase: SupabaseClient | null = null;
function supabase(): SupabaseClient {
    if (!_supabase) _supabase = getSupabaseBrowserClient();
    return _supabase;
}

type CreateSessionInput = {
    joinCode: string;
    hostUserId: string;
    saveScope: "local" | "cloud";
    saveSlot: number;
};

type CreateMarkerInput = {
    sessionId: number;
    markerId: string;
    kind: MarkerKind;
    x: number;
    y: number;
    title: string;
    details: string;
    createdAt?: string;
    expiresAt?: string | null;
    status?: "active" | "resolved" | "failed";
};

function parseBombDefusalSessionRow(
    row: MultiplayerBombDefusalSessionRow,
): MultiplayerBombDefusalSessionRow & { session_state: BombDefusalSession } {
    return {
        ...row,
        session_state: {
            id: row.id,
            status: row.status,
            phase: row.phase,
            countdownEndAt: row.countdown_end_at,
            playerAUserId: row.player_a_user_id,
            playerBUserId: row.player_b_user_id,
            phase1Config:
                row.phase1_config as BombDefusalSession["phase1Config"],
            phase1State:
                row.phase1_state as BombDefusalSession["phase1State"],
            phase2Config:
                row.phase2_config as BombDefusalSession["phase2Config"],
            phase2State:
                row.phase2_state as BombDefusalSession["phase2State"],
        },
    };
}

export async function createMultiplayerSession({
    joinCode,
    hostUserId,
    saveScope,
    saveSlot,
}: CreateSessionInput): Promise<MultiplayerSession> {

    const { data, error } = await supabase()
        .from("multiplayer_sessions")
        .insert({
            join_code: joinCode,
            host_user_id: hostUserId,
            status: "lobby",
            save_scope: saveScope,
            save_slot: saveSlot,
        })
        .select()
        .single();

    if (error) throw error;
    return data as MultiplayerSession;
}

export async function addPlayerToSession(
    sessionId: number,
    userId: string,
    isHost: boolean,
): Promise<MultiplayerPlayer> {

    const { data, error } = await supabase()
        .from("multiplayer_players")
        .insert({
            session_id: sessionId,
            user_id: userId,
            is_host: isHost,
            is_connected: true,
        })
        .select()
        .single();

    if (error) throw error;
    return data as MultiplayerPlayer;
}

export async function getSessionByJoinCode(
    joinCode: string,
): Promise<MultiplayerSession | null> {

    const { data, error } = await supabase()
        .from("multiplayer_sessions")
        .select("*")
        .eq("join_code", joinCode)
        .maybeSingle();

    if (error) throw error;
    return (data as MultiplayerSession | null) ?? null;
}

export async function getSessionById(
    sessionId: number,
): Promise<MultiplayerSession | null> {

    const { data, error } = await supabase()
        .from("multiplayer_sessions")
        .select("*")
        .eq("id", sessionId)
        .maybeSingle();

    if (error) throw error;
    return (data as MultiplayerSession | null) ?? null;
}

export async function getSessionPlayers(
    sessionId: number,
): Promise<MultiplayerPlayer[]> {

    const { data, error } = await supabase()
        .from("multiplayer_players")
        .select("*")
        .eq("session_id", sessionId)
        .order("joined_at", { ascending: true });

    if (error) throw error;
    return (data as MultiplayerPlayer[]) ?? [];
}

export async function updateSessionStatus(
    sessionId: number,
    status: "lobby" | "active" | "finished",
): Promise<void> {

    const { error } = await supabase()
        .from("multiplayer_sessions")
        .update({ status })
        .eq("id", sessionId);

    if (error) throw error;
}

export async function getSessionMarkers(
    sessionId: number,
): Promise<MultiplayerMarkerRow[]> {

    const { data, error } = await supabase()
        .from("multiplayer_markers")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

    if (error) throw error;
    return (data as MultiplayerMarkerRow[]) ?? [];
}

export async function insertSessionMarker({
    sessionId,
    markerId,
    kind,
    x,
    y,
    title,
    details,
    createdAt,
    expiresAt = null,
    status = "active",
}: CreateMarkerInput): Promise<MultiplayerMarkerRow> {

    const { data, error } = await supabase()
        .from("multiplayer_markers")
        .insert({
            session_id: sessionId,
            marker_id: markerId,
            kind,
            x,
            y,
            title,
            details,
            created_at: createdAt ?? new Date().toISOString(),
            expires_at: expiresAt,
            status,
        })
        .select()
        .single();

    if (error) throw error;
    return data as MultiplayerMarkerRow;
}

export async function activateSession(
    sessionId: number,
    gameStartedAt: string,
): Promise<void> {
    const { error } = await supabase()
        .from("multiplayer_sessions")
        .update({
            status: "active",
            game_started_at: gameStartedAt,
        })
        .eq("id", sessionId)
        .eq("status", "lobby");

    if (error) throw error;
}

export async function deleteSessionMarkerByMarkerId(
    sessionId: number,
    markerId: string,
): Promise<void> {

    const { error } = await supabase()
        .from("multiplayer_markers")
        .delete()
        .eq("session_id", sessionId)
        .eq("marker_id", markerId);

    if (error) throw error;
}

export async function updateMarkerStatus(
    sessionId: number,
    markerId: string,
    status: "active" | "resolved" | "failed",
): Promise<void> {

    const { error } = await supabase()
        .from("multiplayer_markers")
        .update({ status })
        .eq("session_id", sessionId)
        .eq("marker_id", markerId);

    if (error) throw error;
}

export async function addAssignedResourceToMarker(
    sessionId: number,
    markerId: string,
    resource: string,
    playerId: string,
): Promise<void> {
    const { error } = await supabase().rpc(
        "add_assigned_resource_to_marker_atomic",
        {
            p_session_id: sessionId,
            p_marker_id: markerId,
            p_player_id: playerId,
            p_resource: resource,
        },
    );

    if (error) throw error;
}

export async function updateConsumedTheftSites(
    sessionId: number,
    consumedSiteIds: string[],
): Promise<void> {
    const { error } = await supabase()
        .from("multiplayer_sessions")
        .update({ consumed_theft_site_ids: consumedSiteIds })
        .eq("id", sessionId);

    if (error) throw error;
}

export async function updateSessionReputation(
    sessionId: number,
    reputation: number,
): Promise<void> {
    const clamped = Math.max(0, Math.min(100, Math.floor(reputation)));

    const { error } = await supabase()
        .from("multiplayer_sessions")
        .update({ reputation: clamped })
        .eq("id", sessionId);

    if (error) throw error;
}

// ── Pause sync ─────────────────────────────────────────────────────────────

/**
 * Set or clear the paused_by field on the session.
 * Pass `null` to unpause.
 */
export async function updateSessionPausedBy(
    sessionId: number,
    userId: string | null,
): Promise<void> {
    const { error } = await supabase()
        .from("multiplayer_sessions")
        .update({ paused_by: userId })
        .eq("id", sessionId);

    if (error) {
        console.error("updateSessionPausedBy failed:", {
            sessionId,
            userId,
            error,
        });
        throw error;
    }

    console.log("updateSessionPausedBy succeeded:", {
        sessionId,
        userId,
    });
}

// ── Bomb defusal sync ──────────────────────────────────────────────────────

export async function getActiveBombDefusalSession(
    multiplayerSessionId: number,
    incidentMarkerId: string,
): Promise<
    (MultiplayerBombDefusalSessionRow & {
        session_state: BombDefusalSession;
    }) | null
> {
    const { data, error } = await supabase()
        .from("multiplayer_bomb_defusal_sessions")
        .select("*")
        .eq("multiplayer_session_id", multiplayerSessionId)
        .eq("incident_marker_id", incidentMarkerId)
        .eq("status", "active")
        .maybeSingle();

    if (error) throw error;
    return data
        ? parseBombDefusalSessionRow(data as MultiplayerBombDefusalSessionRow)
        : null;
}

export async function createMultiplayerBombDefusalSession(params: {
    multiplayerSessionId: number;
    incidentMarkerId: string;
    playerAUserId: string;
    playerBUserId: string;
    session: BombDefusalSession;
}): Promise<
    MultiplayerBombDefusalSessionRow & {
        session_state: BombDefusalSession;
    }
> {
    const { data, error } = await supabase()
        .from("multiplayer_bomb_defusal_sessions")
        .insert({
            multiplayer_session_id: params.multiplayerSessionId,
            incident_marker_id: params.incidentMarkerId,
            status: params.session.status,
            phase: params.session.phase,
            countdown_end_at: params.session.countdownEndAt,
            player_a_user_id: params.playerAUserId,
            player_b_user_id: params.playerBUserId,
            phase1_config: params.session.phase1Config,
            phase1_state: params.session.phase1State,
            phase2_config: params.session.phase2Config,
            phase2_state: params.session.phase2State,
        })
        .select("*")
        .single();

    if (error) throw error;
    return parseBombDefusalSessionRow(data as MultiplayerBombDefusalSessionRow);
}

export async function updateMultiplayerBombDefusalSession(params: {
    id: string;
    session: BombDefusalSession;
    status?: MultiplayerBombDefusalStatus;
}): Promise<void> {
    const nextStatus = params.status ?? params.session.status;

    const { error } = await supabase()
        .from("multiplayer_bomb_defusal_sessions")
        .update({
            status: nextStatus,
            phase: params.session.phase,
            countdown_end_at: params.session.countdownEndAt,
            phase1_config: params.session.phase1Config,
            phase1_state: params.session.phase1State,
            phase2_config: params.session.phase2Config,
            phase2_state: params.session.phase2State,
            updated_at: new Date().toISOString(),
        })
        .eq("id", params.id);

    if (error) throw error;
}

export async function abandonMultiplayerBombDefusalSession(
    id: string,
): Promise<void> {
    const { error } = await supabase()
        .from("multiplayer_bomb_defusal_sessions")
        .update({
            status: "abandoned",
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("status", "active");

    if (error) throw error;
}

export function subscribeToBombDefusalSession(
    multiplayerSessionId: number,
    incidentMarkerId: string,
    onChange: (
        session: (MultiplayerBombDefusalSessionRow & {
            session_state: BombDefusalSession;
        }) | null,
    ) => void,
) {
    const channel = supabase()
        .channel(
            `multiplayer_bomb_defusal_sessions:${multiplayerSessionId}:${incidentMarkerId}`,
        )
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "multiplayer_bomb_defusal_sessions",
                filter: `multiplayer_session_id=eq.${multiplayerSessionId}`,
            },
            (payload) => {
                if (payload.eventType === "DELETE") {
                    onChange(null);
                    return;
                }

                const row = payload.new as MultiplayerBombDefusalSessionRow | null;
                if (!row || row.incident_marker_id !== incidentMarkerId) return;
                onChange(parseBombDefusalSessionRow(row));
            },
        )
        .subscribe();

    return () => {
        channel.unsubscribe();
    };
}

// ── Realtime subscriptions ─────────────────────────────────────────────────

export function subscribeToSessionPlayers(
    sessionId: number,
    onChange: () => void,
) {

    const channel = supabase()
        .channel(`multiplayer_players:${sessionId}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "multiplayer_players",
                filter: `session_id=eq.${sessionId}`,
            },
            () => onChange(),
        )
        .subscribe();

    return () => {
        channel.unsubscribe();
    };
}

export function subscribeToSessionMarkers(
    sessionId: number,
    onChange: () => void,
) {

    const channel = supabase()
        .channel(`multiplayer_markers:${sessionId}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "multiplayer_markers",
                filter: `session_id=eq.${sessionId}`,
            },
            () => onChange(),
        )
        .subscribe();

    return () => {
        channel.unsubscribe();
    };
}

/**
 * Subscribe to changes on the session row itself (for pause sync, status, etc).
 */
export function subscribeToSession(
    sessionId: number,
    onChange: (session: MultiplayerSession) => void,
) {
    const channel = supabase()
        .channel(`multiplayer_session:${sessionId}`)
        .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "multiplayer_sessions",
                filter: `id=eq.${sessionId}`,
            },
            (payload) => {
                onChange(payload.new as MultiplayerSession);
            },
        )
        .subscribe();

    return () => {
        channel.unsubscribe();
    };
}
