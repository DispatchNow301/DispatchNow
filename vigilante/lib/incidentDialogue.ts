import type { IncidentArchetype } from "./incidentTemplates";
import { CHARACTER_PORTRAIT_URLS as V, NPC_PORTRAIT } from "./characterPortraitUrls";

// ── Types ─────────────────────────────────────────────────────────────────────

export type IncidentDialogueLine = {
	/** Matches keys in `CHARACTER_VOICES` / `CHARACTER_GENDER` (`lib/ttsCharacterVoices.ts`) — npc id, vigilante id, or "dispatcher" */
	speakerId: string;
	speakerName: string;
	speakerRole: "Citizen" | "Police" | "Chief" | "Dispatcher" | "Vigilante";
	/** Portrait URL — use `NPC_PORTRAIT` / `CHARACTER_PORTRAIT_URLS` only */
	portrait: string;
	text: string;
};

/** Voiced line when a new incident appears on the map (0–1). */
export const INCIDENT_SPAWN_DIALOGUE_CHANCE = 0.38;
/** Voiced line when the player opens an incident from the map (0–1). */
export const INCIDENT_SELECT_DIALOGUE_CHANCE = 0.22;
/** Voiced line when a recruit lead spawns (0–1). */
export const RECRUIT_LEAD_DIALOGUE_CHANCE = 0.42;

// ── Helpers ───────────────────────────────────────────────────────────────────

const VIG_DISPLAY_NAME: Record<string, string> = {
	adam: "Adam",
	ashley: "Ashley",
	bruce: "Bruce",
	iris: "Iris",
	jen: "Jen",
	kevin: "Kevin",
	marcus: "Marcus",
	parya: "Parya",
	robin: "Robin",
	tom: "Tom",
	z: "Z",
	zonaka: "Zonaka",
	"familiar-face": "Evan Vale",
	"fake-tom": "Tom",
};

function portraitForVigilante(vigilanteId: string): string {
	if (vigilanteId === "familiar-face") return V.disguisedKim;
	const p = (V as Record<string, string>)[vigilanteId];
	return p ?? V.kevin;
}

// ── Incident lines per archetype ──────────────────────────────────────────────

