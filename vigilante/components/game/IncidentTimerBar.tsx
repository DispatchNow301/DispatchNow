"use client";

import React, { useRef } from "react";

/** Same shrinking bar as the incident list — uses global `vigilante-timer-drain` keyframes. */
export const IncidentTimerBar = React.memo(function IncidentTimerBar({
	createdAt,
	expiresAt,
	onExpire,
}: {
	createdAt: number;
	expiresAt: number;
	onExpire: () => void;
}) {
	const totalMs = expiresAt - createdAt;
	const delayMs = useRef(createdAt - Date.now()).current;

	return (
		<div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-amber-900/40">
			<div
				style={{
					animationName: "vigilante-timer-drain",
					animationDuration: `${totalMs}ms`,
					animationDelay: `${delayMs}ms`,
					animationTimingFunction: "linear",
					animationFillMode: "forwards",
				}}
				className="h-full w-full origin-left bg-amber-500/70"
				onAnimationEnd={onExpire}
			/>
		</div>
	);
});
