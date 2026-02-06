"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import Link from "next/link";

type LoginFormProps = {
	user: User | null;
};

type Mode = "register" | "login";

export default function LoginForm({ user }: LoginFormProps) {
	const [mode, setMode] = useState<Mode>("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [status, setStatus] = useState("");
	const supabase = getSupabaseBrowserClient();
	const [currentUser, setCurrentUser] = useState<User | null>(user);

	async function handleLogout() {
		await supabase.auth.signOut();
		setCurrentUser(null);
		setStatus("Logged out successfully");
	}

	useEffect(() => {
		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				console.log("Auth state changed:", _event, session?.user);
				setCurrentUser(session?.user ?? null);
			},
		);

		return () => {
			listener?.subscription.unsubscribe();
		};
	}, [supabase]);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (mode === "register") {
			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/dashboard`,
				},
			});

			setStatus(
				error
					? error.message
					: "Check your inbox to confirm the new account.",
			);
		} else {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			setStatus(error ? error.message : "Logged in successfully");
		}
	}

	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100">
			<main className="mx-auto w-full max-w-5xl px-6 py-12 flex flex-col gap-6">
				{!currentUser && (
					<form
						className="relative overflow-hidden rounded-[32px] border border-emerald-500/30 bg-gradient-to-br from-[#05130d] via-[#04100c] to-[#0c2a21] p-8 text-slate-100 shadow-[0_35px_90px_rgba(2,6,23,0.65)]"
						onSubmit={handleSubmit}
					>
						<div className="mt-8 flex flex-wrap items-center justify-between gap-4">
							<h3 className="text-xl font-semibold text-white">
								{mode === "register"
									? "Register a new account"
									: "Welcome back to DispatchNow"}
							</h3>

							<div className="flex rounded-full border border-white/10 bg-white/[0.07] p-1 text-xs font-semibold text-slate-300">
								{(["register", "login"] as Mode[]).map(
									(option) => (
										<button
											key={option}
											type="button"
											aria-pressed={mode === option}
											onClick={() => setMode(option)}
											className={`rounded-full px-4 py-1 transition ${
												mode === option
													? "bg-emerald-500/30 text-white"
													: "text-slate-400"
											}`}
										>
											{option === "register"
												? "Register"
												: "Login"}
										</button>
									),
								)}
							</div>
						</div>

						<div className="mt-6 space-y-4">
							<label className="block text-sm font-medium text-slate-200">
								Email
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0b1b18] px-3 py-2.5 text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
									placeholder="you@email.com"
								/>
							</label>

							<label className="block text-sm font-medium text-slate-200">
								Password
								<input
									type="password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
									minLength={6}
									className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0b1b18] px-3 py-2.5 text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
									placeholder="At least 6 characters"
								/>
							</label>
						</div>

						<button
							type="submit"
							className="mt-6 w-full rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400"
						>
							{mode === "register" ? "Register" : "Login"}
						</button>

						{status && (
							<p
								className="mt-4 text-sm text-slate-300"
								role="status"
							>
								{status}
							</p>
						)}
					</form>
				)}

				<section className="rounded-[28px] border border-white/10 bg-white/5 p-7 text-slate-200 backdrop-blur">
					<h3 className="text-lg font-semibold text-white">
						Session
					</h3>

					{currentUser ? (
						<>
							<p className="mt-3 text-sm">
								Email: {currentUser.email}
							</p>
							<button
								className="mt-6 w-full rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/20"
								onClick={handleLogout}
							>
								Logout
							</button>
						</>
					) : (
						<p className="mt-4 text-sm text-slate-400">
							Log in to hydrate session data.
						</p>
					)}
				</section>
			</main>
		</div>
	);
}
