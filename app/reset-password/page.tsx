"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SetNewPassword() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const accessToken = searchParams.get("code"); // Supabase sends this in the link

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		if (!accessToken) {
			setError("Invalid or expired link.");
		}
	}, [accessToken]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess(false);

		if (password !== confirmPassword) {
			setLoading(false);
			setError("Passwords do not match");
			return;
		}

		try {
			const res = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ newPassword: password, accessToken }),
			});

			const data = await res.json();
			setLoading(false);

			if (res.ok && data.success) {
				setSuccess(true);
				// Optional: redirect to login after a few seconds
				setTimeout(() => router.push("/login"), 3000);
			} else {
				setError(data.message || "Failed to reset password");
			}
		} catch (err) {
			setLoading(false);
			setError("Something went wrong. Try again later.");
		}
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center p-4 overflow-hidden relative">
			<div className="relative max-w-md w-full space-y-8">
				{/* Header */}
				<div className="space-y-2 text-center">
					<h2 className="text-4xl font-bold text-white transition-opacity duration-300 ease-in-out">
						Set New Password
					</h2>
					<p className="text-neutral-600 transition-opacity duration-300 ease-in-out">
						Enter your new password below.
					</p>
				</div>

				{/* Form */}
				<form
					onSubmit={handleSubmit}
					className="space-y-4 transition-all duration-300 ease-in-out"
				>
					{/* Password */}
					<div className="space-y-2">
						<label className="block text-white font-medium">
							New Password
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								className="w-full px-4 py-3 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-[#fd4d4d] transition-all duration-300 ease-in-out"
								required
								spellCheck={false}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-500 cursor-pointer"
							>
								{showPassword ? <FaEyeSlash /> : <FaEye />}
							</button>
						</div>
					</div>

					{/* Confirm Password */}
					<div className="space-y-2">
						<label className="block text-white font-medium">
							Confirm Password
						</label>
						<div className="relative">
							<input
								type={showConfirmPassword ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								placeholder="••••••••"
								className="w-full px-4 py-3 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-[#fd4d4d] transition-all duration-300 ease-in-out"
								required
								spellCheck={false}
							/>
							<button
								type="button"
								onClick={() =>
									setShowConfirmPassword(!showConfirmPassword)
								}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-500 cursor-pointer"
							>
								{showConfirmPassword ? (
									<FaEyeSlash />
								) : (
									<FaEye />
								)}
							</button>
						</div>
					</div>

					{/* Submit */}
					<button
						type="submit"
						className="w-full px-4 py-3 border border-neutral-800 cursor-pointer text-white font-semibold rounded-lg transition-all duration-300 ease-in-out hover:bg-neutral-900 mt-4"
						disabled={loading || !accessToken}
					>
						{loading ? "Updating..." : "Update Password"}
					</button>

					{/* Feedback */}
					{success && (
						<p className="text-green-500 font-semibold text-center mt-2">
							Password updated! Redirecting to login...
						</p>
					)}
					{error && (
						<p className="text-red-500 font-semibold text-center mt-2">
							{error}
						</p>
					)}
				</form>
			</div>
		</div>
	);
}
