"use client";

/**
 * Shared game state management utilities.
 * Provides functions for initializing, loading, saving, and restarting game state.
 */

import {
	DEFAULT_RESOURCE_POOL,
	type ResourcePoolEntry,
} from "@/lib/resourcePool";
import {
	DEFAULT_CAREER_STATS,
	mergeCareerStats,
	type CareerStats,
} from "@/lib/careerStats";
import { mergePurchasedBuffIds } from "@/lib/purchasedBuffs";
import { DEFAULT_ACHIEVEMENT_PROGRESS, type AchievementProgress } from "@/lib/achievements";
import type { GameState, UnlockedAchievement, Incident, AssignedResource, IncidentResolution, RecruitLead } from "@/lib/gameTypes";

export function initialState(): GameState {
	return {
		level: 1,
		selectedIncidentId: null,
		incidents: [],
		showIncidentPanel: true,
		showMinigamePanel: false,
		showPolicePanel: false,
		showOptionsPanel: false,
		showInventoryPanel: true,
		inventoryTab: "vigilantes",
		ownedVigilanteIds: ["bruce", "parya"],
		recruitLeads: [],
		consumedTheftSiteIds: [],
		resourcePool: { ...DEFAULT_RESOURCE_POOL },
		credits: 500,
		purchasedUpgradeIds: [],
		vigilanteInjuryUntil: {},
		careerStats: { ...DEFAULT_CAREER_STATS },
		purchasedBuffIds: mergePurchasedBuffIds(undefined),
		unlockedAchievementIds: [],
		achievementProgress: {
			...DEFAULT_ACHIEVEMENT_PROGRESS,
			uniqueVigilantesOwned: new Set(["bruce", "parya"]),
			sessionStartTime: Date.now(),
		},
		activeMinigame: null,
		reputation: 100,
		showCitizensNearIncidents: true,
	};
}

function pruneExpiredInjuries(
	injuries: Record<string, number> | undefined,
	now: number,
): Record<string, number> {
	if (!injuries) return {};
	const out: Record<string, number> = {};
	for (const [id, until] of Object.entries(injuries)) {
		if (typeof until === "number" && until > now) out[id] = until;
	}
	return out;
}

