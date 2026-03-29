import type { IncidentArchetype } from "@/lib/incidentTemplates";
import type { VigilanteSheet } from "@/app/components/data/vigilante";
import { getIncidentSpecificBonus } from "./incidentSpecificBonuses";

/** Result with success percent, breakdown, and archetype fit */
export type SimpleSuccessResult = {
	successPercent: number;
	beforeLuckPercent: number;
	breakdown: BreakdownItem[];
	reasoning: string;
	avgArchetypeFit: number;
	incidentSpecificMultiplier: number;
};

export type BreakdownItem = {
	label: string;
	value: number; // percentage points added (can be negative)
};

/** Map resource IDs to semantic categories */
const RESOURCE_CATEGORIES: Record<string, string> = {
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
};

/** Human-readable names for resources */
const RESOURCE_NAMES: Record<string, string> = {
	first_aid_kit: "First Aid Kit",
	fire_extinguisher: "Fire Extinguisher",
	walkie_talkie: "Walkie Talkie",
	handcuffs: "Handcuffs",
	surveillance_drone: "Surveillance Drone",
	protected_gear: "Protective Gear",
	barricade_kit: "Barricade Kit",
	epipen: "EpiPen",
	rescue_tool: "Rescue Tool",
	armored_vehicle: "Armored Vehicle",
};

/** Buff to incident type alignment */
const BUFF_ALIGNMENT: Record<string, IncidentArchetype[]> = {
	noir_focus: ["crime"],
	shadow_lag: ["crime"],
	street_network: ["crime"],
	thermal_protocol: ["fire_rescue"],
	vital_edge: ["medical"],
	forensic_edge: ["medical"],
	catastrophe_stability: ["disaster"],
	urban_flow: ["traffic"],
};

/** Base success for solo operator with average stats and no gear */
const BASE_SUCCESS = 15;

/** Stat weights for each incident type (normalized 0-1, sum to ~1) */
const STAT_WEIGHTS: Record<string, Record<string, number>> = {
	crime: { strength: 0.4, intelligence: 0.3, speed: 0.3 },
	fire_rescue: { intelligence: 0.4, strength: 0.3, speed: 0.3 },
	medical: { intelligence: 0.5, speed: 0.3, strength: 0.2 },
	disaster: { intelligence: 0.4, strength: 0.3, speed: 0.3 },
	traffic: { speed: 0.4, intelligence: 0.35, strength: 0.25 },
};

/** Resource alignment scores (0-1) for each incident type */
const RESOURCE_ALIGNMENT: Record<string, Record<string, number>> = {
	crime: {
		restraint: 1.0,
		communication: 0.8,
		reconnaissance: 0.8,
		protection: 0.5,
		medical: 0.2,
		fire_suppression: 0,
		containment: 0.6,
		extrication: 0,
		transport: 0,
	},
	fire_rescue: {
		fire_suppression: 1.0,
		extrication: 0.9,
		medical: 0.7,
		protection: 0.8,
		communication: 0.5,
		restraint: 0,
		reconnaissance: 0.4,
		containment: 0.7,
		transport: 0.3,
	},
	medical: {
		medical: 1.0,
		communication: 0.6,
		protection: 0.5,
		extrication: 0.3,
		transport: 0.4,
		fire_suppression: 0,
		restraint: 0.1,
		reconnaissance: 0.2,
		containment: 0.3,
	},
	disaster: {
		extrication: 1.0,
		protection: 0.9,
		medical: 0.7,
		communication: 0.6,
		containment: 0.8,
		restraint: 0.2,
		reconnaissance: 0.5,
		fire_suppression: 0.5,
		transport: 0.6,
	},
	traffic: {
		communication: 1.0,
		transport: 0.8,
		protection: 0.6,
		reconnaissance: 0.7,
		medical: 0.3,
		fire_suppression: 0,
		restraint: 0.4,
		extrication: 0.2,
		containment: 0.5,
	},
};

/**
 * Calculate success chance using a simple, understandable additive heuristic.
 * Includes optional flat bonus (e.g., Rapid Response).
 * Returns both the success percent (before luck jitter) and a detailed breakdown.
 */
