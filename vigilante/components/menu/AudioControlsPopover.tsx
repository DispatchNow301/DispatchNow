"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useGameAudio } from "../../lib/gameAudioContext";
import VolumeSlider, { VOLUME_SLIDER_INPUT_ID } from "./VolumeSlider";

const panelVariants = {
	openFrom: { opacity: 0, x: 16 },
	open: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
	},
	closed: {
		opacity: 0,
		x: 44,
		transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const },
	},
} as const;

/** Sound button always visible; slider pops out to the **left** when opened. */
export default function AudioControlsPopover() {
	const { volume } = useGameAudio();
	const silent = volume === 0;
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const panelId = useId();

	const close = useCallback(() => setOpen(false), []);

	useEffect(() => {
		if (!open) return;

		const onDocPointerDown = (e: PointerEvent) => {
			const el = containerRef.current;
			if (!el || el.contains(e.target as Node)) return;
			close();
		};

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};

		document.addEventListener("pointerdown", onDocPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onDocPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [open, close]);

	useEffect(() => {
		if (!open) return;
		const id = requestAnimationFrame(() => {
			document.getElementById(VOLUME_SLIDER_INPUT_ID)?.focus();
		});
		return () => cancelAnimationFrame(id);
	}, [open]);

	return (
		<div
			ref={containerRef}
			className="relative inline-flex h-9 items-center"
		>
			<AnimatePresence>
				{open && (
					<motion.div
						key="audio-panel"
						variants={panelVariants}
						initial="openFrom"
						animate="open"
						exit="closed"
						className="absolute right-full top-0 bottom-0 z-10050 mr-1.5 flex items-center"
					>
						<div
							id={panelId}
							role="group"
							aria-label="Music volume"
							className="flex h-9 items-center rounded-lg border border-amber-900/50 bg-black/40 px-2.5 backdrop-blur-md shadow-lg shadow-black/40"
						>
							<VolumeSlider />
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-900/50 bg-black/40 text-amber-200/80 backdrop-blur-md shadow-lg shadow-black/40 hover:bg-amber-950/20 hover:border-amber-700/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-600/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0b] cursor-pointer"
				aria-expanded={open}
				aria-controls={open ? panelId : undefined}
				aria-label={open ? "Close music volume" : "Open music volume"}
			>
				{silent ? (
					<VolumeX className="w-[17px] h-[17px]" aria-hidden />
				) : (
					<Volume2 className="w-[17px] h-[17px]" aria-hidden />
				)}
			</button>
		</div>
	);
}
