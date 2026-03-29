/**
 * Heuristic success chance for dispatch: combines base incident odds with
 * assigned vigilante stats (per archetype) and carried resources/buffs.
 * Understaffing and empty kit are penalized with smooth multipliers (no special
 * cases): reference crew size is 2+; staged gear ramps odds up continuously.
 * Not ML — deterministic math + small luck jitter.
 */

import type { IncidentArchetype } from "@/lib/incidentTemplates";
import { getIncidentSpecificBonus } from "./incidentSpecificBonuses";

export type VigilanteStats = {
	strength: number;
	intelligence: number;
	speed: number;
};

/** Stats-only slice (e.g. from VigilanteSheet) */
export type VigilanteForSuccess = {
	stats: VigilanteStats;
};

/** In-game stats use roughly 1–5; used to normalize contribution */
export const STAT_SCALE_MAX = 5;

/**
 * How much each stat matters per incident archetype (sums to ~1 per row).
 */
export const STAT_WEIGHTS: Record<
	IncidentArchetype,
	Partial<Record<keyof VigilanteStats, number>>
> = {
	crime: { strength: 0.4, speed: 0.3, intelligence: 0.3 },
	fire_rescue: { intelligence: 0.4, strength: 0.3, speed: 0.3 },
	medical: { intelligence: 0.5, speed: 0.3, strength: 0.2 },
	disaster: { intelligence: 0.4, strength: 0.3, speed: 0.3 },
	traffic: { speed: 0.4, intelligence: 0.35, strength: 0.25 },
};

/**
 * Semantic resource keys — multiply together (clamped per factor) for archetype.
 * Values are multipliers: 1.0 neutral, &lt;1 hurts, &gt;1 helps.
 */
export const RESOURCE_ARCHETYPE_MULTIPLIER: Record<
	string,
	Record<IncidentArchetype, number>
> = {
	first_aid_kit: {
		crime: 0.95,
		fire_rescue: 1.12,
		medical: 1.38,
		disaster: 1.15,
		traffic: 1.05,
	},
	fire_extinguisher: {
		fire_rescue: 1.35,
		medical: 0.88,
		crime: 0.92,
		disaster: 1.22,
		traffic: 0.95,
	},
	walkie_talkie: {
		crime: 1.08,
		fire_rescue: 1.12,
		medical: 1.06,
		disaster: 1.1,
		traffic: 1.12,
	},
	handcuffs: {
		crime: 1.28,
		fire_rescue: 0.78,
		medical: 0.82,
		disaster: 0.88,
		traffic: 1.05,
	},
	surveillance_drone: {
		crime: 1.08,
		fire_rescue: 1.05,
		medical: 1.0,
		disaster: 1.06,
		traffic: 1.12,
	},
	protective_gear: {
		crime: 1.08,
		fire_rescue: 1.12,
		medical: 1.05,
		disaster: 1.18,
		traffic: 1.05,
	},
	barricade_kit: {
		crime: 1.05,
		fire_rescue: 1.12,
		medical: 0.95,
		disaster: 1.2,
		traffic: 1.15,
	},
	epipen: {
		crime: 0.92,
		fire_rescue: 1.0,
		medical: 1.32,
		disaster: 1.05,
		traffic: 1.0,
	},
	rescue_tool: {
		crime: 0.95,
		fire_rescue: 1.22,
		medical: 1.05,
		disaster: 1.18,
		traffic: 1.08,
	},
	armored_vehicle: {
		crime: 1.08,
		fire_rescue: 1.05,
		medical: 1.0,
		disaster: 1.12,
		traffic: 1.18,
	},
};

/** Buffs — lighter touch than gear */
export const BUFF_ARCHETYPE_MULTIPLIER: Record<
	string,
	Partial<Record<IncidentArchetype, number>>
> = {
	street_network: {
		crime: 1.3,
	},
	thermal_protocol: {
		fire_rescue: 1.3,
	},
	vital_edge: {
		medical: 1.3,
	},
	forensic_edge: {
		medical: 1.3,
	},
	catastrophe_stability: {
		disaster: 1.3,
	},
	urban_flow: {
		traffic: 1.3,
	},
};

export function getTimerSlowdownMultiplier(upgradeIds: string[]): number {
    if (upgradeIds.includes("b1")) return 0.8;
    return 1;
}

export function getPoliceSlowdownMultiplier(upgradeIds: string[]): number {
    if (upgradeIds.includes("b2")) return 0.8;
    return 1;
}

/**
 * Scavenger's Luck (b8): on mission failure, 20% chance resources are returned
 * instead of forfeited. Returns true if the lucky salvage triggers.
 */
export function rollScavengerSalvage(upgradeIds: string[]): boolean {
    if (!upgradeIds.includes("b8")) return false;
    return Math.random() < 0.2;
}

/**
 * Rapid Response (b9): deploying within 10 seconds of an incident spawning
 * grants a flat +15 percentage-point bonus to the adjusted success chance.
 * Pass the incident's createdAt timestamp and the current time.
 */
