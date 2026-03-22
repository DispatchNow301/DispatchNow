/**
 * ElevenLabs **premade** voice IDs only (Voices → Premade in the app).
 * Do not use Voice Library, IVC, or PVC ids here — those can require paid credits or higher billing.
 * Paired with `eleven_turbo_v2_5` in the API route by default (more natural than Flash); override
 * with `ELEVENLABS_TTS_MODEL=eleven_flash_v2_5` for max free-tier character savings.
 *
 * Gender / cast alignment (story NPC ids + roster `vigilante.id`):
 * OldMan, Adam, Bruce, DisguisedKim (familiar-face), Kevin (dispatcher), Marcus, Tom, Z, Zonaka,
 * ChiefWilliams, DetectiveKim (cop-kim), FakeTom — male.
 * Ashley, Girl, Helper, Iris, Jen, Parya, Robin, Woman, OfficerDiaz — female.
 * @see https://elevenlabs-sdk.mintlify.app/voices/premade-voices
 */

export type CharacterGender = "male" | "female";

/** Explicit gender per `speakerId` / vigilante `id`. */
export const CHARACTER_GENDER: Record<string, CharacterGender> = {
	// Map & incident dialogue
	"cit-oldman": "male", // OldMan
	"cit-girl": "female", // Girl
	"cit-woman": "female", // Woman
	"cit-helper": "female", // Helper
	"cop-diaz": "female", // OfficerDiaz
	"cop-kim": "male", // DetectiveKim
	"chief-williams": "male", // ChiefWilliams
	dispatcher: "male", // Kevin (radio)
	bruce: "male",
	parya: "female",
	"familiar-face": "male", // DisguisedKim (Evan undercover)

	// Vigilante roster (`app/components/data/vigilante.ts`)
	adam: "male",
	ashley: "female",
	iris: "female",
	jen: "female",
	kevin: "male",
	marcus: "male",
	robin: "female",
	tom: "male",
	z: "male",
	zonaka: "male",
	"fake-tom": "male", // vetting stand-in art
};

function hashString(s: string): number {
	let h = 0;
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
	return Math.abs(h);
}

export function getGenderForCharacter(characterId: string): CharacterGender {
	const g = CHARACTER_GENDER[characterId];
	if (g) return g;
	const id = characterId.toLowerCase();
	if (id.includes("girl") || id.includes("woman") || id === "parya") {
		return "female";
	}
	return hashString(characterId) % 2 === 0 ? "female" : "male";
}

/** Core premade fallbacks for 402 retries — same gender only. */
export const FALLBACK_VOICE_ID_MALE = "pNInz6obpgDQGcFmaJgB"; // Adam
export const FALLBACK_VOICE_ID_FEMALE = "21m00Tcm4TlvDq8ikWAM"; // Rachel

const MALE_FALLBACK_CHAIN: string[] = [
	FALLBACK_VOICE_ID_MALE,
	"IKne3meq5aSn9XLyUdCD", // Charlie
	"iP95p4xoKVk53GoZ742B", // Chris
];

const FEMALE_FALLBACK_CHAIN: string[] = [
	FALLBACK_VOICE_ID_FEMALE,
	"pMsXgVXv3BLzUgSXRplE", // Serena
	"EXAVITQu4vr4xnSDxMaL", // Sarah
];

/** Ordered list of alternate premade voices (same gender) to try after 402, excluding `excludeId`. */
export function getVoiceFallbackChain(
	gender: CharacterGender,
	excludeId: string,
): string[] {
	const chain = gender === "male" ? MALE_FALLBACK_CHAIN : FEMALE_FALLBACK_CHAIN;
	return chain.filter((id) => id !== excludeId);
}

export const CHARACTER_VOICES: Record<string, string> = {
	// Story / map NPCs
	"cit-oldman": "ZQe5CZNOzWyzPSCn5a3c", // James — OldMan
	"cit-girl": "jsCqWAovK2LkecY7zXl4", // Freya — Girl
	"cit-woman": "pMsXgVXv3BLzUgSXRplE", // Serena — Woman
	"cit-helper": "LcfcDJNUP1GQjkzn1xUU", // Emily — Helper
	"cop-diaz": "EXAVITQu4vr4xnSDxMaL", // Sarah — OfficerDiaz
	"cop-kim": "TxGEqnHWrfWFTfGW9XjX", // Josh — DetectiveKim
	"chief-williams": "onwK4e9ZLuTAKqWW03F9", // Daniel — ChiefWilliams
	dispatcher: "5Q0t7uMcjvnagumLfvZi", // Paul — Kevin (dispatch)
	"familiar-face": "IKne3meq5aSn9XLyUdCD", // Charlie — DisguisedKim

	// Vigilantes (also used when `speakerId` is roster id)
	adam: "ErXwobaYiN019PkySvjV", // Antoni
	ashley: "AZnzlk1XvdvUeBnXmlld", // Domi
	bruce: "VR6AewLTigWG4xSOukaG", // Arnold
	iris: "XrExE9yKIg1WjnnlVkGX", // Matilda
	jen: "piTKgcLEGmPE4e6mEKli", // Nicole
	kevin: "nPczCjzI2devNBz1zQrb", // Brian
	marcus: "yoZ06aMxZJJ28mfd3POQ", // Sam
	parya: "XB0fDUnXU5powFXDhCwa", // Charlotte
	robin: "pFZP5JQG7iQjIQuC4Bku", // Lily
	tom: "JBFqnCBsd6RMkjVDRZzb", // George
	z: "N2lVS1w4EtoT3dr4eOWO", // Callum
	zonaka: "2EiwWnXFnvU5JabPnv8n", // Clyde
	"fake-tom": "GBv7mTt0atIp3Br8iCZE", // Thomas — FakeTom
};

const VIGILANTE_FALLBACK_VOICES_MALE = MALE_FALLBACK_CHAIN;
const VIGILANTE_FALLBACK_VOICES_FEMALE = FEMALE_FALLBACK_CHAIN;
let vigilanteFallbackIdx = 0;
const vigilanteFallbackMap: Record<string, string> = {};

export function getVoiceForCharacter(characterId: string): string {
	if (CHARACTER_VOICES[characterId]) return CHARACTER_VOICES[characterId]!;
	const gender = getGenderForCharacter(characterId);
	if (!vigilanteFallbackMap[characterId]) {
		const pool =
			gender === "male"
				? VIGILANTE_FALLBACK_VOICES_MALE
				: VIGILANTE_FALLBACK_VOICES_FEMALE;
		vigilanteFallbackMap[characterId] =
			pool[vigilanteFallbackIdx % pool.length]!;
		vigilanteFallbackIdx++;
	}
	return vigilanteFallbackMap[characterId]!;
}
