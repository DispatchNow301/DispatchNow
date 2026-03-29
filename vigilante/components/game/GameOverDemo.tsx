"use client";

import { useState } from "react";
import GameOverOverlay from "@/components/game/GameOverOverlay";

export default function GameOverDemo() {
	const [open, setOpen] = useState(true);
	const [cause, setCause] = useState<
		"undercover_hired" | "too_many_failed_incidents" |  "crew_wiped"
	>("undercover_hired");

	return (
		<div className="relative min-h-screen bg-[#05070a] text-amber-100">
			<div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-6 px-6 py-12">
				<div className="text-center">
					<div className="text-[11px] uppercase tracking-[0.3em] text-amber-400/60">
						Game Over Overlay Demo
					</div>
					<h1 className="mt-3 text-4xl font-bold text-amber-50">
						Vigilante Dispatch
					</h1>
					<p className="mt-3 max-w-2xl text-sm leading-7 text-amber-100/65">
						This page is only for previewing the game over UI before the real
						game-over and black market logic are wired in.
					</p>
				</div>

				<div className="flex flex-wrap items-center justify-center gap-3">
					<button
						type="button"
						onClick={() => {
							setCause("undercover_hired");
							setOpen(true);
						}}
						className="rounded-2xl border border-amber-900/35 bg-black/30 px-4 py-2.5 text-sm text-amber-200/80 transition hover:bg-amber-950/20 hover:text-amber-100"
					>
						Undercover Hired
					</button>

					<button
						type="button"
						onClick={() => {
							setCause("too_many_failed_incidents");
							setOpen(true);
						}}
						className="rounded-2xl border border-amber-900/35 bg-black/30 px-4 py-2.5 text-sm text-amber-200/80 transition hover:bg-amber-950/20 hover:text-amber-100"
					>
						Failed Incidents
					</button>


					<button
						type="button"
						onClick={() => {
							setCause("crew_wiped");
							setOpen(true);
						}}
						className="rounded-2xl border border-amber-900/35 bg-black/30 px-4 py-2.5 text-sm text-amber-200/80 transition hover:bg-amber-950/20 hover:text-amber-100"
					>
						Crew Wiped
					</button>
				</div>

				<div className="rounded-3xl border border-amber-900/30 bg-black/20 px-6 py-5 text-center text-sm text-amber-100/55">
					Close the overlay or switch causes to preview different endings.
				</div>
			</div>

			<GameOverOverlay
				open={open}
				cause={cause}
				onClose={() => setOpen(false)}
				onQuit={() => {
					setOpen(false);
				}}
				onContinue={() => {
					setOpen(false);
				}}
				continueLabel="To Black Market"
				quitLabel="Quit"
				stats={{
					totalTime: "18m 42s",
					completedIncidents: 12,
					failedIncidents: 5,
					hiredVigilantes: 6,
					lootedResources: 14,
				}}
			/>
		</div>
	);
}