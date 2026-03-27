"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth";
import MenuBackground from "../../components/menu/MenuBackground";
import RainLayer from "../../components/menu/RainLayer";
import AchievementsPanel from "../../components/profile/AchievementsPanel";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchGameSave } from "../../lib/cloudSaves";
import { mergeCareerStats, DEFAULT_CAREER_STATS } from "../../lib/careerStats";
import {
	ACHIEVEMENTS,
	DEFAULT_ACHIEVEMENT_PROGRESS,
} from "../../lib/achievements";
import type { UnlockedAchievement, GameState } from "../../lib/gameTypes";
import {
	FaFlag,
	FaCheck,
	FaXmark,
	FaUserPlus,
	FaUsers,
	FaMoneyBill,
	FaFire,
	FaTrophy,
	FaCrown,
} from "react-icons/fa6";

// Define types locally (GameState is not exported from other modules)
type CareerStats = {
	dispatchesCompleted: number;
	incidentsResolvedSuccess: number;
	incidentsResolvedFailure: number;
	incidentsExpired: number;
	vigilantesRecruited: number;
};

type AchievementProgress = {
	totalCreditsEarned: number;
	highestSinglePayout: number;
	currentStreak: number;
	bestStreak: number;
	recentResolutions: number[];
	dispatchesStarted: number;
	incidentsByArchetype: Record<string, number>;
	maxResourceInventory: Record<string, number>;
	uniqueVigilantesOwned: Set<string>;
	vigilanteInjuries: number;
	totalPlaytimeMs: number;
	sessionStartTime: number | null;
};

// Helper to load state from localStorage
function loadState(saveKey: string): GameState | null {
	try {
		const raw = localStorage.getItem(saveKey);
		if (!raw) return null;
		const p = JSON.parse(raw) as Partial<GameState>;
		if (!p.achievementProgress || !p.unlockedAchievementIds) return null;

		return {
			level:
				typeof p.level === "number" && p.level >= 1 && p.level <= 3
					? p.level
					: 1,
			selectedIncidentId:
				typeof p.selectedIncidentId === "string"
					? p.selectedIncidentId
					: null,
			incidents: Array.isArray(p.incidents) ? p.incidents : [],
			showIncidentPanel:
				typeof p.showIncidentPanel === "boolean"
					? p.showIncidentPanel
					: true,
			showMinigamePanel:
				typeof p.showMinigamePanel === "boolean"
					? p.showMinigamePanel
					: false,
			showPolicePanel:
				typeof p.showPolicePanel === "boolean"
					? p.showPolicePanel
					: false,
			showInventoryPanel:
				typeof p.showInventoryPanel === "boolean"
					? p.showInventoryPanel
					: true,
			inventoryTab:
				p.inventoryTab === "vigilantes" ||
				p.inventoryTab === "resources" ||
				p.inventoryTab === "buffs"
					? p.inventoryTab
					: "vigilantes",
			ownedVigilanteIds: Array.isArray(p.ownedVigilanteIds)
				? p.ownedVigilanteIds
				: [],
			recruitLeads: Array.isArray(p.recruitLeads) ? p.recruitLeads : [],
			resourcePool:
				typeof p.resourcePool === "object" ? p.resourcePool : {},
			credits:
				typeof p.credits === "number" && Number.isFinite(p.credits)
					? Math.max(0, Math.floor(p.credits))
					: 0,
			purchasedUpgradeIds: Array.isArray(p.purchasedUpgradeIds)
				? p.purchasedUpgradeIds
				: [],
			vigilanteInjuryUntil:
				typeof p.vigilanteInjuryUntil === "object"
					? p.vigilanteInjuryUntil
					: {},
			careerStats:
				typeof p.careerStats === "object"
					? mergeCareerStats(p.careerStats)
					: DEFAULT_CAREER_STATS,
			purchasedBuffIds: Array.isArray(p.purchasedBuffIds)
				? p.purchasedBuffIds
				: [],
			unlockedAchievementIds: Array.isArray(p.unlockedAchievementIds)
				? (p.unlockedAchievementIds as string[] | UnlockedAchievement[]).map((a) =>
						typeof a === "string"
							? { achievementId: a, unlockedAt: Date.now() }
							: a
				  )
				: [],
			achievementProgress:
				typeof p.achievementProgress === "object"
					? p.achievementProgress
					: DEFAULT_ACHIEVEMENT_PROGRESS,
		};
	} catch {
		return null;
	}
}

