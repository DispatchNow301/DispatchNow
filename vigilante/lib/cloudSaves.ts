"use client";

import { getSupabaseBrowserClient } from "./supabaseClient";

export const GAME_SAVE_SCHEMA_VERSION = 1;

/** Set after a successful cloud upsert so we can prefer local vs server on next load. */
export function cloudLastFlushKey(userId: string, slotIndex: 1 | 2 | 3) {
	return `vigilante:cloud:lastFlush:${userId}:${slotIndex}`;
}

export function markCloudFlush(userId: string, slotIndex: 1 | 2 | 3) {
	localStorage.setItem(cloudLastFlushKey(userId, slotIndex), new Date().toISOString());
}

export type CloudGameSaveRow = {
	state: Record<string, unknown>;
	title: string;
	schema_version: number;
	updated_at: string;
};

/**
 * Load cloud row for a slot. Returns null if no row or error (caller may fall back to local).
 */
export async function fetchGameSave(
	userId: string,
	slotIndex: 1 | 2 | 3,
): Promise<CloudGameSaveRow | null> {
	try {
		const supabase = getSupabaseBrowserClient();
		const { data, error } = await supabase
			.from("game_saves")
			.select("state, title, schema_version, updated_at")
			.eq("user_id", userId)
			.eq("slot_index", slotIndex)
			.maybeSingle();

		if (error) {
			console.warn("[cloudSaves] fetchGameSave:", error.message);
			return null;
		}
		if (!data?.state || typeof data.state !== "object") return null;
		return {
			state: data.state as Record<string, unknown>,
			title: typeof data.title === "string" ? data.title : "Save",
			schema_version:
				typeof data.schema_version === "number" ? data.schema_version : 1,
			updated_at:
				typeof data.updated_at === "string"
					? data.updated_at
					: new Date().toISOString(),
		};
	} catch (e) {
		console.warn("[cloudSaves] fetchGameSave:", e);
		return null;
	}
}

/**
 * If server has newer data than our last flush, write map state to localStorage.
 * Returns true if local map was replaced (caller should touchSave meta).
 */
export function applyCloudHydrationIfRemoteNewer(args: {
	userId: string;
	slotIndex: 1 | 2 | 3;
	saveKey: string;
	row: CloudGameSaveRow;
}): boolean {
	const { userId, slotIndex, saveKey, row } = args;
	const lastFlush = localStorage.getItem(cloudLastFlushKey(userId, slotIndex));
	const localMap = localStorage.getItem(saveKey);
	const serverTime = Date.parse(row.updated_at);
	const payload = JSON.stringify(row.state);
	if (!localMap) {
		localStorage.setItem(saveKey, payload);
		return true;
	}
	if (lastFlush && serverTime > Date.parse(lastFlush)) {
		localStorage.setItem(saveKey, payload);
		return true;
	}
	return false;
}

export async function upsertGameSave(params: {
	userId: string;
	slotIndex: 1 | 2 | 3;
	title: string;
	state: Record<string, unknown>;
	schemaVersion?: number;
}): Promise<boolean> {
	try {
		const supabase = getSupabaseBrowserClient();
		const { error } = await supabase.from("game_saves").upsert(
			{
				user_id: params.userId,
				slot_index: params.slotIndex,
				title: params.title,
				state: params.state,
				schema_version: params.schemaVersion ?? GAME_SAVE_SCHEMA_VERSION,
			},
			{ onConflict: "user_id,slot_index" },
		);
		if (error) {
			console.warn("[cloudSaves] upsertGameSave:", error.message);
			return false;
		}
		return true;
	} catch (e) {
		console.warn("[cloudSaves] upsertGameSave:", e);
		return false;
	}
}
