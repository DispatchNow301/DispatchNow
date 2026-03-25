"use client";

import type { StaticImageData } from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Volume2 } from "lucide-react";

export type DialogueSpeaker = {
	id: string;
	name: string;
	role:
		| "Citizen"
		| "Police"
		| "Chief"
		| "Dispatcher"
		| "Vigilante"
		| "Unknown";
	portrait: string | StaticImageData;
};

type Props = {
	open: boolean;
	speaker: DialogueSpeaker | null;
	text: string;
	onClose?: () => void;
	onNext?: () => void;
	nextLabel?: string;
	position?: "bottom-left" | "bottom-right" | "bottom-center";
	/** Tailwind `bottom-*` class when not `docked` — ignored when `docked`. */
	bottomClass?: string;
	/** When true, box is `relative` (parent positions with `bottom` offset above inventory). */
	docked?: boolean;
	onSpeak?: (text: string, speakerId: string) => void;
	onStopSpeak?: () => void;
	isSpeaking?: boolean;
};

export default function NPCDialogueBox({
	open,
	speaker,
	text,
	onClose,
	onNext,
	nextLabel = "Roger that",
	position = "bottom-left",
	bottomClass = "bottom-6",
	docked = false,
	onSpeak,
	onStopSpeak,
	isSpeaking = false,
}: Props) {
	/** Above inventory (`z-[980]`), below dossier overlays */
	const Z_OVERLAY = "z-[2500]";

	const positionClass =
		position === "bottom-center"
			? `left-1/2 -translate-x-1/2 ${bottomClass}`
			: position === "bottom-right"
				? `right-4 ${bottomClass}`
				: `left-4 ${bottomClass}`;

	const shellClass = docked
		? `relative ${Z_OVERLAY} w-full min-w-[300px]`
		: `absolute ${Z_OVERLAY} ${positionClass} w-[min(92vw,720px)] min-w-[300px]`;

	const onSpeakRef = useRef(onSpeak);
	const onStopSpeakRef = useRef(onStopSpeak);
	onSpeakRef.current = onSpeak;
	onStopSpeakRef.current = onStopSpeak;

	useEffect(() => {
		if (!open) {
			onStopSpeakRef.current?.();
			return;
		}
		if (!speaker || !onSpeakRef.current) return;
		onSpeakRef.current(text, speaker.id);
	}, [open, speaker?.id, text]);

	if (!speaker) return null;

	const portraitSrc =
		typeof speaker.portrait === "string"
			? speaker.portrait
			: speaker.portrait.src;

	const btnPrimary =
		"cursor-pointer rounded-lg border border-amber-900/45 bg-black/50 px-5 py-2.5 text-sm font-medium text-amber-100/90 transition-all hover:bg-amber-950/40 hover:border-amber-500/60 active:scale-[0.98]";

	return (
		<AnimatePresence mode="wait">
			{open ? (
				<motion.div
					key="dialogue-panel"
					initial={{ opacity: 0, y: 14 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0 }}
					transition={{
						duration: 0.28,
						ease: [0.22, 1, 0.36, 1],
					}}
					className={shellClass}
				>
					<div className="overflow-hidden rounded-xl border border-amber-900/40 bg-black/85">
						<div className="flex items-stretch">
							<div className="relative min-h-[152px] w-32 shrink-0 self-stretch overflow-hidden">
								<div className="absolute inset-0">
									<img
										src={portraitSrc}
										alt={speaker.name}
										loading="eager"
										decoding="async"
										draggable={false}
										className="pointer-events-none block h-full w-full object-cover object-bottom select-none"
									/>
								</div>
							</div>

							<div className="flex min-h-[152px] flex-1 flex-col justify-between px-4 py-3">
								<div>
									<div className="flex items-center gap-2">
										<div className="text-[10px] uppercase tracking-[0.2em] text-amber-400/65">
											{speaker.role}
										</div>
										<div
											className={`ml-auto transition-opacity duration-200 ${
												isSpeaking
													? "opacity-100"
													: "opacity-0"
											}`}
										>
											<Volume2 className="h-3.5 w-3.5 text-amber-400/60" />
										</div>
									</div>

									<div className="mt-0.5 text-lg font-semibold leading-snug text-amber-50/95">
										{speaker.name}
									</div>

									<p className="mt-3 text-sm leading-relaxed text-amber-100/85">
										{text}
									</p>
								</div>

								<div className="mt-3 flex justify-end">
									<button
										type="button"
										onClick={() => {
											onStopSpeak?.();
											onNext?.();
											onClose?.();
										}}
										className={btnPrimary}
									>
										{nextLabel}
									</button>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