export function loadState(saveKey: string): GameState {
	try {
		const raw = localStorage.getItem(saveKey);
		if (!raw) return initialState();
		const p = JSON.parse(raw) as Partial<GameState>;

		const now = Date.now();

		// Load achievement progress
		let achievementProgress: AchievementProgress = {
			...DEFAULT_ACHIEVEMENT_PROGRESS,
		};
		if (p.achievementProgress) {
			const ap = p.achievementProgress;
			achievementProgress = {
				totalCreditsEarned:
					typeof ap.totalCreditsEarned === "number"
						? Math.max(0, ap.totalCreditsEarned)
						: 0,
				highestSinglePayout:
					typeof ap.highestSinglePayout === "number"
						? Math.max(0, ap.highestSinglePayout)
						: 0,
				currentStreak:
					typeof ap.currentStreak === "number"
						? Math.max(0, ap.currentStreak)
						: 0,
				bestStreak:
					typeof ap.bestStreak === "number"
						? Math.max(0, ap.bestStreak)
						: 0,
				recentResolutions: Array.isArray(ap.recentResolutions)
					? ap.recentResolutions
					: [],
				dispatchesStarted:
					typeof ap.dispatchesStarted === "number"
						? Math.max(0, ap.dispatchesStarted)
						: 0,
				incidentsByArchetype:
					typeof ap.incidentsByArchetype === "object"
						? ap.incidentsByArchetype
						: {},
				maxResourceInventory:
					typeof ap.maxResourceInventory === "object"
						? ap.maxResourceInventory
						: {},
				uniqueVigilantesOwned:
					p.ownedVigilanteIds && Array.isArray(p.ownedVigilanteIds)
						? new Set(p.ownedVigilanteIds as string[])
						: new Set(["bruce", "parya"]),
				vigilanteInjuries:
					typeof ap.vigilanteInjuries === "number"
						? Math.max(0, ap.vigilanteInjuries)
						: 0,
				totalPlaytimeMs:
					typeof ap.totalPlaytimeMs === "number"
						? Math.max(0, ap.totalPlaytimeMs)
						: 0,
				sessionStartTime:
					typeof ap.sessionStartTime === "number"
						? ap.sessionStartTime
						: Date.now(),
			};
		}

		// Determine active tab for panel visibility and selectedIncidentId
		const rawShowIncidentPanel =
			typeof p.showIncidentPanel === "boolean"
				? p.showIncidentPanel
				: true;
		const rawShowMinigamePanel =
			typeof p.showMinigamePanel === "boolean"
				? p.showMinigamePanel
				: false;
		const rawShowPolicePanel =
			typeof p.showPolicePanel === "boolean" ? p.showPolicePanel : false;

		const activeLeftTab = rawShowMinigamePanel
			? "minigame"
			: rawShowPolicePanel
				? "police"
				: rawShowIncidentPanel
					? "incident"
					: null;

		const selectedFromSave =
			typeof p.selectedIncidentId === "string"
				? p.selectedIncidentId
				: null;

		const ownedVigilanteIds = Array.isArray(p.ownedVigilanteIds)
			? p.ownedVigilanteIds
			: ["bruce", "parya"];

		// Ensure uniqueVigilantesOwned reflects owned vigilantes
		ownedVigilanteIds.forEach((id) => {
			achievementProgress.uniqueVigilantesOwned.add(id);
		});

		// Parse stored incidents
		function parseStoredIncident(raw: unknown): Incident | null {
			if (!raw || typeof raw !== "object") return null;
			const o = raw as Record<string, unknown>;
			const category = o.category as any;
			if (!category) return null;
			return {
				id: typeof o.id === "string" ? o.id : crypto.randomUUID(),
				category,
				typeLabel: typeof o.typeLabel === "string" ? o.typeLabel : "",
				status: ["active", "resolving", "resolved"].includes(o.status as string)
					? (o.status as Incident["status"])
					: ("active" as const),
				lat: typeof o.lat === "number" ? o.lat : 0,
				lng: typeof o.lng === "number" ? o.lng : 0,
				title: typeof o.title === "string" ? o.title : "",
				summary: typeof o.summary === "string" ? o.summary : "",
				createdAt: typeof o.createdAt === "number" ? o.createdAt : Date.now(),
				expiresAt: typeof o.expiresAt === "number" ? o.expiresAt : Date.now(),
				successChance: typeof o.successChance === "number" ? o.successChance : 50,
				assignedResources: Array.isArray(o.assignedResources)
					? (o.assignedResources as AssignedResource[])
					: [],
				deployedResourceIds: Array.isArray(o.deployedResourceIds)
					? (o.deployedResourceIds as string[])
					: undefined,
				deployedVigilanteIds: Array.isArray(o.deployedVigilanteIds)
					? (o.deployedVigilanteIds as string[])
					: undefined,
				resolution: o.resolution && typeof o.resolution === "object"
					? (o.resolution as IncidentResolution)
					: undefined,
			};
		}

		const state: GameState = {
			level:
				typeof p.level === "number" && p.level >= 1 && p.level <= 3
					? p.level
					: 1,
			selectedIncidentId: activeLeftTab === "incident" ? selectedFromSave : null,
			incidents: Array.isArray(p.incidents)
				? p.incidents
						.map(parseStoredIncident)
						.filter((x): x is Incident => x !== null)
				: [],
			showIncidentPanel: activeLeftTab === "incident",
			showMinigamePanel: activeLeftTab === "minigame",
			showPolicePanel: activeLeftTab === "police",
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
			ownedVigilanteIds,
			recruitLeads: Array.isArray(p.recruitLeads)
				? (p.recruitLeads as RecruitLead[])
				: [],
			consumedTheftSiteIds: Array.isArray(p.consumedTheftSiteIds)
				? (p.consumedTheftSiteIds as string[]).filter(
						(id): id is string => typeof id === "string",
					)
				: [],
			resourcePool: (() => {
				const merged: Record<string, ResourcePoolEntry> = { ...DEFAULT_RESOURCE_POOL };
				if (p.resourcePool && typeof p.resourcePool === "object") {
					for (const [k, v] of Object.entries(p.resourcePool)) {
						if (!v || typeof v !== "object") continue;
						const e = v as Record<string, unknown>;
						if (typeof e.qty !== "number" || typeof e.deployed !== "number") continue;
						const qty = Math.max(0, e.qty);
						merged[k] = { qty, deployed: Math.max(0, Math.min(e.deployed, qty)) };
					}
				}
				return merged;
			})(),
			credits:
				typeof p.credits === "number" && Number.isFinite(p.credits)
					? Math.max(0, Math.floor(p.credits))
					: 500,
			vigilanteInjuryUntil: pruneExpiredInjuries(
				p.vigilanteInjuryUntil as Record<string, number> | undefined,
				now,
			),
			careerStats: mergeCareerStats(p.careerStats),
			purchasedUpgradeIds: Array.isArray(p.purchasedUpgradeIds)
				? (p.purchasedUpgradeIds as string[])
				: [],
			purchasedBuffIds: mergePurchasedBuffIds(p.purchasedBuffIds),
			unlockedAchievementIds: Array.isArray(p.unlockedAchievementIds)
				? (
						p.unlockedAchievementIds as
							| string[]
							| UnlockedAchievement[]
					).map((a) =>
						typeof a === "string"
							? { achievementId: a, unlockedAt: Date.now() }
							: a,
					)
				: [],
			achievementProgress,
			activeMinigame: null,
			reputation:
				typeof p.reputation === "number"
					? Math.max(0, Math.min(100, p.reputation))
					: 50,
			showCitizensNearIncidents:
				typeof p.showCitizensNearIncidents === "boolean"
					? p.showCitizensNearIncidents
					: true,
		};

		return state;
	} catch {
		console.error("Failed to load game state");
		return initialState();
	}
}