const CRIME_LINES: IncidentDialogueLine[] = [
	{
		speakerId: "dispatcher",
		speakerName: "Dispatcher",
		speakerRole: "Dispatcher",
		portrait: NPC_PORTRAIT.dispatcher,
		text: "Units, we have a report of armed suspects in the area. Civilians are sheltering. Proceed with caution.",
	},
	{
		speakerId: "dispatcher",
		speakerName: "Dispatcher",
		speakerRole: "Dispatcher",
		portrait: NPC_PORTRAIT.dispatcher,
		text: "All cars, shots-fired call upgraded — possible robbery in progress. Witnesses scattered, get me a perimeter.",
	},
	{
		speakerId: "dispatcher",
		speakerName: "Dispatcher",
		speakerRole: "Dispatcher",
		portrait: NPC_PORTRAIT.dispatcher,
		text: "Silent alarm tripped at the location. Backup is staged two blocks north — don't wait on me if someone's hurt.",
	},
	{
		speakerId: "cop-diaz",
		speakerName: "Officer Diaz",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.officerDiaz,
		text: "I'm already two blocks out. Tell your people to stay back — last thing I need is civilians muddying my crime scene.",
	},
	{
		speakerId: "cop-diaz",
		speakerName: "Officer Diaz",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.officerDiaz,
		text: "I'm rolling code. If your vigilantes beat me there, they do not touch evidence — clear?",
	},
	{
		speakerId: "cop-kim",
		speakerName: "Detective Kim",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.detectiveKim,
		text: "Witness statements conflict — that's either panic or someone's lying. I'm logging everything before the scene gets walked on.",
	},
	{
		speakerId: "cop-kim",
		speakerName: "Detective Kim",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.detectiveKim,
		text: "Shell casings in a line — disciplined shooter. Whoever this is, they trained for this block.",
	},
	{
		speakerId: "cit-helper",
		speakerName: "Helper",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenHelper,
		text: "I saw them cut through the alley behind the bodega. They split up — one headed east, one went down the stairs.",
	},
	{
		speakerId: "cit-helper",
		speakerName: "Helper",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenHelper,
		text: "Security cam on the corner caught two masks and a duffel. I can send you the clip if your crew moves fast.",
	},
	{
		speakerId: "cit-woman",
		speakerName: "Woman",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenWoman,
		text: "They looked professional. No shouting, no panic. Just fast and quiet. That's what scares me.",
	},
	{
		speakerId: "cit-woman",
		speakerName: "Woman",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenWoman,
		text: "Nobody's answering upstairs. If your people go in, please — knock first, don't kick down my neighbor's door.",
	},
	{
		speakerId: "cit-girl",
		speakerName: "Girl",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenGirl,
		text: "They ran past me like I wasn't even there. One of them laughed. Who laughs during that?",
	},
	{
		speakerId: "cit-oldman",
		speakerName: "Old Man",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenOldMan,
		text: "Same corner as last month. Different jackets, same energy. Something's feeding this block trouble.",
	},
	{
		speakerId: "bruce",
		speakerName: "Bruce",
		speakerRole: "Vigilante",
		portrait: NPC_PORTRAIT.bruce,
		text: "I've seen this pattern before. It's not random — they're casing the block. We move now or we lose them.",
	},
	{
		speakerId: "bruce",
		speakerName: "Bruce",
		speakerRole: "Vigilante",
		portrait: NPC_PORTRAIT.bruce,
		text: "Give me two on the roof, one on the street. We box them before they ghost into the subway.",
	},
	{
		speakerId: "parya",
		speakerName: "Parya",
		speakerRole: "Vigilante",
		portrait: NPC_PORTRAIT.parya,
		text: "Three entry points, two exits. If we split the team right we can corner them without anyone getting hurt.",
	},
	{
		speakerId: "parya",
		speakerName: "Parya",
		speakerRole: "Vigilante",
		portrait: NPC_PORTRAIT.parya,
		text: "I'm watching the rear stairwell. If they double back, I'll radio before I move — no cowboy stuff.",
	},
	{
		speakerId: "adam",
		speakerName: "Adam",
		speakerRole: "Vigilante",
		portrait: V.adam,
		text: "If this is a crew hit, they'll have a lookout on the next block. I'm sweeping adjacent roofs first.",
	},
	{
		speakerId: "ashley",
		speakerName: "Ashley",
		speakerRole: "Vigilante",
		portrait: V.ashley,
		text: "I'm not chasing glory — I'm cutting off their escape route. Someone cover the alley mouth.",
	},
	{
		speakerId: "marcus",
		speakerName: "Marcus",
		speakerRole: "Vigilante",
		portrait: V.marcus,
		text: "Calm voices, loud streets — classic misdirection. Watch the windows opposite the storefront.",
	},
	{
		speakerId: "z",
		speakerName: "Z",
		speakerRole: "Vigilante",
		portrait: V.z,
		text: "I'll take point on the stairwell. You hold the street — nobody runs through me twice.",
	},
	{
		speakerId: "familiar-face",
		speakerName: "Evan Vale",
		speakerRole: "Vigilante",
		portrait: V.disguisedKim,
		text: "I'm noting every face that leaves the building. If someone doesn't belong, I'll flag it quietly.",
	},
];

