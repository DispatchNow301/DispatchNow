"use client";

import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { User, X } from "lucide-react";
import type { VigilanteSheet } from "@/app/components/data/vigilante";
import { portraitToSrc } from "@/lib/vigilantePortrait";
import { BASE_RESOURCES } from "@/components/game/Inventory";
import { ResourceGearIcon } from "@/components/game/ResourceGearIcon";
import { IncidentTimerBar } from "@/components/game/IncidentTimerBar";
import { formatIncidentTypeLabel } from "@/lib/formatIncidentTitle";
import type { IncidentArchetype } from "@/lib/incidentTemplates";
import {
	canStageDeployment,
	type ResourcePoolEntry,
} from "@/lib/resourcePool";
import { isVigilanteRecovering } from "@/lib/vigilanteInjury";

const EMPTY_INJURY: Record<string, number> = {};

function CrewPortraitThumb({
	portrait,
}: {
	portrait: VigilanteSheet["portrait"];
}) {
	const [failed, setFailed] = useState(false);
	const src = portraitToSrc(portrait);

	useEffect(() => {
		setFailed(false);
	}, [src]);

	const show = Boolean(src) && !failed;

	return (
		<div
			className="relative h-full w-full shrink-0 overflow-hidden rounded-[inherit] bg-black/45"
			aria-hidden
		>
			{show ? (
				<img
					src={src}
					alt=""
					loading="lazy"
					decoding="async"
					className="h-full w-full object-cover object-[center_top]"
					onError={() => setFailed(true)}
				/>
			) : (
				<div className="flex h-full w-full items-center justify-center text-amber-500/45">
					<User className="h-9 w-9" strokeWidth={1.5} />
				</div>
			)}
		</div>
	);
}

function flattenCounts(c: Record<string, number>): string[] {
	const out: string[] = [];
	for (const [id, n] of Object.entries(c)) {
		for (let i = 0; i < n; i++) out.push(id);
	}
	return out;
}

export type DeployPayload = {
	vigilanteIds: string[];
	resourceIds: string[];
};

type Props = {
	open: boolean;
	incident: {
		id: string;
		category: IncidentArchetype;
		typeLabel: string;
		summary: string;
		createdAt: number;
		expiresAt: number;
	} | null;
	ownedVigilanteIds: string[];
	/** Recovering vigilantes cannot be selected. */
	vigilanteInjuryUntil?: Record<string, number>;
	vigilanteSheets: VigilanteSheet[];
	resourcePool: Record<string, ResourcePoolEntry>;
	onClose: () => void;
	/** When the incident timer runs out (same as list / map expiry). */
	onIncidentExpire?: () => void;
	onConfirm: (payload: DeployPayload) => void;
};

