// File: components/minigames/bomb-defusal/bombDefusalEngine.ts
// Purpose: Implement Bomb Defusal game logic, including phase generation, timer handling, phase 1 target-slot selection, and phase 2 symbol input resolution.

import {
    BombActionResult,
    BombDefusalSession,
    Phase2Symbol,
    WireColor,
    WireInfo,
    WireMark,
} from "./types";

const SYMBOL_REFERENCE_COLUMNS: Phase2Symbol[][] = [
    ["Ω", "Ψ", "Δ", "★"],
    ["Λ", "□", "○", "✦"],
    ["★", "Δ", "Ω", "□"],
    ["✦", "○", "Ψ", "Λ"],
];

const WIRE_COLORS: WireColor[] = ["red", "blue", "yellow", "white", "green"];
const WIRE_MARKS: WireMark[] = ["circle", "triangle", "square", "star"];
const LINE_NAMES = ["ALPHA", "BRAVO", "CHARLIE", "DELTA", "ECHO"];
const TERMINALS = [1, 2, 3, 4, 5];
const SLOT_ORDER = [0, 1, 2, 3, 4];

function shuffle<T>(items: T[]): T[] {
    const next = [...items];
    for (let i = next.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
    }
    return next;
}

function createWire(index: number, toSlot: number): WireInfo {
    return {
        id: `wire-${index}-${Math.random().toString(36).slice(2, 8)}`,
        color: WIRE_COLORS[index % WIRE_COLORS.length],
        terminal: TERMINALS[index % TERMINALS.length],
        mark: WIRE_MARKS[index % WIRE_MARKS.length],
        fromSlot: index - 1,
        toSlot,
        lineName: LINE_NAMES[index - 1],
    };
}

export function getRemainingTimeMs(session: BombDefusalSession): number {
    return Math.max(0, new Date(session.countdownEndAt).getTime() - Date.now());
}

export function isExpired(session: BombDefusalSession): boolean {
    return getRemainingTimeMs(session) <= 0;
}

export function expireSessionIfNeeded(
    session: BombDefusalSession,
): BombDefusalSession {
    if (session.status !== "active") return session;
    if (!isExpired(session)) return session;

    return {
        ...session,
        status: "expired",
    };
}

export function createPhase1Config() {
    const shuffledTargets = shuffle(SLOT_ORDER);
    const wires = SLOT_ORDER.map((slotIndex, index) =>
        createWire(index + 1, shuffledTargets[slotIndex]),
    );

    const targetWire = wires[Math.floor(Math.random() * wires.length)];

    return {
        targetWire,
        wires,
        correctRightSlot: targetWire.toSlot,
    };
}

export function createPhase2Config() {
    const referenceColumn =
        SYMBOL_REFERENCE_COLUMNS[
        Math.floor(Math.random() * SYMBOL_REFERENCE_COLUMNS.length)
        ];

    const correctOrder = [...referenceColumn];
    const buttonSymbols = shuffle(correctOrder);

    return {
        buttonSymbols,
        correctOrder,
    };
}

export function createBombDefusalSession(
    playerAUserId: string,
    playerBUserId: string,
    durationMs = 60000,
): BombDefusalSession {
    const now = Date.now();

    return {
        id: `bomb-${Math.random().toString(36).slice(2, 10)}`,
        status: "active",
        phase: 1,
        countdownEndAt: new Date(now + durationMs).toISOString(),
        playerAUserId,
        playerBUserId,
        phase1Config: createPhase1Config(),
        phase1State: {
            selectedRightSlot: null,
            resolved: false,
        },
        phase2Config: createPhase2Config(),
        phase2State: {
            clickedSymbols: [],
            resolved: false,
        },
    };
}

export function getPhase1InstructionForA(session: BombDefusalSession): string {
    return `Tell Player B our target line is ${session.phase1Config.targetWire.lineName}.`;
}

export function getPhase1InstructionForB(session: BombDefusalSession): string {
    return `Find where target connects on the right, then tell Player A which button to click.`;
}

export function getPhase2ReferenceColumns(): Phase2Symbol[][] {
    return SYMBOL_REFERENCE_COLUMNS;
}

