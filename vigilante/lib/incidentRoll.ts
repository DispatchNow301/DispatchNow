import type { IncidentArchetype } from "@/lib/incidentTemplates";
import {
	computeAdjustedSuccessChance,
	type VigilanteForSuccess,
} from "@/lib/successModifiers";

/** Multipliers + base % — shown in UI so the roll doesn’t feel arbitrary */
export type DispatchRollBreakdown = {
	/** Base % from incident spawn (before crew/gear) */
	baseChancePercent: number;
	resourceMultiplier: number;
	buffMultiplier: number;
	vigilanteMultiplier: number;
	/** 0–1 stat match vs incident archetype (same family as crew multiplier) */
	avgArchetypeFit: number;
	/** Reference crew = 2; one operative &lt; 1 (older saves may omit) */
	staffingSupportMultiplier?: number;
	/** Staged gear presence (ramps with item count; older saves may omit) */
	gearPresenceMultiplier?: number;
	/** `adjustedPercent - beforeLuckPercent` after rounding */
	luckDeltaPercent: number;
};

/**
 * Stored on the incident when resolved. The check is **roll-under** on 0–100:
 * `success === rolled < adjustedPercent` (lower rolls are better).
 */
export type IncidentRollResolution = DispatchRollBreakdown & {
	success: boolean;
	adjustedPercent: number;
	beforeLuckPercent: number;
	/**
	 * 0–100 draw: blend of pure chaos + sub-threshold “execution” noise; second
	 * part is weighted by archetype fit so better roster → lower rolls on average.
	 */
	rolled: number;
};

export type ComputeIncidentRollInput = {
	baseChancePercent: number;
	archetype: IncidentArchetype;
	vigilantes: VigilanteForSuccess[];
	resourceIds: string[];
	buffIds?: string[];
	/** RNG in [0,1); default Math.random — inject for tests */
	rng?: () => number;
};

/**
 * How strongly the final roll follows crew archetype fit (0 = uniform chaos,
 * 1 = at max fit the roll is fully drawn from the success band).
 */
export const ROLL_CREW_CORRELATION_STRENGTH = 0.58;

function computeCorrelatedRoll(
	thresholdPercent: number,
	avgArchetypeFit: number,
	rng: () => number,
): number {
	const t = Math.max(5, Math.min(95, thresholdPercent));
	const fit = Math.max(0, Math.min(1, avgArchetypeFit));
	const blend = Math.max(
		0,
		Math.min(1, ROLL_CREW_CORRELATION_STRENGTH * fit),
	);
	const chaos = rng() * 100;
	/** Stay strictly under threshold for the “disciplined” component */
	const cap = Math.max(0.01, t - 0.5);
	const discipline = rng() * cap;
	return (1 - blend) * chaos + blend * discipline;
}

/**
 * One random roll vs the adjusted success threshold (same formula as deployment).
 */
export function computeIncidentRollOutcome(
	input: ComputeIncidentRollInput,
): IncidentRollResolution {
	const rng = input.rng ?? Math.random;
	const res = computeAdjustedSuccessChance({ ...input, rng });
	const rolled = computeCorrelatedRoll(
		res.adjustedPercent,
		res.avgArchetypeFit,
		rng,
	);
	const success = rolled < res.adjustedPercent;
	const luckDeltaPercent = res.adjustedPercent - res.beforeLuckPercent;
	return {
		success,
		adjustedPercent: res.adjustedPercent,
		beforeLuckPercent: res.beforeLuckPercent,
		rolled,
		baseChancePercent: input.baseChancePercent,
		resourceMultiplier: res.resourceMultiplier,
		buffMultiplier: res.buffMultiplier,
		vigilanteMultiplier: res.vigilanteMultiplier,
		avgArchetypeFit: res.avgArchetypeFit,
		staffingSupportMultiplier: res.staffingSupportMultiplier,
		gearPresenceMultiplier: res.gearPresenceMultiplier,
		luckDeltaPercent,
	};
}
