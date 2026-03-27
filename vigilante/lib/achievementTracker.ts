/**
 * Achievement tracking and checking system
 * Monitors game state changes and unlocks achievements as conditions are met
 */

import { type AchievementId } from "./achievements";
import type { GameState, AchievementProgress, UnlockedAchievement } from "./gameTypes";

export type UnlockedAchievement = {
	achievementId: AchievementId;
	unlockedAt: number;
};

/**
 * Check which achievements are currently unlocked based on game state.
 * Returns only newly unlocked IDs (not already in unlockedAchievementIds).
 */
export function checkAchievements(
	state: GameState,
	progress: AchievementProgress,
): UnlockedAchievement[] {
	const alreadyUnlocked = new Set(
		state.unlockedAchievementIds.map((a) => a.achievementId),
	);
	const newlyUnlocked: UnlockedAchievement[] = [];

	const tryUnlock = (id: AchievementId): boolean => {
		if (alreadyUnlocked.has(id)) return false;
		alreadyUnlocked.add(id);
		newlyUnlocked.push({ achievementId: id, unlockedAt: Date.now() });
		return true;
	};

	// ── First Steps ───────────────────────────────────────────────────────────
	if (state.careerStats.dispatchesCompleted >= 1) {
		tryUnlock("first_steps");
		tryUnlock("first_deployment"); // any dispatch implies a deployment
	}
	if (state.careerStats.incidentsResolvedSuccess >= 1) {
		tryUnlock("first_rescue");
	}
	if (state.careerStats.vigilantesRecruited >= 1) {
		tryUnlock("first_recruit");
	}
	if (progress.totalCreditsEarned >= 1000) {
		tryUnlock("first_credit");
	}

	// ── Dispatches ────────────────────────────────────────────────────────────
	if (state.careerStats.dispatchesCompleted >= 10) tryUnlock("dispatcher_10");
	if (state.careerStats.dispatchesCompleted >= 100)
		tryUnlock("dispatcher_100");
	if (state.careerStats.dispatchesCompleted >= 500)
		tryUnlock("dispatcher_500");

	// ── Streaks ───────────────────────────────────────────────────────────────
	if (progress.bestStreak >= 5) tryUnlock("streak_5");
	if (progress.bestStreak >= 10) {
		tryUnlock("streak_10");
		tryUnlock("perfect_10");
	}

	// ── Archetype specialists ─────────────────────────────────────────────────
	if ((progress.incidentsByArchetype["fire_rescue"] ?? 0) >= 25)
		tryUnlock("fire_specialist");
	if ((progress.incidentsByArchetype["crime"] ?? 0) >= 50)
		tryUnlock("crime_fighter");
	if ((progress.incidentsByArchetype["medical"] ?? 0) >= 25)
		tryUnlock("medic_hero");
	if ((progress.incidentsByArchetype["disaster"] ?? 0) >= 10)
		tryUnlock("disaster_response");
	if ((progress.incidentsByArchetype["traffic"] ?? 0) >= 30)
		tryUnlock("traffic_control");

	// ── Resources ────────────────────────────────────────────────────────────
	if (progress.totalCreditsEarned >= 1_000_000) tryUnlock("millionaire");
	if (progress.highestSinglePayout >= 10_000) tryUnlock("resourceful");
	if (
		Object.values(progress.maxResourceInventory).some((qty) => qty >= 100)
	) {
		tryUnlock("supply_chain");
	}

	// ── Vigilante management ──────────────────────────────────────────────────
	if (state.careerStats.vigilantesRecruited >= 5) tryUnlock("recruiter_5");
	if (state.careerStats.vigilantesRecruited >= 20) tryUnlock("recruiter_20");
	if (progress.uniqueVigilantesOwned.size >= 25) tryUnlock("vigilante_army");

	const activeVigilanteCount = state.ownedVigilanteIds.filter(
		(id) => !(id in state.vigilanteInjuryUntil),
	).length;
	if (activeVigilanteCount >= 10) tryUnlock("patrol_leader");

	if (
		progress.vigilanteInjuries === 0 &&
		state.careerStats.dispatchesCompleted >= 20
	) {
		tryUnlock("zero_casualties");
	}

	// ── Precision & skill ─────────────────────────────────────────────────────
	const totalDispatches = state.careerStats.dispatchesCompleted;
	if (totalDispatches >= 50) {
		const successRate =
			state.careerStats.incidentsResolvedSuccess / totalDispatches;
		if (successRate >= 0.9) tryUnlock("sharp_eye");
	}

	// quick_response: tracked via recentResolutions array length
	if (progress.recentResolutions.length >= 50) tryUnlock("quick_response");

	// ── Persistence ───────────────────────────────────────────────────────────
	if (progress.totalPlaytimeMs >= 86_400_000) tryUnlock("dedicated");

	const totalResolved =
		state.careerStats.incidentsResolvedSuccess +
		state.careerStats.incidentsResolvedFailure;
	if (totalResolved >= 1000) tryUnlock("legacy");

	return newlyUnlocked;
}

