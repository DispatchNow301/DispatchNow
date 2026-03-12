"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MenuBackground from "../../../components/menu/MenuBackground";
import RainLayer from "../../../components/menu/RainLayer";

function MultiplayerPlayInner() {
	const params = useSearchParams();
	const mode = params.get("mode") ?? "load";
	const code = params.get("code") ?? "";
	const scope = params.get("scope") ?? "";
	const slot = params.get("slot") ?? "";

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
				<span className="text-sm text-amber-200/60">Multiplayer • {mode}</span>
			</header>

			<main className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-24 pt-10">
				<h1
					className="text-3xl font-bold text-amber-100"
					style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
				>
					Multiplayer (placeholder)
				</h1>
				<p className="mt-2 text-amber-200/60">
					This page will become the lobby/handshake screen (code exchange + session sync).
				</p>

				<div className="mt-8 rounded-xl border border-amber-900/40 bg-black/35 p-5 text-amber-200/70">
					<div className="text-sm">
						<div>Mode: {mode}</div>
						{code && <div>Code: {code}</div>}
						{scope && slot && (
							<div>
								Save: {scope} slot {slot}
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}

export default function MultiplayerPlayPage() {
	return (
		<Suspense>
			<MultiplayerPlayInner />
		</Suspense>
	);
}

