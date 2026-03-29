/**
 * Persistent career counters (stored inside GameState / cloud save JSON).
 */
export type CareerStats = {
	/** Dispatches that finished rolling (win or loss). */
	dispatchesCompleted: number;
	incidentsResolvedSuccess: number;
	incidentsResolvedFailure: number;
	/** Active incident removed when its timer hit zero (not rolled). */
	incidentsExpired: number;
	/** New vigilantes added through the recruit / vetting flow. */
	vigilantesRecruited: number;
	/** Total playtime in milliseconds */
	totalPlaytimeMs?: number;
};

export const DEFAULT_CAREER_STATS: CareerStats = {
	dispatchesCompleted: 0,
	incidentsResolvedSuccess: 0,
	incidentsResolvedFailure: 0,
	incidentsExpired: 0,
	vigilantesRecruited: 0,
	totalPlaytimeMs: 0,
};

export function mergeCareerStats(raw: unknown): CareerStats {
	const d = DEFAULT_CAREER_STATS;
	if (!raw || typeof raw !== "object") return { ...d };
	const o = raw as Record<string, unknown>;
	const num = (key: keyof CareerStats): number => {
		const v = o[key];
		if (typeof v !== "number" || !Number.isFinite(v) || v < 0) return d[key] ?? 0;
		return Math.min(Number.MAX_SAFE_INTEGER, Math.floor(v));
	};
	return {
		dispatchesCompleted: num("dispatchesCompleted"),
		incidentsResolvedSuccess: num("incidentsResolvedSuccess"),
		incidentsResolvedFailure: num("incidentsResolvedFailure"),
		incidentsExpired: num("incidentsExpired"),
		vigilantesRecruited: num("vigilantesRecruited"),
		totalPlaytimeMs: num("totalPlaytimeMs"),
	};
}
