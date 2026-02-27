"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MdOutlineRadar } from "react-icons/md";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

const tabs = [
	{ name: "Home", href: "home" },
	{ name: "About", href: "about" },
	{ name: "Demo", href: "demo" },
	{ name: "Impact", href: "impact" },
];

export default function Navbar() {
	const [active, setActive] = useState(0);
	const [underline, setUnderline] = useState({ left: 0, width: 0 });
	const [isHovering, setIsHovering] = useState(false);
	const [isSignedIn, setIsSignedIn] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const router = useRouter();
	const supabase = getSupabaseBrowserClient();

	// Check auth state on mount and listen for changes
	useEffect(() => {
		const getSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setIsSignedIn(!!session);
		};
		getSession();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setIsSignedIn(!!session);
		});

		return () => subscription.unsubscribe();
	}, []);

	const moveUnderlineTo = useCallback((index: number) => {
		const btn = buttonRefs.current[index];
		const container = containerRef.current;
		if (!btn || !container) return;
		const tabRect = btn.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();
		setUnderline({
			left: tabRect.left - containerRect.left,
			width: tabRect.width,
		});
	}, []);

	const handleTabClick = (index: number, sectionId: string) => {
		setActive(index);
		const el = document.getElementById(sectionId);
		if (el) el.scrollIntoView({ behavior: "smooth" });
	};

	const handleTabHover = (e: React.MouseEvent<HTMLButtonElement>) => {
		const tab = e.currentTarget;
		const container = containerRef.current;
		if (!container) return;
		const tabRect = tab.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();
		setUnderline({
			left: tabRect.left - containerRect.left,
			width: tabRect.width,
		});
	};

	const handleMouseLeave = () => {
		setIsHovering(false);
		moveUnderlineTo(active);
	};

	useEffect(() => {
		const sectionIds = tabs.map((t) => t.href);
		const observer = new IntersectionObserver(
			(entries) => {
				let best = -1;
				let bestRatio = -1;
				entries.forEach((entry) => {
					const idx = sectionIds.indexOf(entry.target.id);
					if (idx !== -1 && entry.intersectionRatio > bestRatio) {
						bestRatio = entry.intersectionRatio;
						best = idx;
					}
				});
				if (best !== -1 && !isHovering) {
					setActive(best);
					moveUnderlineTo(best);
				}
			},
			{ threshold: [0.2, 0.5, 0.8], rootMargin: "-80px 0px -20% 0px" },
		);
		sectionIds.forEach((id) => {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		});
		return () => observer.disconnect();
	}, [isHovering, moveUnderlineTo]);

	useEffect(() => {
		moveUnderlineTo(0);
	}, [moveUnderlineTo]);

	return (
		<div className="fixed top-0 left-0 w-full z-50">
			<div className="mx-auto max-w-7xl px-6 pt-6">
				<div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-full shadow-xl">
					<div className="flex items-center justify-between px-6 py-4">
						<div className="flex items-center gap-6">
							<button
								onClick={() => handleTabClick(0, "home")}
								className="flex items-center gap-2.5 cursor-pointer"
							>
								<div
									className="w-9 h-9 rounded-lg flex items-center justify-center"
									style={{
										background: "rgba(253,77,77,0.12)",
										border: "1px solid rgba(253,77,77,0.25)",
									}}
								>
									<MdOutlineRadar
										className="text-[#fd4d4d]"
										size={20}
									/>
								</div>
								<span className="text-white font-extrabold text-xl tracking-tight">
									Dispatch
									<span className="text-[#fd4d4d]">Now</span>
								</span>
								<span
									className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
									style={{
										color: "#fd4d4d",
										background: "rgba(253,77,77,0.1)",
										border: "1px solid rgba(253,77,77,0.15)",
									}}
								>
									Beta
								</span>
							</button>

							<div
								ref={containerRef}
								className="relative flex gap-6 text-sm font-semibold"
								onMouseLeave={handleMouseLeave}
							>
								{tabs.map((tab, i) => (
									<button
										key={tab.name}
										ref={(el) => {
											buttonRefs.current[i] = el;
										}}
										onMouseEnter={(e) => {
											setIsHovering(true);
											handleTabHover(e);
										}}
										onClick={() =>
											handleTabClick(i, tab.href)
										}
										className={`relative transition-colors duration-200 cursor-pointer ${
											active === i
												? "text-white"
												: "text-neutral-400 hover:text-white"
										}`}
									>
										{tab.name}
									</button>
								))}
								<motion.div
									className="absolute -bottom-2 h-[2px] bg-[#fd4d4d]"
									animate={{
										left: underline.left,
										width: underline.width,
									}}
									transition={{
										type: "spring",
										stiffness: 400,
										damping: 35,
									}}
								/>
							</div>
						</div>

						{/* Auth Button */}
						{isSignedIn ? (
							<button
								onClick={() => router.push("/dashboard")}
								className="px-4 py-2 bg-neutral-800 text-white rounded-full font-bold border border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 transition cursor-pointer"
							>
								Dashboard →
							</button>
						) : (
							<button
								onClick={() => router.push("/login")}
								className="px-4 py-2 bg-[#fd4d4d] text-white rounded-full font-bold hover:bg-[#ff5b5b] transition cursor-pointer"
							>
								Sign In
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