export function selectRightSlot(
    session: BombDefusalSession,
    rightSlot: number,
): BombActionResult {
    const next = expireSessionIfNeeded(session);

    if (next.status !== "active") {
        return {
            session: next,
            changed: false,
            reason: "Session is no longer active.",
        };
    }

    if (next.phase !== 1) {
        return {
            session: next,
            changed: false,
            reason: "Phase 1 is already finished.",
        };
    }

    if (next.phase1State.resolved) {
        return {
            session: next,
            changed: false,
            reason: "Phase 1 is already resolved.",
        };
    }

    const isCorrect = rightSlot === next.phase1Config.correctRightSlot;

    if (!isCorrect) {
        return {
            session: {
                ...next,
                status: "failed",
                phase1State: {
                    ...next.phase1State,
                    selectedRightSlot: rightSlot,
                    resolved: false,
                },
            },
            changed: true,
            reason: "Wrong right-side socket.",
        };
    }

    return {
        session: {
            ...next,
            phase: 2,
            phase1State: {
                ...next.phase1State,
                selectedRightSlot: rightSlot,
                resolved: true,
            },
        },
        changed: true,
    };
}

export function clickSymbol(
    session: BombDefusalSession,
    symbol: Phase2Symbol,
): BombActionResult {
    const next = expireSessionIfNeeded(session);

    if (next.status !== "active") {
        return {
            session: next,
            changed: false,
            reason: "Session is no longer active.",
        };
    }

    if (next.phase !== 2) {
        return {
            session: next,
            changed: false,
            reason: "Phase 2 is not active yet.",
        };
    }

    if (next.phase2State.resolved) {
        return {
            session: next,
            changed: false,
            reason: "Phase 2 is already resolved.",
        };
    }

    const currentSelection = next.phase2State.clickedSymbols;
    const alreadySelected = currentSelection.includes(symbol);

    if (alreadySelected) {
        return {
            session: {
                ...next,
                phase2State: {
                    ...next.phase2State,
                    clickedSymbols: currentSelection.filter(
                        (item) => item !== symbol,
                    ),
                },
            },
            changed: true,
        };
    }

    if (currentSelection.length >= next.phase2Config.correctOrder.length) {
        return {
            session: next,
            changed: false,
            reason: "All symbols are already selected.",
        };
    }

    return {
        session: {
            ...next,
            phase2State: {
                ...next.phase2State,
                clickedSymbols: [...currentSelection, symbol],
            },
        },
        changed: true,
    };
}

export function submitPhase2Selection(
    session: BombDefusalSession,
): BombActionResult {
    const next = expireSessionIfNeeded(session);

    if (next.status !== "active") {
        return {
            session: next,
            changed: false,
            reason: "Session is no longer active.",
        };
    }

    if (next.phase !== 2) {
        return {
            session: next,
            changed: false,
            reason: "Phase 2 is not active yet.",
        };
    }

    if (next.phase2State.resolved) {
        return {
            session: next,
            changed: false,
            reason: "Phase 2 is already resolved.",
        };
    }

    if (
        next.phase2State.clickedSymbols.length !==
        next.phase2Config.correctOrder.length
    ) {
        return {
            session: next,
            changed: false,
            reason: "Select all symbols before submitting.",
        };
    }

    const isCorrect = next.phase2State.clickedSymbols.every(
        (symbol, index) => symbol === next.phase2Config.correctOrder[index],
    );

    if (!isCorrect) {
        return {
            session: {
                ...next,
                status: "failed",
                phase2State: {
                    ...next.phase2State,
                    resolved: false,
                },
            },
            changed: true,
            reason: "Wrong symbol order.",
        };
    }

    return {
        session: {
            ...next,
            status: "success",
            phase2State: {
                ...next.phase2State,
                resolved: true,
            },
        },
        changed: true,
    };
}

export function restartBombDefusalSession(
    session: BombDefusalSession,
    durationMs = 60000,
): BombDefusalSession {
    return createBombDefusalSession(
        session.playerAUserId,
        session.playerBUserId,
        durationMs,
    );
}