/**
 * Compute a new AchievementProgress snapshot after a game event.
 * Pure function — never mutates the input.
 */
export function updateAchievementProgress(
	progress: AchievementProgress,
	event: {
		type:
			| "incident_spawned"
			| "deployment_made"
			| "incident_resolved"
			| "vigilante_recruited"
			| "resource_change"
			| "session_tick"
			| "vigilante_injured"
			| "vigilante_recovered"
			| "credit_earned";
		data?: {
			archetype?: string;
			success?: boolean;
			resources?: string[];
			credits?: number;
			vigilanteId?: string;
			quantities?: Record<string, number>;
			deploymentTimeMs?: number;
			incidentSpawnTime?: number;
		};
	},
): AchievementProgress {
	// Shallow-copy scalars; deep-copy reference types so React detects changes
	const next: AchievementProgress = {
		...progress,
		incidentsByArchetype: { ...progress.incidentsByArchetype },
		maxResourceInventory: { ...progress.maxResourceInventory },
		recentResolutions: [...progress.recentResolutions],
		// FIX: always create a new Set so React sees a changed reference
		uniqueVigilantesOwned: new Set(progress.uniqueVigilantesOwned),
	};

	switch (event.type) {
		case "incident_spawned": {
			next.dispatchesStarted += 1;
			break;
		}

		case "deployment_made": {
			// Only count as a "quick response" if deployed within 10 s of spawn
			const { deploymentTimeMs } = event.data ?? {};
			if (deploymentTimeMs !== undefined && deploymentTimeMs <= 10_000) {
				next.recentResolutions.push(Date.now());
				// Cap at 200 entries so the array doesn't grow forever
				if (next.recentResolutions.length > 200) {
					next.recentResolutions = next.recentResolutions.slice(-200);
				}
			}
			break;
		}

		case "incident_resolved": {
			const { archetype, success } = event.data ?? {};
			// Only credit archetype specialist counts on SUCCESS
			if (success && archetype) {
				next.incidentsByArchetype[archetype] =
					(next.incidentsByArchetype[archetype] ?? 0) + 1;
			}
			if (success) {
				next.currentStreak += 1;
				if (next.currentStreak > next.bestStreak) {
					next.bestStreak = next.currentStreak;
				}
			} else {
				next.currentStreak = 0;
			}
			break;
		}

		case "vigilante_recruited": {
			const { vigilanteId } = event.data ?? {};
			if (vigilanteId) {
				next.uniqueVigilantesOwned.add(vigilanteId);
			}
			break;
		}

		case "resource_change": {
			const { quantities } = event.data ?? {};
			if (quantities) {
				for (const [resourceId, qty] of Object.entries(quantities)) {
					const prev = next.maxResourceInventory[resourceId] ?? 0;
					if (qty > prev) next.maxResourceInventory[resourceId] = qty;
				}
			}
			break;
		}

		case "credit_earned": {
			const { credits } = event.data ?? {};
			if (credits && credits > 0) {
				next.totalCreditsEarned += credits;
				if (credits > next.highestSinglePayout) {
					next.highestSinglePayout = credits;
				}
			}
			break;
		}

		case "vigilante_injured": {
			next.vigilanteInjuries += 1;
			break;
		}

		case "session_tick": {
			if (progress.sessionStartTime !== null) {
				next.totalPlaytimeMs += 1000;
			}
			break;
		}

		// vigilante_recovered — no progress fields to update currently
		case "vigilante_recovered":
			break;
	}

	return next;
}