const FIRE_RESCUE_LINES: IncidentDialogueLine[] = [
	{
		speakerId: "dispatcher",
		speakerName: "Dispatcher",
		speakerRole: "Dispatcher",
		portrait: NPC_PORTRAIT.dispatcher,
		text: "Structure fire reported at the location. Fire units are en route — ETA twelve minutes. Occupants unaccounted for.",
	},
	{
		speakerId: "dispatcher",
		speakerName: "Dispatcher",
		speakerRole: "Dispatcher",
		portrait: NPC_PORTRAIT.dispatcher,
		text: "Smoke showing on multiple floors — possible trapped civilians. All responders, stage for vent-enter-search.",
	},
	{
		speakerId: "dispatcher",
		speakerName: "Dispatcher",
		speakerRole: "Dispatcher",
		portrait: NPC_PORTRAIT.dispatcher,
		text: "Gas line in the basement reported — assume hazardous atmosphere until fire clears the scene.",
	},
	{
		speakerId: "cit-woman",
		speakerName: "Woman",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenWoman,
		text: "There are people on the upper floors. The stairwell is already smoke-filled. Please — someone needs to go in now.",
	},
	{
		speakerId: "cit-woman",
		speakerName: "Woman",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenWoman,
		text: "I can hear kids crying but I can't see through the smoke. Please tell me someone's going up there.",
	},
	{
		speakerId: "cit-oldman",
		speakerName: "Old Man",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenOldMan,
		text: "I built half those walls myself. The back staircase — northwest corner — it's the only way up that won't collapse.",
	},
	{
		speakerId: "cit-oldman",
		speakerName: "Old Man",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenOldMan,
		text: "Sprinkler system's ancient — don't trust it. The pressure drops after the first minute.",
	},
	{
		speakerId: "cit-helper",
		speakerName: "Helper",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenHelper,
		text: "I've got a flashlight and a wet towel — it's not much, but I can guide people to the fire escape.",
	},
	{
		speakerId: "cop-kim",
		speakerName: "Detective Kim",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.detectiveKim,
		text: "Fire marshal says the origin point looks off. Don't just rescue — keep your eyes open in there.",
	},
	{
		speakerId: "cop-kim",
		speakerName: "Detective Kim",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.detectiveKim,
		text: "If this is arson, there'll be accelerant traces. Don't let well-meaning hands disturb the floor near the ignition site.",
	},
	{
		speakerId: "cop-diaz",
		speakerName: "Officer Diaz",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.officerDiaz,
		text: "I'm holding the cordon — gawkers are already filming. Clear the sidewalk or we lose ladder space.",
	},
	{
		speakerId: "chief-williams",
		speakerName: "Chief Williams",
		speakerRole: "Chief",
		portrait: NPC_PORTRAIT.chiefWilliams,
		text: "I want every adjacent building evacuated before we lose more than the one structure — no heroics without backup.",
	},
	{
		speakerId: "bruce",
		speakerName: "Bruce",
		speakerRole: "Vigilante",
		portrait: NPC_PORTRAIT.bruce,
		text: "Twelve minutes is a lifetime. We go in, we sweep the upper floors, we're out before the trucks arrive.",
	},
	{
		speakerId: "bruce",
		speakerName: "Bruce",
		speakerRole: "Vigilante",
		portrait: NPC_PORTRAIT.bruce,
		text: "I'll take the smoke-heavy floor — I've got the mask. You pull anyone breathing toward the fire escape.",
	},
	{
		speakerId: "iris",
		speakerName: "Iris",
		speakerRole: "Vigilante",
		portrait: V.iris,
		text: "I'm counting windows — if a curtain moves, someone's still in there. I'll call out room by room.",
	},
	{
		speakerId: "robin",
		speakerName: "Robin",
		speakerRole: "Vigilante",
		portrait: V.robin,
		text: "I'll handle crowd control on the street — panic spreads faster than flames sometimes.",
	},
	{
		speakerId: "zonaka",
		speakerName: "Zonaka",
		speakerRole: "Vigilante",
		portrait: V.zonaka,
		text: "Heat's pushing up the stairwell — we need ventilation discipline or nobody gets a second pass.",
	},
];