export function saveState(saveKey: string, state: GameState) {
	localStorage.setItem(saveKey, JSON.stringify(state));
}

/**
 * Restart the run while preserving purchased resources, buffs, and credits.
 * Resets all run-specific state (incidents, vigilantes, panels, etc.) to initial.
 */
export function restartRun(saveKey: string) {
	// Load current state
	const current = loadState(saveKey);

	// Create fresh initial state
	const fresh = initialState();

	// Preserve shared fields
	// Reset deployed counts to 0 while keeping quantities
	const resetResourcePool: Record<string, ResourcePoolEntry> = {};
	for (const [id, entry] of Object.entries(current.resourcePool)) {
		resetResourcePool[id] = { qty: entry.qty, deployed: 0 };
	}

	const preserved: GameState = {
		...fresh,
		credits: current.credits,
		resourcePool: resetResourcePool,
		purchasedUpgradeIds: current.purchasedUpgradeIds,
		purchasedBuffIds: current.purchasedBuffIds,
		// Preserve cumulative career stats that should persist across runs
		careerStats: {
			...fresh.careerStats,
			// Keep totals from current
			dispatchesCompleted: current.careerStats.dispatchesCompleted,
			incidentsResolvedSuccess: current.careerStats.incidentsResolvedSuccess,
			incidentsResolvedFailure: current.careerStats.incidentsResolvedFailure,
			incidentsExpired: current.careerStats.incidentsExpired,
			vigilantesRecruited: current.careerStats.vigilantesRecruited,
			totalPlaytimeMs: current.careerStats.totalPlaytimeMs,
		},
		// Preserve unlocked achievements
		unlockedAchievementIds: current.unlockedAchievementIds,
		// Preserve cumulative achievement progress (but reset session-specific fields)
		achievementProgress: {
			...current.achievementProgress,
			currentStreak: 0,
			recentResolutions: [],
			sessionStartTime: Date.now(),
		},
		// Reset reputation to full (100) for new run
		reputation: 100,
		// Reset owned vigilantes to starting crew only
		ownedVigilanteIds: ["bruce", "parya"],
		// Reset recruit leads
		recruitLeads: [],
		// Reset vigilante injuries
		vigilanteInjuryUntil: {},
	};

	// Save the preserved state
	saveState(saveKey, preserved);

	return preserved;
}
