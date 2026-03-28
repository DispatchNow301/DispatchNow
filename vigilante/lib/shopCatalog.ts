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
    name: string;
    cost: number;
    description: string;
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
        name: "Noir Focus",
        cost: 250,
        description: "Incident timers tick down slower.",
    },
    {
        id: "b2",
        name: "Shadow Lag",
        cost: 250,
        description: "Police move slower.",
    },
    {
        id: "b3",
        name: "Street Network",
        cost: 200,
        description: "Higher chance of success when resolving crime incidents.",
    },
    {
        id: "b4",
        name: "Thermal Protocol",
        cost: 200,
        description: "Higher chance of success when resolving fire incidents.",
    },
    {
        id: "b5",
        name: "Vital Edge",
        cost: 200,
        description: "Higher chance of success when resolving medical incidents.",
    },
    {
        id: "b6",
        name: "Catastrophe Stability",
        cost: 200,
        description: "Higher chance of success when resolving disaster incidents.",
    },
    {
        id: "b7",
        name: "Urban Flow",
        cost: 200,
        description: "Higher chance of success when resolving traffic incidents.",
    },
    {
        id: "b8",
        name: "Scavenger's Luck",
        cost: 250,
        description: "When a mission fails, there's a 20% chance your deployed gear makes it back anyway.",
    },
    {
        id: "b9",
        name: "Rapid Response",
        cost: 300,
        description: "Dispatching within 10 seconds of an incident spawning gives a significant success bonus.",
    },
];
export const SHOP_ITEMS: ShopItem[] = [...SHOP_RESOURCES, ...SHOP_UPGRADES];


/** Buff ids that exist in the inventory catalog (`BASE_BUFFS` in Inventory.tsx). */
export const BUFF_CATALOG_IDS = [
    "b1",
    "b2",
    "b3",
    "b4",
    "b5",
    "b6",
    "b7",
    "b8",
    "b9",
] as const;
const CATALOG_SET = new Set<string>(BUFF_CATALOG_IDS);
/**
 * Persisted list of buff upgrades the player has unlocked (e.g. shop).
 * Quantities / deployment still live in `resourcePool` under the same ids.
 */
export function mergePurchasedBuffIds(raw: unknown): string[] {
    const defaultAll = [...BUFF_CATALOG_IDS];
    if (raw === undefined) return defaultAll;
    if (!Array.isArray(raw)) return defaultAll;
    const seen = new Set<string>();
    const out: string[] = [];
    for (const x of raw) {
        if (typeof x !== "string" || !CATALOG_SET.has(x)) continue;
        if (!seen.has(x)) {
            seen.add(x);
            out.push(x);
        }
    }
    return out;
}