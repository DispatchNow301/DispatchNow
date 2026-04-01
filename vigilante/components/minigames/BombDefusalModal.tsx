// File: components/minigames/BombDefusalModal.tsx
// Purpose: Render a Bomb Defusal terminal using the existing minigame visual style, with a compact layout, one instruction block, and the phase panel placed at the bottom.

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, TimerReset, X } from "lucide-react";
import {
    getPhase1InstructionForA,
    getPhase1InstructionForB,
    getPhase2ReferenceColumns,
    getRemainingTimeMs,
} from "./bomb-defusal/bombDefusalEngine";
import WirePanel from "./bomb-defusal/WirePanel";
import type {
    BombDefusalSession,
    BombRole,
    Phase2Symbol,
} from "./bomb-defusal/types";

type BombDefusalModalProps = {
    open: boolean;
    onClose: () => void;
    session: BombDefusalSession;
    role: BombRole;
    title?: string;
    subtitle?: string;
    onCutWire: (rightSlot: number) => void;
    onClickSymbol: (symbol: Phase2Symbol) => void;
    onSubmitPhase2: () => void;
    onRestart?: () => void;
};

const PANEL_CLASS =
    "rounded-xl border border-amber-900/40 bg-black/35 backdrop-blur-md shadow-xl shadow-black/40";

const BUTTON_CLASS =
    "rounded-lg border border-amber-900/50 bg-black/40 text-amber-200/80 transition-all duration-200 hover:bg-amber-950/20 hover:border-amber-700/40 hover:text-amber-100 cursor-pointer";

const SYMBOL_LABELS: Record<Phase2Symbol, string> = {
    "Ω": "Omega",
    "★": "Star",
    "Δ": "Delta",
    "Ψ": "Psi",
    "Λ": "Lambda",
    "□": "Square",
    "○": "Circle",
    "✦": "Spark",
};