export function getRapidResponseBonus(
    upgradeIds: string[],
    incidentCreatedAt: number,
    nowMs: number = Date.now(),
): number {
    if (!upgradeIds.includes("b9")) return 0;
    const elapsedMs = nowMs - incidentCreatedAt;
    return elapsedMs <= 10_000 ? 15 : 0;
}

/** Map Inventory UI ids (r1..r10, b1..b3) to semantic keys */
export const RESOURCE_ID_TO_KEY: Record<string, string> = {
	r1: "first_aid_kit",
	r2: "fire_extinguisher",
	r3: "walkie_talkie",
	r4: "handcuffs",
	r5: "surveillance_drone",
	r6: "protective_gear",
	r7: "barricade_kit",
	r8: "epipen",
	r9: "rescue_tool",
	r10: "armored_vehicle",
	b1: "noir_focus",
	b2: "shadow_lag",
	b3: "street_network",
	b4: "thermal_protocol",
	b5: "vital_edge",
	b6: "catastrophe_stability",
	b7: "urban_flow",
};

const PER_ITEM_FACTOR_MIN = 0.72;
const PER_ITEM_FACTOR_MAX = 1.38;

/** Max additive boost from vigilantes (on top of base %) */
const VIGILANTE_BONUS_CAP = 0.13;
/** How quickly weighted stat fit reaches the cap (lower = harder to max out) */
const VIGILANTE_BONUS_PER_FIT = 0.18;

/**
 * Reference crew on scene = 2. One operative is under-supported; three+ capped.
 * Smooth in count — not a one-person special case.
 */
function computeStaffingSupportMultiplier(vigilanteCount: number): number {
	if (vigilanteCount <= 0) return 0.45;
	return Math.min(1, vigilanteCount / 2);
}

/**
 * No staged gear hurts; each item eases toward 1.0 (separate from per-item
 * archetype multipliers, which apply when anything is staged).
 */
function computeGearPresenceMultiplier(stagedResourceCount: number): number {
	const t = Math.max(0, stagedResourceCount);
	/** Asymptote 1.0; empty loadout is clearly disadvantaged */
	return 0.7 + 0.3 * (1 - Math.exp(-t * 0.55));
}

export type ComputeAdjustedSuccessInput = {
	/** Base % from incident (0–100) */
	baseChancePercent: number;
	archetype: IncidentArchetype;
	/** Incident type label (e.g. "Kitchen fire") for specific resource relevance */
	incidentTypeLabel?: string;
	vigilantes: VigilanteForSuccess[];
	/** Inventory ids (e.g. r2) and/or semantic keys (fire_extinguisher) */
	resourceIds: string[];
	/** Optional buff ids (b1…) */
	buffIds?: string[];
	/**
	 * Luck: uniform jitter in ±halfWidth on the **final** percent (after modifiers).
	 * Default 1.25 → ±1.25 points (keeps outcomes closer to crew/gear math).
	 */
	luckHalfWidthPercentPoints?: number;
	/** RNG in [0,1); default Math.random — inject for tests */
	rng?: () => number;
	/**
	 * Flat additive bonus applied after all multipliers (e.g. Rapid Response).
	 * Added before luck jitter, clamped with everything else to 5–95.
	 */
	flatBonusPercent?: number;
};

export type ComputeAdjustedSuccessResult = {
	/** After modifiers + luck jitter, clamped 5–95 */
	adjustedPercent: number;
	/** Before luck (0–100 scale) */
	beforeLuckPercent: number;
	/** Product of resource factors (for debugging / UI) */
	resourceMultiplier: number;
	/** Product of buff factors */
	buffMultiplier: number;
	/** Incident-specific resource relevance multiplier (from incident type) */
	incidentSpecificMultiplier: number;
	/** 1 + vigilante bonus capped */
	vigilanteMultiplier: number;
	/**
	 * 0–1 weighted stat match vs this incident archetype (before solo penalty on
	 * the multiplier). Used to correlate the resolution roll with who you sent.
	 */
	avgArchetypeFit: number;
	/** &lt;1 when understaffed vs a 2-person reference */
	staffingSupportMultiplier: number;
	/** &lt;1 when no gear staged; ramps with staged item count */
	gearPresenceMultiplier: number;
};

function resolveResourceKey(id: string): string {
	const lower = id.trim().toLowerCase();
	return RESOURCE_ID_TO_KEY[lower] ?? lower;
}

function productMultipliers(
	archetype: IncidentArchetype,
	keys: string[],
	table: Record<string, Record<IncidentArchetype, number>>,
): number {
	if (keys.length === 0) return 1;
	let p = 1;
	for (const raw of keys) {
		const key = resolveResourceKey(raw);
		const row = table[key];
		const factor = row?.[archetype] ?? 1;
		const clamped = Math.max(
			PER_ITEM_FACTOR_MIN,
			Math.min(PER_ITEM_FACTOR_MAX, factor),
		);
		p *= clamped;
	}
	return p;
}

