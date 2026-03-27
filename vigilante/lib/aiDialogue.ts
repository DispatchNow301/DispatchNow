import type { NPCProfile } from "./npcDialogueData";
import { getNPCProfile } from "./npcDialogueData";

export type AIDialogueContext = {
	characterId: string;
	characterRole: "Citizen" | "Police" | "Chief" | "Dispatcher" | "Vigilante";
	overallStory?: string;
	pastIncidents?: Array<{
		type: string;
		resolution: string;
		outcome?: string;
		date?: string;
	}>;
	currentIncident?: {
		type: string;
		description: string;
		location?: string;
		severity?: string;
	};
	situation?: string;
	// Optional: override the NPC profile with custom personality/portrait
	customProfile?: {
		name: string;
		portrait: string;
		personality?: string;
	};
};

type DialogueType = "past" | "current" | "story" | "unknown";

/**
 * Generate creative dialogue using Groq AI.
 * Returns null if AI fails or no API key is available.
 */
export async function generateAIDialogue(context: AIDialogueContext): Promise<{
	text: string;
	type: DialogueType;
	speakerName: string;
	speakerRole: typeof context.characterRole;
	portrait: string;
	speakerId: string;
} | null> {
	// Resolve NPC profile from shared data
	const profile: NPCProfile | null = context.customProfile
		? {
				id: context.characterId,
				name: context.customProfile.name,
				role: context.characterRole,
				portrait: context.customProfile.portrait,
				lines: [],
				personality: context.customProfile.personality,
			}
		: getNPCProfile(context.characterId, context.characterRole);

	if (!profile) {
		console.warn(
			`No NPC profile found for ${context.characterId} (${context.characterRole})`,
		);
		return null;
	}

	try {
		const response = await fetch("/api/generate-dialogue", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				character: {
					id: profile.id,
					name: profile.name,
					role: profile.role,
					personality: profile.personality,
					portrait: profile.portrait,
				},
				context: {
					overallStory: context.overallStory,
					pastIncidents: context.pastIncidents,
					currentIncident: context.currentIncident,
					situation: context.situation,
				},
			}),
		});

		if (!response.ok) {
			console.warn(
				"Groq API failed:",
				response.status,
				response.statusText,
			);
			return null;
		}

		const data = await response.json();
		// API now returns structured lines with types: [{type, text}, ...]
		const parsedLines = data.lines as
			| Array<{ type: string; text: string }>
			| undefined;

		if (!parsedLines || parsedLines.length === 0) {
			console.warn("No dialogue lines generated");
			return null;
		}

		// Pick a random line and preserve its type
		const selected =
			parsedLines[Math.floor(Math.random() * parsedLines.length)];

		return {
			text: selected.text,
			type: selected.type as DialogueType,
			speakerName: profile.name,
			speakerRole: profile.role,
			portrait: profile.portrait,
			speakerId: profile.id,
		};
	} catch (error) {
		console.error("Failed to generate Groq dialogue:", error);
		return null;
	}
}