export function calculateSimpleSuccess(
	baseChancePercent: number,
	incidentType: IncidentArchetype,
	incidentTypeLabel?: string,
	vigilantes: VigilanteSheet[],
	resourceIds: string[],
	buffIds: string[] = [],
	flatBonus: number = 0,
): SimpleSuccessResult {
	const breakdown: BreakdownItem[] = [];

	// --- BASE CHANCE ---
	let total = baseChancePercent;
	breakdown.push({ label: "Base", value: baseChancePercent });

	// --- STAT ALIGNMENT ---
	const weights = STAT_WEIGHTS[incidentType] || STAT_WEIGHTS.crime;
	let totalStatFit = 0;
	for (const vig of vigilantes) {
		let vigFit = 0;
		for (const [stat, weight] of Object.entries(weights)) {
			const val = (vig.stats?.[stat as keyof typeof vig.stats] ?? 0) / 5;
			vigFit += val * weight;
		}
		totalStatFit += vigFit;
	}
	const avgStatFit = vigilantes.length ? totalStatFit / vigilantes.length : 0;
	const statBonus = Math.round(avgStatFit * 20);
	total += statBonus;
	breakdown.push({ label: "Vigilante fit", value: statBonus });

	// --- RESOURCE CATEGORY ALIGNMENT ---
	const usedCategories = new Set<string>();
	let resourceBonus = 0;
	for (const resId of resourceIds) {
		const category = RESOURCE_CATEGORIES[resId] ?? resId;
		const alignment = RESOURCE_ALIGNMENT[incidentType]?.[category] ?? 0;
		if (alignment <= 0) continue;
		if (!usedCategories.has(category)) {
			resourceBonus += Math.round(alignment * 20);
			usedCategories.add(category);
		} else {
			resourceBonus += Math.round(alignment * 20 * 0.5);
		}
	}
	total += resourceBonus;
	if (resourceBonus > 0)
		breakdown.push({ label: "Helpful gear", value: resourceBonus });

	// --- INCIDENT-SPECIFIC RESOURCE RELEVANCE ---
	const incidentSpecificBonuses: Record<string, number> = {};
	const usedSpecificCategories = new Set<string>();
	if (incidentTypeLabel) {
		const specificBonuses = getIncidentSpecificBonus(incidentTypeLabel);
		for (const resId of resourceIds) {
			const semanticKey = RESOURCE_CATEGORIES[resId] ?? resId;
			const bonus = specificBonuses[semanticKey];
			if (bonus !== undefined && bonus > 1 && !usedSpecificCategories.has(semanticKey)) {
				usedSpecificCategories.add(semanticKey);
				const additiveBonus = Math.round((bonus - 1) * 100);
				incidentSpecificBonuses[semanticKey] = additiveBonus;
				total += additiveBonus;
			}
		}
	}
	for (const [category, bonus] of Object.entries(incidentSpecificBonuses)) {
		const displayName = RESOURCE_NAMES[category] ?? category;
		breakdown.push({ label: `${displayName} synergy`, value: bonus });
	}

	// --- RESOURCE QUANTITY BONUS ---
	const quantityBonus = Math.max(0, resourceIds.length - 1);
	total += quantityBonus;
	if (quantityBonus > 0)
		breakdown.push({ label: "Additional gear", value: quantityBonus });

	// --- TEAM SIZE BONUS ---
	let teamBonus = 0;
	if (vigilantes.length >= 2) {
		teamBonus += 3;
		total += 3;
	}
	if (vigilantes.length >= 3) {
		teamBonus += 2;
		total += 2;
	}
	if (teamBonus > 0)
		breakdown.push({ label: "Team coordination", value: teamBonus });

	// --- BUFF ALIGNMENT ---
	let buffBonus = 0;
	for (const buffId of buffIds) {
		const applicable = BUFF_ALIGNMENT[buffId] ?? [];
		if (applicable.includes(incidentType)) {
			buffBonus += 7;
			total += 7;
		}
	}
	if (buffBonus > 0)
		breakdown.push({ label: "Strategic upgrades", value: buffBonus });

	// --- FLAT BONUS ---
	if (flatBonus !== 0) {
		total += flatBonus;
		breakdown.push({ label: "Rapid Response", value: flatBonus });
	}

	const beforeLuckPercent = Math.max(1, Math.min(99, Math.round(total)));

	// --- Incident-specific multiplier for debugging ---
	let incidentSpecificMultiplier = 1;
	if (incidentTypeLabel) {
		const specificBonuses = getIncidentSpecificBonus(incidentTypeLabel);
		for (const category of Object.keys(incidentSpecificBonuses)) {
			incidentSpecificMultiplier *= specificBonuses[category];
		}
		incidentSpecificMultiplier = Math.max(
			0.72,
			Math.min(1.38, incidentSpecificMultiplier),
		);
	}

	return {
		successPercent: beforeLuckPercent,
		beforeLuckPercent,
		breakdown,
		reasoning: "", // we no longer need reasoning string with sum
		avgArchetypeFit: avgStatFit,
		incidentSpecificMultiplier,
	};
}

/**
 * Generate a roll (0-100) where lower is better.
 * Correlation: better archetype fit produces more predictable (lower) rolls.
 */
export function generateRoll(
	avgArchetypeFit: number,
	rng: () => number = Math.random,
): number {
	const adjustedPercent = 50; // unused reference
	const t = Math.max(5, Math.min(95, adjustedPercent));
	const fit = Math.max(0, Math.min(1, avgArchetypeFit));
	const blend = Math.max(0, Math.min(1, 0.58 * fit));
	const chaos = rng() * 100;
	const cap = Math.max(0.01, t - 0.5);
	const discipline = rng() * cap;
	return (1 - blend) * chaos + blend * discipline;
}
