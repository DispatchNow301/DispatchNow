"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const tabs = [
	{ name: "Home" },
	{ name: "About" },
	{ name: "Demo" },
	{ name: "Impact" },
];

export default function Navbar() {
	const [active, setActive] = useState(0);
	const [underline, setUnderline] = useState({ left: 0, width: 0 });
	const containerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const handleTabHover = (
		e: React.MouseEvent<HTMLButtonElement>,
		i: number,
	) => {
		setActive(i);
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

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const firstTab = container.querySelector("button");
		if (!firstTab) return;
		const tabRect = firstTab.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();
		setUnderline({
			left: tabRect.left - containerRect.left,
			width: tabRect.width,
		});
	}, []);

	return (
		<div className="fixed top-0 left-0 w-full z-50 cursor-pointer">
			<div className="mx-auto max-w-7xl px-6 pt-6">
				<div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-full shadow-xl">
					<div className="flex items-center justify-between px-6 py-4">
						{/* Left Section: Logo + Tabs */}
						<div className="flex items-center gap-6">
							<div className="flex items-center gap-3 font-bold text-lg">
								<div className="w-8 h-8 bg-[#fd4d4d] rounded-full" />
								DispatchNow
							</div>

							<div
								ref={containerRef}
								className="relative flex gap-6 text-sm font-semibold"
							>
								{tabs.map((tab, i) => (
									<button
										key={tab.name}
										onMouseEnter={(e) =>
											handleTabHover(e, i)
										}
										className="relative text-neutral-400 hover:text-white transition cursor-pointer"
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

						{/* Right Section: Sign In */}
						<button
							onClick={() => router.push("/login")}
							className="px-4 py-2 bg-[#fd4d4d] text-white rounded-full font-bold hover:bg-[#ff5b5b] transition cursor-pointer"
						>
							Sign In
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
