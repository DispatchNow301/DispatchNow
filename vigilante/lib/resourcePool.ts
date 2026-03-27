/**
 * Global resource counts for map play. `deployed` counts units currently out on incidents.
 */

export type ResourcePoolEntry = {
	qty: number;
	deployed: number;
};

/**
 * Starting quantities for each resource (r1–r10).
 * Edit these values to change how many of each item the player starts with.
 */
export const RESOURCE_STARTING_QUANTITIES: Record<string, number> = {
	r1: 3,
	r2: 2,
	r3: 2,
	r4: 2,
	r5: 0,
	r6: 1,
	r7: 0,
	r8: 1,
	r9: 1,
	r10: 0,
};

/**
 * Upgrades (buffs) the player owns from the start, before visiting the black market.
 * Add buff IDs here (e.g. "b1", "b2", "b3") to pre-unlock them.
 * These show as already-owned (greyed out) in the black market.
 */
export const STARTING_UPGRADE_IDS: string[] = [
	// "b1"
];

/** r1–r10 + buffs b1–b3 built from RESOURCE_STARTING_QUANTITIES */
export const DEFAULT_RESOURCE_POOL: Record<string, ResourcePoolEntry> = {
	...Object.fromEntries(
		Object.entries(RESOURCE_STARTING_QUANTITIES).map(([id, qty]) => [
			id,
			{ qty, deployed: 0 },
		]),
	),
	b1: { qty: 1, deployed: 0 },
	b2: { qty: 1, deployed: 0 },
	b3: { qty: 1, deployed: 0 },
};

export function countIds(ids: string[]): Record<string, number> {
	const m: Record<string, number> = {};
	for (const id of ids) {
		m[id] = (m[id] ?? 0) + 1;
	}
	return m;
}

export function canStageDeployment(
	pool: Record<string, ResourcePoolEntry>,
	stagedIds: string[],
): boolean {
	const need = countIds(stagedIds);
	for (const [id, n] of Object.entries(need)) {
		const p = pool[id];
		if (!p) return false;
		if (p.qty - p.deployed < n) return false;
	}
	return true;
}

export function applyDeployment(
	pool: Record<string, ResourcePoolEntry>,
	deployedIds: string[],
): Record<string, ResourcePoolEntry> {
	const need = countIds(deployedIds);
	const next = { ...pool };
	for (const [id, n] of Object.entries(need)) {
		const p = next[id];
		if (!p) continue;
		next[id] = { ...p, deployed: p.deployed + n };
	}
	return next;
}

export function returnDeployment(
	pool: Record<string, ResourcePoolEntry>,
	deployedIds: string[],
): Record<string, ResourcePoolEntry> {
	const need = countIds(deployedIds);
	const next = { ...pool };
	for (const [id, n] of Object.entries(need)) {
		const p = next[id];
		if (!p) continue;
		next[id] = {
			...p,
			deployed: Math.max(0, p.deployed - n),
		};
	}
	return next;
}

/**
 * Failed dispatch: gear is lost — remove from inventory and clear deployed counts.
 * (Does not return items to available stock.)
 */
export function forfeitDeployment(
	pool: Record<string, ResourcePoolEntry>,
	deployedIds: string[],
): Record<string, ResourcePoolEntry> {
	const need = countIds(deployedIds);
	const next = { ...pool };
	for (const [id, n] of Object.entries(need)) {
		const p = next[id];
		if (!p) continue;
		const take = Math.min(n, p.deployed);
		next[id] = {
			...p,
			qty: Math.max(0, p.qty - take),
			deployed: Math.max(0, p.deployed - take),
		};
	}
	return next;
}
