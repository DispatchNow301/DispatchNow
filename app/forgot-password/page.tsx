"use client";

import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess(false);

		try {
			const res = await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			const data = await res.json();
			setLoading(false);

			if (res.ok && data.success) {
				setSuccess(true);
			} else {
				setError(data.message || "Failed to send reset email");
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
						Reset Your Password
					</h2>
					<p className="text-neutral-600 transition-opacity duration-300 ease-in-out">
						Enter your email below and we'll send you a link to
						reset your password.
					</p>
				</div>

				{/* Form */}
				<form
					onSubmit={handleSubmit}
					className="space-y-4 transition-all duration-300 ease-in-out"
				>
					<div className="space-y-2 transition-all duration-300 ease-in-out">
						<label className="block text-white font-medium transition-opacity duration-300 ease-in-out">
							Email
						</label>
						<div className="relative">
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-3 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-[#fd4d4d] transition-all duration-300 ease-in-out"
								required
								spellCheck={false}
							/>
							<FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600" />
						</div>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						className="w-full px-4 py-3 border border-neutral-800 cursor-pointer text-white font-semibold rounded-lg transition-all duration-300 ease-in-out hover:bg-neutral-900 mt-4"
						disabled={loading}
					>
						{loading ? "Sending..." : "Send Reset Link"}
					</button>

					{/* Feedback */}
					{success && (
						<p className="text-green-500 font-semibold text-center mt-2">
							Password reset email sent! Check your inbox.
						</p>
					)}
					{error && (
						<p className="text-red-500 font-semibold text-center mt-2">
							{error}
						</p>
					)}
				</form>

				{/* Back to login */}
				<p className="text-center text-sm text-neutral-600 mt-4">
					Remember your password?{" "}
					<button
						onClick={() => router.push("/login")}
						className="text-[#fd4d4d] font-semibold underline underline-offset-2 cursor-pointer"
					>
						Log in
					</button>
				</p>
			</div>
		</div>
	);
}
