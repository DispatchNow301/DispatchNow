/** Per resolve: each deployed vigilante rolls this chance to be injured. */
export const VIGILANTE_INJURY_CHANCE = 0.15;

/** How long an injured vigilante cannot be deployed (ms). */
export const VIGILANTE_INJURY_DURATION_MS = 5 * 60 * 1000;

export function isVigilanteRecovering(
	now: number,
	injuryUntilById: Record<string, number> | undefined,
	vigilanteId: string,
): boolean {
	const until = injuryUntilById?.[vigilanteId];
	return typeof until === "number" && now < until;
}

/** Drop expired entries (e.g. after load from localStorage). */
export function pruneExpiredInjuries(
	injuryUntilById: Record<string, number> | undefined,
	now: number,
): Record<string, number> {
	if (!injuryUntilById) return {};
	const out: Record<string, number> = {};
	for (const [id, until] of Object.entries(injuryUntilById)) {
		if (typeof until === "number" && until > now) out[id] = until;
	}
	return out;
}

/** After an incident resolves: roll injury for each deployed vigilante and merge into the map. */
export function rollInjuryUpdatesAfterResolve(
	now: number,
	deployedIds: string[],
	previous: Record<string, number> | undefined,
): Record<string, number> {
	const base = pruneExpiredInjuries(previous, now);
	const out: Record<string, number> = { ...base };
	for (const vid of deployedIds) {
		if (Math.random() < VIGILANTE_INJURY_CHANCE) {
			const until = now + VIGILANTE_INJURY_DURATION_MS;
			out[vid] = Math.max(out[vid] ?? 0, until);
		}
	}
	return out;
}
