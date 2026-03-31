"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth";
import MenuBackground from "../../components/menu/MenuBackground";
import RainLayer from "../../components/menu/RainLayer";

export default function DashboardPage() {
	const router = useRouter();
	const { user, signOut } = useAuth();

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
				<div className="flex items-center gap-3">
					{user && <span className="text-sm text-amber-200/70">{`Signed in with ${user.provider}`}</span>}
					<button
						type="button"
						onClick={() => {
							signOut();
							router.push("/");
						}}
						className="px-4 py-2 rounded-lg border border-amber-900/40 bg-black/30 text-amber-200/80 hover:bg-amber-950/20 transition-colors"
					>
						Sign out
					</button>
				</div>
			</header>

			<main className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-24 pt-10">
				<h1
					className="text-3xl font-bold text-amber-100"
					style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
				>
					Dashboard
				</h1>
				<p className="mt-2 text-amber-200/80">
					Placeholder for profile, accessibility settings, and cloud sync (Sprint 4).
				</p>

				<div className="mt-8 rounded-xl border border-amber-900/40 bg-black/35 p-5">
					<h2 className="text-sm font-semibold text-amber-200/90">Next targets</h2>
					<ul className="mt-3 space-y-2 text-sm text-amber-200/80">
						<li>- Accessibility settings + per-profile persistence</li>
						<li>- Real cloud saves</li>
						<li>- Multiplayer session backend</li>
					</ul>
				</div>
			</main>
		</div>
	);
}

