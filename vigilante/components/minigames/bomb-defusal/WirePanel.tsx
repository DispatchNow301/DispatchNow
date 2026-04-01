// File: components/minigames/bomb-defusal/WirePanel.tsx
// Purpose: Render compact phase 1 panels for Player A and Player B, using a compact switchboard for A and a readable wire board for B.

"use client";

import type { WireInfo } from "./types";

type WirePanelProps = {
    wires: WireInfo[];
    selectedRightSlot: number | null;
    mode: "A" | "B";
    disabled?: boolean;
    onSelectRightSlot?: (rightSlot: number) => void;
};

const LEFT_X = 90;
const RIGHT_X = 410;
const SLOT_Y = [48, 84, 120, 156, 192];

function buildLooseWirePath(wire: WireInfo) {
    const x1 = LEFT_X;
    const y1 = SLOT_Y[wire.fromSlot];
    const x2 = RIGHT_X;
    const y2 = SLOT_Y[wire.toSlot];

    const dx = x2 - x1;
    const c1x = x1 + dx * 0.28;
    const c2x = x1 + dx * 0.72;

    const spread = 22 + Math.abs(wire.toSlot - wire.fromSlot) * 8;
    const directionA = wire.fromSlot % 2 === 0 ? 1 : -1;
    const directionB = wire.toSlot % 2 === 0 ? -1 : 1;

    const c1y = y1 + spread * directionA;
    const c2y = y2 + spread * directionB;

    return `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
}

function wireStrokeBase() {
    return "#b91c1c";
}

function wireStrokeSelected() {
    return "#ef4444";
}

export default function WirePanel({
    wires,
    selectedRightSlot,
    mode,
    disabled = false,
    onSelectRightSlot,
}: WirePanelProps) {
    if (mode === "A") {
        return (
            <div className="rounded-lg border border-amber-900/35 bg-black/40 p-2">
                <svg
                    viewBox="0 0 500 226"
                    className="h-auto w-full"
                    role="img"
                    aria-label="Phase 1 control panel"
                >
                    <rect
                        x="10"
                        y="10"
                        width="480"
                        height="206"
                        rx="16"
                        fill="rgba(8,8,8,0.96)"
                        stroke="rgba(120,53,15,0.58)"
                        strokeWidth="2"
                    />
                    <rect
                        x="20"
                        y="20"
                        width="460"
                        height="186"
                        rx="12"
                        fill="rgba(251,191,36,0.02)"
                        stroke="rgba(251,191,36,0.05)"
                        strokeWidth="1"
                    />

                    <text
                        x="26"
                        y="28"
                        fill="#e4d5b7"
                        opacity="0.72"
                        fontSize="9"
                        letterSpacing="2"
                    >
                        INPUT LINES
                    </text>

                    <text
                        x="334"
                        y="28"
                        fill="#e4d5b7"
                        opacity="0.72"
                        fontSize="9"
                        letterSpacing="2"
                    >
                        OUTPUT SELECT
                    </text>

                    {wires.map((wire) => (
                        <g key={`a-left-${wire.id}`}>
                            <text
                                x="26"
                                y={SLOT_Y[wire.fromSlot] + 3}
                                fill="#e4d5b7"
                                fontSize="10"
                                fontWeight="600"
                            >
                                {wire.lineName}
                            </text>

                            <circle
                                cx="136"
                                cy={SLOT_Y[wire.fromSlot]}
                                r="9"
                                fill="rgba(24,24,27,0.98)"
                                stroke="rgba(180,83,9,0.82)"
                                strokeWidth="1.8"
                            />
                            <circle
                                cx="136"
                                cy={SLOT_Y[wire.fromSlot]}
                                r="3.4"
                                fill="rgba(245,222,179,0.9)"
                            />
                        </g>
                    ))}

                    {[0, 1, 2, 3, 4].map((slotIndex) => {
                        const isSelected = selectedRightSlot === slotIndex;
                        const centerY = SLOT_Y[slotIndex];

                        return (
                            <g key={`a-right-${slotIndex}`}>
                                <circle
                                    cx="320"
                                    cy={centerY}
                                    r="9"
                                    fill="rgba(24,24,27,0.98)"
                                    stroke={
                                        isSelected
                                            ? "rgba(252,211,77,0.95)"
                                            : "rgba(180,83,9,0.82)"
                                    }
                                    strokeWidth={isSelected ? 2.2 : 1.8}
                                />
                                <circle
                                    cx="320"
                                    cy={centerY}
                                    r="3.4"
                                    fill="rgba(245,222,179,0.9)"
                                />

                                <foreignObject
                                    x="346"
                                    y={centerY - 14}
                                    width="88"
                                    height="28"
                                >
                                    <button
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => {
                                            if (disabled || !onSelectRightSlot) return;
                                            onSelectRightSlot(slotIndex);
                                        }}
                                        className={`h-7 w-[82px] rounded-md border text-[10px] font-semibold tracking-[0.08em] transition ${isSelected
                                                ? "border-amber-400 bg-amber-900/35 text-amber-100"
                                                : "border-amber-900/50 bg-black/55 text-amber-200/78 hover:border-amber-700/45 hover:bg-amber-950/20 hover:text-amber-100"
                                            }`}
                                    >
                                        SELECT
                                    </button>
                                </foreignObject>

                                <text
                                    x="442"
                                    y={centerY + 3}
                                    fill="#e4d5b7"
                                    fontSize="10"
                                    fontWeight="600"
                                >
                                    {slotIndex + 1}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-amber-900/35 bg-black/40 p-2">
            <svg
                viewBox="0 0 500 238"
                className="h-auto w-full"
                role="img"
                aria-label="Phase 1 live wire board"
            >
                <rect
                    x="10"
                    y="10"
                    width="480"
                    height="218"
                    rx="16"
                    fill="rgba(8,8,8,0.96)"
                    stroke="rgba(120,53,15,0.58)"
                    strokeWidth="2"
                />
                <rect
                    x="20"
                    y="20"
                    width="460"
                    height="198"
                    rx="12"
                    fill="rgba(251,191,36,0.02)"
                    stroke="rgba(251,191,36,0.05)"
                    strokeWidth="1"
                />

                <text
                    x="26"
                    y="28"
                    fill="#e4d5b7"
                    opacity="0.72"
                    fontSize="9"
                    letterSpacing="2"
                >
                    INPUT LABELS
                </text>

                <text
                    x="392"
                    y="28"
                    fill="#e4d5b7"
                    opacity="0.72"
                    fontSize="9"
                    letterSpacing="2"
                >
                    OUTPUTS
                </text>

                {wires.map((wire) => {
                    const isSelected = selectedRightSlot === wire.toSlot;

                    return (
                        <g key={`b-wire-${wire.id}`}>
                            <path
                                d={buildLooseWirePath(wire)}
                                stroke="rgba(0,0,0,0.62)"
                                strokeWidth="10.5"
                                fill="none"
                                strokeLinecap="round"
                            />
                            <path
                                d={buildLooseWirePath(wire)}
                                stroke={isSelected ? wireStrokeSelected() : wireStrokeBase()}
                                strokeWidth={isSelected ? 6.2 : 4.9}
                                fill="none"
                                strokeLinecap="round"
                                style={{
                                    filter: isSelected
                                        ? "drop-shadow(0 0 6px rgba(239,68,68,0.4))"
                                        : "drop-shadow(0 0 3px rgba(185,28,28,0.2))",
                                }}
                            />
                        </g>
                    );
                })}

                {wires.map((wire) => (
                    <g key={`b-left-${wire.id}`}>
                        <text
                            x="26"
                            y={SLOT_Y[wire.fromSlot] + 3}
                            fill="#e4d5b7"
                            fontSize="10"
                            fontWeight="600"
                        >
                            {wire.lineName}
                        </text>
                        <circle
                            cx={LEFT_X}
                            cy={SLOT_Y[wire.fromSlot]}
                            r="9"
                            fill="rgba(24,24,27,0.98)"
                            stroke="rgba(180,83,9,0.82)"
                            strokeWidth="1.8"
                        />
                        <circle
                            cx={LEFT_X}
                            cy={SLOT_Y[wire.fromSlot]}
                            r="3.4"
                            fill="rgba(245,222,179,0.86)"
                        />
                    </g>
                ))}

                {[0, 1, 2, 3, 4].map((slotIndex) => {
                    const isSelected = selectedRightSlot === slotIndex;

                    return (
                        <g key={`b-right-${slotIndex}`}>
                            <circle
                                cx={RIGHT_X}
                                cy={SLOT_Y[slotIndex]}
                                r="10"
                                fill="rgba(24,24,27,0.98)"
                                stroke={
                                    isSelected
                                        ? "rgba(252,211,77,0.95)"
                                        : "rgba(180,83,9,0.82)"
                                }
                                strokeWidth={isSelected ? 2.4 : 1.8}
                            />
                            <circle
                                cx={RIGHT_X}
                                cy={SLOT_Y[slotIndex]}
                                r="3.4"
                                fill="rgba(245,222,179,0.86)"
                            />
                            <text
                                x={RIGHT_X + 18}
                                y={SLOT_Y[slotIndex] + 3}
                                fill="#e4d5b7"
                                fontSize="10"
                                fontWeight="600"
                            >
                                {slotIndex + 1}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}