const MEDICAL_LINES: IncidentDialogueLine[] = [
	{
		speakerId: "dispatcher",
		speakerName: "Dispatcher",
		speakerRole: "Dispatcher",
		portrait: NPC_PORTRAIT.dispatcher,
		text: "Medical emergency — civilian down at the reported location. ETA on ambulance is nine minutes. Anyone closer, respond.",
	},
	{
		speakerId: "dispatcher",
		speakerName: "Dispatcher",
		speakerRole: "Dispatcher",
		portrait: NPC_PORTRAIT.dispatcher,
		text: "Possible overdose reported — naloxone requested if available. Caller states victim is non-responsive.",
	},
	{
		speakerId: "dispatcher",
		speakerName: "Dispatcher",
		speakerRole: "Dispatcher",
		portrait: NPC_PORTRAIT.dispatcher,
		text: "Bleeding incident — pressure dressing and airway priority. PD is clearing the crowd now.",
	},
	{
		speakerId: "cit-helper",
		speakerName: "Helper",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenHelper,
		text: "Nine minutes is too long. I've got basic first aid but whoever's down needs more than I can give.",
	},
	{
		speakerId: "cit-helper",
		speakerName: "Helper",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenHelper,
		text: "I've got gloves and gauze — tell me what you need me to hold pressure on.",
	},
	{
		speakerId: "cit-girl",
		speakerName: "Girl",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenGirl,
		text: "She just collapsed. No warning. Nobody's moving to help — everyone's just standing there staring.",
	},
	{
		speakerId: "cit-girl",
		speakerName: "Girl",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenGirl,
		text: "I called 911 twice — please, someone with a real kit get here before they stop breathing.",
	},
	{
		speakerId: "cit-woman",
		speakerName: "Woman",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenWoman,
		text: "There's a nurse on four who can't get downstairs — the elevator's jammed. Send someone up for her supplies.",
	},
	{
		speakerId: "cit-oldman",
		speakerName: "Old Man",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenOldMan,
		text: "I've seen heart attacks on this block before — time is everything. Don't let anyone block the curb.",
	},
	{
		speakerId: "parya",
		speakerName: "Parya",
		speakerRole: "Vigilante",
		portrait: NPC_PORTRAIT.parya,
		text: "I've got a med kit and the training. Get me there in four minutes and I can stabilize until the ambulance arrives.",
	},
	{
		speakerId: "parya",
		speakerName: "Parya",
		speakerRole: "Vigilante",
		portrait: NPC_PORTRAIT.parya,
		text: "I'm en route — if someone's doing CPR, don't stop for me. I'll take over when I'm hands-on.",
	},
	{
		speakerId: "cop-diaz",
		speakerName: "Officer Diaz",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.officerDiaz,
		text: "I'm directing traffic away from the scene. If your people can clear a path for the ambulance, do it.",
	},
	{
		speakerId: "cop-diaz",
		speakerName: "Officer Diaz",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.officerDiaz,
		text: "Crowd's pushing in for a look — I'm not arresting gawkers unless they trample medics.",
	},
	{
		speakerId: "cop-kim",
		speakerName: "Detective Kim",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.detectiveKim,
		text: "If this wasn't an accident, I want photos of the scene before it's cleaned — subtle, no flash.",
	},
	{
		speakerId: "jen",
		speakerName: "Jen",
		speakerRole: "Vigilante",
		portrait: V.jen,
		text: "I'm two minutes out — if someone's holding C-spine, tell them not to let go until EMS relieves them.",
	},
	{
		speakerId: "tom",
		speakerName: "Tom",
		speakerRole: "Vigilante",
		portrait: V.tom,
		text: "I'll handle crowd control — medics need a straight line from curb to patient. Move, don't argue.",
	},
	{
		speakerId: "kevin",
		speakerName: "Kevin",
		speakerRole: "Vigilante",
		portrait: V.kevin,
		text: "Patch me through if scene radio gets messy — I'll coordinate who goes in first.",
	},
];

