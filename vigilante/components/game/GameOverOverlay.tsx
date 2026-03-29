"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
	AlertTriangle,
	Clock3,
	ShieldAlert,
	Trophy,
	Users,
	XCircle,
} from "lucide-react";

type GameOverCause =
	| "undercover_hired"
	| "too_many_failed_incidents"
	| "crew_wiped"
	| "custom";

type GameOverStats = {
	totalTime?: string;
	completedIncidents?: number;
	failedIncidents?: number; // includes expired incidents
	hiredVigilantes?: number;
	lootedResources?: number;
};

type Props = {
	open: boolean;
	cause: GameOverCause;
	scope?: "local" | "cloud";
	slot?: string;
	customTitle?: string;
	customDescription?: string;
	stats?: GameOverStats;
	onClose?: () => void;
	onQuit?: () => void;
	quitLabel?: string;
};

type RevealStat = {
	label: string;
	value: string | number;
	icon: React.ReactNode;
};

const STAT_REVEAL_MS = 1900;
const STAT_EXIT_BUFFER_MS = 250;

function getCauseCopy(
	cause: GameOverCause,
	customTitle?: string,
	customDescription?: string,
) {
	if (cause === "undercover_hired") {
		return {
			title: "You Let The Police In",
			description:
				"An undercover agent was brought into the crew. Your operation was exposed from the inside before you could recover.",
			accent: "text-red-300",
			Icon: ShieldAlert,
		};
	}

	if (cause === "too_many_failed_incidents") {
		return {
			title: "The City Slipped Away",
			description:
				"Too many incidents were failed or left to expire. Confidence in the crew collapsed and the streets turned against you.",
			accent: "text-amber-300",
			Icon: AlertTriangle,
		};
	}

	if (cause === "crew_wiped") {
		return {
			title: "No One Left To Send",
			description:
				"Your available vigilantes were exhausted, injured, or compromised. The operation could not continue.",
			accent: "text-red-300",
			Icon: XCircle,
		};
	}

	return {
		title: customTitle ?? "Game Over",
		description:
			customDescription ??
			"Your operation collapsed. The streets will remember how it ended.",
		accent: "text-amber-200",
		Icon: AlertTriangle,
	};
}

function StatCard({
	label,
	value,
	icon,
}: {
	label: string;
	value: string | number;
	icon: React.ReactNode;
}) {
	return (
		<div className="rounded-2xl border border-amber-900/35 bg-black/25 p-4">
			<div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-amber-400/70">
				{icon}
				<span>{label}</span>
			</div>
			<div className="mt-3 text-2xl font-bold text-amber-100">
				{value}
			</div>
		</div>
	);
}

