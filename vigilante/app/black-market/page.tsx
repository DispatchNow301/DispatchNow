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
 */

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BlackMarketScene from "../../components/game/BlackMarketScene";
import { useMarketState } from "@/lib/useMarketState";
import { restartRun as restartRunGame } from "@/lib/gameStateUtils";

function MarketTestInner() {
	const router = useRouter();
	const params = useSearchParams();

	const scope = (params.get("scope") ?? "local") as "local" | "cloud";
	const slot = params.get("slot") ?? "1";

	// Exact same formula as SingleplayerPlayPage
	const saveKey = `vigilante:singleplayer:${scope}:${slot}:streetmap`;

	const { credits, resourcePool, purchasedUpgradeIds, handlePurchase } =
		useMarketState(saveKey);

	const handleRestartRun = () => {
		// SaveKey matches the one used by the game page
		const saveKey = `vigilante:singleplayer:${scope}:${slot}:streetmap`;

		// Restart the game run while preserving resources, buffs, and credits
		restartRunGame(saveKey);

		// Navigate to game page
		router.push(`/play/singleplayer?scope=${scope}&slot=${slot}`);
	};

	return (
		<div className="fixed inset-0 relative bg-[#050810]">
			{/* Black Market Scene */}
			<BlackMarketScene
				credits={credits}
				resourcePool={resourcePool}
				purchasedUpgradeIds={purchasedUpgradeIds}
				onPurchase={handlePurchase}
				onClose={handleRestartRun}
			/>

			{/* Always-on-top Restart Button */}
			<div className="absolute bottom-6 right-6 z-[9999]">
				<button
					type="button"
					onClick={handleRestartRun}
					className="rounded-2xl border border-green-500/30 bg-black/70 px-5 py-3 text-sm font-semibold text-green-300 transition hover:bg-green-950/25 hover:text-green-200"
				>
					Restart Run
				</button>
			</div>
		</div>
	);
}

export default function MarketTestPage() {
	return (
		<Suspense
			fallback={
				<div className="fixed inset-0 flex items-center justify-center bg-[#050810] text-sm font-mono text-green-400/60">
					Loading…
				</div>
			}
		>
			<MarketTestInner />
		</Suspense>
	);
}
