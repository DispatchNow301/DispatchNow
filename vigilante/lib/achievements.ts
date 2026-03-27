/**
 * Achievements system for Vigilante
 * Tracks player accomplishments and triggers notifications
 */

import type { AchievementProgress } from "./gameTypes";

export type AchievementId =
	// First Steps (1-5)
	| "first_steps"
	| "first_rescue"
	| "first_deployment"
	| "first_recruit"
	| "first_credit"

	// Incident Resolution (6-11)
	| "dispatcher_10"
	| "dispatcher_100"
	| "dispatcher_500"
	| "perfect_10"
	| "fire_specialist"
	| "crime_fighter"
	| "medic_hero"
	| "disaster_response"
	| "traffic_control"
	| "streak_5"
	| "streak_10"

	// Resource Mastery (12-15)
	| "millionaire"
	| "supply_chain"
	| "resourceful"
	| "efficient"

	// Vigilante Management (16-20)
	| "recruiter_5"
	| "recruiter_20"
	| "patrol_leader"
	| "zero_casualties"
	| "vigilante_army"

	// Precision & Skill (21-23)
	| "sharp_eye"
	| "flawless"
	| "quick_response"

	// Persistence (24-25)
	| "dedicated"
	| "legacy";

export type Achievement = {
	id: AchievementId;
	title: string;
	description: string;
	icon: string;
	category: "first-steps" | "incidents" | "resources" | "vigilantes" | "skill" | "persistence";
	hidden?: boolean; // Don't show until unlocked
};

