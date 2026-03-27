"use client";


import React, { useEffect, useMemo, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import type { VigilanteSheet } from "../VigilanteDossierCard";

type CapturedDisplayItem = {
	id: string;
	name: string;
	alias: string;
	role: string;
	portrait: string | StaticImageData;
};

type PoliceCaptureModalProps = {
	open: boolean;
	capturedIds: string[];
	vigilanteSheets: VigilanteSheet[];
	onClose: () => void;
};

function buildCapturedDisplayItems(
	capturedIds: string[],
	vigilanteSheets: VigilanteSheet[],
): CapturedDisplayItem[] {
	const seen = new Set<string>();
	const byId = new Map(vigilanteSheets.map((sheet) => [sheet.id, sheet]));

	const uniqueIds = capturedIds.filter((id) => {
		if (seen.has(id)) return false;
		seen.add(id);
		return true;
	});

	return uniqueIds.map((id) => {
		const match = byId.get(id);

		if (match) {
			return {
				id: match.id,
				name: match.name,
				alias: match.alias,
				role: match.role,
				portrait: match.portrait,
			};
		}

		return {
			id,
			name: "Unknown Vigilante",
			alias: id,
			role: "Captured",
			portrait: "/images/vigilantes/placeholder.png",
		};
	});
}

export default function PoliceCaptureModal({
	open,
	capturedIds,
	vigilanteSheets,
	onClose,
}: PoliceCaptureModalProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!open) return;

		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = originalOverflow;
		};
	}, [open]);

	const capturedItems = useMemo(
		() => buildCapturedDisplayItems(capturedIds, vigilanteSheets),
		[capturedIds, vigilanteSheets],
	);

	const title =
		capturedItems.length === 1
			? "Vigilante Captured"
			: "Vigilantes Captured";

	if (!mounted) return null;

	return createPortal(
		<AnimatePresence>
			{open && capturedItems.length > 0 ? (
				<div className="fixed inset-0 z-[1400]">
					<motion.button
						type="button"
						aria-label="Close capture modal"
						className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>

					<div className="absolute inset-0 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0, y: 24, scale: 0.97 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 18, scale: 0.98 }}
							transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
							className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-red-900/45 bg-neutral-950/96 shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
						>
							<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/45 to-transparent" />

							<button
								type="button"
								onClick={onClose}
								className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:bg-white/10 hover:text-white"
							>
								<X className="h-4 w-4" />
							</button>

							<div className="border-b border-white/8 bg-gradient-to-br from-red-950/55 via-black/0 to-black/0 px-6 py-6 sm:px-7">
								<div className="flex items-start gap-4 pr-12">
									<div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-800/50 bg-red-950/45 text-red-300">
										<AlertTriangle className="h-6 w-6" />
									</div>

									<div>
										<p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-300/80">
											Police Interception
										</p>
										<h2 className="mt-1 text-2xl font-semibold text-white">
											{title}
										</h2>
										<p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
											The police reached the scene before your team
											withdrew. The captured vigilante
											{capturedItems.length > 1 ? "s have" : " has"} been
											permanently removed from your roster.
										</p>
									</div>
								</div>
							</div>

							<div className="px-6 py-5 sm:px-7">
								<div className="space-y-3">
									{capturedItems.map((item) => (
										<div
											key={item.id}
											className="flex items-center gap-4 rounded-2xl border border-red-900/30 bg-white/[0.03] px-4 py-3"
										>
											<div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30">
												<Image
													src={item.portrait}
													alt={item.name}
													fill
													className="object-cover"
													sizes="56px"
												/>
											</div>

											<div className="min-w-0 flex-1">
												<div className="truncate text-sm font-semibold text-white">
													{item.name}
												</div>
												<div className="truncate text-xs uppercase tracking-[0.14em] text-red-300/75">
													{item.alias}
												</div>
												<div className="mt-1 truncate text-xs text-white/55">
													{item.role}
												</div>
											</div>

											<div className="rounded-full border border-red-800/40 bg-red-950/35 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-red-300/80">
												Lost
											</div>
										</div>
									))}
								</div>

								<div className="mt-5 flex justify-end">
									<button
										type="button"
										onClick={onClose}
										className="inline-flex items-center justify-center rounded-xl border border-amber-900/40 bg-amber-300 px-4 py-2 text-sm font-semibold text-black transition hover:brightness-105"
									>
										Continue
									</button>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			) : null}
		</AnimatePresence>,
		document.body,
	);
}