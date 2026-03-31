"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
	FaStar,
	FaFire,
	FaBolt,
	FaShieldAlt,
	FaTrophy,
	FaMedal,
	FaUserSecret,
	FaHeartbeat,
	FaClock,
	FaUsers,
	FaBoxOpen,
	FaBroadcastTower,
	FaRoute,
	FaAmbulance,
	FaGavel,
} from "react-icons/fa";
import { ACHIEVEMENTS, type AchievementId } from "@/lib/achievements";

export type QueuedNotification = {
	id: AchievementId;
	unlockedAt: number;
};

interface AchievementNotificationProps {
	queue: QueuedNotification[];
	onDismiss: (id: AchievementId) => void;
}

const AUTO_DISMISS_MS = 5000;

/** Monochromatic react-icon per achievement — same visual language as inventory gear icons */
function AchievementIcon({
	id,
	className,
}: {
	id: AchievementId;
	className?: string;
}) {
	const cls = className ?? "w-5 h-5";
	switch (id) {
		// First Steps
		case "first_steps":
			return <FaStar className={cls} aria-hidden />;
		case "first_rescue":
			return <FaHeartbeat className={cls} aria-hidden />;
		case "first_deployment":
			return <FaBoxOpen className={cls} aria-hidden />;
		case "first_recruit":
			return <FaUserSecret className={cls} aria-hidden />;
		case "first_credit":
			return <FaMedal className={cls} aria-hidden />;
		// Dispatches
		case "dispatcher_10":
			return <FaBroadcastTower className={cls} aria-hidden />;
		case "dispatcher_100":
			return <FaBroadcastTower className={cls} aria-hidden />;
		case "dispatcher_500":
			return <FaBroadcastTower className={cls} aria-hidden />;
		case "perfect_10":
			return <FaTrophy className={cls} aria-hidden />;
		// Archetypes
		case "fire_specialist":
			return <FaFire className={cls} aria-hidden />;
		case "crime_fighter":
			return <FaGavel className={cls} aria-hidden />;
		case "medic_hero":
			return <FaAmbulance className={cls} aria-hidden />;
		case "disaster_response":
			return <FaShieldAlt className={cls} aria-hidden />;
		case "traffic_control":
			return <FaRoute className={cls} aria-hidden />;
		// Streaks
		case "streak_5":
			return <FaBolt className={cls} aria-hidden />;
		case "streak_10":
			return <FaBolt className={cls} aria-hidden />;
		// Resources
		case "millionaire":
			return <FaStar className={cls} aria-hidden />;
		case "supply_chain":
			return <FaBoxOpen className={cls} aria-hidden />;
		case "resourceful":
			return <FaMedal className={cls} aria-hidden />;
		case "efficient":
			return <FaShieldAlt className={cls} aria-hidden />;
		// Vigilantes
		case "recruiter_5":
			return <FaUsers className={cls} aria-hidden />;
		case "recruiter_20":
			return <FaUsers className={cls} aria-hidden />;
		case "patrol_leader":
			return <FaUserSecret className={cls} aria-hidden />;
		case "zero_casualties":
			return <FaShieldAlt className={cls} aria-hidden />;
		case "vigilante_army":
			return <FaUsers className={cls} aria-hidden />;
		// Skill
		case "sharp_eye":
			return <FaBolt className={cls} aria-hidden />;
		case "flawless":
			return <FaTrophy className={cls} aria-hidden />;
		case "quick_response":
			return <FaBolt className={cls} aria-hidden />;
		// Persistence
		case "dedicated":
			return <FaClock className={cls} aria-hidden />;
		case "legacy":
			return <FaTrophy className={cls} aria-hidden />;
		default:
			return <FaStar className={cls} aria-hidden />;
	}
}

