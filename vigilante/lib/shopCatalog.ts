/**
 * Black market shop catalog.
 * Define all purchasable items (resources and upgrades) here.
 * Resources are consumables; upgrades are one-time purchases.
 *
 * Starting quantities are configured in resourcePool.ts via
 * RESOURCE_STARTING_QUANTITIES and STARTING_UPGRADE_IDS.
 */

export type ShopResourceItem = {
	id: string;
	category: "resource";
	name: string;
	cost: number;
	description: string;
};

export type ShopUpgradeItem = {
	id: string;
	category: "upgrade";
	name: string;
	cost: number;
	description: string;
	/**
	 * Tag for visual grouping. Used for color theming in the UI.
	 * Can be extended with more tags as you add new upgrades.
	 */
	tag: "comms" | "intel" | "defense" | "economy";
};

export type ShopItem = ShopResourceItem | ShopUpgradeItem;

/**
 * All purchasable resources in the black market.
 * These are added to the resourcePool when bought.
 */
export const SHOP_RESOURCES: ShopResourceItem[] = [
	{
		id: "r1",
		category: "resource",
		name: "First Aid Kit",
		cost: 50,
		description: "Treats cuts, burns, and small wounds.",
	},
	{
		id: "r2",
		category: "resource",
		name: "Fire Extinguisher",
		cost: 60,
		description: "Puts out small fires.",
	},
	{
		id: "r3",
		category: "resource",
		name: "Walkie-Talkie",
		cost: 40,
		description: "Talk to your team by radio.",
	},
	{
		id: "r4",
		category: "resource",
		name: "Handcuffs",
		cost: 30,
		description: "Locks on someone's wrists.",
	},
	{
		id: "r5",
		category: "resource",
		name: "Surveillance Drone",
		cost: 100,
		description: "See the area from the air.",
	},
	{
		id: "r6",
		category: "resource",
		name: "Protective Gear",
		cost: 70,
		description: "Vest and pads so you get hurt less.",
	},
	{
		id: "r7",
		category: "resource",
		name: "Barricade Kit",
		cost: 80,
		description: "Blocks doors and paths.",
	},
	{
		id: "r8",
		category: "resource",
		name: "EpiPen",
		cost: 90,
		description: "Shot for a bad allergic reaction.",
	},
	{
		id: "r9",
		category: "resource",
		name: "Rescue Tool",
		cost: 110,
		description: "Open stuck doors or cut through metal.",
	},
	{
		id: "r10",
		category: "resource",
		name: "Armored Vehicle",
		cost: 200,
		description: "Heavy truck with armor on the sides.",
	},
];

/**
 * All purchasable upgrades (one-time buys) in the black market.
 * These are added to purchasedUpgradeIds when bought.
 */
export const SHOP_UPGRADES: ShopUpgradeItem[] = [
	{
		id: "b1",
		category: "upgrade",
		tag: "comms",
		name: "Noir Focus",
		cost: 100,
		description: "Timers tick down more slowly.",
	},
	{
		id: "b2",
		category: "upgrade",
		tag: "intel",
		name: "Street Network",
		cost: 150,
		description: "Send help again sooner.",
	},
	{
		id: "b3",
		category: "upgrade",
		tag: "defense",
		name: "Adrenal Surge",
		cost: 120,
		description: "Move faster and take hits better for a short time.",
	},
	// Add more upgrades here
];

export const SHOP_ITEMS: ShopItem[] = [...SHOP_RESOURCES, ...SHOP_UPGRADES];