export default function IncidentDeployModal({
	open,
	incident,
	ownedVigilanteIds,
	vigilanteInjuryUntil,
	vigilanteSheets,
	resourcePool,
	onClose,
	onIncidentExpire,
	onConfirm,
}: Props) {
	const injury = vigilanteInjuryUntil ?? EMPTY_INJURY;
	const [now, setNow] = useState(() => Date.now());
	useEffect(() => {
		const id = window.setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(id);
	}, []);

	const recovering = useCallback(
		(id: string) => isVigilanteRecovering(now, injury, id),
		[now, injury],
	);

	const [vigSet, setVigSet] = useState<Set<string>>(new Set());
	const [resCounts, setResCounts] = useState<Record<string, number>>({});

	/** Only depends on roster + injury map — NOT on `now` — so we don't re-run every second and wipe crew/gear. */
	const reset = useCallback(() => {
		const sorted = [...new Set(ownedVigilanteIds)].sort((a, b) =>
			a.localeCompare(b),
		);
		const t = Date.now();
		const first = sorted.find(
			(id) => !isVigilanteRecovering(t, injury, id),
		);
		if (first) setVigSet(new Set([first]));
		else setVigSet(new Set());
		setResCounts({});
	}, [ownedVigilanteIds, injury]);

	useEffect(() => {
		if (open && incident) reset();
	}, [open, incident?.id, reset]);

	const resourceIds = useMemo(() => flattenCounts(resCounts), [resCounts]);

	const canSend = useMemo(() => {
		if (!incident) return false;
		if (vigSet.size < 1) return false;
		for (const id of vigSet) {
			if (recovering(id)) return false;
		}
		if (!canStageDeployment(resourcePool, resourceIds)) return false;
		return true;
	}, [incident, vigSet, resourcePool, resourceIds, recovering]);

	const ownedVigs = useMemo(() => {
		const byId = new Map(vigilanteSheets.map((v) => [v.id, v]));
		const sortedIds = [...new Set(ownedVigilanteIds)].sort((a, b) =>
			a.localeCompare(b),
		);
		return sortedIds
			.map((id) => byId.get(id))
			.filter((v): v is VigilanteSheet => v != null);
	}, [ownedVigilanteIds, vigilanteSheets]);

	const toggleVig = (id: string) => {
		if (recovering(id)) return;
		setVigSet((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				if (next.size <= 1) return prev;
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

	/** Drop injured crew and ensure ≥1 deployable; only update React state when the set actually changes (avoids fighting user clicks every tick). */
	useEffect(() => {
		if (!open || !incident) return;
		setVigSet((prev) => {
			const next = new Set(
				[...prev].filter(
					(id) => !isVigilanteRecovering(now, injury, id),
				),
			);
			if (next.size === 0) {
				const sorted = [...new Set(ownedVigilanteIds)].sort((a, b) =>
					a.localeCompare(b),
				);
				const first = sorted.find(
					(id) => !isVigilanteRecovering(now, injury, id),
				);
				if (first) next.add(first);
			}
			if (
				prev.size === next.size &&
				[...prev].every((id) => next.has(id))
			) {
				return prev;
			}
			return next;
		});
	}, [open, incident?.id, now, ownedVigilanteIds, injury]);

	const bumpRes = (resourceId: string, delta: 1 | -1) => {
		setResCounts((prev) => {
			const pool = resourcePool[resourceId];
			if (!pool) return prev;
			const avail = pool.qty - pool.deployed;
			const cur = prev[resourceId] ?? 0;
			const next = Math.max(0, Math.min(avail, cur + delta));
			if (next === 0) {
				const { [resourceId]: _, ...rest } = prev;
				return rest;
			}
			return { ...prev, [resourceId]: next };
		});
	};

	/** Larger glyphs; tile size stays the same (grid `aspect-square`). */
	const gearIconClass =
		"h-9 w-9 text-amber-200/90 sm:h-10 sm:w-10";

	const handleGearContextMenu = (
		e: MouseEvent,
		resourceId: string,
		n: number,
	) => {
		e.preventDefault();
		if (n > 0) bumpRes(resourceId, -1);
	};

	const handleGearTileClick = (
		e: MouseEvent,
		resourceId: string,
		avail: number,
		n: number,
	) => {
		if (e.shiftKey) {
			if (n > 0) bumpRes(resourceId, -1);
			return;
		}
		if (n < avail) bumpRes(resourceId, 1);
	};

	const handleConfirm = () => {
		if (!incident || !canSend) return;
		onConfirm({
			vigilanteIds: [...vigSet],
			resourceIds,
		});
	};

	if (typeof document === "undefined") return null;

	return createPortal(
		<AnimatePresence>
			{open && incident ? (
				<motion.div
					className="fixed inset-0 z-[2700] flex items-center justify-center p-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.18 }}
				>
					<button
						type="button"
						className="absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-[2px]"
						aria-label="Close"
						onClick={onClose}
					/>
					<motion.div
						role="dialog"
						aria-modal
						aria-labelledby="deploy-modal-title"
						initial={{ opacity: 0, y: 10, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 8, scale: 0.99 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-amber-900/45 bg-[#0a0908]/95 text-amber-100 shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-start justify-between gap-3 border-b border-amber-900/35 px-5 py-4">
							<div className="min-w-0">
								<p
									id="deploy-modal-title"
									className="text-[11px] font-medium uppercase tracking-[0.2em] text-amber-500/75"
								>
									Dispatch
								</p>
								<h2 className="mt-1.5 truncate text-lg font-semibold text-amber-50">
									{formatIncidentTypeLabel(incident.typeLabel)}
								</h2>
								<p className="mt-2 line-clamp-3 text-sm leading-relaxed text-amber-200/65">
									{incident.summary}
								</p>
								<IncidentTimerBar
									key={incident.id}
									createdAt={incident.createdAt}
									expiresAt={incident.expiresAt}
									onExpire={() => {
										onIncidentExpire?.();
									}}
								/>
							</div>
							<button
								type="button"
								onClick={onClose}
								className="shrink-0 cursor-pointer rounded-lg border border-amber-900/40 p-2 text-amber-400/80 transition hover:border-amber-700/50 hover:text-amber-100"
							>
								<X className="h-4 w-4" strokeWidth={2} />
							</button>
						</div>

						<div className="space-y-4 px-5 py-4">
							<section>
								<h3 className="text-xs font-medium text-amber-400/90">
									Crew
								</h3>
								{ownedVigs.length === 0 ? (
									<p className="mt-2 text-sm text-amber-200/45">
										No one on roster. Hire vigilantes first.
									</p>
								) : (
									<div className="mt-3 flex flex-wrap gap-2.5">
										{ownedVigs.map((v, i) => {
											const on = vigSet.has(v.id);
											const inj = recovering(v.id);
											return (
												<button
													key={v.id}
													type="button"
													aria-label={`Crew ${i + 1}${inj ? ", recovering" : ""}`}
													aria-pressed={on}
													aria-disabled={inj}
													disabled={inj}
													onClick={() => toggleVig(v.id)}
													className={[
														"relative flex h-[4.75rem] w-[4.75rem] shrink-0 overflow-hidden rounded-2xl border transition select-none sm:h-[5.25rem] sm:w-[5.25rem]",
														inj
															? "cursor-not-allowed border-rose-900/40 bg-black/25 opacity-50 grayscale"
															: [
																	"cursor-pointer",
																	on
																		? "border-amber-500/55 bg-amber-950/50 shadow-md shadow-amber-950/35 ring-2 ring-amber-500/25"
																		: "border-amber-900/45 bg-black/35 hover:border-amber-700/45 hover:bg-black/45",
																].join(" "),
													].join(" ")}
												>
													<CrewPortraitThumb portrait={v.portrait} />
													{inj ? (
														<span className="pointer-events-none absolute inset-x-0 bottom-0 bg-rose-950/80 py-0.5 text-center text-[9px] font-medium uppercase tracking-wide text-rose-200/90">
															Injured
														</span>
													) : null}
												</button>
											);
										})}
									</div>
								)}
							</section>

							<section>
								<h3 className="text-xs font-medium text-amber-400/90">
									Gear
								</h3>
								<p className="sr-only">
									Staging count is top left, available at base is top right.
									Click to add one up to available; Shift+click or right‑click to
									remove one.
								</p>
								<div className="mt-3 grid grid-cols-5 gap-2">
									{BASE_RESOURCES.map((r) => {
										const pool = resourcePool[r.id];
										const avail = pool
											? Math.max(0, pool.qty - pool.deployed)
											: 0;
										const n = resCounts[r.id] ?? 0;
										const empty = avail <= 0;
										return (
											<button
												key={r.id}
												type="button"
												aria-label={`${r.name}: ${n} staging, ${avail} available. Click +1, Shift+click or right‑click −1.`}
												disabled={empty}
												onClick={(e) =>
													handleGearTileClick(
														e,
														r.id,
														avail,
														n,
													)
												}
												onContextMenu={(e) =>
													handleGearContextMenu(
														e,
														r.id,
														n,
													)
												}
												className={[
													"group relative flex aspect-square min-h-0 min-w-0 cursor-pointer select-none items-center justify-center rounded-2xl border text-amber-200/90 transition",
													empty
														? "cursor-not-allowed border-amber-900/25 bg-black/20 opacity-40"
														: n > 0
															? "border-amber-500/45 bg-amber-950/35 shadow-sm shadow-black/40 hover:border-amber-500/60 hover:bg-amber-950/45"
															: "border-amber-900/45 bg-black/35 hover:border-amber-700/45 hover:bg-black/45",
												].join(" ")}
											>
												<ResourceGearIcon
													resourceId={r.id}
													className={gearIconClass}
												/>
												<span
													className={[
														"pointer-events-none absolute left-0.5 top-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[9px] font-semibold tabular-nums leading-none shadow ring-1 ring-black/35",
														n > 0
															? "border-amber-400/50 bg-amber-950/95 text-amber-50"
															: "border-amber-800/55 bg-black/90 text-amber-200/60",
													].join(" ")}
													aria-hidden
												>
													{n}
												</span>
												<span
													className="pointer-events-none absolute right-0.5 top-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-amber-800/50 bg-black/90 text-[9px] font-medium tabular-nums leading-none text-amber-100/90 shadow ring-1 ring-black/35"
													aria-hidden
												>
													{avail}
												</span>
											</button>
										);
									})}
								</div>
							</section>
						</div>

						<div className="flex items-center justify-end gap-2 border-t border-amber-900/35 bg-black/30 px-5 py-4">
							<button
								type="button"
								onClick={onClose}
								className="cursor-pointer rounded-lg border border-amber-900/45 px-4 py-2 text-sm text-amber-200/75 transition hover:border-amber-700/50 hover:text-amber-50"
							>
								Cancel
							</button>
							<button
								type="button"
								disabled={!canSend}
								onClick={handleConfirm}
								className="cursor-pointer rounded-lg border border-amber-600/55 bg-amber-950/40 px-5 py-2 text-sm font-medium text-amber-50 transition hover:bg-amber-900/35 disabled:cursor-not-allowed disabled:opacity-35"
							>
								Deploy
							</button>
						</div>
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>,
		document.body,
	);
}
