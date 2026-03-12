"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "../../../lib/supabaseClient";
import { Suspense } from "react";
import Link from "next/link";

function CallbackInner() {
	const router = useRouter();
	const params = useSearchParams();

	useEffect(() => {
		const code = params.get("code");
		const next = params.get("next") || "/";

		const run = async () => {
			try {
				if (code) {
					const supabase = getSupabaseBrowserClient();
					await supabase.auth.exchangeCodeForSession(code);
				}
			} finally {
				router.replace(next);
			}
		};

		void run();
	}, [params, router]);

	return (
		<div className="fixed inset-0 min-h-screen bg-[#0a0a0b]">
			<header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4">
				<Link
					href="/"
					className="text-base font-semibold text-amber-200/80 hover:text-amber-100 transition-colors cursor-pointer"
					style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
				>
					Vigilante
				</Link>
				<div className="w-10" aria-hidden />
			</header>
			<main
				className="flex items-center justify-center min-h-screen px-6"
				aria-busy="true"
				aria-live="polite"
			>
				<div className="flex items-center gap-3 text-amber-200/60">
					<div
						className="w-5 h-5 rounded-full border border-amber-700/40 border-t-amber-300/80 animate-spin"
						aria-hidden
					/>
					<span className="text-sm">Signing you in…</span>
				</div>
			</main>
		</div>
	);
}

export default function AuthCallbackPage() {
	return (
		<Suspense>
			<CallbackInner />
		</Suspense>
	);
}