function formatTime(ms: number): string {
    const totalSeconds = Math.ceil(ms / 1000);
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function symbolCardClass(clicked: boolean) {
    return clicked
        ? "border-amber-500 bg-amber-950/30 text-amber-200"
        : "border-amber-900/40 bg-black/45 text-amber-100 hover:border-amber-700/40 hover:bg-amber-950/20";
}

export default function BombDefusalModal({
    open,
    onClose,
    session,
    role,
    title = "Bomb Defusal",
    subtitle = "Coordinate both terminals and disarm the device before detonation.",
    onCutWire,
    onClickSymbol,
    onSubmitPhase2,
    onRestart,
}: BombDefusalModalProps) {
    if (!open) return null;

    const [nowMs, setNowMs] = useState(() => Date.now());

    useEffect(() => {
        if (!open) return;
        if (session.status !== "active") return;

        const timer = window.setInterval(() => {
            setNowMs(Date.now());
        }, 250);

        return () => {
            window.clearInterval(timer);
        };
    }, [open, session.status, session.countdownEndAt]);

    const remainingMs = Math.max(
        0,
        new Date(session.countdownEndAt).getTime() - nowMs,
    );
    const phase2ReferenceColumns = getPhase2ReferenceColumns();
    const phase1Instruction =
        role === "A"
            ? getPhase1InstructionForA(session)
            : getPhase1InstructionForB(session);

    return createPortal(
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-1.5 sm:p-2"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Bomb Defusal minigame"
        >
            <div
                className="flex max-h-[78vh] flex-col overflow-hidden rounded-xl border border-amber-900/50 bg-[#0d0c0e] shadow-2xl shadow-black/50"
                style={{ width: "min(1040px, calc(100vw - 14px))" }}
            >
                <div className="flex items-center justify-between border-b border-amber-900/30 px-3 py-2 sm:px-3.5 sm:py-2.5">
                    <div className="min-w-0">
                        <div
                            className="text-base font-bold tracking-tight text-amber-100 sm:text-lg lg:text-xl"
                            style={{
                                fontFamily: "Georgia, 'Times New Roman', serif",
                                color: "#e4d5b7",
                                textShadow:
                                    "0 0 20px rgba(180,140,80,0.15), 0 2px 4px rgba(0,0,0,0.5)",
                            }}
                        >
                            {title}
                        </div>
                        <p className="mt-0.5 text-[11px] text-amber-200/55 sm:text-xs">
                            {subtitle}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-amber-900/50 bg-black/40 p-1.5 text-amber-200/70 transition-colors hover:border-amber-700/40 hover:bg-amber-950/20 hover:text-amber-100"
                        aria-label="Close bomb defusal"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="overflow-y-auto p-1.5 sm:p-2">
                    <div className="grid items-start gap-2.5">
                        <section className={`${PANEL_CLASS} p-2.5`}>
                            <div className="overflow-x-auto">
                                <div
                                    className="gap-2"
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "minmax(0, 1fr) 160px",
                                        minWidth: 680,
                                    }}
                                >
                                    <div className="rounded-lg border border-amber-900/40 bg-black/30 px-3 py-2.5">
                                        <div className="text-[9px] uppercase tracking-[0.18em] text-amber-400/70">
                                            Instruction
                                        </div>
                                        <p className="mt-1.5 text-xs leading-5 text-amber-200/75 sm:text-[13px]">
                                            {session.phase === 1
                                                ? phase1Instruction
                                                : role === "A"
                                                    ? "Player B reports the symbols. Find the matching column and give the exact order."
                                                    : "Tell Player A the four symbols you see, then press them in the exact order they give you."}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-red-900/45 bg-red-950/20 px-3 py-2.5">
                                        <div className="flex items-center gap-1.5 text-red-300">
                                            <AlertTriangle className="h-3.5 w-3.5" />
                                            <span className="text-[9px] uppercase tracking-[0.18em]">
                                                Timer
                                            </span>
                                        </div>
                                        <div className="mt-1.5 text-xl font-semibold text-red-200 sm:text-2xl">
                                            {formatTime(remainingMs)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {session.phase === 2 && (
                            <section className={`${PANEL_CLASS} p-2.5`}>
                                <div className="mx-auto w-full max-w-[760px]">
                                    {role === "A" ? (
                                        <div className="rounded-lg border border-amber-900/40 bg-black/30 p-3">
                                            <div className="text-[9px] uppercase tracking-[0.18em] text-amber-400/70">
                                                Reference Columns
                                            </div>
                                            <div className="mt-3 grid gap-2.5 md:grid-cols-2">
                                                {phase2ReferenceColumns.map((column, index) => (
                                                    <div
                                                        key={`column-${index}`}
                                                        className="rounded-lg border border-amber-900/40 bg-black/40 p-2.5"
                                                    >
                                                        <div className="text-[9px] uppercase tracking-[0.16em] text-amber-200/60">
                                                            Column {index + 1}
                                                        </div>
                                                        <div className="mt-2.5 flex flex-wrap gap-2">
                                                            {column.map((symbol) => (
                                                                <div
                                                                    key={`${index}-${symbol}`}
                                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-900/40 bg-black/45 text-lg font-bold text-amber-100"
                                                                >
                                                                    {symbol}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-amber-900/40 bg-black/30 p-3">
                                            <div className="text-[9px] uppercase tracking-[0.18em] text-amber-400/70">
                                                Keypad
                                            </div>

                                            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                                {session.phase2Config.buttonSymbols.map((symbol) => {
                                                    const isSelected =
                                                        session.phase2State.clickedSymbols.includes(symbol);

                                                    return (
                                                        <button
                                                            key={symbol}
                                                            type="button"
                                                            onClick={() => onClickSymbol(symbol)}
                                                            disabled={session.status !== "active"}
                                                            className={`flex h-20 items-center justify-center rounded-lg border text-2xl font-bold transition ${symbolCardClass(
                                                                isSelected,
                                                            )}`}
                                                        >
                                                            {symbol}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-3 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={onSubmitPhase2}
                                                    disabled={
                                                        session.status !== "active" ||
                                                        session.phase2State.clickedSymbols.length !==
                                                        session.phase2Config.correctOrder.length
                                                    }
                                                    className={`${BUTTON_CLASS} px-3 py-2 text-[11px] font-medium disabled:cursor-not-allowed disabled:opacity-40`}
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {session.phase === 1 && (
                            <section className={`${PANEL_CLASS} p-2.5`}>
                                <div className="mb-2 text-[9px] uppercase tracking-[0.18em] text-amber-400/70">
                                    Phase 1 Panel
                                </div>
                                <div className="mx-auto w-full max-w-[820px]">
                                    <WirePanel
                                        wires={session.phase1Config.wires}
                                        selectedRightSlot={session.phase1State.selectedRightSlot}
                                        mode={role}
                                        disabled={session.status !== "active"}
                                        onSelectRightSlot={role === "A" ? onCutWire : undefined}
                                    />
                                </div>
                            </section>
                        )}

                        <section className={`${PANEL_CLASS} p-2.5`}>
                            <div className="overflow-x-auto">
                                <div
                                    className="gap-2"
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: onRestart
                                            ? "repeat(3, minmax(0, 1fr))"
                                            : "repeat(2, minmax(0, 1fr))",
                                        minWidth: onRestart ? 420 : 280,
                                    }}
                                >
                                    {onRestart && (
                                        <button
                                            type="button"
                                            onClick={onRestart}
                                            className={`${BUTTON_CLASS} inline-flex items-center justify-center gap-2 px-3 py-2 text-[11px] font-medium`}
                                        >
                                            <TimerReset className="h-3.5 w-3.5" />
                                            Restart
                                        </button>
                                    )}

                                    <div className="rounded-lg border border-amber-900/40 bg-black/30 px-3 py-2 text-center text-[11px] text-amber-200/70">
                                        {session.status === "active"
                                            ? "Any mistake or timeout detonates the device."
                                            : session.status === "success"
                                                ? "Device disarmed successfully."
                                                : "Attempt failed."}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className={`${BUTTON_CLASS} px-3 py-2 text-[11px]`}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}