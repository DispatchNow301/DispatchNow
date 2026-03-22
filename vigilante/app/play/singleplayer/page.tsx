"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const StreetMapScene = dynamic(() => import("../../../components/game/StreetMapScene"), { ssr: false });

function SingleplayerPlayInner() {
	const params = useSearchParams();
	const scope = params.get("scope") ?? "local";
	const slot = params.get("slot") ?? "?";
	const saveKey = `vigilante:singleplayer:${scope}:${slot}:streetmap`;

	return (
		<div className="fixed inset-0">
			<StreetMapScene saveKey={saveKey} />
		</div>
	);
}

export default function SingleplayerPlayPage() {
	return (
		<Suspense>
			<SingleplayerPlayInner />
		</Suspense>
	);
}

