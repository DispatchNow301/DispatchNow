"use client";

import CityMap from "@/components/CityMap";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Login() {
	const router = useRouter();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSignUp, setIsSignUp] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const form = e.currentTarget;
		const formData = new FormData(form);

		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const confirmPassword = formData.get("confirmPassword") as string;

		let res: Response;

		if (isSignUp) {
			res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password, confirmPassword }),
			});
		} else {
			res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
		}

		const data = await res.json();
		setLoading(false);

		if (res.ok && data.success) {
			if (isSignUp) {
				router.push(`/verify?email=${encodeURIComponent(email)}`);
			} else {
				router.push("/");
			}
		} else {
			setError(data.message || "Authentication failed");
		}
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center p-4 overflow-hidden relative">
			{/* Main container */}
			<div className="relative max-w-6xl w-full">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
					{/* Left side - Login Form */}
					<div className="space-y-8">
						{/* Welcome text - with fade animation */}
						<div className="space-y-2">
							<h2 className="text-4xl font-bold text-white transition-opacity duration-300 ease-in-out">
								{isSignUp ? "Create Account" : "Welcome!"}
							</h2>
							<p className="text-neutral-600 transition-opacity duration-300 ease-in-out">
								{isSignUp
									? "Sign up to get started with DispatchNow."
									: "Access your DispatchNow account and stay up to date."}
							</p>
						</div>

						{/* OAuth buttons - always visible with smooth transition */}
						<div className="space-y-3 transition-all duration-300 ease-in-out">
							<form action="/api/auth/login/google" method="GET">
								<button
									type="submit"
									className="cursor-pointer w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-800 rounded-lg text-white hover:bg-neutral-900 transition-all duration-300 ease-in-out group"
								>
									<svg
										className="w-5 h-5"
										viewBox="0 0 24 24"
										fill="none"
									>
										<path
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											fill="#4285F4"
										/>
										<path
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											fill="#34A853"
										/>
										<path
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											fill="#FBBC05"
										/>
										<path
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											fill="#EA4335"
										/>
									</svg>
									<span className="font-semibold transition-opacity duration-300 ease-in-out">
										Log in with Google
									</span>
								</button>
							</form>
						</div>

						{/* Divider */}
						<div className="relative flex items-center gap-4">
							<div className="flex-1 h-px bg-linear-to-r from-transparent via-neutral-800 to-transparent"></div>
							<span className="text-neutral-600 text-sm font-semibold">
								OR
							</span>
							<div className="flex-1 h-px bg-linear-to-r from-transparent via-neutral-800 to-transparent"></div>
						</div>

						{/* Error message */}
						{error && (
							<div className="p-3 bg-[#fd4d4d]/5 border border-[#fd4d4d] rounded-lg text-[#fd4d4d] text-sm">
								{error}
							</div>
						)}

						{/* Form wrapper - entire form animates together */}
						<form
							className="space-y-4 transition-all duration-300 ease-in-out"
							onSubmit={handleSubmit}
						>
							{/* Email */}
							<div className="space-y-2 transition-all duration-300 ease-in-out">
								<label className="block text-white font-medium transition-opacity duration-300 ease-in-out">
									Email
								</label>
								<input
									type="email"
									name="email"
									placeholder="your@email.com"
									className="w-full px-4 py-3 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-[#fd4d4d] transition-all duration-300 ease-in-out"
									required
									spellCheck={false}
								/>
							</div>

							{/* Password */}
							<div className="space-y-2 transition-all duration-300 ease-in-out">
								<div className="flex items-center justify-between">
									<label className="block text-white font-medium transition-opacity duration-300 ease-in-out">
										Password
									</label>
									{/* Forgot Password - smooth fade in/out */}
									<a
										href="/forgot-password"
										className={`text-sm font-bold transition-all duration-300 ease-in-out underline-offset-2 underline ${
											isSignUp
												? "opacity-0 pointer-events-none"
												: "opacity-100 text-[#fd4d4d]"
										}`}
									>
										Forgot password?
									</a>
								</div>
								<div className="relative transition-all duration-300 ease-in-out">
									<input
										type={
											showPassword ? "text" : "password"
										}
										name="password"
										placeholder="••••••••"
										className="w-full px-4 py-3 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-[#fd4d4d] transition-all duration-300 ease-in-out"
										required
										spellCheck={false}
									/>
									<button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-500 cursor-pointer transition-all duration-300 ease-in-out"
									>
										{showPassword ? (
											<FaEyeSlash className="w-4 h-4 transition-all duration-300 ease-in-out" />
										) : (
											<FaEye className="w-4 h-4 transition-all duration-300 ease-in-out" />
										)}
									</button>
								</div>
							</div>

							{/* Confirm Password - smooth height transition */}
							<div
								className={`overflow-hidden transition-all duration-300 ease-in-out ${
									isSignUp
										? "max-h-32 opacity-100"
										: "max-h-0 opacity-0"
								}`}
							>
								<div className="space-y-2 transition-all duration-300 ease-in-out pt-2">
									<label className="block text-white font-medium transition-opacity duration-300 ease-in-out">
										Confirm Password
									</label>
									<div className="relative transition-all duration-300 ease-in-out">
										<input
											type={
												showConfirmPassword
													? "text"
													: "password"
											}
											name="confirmPassword"
											placeholder="••••••••"
											className="w-full px-4 py-3 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-[#fd4d4d] transition-all duration-300 ease-in-out"
											required={isSignUp}
											spellCheck={false}
										/>
										<button
											type="button"
											onClick={() =>
												setShowConfirmPassword(
													!showConfirmPassword,
												)
											}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-500 cursor-pointer transition-all duration-300 ease-in-out"
										>
											{showConfirmPassword ? (
												<FaEyeSlash className="w-4 h-4 transition-all duration-300 ease-in-out" />
											) : (
												<FaEye className="w-4 h-4 transition-all duration-300 ease-in-out" />
											)}
										</button>
									</div>
								</div>
							</div>

							{/* Submit button - smooth text transition */}
							<button
								type="submit"
								disabled={loading}
								className={`w-full px-4 py-3 border border-neutral-800 cursor-pointer text-white font-semibold rounded-lg transition-all duration-300 ease-in-out hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed ${isSignUp ? "mt-8" : "mt-4"}`}
							>
								<span className="transition-opacity duration-300 ease-in-out inline-block">
									{loading
										? "Create Account"
										: isSignUp
											? "Create Account"
											: "Log In"}
								</span>
							</button>
						</form>

						{/* Sign up/login link */}
						<p className="text-center text-sm text-neutral-600 transition-opacity duration-300 ease-in-out">
							{isSignUp
								? "Already have an account? "
								: "Don't have an account? "}
							<button
								onClick={() => setIsSignUp(!isSignUp)}
								className="text-[#fd4d4d] font-semibold transition-all duration-300 ease-in-out underline underline-offset-2 cursor-pointer"
							>
								{isSignUp ? "Log in" : "Sign up"}
							</button>
						</p>
					</div>

					{/* Right side - Promotional content with globe */}
					<div className="hidden lg:flex flex-col items-center justify-center relative h-full min-h-96">
						{/* Animated globe */}
						<div className="relative w-full flex items-center justify-center">
							{/* Globe container */}
							<div className="relative w-96 h-96">
								<CityMap />
							</div>
						</div>

						{/* Text below 3D element */}
						<div className="text-center mt-12 space-y-2">
							<h3 className="text-4xl font-bold text-white">
								<span>Realtime Reporting.</span>
								<br />
								<span className="text-[#fd4d4d]">
									Rapid Responses.
								</span>
							</h3>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
