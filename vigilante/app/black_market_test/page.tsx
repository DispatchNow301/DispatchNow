"use client";

/**
 * Black market test page.
 *
 * Uses the same saveKey format as the game page so purchases here are
 * immediately reflected when you load that save in the actual game.
 *
 * Usage:
 *   /black_market_test?scope=local&slot=1   (default if params omitted)
 *   /black_market_test?scope=cloud&slot=2
 *
 * The scope+slot must match what you selected on the save screen.
 *
 * TO ADD THE BLACK MARKET TO THE GAME-OVER SCREEN LATER:
 *   1. Copy the useMarketState(saveKey) call into your game-over component,
 *      passing the same saveKey that was used for that play session.
 *   2. Render <BlackMarketScene> with the four props it returns.
 *   3. Delete this file — nothing else depends on it.
 */

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BlackMarketScene from "../../components/game/BlackMarketScene";
import { useMarketState } from "@/lib/useMarketState";

function MarketTestInner() {
	const params = useSearchParams();
	const scope = (params.get("scope") ?? "local") as "local" | "cloud";
	const slot = params.get("slot") ?? "1";

	// Exact same formula as SingleplayerPlayPage
	const saveKey = `vigilante:singleplayer:${scope}:${slot}:streetmap`;

	const { credits, resourcePool, purchasedUpgradeIds, handlePurchase } =
		useMarketState(saveKey);

	return (
		<div className="fixed inset-0 bg-[#050810]">
			<BlackMarketScene
				credits={credits}
				resourcePool={resourcePool}
				purchasedUpgradeIds={purchasedUpgradeIds}
				onPurchase={handlePurchase}
				onClose={() => {
					// No-op on the test page.
					// On the game-over screen, put your navigation here:
					// e.g. router.push("/") or call a parent onClose() prop.
				}}
			/>
		</div>
	);
}

export default function MarketTestPage() {
	return (
		<Suspense
			fallback={
				<div className="fixed inset-0 flex items-center justify-center bg-[#050810] text-green-400/60 text-sm font-mono">
					Loading…
				</div>
			}
		>
			<MarketTestInner />
		</Suspense>
	);
}