export default function ProfilePage() {
	const router = useRouter();
	const { user, signOut } = useAuth();

	const [displayState, setDisplayState] = useState<GameState>({
		level: 1,
		selectedIncidentId: null,
		incidents: [],
		showIncidentPanel: true,
		showMinigamePanel: false,
		showPolicePanel: false,
		showInventoryPanel: true,
		inventoryTab: "vigilantes",
		ownedVigilanteIds: ["bruce", "parya"],
		recruitLeads: [],
		resourcePool: {},
		credits: 500,
		purchasedUpgradeIds: [],
		vigilanteInjuryUntil: {},
		careerStats: DEFAULT_CAREER_STATS,
		purchasedBuffIds: [],
		unlockedAchievementIds: [],
		achievementProgress: DEFAULT_ACHIEVEMENT_PROGRESS,
	});

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadFromSlots = async () => {
			setLoading(true);
			try {
				const slots: Array<{
					scope: "local" | "cloud";
					index: 1 | 2 | 3;
				}> = [
					{ scope: "local", index: 1 },
					{ scope: "local", index: 2 },
					{ scope: "local", index: 3 },
				];
				if (user) {
					slots.push(
						{ scope: "cloud", index: 1 },
						{ scope: "cloud", index: 2 },
						{ scope: "cloud", index: 3 },
					);
				}

				let mostRecentState: GameState | null = null;
				let mostRecentDate = 0;

				for (const slot of slots) {
					let state: GameState | null = null;
					let lastModified = 0;

					if (slot.scope === "local") {
						const saveKey = `vigilante:singleplayer:local:${slot.index}:streetmap`;
						state = loadState(saveKey);
						if (state) {
							try {
								const metaKey = `vigilante:save:local:${slot.index}`;
								const metaRaw = localStorage.getItem(metaKey);
								if (metaRaw) {
									const meta = JSON.parse(metaRaw);
									if (meta.updatedAt)
										lastModified = meta.updatedAt;
								}
							} catch {}
						}
					} else if (user && slot.scope === "cloud") {
						try {
							const cloudRow = await fetchGameSave(
								user.id,
								slot.index,
							);
							if (cloudRow) {
								const p = cloudRow.state as Partial<GameState>;
								if (
									p.achievementProgress &&
									p.unlockedAchievementIds
								) {
									state = {
										level:
											typeof p.level === "number" &&
											p.level >= 1 &&
											p.level <= 3
												? p.level
												: 1,
										selectedIncidentId:
											typeof p.selectedIncidentId ===
											"string"
												? p.selectedIncidentId
												: null,
										incidents: Array.isArray(p.incidents)
											? p.incidents
											: [],
										showIncidentPanel:
											typeof p.showIncidentPanel ===
											"boolean"
												? p.showIncidentPanel
												: true,
										showMinigamePanel:
											typeof p.showMinigamePanel ===
											"boolean"
												? p.showMinigamePanel
												: false,
										showPolicePanel:
											typeof p.showPolicePanel ===
											"boolean"
												? p.showPolicePanel
												: false,
										showInventoryPanel:
											typeof p.showInventoryPanel ===
											"boolean"
												? p.showInventoryPanel
												: true,
										inventoryTab:
											p.inventoryTab === "vigilantes" ||
											p.inventoryTab === "resources" ||
											p.inventoryTab === "buffs"
												? p.inventoryTab
												: "vigilantes",
										ownedVigilanteIds: Array.isArray(
											p.ownedVigilanteIds,
										)
											? p.ownedVigilanteIds
											: [],
										recruitLeads: Array.isArray(
											p.recruitLeads,
										)
											? p.recruitLeads
											: [],
										resourcePool:
											typeof p.resourcePool === "object"
												? p.resourcePool
												: {},
										credits:
											typeof p.credits === "number" &&
											Number.isFinite(p.credits)
												? Math.max(
														0,
														Math.floor(p.credits),
													)
												: 0,
										purchasedUpgradeIds: Array.isArray(
											p.purchasedUpgradeIds,
										)
											? p.purchasedUpgradeIds
											: [],
										vigilanteInjuryUntil:
											typeof p.vigilanteInjuryUntil ===
											"object"
												? p.vigilanteInjuryUntil
												: {},
										careerStats:
											typeof p.careerStats === "object"
												? mergeCareerStats(
														p.careerStats,
													)
												: DEFAULT_CAREER_STATS,
										purchasedBuffIds: Array.isArray(
											p.purchasedBuffIds,
										)
											? p.purchasedBuffIds
											: [],
										unlockedAchievementIds: Array.isArray(
											p.unlockedAchievementIds,
										)
											? (p.unlockedAchievementIds as string[] | UnlockedAchievement[]).map((a) =>
													typeof a === "string"
														? { achievementId: a, unlockedAt: Date.now() }
														: a
											  )
											: [],
										achievementProgress:
											typeof p.achievementProgress ===
											"object"
												? p.achievementProgress
												: DEFAULT_ACHIEVEMENT_PROGRESS,
									};
								}
								if (cloudRow.updated_at)
									lastModified = Date.parse(
										cloudRow.updated_at,
									);
							}
						} catch (e) {
							console.warn(
								"Failed to load cloud save for slot",
								slot.index,
								e,
							);
						}
					}

					if (state && lastModified > mostRecentDate) {
						mostRecentDate = lastModified;
						mostRecentState = state;
					}
				}

				if (mostRecentState) setDisplayState(mostRecentState);
			} catch (error) {
				console.error("Failed to load game state:", error);
			} finally {
				setLoading(false);
			}
		};

		loadFromSlots();
	}, [user]);

	return (
		<div className="min-h-screen relative bg-black/80 overflow-x-hidden">
			<MenuBackground />
			<RainLayer />

			{/* Header - Just Vigilante title */}
			<header className="sticky top-0 z-20 py-4">
				<Link
					href="/"
					className="px-4 sm:px-6 text-2xl font-bold text-amber-200/90 hover:text-amber-100 transition-colors cursor-pointer"
					style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
				>
					Vigilante
				</Link>
			</header>

			{/* Main content */}
			<main className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 pb-24 pt-6 space-y-8">
				{/* Career Stats - always visible with animation */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					className="p-4 sm:p-6 rounded-xl bg-black/20 border border-amber-900/30"
				>
					<h2
						className="text-xl font-bold text-amber-100 mb-4"
						style={{
							fontFamily: "Georgia, 'Times New Roman', serif",
						}}
					>
						Career Statistics
					</h2>

					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
							className="text-center p-2 sm:p-3 bg-black/20 rounded-lg border border-amber-900/30 flex flex-col justify-center"
						>
							<div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
								<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-amber-900/20 border border-amber-800/30">
									<FaFlag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
								</div>
							</div>
							<div className="text-lg sm:text-2xl font-bold text-amber-300">
								{displayState.careerStats.dispatchesCompleted}
							</div>
							<div className="text-xs text-amber-200/60 uppercase tracking-wide mt-1">
								Total Dispatches
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 30 }}
							className="text-center p-2 sm:p-3 bg-black/20 rounded-lg border border-amber-900/30 flex flex-col justify-center"
						>
							<div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
								<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-amber-900/20 border border-amber-800/30">
									<FaCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
								</div>
							</div>
							<div className="text-lg sm:text-2xl font-bold text-amber-300">
								{
									displayState.careerStats
										.incidentsResolvedSuccess
								}
							</div>
							<div className="text-xs text-amber-200/60 uppercase tracking-wide mt-1">
								Successes
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
							className="text-center p-2 sm:p-3 bg-black/20 rounded-lg border border-amber-900/30 flex flex-col justify-center"
						>
							<div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
								<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-amber-900/20 border border-amber-800/30">
									<FaXmark className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
								</div>
							</div>
							<div className="text-lg sm:text-2xl font-bold text-amber-300">
								{
									displayState.careerStats
										.incidentsResolvedFailure
								}
							</div>
							<div className="text-xs text-amber-200/60 uppercase tracking-wide mt-1">
								Failures
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.35, type: "spring", stiffness: 300, damping: 30 }}
							className="text-center p-2 sm:p-3 bg-black/20 rounded-lg border border-amber-900/30 flex flex-col justify-center"
						>
							<div className="flex items-center justify-center gap-2 mb-1">
								<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-amber-900/20 border border-amber-800/30">
									<FaCrown className="w-4 h-4 sm:h-5 text-amber-400" />
								</div>
							</div>
							<div className="text-lg sm:text-2xl font-bold text-amber-300">
								{displayState.achievementProgress.bestStreak}
							</div>
							<div className="text-xs text-amber-200/60 uppercase tracking-wide mt-1">
								Best Streak
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.45, type: "spring", stiffness: 300, damping: 30 }}
							className="text-center p-2 sm:p-3 bg-black/20 rounded-lg border border-amber-900/30 flex flex-col justify-center"
						>
							<div className="flex items-center justify-center gap-2 mb-1">
								<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-amber-900/20 border border-amber-800/30">
									<FaTrophy className="w-4 h-4 sm:h-5 text-amber-400" />
								</div>
							</div>
							<div className="text-lg sm:text-2xl font-bold text-amber-300">
								{displayState.unlockedAchievementIds.length}/
								{Object.keys(ACHIEVEMENTS).length}
							</div>
							<div className="text-xs text-amber-200/60 uppercase tracking-wide mt-1">
								Achievements
							</div>
						</motion.div>
					</div>
				</motion.div>

				{/* Achievements */}
				{/* Loading state handled silently - demo state shows immediately */}
				<AchievementsPanel gameState={displayState} />
			</main>
		</div>
	);
}
