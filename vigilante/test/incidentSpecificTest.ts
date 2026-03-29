/**
 * Quick test script to verify incident-specific resource bonuses are applied correctly.
 * Run with: npx tsx --esm test/incidentSpecificTest.ts
 */

import { calculateSimpleSuccess } from "../lib/simpleSuccessCalc";
import { getIncidentSpecificBonus, hasIncidentSpecificBonus } from "../lib/incidentSpecificBonuses";

console.log("=== Incident-Specific Bonus Verification ===\n");

// Test 1: Kitchen fire should get big bonus from fire extinguisher
const kitchenFire = calculateSimpleSuccess(
	50, // base chance
	"fire_rescue",
	"Kitchen fire", // type label
	[], // no vigilantes
	["r2"], // fire extinguisher (r2)
	[], // buffs
	0 // flat bonus
);
console.log("1. Kitchen fire + Fire Extinguisher:");
console.log(`   Success: ${kitchenFire.successPercent}%`);
console.log(`   Breakdown:`, kitchenFire.breakdown);
console.log(`   Incident-specific multiplier: ${kitchenFire.incidentSpecificMultiplier.toFixed(3)}`);
console.log(`   Expected: Fire extinguisher synergy ~+45% = multiplier 1.45`);
console.log();

// Test 2: Heart attack should get bonus from epipen
const heartAttack = calculateSimpleSuccess(
	50,
	"medical",
	"Heart attack",
	[],
	["r8"], // epipen
	[], // buffs
	0 // flat bonus
);
console.log("2. Heart attack + EpiPen:");
console.log(`   Success: ${heartAttack.successPercent}%`);
console.log(`   Breakdown:`, heartAttack.breakdown);
console.log(`   Expected: EpiPen synergy ~+35% = additive +35%`);
console.log();

// Test 3: Armed robbery + handcuffs + armored vehicle
const armedRobbery = calculateSimpleSuccess(
	50,
	"crime",
	"Armed robbery",
	[], // vigilantes
	["r4", "r10"], // handcuffs + armored vehicle
	[], // buffs
	0 // flat bonus
);
console.log("3. Armed robbery + Handcuffs + Armored Vehicle:");
console.log(`   Success: ${armedRobbery.successPercent}%`);
console.log(`   Expected: Handcuffs (+40%) + Armored Vehicle (+30%) = +70% total from bonuses`);
console.log();

// Test 4: Gas leak + protective gear (should be high)
const gasLeak = calculateSimpleSuccess(
	50,
	"fire_rescue",
	"Gas leak",
	[], // vigilantes
	["r6"], // protective gear
	[], // buffs
	0 // flat bonus
);
console.log("4. Gas leak + Protective Gear:");
console.log(`   Success: ${gasLeak.successPercent}%`);
console.log(`   Expected: Protective gear synergy ~+40%`);
console.log();

// Test 5: Incident without specific bonuses should be no-op
const burglary = calculateSimpleSuccess(
	50,
	"crime",
	"Burglary",
	[], // vigilantes
	["r2"], // fire extinguisher (not particularly helpful)
	[], // buffs
	0 // flat bonus
);
console.log("5. Burglary + Fire Extinguisher (no specific bonus):");
console.log(`   Success: ${burglary.successPercent}%`);
console.log(`   Expected: No incident-specific bonus for fire extinguisher on burglary`);
console.log();

// Test 6: High-speed chase + armored vehicle (should have bonus)
const highSpeedChase = calculateSimpleSuccess(
	50,
	"traffic",
	"High-speed chase",
	[], // vigilantes
	["r10"], // armored vehicle
	[], // buffs
	0 // flat bonus
);
console.log("6. High-speed chase + Armored Vehicle:");
console.log(`   Success: ${highSpeedChase.successPercent}%`);
console.log(`   Expected: Armored vehicle synergy ~+35%`);
console.log();

// Bonus test: Multiple relevant resources
const hostage = calculateSimpleSuccess(
	50,
	"crime",
	"Hostage situation",
	[], // vigilantes
	["r1", "r4", "r5", "r8"], // first_aid, handcuffs, drone, epipen
	[], // buffs
	0 // flat bonus
);
console.log("7. Hostage situation + Multiple relevant resources:");
console.log(`   Success: ${hostage.successPercent}%`);
console.log(`   Expected: Max additive bonus around +100-120% from multiple highly relevant items`);
console.log();

// Show all mappings exist
console.log("=== Coverage Check ===");
const allTemplates = [
	"burglary", "shoplifting", "assault", "domestic_dispute", "suspicious_person",
	"vandalism", "car_theft", "pickpocketing", "armed_robbery", "hostage_situation",
	"gang_fight", "drive_by_shooting", "drug_deal", "bank_robbery", "high_speed_chase",
	"riot", "prison_escape", "terror_threat", "bomb_threat", "active_shooter",
	"organized_crime_raid", "cyber_attack", "drug_trafficking", "kidnapping",
	"kitchen_fire", "dumpster_fire", "car_fire", "electrical_fire", "gas_leak",
	"elevator_rescue", "apartment_fire", "warehouse_fire", "chemical_spill",
	"train_derailment", "collapsed_building", "wildfire", "factory_explosion",
	"airport_crash_landing", "refinery_fire", "city_blackout",
	"heart_attack", "car_accident_injuries", "drug_overdose", "fainting",
	"allergic_reaction", "multi_vehicle_pileup", "industrial_accident",
	"school_injury", "heatstroke", "mass_casualty", "disease_outbreak", "pandemic_spike",
	"severe_storm", "flooding", "blizzard", "heatwave", "earthquake", "tornado",
	"hurricane", "landslide",
	"traffic_accident", "road_rage", "bridge_damage", "power_outage",
	"water_main_break", "signal_malfunction", "train_stuck",
];

let withBonuses = 0;
for (const key of allTemplates) {
	if (hasIncidentSpecificBonus(key)) withBonuses++;
}
console.log(`Total incident types: ${allTemplates.length}`);
console.log(`With specific bonuses: ${withBonuses}`);
console.log(`Coverage: ${Math.round((withBonuses / allTemplates.length) * 100)}%`);

console.log("\n=== Test Complete ===");
