/**
 * Global resource counts for map play. `deployed` counts units currently out on incidents.
 */

export type ResourcePoolEntry = {
	qty: number;
	deployed: number;
};

/** r1–r10 + buffs b1–b3 (buffs deploy only if you wire them later) */
export const DEFAULT_RESOURCE_POOL: Record<string, ResourcePoolEntry> = {
	r1: { qty: 2, deployed: 0 },
	r2: { qty: 1, deployed: 0 },
	r3: { qty: 1, deployed: 0 },
	r4: { qty: 3, deployed: 0 },
	r5: { qty: 1, deployed: 0 },
	r6: { qty: 2, deployed: 0 },
	r7: { qty: 1, deployed: 0 },
	r8: { qty: 1, deployed: 0 },
	r9: { qty: 1, deployed: 0 },
	r10: { qty: 1, deployed: 0 },
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
