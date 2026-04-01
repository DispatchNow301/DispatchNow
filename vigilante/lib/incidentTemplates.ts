/**
 * Supported incident archetypes and copy templates (`INCIDENT_TEMPLATES`).
 * Spawning / weighting / filling templates is not implemented here — data only.
 */

export type IncidentArchetype =
	| "crime"
	| "fire_rescue"
	| "medical"
	| "disaster"
	| "traffic";

export type IncidentTemplate = {
	archetype: IncidentArchetype;
	/** Short chip in the incident list */
	typeLabel: string;
	/** One line. `{place}` is the venue name (already shortened). */
	summary: string;
	weight: number;
};

/** Keep on-map / panel lines readable without clipping weird OSM names. */
export function shortenPlaceName(name: string): string {
	const t = name.trim() || "this block";
	if (t.length <= 22) return t;
	const cut = t.slice(0, 22);
	const i = cut.lastIndexOf(" ");
	return (i > 8 ? cut.slice(0, i) : cut).trim() || t.slice(0, 18).trim();
}

export const INCIDENT_TEMPLATES: IncidentTemplate[] = [
	// ── Crime / police ──
	{
		archetype: "crime",
		typeLabel: "Burglary",
		summary: "Glass alarm at {place}. Intruders may still be inside.",
		weight: 5,
	},
	{
		archetype: "crime",
		typeLabel: "Shoplifting",
		summary: "Hostile shoplifter at {place}. Crowd at the exits.",
		weight: 5,
	},
	{
		archetype: "crime",
		typeLabel: "Assault",
		summary: "Fight on the sidewalk near {place}. Victim is down.",
		weight: 4,
	},
	{
		archetype: "crime",
		typeLabel: "Domestic dispute",
		summary: "Shouting and breaking glass reported at {place}.",
		weight: 4,
	},
	{
		archetype: "crime",
		typeLabel: "Suspicious person",
		summary: "Repeat loitering and bag checks outside {place}.",
		weight: 5,
	},
	{
		archetype: "crime",
		typeLabel: "Vandalism",
		summary: "Active tagging and property damage at {place}.",
		weight: 4,
	},
	{
		archetype: "crime",
		typeLabel: "Car theft",
		summary: "Vehicle theft in progress at {place}. Move fast.",
		weight: 4,
	},
	{
		archetype: "crime",
		typeLabel: "Pickpocketing",
		summary: "Pickpocket team working the crowd at {place}.",
		weight: 4,
	},
	{
		archetype: "crime",
		typeLabel: "Armed robbery",
		summary: "Weapons seen at {place}. Staff are in lockdown.",
		weight: 3,
	},
	{
		archetype: "crime",
		typeLabel: "Hostage situation",
		summary: "Hostages reported inside {place}. Perimeter forming.",
		weight: 2,
	},
	{
		archetype: "crime",
		typeLabel: "Gang fight",
		summary: "Rival crews fighting near {place}. Spilling into the street.",
		weight: 3,
	},
	{
		archetype: "crime",
		typeLabel: "Drive-by shooting",
		summary: "Shots from a moving vehicle near {place}.",
		weight: 2,
	},
	{
		archetype: "crime",
		typeLabel: "Drug deal",
		summary: "Open-air dealing and lookouts at {place}.",
		weight: 3,
	},
	{
		archetype: "crime",
		typeLabel: "Bank robbery",
		summary: "Silent alarm at {place}. Suspects may still be inside.",
		weight: 2,
	},
	{
		archetype: "crime",
		typeLabel: "High-speed chase",
		summary: "Pursuit heading toward {place}. Cut off exits.",
		weight: 2,
	},
	{
		archetype: "crime",
		typeLabel: "Riot",
		summary: "Violent crowd at {place}. Fires and projectiles.",
		weight: 2,
	},
	{
		archetype: "crime",
		typeLabel: "Prison escape",
		summary: "Possible escapee last seen near {place}.",
		weight: 1,
	},
	{
		archetype: "crime",
		typeLabel: "Terror threat",
		summary: "Credible threat focused on {place}. Partial evac.",
		weight: 1,
	},
	{
		archetype: "crime",
		typeLabel: "Bomb threat",
		summary: "Bomb threat called in for {place}. Sweep in progress.",
		weight: 100,
	},
	{
		archetype: "crime",
		typeLabel: "Active shooter",
		summary: "Shots reported at or next to {place}.",
		weight: 1,
	},
	{
		archetype: "crime",
		typeLabel: "Organized crime raid",
		summary: "Hit crew striking a front at {place}.",
		weight: 1,
	},
	{
		archetype: "crime",
		typeLabel: "Cyber attack",
		summary: "Systems fault traced near {place}. Grid risk.",
		weight: 1,
	},
	{
		archetype: "crime",
		typeLabel: "Drug trafficking",
		summary: "Bulk product moving through {place}. Armed guards rumored.",
		weight: 2,
	},
	{
		archetype: "crime",
		typeLabel: "Kidnapping",
		summary: "Forced entry into a vehicle near {place}.",
		weight: 2,
	},

	// ── Fire & rescue ──
	{
		archetype: "fire_rescue",
		typeLabel: "Kitchen fire",
		summary: "Kitchen fire at {place}. Smoke climbing fast.",
		weight: 5,
	},
	{
		archetype: "fire_rescue",
		typeLabel: "Dumpster fire",
		summary: "Dumpster fire at {place} spreading to the building.",
		weight: 5,
	},
	{
		archetype: "fire_rescue",
		typeLabel: "Car fire",
		summary: "Car fully involved at {place}. Clear the block.",
		weight: 4,
	},
	{
		archetype: "fire_rescue",
		typeLabel: "Electrical fire",
		summary: "Electrical fire at {place}. Power unstable.",
		weight: 4,
	},
	{
		archetype: "fire_rescue",
		typeLabel: "Gas leak",
		summary: "Strong gas smell at {place}. Kill ignition sources.",
		weight: 3,
	},
	{
		archetype: "fire_rescue",
		typeLabel: "Elevator rescue",
		summary: "Elevator stuck at {place}. People trapped inside.",
		weight: 4,
	},
	{
		archetype: "fire_rescue",
		typeLabel: "Apartment fire",
		summary: "Smoke from multiple floors at {place}.",
		weight: 3,
	},
	{
		archetype: "fire_rescue",
		typeLabel: "Warehouse fire",
		summary: "Warehouse fire at {place}. Collapse risk.",
		weight: 2,
	},
	{
		archetype: "fire_rescue",
		typeLabel: "Chemical spill",
		summary: "Chemical spill at {place}. Vapor drifting.",
		weight: 2,
	},
	{
		archetype: "fire_rescue",
		typeLabel: "Train derailment",
		summary: "Derailment near {place}. Possible leak.",
		weight: 2,
	},
	{
		archetype: "fire_rescue",
		typeLabel: "Collapsed building",
		summary: "Collapse at {place}. Possible survivors in voids.",
		weight: 2,
	},
	{
		archetype: "fire_rescue",
		typeLabel: "Wildfire",
		summary: "Brush fire closing on structures near {place}.",
		weight: 1,
	},
	{
		archetype: "fire_rescue",
		typeLabel: "Factory explosion",
		summary: "Explosion at {place}. Secondary blasts possible.",
		weight: 1,
	},
	{
		archetype: "fire_rescue",
		typeLabel: "Airport crash landing",
		summary: "Aircraft emergency near {place}. Foam and medics.",
		weight: 1,
	},
	{
		archetype: "fire_rescue",
		typeLabel: "Refinery fire",
		summary: "Major fire at {place}. Unsafe heat radius.",
		weight: 1,
	},
	{
		archetype: "fire_rescue",
		typeLabel: "City blackout",
		summary: "Power out around {place}. Stuck lifts and chaos.",
		weight: 2,
	},

	// ── Medical ──
	{
		archetype: "medical",
		typeLabel: "Heart attack",
		summary: "Suspected cardiac arrest at {place}. CPR started.",
		weight: 5,
	},
	{
		archetype: "medical",
		typeLabel: "Car accident injuries",
		summary: "Bad wreck near {place}. Possible entrapment.",
		weight: 5,
	},
	{
		archetype: "medical",
		typeLabel: "Drug overdose",
		summary: "Unresponsive at {place}. Narcan already given once.",
		weight: 4,
	},
	{
		archetype: "medical",
		typeLabel: "Fainting",
		summary: "Person down at {place}. Breathing but fading in and out.",
		weight: 5,
	},
	{
		archetype: "medical",
		typeLabel: "Allergic reaction",
		summary: "Severe allergic reaction at {place}. Airway at risk.",
		weight: 4,
	},
	{
		archetype: "medical",
		typeLabel: "Multi-vehicle pileup",
		summary: "Pileup near {place}. Many injured. Triage needed.",
		weight: 2,
	},
	{
		archetype: "medical",
		typeLabel: "Industrial accident",
		summary: "Crush injury at {place}. Heavy bleeding.",
		weight: 3,
	},
	{
		archetype: "medical",
		typeLabel: "School injury",
		summary: "Student hurt at {place}. Parents crowding gates.",
		weight: 3,
	},
	{
		archetype: "medical",
		typeLabel: "Heatstroke",
		summary: "Heatstroke at {place}. Core temp critical.",
		weight: 3,
	},
	{
		archetype: "medical",
		typeLabel: "Mass casualty",
		summary: "Many wounded at {place}. Hospitals diverting.",
		weight: 1,
	},
	{
		archetype: "medical",
		typeLabel: "Disease outbreak",
		summary: "Sick cluster tied to {place}. Quarantine talk.",
		weight: 1,
	},
	{
		archetype: "medical",
		typeLabel: "Pandemic spike",
		summary: "EMS surge at {place}. ERs overloaded.",
		weight: 1,
	},

	// ── Natural / environmental ──
	{
		archetype: "disaster",
		typeLabel: "Severe storm",
		summary: "Storm damage at {place}. Downed lines nearby.",
		weight: 4,
	},
	{
		archetype: "disaster",
		typeLabel: "Flooding",
		summary: "Flash flooding at {place}. Cars stuck.",
		weight: 3,
	},
	{
		archetype: "disaster",
		typeLabel: "Blizzard",
		summary: "Blizzard conditions at {place}. Roads icing fast.",
		weight: 2,
	},
	{
		archetype: "disaster",
		typeLabel: "Heatwave",
		summary: "Extreme heat at {place}. Brownouts hitting the grid.",
		weight: 3,
	},
	{
		archetype: "disaster",
		typeLabel: "Earthquake",
		summary: "Quake damage at {place}. Gas checks incomplete.",
		weight: 1,
	},
	{
		archetype: "disaster",
		typeLabel: "Tornado",
		summary: "Tornado track near {place}. Structures unsafe.",
		weight: 1,
	},
	{
		archetype: "disaster",
		typeLabel: "Hurricane",
		summary: "Storm surge debris at {place}. Shelters stressed.",
		weight: 1,
	},
	{
		archetype: "disaster",
		typeLabel: "Landslide",
		summary: "Landslide at {place}. Road buried.",
		weight: 1,
	},

	// ── Traffic & infrastructure ──
	{
		archetype: "traffic",
		typeLabel: "Traffic accident",
		summary: "Major crash at {place}. Intersection blocked.",
		weight: 5,
	},
	{
		archetype: "traffic",
		typeLabel: "Road rage",
		summary: "Fight in the street at {place}. Traffic stopped.",
		weight: 4,
	},
	{
		archetype: "traffic",
		typeLabel: "Bridge damage",
		summary: "Bridge damage near {place}. Still open. Unsafe.",
		weight: 2,
	},
	{
		archetype: "traffic",
		typeLabel: "Power outage",
		summary: "Blackout at {place}. Signals dead. Gridlock.",
		weight: 4,
	},
	{
		archetype: "traffic",
		typeLabel: "Water main break",
		summary: "Flooding street at {place}. Sinkhole risk.",
		weight: 3,
	},
	{
		archetype: "traffic",
		typeLabel: "Signal malfunction",
		summary: "Dead signals at {place}. Near misses stacking up.",
		weight: 5,
	},
	{
		archetype: "traffic",
		typeLabel: "Train stuck",
		summary: "Train stopped at {place}. Passengers overheating.",
		weight: 2,
	},
];
