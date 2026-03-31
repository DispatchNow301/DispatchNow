"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";
import { useAuth } from "../../lib/auth";
import { useSfx } from "../../lib/sfx";
import MenuBackground from "../../components/menu/MenuBackground";
import RainLayer from "../../components/menu/RainLayer";

function LoginInner() {
	const { user, signInWithProvider } = useAuth();
	const { play } = useSfx();
	const searchParams = useSearchParams();
	const nextPath = searchParams.get("next") ?? undefined;

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
				<div className="text-sm text-amber-200/80">
					{user ? `Signed in with ${user.provider}` : "Not signed in"}
				</div>
			</header>

			<main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 pb-20">
				<div className="w-full max-w-md rounded-2xl border border-amber-900/40 bg-black/35 backdrop-blur-md p-6 shadow-2xl shadow-black/50">
					<h1
						className="text-2xl font-bold text-amber-100"
						style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
					>
						Sign In
					</h1>
					<p className="mt-2 text-sm text-amber-200/80">
						Sign in with a provider to enable multiplayer and cloud saves.
					</p>

					<div className="mt-6 grid grid-cols-3 gap-3">
						<button
							type="button"
							onClick={() => {
								play("uiClick");
								signInWithProvider("google", nextPath);
							}}
							className="group flex items-center justify-center h-12 rounded-xl border border-amber-900/40 bg-black/30 text-amber-200/80 hover:text-amber-100 hover:border-amber-700/50 hover:bg-amber-950/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-600/40"
							aria-label="Sign in with Google"
							title="Google"
						>
							<FaGoogle className="w-5 h-5" aria-hidden />
						</button>
						<button
							type="button"
							onClick={() => {
								play("uiClick");
								signInWithProvider("github", nextPath);
							}}
							className="group flex items-center justify-center h-12 rounded-xl border border-amber-900/40 bg-black/30 text-amber-200/80 hover:text-amber-100 hover:border-amber-700/50 hover:bg-amber-950/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-600/40"
							aria-label="Sign in with GitHub"
							title="GitHub"
						>
							<FaGithub className="w-5 h-5" aria-hidden />
						</button>
						<button
							type="button"
							onClick={() => {
								play("uiClick");
								signInWithProvider("discord", nextPath);
							}}
							className="group flex items-center justify-center h-12 rounded-xl border border-amber-900/40 bg-black/30 text-amber-200/80 hover:text-amber-100 hover:border-amber-700/50 hover:bg-amber-950/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-600/40"
							aria-label="Sign in with Discord"
							title="Discord"
						>
							<FaDiscord className="w-5 h-5" aria-hidden />
						</button>
					</div>

					<p className="mt-6 text-xs text-amber-200/70">
						By continuing, you agree to operate “from the shadows.”
					</p>
				</div>
			</main>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense
			fallback={
				<div className="fixed inset-0 min-h-screen bg-[#0a0a0b] flex items-center justify-center text-amber-200/80 text-sm">
					Loading…
				</div>
			}
		>
			<LoginInner />
		</Suspense>
	);
}