export default function GameOverOverlay({
	open,
	cause,
	scope,
	slot,
	customTitle,
	customDescription,
	stats,
	onClose,
	onQuit,
	quitLabel = "Quit",
}: Props) {
	const copy = getCauseCopy(cause, customTitle, customDescription);
	const CauseIcon = copy.Icon;

	// Fallbacks so bad parent props never create broken URLs
	const resolvedScope: "local" | "cloud" =
		scope === "cloud" || scope === "local" ? scope : "local";
	const resolvedSlot =
		slot && slot !== "undefined" && slot !== "null" ? slot : "1";

	const statItems = useMemo<RevealStat[]>(
		() => [
			{
				label: "Total Time",
				value: stats?.totalTime ?? "—",
				icon: <Clock3 className="h-5 w-5" />,
			},
			{
				label: "Completed Incidents",
				value: stats?.completedIncidents ?? 0,
				icon: <Trophy className="h-5 w-5" />,
			},
			{
				label: "Failed / Expired Incidents",
				value: stats?.failedIncidents ?? 0,
				icon: <AlertTriangle className="h-5 w-5" />,
			},
			{
				label: "Hired Vigilantes",
				value: stats?.hiredVigilantes ?? 0,
				icon: <Users className="h-5 w-5" />,
			},
		],
		[stats],
	);

	const [phase, setPhase] = useState<"reveal" | "summary">("reveal");
	const [revealIndex, setRevealIndex] = useState(0);

	useEffect(() => {
		if (!open) return;
		setPhase("reveal");
		setRevealIndex(0);
	}, [open, cause]);

	useEffect(() => {
		if (!open || phase !== "reveal") return;

		if (revealIndex >= statItems.length) {
			const toSummary = window.setTimeout(() => {
				setPhase("summary");
			}, 150);
			return () => window.clearTimeout(toSummary);
		}

		const id = window.setTimeout(() => {
			setRevealIndex((current) => current + 1);
		}, STAT_REVEAL_MS + STAT_EXIT_BUFFER_MS);

		return () => window.clearTimeout(id);
	}, [open, phase, revealIndex, statItems.length]);

	const activeReveal = statItems[Math.min(revealIndex, statItems.length - 1)];

	const handleGoToBlackMarket = () => {
		window.location.href = `/black-market?scope=${resolvedScope}&slot=${resolvedSlot}`;
	};

	return (
		<AnimatePresence>
			{open ? (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 z-[4000] bg-black/80 backdrop-blur-sm"
					/>

					<div className="absolute inset-0 z-[4010]">
						<AnimatePresence mode="wait">
							{phase === "reveal" && activeReveal ? (
								<motion.div
									key={`reveal-${revealIndex}`}
									initial={{ opacity: 0, scale: 0.96, y: 16 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									exit={{ opacity: 0, scale: 1.02, y: -14 }}
									transition={{
										duration: 0.55,
										ease: [0.22, 1, 0.36, 1],
									}}
									className="absolute inset-0 flex items-center justify-center p-6"
								>
									<div className="w-full max-w-3xl text-center">
										<div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-800/35 bg-black/35 text-amber-300">
											{activeReveal.icon}
										</div>

										<div className="mt-8 text-[12px] uppercase tracking-[0.45em] text-amber-400/65">
											{activeReveal.label}
										</div>

										<div className="mt-6 text-7xl font-bold tracking-tight text-amber-50 sm:text-8xl">
											{activeReveal.value}
										</div>

										<div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />
									</div>
								</motion.div>
							) : (
								<motion.div
									key="summary"
									initial={{
										opacity: 0,
										y: 20,
										scale: 0.985,
									}}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: 12, scale: 0.985 }}
									transition={{
										duration: 0.35,
										ease: "easeOut",
									}}
									className="absolute inset-0 flex items-center justify-center p-6"
								>
									<div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-amber-900/40 bg-black/75 text-amber-100 shadow-[0_24px_100px_rgba(0,0,0,0.65)]">
										<div className="border-b border-amber-900/30 bg-gradient-to-b from-amber-950/20 to-transparent px-8 py-7">
											<div className="flex items-start justify-between gap-6">
												<div className="flex items-start gap-4">
													<div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-800/35 bg-black/30">
														<CauseIcon
															className={`h-6 w-6 ${copy.accent}`}
														/>
													</div>

													<div>
														<div className="text-[11px] uppercase tracking-[0.32em] text-amber-400/65">
															Game Over
														</div>
														<h2 className="mt-2 text-4xl font-bold tracking-tight text-amber-50">
															{copy.title}
														</h2>
														<p className="mt-3 max-w-3xl text-base leading-7 text-amber-100/75">
															{copy.description}
														</p>
													</div>
												</div>

												{onClose ? (
													<button
														type="button"
														onClick={onClose}
														className="rounded-xl border border-amber-900/35 bg-black/30 px-4 py-2 text-sm text-amber-200/75 transition hover:bg-amber-950/20 hover:text-amber-100"
													>
														Close
													</button>
												) : null}
											</div>
										</div>

										<div className="px-8 py-7">
											<div className="text-[11px] uppercase tracking-[0.28em] text-amber-400/70">
												Run Summary
											</div>

											<div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
												<StatCard
													label="Total Time"
													value={stats?.totalTime ?? "—"}
													icon={
														<Clock3 className="h-3.5 w-3.5" />
													}
												/>
												<StatCard
													label="Completed Incidents"
													value={stats?.completedIncidents ?? 0}
													icon={
														<Trophy className="h-3.5 w-3.5" />
													}
												/>
												<StatCard
													label="Failed / Expired Incidents"
													value={stats?.failedIncidents ?? 0}
													icon={
														<AlertTriangle className="h-3.5 w-3.5" />
													}
												/>
												<StatCard
													label="Hired Vigilantes"
													value={stats?.hiredVigilantes ?? 0}
													icon={
														<Users className="h-3.5 w-3.5" />
													}
												/>
											</div>
										</div>

										<div className="flex items-center justify-between gap-4 border-t border-amber-900/30 px-8 py-6">
											<div className="text-sm text-amber-100/55">
												The operation is over.
											</div>

											<div className="flex items-center gap-3">
												{onQuit ? (
													<button
														type="button"
														onClick={onQuit}
														className="rounded-2xl border border-amber-900/35 bg-black/30 px-5 py-3 text-sm text-amber-200/75 transition hover:bg-amber-950/20 hover:text-amber-100"
													>
														{quitLabel}
													</button>
												) : null}

												<button
													type="button"
													onClick={handleGoToBlackMarket}
													className="rounded-2xl border border-amber-700/40 bg-amber-950/30 px-6 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-900/35"
												>
													Go To Black Market
												</button>
											</div>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</>
			) : null}
		</AnimatePresence>
	);
}