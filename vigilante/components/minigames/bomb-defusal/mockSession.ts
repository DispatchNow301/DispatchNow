
import { createBombDefusalSession } from "./bombDefusalEngine";
import { BombDefusalSession } from "./types";

export const MOCK_PLAYER_A_ID = "mock-player-a";
export const MOCK_PLAYER_B_ID = "mock-player-b";

export function createMockBombSession(durationMs = 60_000): BombDefusalSession {
    return createBombDefusalSession(MOCK_PLAYER_A_ID, MOCK_PLAYER_B_ID, durationMs);
}