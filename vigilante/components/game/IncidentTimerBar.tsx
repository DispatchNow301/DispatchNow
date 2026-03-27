"use client";
import React, { useEffect, useRef, useState } from "react";

export const IncidentTimerBar = React.memo(function IncidentTimerBar({
    createdAt,
    expiresAt,
    onExpire,
    paused = false,
}: {
    createdAt: number;
    expiresAt: number;
    onExpire: () => void;
    paused?: boolean;
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

    useEffect(() => {
        if (paused) return;
        const id = window.setInterval(() => {
            const t = Date.now();
            setDisplayNow(t);
            if (!pausedRef.current && t >= expiresAtRef.current) {
                onExpireRef.current();
            }
        }, 100);
        return () => window.clearInterval(id);
    }, [paused]);

    const remainingMs = Math.max(0, expiresAt - displayNow);
    const ratio = Math.max(0, Math.min(1, remainingMs / totalMs));

    return (
        <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-amber-900/40">
            <div
                className="h-full origin-left bg-amber-500/70 transition-[width] duration-100 linear"
                style={{ width: `${ratio * 100}%` }}
            />
        </div>
    );
});