const DISASTER_LINES: IncidentDialogueLine[] = [
	{
		speakerId: "chief-williams",
		speakerName: "Chief Williams",
		speakerRole: "Chief",
		portrait: NPC_PORTRAIT.chiefWilliams,
		text: "The whole grid's compromised. This is bigger than any single unit — we need every available resource on this, now.",
	},
	{
		speakerId: "chief-williams",
		speakerName: "Chief Williams",
		speakerRole: "Chief",
		portrait: NPC_PORTRAIT.chiefWilliams,
		text: "I'm declaring a unified command — PD, fire, and any vigilante teams on channel follow my traffic pattern. No freelancing.",
	},
	{
		speakerId: "dispatcher",
		speakerName: "Dispatcher",
		speakerRole: "Dispatcher",
		portrait: NPC_PORTRAIT.dispatcher,
		text: "All units, we need eyes on the perimeter. Secondary incidents are expected. Do not let civilians near the zone.",
	},
	{
		speakerId: "dispatcher",
		speakerName: "Dispatcher",
		speakerRole: "Dispatcher",
		portrait: NPC_PORTRAIT.dispatcher,
		text: "Infrastructure damage reported — assume downed lines and unstable façades until engineers clear.",
	},
	{
		speakerId: "cit-oldman",
		speakerName: "Old Man",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenOldMan,
		text: "I've never seen anything like it. The whole block shook. People are in the street, nobody knows which way to run.",
	},
	{
		speakerId: "cit-woman",
		speakerName: "Woman",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenWoman,
		text: "The dust hasn't settled — people are coughing, kids are crying. We need water and masks, not speeches.",
	},
	{
		speakerId: "cit-helper",
		speakerName: "Helper",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenHelper,
		text: "I'm organizing a headcount at the church basement — send anyone disoriented my way.",
	},
	{
		speakerId: "bruce",
		speakerName: "Bruce",
		speakerRole: "Vigilante",
		portrait: NPC_PORTRAIT.bruce,
		text: "Forget the perimeter — the real danger is the secondary collapse risk. We need to clear the adjacent buildings first.",
	},
	{
		speakerId: "bruce",
		speakerName: "Bruce",
		speakerRole: "Vigilante",
		portrait: NPC_PORTRAIT.bruce,
		text: "I'll sweep the low floors — you watch for falling glass from the high rises. Helmets on.",
	},
	{
		speakerId: "cop-kim",
		speakerName: "Detective Kim",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.detectiveKim,
		text: "I'm running a pattern on the incidents today. This doesn't feel random. Something's being covered up.",
	},
	{
		speakerId: "cop-kim",
		speakerName: "Detective Kim",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.detectiveKim,
		text: "If this was infrastructure sabotage, I want chain-of-custody on every photo — no leaks to the press yet.",
	},
	{
		speakerId: "cop-diaz",
		speakerName: "Officer Diaz",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.officerDiaz,
		text: "I'm holding the outer cordon — nobody crosses without a safety vest. I don't care how important they think they are.",
	},
	{
		speakerId: "parya",
		speakerName: "Parya",
		speakerRole: "Vigilante",
		portrait: NPC_PORTRAIT.parya,
		text: "We triage by mobility — walking wounded first to staging, then we double back for anyone trapped.",
	},
	{
		speakerId: "marcus",
		speakerName: "Marcus",
		speakerRole: "Vigilante",
		portrait: V.marcus,
		text: "Calm voices, steady hands — panic kills more people in a disaster than debris.",
	},
	{
		speakerId: "zonaka",
		speakerName: "Zonaka",
		speakerRole: "Vigilante",
		portrait: V.zonaka,
		text: "I'm mapping structural cracks — if I flag a building, nobody goes in without a second pair of eyes.",
	},
];

