"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Copy, Loader2 } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { listSlots, readSave, writeNewSave, type SaveSlotId } from "../../lib/saves";
import {
	createMultiplayerSession,
	addPlayerToSession,
	getSessionByJoinCode,
	getSessionPlayers,
} from "../../lib/multiplayer";
import { useSfx } from "../../lib/sfx";

export type MultiplayerTab = "load" | "create" | "join";

export interface MultiplayerModalProps {
	open: boolean;
	onClose: () => void;
	isSignedIn: boolean;
}

function generateJoinCode() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

function formatUpdatedAt(ts: number) {
	const d = new Date(ts);
	return d.toLocaleString(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function MultiplayerModal({ open, onClose, isSignedIn }: MultiplayerModalProps) {
	const router = useRouter();
	const { user } = useAuth();
	const { play } = useSfx();
	const [tab, setTab] = useState<MultiplayerTab>("load");
	const [joinCode, setJoinCode] = useState("");
	const [generatedCode, setGeneratedCode] = useState("");
	const [copied, setCopied] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedSlot, setSelectedSlot] = useState<SaveSlotId | null>(null);
	const [tick, setTick] = useState(0);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (open) {
			setTick((t) => t + 1);
			setTab("load");
			setSelectedSlot(null);
			setJoinCode("");
			setGeneratedCode("");
			setCopied(false);
			setLoading(false);
			setErrorMessage("");
		}
	}, [open]);

	useEffect(() => {
		if (open) play("modalOpen");
	}, [open, play]);

	const closeModal = useCallback(() => {
		play("modalClose");
		onClose();
	}, [onClose, play]);

	const saveSlots = useMemo(() => {
		const local = listSlots("local").map((slot) => ({ slot, label: `Local ${slot.index}` }));
		const cloud =
			user ? listSlots("cloud", user.id).map((slot) => ({ slot, label: `Cloud ${slot.index}` })) : [];
		return [...local, ...cloud];
	}, [user, tick]);

	if (!open) return null;

	const handleGenerateCode = () => {
		play("uiClick");
		setLoading(true);
		setTimeout(() => {
			setGeneratedCode(generateJoinCode());
			setLoading(false);
		}, 450);
	};

	const copyCode = async () => {
		if (!generatedCode) return;
		play("uiClick");
		await navigator.clipboard.writeText(generatedCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const ensureSlot = (slot: SaveSlotId) => {
		const existing = readSave(slot);
		if (!existing) writeNewSave(slot, `${slot.scope === "local" ? "Local" : "Cloud"} Slot ${slot.index}`);
		return slot;
	};

	const startFromSlot = (slot: SaveSlotId) => {
		if (!isSignedIn) return;
		play("uiClick");
		ensureSlot(slot);
    setSelectedSlot(slot);
    setTab("create");
    setErrorMessage("Select this save and generate a code to create a multiplayer session.");
    };

    const createGame = async () => {
      if (!isSignedIn || !selectedSlot || !user) return;

      if (!generatedCode) {
        setErrorMessage("Generate a join code first.");
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");
        play?.("uiClick");
        ensureSlot(selectedSlot);

        const session = await createMultiplayerSession({
          joinCode: generatedCode,
          hostUserId: user.id,
          saveScope: selectedSlot.scope,
          saveSlot: selectedSlot.index,
        });

        await addPlayerToSession(session.id, user.id, true);

        router.push(
          `/play/multiplayer?mode=create&sessionId=${session.id}&code=${generatedCode}`
        );
        onClose();
      } catch (error) {
        console.error("Failed to create multiplayer session:", error);
        setErrorMessage("Could not create multiplayer session. Try another code.");
      } finally {
        setLoading(false);
      }
    };

    const joinGame = async () => {
      if (!isSignedIn || joinCode.length !== 6 || !user) return;

      try {
        setLoading(true);
        setErrorMessage("");
        play?.("uiClick");

        const session = await getSessionByJoinCode(joinCode);
        if (!session) {
          setErrorMessage("No multiplayer session found for that code.");
          return;
        }

        const existingPlayers = await getSessionPlayers(session.id);
        const alreadyJoined = existingPlayers.some(
          (player) => player.user_id === user.id
        );
        const isFull = existingPlayers.length >= 2 && !alreadyJoined;

        if (isFull) {
          setErrorMessage("That multiplayer session is already full.");
          return;
        }

        if (!alreadyJoined) {
          await addPlayerToSession(session.id, user.id, false);
        }

        router.push(
          `/play/multiplayer?mode=join&sessionId=${session.id}&code=${joinCode}`
        );
        onClose();
      } catch (error) {
        console.error("Failed to join multiplayer session:", error);
        setErrorMessage("Could not join multiplayer session.");
      } finally {
        setLoading(false);
      }
    };

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm opacity-100 transition-opacity duration-200"
			onClick={(e) => e.target === e.currentTarget && closeModal()}
			role="dialog"
			aria-modal="true"
			aria-labelledby="multiplayer-modal-title"
		>
			<div
				className="w-full max-w-md rounded-xl border border-amber-900/50 bg-[#0d0c0e] shadow-2xl shadow-black/50"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between px-5 py-4 border-b border-amber-900/30">
					<h2 id="multiplayer-modal-title" className="text-lg font-semibold text-amber-100">
						Multiplayer
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

				<div className="flex border-b border-amber-900/30">
					{(["load", "create", "join"] as const).map((t) => (
						<button
							key={t}
							type="button"
							onClick={() => {
								setTab(t);
								setErrorMessage("");
								play("uiClick");
							}}
							className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
								tab === t
									? "text-amber-400 border-b-2 border-amber-500 bg-amber-950/20"
									: "text-amber-200/60 hover:text-amber-200/90"
							}`}
						>
							{t === "load" ? "Load save" : t === "create" ? "Create game" : "Join game"}
						</button>
					))}
				</div>

				<div className="p-5 space-y-4">
					{errorMessage && (
						<div className="rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-2 text-sm text-red-300">
							{errorMessage}
						</div>
					)}

					{tab === "load" && (
						<>
							<p className="text-sm text-amber-200/70">Choose a save to continue in multiplayer.</p>
							<div className="grid grid-cols-2 gap-2">
								{saveSlots.map(({ slot, label }) => {
									const save = readSave(slot);
									const active =
										selectedSlot?.scope === slot.scope &&
										selectedSlot?.index === slot.index &&
										selectedSlot?.userId === slot.userId;
									return (
										<button
											key={`${slot.scope}-${slot.userId ?? "local"}-${slot.index}`}
											type="button"
											onClick={() => {
												play("uiClick");
												setSelectedSlot(slot);
											}}
											className={`group relative overflow-hidden flex flex-col items-start justify-between py-4 px-4 rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-600/40 ${
												active
													? "border-amber-500/80 bg-linear-to-b from-amber-950/35 to-black/25 shadow-lg shadow-black/35"
													: "border-amber-900/40 bg-linear-to-b from-black/40 to-black/20 hover:border-amber-700/50 hover:shadow-lg hover:shadow-black/30"
											} text-amber-200/85 min-h-[104px]`}
										>
											<div
												className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
												style={{
													background:
														"radial-gradient(650px circle at 15% 25%, rgba(200,160,90,0.08), transparent 45%), radial-gradient(500px circle at 80% 70%, rgba(200,160,90,0.05), transparent 45%)",
												}}
												aria-hidden
											/>
											<div className="relative">
												<div className="text-[11px] uppercase tracking-[0.22em] text-amber-400/70">
													{slot.scope}
												</div>
												<div className="mt-1 font-semibold">{label}</div>
											</div>
											<div className="relative text-xs text-amber-200/50 min-h-10">
												{save ? (
													<>
														<div className="text-amber-200/70">Continue</div>
														<div className="mt-0.5">{formatUpdatedAt(save.meta.updatedAt)}</div>
													</>
												) : (
													<>
														<div>Empty</div>
														<div className="mt-0.5 opacity-0">—</div>
													</>
												)}
											</div>
										</button>
									);
								})}
							</div>
							<button
								type="button"
								disabled={!selectedSlot}
								onClick={() => selectedSlot && startFromSlot(selectedSlot)}
								className="w-full py-3 rounded-lg border border-amber-700/50 bg-amber-950/30 text-amber-200 font-medium hover:bg-amber-900/40 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
							>
								Use selected save
							</button>
						</>
					)}

					{tab === "create" && (
						<>
							<p className="text-sm text-amber-200/70">
								Generate a code and share it with your friend.
							</p>
							<div className="space-y-2">
								<p className="text-xs text-amber-200/50">
									Save source:{" "}
									<span className="text-amber-200/80">
										{selectedSlot ? `${selectedSlot.scope} ${selectedSlot.index}` : "Select one in Load save"}
									</span>
								</p>
								<button
									type="button"
									onClick={handleGenerateCode}
									disabled={loading}
									className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-amber-700/50 bg-amber-950/30 text-amber-200 font-medium hover:bg-amber-900/40 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate code"}
								</button>
								{generatedCode && (
									<div className="flex items-center gap-2 p-3 rounded-lg bg-black/40 border border-amber-900/40">
										<code className="flex-1 text-center text-xl font-mono tracking-[0.3em] text-amber-300">
											{generatedCode}
										</code>
										<button
											type="button"
											onClick={copyCode}
											className="p-2 rounded-lg text-amber-200/80 hover:bg-amber-900/30 transition-colors cursor-pointer"
											aria-label="Copy code"
										>
											<Copy className="w-5 h-5" />
										</button>
									</div>
								)}
								{copied && <p className="text-xs text-amber-400">Code copied to clipboard.</p>}
							</div>
							<button
								type="button"
								onClick={createGame}
								disabled={!selectedSlot || !generatedCode}
								className="w-full py-3 rounded-lg border border-amber-700/50 bg-amber-950/30 text-amber-200 font-medium hover:bg-amber-900/40 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
							>
								Create game
							</button>
						</>
					)}

					{tab === "join" && (
						<>
							<p className="text-sm text-amber-200/70">Enter the code from your friend&apos;s game.</p>
							<input
								type="text"
								value={joinCode}
								onChange={(e) =>
									setJoinCode(
										e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)
									)
								}
								placeholder="XXXXXX"
								className="w-full px-4 py-3 rounded-lg border border-amber-900/50 bg-black/40 text-amber-100 font-mono text-center text-lg tracking-[0.3em] placeholder:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-600/50"
								maxLength={6}
							/>
							<button
								type="button"
								disabled={joinCode.length !== 6}
								onClick={joinGame}
								className="w-full py-3 rounded-lg border border-amber-700/50 bg-amber-950/30 text-amber-200 font-medium hover:bg-amber-900/40 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
							>
								Join game
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

