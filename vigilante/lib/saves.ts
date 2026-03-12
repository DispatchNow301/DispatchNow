export type SaveScope = "local" | "cloud";

export type SaveSlotId = {
	scope: SaveScope;
	index: 1 | 2 | 3;
	userId?: string;
};

export type SaveMeta = {
	title: string;
	updatedAt: number;
};

export type SaveData = {
	meta: SaveMeta;
	payload: Record<string, unknown>;
};

const INDEXES: Array<1 | 2 | 3> = [1, 2, 3];

function keyForSlot(slot: SaveSlotId) {
	if (slot.scope === "local") return `vigilante:save:local:${slot.index}`;
	if (!slot.userId) throw new Error("Cloud saves require userId");
	return `vigilante:save:cloud:${slot.userId}:${slot.index}`;
}

export function listSlots(scope: SaveScope, userId?: string) {
	return INDEXES.map((index) => ({ scope, index, userId } as SaveSlotId));
}

export function readSave(slot: SaveSlotId): SaveData | null {
	const raw = localStorage.getItem(keyForSlot(slot));
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as SaveData;
		if (typeof parsed?.meta?.updatedAt !== "number") return null;
		return parsed;
	} catch {
		return null;
	}
}

export function writeNewSave(slot: SaveSlotId, title: string): SaveData {
	const data: SaveData = {
		meta: { title, updatedAt: Date.now() },
		payload: {
			version: 1,
			createdAt: Date.now(),
			seed: Math.floor(Math.random() * 1_000_000),
		},
	};
	localStorage.setItem(keyForSlot(slot), JSON.stringify(data));
	return data;
}

export function touchSave(slot: SaveSlotId) {
	const existing = readSave(slot);
	if (!existing) return null;
	const next: SaveData = {
		...existing,
		meta: { ...existing.meta, updatedAt: Date.now() },
	};
	localStorage.setItem(keyForSlot(slot), JSON.stringify(next));
	return next;
}

export function deleteSave(slot: SaveSlotId) {
	localStorage.removeItem(keyForSlot(slot));
}

