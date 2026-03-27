"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	checkAchievements,
	updateAchievementProgress,
} from "@/lib/achievementTracker";
import type { AchievementId } from "@/lib/achievements";
import type { GameState, UnlockedAchievement } from "@/lib/gameTypes";
import type { QueuedNotification } from "./AchievementNotification";

export function useAchievements(
	gameState: GameState,
	setState: React.Dispatch<React.SetStateAction<GameState>>,
) {
	const [notificationQueue, setNotificationQueue] = useState<
		QueuedNotification[]
	>([]);

	// Always-fresh refs so callbacks never go stale
	const progressRef = useRef<AchievementProgress>(
		gameState.achievementProgress,
	);
	const gameStateRef = useRef<GameState>(gameState);
	const unlockedRef = useRef<Set<string>>(
		new Set(gameState.unlockedAchievementIds.map((a) => a.achievementId)),
	);

	useEffect(() => {
		progressRef.current = gameState.achievementProgress;
		gameStateRef.current = gameState;
		unlockedRef.current = new Set(
			gameState.unlockedAchievementIds.map((a) => a.achievementId),
		);
	}, [gameState]);

	// ── Core: run checkAchievements whenever gameState changes ───────────────
	useEffect(() => {
		const newlyUnlocked = checkAchievements(
			gameStateRef.current,
			progressRef.current,
		).filter((ua) => !unlockedRef.current.has(ua.achievementId));

		if (newlyUnlocked.length === 0) return;

		// Immediately add to the ref so the same IDs don't fire twice
		for (const ua of newlyUnlocked) unlockedRef.current.add(ua.achievementId);

		setState((s) => ({
			...s,
			unlockedAchievementIds: [
				...s.unlockedAchievementIds,
				...newlyUnlocked,
			],
		}));

		const now = Date.now();
		setNotificationQueue((prev) => [
			...prev,
			...newlyUnlocked.map((ua) => ({ id: ua.achievementId, unlockedAt: now })),
		]);
	}, [gameState, setState]);

	// ── Dismiss ───────────────────────────────────────────────────────────────
	const dismissNotification = useCallback((achievementId: AchievementId) => {
		setNotificationQueue((prev) =>
			prev.filter((n) => n.id !== achievementId),
		);
	}, []);

	// ── Tracking helpers ──────────────────────────────────────────────────────
	// Each helper:
	//   1. Computes the new AchievementProgress via updateAchievementProgress
	//   2. Returns the full updated AchievementProgress so the caller can spread
	//      it into achievementProgress inside its own setState call.
	//      checkAchievements fires automatically when gameState updates.

	const trackIncidentResolution = useCallback(
		(
			archetype: string,
			success: boolean,
			creditsEarned?: number,
		): Partial<AchievementProgress> => {
			let next = updateAchievementProgress(progressRef.current, {
				type: "incident_resolved",
				data: { archetype, success },
			});

			if (creditsEarned && creditsEarned > 0) {
				next = updateAchievementProgress(next, {
					type: "credit_earned",
					data: { credits: creditsEarned },
				});
			}

			progressRef.current = next;
			return next;
		},
		[],
	);

	const trackVigilanteRecruitment = useCallback(
		(vigilanteId: string): Partial<AchievementProgress> => {
			const next = updateAchievementProgress(progressRef.current, {
				type: "vigilante_recruited",
				data: { vigilanteId },
			});
			progressRef.current = next;
			return next;
		},
		[],
	);

	const trackDeployment = useCallback(
		(deploymentTimeMs: number): Partial<AchievementProgress> => {
			const next = updateAchievementProgress(progressRef.current, {
				type: "deployment_made",
				data: { deploymentTimeMs },
			});
			progressRef.current = next;
			return next;
		},
		[],
	);

	const trackVigilanteInjury =
		useCallback((): Partial<AchievementProgress> => {
			const next = updateAchievementProgress(progressRef.current, {
				type: "vigilante_injured",
			});
			progressRef.current = next;
			return next;
		}, []);

	const trackInventoryChange = useCallback(
		(quantities: Record<string, number>): Partial<AchievementProgress> => {
			const next = updateAchievementProgress(progressRef.current, {
				type: "resource_change",
				data: { quantities },
			});
			progressRef.current = next;
			return next;
		},
		[],
	);

	const trackIncidentSpawn = useCallback((): Partial<AchievementProgress> => {
		const next = updateAchievementProgress(progressRef.current, {
			type: "incident_spawned",
		});
		progressRef.current = next;
		return next;
	}, []);

	return {
		notificationQueue,
		dismissNotification,
		trackIncidentResolution,
		trackVigilanteRecruitment,
		trackDeployment,
		trackVigilanteInjury,
		trackInventoryChange,
		trackIncidentSpawn,
		progress: progressRef.current,
	};
}