const TRAFFIC_LINES: IncidentDialogueLine[] = [
	{
		speakerId: "dispatcher",
		speakerName: "Dispatcher",
		speakerRole: "Dispatcher",
		portrait: NPC_PORTRAIT.dispatcher,
		text: "Traffic blockage reported — two lanes down, emergency vehicle access compromised. Secondary incidents developing nearby.",
	},
	{
		speakerId: "dispatcher",
		speakerName: "Dispatcher",
		speakerRole: "Dispatcher",
		portrait: NPC_PORTRAIT.dispatcher,
		text: "Multi-vehicle tie-up — possible injuries. EMS is threading through side streets; keep intersections clear.",
	},
	{
		speakerId: "cop-kim",
		speakerName: "Detective Kim",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.detectiveKim,
		text: "It's blocking two lanes and nobody's touching it. Could be a breakdown, could be deliberate. I don't like the positioning.",
	},
	{
		speakerId: "cop-kim",
		speakerName: "Detective Kim",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.detectiveKim,
		text: "Plate check came back clean on the abandoned car — that makes it smell worse, not better.",
	},
	{
		speakerId: "cop-diaz",
		speakerName: "Officer Diaz",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.officerDiaz,
		text: "I need that lane clear in five minutes or the whole district locks up. Whatever it takes.",
	},
	{
		speakerId: "cop-diaz",
		speakerName: "Officer Diaz",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.officerDiaz,
		text: "Tow trucks are fifteen out — if your crew can push that wreck an inch without scratching paint, do it.",
	},
	{
		speakerId: "cit-helper",
		speakerName: "Helper",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenHelper,
		text: "The driver bailed before anyone could get a look at them. Left the engine running. That's not an accident.",
	},
	{
		speakerId: "cit-woman",
		speakerName: "Woman",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenWoman,
		text: "Honking's echoing off the buildings — people are losing patience. Someone's going to do something stupid.",
	},
	{
		speakerId: "cit-girl",
		speakerName: "Girl",
		speakerRole: "Citizen",
		portrait: NPC_PORTRAIT.citizenGirl,
		text: "A bus full of people is stuck behind the pile-up — they're going to miss connections, jobs, everything.",
	},
	{
		speakerId: "parya",
		speakerName: "Parya",
		speakerRole: "Vigilante",
		portrait: NPC_PORTRAIT.parya,
		text: "If it is deliberate, someone's watching to see how we respond. Act natural — don't let them know we're onto it.",
	},
	{
		speakerId: "parya",
		speakerName: "Parya",
		speakerRole: "Vigilante",
		portrait: NPC_PORTRAIT.parya,
		text: "I'll direct foot traffic on the sidewalk — your people focus on the vehicles.",
	},
	{
		speakerId: "kevin",
		speakerName: "Kevin",
		speakerRole: "Vigilante",
		portrait: V.kevin,
		text: "I'm on comms — if we rotate who waves traffic through, we avoid a second bottleneck at the next light.",
	},
	{
		speakerId: "tom",
		speakerName: "Tom",
		speakerRole: "Vigilante",
		portrait: V.tom,
		text: "I'll handle the angry drivers — you keep medics from getting boxed in.",
	},
	{
		speakerId: "ashley",
		speakerName: "Ashley",
		speakerRole: "Vigilante",
		portrait: V.ashley,
		text: "Give me flares if you have them — visibility's trash in this glare and people are tailgating.",
	},
	{
		speakerId: "z",
		speakerName: "Z",
		speakerRole: "Vigilante",
		portrait: V.z,
		text: "I'll walk the line of cars — anyone trying to squeeze through gets a firm no before they crunch someone.",
	},
];

// ── Recruit-lead radio / chatter ──────────────────────────────────────────────

const RECRUIT_STATIC_LINES: IncidentDialogueLine[] = [
	{
		speakerId: "dispatcher",
		speakerName: "Dispatcher",
		speakerRole: "Dispatcher",
		portrait: NPC_PORTRAIT.dispatcher,
		text: "Heads up — intel flagged a possible recruit in your operating area. Check your map for the new ping.",
	},
	{
		speakerId: "dispatcher",
		speakerName: "Dispatcher",
		speakerRole: "Dispatcher",
		portrait: NPC_PORTRAIT.dispatcher,
		text: "Unverified contact looking for work with vigilante crews. Use your judgment — vet before you bring them in.",
	},
	{
		speakerId: "dispatcher",
		speakerName: "Dispatcher",
		speakerRole: "Dispatcher",
		portrait: NPC_PORTRAIT.dispatcher,
		text: "Radio traffic mentions a freelancer asking questions about your roster. Might be talent, might be trouble.",
	},
	{
		speakerId: "kevin",
		speakerName: "Kevin",
		speakerRole: "Vigilante",
		portrait: V.kevin,
		text: "Someone new dropped a pin near you — if you're recruiting, that's your cue to move.",
	},
	{
		speakerId: "cop-kim",
		speakerName: "Detective Kim",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.detectiveKim,
		text: "Word on the street is someone's shopping for a crew. Not illegal — yet — but I'm logging the pattern.",
	},
	{
		speakerId: "cop-kim",
		speakerName: "Detective Kim",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.detectiveKim,
		text: "If you're about to meet a new recruit, try not to turn a coffee chat into a public spectacle.",
	},
	{
		speakerId: "cop-diaz",
		speakerName: "Officer Diaz",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.officerDiaz,
		text: "I don't care who you hire — just keep the meet off my sidewalks during rush hour.",
	},
	{
		speakerId: "cop-diaz",
		speakerName: "Officer Diaz",
		speakerRole: "Police",
		portrait: NPC_PORTRAIT.officerDiaz,
		text: "Another wannabe hero on the map? Fine. Don't make me write you up when they flake.",
	},
	{
		speakerId: "chief-williams",
		speakerName: "Chief Williams",
		speakerRole: "Chief",
		portrait: NPC_PORTRAIT.chiefWilliams,
		text: "Recruitment's your business until it spills into mine. Keep it clean.",
	},
	{
		speakerId: "bruce",
		speakerName: "Bruce",
		speakerRole: "Vigilante",
		portrait: NPC_PORTRAIT.bruce,
		text: "Fresh face on the wire — could be muscle, could be a liability. You vet them, not the block gossip.",
	},
	{
		speakerId: "parya",
		speakerName: "Parya",
		speakerRole: "Vigilante",
		portrait: NPC_PORTRAIT.parya,
		text: "If that ping is who I think it is, they're solid under pressure — but do your own interview.",
	},
];

