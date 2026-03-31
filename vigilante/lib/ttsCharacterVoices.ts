/**
 * InWorld AI TTS voice configuration
 * Maps character IDs to InWorld voice names
 */

export type CharacterGender = "male" | "female";

/** Explicit gender per `speakerId` / vigilante `id`. */
export const CHARACTER_GENDER: Record<string, CharacterGender> = {
	// Map & incident dialogue
	"old-man": "male", // OldMan
	girl: "female", // Girl
	woman: "female", // Woman
	helper: "female", // Helper (unassigned - will use fallback)
	"cop-diaz": "female", // OfficerDiaz
	"cop-kim": "male", // DetectiveKim
	"chief-williams": "male", // ChiefWilliams
	dispatcher: "male", // Kevin (dispatch)
	"familiar-face": "male", // DisguisedKim (Evan undercover)

	// Vigilante roster (`app/components/data/vigilante.ts`)
	adam: "male",
	ashley: "female",
	bruce: "male",
	iris: "female",
	jen: "female",
	kevin: "male",
	marcus: "male",
	parya: "female",
	robin: "female",
	tom: "male",
	z: "male",
	zonaka: "male",
	"fake-tom": "male", // vetting stand-in art
};

export function getGenderForCharacter(characterId: string): CharacterGender {
	const g = CHARACTER_GENDER[characterId];
	if (g) return g;
	// Fallback: try to infer from characterId
	const id = characterId.toLowerCase();
	if (
		id.includes("girl") ||
		id.includes("woman") ||
		id === "parya" ||
		id.includes("ashley") ||
		id.includes("iris") ||
		id.includes("jen") ||
		id.includes("robin")
	) {
		return "female";
	}
	return "male";
}

/** Voice mapping - InWorld voice names */
export const CHARACTER_VOICES: Record<string, string> = {
	// Story / map NPCs
	"old-man": "Ronald",
	girl: "Selene",
	woman: "Verionica",
	helper: "Abby", // not specified, using Abby as default
	"cop-diaz": "Miranda",
	"cop-kim": "Victor",
	"chief-williams": "Rupert",
	dispatcher: "Vinny",
	"familiar-face": "Callum",

	// Vigilantes
	adam: "Blake",
	ashley: "Abby",
	bruce: "Brandon",
	iris: "Chloe",
	jen: "Jessica",
	kevin: "Vinny",
	marcus: "Malcolm",
	parya: "Victoria",
	robin: "Pippa",
	tom: "Lucian",
	z: "Hades",
	zonaka: "Edward",
	"fake-tom": "Conrad",
};

/**
 * Get the InWorld voice ID for a character
 * InWorld uses voice IDs (e.g., "Abby", "Brian", etc.)
 */
export function getVoiceForCharacter(characterId: string): string {
	const mapped = CHARACTER_VOICES[characterId];
	if (mapped) {
		console.log("[InWorld TTS] Mapped voice:", characterId, "->", mapped);
		return mapped;
	}
	console.warn(
		"[InWorld TTS] No voice mapping for characterId:",
		characterId,
		"| using fallback: Abby",
	);
	return "Abby"; // default fallback
}