export function AchievementNotification({
	queue,
	onDismiss,
}: AchievementNotificationProps) {
	const current = queue[0] ?? null;
	const [visible, setVisible] = useState(false);
	const [activeId, setActiveId] = useState<AchievementId | null>(null);
	const [hovered, setHovered] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	// Track how much time was remaining when hover started
	const remainingMsRef = useRef(AUTO_DISMISS_MS);
	const startedAtRef = useRef<number>(0);

	const clearTimer = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	};

	const scheduleHide = (afterMs: number) => {
		clearTimer();
		startedAtRef.current = Date.now();
		timerRef.current = setTimeout(() => setVisible(false), afterMs);
	};

	// New item at head of queue — reset and start fresh
	useEffect(() => {
		if (!current) {
			setVisible(false);
			clearTimer();
			return;
		}
		setActiveId(current.id);
		setHovered(false);
		setVisible(true);
		remainingMsRef.current = AUTO_DISMISS_MS;
		scheduleHide(AUTO_DISMISS_MS);
		return clearTimer;
	}, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

	// Pause on hover (save remaining), resume on leave (restore remaining)
	useEffect(() => {
		if (!visible) return;
		if (hovered) {
			// Freeze: save how much time was left, cancel the timer
			const elapsed = Date.now() - startedAtRef.current;
			remainingMsRef.current = Math.max(
				0,
				remainingMsRef.current - elapsed,
			);
			clearTimer();
		} else {
			// Resume from where we paused
			scheduleHide(remainingMsRef.current);
		}
		return clearTimer;
	}, [hovered]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleExitComplete = () => {
		if (activeId) {
			onDismiss(activeId);
			setActiveId(null);
		}
	};

	if (!current) return null;
	const achievement = ACHIEVEMENTS[current.id];
	if (!achievement) return null;

	return (
		<div
			className="pointer-events-none"
			style={{ position: "fixed", top: 16, right: 16, zIndex: 99999 }}
		>

			<div
				aria-live="polite"
				aria-atomic="true"
				className="sr-only"
			>
				{visible && achievement
				? `Achievement unlocked: ${achievement.description}`
				: ""
		}
			</div>
			
			<AnimatePresence onExitComplete={handleExitComplete}>
				{visible && (
					<motion.div
						key={current.id}
						initial={{ opacity: 0, y: -12, scale: 0.96 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -8, scale: 0.97 }}
						transition={{ duration: 0.22, ease: "easeOut" }}
						className="pointer-events-auto"
						style={{ cursor: "default" }}
						onMouseEnter={() => setHovered(true)}
						onMouseLeave={() => setHovered(false)}
					>
						{/* Card shell — matches inventory panel exactly */}
						<div
							className="relative overflow-hidden rounded-xl border border-amber-900/40 bg-black/80 shadow-xl shadow-black/60 backdrop-blur-md"
							style={{ width: 300 }}
						>
							{/* Countdown bar — fixed width shrink, pauses when hovered */}
							<motion.div
								key={`bar-${current.id}`}
								className="absolute bottom-0 left-0 h-[2px] bg-amber-700/50"
								initial={{ width: "100%" }}
								animate={{ width: hovered ? undefined : "0%" }}
								transition={
									hovered
										? { duration: 0 }
										: {
												duration:
													remainingMsRef.current /
													1000,
												ease: "linear",
											}
								}
							/>

							{/* Header */}
							<div className="flex items-center justify-between border-b border-amber-900/40 bg-black/70 px-3 py-2">
								<span className="text-[10px] font-medium uppercase tracking-[0.22em] text-amber-400/70 select-none">
									Achievement Unlocked
								</span>
								<button
									type="button"
									onClick={() => setVisible(false)}
									className="cursor-pointer rounded-lg border border-amber-900/35 bg-black/30 p-1 text-amber-200/60 transition-colors hover:bg-amber-950/20 hover:text-amber-100"
									aria-label="Dismiss"
								>
									<X className="h-3 w-3" />
								</button>
							</div>

							{/* Body: icon tile + text — tile is identical to inventory resource tile */}
							<div className="flex items-center gap-3 px-3 py-3">
								{/*
									Tile: h-12 w-12 rounded-2xl border-amber-900/45 bg-black/35
									— identical to inventory resource/buff tiles
								*/}
								<div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-900/45 bg-black/35 text-amber-200/85">
									<AchievementIcon
										id={current.id}
										className="w-5 h-5"
									/>
								</div>

								<div className="min-w-0 flex-1">
									<div className="truncate text-[13px] font-semibold text-amber-100">
										{achievement.title}
									</div>
									<p className="mt-0.5 text-[11px] leading-relaxed text-amber-300/65 line-clamp-2">
										{achievement.description}
									</p>
								</div>
							</div>

							{queue.length > 1 && (
								<div className="border-t border-amber-900/30 px-3 py-1.5 text-right text-[10px] text-amber-400/45">
									+{queue.length - 1} more
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
