"use client";

/**
 * useMarketState
 *
 * Reads and writes `credits`, `resourcePool`, and `purchasedUpgradeIds`
 * directly from the same localStorage key that StreetMapScene uses.
 *
 * Pass the exact same saveKey string that is passed to <StreetMapScene>.
 * The game page builds it as:
 *   `vigilante:singleplayer:${scope}:${slotIndex}:streetmap`
 *
 * Usage:
 *   const market = useMarketState("vigilante:singleplayer:local:1:streetmap");
 */

import { useCallback, useEffect, useState } from "react";
import {
	DEFAULT_RESOURCE_POOL,
	STARTING_UPGRADE_IDS,
	type ResourcePoolEntry,
} from "@/lib/resourcePool";
import type { MarketPurchasePayload } from "@/components/game/BlackMarketScene";

// ─── Types ────────────────────────────────────────────────────────────────────

type MarketFields = {
	credits: number;
	resourcePool: Record<string, ResourcePoolEntry>;
	purchasedUpgradeIds: string[];
};

// ─── localStorage helpers ─────────────────────────────────────────────────────

function readSaveRaw(saveKey: string): Record<string, unknown> {
	try {
		const raw = localStorage.getItem(saveKey);
		if (!raw) return {};
		return JSON.parse(raw) as Record<string, unknown>;
	} catch {
		return {};
	}
}

function mergeResourcePool(
	partial: unknown,
): Record<string, ResourcePoolEntry> {
	const merged: Record<string, ResourcePoolEntry> = { ...DEFAULT_RESOURCE_POOL };
	if (!partial || typeof partial !== "object") return merged;
	for (const [k, v] of Object.entries(partial as Record<string, unknown>)) {
		if (!v || typeof v !== "object") continue;
		const e = v as Record<string, unknown>;
		if (typeof e.qty !== "number" || typeof e.deployed !== "number") continue;
		const qty = Math.max(0, e.qty);
		merged[k] = { qty, deployed: Math.max(0, Math.min(e.deployed, qty)) };
	}
	return merged;
}

function readMarketFields(saveKey: string): MarketFields {
	const p = readSaveRaw(saveKey);
	return {
		credits:
			typeof p.credits === "number" && Number.isFinite(p.credits)
				? Math.max(0, Math.floor(p.credits))
				: 500,
		resourcePool: mergeResourcePool(p.resourcePool),
		purchasedUpgradeIds: Array.isArray(p.purchasedUpgradeIds)
			? (p.purchasedUpgradeIds as string[])
			: [...STARTING_UPGRADE_IDS],
	};
}

function writeMarketFields(saveKey: string, fields: MarketFields) {
	const existing = readSaveRaw(saveKey);
	localStorage.setItem(
		saveKey,
		JSON.stringify({
			...existing,
			credits: fields.credits,
			resourcePool: fields.resourcePool,
			purchasedUpgradeIds: fields.purchasedUpgradeIds,
		}),
	);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMarketState(saveKey: string) {
	const [fields, setFields] = useState<MarketFields>(() => ({
		credits: 500,
		resourcePool: { ...DEFAULT_RESOURCE_POOL },
		purchasedUpgradeIds: [...STARTING_UPGRADE_IDS],
	}));

	// Hydrate from localStorage on mount
	useEffect(() => {
		setFields(readMarketFields(saveKey));
	}, [saveKey]);

	const handlePurchase = useCallback(
		async (payload: MarketPurchasePayload) => {
			setFields((prev) => {
				const nextCredits = Math.max(0, prev.credits - payload.cost);

				const nextPool =
					payload.category === "resource"
						? (() => {
								const current = prev.resourcePool[payload.itemId] ?? {
									qty: 0,
									deployed: 0,
								};
								return {
									...prev.resourcePool,
									[payload.itemId]: { ...current, qty: current.qty + 1 },
								};
						  })()
						: prev.resourcePool;

				const nextUpgrades =
					payload.category === "upgrade" &&
					!prev.purchasedUpgradeIds.includes(payload.itemId)
						? [...prev.purchasedUpgradeIds, payload.itemId]
						: prev.purchasedUpgradeIds;

				const next: MarketFields = {
					credits: nextCredits,
					resourcePool: nextPool,
					purchasedUpgradeIds: nextUpgrades,
				};

				writeMarketFields(saveKey, next);
				return next;
			});
		},
		[saveKey],
	);

	return {
		credits: fields.credits,
		resourcePool: fields.resourcePool,
		purchasedUpgradeIds: fields.purchasedUpgradeIds,
		handlePurchase,
	};
}