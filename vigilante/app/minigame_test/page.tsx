"use client";

import { useState } from "react";
import FireMinigame from "@/components/game/FireMinigame";
import HackMinigame from "@/components/game/HackMinigame";

type Result = "won" | "lost" | null;

const PANEL_STYLE = {
  background:           "rgba(0,0,0,0.55)",
  backdropFilter:       "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderRadius:         12,
} as React.CSSProperties;

function ResultBadge({ result }: { result: Result }) {
  if (!result) return null;
  const win = result === "won";
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.14em]"
      style={{
        background:  win ? "rgba(21,128,61,0.20)"  : "rgba(153,27,27,0.20)",
        border:      `1px solid ${win ? "rgba(21,128,61,0.55)" : "rgba(153,27,27,0.55)"}`,
        color:       win ? "rgba(134,239,172,0.90)" : "rgba(252,165,165,0.90)",
      }}
    >
      <span>{win ? "✓" : "✕"}</span>
      <span>{win ? "Resolved" : "Failed"}</span>
    </div>
  );
}

function TriggerCard({
  label,
  description,
  accentColor,
  borderColor,
  iconChar,
  onTrigger,
  lastResult,
  disabled,
}: {
  label: string;
  description: string;
  accentColor: string;
  borderColor: string;
  iconChar: string;
  onTrigger: () => void;
  lastResult: Result;
  disabled: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-4 rounded-xl p-4"
      style={{ ...PANEL_STYLE, border: `1px solid ${borderColor}`, width: 260 }}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-7 w-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
          style={{ border: `1px solid ${borderColor}`, background: `${accentColor}18`, color: accentColor }}
        >
          {iconChar}
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: accentColor }}>
          {label}
        </span>
      </div>

      <p className="text-[11px] leading-relaxed" style={{ color: `${accentColor}99` }}>
        {description}
      </p>

      {lastResult && <ResultBadge result={lastResult} />}

      <button
        onClick={onTrigger}
        disabled={disabled}
        className="w-full py-2.5 rounded-lg text-xs font-semibold uppercase tracking-[0.18em] cursor-pointer transition-opacity"
        style={{
          background: `${accentColor}18`,
          border:     `1px solid ${accentColor}55`,
          color:      `${accentColor}ee`,
          opacity:    disabled ? 0.4 : 1,
          cursor:     disabled ? "not-allowed" : "pointer",
        }}
        onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = `${accentColor}28`; }}
        onMouseLeave={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = `${accentColor}18`; }}
      >
        Trigger Incident
      </button>
    </div>
  );
}

export default function MinigameTestPage() {
  const [activeFire, setActiveFire] = useState(false);
  const [activeHack, setActiveHack] = useState(false);
  const [fireResult, setFireResult] = useState<Result>(null);
  const [hackResult, setHackResult] = useState<Result>(null);

  const anyActive = activeFire || activeHack;

  return (
    <>
      <style>{`
        @keyframes bench-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>

      <main
        className="min-h-screen flex flex-col items-center justify-center gap-10"
        style={{ background: "#050810", fontFamily: "monospace" }}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "rgba(6,182,212,0.80)",
              animation: "bench-blink 2s ease-in-out infinite",
            }} />
            <span
              className="text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "rgba(103,232,249,0.50)" }}
            >
              Dev Environment
            </span>
          </div>
          <h1
            className="text-xl font-bold uppercase tracking-[0.22em]"
            style={{ color: "rgba(252,211,77,0.75)" }}
          >
            Minigame Test Bench
          </h1>
          <p className="text-[10px] tracking-widest" style={{ color: "rgba(255,255,255,0.15)" }}>
            Trigger any incident minigame to test it in isolation
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap gap-5 justify-center">
          <TriggerCard
            label="Fire Incident"
            description="Extinguish spreading fires by keeping the water bar over the flames. Fires split and multiply over time."
            accentColor="rgba(217,119,6,1)"
            borderColor="rgba(120,53,15,0.45)"
            iconChar="!"
            onTrigger={() => { setFireResult(null); setActiveFire(true); }}
            lastResult={fireResult}
            disabled={anyActive}
          />
          <TriggerCard
            label="Registry Hack"
            description="Decrypt an intercepted shelter access phrase. Guess whole words to cascade letter reveals across the cipher."
            accentColor="rgba(6,182,212,1)"
            borderColor="rgba(22,78,99,0.50)"
            iconChar="//"
            onTrigger={() => { setHackResult(null); setActiveHack(true); }}
            lastResult={hackResult}
            disabled={anyActive}
          />
        </div>

        {/* Footer note */}
        <p className="text-[10px] tracking-[0.10em]" style={{ color: "rgba(255,255,255,0.12)" }}>
          Mount these components anywhere an incident resolve is attempted
        </p>
      </main>

      {activeFire && (
        <FireMinigame
          difficulty={0}
          onSuccess={() => { setActiveFire(false); setFireResult("won"); }}
          onFailure={() => { setActiveFire(false); setFireResult("lost"); }}
        />
      )}
      {activeHack && (
        <HackMinigame
          difficulty={0}
          onSuccess={() => { setActiveHack(false); setHackResult("won"); }}
          onFailure={() => { setActiveHack(false); setHackResult("lost"); }}
        />
      )}
    </>
  );
}