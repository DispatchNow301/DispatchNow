// code modified from https://github.com/lustoykov/authentication-tutorial

"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type AuthPageProps = {
	title: string;
	intro: string;
	steps: string[];
	children: ReactNode;
};

export function AuthPage({ title, children }: AuthPageProps) {
	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100">
			<header className="border-b border-white/10 bg-slate-950/40 backdrop-blur">
				<div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
					<div>
						<h1 className="text-2xl font-semibold text-white">
							{title}
						</h1>
					</div>
					<Link
						href="/"
						className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
					>
						Back home →
					</Link>
				</div>
			</header>

			<main className="mx-auto w-full max-w-5xl px-6 py-12">
				<div className="flex flex-col gap-6">{children}</div>
			</main>
		</div>
	);
}
