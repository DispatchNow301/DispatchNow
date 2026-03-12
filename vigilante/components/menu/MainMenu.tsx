"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, LogOut, User, UserPlus, UserRound, Users } from "lucide-react";
import { useAuth } from "../../lib/auth";
import MenuBackground from "./MenuBackground";
import RainLayer from "./RainLayer";
import MuteButton from "./MuteButton";
import MultiplayerModal from "./MultiplayerModal";
import SingleplayerModal from "./SingleplayerModal";

const GAME_NAME = "Vigilante";
const MAIN_BUTTON_HEIGHT = "h-14";
const LOCKED_BUTTON =
	"border-amber-900/50 bg-black/40 text-amber-300/60 cursor-not-allowed";
const ACTIVE_BUTTON =
	"border-amber-900/50 bg-black/40 text-amber-200/80 hover:bg-amber-950/20 hover:border-amber-700/40 cursor-pointer";

export default function MainMenu() {
	const { user, signOut } = useAuth();
	const [multiplayerOpen, setMultiplayerOpen] = useState(false);
	const [singleplayerOpen, setSingleplayerOpen] = useState(false);

	const isSignedIn = !!user;

	const handleMultiplayer = () => {
		if (!isSignedIn) return;
		setMultiplayerOpen(true);
	};

	const handleSingleplayer = () => {
		setSingleplayerOpen(true);
	};

	return (
		<>
			<div className="fixed inset-0 min-h-screen overflow-auto">
				<MenuBackground />
				<RainLayer />

				<header className="relative z-10 flex items-center justify-between px-6 py-4">
					<div className="w-20" aria-hidden />

					<div className="flex items-center gap-3">
						<MuteButton />
					</div>
				</header>

				<main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 pt-4 pb-20 gap-10">
					<div className="flex flex-col items-center">
						<h1
							className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-center mb-2"
							style={{
								fontFamily: "Georgia, 'Times New Roman', serif",
								color: "#e4d5b7",
								textShadow:
									"0 0 40px rgba(180,140,80,0.2), 0 2px 4px rgba(0,0,0,0.5)",
							}}
						>
							{GAME_NAME}
						</h1>
						<p
							className="text-amber-200/50 text-sm uppercase tracking-[0.4em]"
							style={{ letterSpacing: "0.35em" }}
						>
							Dispatch from the shadows
						</p>
					</div>

					<nav className="flex flex-col gap-3 w-full max-w-xs items-stretch">
						<button
							type="button"
							onClick={handleSingleplayer}
							className={`relative flex items-center justify-between w-full px-6 rounded-xl border text-lg font-semibold transition-all duration-200 ${MAIN_BUTTON_HEIGHT} ${ACTIVE_BUTTON}`}
						>
							<span className="flex items-center gap-3">
								<User className="w-5 h-5 text-amber-200/70" aria-hidden />
								<span>Singleplayer</span>
							</span>
						</button>

						<button
							type="button"
							onClick={handleMultiplayer}
							className={`relative flex items-center justify-between w-full px-6 rounded-xl border text-lg font-semibold transition-all duration-200 ${MAIN_BUTTON_HEIGHT} ${
								isSignedIn ? ACTIVE_BUTTON : LOCKED_BUTTON
							}`}
						>
							<span className="flex items-center gap-3">
								{!isSignedIn && <Lock className="w-5 h-5" aria-hidden />}
								<Users
									className={`w-5 h-5 ${isSignedIn ? "text-amber-200/70" : "text-amber-300/60"}`}
									aria-hidden
								/>
								<span>Multiplayer</span>
							</span>
						</button>

						{isSignedIn && (
							<div className="flex items-stretch gap-3">
								<Link
									href="/profile"
									className={`flex-1 flex items-center gap-3 px-6 rounded-xl border text-lg font-semibold transition-all duration-200 ${MAIN_BUTTON_HEIGHT} ${ACTIVE_BUTTON}`}
								>
									<UserRound className="w-5 h-5 text-amber-200/70" aria-hidden />
									<span>Profile</span>
								</Link>
								<button
									type="button"
									onClick={() => {
										signOut();
										setMultiplayerOpen(false);
										setSingleplayerOpen(false);
									}}
									className={`flex items-center justify-center w-14 rounded-xl border border-amber-900/50 bg-black/40 text-amber-200/70 hover:bg-amber-950/20 hover:border-amber-700/40 hover:text-amber-100 transition-all duration-200 cursor-pointer ${MAIN_BUTTON_HEIGHT}`}
									aria-label="Sign Out"
									title="Sign Out"
								>
									<LogOut className="w-5 h-5" aria-hidden />
								</button>
							</div>
						)}
					</nav>

					{!isSignedIn && (
						<div className="flex flex-col items-center gap-3">
							<Link
								href="/login"
								className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-amber-700/50 bg-amber-950/20 text-amber-200 font-medium hover:bg-amber-900/30 transition-colors"
							>
								<UserPlus className="w-4 h-4" />
								Sign Up
							</Link>
							<p className="text-center text-sm text-amber-200/40">
								Sign in to save progress and play multiplayer.
							</p>
						</div>
					)}
				</main>
			</div>

			<MultiplayerModal
				open={multiplayerOpen}
				onClose={() => setMultiplayerOpen(false)}
				isSignedIn={isSignedIn}
			/>
			<SingleplayerModal
				open={singleplayerOpen}
				onClose={() => setSingleplayerOpen(false)}
				isSignedIn={isSignedIn}
			/>
		</>
	);
}
