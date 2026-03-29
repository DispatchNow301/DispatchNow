/** Buff ids that exist in the inventory catalog (`BASE_BUFFS` in Inventory.tsx). */
export const BUFF_CATALOG_IDS = [
	"b1",
	"b2",
	"b3",
	"b4",
	"b5",
	"b6",
	"b7",
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