function vigilanteStatFit(
	archetype: IncidentArchetype,
	vigilantes: VigilanteForSuccess[],
): { multiplier: number; avgArchetypeFit: number } {
	if (vigilantes.length === 0) {
		return { multiplier: 1, avgArchetypeFit: 0 };
	}
	const weights = STAT_WEIGHTS[archetype];
	let sum = 0;
	for (const v of vigilantes) {
		let per = 0;
		const wEntries = Object.entries(weights) as [
			keyof VigilanteStats,
			number,
		][];
		for (const [stat, w] of wEntries) {
			const val = v.stats[stat] ?? 0;
			per += (val / STAT_SCALE_MAX) * w;
		}
		sum += per;
	}
	const avgArchetypeFit = sum / vigilantes.length;
	const bonus = Math.min(
		VIGILANTE_BONUS_CAP,
		avgArchetypeFit * VIGILANTE_BONUS_PER_FIT,
	);
	return { multiplier: 1 + bonus, avgArchetypeFit };
}

const PER_BUFF_FACTOR_MIN = 0.5;
const PER_BUFF_FACTOR_MAX = 10;  // allow strong buff values

function productBuffMultipliers(
    archetype: IncidentArchetype,
    keys: string[],
): number {
    if (keys.length === 0) return 1;
    let p = 1;
    for (const raw of keys) {
        const key = resolveResourceKey(raw);
        const row = BUFF_ARCHETYPE_MULTIPLIER[key];
        const factor = row?.[archetype] ?? 1;
        const clamped = Math.max(
            PER_BUFF_FACTOR_MIN,
            Math.min(PER_BUFF_FACTOR_MAX, factor),
        );
        p *= clamped;
    }
    return p;
}

/**
 * Compute incident-specific resource relevance multiplier.
 * applies bonuses for bringing the right tools for this specific incident type.
 */
function computeIncidentSpecificMultiplier(
    incidentTypeLabel: string | undefined,
    resourceIds: string[],
): number {
    if (!incidentTypeLabel || resourceIds.length === 0) return 1;

    const specificBonuses = getIncidentSpecificBonus(incidentTypeLabel);
    if (Object.keys(specificBonuses).length === 0) return 1;

    let p = 1;
    for (const raw of resourceIds) {
        const key = resolveResourceKey(raw);
        const bonus = specificBonuses[key];
        if (bonus !== undefined) {
            // Apply same clamping as other multipliers for consistency
            const clamped = Math.max(
                PER_ITEM_FACTOR_MIN,
                Math.min(PER_ITEM_FACTOR_MAX, bonus),
            );
            p *= clamped;
        }
    }
    return p;
}

/**
 * Combined success %: base × gear × buffs × vigilante fit × staffing × kit
 * presence, then small luck jitter, then flat bonus (e.g. Rapid Response).
 */
export function computeAdjustedSuccessChance(
	input: ComputeAdjustedSuccessInput,
): ComputeAdjustedSuccessResult {
	const {
		baseChancePercent,
		archetype,
		incidentTypeLabel,
		vigilantes,
		resourceIds,
		buffIds = [],
		luckHalfWidthPercentPoints = 1.25,
		rng = Math.random,
		flatBonusPercent = 0,
	} = input;

	const resourceMultiplier = productMultipliers(
		archetype,
		resourceIds,
		RESOURCE_ARCHETYPE_MULTIPLIER,
	);
	const buffMultiplier = productBuffMultipliers(archetype, buffIds);
	const incidentSpecificMultiplier = computeIncidentSpecificMultiplier(
		incidentTypeLabel,
		resourceIds,
	);
	const { multiplier: vigilanteMultiplier, avgArchetypeFit } = vigilanteStatFit(
		archetype,
		vigilantes,
	);

	const staffingSupportMultiplier = computeStaffingSupportMultiplier(
		vigilantes.length,
	);
	const gearPresenceMultiplier = computeGearPresenceMultiplier(resourceIds.length);

	const raw =
		baseChancePercent *
		resourceMultiplier *
		buffMultiplier *
		incidentSpecificMultiplier *
		vigilanteMultiplier *
		staffingSupportMultiplier *
		gearPresenceMultiplier;

	const beforeLuckPercent = Math.round(
		Math.max(0, Math.min(100, raw)),
	);

	const jitter = (rng() - 0.5) * 2 * luckHalfWidthPercentPoints;
	const adjustedPercent = Math.round(
		Math.max(5, Math.min(95, beforeLuckPercent + jitter + flatBonusPercent)),
	);

	return {
		adjustedPercent,
		beforeLuckPercent,
		resourceMultiplier,
		buffMultiplier,
		incidentSpecificMultiplier,
		vigilanteMultiplier,
		avgArchetypeFit,
		staffingSupportMultiplier,
		gearPresenceMultiplier,
	};
}