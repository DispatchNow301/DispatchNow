"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MenuBackground from "../../../components/menu/MenuBackground";
import RainLayer from "../../../components/menu/RainLayer";

function SingleplayerPlayInner() {
	const params = useSearchParams();
	const scope = params.get("scope") ?? "local";
	const slot = params.get("slot") ?? "?";

	return (
		<div className="fixed inset-0 min-h-screen overflow-auto">
			<MenuBackground />
			<RainLayer />

			<header className="relative z-10 flex items-center justify-between px-6 py-4">
				<Link
					href="/"
					className="text-base font-semibold text-amber-200/80 hover:text-amber-100 transition-colors cursor-pointer"
					style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
				>
					Vigilante
				</Link>
				<span className="text-sm text-amber-200/60">
					Singleplayer • {scope} slot {slot}
				</span>
			</header>

			<main className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-24 pt-10">
				<h1
					className="text-3xl font-bold text-amber-100"
					style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
				>
					Singleplayer (placeholder)
				</h1>
				<p className="mt-2 text-amber-200/60">
					This is where the actual game scene loads from the selected save slot.
				</p>
			</main>
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

