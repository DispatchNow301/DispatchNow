/**
 * Incident-specific resource relevance bonuses.
 * These apply on top of the archetype multipliers and reward bringing
 * the right tool for the specific situation.
 *
 * Examples:
 * - Fire extinguisher: essential for fires, but also useful for arson
 * - Epipen: critical for allergic reactions, helpful for heart attacks
 * - Handcuffs: crucial for arrests, less useful for medical calls
 *
 * Values are multipliers: 1.0 = neutral, >1 = helpful, <1 = less relevant
 * (Clamping is handled by the success calculation logic).
 */

import type { IncidentArchetype } from "./incidentTemplates";

/** Incident type label (from INCIDENT_TEMPLATES.typeLabel) -> resource key -> bonus */
export const INCIDENT_SPECIFIC_BONUS: Record<
	string,
	Partial<Record<string, number>>
> = {
	// ── CRIME INCIDENTS ──
	burglary: {
		handcuffs: 1.25,
		surveillance_drone: 1.2,
		first_aid_kit: 1.1,
		protective_gear: 1.15,
	},
	shoplifting: {
		handcuffs: 1.3,
		walkie_talkie: 1.15,
		surveillance_drone: 1.2,
	},
	assault: {
		handcuffs: 1.35,
		first_aid_kit: 1.2,
		protective_gear: 1.2,
		rescue_tool: 1.1,
	},
	domestic_dispute: {
		handcuffs: 1.3,
		first_aid_kit: 1.25,
		walkie_talkie: 1.15,
		epipen: 1.1,
	},
	suspicious_person: {
		surveillance_drone: 1.25,
		walkie_talkie: 1.2,
		handcuffs: 1.15,
	},
	vandalism: {
		handcuffs: 1.2,
		surveillance_drone: 1.15,
		barricade_kit: 1.1,
	},
	car_theft: {
		handcuffs: 1.3,
		surveillance_drone: 1.2,
		rescue_tool: 1.15,
		armored_vehicle: 1.2,
	},
	pickpocketing: {
		handcuffs: 1.25,
		surveillance_drone: 1.2,
		walkie_talkie: 1.15,
	},
	armed_robbery: {
		handcuffs: 1.4,
		armored_vehicle: 1.3,
		protective_gear: 1.25,
		first_aid_kit: 1.15,
		barricade_kit: 1.15,
	},
	hostage_situation: {
		handcuffs: 1.35,
		surveillance_drone: 1.3,
		walkie_talkie: 1.25,
		first_aid_kit: 1.2,
		protective_gear: 1.2,
		rescue_tool: 1.15,
	},
	gang_fight: {
		handcuffs: 1.3,
		protective_gear: 1.25,
		first_aid_kit: 1.2,
		barricade_kit: 1.2,
		armored_vehicle: 1.15,
	},
	drive_by_shooting: {
		protective_gear: 1.3,
		first_aid_kit: 1.25,
		surveillance_drone: 1.2,
		armored_vehicle: 1.2,
	},
	drug_deal: {
		handcuffs: 1.3,
		surveillance_drone: 1.25,
		walkie_talkie: 1.2,
		epipen: 1.15,
	},
	bank_robbery: {
		handcuffs: 1.35,
		surveillance_drone: 1.25,
		barricade_kit: 1.2,
		first_aid_kit: 1.15,
		armored_vehicle: 1.15,
	},
	high_speed_chase: {
		armored_vehicle: 1.35,
		barricade_kit: 1.2,
		walkie_talkie: 1.25,
		surveillance_drone: 1.15,
	},
	riot: {
		protective_gear: 1.35,
		barricade_kit: 1.3,
		first_aid_kit: 1.25,
		handcuffs: 1.2,
		armored_vehicle: 1.15,
	},
	prison_escape: {
		handcuffs: 1.4,
		surveillance_drone: 1.25,
		walkie_talkie: 1.2,
		barricade_kit: 1.15,
	},
	terror_threat: {
		protective_gear: 1.3,
		surveillance_drone: 1.25,
		walkie_talkie: 1.2,
		first_aid_kit: 1.2,
		barricade_kit: 1.2,
	},
	bomb_threat: {
		protective_gear: 1.4,
		surveillance_drone: 1.2,
		first_aid_kit: 1.15,
		barricade_kit: 1.25,
		rescue_tool: 1.1,
	},
	active_shooter: {
		protective_gear: 1.35,
		first_aid_kit: 1.3,
		handcuffs: 1.2,
		armored_vehicle: 1.2,
		surveillance_drone: 1.15,
	},
	organized_crime_raid: {
		handcuffs: 1.35,
		armored_vehicle: 1.25,
		surveillance_drone: 1.2,
		protective_gear: 1.2,
		barricade_kit: 1.15,
	},
	cyber_attack: {
		surveillance_drone: 1.15,
		walkie_talkie: 1.1,
	},
	drug_trafficking: {
		handcuffs: 1.35,
		surveillance_drone: 1.25,
		armored_vehicle: 1.2,
		barricade_kit: 1.15,
	},
	kidnapping: {
		surveillance_drone: 1.3,
		handcuffs: 1.25,
		first_aid_kit: 1.2,
		rescue_tool: 1.15,
		walkie_talkie: 1.15,
	},

	// ── FIRE & RESCUE INCIDENTS ──
	kitchen_fire: {
		fire_extinguisher: 1.45,
		first_aid_kit: 1.15,
		protective_gear: 1.2,
		rescue_tool: 1.1,
	},
	dumpster_fire: {
		fire_extinguisher: 1.35,
		protective_gear: 1.2,
		rescue_tool: 1.15,
		barricade_kit: 1.1,
	},
	car_fire: {
		fire_extinguisher: 1.35,
		rescue_tool: 1.2,
		first_aid_kit: 1.1,
		protective_gear: 1.15,
		armored_vehicle: 1.1,
	},
	electrical_fire: {
		fire_extinguisher: 1.3,
		protective_gear: 1.25,
		rescue_tool: 1.15,
		first_aid_kit: 1.1,
	},
	gas_leak: {
		protective_gear: 1.4,
		rescue_tool: 1.25,
		first_aid_kit: 1.15,
		barricade_kit: 1.2,
		walkie_talkie: 1.15,
	},
	elevator_rescue: {
		rescue_tool: 1.4,
		first_aid_kit: 1.25,
		walkie_talkie: 1.15,
		epipen: 1.15,
	},
	apartment_fire: {
		fire_extinguisher: 1.35,
		protective_gear: 1.25,
		first_aid_kit: 1.2,
		rescue_tool: 1.2,
		barricade_kit: 1.1,
	},
	warehouse_fire: {
		fire_extinguisher: 1.3,
		protective_gear: 1.25,
		rescue_tool: 1.25,
		armored_vehicle: 1.15,
		barricade_kit: 1.15,
	},
	chemical_spill: {
		protective_gear: 1.45,
		first_aid_kit: 1.2,
		epipen: 1.25,
		rescue_tool: 1.15,
		barricade_kit: 1.15,
		walkie_talkie: 1.1,
	},
	train_derailment: {
		rescue_tool: 1.35,
		first_aid_kit: 1.3,
		protective_gear: 1.25,
		barricade_kit: 1.2,
		walkie_talkie: 1.15,
	},
	collapsed_building: {
		rescue_tool: 1.45,
		first_aid_kit: 1.3,
		protective_gear: 1.25,
		barricade_kit: 1.2,
		epipen: 1.15,
	},
	wildfire: {
		protective_gear: 1.4,
		fire_extinguisher: 1.25,
		rescue_tool: 1.2,
		barricade_kit: 1.25,
		armored_vehicle: 1.15,
	},
	factory_explosion: {
		protective_gear: 1.4,
		first_aid_kit: 1.3,
		rescue_tool: 1.25,
		epipen: 1.2,
		barricade_kit: 1.15,
	},
	airport_crash_landing: {
		protective_gear: 1.35,
		first_aid_kit: 1.35,
		rescue_tool: 1.25,
		epipen: 1.2,
		barricade_kit: 1.15,
		armored_vehicle: 1.1,
	},
	refinery_fire: {
		protective_gear: 1.45,
		fire_extinguisher: 1.3,
		first_aid_kit: 1.2,
		rescue_tool: 1.2,
		barricade_kit: 1.2,
	},
	city_blackout: {
		walkie_talkie: 1.3,
		protective_gear: 1.2,
		rescue_tool: 1.15,
		first_aid_kit: 1.15,
		barricade_kit: 1.15,
	},

	// ── MEDICAL INCIDENTS ──
	heart_attack: {
		epipen: 1.35,
		first_aid_kit: 1.4,
		walkie_talkie: 1.15,
	},
	car_accident_injuries: {
		first_aid_kit: 1.35,
		rescue_tool: 1.4,
		epipen: 1.2,
		protective_gear: 1.15,
	},
	drug_overdose: {
		epipen: 1.45,
		first_aid_kit: 1.35,
		walkie_talkie: 1.15,
	},
	fainting: {
		first_aid_kit: 1.3,
		epipen: 1.25,
		walkie_talkie: 1.1,
	},
	allergic_reaction: {
		epipen: 1.5,
		first_aid_kit: 1.25,
		walkie_talkie: 1.15,
	},
	multi_vehicle_pileup: {
		first_aid_kit: 1.35,
		rescue_tool: 1.3,
		epipen: 1.2,
		barricade_kit: 1.25,
		walkie_talkie: 1.2,
	},
	industrial_accident: {
		first_aid_kit: 1.35,
		rescue_tool: 1.3,
		protective_gear: 1.25,
		epipen: 1.2,
	},
	school_injury: {
		first_aid_kit: 1.3,
		epipen: 1.2,
		walkie_talkie: 1.15,
	},
	heatstroke: {
		first_aid_kit: 1.3,
		epipen: 1.2,
	},
	mass_casualty: {
		first_aid_kit: 1.35,
		epipen: 1.25,
		walkie_talkie: 1.25,
		barricade_kit: 1.2,
		rescue_tool: 1.2,
	},
	disease_outbreak: {
		protective_gear: 1.4,
		first_aid_kit: 1.25,
		epipen: 1.2,
		walkie_talkie: 1.15,
	},
	pandemic_spike: {
		protective_gear: 1.45,
		first_aid_kit: 1.3,
		epipen: 1.25,
		walkie_talkie: 1.2,
	},

	// ── DISASTER INCIDENTS ──
	severe_storm: {
		protective_gear: 1.35,
		barricade_kit: 1.3,
		first_aid_kit: 1.2,
		walkie_talkie: 1.2,
		rescue_tool: 1.15,
	},
	flooding: {
		rescue_tool: 1.35,
		barricade_kit: 1.25,
		first_aid_kit: 1.2,
		protective_gear: 1.2,
		armored_vehicle: 1.15,
	},
	blizzard: {
		protective_gear: 1.4,
		barricade_kit: 1.25,
		first_aid_kit: 1.2,
		rescue_tool: 1.2,
		armored_vehicle: 1.15,
	},
	heatwave: {
		first_aid_kit: 1.25,
		epipen: 1.2,
		barricade_kit: 1.1,
	},
	earthquake: {
		rescue_tool: 1.45,
		protective_gear: 1.3,
		first_aid_kit: 1.3,
		barricade_kit: 1.25,
	},
	tornado: {
		protective_gear: 1.35,
		barricade_kit: 1.3,
		first_aid_kit: 1.25,
		rescue_tool: 1.2,
	},
	hurricane: {
		protective_gear: 1.35,
		barricade_kit: 1.3,
		first_aid_kit: 1.25,
		rescue_tool: 1.2,
		armored_vehicle: 1.15,
	},
	landslide: {
		rescue_tool: 1.4,
		protective_gear: 1.3,
		first_aid_kit: 1.25,
		barricade_kit: 1.2,
	},

	// ── TRAFFIC INCIDENTS ──
	traffic_accident: {
		first_aid_kit: 1.35,
		rescue_tool: 1.4,
		barricade_kit: 1.3,
		walkie_talkie: 1.2,
		epipen: 1.15,
	},
	road_rage: {
		handcuffs: 1.25,
		first_aid_kit: 1.2,
		barricade_kit: 1.15,
		protective_gear: 1.15,
	},
	bridge_damage: {
		barricade_kit: 1.35,
		rescue_tool: 1.25,
		walkie_talkie: 1.2,
		protective_gear: 1.15,
	},
	power_outage: {
		walkie_talkie: 1.3,
		barricade_kit: 1.2,
		first_aid_kit: 1.15,
		protective_gear: 1.15,
	},
	water_main_break: {
		barricade_kit: 1.35,
		rescue_tool: 1.2,
		walkie_talkie: 1.15,
	},
	signal_malfunction: {
		barricade_kit: 1.3,
		walkie_talkie: 1.25,
		rescue_tool: 1.15,
	},
	train_stuck: {
		rescue_tool: 1.35,
		first_aid_kit: 1.25,
		barricade_kit: 1.2,
		walkie_talkie: 1.2,
		epipen: 1.15,
	},
};

/**
 * Get the incident-specific bonus multiplier for a given incident type label.
 * Falls back to empty object (neutral) if no specific bonuses defined.
 */
export function getIncidentSpecificBonus(
	typeLabel: string,
): Record<string, number> {
	// Normalize: convert to lowercase and replace spaces with underscores
	const normalized = typeLabel.toLowerCase().replace(/\s+/g, "_");
	return INCIDENT_SPECIFIC_BONUS[normalized] || {};
}

/**
 * Check if an incident type has specific resource bonuses defined.
 */
export function hasIncidentSpecificBonus(typeLabel: string): boolean {
	const normalized = typeLabel.toLowerCase().replace(/\s+/g, "_");
	return normalized in INCIDENT_SPECIFIC_BONUS;
}