// ── Lookup map ────────────────────────────────────────────────────────────────

const INCIDENT_DIALOGUE: Record<IncidentArchetype, IncidentDialogueLine[]> = {
	crime: CRIME_LINES,
	fire_rescue: FIRE_RESCUE_LINES,
	medical: MEDICAL_LINES,
	disaster: DISASTER_LINES,
	traffic: TRAFFIC_LINES,
};

// ── Public API ────────────────────────────────────────────────────────────────

export type PickIncidentDialogueOptions = {
	force?: boolean;
	/** Override default chance (uses `INCIDENT_SPAWN_DIALOGUE_CHANCE` when omitted). */
	chance?: number;
};

/**
 * Random line for an incident archetype. Uses `INCIDENT_SPAWN_DIALOGUE_CHANCE` unless overridden.
 * Second arg can be legacy `force: boolean` or an options object.
 */
export function pickIncidentDialogueLine(
	archetype: IncidentArchetype,
	options?: boolean | PickIncidentDialogueOptions,
): IncidentDialogueLine | null {
	const opts =
		typeof options === "boolean" ? { force: options } : (options ?? {});
	const force = opts.force ?? false;
	const chance = opts.chance ?? INCIDENT_SPAWN_DIALOGUE_CHANCE;
	if (!force && Math.random() > chance) return null;
	const pool = INCIDENT_DIALOGUE[archetype] ?? [];
	if (pool.length === 0) return null;
	return pool[Math.floor(Math.random() * pool.length)]!;
}

/** Radio-style line when a new recruit lead appears (uses recruit portrait when the line is in-character). */
export function pickRecruitDialogueLine(
	vigilanteId: string,
): IncidentDialogueLine | null {
	if (Math.random() > RECRUIT_LEAD_DIALOGUE_CHANCE) return null;
	const displayName = VIG_DISPLAY_NAME[vigilanteId] ?? "Recruit";
	const portrait = portraitForVigilante(vigilanteId);

	const dynamic: IncidentDialogueLine[] = [
		{
			speakerId: vigilanteId,
			speakerName: displayName,
			speakerRole: "Vigilante",
			portrait,
			text: `${displayName} here — I'm at the marker. If you're staffing up, I'd rather talk than stand around looking suspicious.`,
		},
		{
			speakerId: vigilanteId,
			speakerName: displayName,
			speakerRole: "Vigilante",
			portrait,
			text: `Name's ${displayName}. Heard you're building a crew. I'm not looking for drama — I'm looking for work that matters.`,
		},
		{
			speakerId: vigilanteId,
			speakerName: displayName,
			speakerRole: "Vigilante",
			portrait,
			text: `It's ${displayName}. Ping me when you're free — I'll stay put unless the block goes sideways.`,
		},
		{
			speakerId: vigilanteId,
			speakerName: displayName,
			speakerRole: "Vigilante",
			portrait,
			text: `${displayName} — I'm local to that marker. Coffee, rooftop, your call. Just don't leave me hanging.`,
		},
	];

	const pool = [...RECRUIT_STATIC_LINES, ...dynamic];
	return pool[Math.floor(Math.random() * pool.length)]!;
}
