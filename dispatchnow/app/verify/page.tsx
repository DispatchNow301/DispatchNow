"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaEnvelope } from "react-icons/fa";

export default function EmailVerification() {
	const searchParams = useSearchParams();
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const emailParam = searchParams.get("email");
		if (emailParam) {
			setEmail(decodeURIComponent(emailParam));
		}
	}, [searchParams]);

	const handleResend = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/auth/resend-verification", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			if (response.ok) {
				alert("Verification email sent! Check your inbox.");
			} else {
				alert("Failed to resend email. Please try again.");
			}
		} catch (error) {
			alert("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#1a1a1a] to-[#090909] flex items-center justify-center p-4 overflow-hidden relative">
			{/* Main container */}
			<div className="relative w-full max-w-md">
				{/* Card */}
				<div className="border p-12 rounded-2xl border-neutral-800">
					{/* Header */}
					<div className="text-center mb-8 animate-fade">
						<div className="flex justify-center mb-4">
							<div className="w-16 h-16 bg-[#fd4d4d]/10 text-[#fd4d4d] rounded-full flex items-center justify-center">
								<FaEnvelope className="text-2xl" />
							</div>
						</div>
						<h1 className="text-3xl font-bold mb-2">
							Verify Your Email
						</h1>
						<p className="text-neutral-600">
							We've sent a confirmation link to your email. Click
							it to verify your account.
						</p>
					</div>

					{/* Email display */}
					<div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-8 text-center">
						<p className="text-neutral-600 text-sm mb-1">
							Email Address
						</p>
						<p className="text-white font-medium">
							{email || "user@example.com"}
						</p>
					</div>

					{/* Resend Button */}
					<button
						onClick={handleResend}
						disabled={loading}
						className="cursor-pointer w-full py-3 bg-neutral-900 border border-neutral-600 text-white font-semibold rounded-lg transition-all duration-500 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed mb-4 transform hover:scale-105"
					>
						{loading
							? "Sending..."
							: "Didn't receive the email? Resend"}
					</button>

					{/* Back to login */}
					<div className="text-center">
						<a
							href="/login"
							className="text-neutral-600 hover:text-[#fd4d4d] text-sm transition-colors duration-300"
						>
							Back to Log In
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