/**
 * Count quick-response deployments recorded in the last 10 seconds.
 * (Used for the quick_response achievement progress display only —
 *  the unlock itself checks recentResolutions.length >= 50.)
 */
export function getQuickResponseCount(progress: AchievementProgress): number {
	const cutoff = Date.now() - 10_000;
	return progress.recentResolutions.filter((ts) => ts >= cutoff).length;
}

/**
 * Human-readable progress string for a given achievement.
 */
export function getAchievementProgressText(
	achievementId: AchievementId,
	state: GameState,
	progress: AchievementProgress,
): string {
	switch (achievementId) {
		case "dispatcher_10":
			return `${state.careerStats.dispatchesCompleted}/10`;
		case "dispatcher_100":
			return `${state.careerStats.dispatchesCompleted}/100`;
		case "dispatcher_500":
			return `${state.careerStats.dispatchesCompleted}/500`;
		case "perfect_10":
			return `${progress.bestStreak}/10`;
		case "streak_5":
			return `${progress.bestStreak}/5`;
		case "streak_10":
			return `${progress.bestStreak}/10`;

		case "fire_specialist":
			return `${progress.incidentsByArchetype["fire_rescue"] ?? 0}/25`;
		case "crime_fighter":
			return `${progress.incidentsByArchetype["crime"] ?? 0}/50`;
		case "medic_hero":
			return `${progress.incidentsByArchetype["medical"] ?? 0}/25`;
		case "disaster_response":
			return `${progress.incidentsByArchetype["disaster"] ?? 0}/10`;
		case "traffic_control":
			return `${progress.incidentsByArchetype["traffic"] ?? 0}/30`;

		case "millionaire":
			return `${fmt(progress.totalCreditsEarned)}/1,000,000`;
		case "resourceful":
			return `${fmt(progress.highestSinglePayout)}/10,000`;
		case "supply_chain": {
			const max = Math.max(
				0,
				...Object.values(progress.maxResourceInventory),
			);
			return `${max}/100`;
		}

		case "recruiter_5":
			return `${state.careerStats.vigilantesRecruited}/5`;
		case "recruiter_20":
			return `${state.careerStats.vigilantesRecruited}/20`;
		case "vigilante_army":
			return `${progress.uniqueVigilantesOwned.size}/25`;
		case "patrol_leader": {
			const active = state.ownedVigilanteIds.filter(
				(id) => !(id in state.vigilanteInjuryUntil),
			).length;
			return `${active}/10`;
		}
		case "zero_casualties":
			return `${progress.vigilanteInjuries} injuries · ${state.careerStats.dispatchesCompleted} dispatches`;

		case "sharp_eye": {
			const total = state.careerStats.dispatchesCompleted;
			const rate =
				total > 0
					? Math.round(
							(state.careerStats.incidentsResolvedSuccess /
								total) *
								100,
						)
					: 0;
			return `${rate}% success (${total} dispatches)`;
		}
		case "quick_response":
			return `${progress.recentResolutions.length}/50`;

		case "dedicated":
			return `${fmtTime(progress.totalPlaytimeMs)}/24h`;
		case "legacy": {
			const total =
				state.careerStats.incidentsResolvedSuccess +
				state.careerStats.incidentsResolvedFailure;
			return `${total}/1,000`;
		}

		default:
			return "";
	}
}

// ── Private helpers ───────────────────────────────────────────────────────────

function fmt(n: number): string {
	return n.toLocaleString();
}

function fmtTime(ms: number): string {
	const h = ms / 3_600_000;
	if (h >= 1) return `${h.toFixed(1)}h`;
	return `${Math.floor(ms / 60_000)}m`;
}
