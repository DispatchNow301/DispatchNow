"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Trash2 } from "lucide-react";
import { useAuth } from "../../lib/auth";
import {
	listSlots,
	readSave,
	writeNewSave,
	deleteSave,
	type SaveSlotId,
} from "../../lib/saves";
import { deleteGameSave } from "../../lib/cloudSaves";
import { useSfx } from "../../lib/sfx";

function formatUpdatedAt(ts: number) {
	const d = new Date(ts);
	return d.toLocaleString(undefined, {
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export interface SingleplayerModalProps {
	open: boolean;
	onClose: () => void;
	isSignedIn: boolean;
}

export default function SingleplayerModal({
	open,
	onClose,
	isSignedIn,
}: SingleplayerModalProps) {
	const router = useRouter();
	const { user } = useAuth();
	const { play } = useSfx();
	const [tick, setTick] = useState(0);
	const [deletingSlot, setDeletingSlot] = useState<SaveSlotId | null>(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [deleteStatus, setDeleteStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [deleteError, setDeleteError] = useState<string | null>(null);

	useEffect(() => {
		if (open) setTick((t) => t + 1);
	}, [open]);

	useEffect(() => {
		if (open) play("modalOpen");
	}, [open, play]);

	const localSlots = useMemo(() => listSlots("local"), [tick]);
	const cloudSlots = useMemo(
		() => (user ? listSlots("cloud", user.id) : []),
		[user, tick],
	);

	const closeModal = useCallback(() => {
		play("modalClose");
		onClose();
	}, [onClose, play]);

	const handleDelete = useCallback(
		(e: React.MouseEvent, slot: SaveSlotId) => {
			e.stopPropagation();
			play("uiClick");
			setDeletingSlot(slot);
			setShowDeleteConfirm(true);
		},
		[play],
	);

	const confirmDelete = useCallback(async () => {
		if (!deletingSlot) return;
		play("uiClick");
		setDeleteStatus("loading");
		setDeleteError(null);

		try {
			let success = false;

			if (deletingSlot.scope === "local") {
				deleteSave(deletingSlot);
				success = true;
			} else if (deletingSlot.scope === "cloud" && user) {
				success = await deleteGameSave(user.id, deletingSlot.index);
				if (success) {
					deleteSave(deletingSlot); // remove local mirror
				}
			}

			if (success) {
				setDeleteStatus("success");
				setTick((t) => t + 1);
				// keep modal open briefly to show "Deleted" state
				setTimeout(() => {
					setShowDeleteConfirm(false);
					setDeletingSlot(null);
					setDeleteStatus("idle");
				}, 800);
			} else {
				setDeleteStatus("error");
				setDeleteError("Failed to delete save. Please try again.");
			}
		} catch (err) {
			setDeleteStatus("error");
			setDeleteError(
				err instanceof Error ? err.message : "An error occurred",
			);
		}
	}, [deletingSlot, user, play]);

	const cancelDelete = useCallback(() => {
		if (deleteStatus === "loading") return; // prevent closing during deletion
		play("uiClick");
		setShowDeleteConfirm(false);
		setDeletingSlot(null);
		setDeleteStatus("idle");
		setDeleteError(null);
	}, [play, deleteStatus]);

	if (!open) return null;

	const handleSlot = (slot: SaveSlotId) => {
		if (slot.scope === "cloud" && !isSignedIn) return;
		play("uiClick");
		const existing = readSave(slot);
		if (!existing) {
			writeNewSave(
				slot,
				`${slot.scope === "local" ? "Local" : "Cloud"} Slot ${slot.index}`,
			);
		}
		router.push(
			`/play/singleplayer?scope=${slot.scope}&slot=${slot.index}`,
		);
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
					<h2
						id="singleplayer-modal-title"
						className="text-lg font-semibold text-amber-100"
					>
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
					{/* Local Saves */}
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
										{save && (
											<button
												type="button"
												onClick={(e) =>
													handleDelete(e, slot)
												}
												className="absolute top-2 right-2 z-10 p-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 border border-red-900/50 transition-all shadow-md hover:shadow-red-900/30 opacity-100 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
												aria-label="Delete save"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										)}
										<div className="relative w-full">
											<div className="text-[11px] uppercase tracking-[0.22em] text-amber-400/70">
												Local
											</div>
											<div className="mt-1 font-semibold">{`Slot ${slot.index}`}</div>
										</div>
										<div className="relative w-full text-xs text-amber-200/50 min-h-10 leading-tight">
											{save ? (
												<>
													<div className="text-amber-200/70">
														Continue
													</div>
													<div className="mt-0.5">
														{formatUpdatedAt(
															save.meta.updatedAt,
														)}
													</div>
												</>
											) : (
												<>
													<div>New Game</div>
													<div className="mt-0.5 invisible">
														—
													</div>
												</>
											)}
										</div>
									</button>
								);
							})}
						</div>
					</section>

					{/* Cloud Saves */}
					<section>
						<h3 className="text-xs font-semibold text-amber-400/90 uppercase tracking-wider mb-3">
							Cloud saves
						</h3>
						<div className="grid grid-cols-3 gap-3">
							{(cloudSlots.length
								? cloudSlots
								: listSlots("cloud", "signed-out" as never)
							).map((slot, i) => {
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
										{actual && readSave(actual) && (
											<button
												type="button"
												onClick={(e) =>
													handleDelete(e, actual)
												}
												disabled={
													deleteStatus === "loading"
												}
												className="absolute top-2 right-2 z-10 p-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 border border-red-900/50 transition-all shadow-md hover:shadow-red-900/30 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
												aria-label="Delete save"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										)}
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
													<div className="mt-0.5 invisible">
														—
													</div>
												</>
											) : save ? (
												<>
													<div className="text-amber-200/70">
														Continue
													</div>
													<div className="mt-0.5">
														{formatUpdatedAt(
															save.meta.updatedAt,
														)}
													</div>
												</>
											) : (
												<>
													<div>Empty</div>
													<div className="mt-0.5 invisible">
														—
													</div>
												</>
											)}
										</div>
									</button>
								);
							})}
						</div>
					</section>
				</div>
			</div>

			{/* Delete confirmation modal */}
			{showDeleteConfirm && deletingSlot && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
					onClick={(e) =>
						e.target === e.currentTarget && cancelDelete()
					}
					role="dialog"
					aria-modal="true"
					aria-labelledby="delete-confirm-title"
				>
					<div
						className="w-full max-w-sm rounded-xl border border-red-900/50 bg-[#0d0c0e] shadow-2xl shadow-black/50"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between px-5 py-4 border-b border-red-900/30">
							<h2
								id="delete-confirm-title"
								className="text-lg font-semibold text-red-200"
							>
								{deleteStatus === "loading"
									? "Deleting..."
									: deleteStatus === "error"
										? "Delete Failed"
										: "Delete Save?"}
							</h2>
							<button
								type="button"
								onClick={cancelDelete}
								disabled={deleteStatus === "loading"}
								className="p-1.5 rounded-lg text-amber-200/70 hover:bg-amber-900/30 hover:text-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-600/50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
								aria-label="Cancel"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						<div className="p-5">
							{deleteStatus === "loading" ? (
								<div className="flex items-center justify-center py-4">
									<div className="flex items-center gap-3 text-red-200/80">
										<div className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
										<span>Deleting save...</span>
									</div>
								</div>
							) : deleteStatus === "error" ? (
								<div className="space-y-4">
									<p className="text-sm text-red-300">
										{deleteError}
									</p>
									<div className="flex gap-3">
										<button
											type="button"
											onClick={cancelDelete}
											className="flex-1 py-2.5 rounded-lg border border-amber-900/40 bg-black/30 text-amber-200/80 hover:bg-amber-950/20 transition-colors cursor-pointer"
										>
											Close
										</button>
										<button
											type="button"
											onClick={() => {
												setDeleteStatus("idle");
												setDeleteError(null);
											}}
											className="flex-1 py-2.5 rounded-lg border border-red-900/50 bg-red-950/30 text-red-200 hover:bg-red-900/40 transition-colors cursor-pointer"
										>
											Retry
										</button>
									</div>
								</div>
							) : (
								<>
									<p className="text-sm text-amber-200/70 mb-4">
										Are you sure you want to delete{" "}
										{deletingSlot.scope} save slot{" "}
										{deletingSlot.index}?
										<span className="block mt-1 text-amber-200/50">
											This action cannot be undone.
										</span>
									</p>
									<div className="flex gap-3">
										<button
											type="button"
											onClick={cancelDelete}
											disabled={
												deleteStatus === "loading"
											}
											className="flex-1 py-2.5 rounded-lg border border-amber-900/40 bg-black/30 text-amber-200/80 hover:bg-amber-950/20 transition-colors cursor-pointer"
										>
											Cancel
										</button>
										<button
											type="button"
											onClick={confirmDelete}
											disabled={
												deleteStatus === "loading"
											}
											className="flex-1 py-2.5 rounded-lg border border-red-900/50 bg-red-950/30 text-red-200 hover:bg-red-900/40 transition-colors cursor-pointer"
										>
											Delete
										</button>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
