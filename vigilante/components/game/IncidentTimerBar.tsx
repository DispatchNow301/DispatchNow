"use client";
import React, { useEffect, useRef, useState } from "react";

export const IncidentTimerBar = React.memo(function IncidentTimerBar({
    createdAt,
    expiresAt,
    onExpire,
    paused = false,
    timerSlowdownMultiplier = 1,
}: {
    createdAt: number;
    expiresAt: number;
    onExpire: () => void;
    paused?: boolean;
    /** Multiplier for timer speed (e.g., 0.75 = 75% speed). Default 1 (normal speed). */
    timerSlowdownMultiplier?: number;
}) {
    const totalMs = Math.max(1, expiresAt - createdAt);
    const [displayNow, setDisplayNow] = useState(() => Date.now());
    const pausedRef = useRef(paused);
    pausedRef.current = paused;
    // Always reflect the latest prop values inside the interval callback.
    const expiresAtRef = useRef(expiresAt);
    expiresAtRef.current = expiresAt;
    const onExpireRef = useRef(onExpire);
    onExpireRef.current = onExpire;
    const createdAtRef = useRef(createdAt);
    createdAtRef.current = createdAt;
    const slowdownRef = useRef(timerSlowdownMultiplier);
    slowdownRef.current = timerSlowdownMultiplier;

    useEffect(() => {
        if (paused) return;
        const id = window.setInterval(() => {
            const t = Date.now();
            setDisplayNow(t);
            if (!pausedRef.current) {
                // Check expiry with slowdown multiplier applied
                const elapsedAdjusted = (t - createdAtRef.current) * slowdownRef.current;
                const targetDuration = expiresAtRef.current - createdAtRef.current;
                if (elapsedAdjusted >= targetDuration) {
                    onExpireRef.current();
                }
            }
        }, 100);
        return () => window.clearInterval(id);
    }, [paused]);

    const elapsedAdjusted = (displayNow - createdAt) * timerSlowdownMultiplier;
    const remainingMs = Math.max(0, totalMs - elapsedAdjusted);
    const ratio = Math.max(0, Math.min(1, remainingMs / totalMs));

    return (
        <div 
            className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-amber-900/40"
            role="timer"
            aria-label={`Incident timer: ${Math.round(ratio * 100)}% remaining`}
        >
            <div
                className="h-full origin-left bg-amber-500/70 transition-[width] duration-100 linear"
                style={{ width: `${ratio * 100}%` }}
            />
        </div>
    );
});