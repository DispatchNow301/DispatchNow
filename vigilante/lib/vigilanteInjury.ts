/** Per resolve: each deployed vigilante rolls this chance to be injured. */
export const VIGILANTE_INJURY_CHANCE = 0.15;

/** Guaranteed rest cooldown after any dispatch, before injury roll */
export const VIGILANTE_REST_DURATION_MS = 1 * 60 * 1000;

/** How long an injured vigilante cannot be deployed (ms). */
export const VIGILANTE_INJURY_DURATION_MS = 5 * 60 * 1000;

export function isVigilanteRecovering(
	vigilanteRestRemaining: Record<string, number> | undefined,
	vigilanteId: string,
): boolean {
	const remaining = vigilanteRestRemaining?.[vigilanteId];
	return typeof remaining === "number" && remaining > 0;
}

/** Drop entries with 0 or negative remaining time. */
export function pruneExpiredRests(
	restRemainingById: Record<string, number> | undefined,
): Record<string, number> {
	if (!restRemainingById) return {};
	const out: Record<string, number> = {};
	for (const [id, remaining] of Object.entries(restRemainingById)) {
		if (typeof remaining === "number" && remaining > 0) out[id] = remaining;
	}
	return out;
}

/** Decrement all rest timers by elapsed ms. */
export function decrementRestRemaining(
	restRemainingById: Record<string, number> | undefined,
	elapsedMs: number,
): Record<string, number> {
	if (!restRemainingById) return {};
	const out: Record<string, number> = {};
	for (const [id, remaining] of Object.entries(restRemainingById)) {
		const next = Math.max(0, remaining - elapsedMs);
		if (next > 0) out[id] = next;
	}
	return out;
}

/** After an incident resolves: roll injury for each deployed vigilante and merge into the map. */
export function rollInjuryUpdatesAfterResolve(
	deployedIds: string[],
	previous: Record<string, number> | undefined,
): Record<string, number> {
	const base = pruneExpiredRests(previous);
	const out: Record<string, number> = { ...base };
	for (const vid of deployedIds) {
		if (Math.random() < VIGILANTE_INJURY_CHANCE) {
			out[vid] = Math.max(out[vid] ?? 0, VIGILANTE_INJURY_DURATION_MS);
		}
	}
	return out;
}

/** Apply guaranteed rest cooldown to deployed vigilantes (separate from injury chance). */
export function applyRestCooldownAfterDispatch(
	deployedIds: string[],
	previous: Record<string, number> | undefined,
): Record<string, number> {
	const base = pruneExpiredRests(previous);
	const out: Record<string, number> = { ...base };
	for (const vid of deployedIds) {
		out[vid] = Math.max(out[vid] ?? 0, VIGILANTE_REST_DURATION_MS);
	}
	return out;
}
