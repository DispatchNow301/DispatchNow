import { NextRequest, NextResponse } from "next/server";

interface SuccessCalculationRequest {
	incidentType: string;
	incidentDescription?: string;
	vigilantes: Array<{
		name: string;
		stats: {
			strength: number;
			intelligence: number;
			speed: number;
		};
	}>;
	resources: string[];
	buffIds?: string[];
}

// Stat weights for each incident type (normalized 0-1)
const STAT_WEIGHTS: Record<string, Record<string, number>> = {
	crime: { strength: 0.4, intelligence: 0.3, speed: 0.3 },
	fire_rescue: { intelligence: 0.4, strength: 0.3, speed: 0.3 },
	medical: { intelligence: 0.5, speed: 0.3, strength: 0.2 },
	disaster: { intelligence: 0.4, strength: 0.35, speed: 0.25 },
	traffic: { speed: 0.4, intelligence: 0.35, strength: 0.25 },
};

// Resource alignment for each incident type (0-1 scale)
const RESOURCE_ALIGNMENT: Record<string, Record<string, number>> = {
	crime: {
		restraint: 1.0,
		communication: 0.8,
		reconnaissance: 0.8,
		protection: 0.5,
		medical: 0.2,
		fire_suppression: 0,
	},
	fire_rescue: {
		fire_suppression: 1.0,
		extrication: 0.9,
		medical: 0.7,
		protection: 0.8,
		communication: 0.5,
		restraint: 0,
	},
	medical: {
		medical: 1.0,
		communication: 0.6,
		protection: 0.5,
		extrication: 0.3,
		transport: 0.4,
		fire_suppression: 0,
	},
	disaster: {
		extrication: 1.0,
		protection: 0.9,
		medical: 0.7,
		communication: 0.6,
		intelligence: 0.5,
		restraint: 0,
	},
	traffic: {
		communication: 1.0,
		transport: 0.8,
		protection: 0.6,
		intelligence: 0.7,
		medical: 0.3,
		fire_suppression: 0,
	},
};

// Buff to incident type alignment
const BUFF_ALIGNMENT: Record<string, string[]> = {
	noir_focus: ["crime"],
	shadow_lag: ["crime"],
	street_network: ["crime"],
	thermal_protocol: ["fire_rescue"],
	vital_edge: ["medical"],
	catastrophe_stability: ["disaster"],
	urban_flow: ["traffic"],
};

// Map resource IDs to categories
const RESOURCE_CATEGORIES: Record<string, string> = {
	r3: "communication",
	r4: "restraint",
	r5: "reconnaissance",
	r1: "medical",
	r8: "medical",
	r2: "fire_suppression",
	r6: "protection",
	r7: "containment",
	r9: "extrication",
	r10: "transport",
};

interface CalculationResult {
	successPercent: number;
	reasoning: string;
}

export function calculateSuccessChance(
	req: SuccessCalculationRequest,
): CalculationResult {
	const incidentType = req.incidentType.toLowerCase();
	const statWeights = STAT_WEIGHTS[incidentType] || STAT_WEIGHTS.crime;
	const resourceAlignment =
		RESOURCE_ALIGNMENT[incidentType] || RESOURCE_ALIGNMENT.crime;

	// === BASE RATE ===
	let total = 25; // Base for solo, average stats, no resources
	const reasoningParts: string[] = ["Base 25%"];

	// === STAT ALIGNMENT BONUS (0-20%) ===
	let totalStatFit = 0;
	for (const vig of req.vigilantes) {
		let vigFit = 0;
		for (const [stat, weight] of Object.entries(statWeights)) {
			const statValue = vig.stats[stat as keyof typeof vig.stats] || 0;
			vigFit += (statValue / 5) * weight;
		}
		totalStatFit += vigFit;
	}
	const avgStatFit = totalStatFit / Math.max(1, req.vigilantes.length);
	const statBonus = Math.round(avgStatFit * 20);
	if (statBonus > 0) {
		total += statBonus;
		reasoningParts.push(`Stat fit +${statBonus}%`);
	} else if (statBonus < 0) {
		total += statBonus;
		reasoningParts.push(`Stat fit ${statBonus}%`);
	}

	// === RESOURCE BONUS (with diminishing returns) ===
	const resourceUsed = new Set<string>();
	let resourceBonus = 0;
	for (const resId of req.resources) {
		const category = RESOURCE_CATEGORIES[resId] || resId;
		const alignment = resourceAlignment[category] || 0;

		if (alignment > 0) {
			if (!resourceUsed.has(category)) {
				// First of each category: full 0-20% bonus
				resourceBonus += Math.round(alignment * 20);
				resourceUsed.add(category);
			} else {
				// Duplicates: diminishing returns (50% of full bonus)
				resourceBonus += Math.round(alignment * 20 * 0.5);
			}
		}
	}

	if (resourceBonus > 0) {
		total += resourceBonus;
		reasoningParts.push(`Resources +${resourceBonus}%`);
	} else if (req.resources.length === 0) {
		reasoningParts.push("No resources");
	}

	// === TEAM BONUS (small bonus for multiple operatives) ===
	let teamBonus = 0;
	if (req.vigilantes.length >= 2) {
		teamBonus += 3;
		total += 3;
	}
	if (req.vigilantes.length >= 3) {
		teamBonus += 2;
		total += 2;
	}
	if (teamBonus > 0) {
		reasoningParts.push(`Team +${teamBonus}%`);
	}

	// === BUFF BONUS (7% per incident-aligned buff) ===
	let buffBonus = 0;
	for (const buffId of req.buffIds || []) {
		const applicableIncidents = BUFF_ALIGNMENT[buffId] || [];
		if (applicableIncidents.includes(incidentType)) {
			buffBonus += 7;
			total += 7;
		}
	}
	if (buffBonus > 0) {
		reasoningParts.push(`Buffs +${buffBonus}%`);
	}

	// === CLAMP TO 1-99 ===
	const successPercent = Math.max(1, Math.min(99, total));

	// === BUILD REASONING ===
	const teamSummary =
		req.vigilantes.length === 1
			? `solo ${req.vigilantes[0]?.name || "vigilante"}`
			: `${req.vigilantes.length}-person team (${req.vigilantes.map((v) => v.name).join(", ")})`;

	const reasoning = `${teamSummary} on ${req.incidentType}. ${reasoningParts.join(" + ")} = ${successPercent}%`;

	return { successPercent, reasoning };
}

export async function POST(req: NextRequest) {
	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const payload = body as SuccessCalculationRequest;
	if (
		!payload?.incidentType ||
		!payload?.vigilantes ||
		payload?.resources === undefined
	) {
		return NextResponse.json(
			{
				error: "Expected incidentType, vigilantes array, and resources array",
			},
			{ status: 400 },
		);
	}

	try {
		const result = calculateSuccessChance(payload);

		console.log(
			`[SuccessCalc] ${payload.incidentType} | Team: ${payload.vigilantes.length} | Resources: ${payload.resources.length} | Result: ${result.successPercent}%`,
		);

		return NextResponse.json({
			successPercent: result.successPercent,
			rawOutput: result.reasoning,
		});
	} catch (error) {
		console.error("[SuccessCalc] Error:", error);
		return NextResponse.json(
			{
				error: "Failed to calculate success chance",
				details: String(error),
			},
			{ status: 500 },
		);
	}
}
