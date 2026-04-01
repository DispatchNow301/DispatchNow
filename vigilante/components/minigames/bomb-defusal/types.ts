// File: components/minigames/bomb-defusal/types.ts
// Purpose: Define shared Bomb Defusal types used by the engine, modal, and multiplayer tester.

export type BombRole = "A" | "B";
export type BombStatus = "active" | "success" | "failed" | "expired";
export type BombPhase = 1 | 2;

export type WireColor = "red" | "blue" | "yellow" | "white" | "green";
export type WireMark = "circle" | "triangle" | "square" | "star";

export type WireInfo = {
    id: string;
    color: WireColor;
    terminal: number;
    mark: WireMark;
    fromSlot: number;
    toSlot: number;
    lineName: string;
};

export type Phase1Config = {
    targetWire: WireInfo;
    wires: WireInfo[];
    correctRightSlot: number;
};

export type Phase1State = {
    selectedRightSlot: number | null;
    resolved: boolean;
};

export type Phase2Symbol = "Ω" | "★" | "Δ" | "Ψ" | "Λ" | "□" | "○" | "✦";

export type Phase2Config = {
    buttonSymbols: Phase2Symbol[];
    correctOrder: Phase2Symbol[];
};

export type Phase2State = {
    clickedSymbols: Phase2Symbol[];
    resolved: boolean;
};

export type BombDefusalSession = {
    id: string;
    status: BombStatus;
    phase: BombPhase;
    countdownEndAt: string;
    playerAUserId: string;
    playerBUserId: string;
    phase1Config: Phase1Config;
    phase1State: Phase1State;
    phase2Config: Phase2Config;
    phase2State: Phase2State;
};

export type BombActionResult = {
    session: BombDefusalSession;
    changed: boolean;
    reason?: string;
};