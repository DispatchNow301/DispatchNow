"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { listSlots, readSave, writeNewSave, type SaveSlotId } from "../../lib/saves";
import { useSfx } from "../../lib/sfx";

function formatUpdatedAt(ts: number) {
	const d = new Date(ts);
	return d.toLocaleString(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export interface SingleplayerModalProps {
	open: boolean;
	onClose: () => void;
	isSignedIn: boolean;
}

export default function SingleplayerModal({ open, onClose, isSignedIn }: SingleplayerModalProps) {
	const router = useRouter();
	const { user } = useAuth();
	const { play } = useSfx();
	const [tick, setTick] = useState(0);

	useEffect(() => {
		if (open) setTick((t) => t + 1);
	}, [open]);

	useEffect(() => {
		if (open) play("modalOpen");
	}, [open, play]);

	const localSlots = useMemo(() => listSlots("local"), [tick]);
	const cloudSlots = useMemo(
		() => (user ? listSlots("cloud", user.id) : []),
		[user, tick]
	);

	const closeModal = useCallback(() => {
		play("modalClose");
		onClose();
	}, [onClose, play]);

	if (!open) return null;

	const handleSlot = (slot: SaveSlotId) => {
		if (slot.scope === "cloud" && !isSignedIn) return;
		play("uiClick");
		const existing = readSave(slot);
		if (!existing) {
			writeNewSave(slot, `${slot.scope === "local" ? "Local" : "Cloud"} Slot ${slot.index}`);
		}
		router.push(`/play/singleplayer?scope=${slot.scope}&slot=${slot.index}`);
		closeModal();
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm opacity-100 transition-opacity duration-200"
			onClick={(e) => e.target === e.currentTarget && closeModal()}
			role="dialog"
			aria-modal="true"
			aria-labelledby="singleplayer-modal-title"
		>
			<div
				className="w-full max-w-lg rounded-xl border border-amber-900/50 bg-[#0d0c0e] shadow-2xl shadow-black/50"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between px-5 py-4 border-b border-amber-900/30">
					<h2 id="singleplayer-modal-title" className="text-lg font-semibold text-amber-100">
						Singleplayer
					</h2>
					<button
						type="button"
						onClick={closeModal}
						className="p-1.5 rounded-lg text-amber-200/70 hover:bg-amber-900/30 hover:text-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-600/50 cursor-pointer"
						aria-label="Close"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="p-5 space-y-6">
					<section>
						<h3 className="text-xs font-semibold text-amber-400/90 uppercase tracking-wider mb-3">
							Local saves
						</h3>
						<div className="grid grid-cols-3 gap-3">
							{localSlots.map((slot) => {
								const save = readSave(slot);
								return (
									<button
										key={`local-${slot.index}`}
										type="button"
										onClick={() => handleSlot(slot)}
										className="group relative overflow-hidden flex flex-col items-start justify-between py-5 px-4 rounded-xl border border-amber-900/40 bg-linear-to-b from-black/40 to-black/20 text-amber-200/85 hover:border-amber-700/50 hover:shadow-lg hover:shadow-black/30 transition-all min-h-[108px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-600/40 text-left"
									>
										<div
											className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
											style={{
												background:
													"radial-gradient(600px circle at 20% 30%, rgba(200,160,90,0.08), transparent 45%), radial-gradient(500px circle at 80% 60%, rgba(200,160,90,0.05), transparent 40%)",
											}}
											aria-hidden
										/>
										<div className="relative w-full">
											<div className="text-[11px] uppercase tracking-[0.22em] text-amber-400/70">
												Local
											</div>
											<div className="mt-1 font-semibold">{`Slot ${slot.index}`}</div>
										</div>
										<div className="relative w-full text-xs text-amber-200/50 min-h-10 leading-tight">
											{save ? (
												<>
													<div className="text-amber-200/70">Continue</div>
													<div className="mt-0.5">{formatUpdatedAt(save.meta.updatedAt)}</div>
												</>
											) : (
												<>
													<div>New Game</div>
													<div className="mt-0.5 invisible">—</div>
												</>
											)}
										</div>
									</button>
								);
							})}
						</div>
					</section>

					<section>
						<h3 className="text-xs font-semibold text-amber-400/90 uppercase tracking-wider mb-3">
							Cloud saves
						</h3>
						<div className="grid grid-cols-3 gap-3">
							{(cloudSlots.length ? cloudSlots : listSlots("cloud", "signed-out" as never)).map(
								(slot, i) => {
									const disabled = !user;
									const actual = user ? cloudSlots[i] : null;
									const save = actual ? readSave(actual) : null;
									return (
										<button
											key={`cloud-${i + 1}`}
											type="button"
											onClick={() => {
												if (disabled) {
													play("uiClick");
													router.push(
														`/login?next=${encodeURIComponent(
															`/play/singleplayer?scope=cloud&slot=${i + 1}`,
														)}`,
													);
													closeModal();
													return;
												}
												if (actual) handleSlot(actual);
											}}
											disabled={false}
											className="group relative overflow-hidden flex flex-col items-start justify-between py-5 px-4 rounded-xl border border-amber-900/40 bg-linear-to-b from-black/40 to-black/20 text-amber-200/85 hover:border-amber-700/50 hover:shadow-lg hover:shadow-black/30 transition-all min-h-[108px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-600/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:border-amber-900/40 text-left"
										>
											<div
												className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
												style={{
													background:
														"radial-gradient(600px circle at 20% 30%, rgba(200,160,90,0.08), transparent 45%), radial-gradient(500px circle at 80% 60%, rgba(200,160,90,0.05), transparent 40%)",
												}}
												aria-hidden
											/>
											<div className="relative w-full">
												<div className="text-[11px] uppercase tracking-[0.22em] text-amber-400/70">
													Cloud
												</div>
												<div className="mt-1 font-semibold">{`Slot ${i + 1}`}</div>
											</div>
											<div className="relative w-full text-xs text-amber-200/50 min-h-10 leading-tight">
												{disabled ? (
													<>
														<div>Sign In</div>
														<div className="mt-0.5 invisible">—</div>
													</>
												) : save ? (
													<>
														<div className="text-amber-200/70">Continue</div>
														<div className="mt-0.5">{formatUpdatedAt(save.meta.updatedAt)}</div>
													</>
												) : (
													<>
														<div>Empty</div>
														<div className="mt-0.5 invisible">—</div>
													</>
												)}
											</div>
										</button>
									);
								}
							)}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}

