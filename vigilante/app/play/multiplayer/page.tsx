"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import MenuBackground from "../../../components/menu/MenuBackground";
import RainLayer from "../../../components/menu/RainLayer";
import { subscribeToSessionPlayers } from "../../../lib/multiplayer";
import {
	getSessionById,
	getSessionPlayers,
	activateSession,
	updateSessionStatus,
} from "../../../lib/multiplayer";
import type {
	MultiplayerPlayer,
	MultiplayerSession,
} from "../../../lib/gameTypes";

const StreetMapScene = dynamic(
	() => import("../../../components/game/StreetMapScene"),
	{ ssr: false }
);

function MultiplayerPlayInner() {
	const params = useSearchParams();
	const mode = params.get("mode") ?? "load";
	const code = params.get("code") ?? "";
	const sessionIdParam = params.get("sessionId") ?? "";

	const sessionId = useMemo(() => {
		const parsed = Number(sessionIdParam);
		return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
	}, [sessionIdParam]);

	const [session, setSession] = useState<MultiplayerSession | null>(null);
	const [players, setPlayers] = useState<MultiplayerPlayer[]>([]);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");
	const [gameStarted, setGameStarted] = useState(false);

	useEffect(() => {
		if (!sessionId) {
			setErrorMessage("Missing multiplayer session ID.");
			setLoading(false);
			return;
		}

		let active = true;

		const loadLobby = async () => {
			try {
				const sessionData = await getSessionById(sessionId);
				const playerData = await getSessionPlayers(sessionId);

				if (!active) return;

				if (!sessionData) {
					setErrorMessage("Multiplayer session not found.");
					setLoading(false);
					return;
				}

				setSession(sessionData);
				setPlayers(playerData);
				setErrorMessage("");
				setLoading(false);

				// Start game when 2 players joined
				if (playerData.length >= 2) {
					if (sessionData.status !== "active") {
						const startedAt = sessionData.game_started_at ?? new Date().toISOString();
						await activateSession(sessionId, startedAt);
						if (!active) return;

						const refreshed = await getSessionById(sessionId);
						if (!active) return;
						setSession(refreshed);
						setGameStarted(true);
					} else {
						setGameStarted(true);
					}
				}
			} catch (error) {
				console.error("Failed to load multiplayer lobby:", error);
				if (!active) return;
				setErrorMessage("Failed to load multiplayer session.");
				setLoading(false);
			}
		};

		loadLobby();

		const pollId = window.setInterval(() => {
			void loadLobby();
		}, 1000);

		const unsubscribePlayers = subscribeToSessionPlayers(sessionId, loadLobby);

		return () => {
			active = false;
			window.clearInterval(pollId);
			unsubscribePlayers();
		};
	}, [sessionId]);

	if (gameStarted && sessionId) {
		return (
			<div className="fixed inset-0">
				<StreetMapScene
					mode="multiplayer"
					sessionId={sessionId}
					multiplayerStartedAt={session?.game_started_at ?? null}
				/>

				<header className="absolute inset-x-0 top-0 z-[1100] flex items-center justify-start px-6 py-4 pointer-events-none">
					<Link
						href="/"
						className="pointer-events-auto text-base font-semibold text-amber-200/80 hover:text-amber-100 transition-colors cursor-pointer"
						style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
						aria-label="Back to main menu"
					>
						Vigilante
					</Link>
				</header>
			</div>
		);
	}

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
					Multiplayer Lobby
				</h1>

				<p className="mt-2 text-amber-200/60">
					Waiting for both players to join the same session before starting.
				</p>

				<div className="mt-8 rounded-xl border border-amber-900/40 bg-black/35 p-5 text-amber-200/70 space-y-3">
					{loading ? (
						<div className="text-sm text-amber-200/70">
							Loading multiplayer session...
						</div>
					) : errorMessage ? (
						<div className="rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-2 text-sm text-red-300">
							{errorMessage}
						</div>
					) : (
						<>
							<div className="text-sm space-y-1">
								<div>Session ID: {session?.id}</div>
								<div>Join Code: {(session?.join_code ?? code) || "—"}</div>
								<div>Status: {session?.status ?? "—"}</div>
								<div>Players Joined: {players.length}/2</div>
							</div>

							<div className="rounded-lg border border-amber-900/30 bg-black/25 px-4 py-3">
								<div className="text-xs uppercase tracking-[0.18em] text-amber-400/70">
									Player List
								</div>

								<div className="mt-3 space-y-2 text-sm">
									{players.length === 0 ? (
										<div className="text-amber-200/50">No players connected yet.</div>
									) : (
										players.map((player) => (
											<div
												key={player.id}
												className="flex items-center justify-between rounded-md border border-amber-900/20 bg-black/20 px-3 py-2"
											>
												<span className="text-amber-100/90">
													{player.user_id}
												</span>
												<span className="text-xs text-amber-300/70">
													{player.is_host ? "Host" : "Player"}
												</span>
											</div>
										))
									)}
								</div>
							</div>

							<div className="text-sm text-amber-200/60">
								{players.length < 2
									? "Waiting for another player to join..."
									: "Both players joined. Starting game..."}
							</div>
						</>
					)}
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

