"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../lib/auth";
import {
	applyCloudHydrationIfRemoteNewer,
	fetchGameSave,
} from "../../../lib/cloudSaves";
import { touchSave, type SaveSlotId } from "../../../lib/saves";

const StreetMapScene = dynamic(
	() => import("../../../components/game/StreetMapScene"),
	{ ssr: false },
);

function parseSlotIndex(slot: string | null): 1 | 2 | 3 | null {
	if (slot === "1" || slot === "2" || slot === "3") {
		return Number(slot) as 1 | 2 | 3;
	}
	return null;
}

function SingleplayerPlayInner() {
	const router = useRouter();
	const { user } = useAuth();
	const params = useSearchParams();
	const scope = (params.get("scope") ?? "local") as "local" | "cloud";
	const slotParam = params.get("slot") ?? "?";
	const slotIndex = parseSlotIndex(slotParam);

	const saveKey = `vigilante:singleplayer:${scope}:${slotParam}:streetmap`;

	const [cloudReady, setCloudReady] = useState(scope !== "cloud");
	const [hydrateError, setHydrateError] = useState<string | null>(null);

	const cloudSync = useMemo(() => {
		if (scope !== "cloud" || !user || !slotIndex) return undefined;
		return { userId: user.id, slotIndex } as const;
	}, [scope, user, slotIndex]);

	/** Same slot as the menu tiles — used to bump `meta.updatedAt` while the map saves to `saveKey`. */
	const saveSlot = useMemo((): SaveSlotId | undefined => {
		if (!slotIndex) return undefined;
		if (scope === "local") return { scope: "local", index: slotIndex };
		if (user?.id) return { scope: "cloud", index: slotIndex, userId: user.id };
		return undefined;
	}, [scope, slotIndex, user?.id]);

	useEffect(() => {
		if (scope !== "cloud") return;
		if (!user) {
			const next = `/play/singleplayer?scope=cloud&slot=${slotParam}`;
			router.replace(`/login?next=${encodeURIComponent(next)}`);
			return;
		}
		if (!slotIndex) {
			router.replace("/");
			return;
		}

		let cancelled = false;
		(async () => {
			setHydrateError(null);
			try {
				const row = await fetchGameSave(user.id, slotIndex);
				if (cancelled) return;
				if (row) {
					const applied = applyCloudHydrationIfRemoteNewer({
						userId: user.id,
						slotIndex,
						saveKey,
						row,
					});
					if (applied) {
						const slot: SaveSlotId = {
							scope: "cloud",
							index: slotIndex,
							userId: user.id,
						};
						touchSave(slot);
					}
				}
			} catch (e) {
				if (!cancelled) {
					setHydrateError(
						e instanceof Error ? e.message : "Cloud load failed",
					);
				}
			} finally {
				if (!cancelled) setCloudReady(true);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [scope, user, slotIndex, slotParam, saveKey, router]);

	if (scope === "cloud") {
		if (!user) {
			return (
				<div className="fixed inset-0 z-[1200] flex flex-col items-center justify-center gap-4 bg-black/80 text-amber-200/80">
					<p className="text-sm">Sign in is required for cloud saves.</p>
					<p className="text-xs text-amber-200/50">Redirecting to login…</p>
				</div>
			);
		}
		if (!slotIndex) {
			return (
				<div className="fixed inset-0 z-[1200] flex flex-col items-center justify-center gap-4 bg-black/80 text-amber-200/80">
					<p className="text-sm">Invalid save slot.</p>
					<Link
						href="/"
						className="text-amber-400 underline underline-offset-2"
					>
						Back to menu
					</Link>
				</div>
			);
		}
		if (!cloudReady) {
			return (
				<div className="fixed inset-0 z-[1200] flex flex-col items-center justify-center gap-3 bg-black/80 text-amber-200/80">
					<div
						className="h-8 w-8 rounded-full border-2 border-amber-700/40 border-t-amber-300/80 animate-spin"
						aria-hidden
					/>
					<p className="text-sm">Loading cloud save…</p>
					{hydrateError ? (
						<p className="max-w-xs text-center text-xs text-amber-400/80">
							{hydrateError} — continuing with local data.
						</p>
					) : null}
				</div>
			);
		}
	}

	return (
		<div className="fixed inset-0">
			<StreetMapScene saveKey={saveKey} saveSlot={saveSlot} cloudSync={cloudSync} />
		</div>
	);
}

export default function SingleplayerPlayPage() {
	return (
		<Suspense
			fallback={
				<div className="fixed inset-0 flex items-center justify-center bg-black/80 text-amber-200/70 text-sm">
					Loading…
				</div>
			}
		>
			<SingleplayerPlayInner />
		</Suspense>
	);
}
