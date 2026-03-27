export type NPCProfile = {
	id: string;
	name: string;
	role: "Citizen" | "Police" | "Chief" | "Dispatcher" | "Vigilante";
	portrait: string;
	lines: string[];
	personality?: string;
};

export type NPC_DIALOGUE_DATA = {
	citizens: NPCProfile[];
	police: NPCProfile[];
	chief: NPCProfile;
	dispatcher: NPCProfile;
};

// Import portrait URLs
import {
	CHARACTER_PORTRAIT_URLS as V,
	NPC_PORTRAIT,
} from "./characterPortraitUrls";

export const NPC_DIALOGUE: NPC_DIALOGUE_DATA = {
	citizens: [
		{
			id: "old-man",
			name: "Old Man",
			role: "Citizen",
			portrait: "/npcs/OldMan.png",
			lines: [
				"I've lived on this block thirty years. Something's wrong tonight.",
				"I heard boots in the alley. Then everything went quiet.",
				"I'm glad you're here. The city needs you.",
			],
			personality:
				"A weary long-time resident who's seen the neighborhood decline. Speaks from experience, cautious but supportive of vigilantes.",
		},
		{
			id: "girl",
			name: "Girl",
			role: "Citizen",
			portrait: "/npcs/Girl.png",
			lines: [
				"I saw them run past the subway. They looked armed.",
				"If you take this job, don't be late.",
				"I'm scared. I won't wait for the cops.",
			],
			personality:
				"Young, street-smart, and impatient. Urgent, direct, doesn't trust the police.",
		},
		{
			id: "woman",
			name: "Woman",
			role: "Citizen",
			portrait: "/npcs/Woman.png",
			lines: [
				"I feel scared on my street. Everyone is waiting for something bad.",
				"I'm not asking questions. I just need help.",
				"They moved fast. They knew what they were doing.",
			],
			personality:
				"Anxious but observant. Wants quick resolution, not details.",
		},
		{
			id: "helper",
			name: "Helper",
			role: "Citizen",
			portrait: "/npcs/Helper.png",
			lines: [
				"I can show your crew the building if they move now.",
				"I'm watching the block. Tell me what to do.",
				"Your people aren't subtle, but they're fast.",
			],
			personality:
				"An ally who provides tactical support. Cooperative and practical.",
		},
	],
	police: [
		{
			id: "cop-diaz",
			name: "Officer Diaz",
			role: "Police",
			portrait: "/npcs/OfficerDiaz.png",
			lines: [
				"I don't want to find your people at my crime scenes.",
				"Civilian intervention is illegal. Don't test me.",
				"Hey! Stop right there!",
			],
			personality:
				"Aggressive, by-the-book, distrusts vigilantes. Tends to bark orders.",
		},
		{
			id: "cop-kim",
			name: "Detective Kim",
			role: "Police",
			portrait: "/npcs/DetectiveKim.png",
			lines: [
				"This city turns people into vigilantes eventually.",
				"When your people make messes, we can't focus on important work.",
				"I see a pattern. I know what you're doing. I need proof.",
			],
			personality:
				"Cynical, intelligent, suspicious. Uses rhetorical pressure and observes carefully.",
		},
	],
	chief: {
		id: "chief-williams",
		name: "Chief Williams",
		role: "Chief",
		portrait: "/npcs/ChiefWilliams.png",
		lines: [
			"My officers can't hold the city together. It's slipping away.",
			"Damn vigilantes think they're helping. We don't need them.",
			"If you'll play guardian, then act like a professional.",
		],
		personality:
			"Stressed leadership, pragmatic but frustrated. Sees vigilantes as necessary evils, demands discipline.",
	},
	dispatcher: {
		id: "dispatcher",
		name: "Dispatcher",
		role: "Dispatcher",
		portrait: NPC_PORTRAIT.dispatcher,
		lines: [
			"We have armed suspects in the area. Civilians are sheltering. Use caution.",
			"All units, shots-fired call upgraded. Possible robbery in progress. Witnesses scattered. Set a perimeter.",
			"Silent alarm tripped. Backup is two blocks north. Don't wait if someone's hurt.",
		],
		personality:
			"Professional, urgent, information-focused. The voice of authority and coordination.",
	},
};

export function getNPCProfile(
	characterId: string,
	role: "Citizen" | "Police" | "Chief" | "Dispatcher" | "Vigilante",
): NPCProfile | null {
	if (role === "Dispatcher") return NPC_DIALOGUE.dispatcher;
	if (role === "Chief") return NPC_DIALOGUE.chief;

	const collection =
		role === "Police" ? NPC_DIALOGUE.police : NPC_DIALOGUE.citizens;
	return (
		collection.find((npc) => npc.id === characterId) ||
		collection[0] ||
		null
	);
}
