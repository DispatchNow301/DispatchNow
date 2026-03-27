"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ACHIEVEMENTS,
	type AchievementId,
} from "@/lib/achievements";
import type { GameState, AchievementProgress, UnlockedAchievement } from "@/lib/gameTypes";
import { getAchievementProgressText } from "@/lib/achievementTracker";
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
	FaBox,
	FaRadio,
	FaDesktop,
	FaCheckDouble,
	FaUserShield,
	FaTruckMedical,
	FaCloud,
	FaCar,
	FaIndustry,
	FaGem,
	FaSquare,
	FaBuilding,
	FaShield,
	FaBullseye,
	FaBoltLightning,
	FaClock,
	FaUserGroup,
} from "react-icons/fa6";
import { Check } from "lucide-react";

// Map achievement icons to React Icons components
const getAchievementIcon = (achievementId: AchievementId, isUnlocked: boolean) => {
	const iconClass = "w-4 h-4 sm:w-5 sm:h-5 text-amber-400";

	// Icon mapping based on achievement icon emoji
	const iconMap: Record<string, React.ReactNode> = {
	// First Steps
	first_steps: <FaFlag className={iconClass} />,
	first_rescue: <FaTruckMedical className={iconClass} />,
	first_deployment: <FaBox className={iconClass} />,
	first_recruit: <FaUserPlus className={iconClass} />,
	first_credit: <FaMoneyBill className={iconClass} />,

	// Incidents
	dispatcher_10: <FaRadio className={iconClass} />,
	dispatcher_100: <FaRadio className={iconClass} />,
	dispatcher_500: <FaDesktop className={iconClass} />,
	perfect_10: <FaCheckDouble className={iconClass} />,
	fire_specialist: <FaFire className={iconClass} />,
	crime_fighter: <FaUserShield className={iconClass} />,
	medic_hero: <FaTruckMedical className={iconClass} />,
	disaster_response: <FaCloud className={iconClass} />,
	traffic_control: <FaCar className={iconClass} />,
	streak_5: <FaFire className={iconClass} />,
	streak_10: <FaBoltLightning className={iconClass} />,

	// Resources
	millionaire: <FaMoneyBill className={iconClass} />,
	supply_chain: <FaIndustry className={iconClass} />,
	resourceful: <FaGem className={iconClass} />,
	efficient: <FaCheck className={iconClass} />,

	// Vigilantes
	recruiter_5: <FaUserPlus className={iconClass} />,
	recruiter_20: <FaBuilding className={iconClass} />,
	patrol_leader: <FaUsers className={iconClass} />,
	zero_casualties: <FaShield className={iconClass} />,
	vigilante_army: <FaUserGroup className={iconClass} />,

	// Skill
	sharp_eye: <FaBullseye className={iconClass} />,
	flawless: <FaCrown className={iconClass} />,
	quick_response: <FaBoltLightning className={iconClass} />,

	// Persistence
	dedicated: <FaClock className={iconClass} />,
	legacy: <FaTrophy className={iconClass} />,
	};

	return iconMap[achievementId] || <FaSquare className={iconClass} />;
};

interface AchievementsPanelProps {
	gameState: GameState;
}

export default function AchievementsPanel({
	gameState,
}: AchievementsPanelProps) {
	// Stats
	const totalAchievements = Object.keys(ACHIEVEMENTS).length;
	const unlockedCount = gameState.unlockedAchievementIds.length;
	const completionPercentage = Math.round(
		(unlockedCount / totalAchievements) * 100,
	);

	// Get all achievements
	const allAchievements = Object.keys(ACHIEVEMENTS) as AchievementId[];

	return (
		<div className="w-full space-y-8">
			{/* Completion progress bar */}
			<div>
				<div className="flex justify-between text-sm text-amber-200/70 mb-2">
					<span>Overall Completion</span>
					<span>{completionPercentage}%</span>
				</div>
				<div className="h-3 bg-amber-950/40 rounded-full overflow-hidden border border-amber-900/30">
				<motion.div
					className="h-full bg-amber-500"
					initial={false}
					animate={{ width: `${completionPercentage}%` }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				/>
				</div>
			</div>

			{/* Achievements Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<AnimatePresence mode="popLayout">
					{allAchievements.map((achievementId) => {
						const achievement = ACHIEVEMENTS[achievementId];
						const unlockedAchievement = gameState.unlockedAchievementIds.find(
							(a) => a.achievementId === achievementId,
						);
						const isUnlocked = !!unlockedAchievement;
						const progressText = getAchievementProgressText(
							achievementId,
							gameState,
							gameState.achievementProgress,
						);

						return (
							<motion.div
								key={achievementId}
								initial={{ opacity: 0, y: 20, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								whileHover={{
									scale: 1.03,
									transition: {
										type: "spring",
										stiffness: 400,
										damping: 25,
									},
								}}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 30,
								}}
								className={`relative p-4 rounded-xl border cursor-pointer group min-h-[140px] flex flex-col ${
									achievement.hidden
										? "bg-black/20 border-amber-900/20 opacity-50"
										: "bg-black/10 border-amber-900/20 opacity-70 hover:opacity-90 hover:border-amber-800/30"
								}`}
							>
								{/* Lock overlay for hidden/locked achievements */}
								{!isUnlocked && (
									<div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl transition-opacity duration-300 group-hover:opacity-0" />
								)}

								<div className="flex items-center gap-4 flex-1">
									{/* Achievement Icon */}
									<div
										className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border ${
											isUnlocked
												? "bg-amber-900/20 border-amber-800/30"
												: "bg-gray-900/20 border-gray-800/30"
										}`}
									>
										{isUnlocked ? (
											getAchievementIcon(achievementId, true)
										) : (
											<div className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex items-center justify-center">
												?
											</div>
										)}
									</div>

									<div className="flex-1 min-w-0">
										<h3
											className={`font-bold text-sm truncate ${
												isUnlocked
													? "text-amber-100"
													: "text-gray-400"
											}`}
										>
											{achievement.title}
										</h3>

										<p className="text-xs text-amber-200/60 mt-1 line-clamp-2">
											{achievement.description}
										</p>

										{progressText && (
											<div className="mt-2 text-xs font-mono text-amber-300/70">
												{progressText}
											</div>
										)}
										{isUnlocked && unlockedAchievement && (
											<div className="mt-auto pt-2 text-[10px] text-amber-200/40">
												Unlocked {new Date(unlockedAchievement.unlockedAt).toLocaleDateString()}
											</div>
										)}
									</div>
								</div>

								{/* Unlocked indicator */}
								{isUnlocked && (
									<motion.div
										initial={{ opacity: 0, scale: 0 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{
											delay: 0.2,
											type: "spring",
											stiffness: 500,
											damping: 30,
										}}
										className="absolute top-3 right-3 flex items-center justify-center rounded-full bg-emerald-950/55 border border-emerald-700/40 shadow-sm shadow-black/50"
									>
										<Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400/80" strokeWidth={2.75} />
									</motion.div>
								)}
							</motion.div>
						);
					})}
				</AnimatePresence>
			</div>
		</div>
	);
}