export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
	// ============================================
	// FIRST STEPS (1-5)
	// ============================================
	first_steps: {
		id: "first_steps",
		title: "First Steps",
		description: "Complete your first dispatch",
		icon: "👣",
		category: "first-steps",
	},
	first_rescue: {
		id: "first_rescue",
		title: "First Rescue",
		description: "Successfully resolve your first incident",
		icon: "🚑",
		category: "first-steps",
	},
	first_deployment: {
		id: "first_deployment",
		title: "First Deployment",
		description: "Assign resources to an incident for the first time",
		icon: "📦",
		category: "first-steps",
	},
	first_recruit: {
		id: "first_recruit",
		title: "First Recruit",
		description: "Recruit your first vigilante",
		icon: "👤",
		category: "first-steps",
	},
	first_credit: {
		id: "first_credit",
		title: "First Credits",
		description: "Earn 1,000 credits from incidents",
		icon: "💵",
		category: "first-steps",
	},

	// ============================================
	// INCIDENT RESOLUTION (6-11)
	// ============================================
	dispatcher_10: {
		id: "dispatcher_10",
		title: "Dispatcher",
		description: "Complete 10 dispatches",
		icon: "📟",
		category: "incidents",
	},
	dispatcher_100: {
		id: "dispatcher_100",
		title: "Senior Dispatcher",
		description: "Complete 100 dispatches",
		icon: "📻",
		category: "incidents",
	},
	dispatcher_500: {
		id: "dispatcher_500",
		title: "Master Dispatcher",
		description: "Complete 500 dispatches",
		icon: "🖥️",
		category: "incidents",
	},
	perfect_10: {
		id: "perfect_10",
		title: "Perfect 10",
		description: "Achieve 100% success rate on 10 consecutive dispatches",
		icon: "💯",
		category: "incidents",
	},
	fire_specialist: {
		id: "fire_specialist",
		title: "Fire Specialist",
		description: "Successfully resolve 25 fire/rescue incidents",
		icon: "🔥",
		category: "incidents",
	},
	crime_fighter: {
		id: "crime_fighter",
		title: "Crime Fighter",
		description: "Successfully resolve 50 crime incidents",
		icon: "🦹",
		category: "incidents",
	},
	medic_hero: {
		id: "medic_hero",
		title: "Medic Hero",
		description: "Successfully resolve 25 medical emergencies",
		icon: "🚑",
		category: "incidents",
	},
	disaster_response: {
		id: "disaster_response",
		title: "Disaster Response",
		description: "Successfully resolve 10 disaster incidents",
		icon: "🌪️",
		category: "incidents",
	},
	traffic_control: {
		id: "traffic_control",
		title: "Traffic Control",
		description: "Successfully resolve 30 traffic incidents",
		icon: "🚗",
		category: "incidents",
	},
	streak_5: {
		id: "streak_5",
		title: "On Fire",
		description: "Complete 5 dispatches in a row without failures",
		icon: "🔥",
		category: "incidents",
	},
	streak_10: {
		id: "streak_10",
		title: "Unstoppable",
		description: "Complete 10 dispatches in a row without failures",
		icon: "⚡",
		category: "incidents",
	},

	// ============================================
	// RESOURCE MASTERY (12-15)
	// ============================================
	millionaire: {
		id: "millionaire",
		title: "Millionaire",
		description: "Accumulate 1,000,000 credits total",
		icon: "💰",
		category: "resources",
	},
	supply_chain: {
		id: "supply_chain",
		title: "Supply Chain",
		description: "Have 100 of any single resource type in your inventory",
		icon: "🏭",
		category: "resources",
	},
	resourceful: {
		id: "resourceful",
		title: "Resourceful",
		description: "Earn 10,000 credits from a single dispatch (after costs)",
		icon: "💎",
		category: "resources",
	},
	efficient: {
		id: "efficient",
		title: "Efficient Operator",
		description: "Successfully complete a dispatch with no resource loss",
		icon: "✅",
		category: "resources",
	},

	// ============================================
	// VIGILANTE MANAGEMENT (16-20)
	// ============================================
	recruiter_5: {
		id: "recruiter_5",
		title: "Recruiter",
		description: "Recruit 5 different vigilantes",
		icon: "👥",
		category: "vigilantes",
	},
	recruiter_20: {
		id: "recruiter_20",
		title: "Master Recruiter",
		description: "Recruit 20 different vigilantes",
		icon: "🏢",
		category: "vigilantes",
	},
	patrol_leader: {
		id: "patrol_leader",
		title: "Patrol Leader",
		description: "Have 10 vigilantes patrolling simultaneously",
		icon: "🚓",
		category: "vigilantes",
	},
	zero_casualties: {
		id: "zero_casualties",
		title: "Zero Casualties",
		description: "Successfully complete 20 dispatches without any vigilante injuries",
		icon: "🛡️",
		category: "vigilantes",
		hidden: true,
	},
	vigilante_army: {
		id: "vigilante_army",
		title: "Vigilante Army",
		description: "Own 25 vigilantes total",
		icon: "⚔️",
		category: "vigilantes",
	},

	// ============================================
	// PRECISION & SKILL (21-23)
	// ============================================
	sharp_eye: {
		id: "sharp_eye",
		title: "Sharp Eye",
		description: "Achieve 90%+ success rate across 50 dispatches",
		icon: "🎯",
		category: "skill",
	},
	flawless: {
		id: "flawless",
		title: "Flawless Victory",
		description: "Complete a dispatch with 100% success chance and succeed",
		icon: "👑",
		category: "skill",
		hidden: true,
	},
	quick_response: {
		id: "quick_response",
		title: "Quick Response",
		description: "Deploy resources within 10 seconds of incident spawning 50 times",
		icon: "⚡",
		category: "skill",
	},

	// ============================================
	// PERSISTENCE (24-25)
	// ============================================
	dedicated: {
		id: "dedicated",
		title: "Dedicated",
		description: "Play for 24 hours total (cumulative)",
		icon: "⏰",
		category: "persistence",
	},
	legacy: {
		id: "legacy",
		title: "Legacy",
		description: "Complete 1,000 total incidents (all types combined)",
		icon: "🏆",
		category: "persistence",
	},
};

export const getAchievementCategoryLabel = (category: Achievement["category"]): string => {
	switch (category) {
		case "first-steps":
			return "First Steps";
		case "incidents":
			return "Incident Response";
		case "resources":
			return "Resource Management";
		case "vigilantes":
			return "Vigilante Operations";
		case "skill":
			return "Precision & Skill";
		case "persistence":
			return "Persistence";
		default:
			return "Achievements";
	}
};

export const DEFAULT_ACHIEVEMENT_PROGRESS: AchievementProgress = {
	totalCreditsEarned: 0,
	highestSinglePayout: 0,
	currentStreak: 0,
	bestStreak: 0,
	recentResolutions: [],
	dispatchesStarted: 0,
	incidentsByArchetype: {},
	maxResourceInventory: {},
	uniqueVigilantesOwned: new Set(),
	vigilanteInjuries: 0,
	totalPlaytimeMs: 0,
	sessionStartTime: null,
};
