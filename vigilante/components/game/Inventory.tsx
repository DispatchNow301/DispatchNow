"use client";

import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState,
} from "react";
import { createPortal } from "react-dom";
import type { StaticImageData } from "next/image";
import {
	vigilantes as vigilanteSheets,
	type VigilanteSheet,
} from "@/app/components/data/vigilante";
import { AnimatePresence, motion } from "framer-motion";
import {
	AlertTriangle,
	Ban,
	Check,
	ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
	FaBolt,
	FaBroadcastTower,
	FaFireExtinguisher,
	FaHeart,
	FaMedkit,
	FaSyringe,
	FaUser,
} from "react-icons/fa";
import {
	FaHandcuffs,
	FaRoadBarrier,
	FaSatellite,
	FaScrewdriverWrench,
	FaTruck,
	FaVest,
	FaWalkieTalkie,
} from "react-icons/fa6";

type VigilanteStatus = "available" | "injured" | "unavailable";
type ResourceStatus = "ready" | "cooldown" | "offline";

type VigilanteItem = {
	id: string;
	name: string;
	status: VigilanteStatus;
	/**
	 * Public URL or bundled image `src` (from `vigilante.ts` / `public/characters`).
	 * If missing or load fails, the default user icon is shown.
	 */
	portraitSrc?: string;
};

type ResourceItem = {
	id: string;
	name: string;
	/** One short sentence for hover tooltip only */
	summary: string;
	qty: number;
	status: ResourceStatus;
};

/** Same shape as resources — buffs grid uses qty badge + status the same way */
type BuffItem = {
	id: string;
	name: string;
	summary: string;
	qty: number;
	status: ResourceStatus;
};

type InventoryTab = "vigilantes" | "resources" | "buffs";

function portraitToSrc(portrait: VigilanteSheet["portrait"]): string | undefined {
	if (typeof portrait === "string") return portrait;
	if (
		portrait &&
		typeof portrait === "object" &&
		"src" in portrait &&
		typeof (portrait as StaticImageData).src === "string"
	) {
		return (portrait as StaticImageData).src;
	}
	return undefined;
}

function sheetStatusToGameStatus(s?: string): VigilanteStatus {
	const t = (s ?? "Available").toLowerCase();
	if (t.includes("injur")) return "injured";
	if (
		t.includes("unavail") ||
		t.includes("offline") ||
		t.includes("down")
	) {
		return "unavailable";
	}
	return "available";
}

function sheetToVigilanteItem(s: VigilanteSheet): VigilanteItem {
	return {
		id: s.id,
		name: s.name,
		status: sheetStatusToGameStatus(s.status),
		portraitSrc: portraitToSrc(s.portrait),
	};
}

/** Stable ordering so server + first client paint match (hydration-safe). */
function stableFiveFromSheets(sheets: VigilanteSheet[]): VigilanteItem[] {
	return [...sheets]
		.sort((a, b) => a.id.localeCompare(b.id))
		.slice(0, 5)
		.map(sheetToVigilanteItem);
}

function shufflePickFiveSheets(sheets: VigilanteSheet[]): VigilanteItem[] {
	const copy = [...sheets];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j]!, copy[i]!];
	}
	return copy.slice(0, 5).map(sheetToVigilanteItem);
}

const TAB_ORDER: Record<InventoryTab, number> = {
	vigilantes: 0,
	resources: 1,
	buffs: 2,
};

function vigilanteTooltipSubtitle(status: VigilanteStatus): string {
	if (status === "available") return "Ready to work.";
	if (status === "injured") return "Hurt. Not at full strength.";
	return "Can't be sent out.";
}

/** Neutral tile; status colour only on the small corner circle */
const VIGILANTE_TILE_NEUTRAL =
	"border-amber-900/45 bg-black/35 text-amber-200/85 hover:bg-black/45";

function vigilanteStatusUi(status: VigilanteStatus): {
	badgeClass: string;
	iconClass: string;
	shortLabel: string;
	Icon: LucideIcon;
} {
	switch (status) {
		case "available":
			return {
				badgeClass:
					"border-emerald-700/40 bg-emerald-950/55 shadow-sm shadow-black/50",
				iconClass: "text-emerald-400/80",
				shortLabel: "Ready",
				Icon: Check,
			};
		case "injured":
			return {
				badgeClass:
					"border-rose-700/40 bg-rose-950/55 shadow-sm shadow-black/50",
				iconClass: "text-rose-400/70",
				shortLabel: "Injured",
				Icon: AlertTriangle,
			};
		case "unavailable":
			return {
				badgeClass:
					"border-amber-800/50 bg-amber-950/35 shadow-sm shadow-black/50",
				iconClass: "text-amber-200/60",
				shortLabel: "Unavailable",
				Icon: Ban,
			};
	}
}

/** 1 = tab index increased (panel enters from right); -1 = decreased. Small px slide — no full-width sweep. */
const TAB_SLIDE_PX = 28;

const tabPanelVariants = {
	enter: (dir: number) => ({
		x: dir === 1 ? TAB_SLIDE_PX : -TAB_SLIDE_PX,
		opacity: 0,
	}),
	center: { x: 0, opacity: 1 },
	exit: (dir: number) => ({
		x: dir === 1 ? -TAB_SLIDE_PX : TAB_SLIDE_PX,
		opacity: 0,
	}),
};

type InventoryProps = {
	onHide?: () => void;
};

type InventoryHoverTip =
	| { kind: "v"; item: VigilanteItem; el: HTMLElement }
	| { kind: "r"; item: ResourceItem; el: HTMLElement }
	| { kind: "b"; item: BuffItem; el: HTMLElement };

function VigilantePortrait({
	portraitSrc,
	tileIconClass,
}: {
	portraitSrc?: string;
	tileIconClass: string;
}) {
	const [failed, setFailed] = useState(false);

	// Tab + motion can abort loads; reset so we don’t stay stuck on the fallback.
	useEffect(() => {
		setFailed(false);
	}, [portraitSrc]);

	const showImage = Boolean(portraitSrc) && !failed;

	if (!showImage) {
		return (
			<FaUser className={tileIconClass} aria-hidden />
		);
	}

	/* Native <img>: Next/Image + Framer opacity/transform sometimes leaves a blank layer after tab changes. */
	return (
		<img
			src={portraitSrc}
			alt=""
			loading="eager"
			decoding="async"
			className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-[center_top]"
			onError={() => setFailed(true)}
		/>
	);
}

export default function Inventory({ onHide }: InventoryProps) {
	const [tab, setTab] = useState<InventoryTab>("vigilantes");
	const [slideDir, setSlideDir] = useState<1 | -1>(1);
	const [hoverTip, setHoverTip] = useState<InventoryHoverTip | null>(null);
	const [tipPos, setTipPos] = useState({ left: 0, top: 0 });
	/** Bumps when re-entering the Vigilantes tab so portrait <img> nodes remount (avoids blank tiles after animation). */
	const [vigilantePortraitEpoch, setVigilantePortraitEpoch] = useState(0);

	const updateTipPos = useCallback((el: HTMLElement) => {
		if (!el.isConnected) {
			setHoverTip(null);
			return;
		}
		const r = el.getBoundingClientRect();
		setTipPos({ left: r.left + r.width / 2, top: r.top - 10 });
	}, []);

	useLayoutEffect(() => {
		if (!hoverTip) return;
		updateTipPos(hoverTip.el);
		const onScrollResize = () => updateTipPos(hoverTip.el);
		window.addEventListener("scroll", onScrollResize, true);
		window.addEventListener("resize", onScrollResize);
		return () => {
			window.removeEventListener("scroll", onScrollResize, true);
			window.removeEventListener("resize", onScrollResize);
		};
	}, [hoverTip, updateTipPos]);

	useEffect(() => {
		setHoverTip(null);
	}, [tab]);

	const handleTabChange = (next: InventoryTab) => {
		if (next === tab) return;
		setSlideDir(TAB_ORDER[next] > TAB_ORDER[tab] ? 1 : -1);
		// Must bump in the same commit as `tab` — useEffect ran one frame late, so keys
		// stayed e.g. `*-0` on first paint and matched the initial mount (blank img layer).
		if (next === "vigilantes" && tab !== "vigilantes") {
			setVigilantePortraitEpoch((n) => n + 1);
		}
		setTab(next);
	};

	/** From `vigilante.ts` + `public/characters`. Stable first paint, then random 5 after mount. */
	const [vigilantes, setVigilantes] = useState<VigilanteItem[]>(() =>
		stableFiveFromSheets(vigilanteSheets),
	);

	useEffect(() => {
		setVigilantes(shufflePickFiveSheets(vigilanteSheets));
	}, []);

	const resources: ResourceItem[] = useMemo(
		() => [
			{
				id: "r1",
				name: "First Aid Kit",
				summary: "Treats cuts, burns, and small wounds.",
				qty: 2,
				status: "ready",
			},
			{
				id: "r2",
				name: "Fire Extinguisher",
				summary: "Puts out small fires.",
				qty: 1,
				status: "cooldown",
			},
			{
				id: "r3",
				name: "Walkie-Talkie",
				summary: "Talk to your team by radio.",
				qty: 1,
				status: "ready",
			},
			{
				id: "r4",
				name: "Handcuffs",
				summary: "Locks on someone's wrists.",
				qty: 3,
				status: "ready",
			},
			{
				id: "r5",
				name: "Surveillance Drone",
				summary: "See the area from the air.",
				qty: 1,
				status: "offline",
			},
			{
				id: "r6",
				name: "Protective Gear",
				summary: "Vest and pads so you get hurt less.",
				qty: 2,
				status: "ready",
			},
			{
				id: "r7",
				name: "Barricade Kit",
				summary: "Blocks doors and paths.",
				qty: 1,
				status: "ready",
			},
			{
				id: "r8",
				name: "EpiPen",
				summary: "Shot for a bad allergic reaction.",
				qty: 1,
				status: "ready",
			},
			{
				id: "r9",
				name: "Rescue Tool",
				summary: "Open stuck doors or cut through metal.",
				qty: 1,
				status: "cooldown",
			},
			{
				id: "r10",
				name: "Armored Vehicle",
				summary: "Heavy truck with armor on the sides.",
				qty: 1,
				status: "ready",
			},
		],
		[],
	);

	const buffs: BuffItem[] = useMemo(
		() => [
			{
				id: "b1",
				name: "Noir Focus",
				summary: "Timers tick down more slowly.",
				qty: 1,
				status: "ready",
			},
			{
				id: "b2",
				name: "Street Network",
				summary: "Send help again sooner.",
				qty: 1,
				status: "ready",
			},
			{
				id: "b3",
				name: "Adrenal Surge",
				summary: "Move faster and take hits better for a short time.",
				qty: 1,
				status: "cooldown",
			},
		],
		[],
	);

	const tileIconClass =
		"w-[1.25rem] h-[1.25rem] sm:w-6 sm:h-6 md:w-7 md:h-7";

	/** Larger icons for 5 vigilantes only; same min-height as other tabs so the panel doesn’t jump. */
	const vigilanteTileClass =
		"h-16 w-16 shrink-0 cursor-pointer rounded-3xl border transition-colors sm:h-[4.75rem] sm:w-[4.75rem] md:h-24 md:w-24";

	const vigilantePortraitIconClass =
		"w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 text-amber-200/85";

	/** Two rows of tiles + gap — matches 10-item grids so Buffs (fewer items) doesn’t shrink the panel.
	 *  Equal py clears resource/buff qty (top) and vigilante status (bottom); min-h includes vertical padding (border-box). */
	const inventoryGridClass =
		"grid grid-cols-5 content-start gap-1.5 sm:gap-2.5 py-2 sm:py-2.5 min-h-[calc(6.375rem+1rem)] sm:min-h-[calc(7.625rem+1.25rem)] md:min-h-[calc(8.625rem+1.25rem)]";

	/** `content-center` + `items-center`: vigilante row sits vertically centered in the panel (same min-h as other tabs). */
	const vigilanteGridClass =
		"grid grid-cols-5 content-center items-center justify-items-center gap-2.5 sm:gap-3.5 py-2 sm:py-2.5 min-h-[calc(6.375rem+1rem)] sm:min-h-[calc(7.625rem+1.25rem)] md:min-h-[calc(8.625rem+1.25rem)]";

	const showVigilanteTip = (
		e: React.MouseEvent<HTMLElement>,
		item: VigilanteItem,
	) => {
		const el = e.currentTarget;
		const r = el.getBoundingClientRect();
		setTipPos({ left: r.left + r.width / 2, top: r.top - 10 });
		setHoverTip({ kind: "v", item, el });
	};

	const showResourceTip = (
		e: React.MouseEvent<HTMLElement>,
		item: ResourceItem,
	) => {
		const el = e.currentTarget;
		const r = el.getBoundingClientRect();
		setTipPos({ left: r.left + r.width / 2, top: r.top - 10 });
		setHoverTip({ kind: "r", item, el });
	};

	const showBuffTip = (
		e: React.MouseEvent<HTMLElement>,
		item: BuffItem,
	) => {
		const el = e.currentTarget;
		const r = el.getBoundingClientRect();
		setTipPos({ left: r.left + r.width / 2, top: r.top - 10 });
		setHoverTip({ kind: "b", item, el });
	};

	const hideInventoryTip = () => setHoverTip(null);

	const resourceIcon = (id: ResourceItem["id"]) => {
		const cls = tileIconClass;
		if (id === "r1") return <FaMedkit className={cls} aria-hidden />;
		if (id === "r2")
			return <FaFireExtinguisher className={cls} aria-hidden />;
		if (id === "r3")
			return <FaWalkieTalkie className={cls} aria-hidden />;
		if (id === "r4") return <FaHandcuffs className={cls} aria-hidden />;
		if (id === "r5") return <FaSatellite className={cls} aria-hidden />;
		if (id === "r6") return <FaVest className={cls} aria-hidden />;
		if (id === "r7") return <FaRoadBarrier className={cls} aria-hidden />;
		if (id === "r8") return <FaSyringe className={cls} aria-hidden />;
		if (id === "r9")
			return <FaScrewdriverWrench className={cls} aria-hidden />;
		return <FaTruck className={cls} aria-hidden />;
	};

	const buffIcon = (id: BuffItem["id"]) => {
		const cls = tileIconClass;
		if (id === "b1") return <FaBolt className={cls} aria-hidden />;
		if (id === "b2")
			return <FaBroadcastTower className={cls} aria-hidden />;
		return <FaHeart className={cls} aria-hidden />;
	};

	return (
		<div className="pointer-events-none w-full px-4 py-2">
			<div className="pointer-events-auto mx-auto max-w-5xl overflow-hidden rounded-2xl border border-amber-900/40 bg-black/55 backdrop-blur-md shadow-2xl shadow-black/60">
				{onHide && (
					<button
						type="button"
						onClick={onHide}
						className="flex w-full cursor-pointer items-center justify-center gap-2 border-b border-amber-900/40 bg-black/70 px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-amber-200/65 transition-colors hover:bg-black/60 hover:text-amber-100"
						aria-label="Hide inventory"
					>
						<span className="select-none">Hide inventory</span>
						<ChevronDown
							className="h-4 w-4 shrink-0 text-amber-200/80"
							strokeWidth={2.25}
							aria-hidden
						/>
					</button>
				)}

				<div className="flex items-center gap-3 border-b border-amber-900/40 px-4 py-3">
					<div
						className="inline-flex items-center rounded-xl border border-amber-900/50 bg-black/30 p-1"
						role="tablist"
						aria-label="Inventory section"
					>
						<button
							id="inventory-tab-vigilantes"
							type="button"
							role="tab"
							aria-selected={tab === "vigilantes"}
							onClick={() => handleTabChange("vigilantes")}
							className={`px-3.5 py-2 rounded-lg text-[11px] sm:px-4 sm:py-2.5 sm:text-xs uppercase tracking-[0.16em] cursor-pointer transition-colors ${
								tab === "vigilantes"
									? "bg-amber-900/45 text-amber-100 border border-amber-500/40"
									: "text-amber-200/60 hover:text-amber-100"
							}`}
						>
							Vigilantes
						</button>
						<span
							className="mx-0.5 h-5 w-px shrink-0 bg-amber-200/5 sm:h-6"
							aria-hidden
						/>
						<button
							id="inventory-tab-resources"
							type="button"
							role="tab"
							aria-selected={tab === "resources"}
							onClick={() => handleTabChange("resources")}
							className={`px-3.5 py-2 rounded-lg text-[11px] sm:px-4 sm:py-2.5 sm:text-xs uppercase tracking-[0.16em] cursor-pointer transition-colors ${
								tab === "resources"
									? "bg-amber-900/45 text-amber-100 border border-amber-500/40"
									: "text-amber-200/60 hover:text-amber-100"
							}`}
						>
							Resources
						</button>
						<span
							className="mx-0.5 h-5 w-px shrink-0 bg-amber-200/5 sm:h-6"
							aria-hidden
						/>
						<button
							id="inventory-tab-buffs"
							type="button"
							role="tab"
							aria-selected={tab === "buffs"}
							onClick={() => handleTabChange("buffs")}
							className={`px-3.5 py-2 rounded-lg text-[11px] sm:px-4 sm:py-2.5 sm:text-xs uppercase tracking-[0.16em] cursor-pointer transition-colors ${
								tab === "buffs"
									? "bg-amber-900/45 text-amber-100 border border-amber-500/40"
									: "text-amber-200/60 hover:text-amber-100"
							}`}
						>
							Buffs
						</button>
					</div>
				</div>

				<div className="relative px-3 py-3">
					{/* Grid stack: exiting + entering panels share one cell so sync mode doesn’t leave a blank gap.
					    Equal py/px inset so resource/buff qty & vigilante status badges aren’t clipped */}
					<div className="grid grid-cols-1 overflow-hidden px-1 py-2.5 *:col-start-1 *:row-start-1 *:min-w-0 sm:px-1.5 sm:py-3">
						<AnimatePresence
							initial={false}
							mode="sync"
							custom={slideDir}
						>
							<motion.div
								key={tab}
								role="tabpanel"
								aria-labelledby={`inventory-tab-${tab}`}
								custom={slideDir}
								variants={tabPanelVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{
									// Spring for position — soft settle, no bounce
									x: {
										type: "spring",
										stiffness: 260,
										damping: 52,
										mass: 0.95,
									},
									// Tween for opacity — smooth fade (springs can wobble opacity)
									opacity: {
										duration: 0.4,
										ease: [0.22, 1, 0.36, 1],
									},
								}}
								className="col-start-1 row-start-1 w-full min-w-0 will-change-transform"
							>
								{tab === "vigilantes" ? (
									<div className={vigilanteGridClass}>
										{vigilantes.map((v) => {
											const st = vigilanteStatusUi(v.status);
											const StatusIcon = st.Icon;
											return (
												<div
													key={v.id}
													className="relative flex min-w-0 items-center justify-center"
												>
													<div
														className={`group relative flex items-center justify-center ${vigilanteTileClass} ${VIGILANTE_TILE_NEUTRAL}`}
														aria-label={`${v.name}, ${st.shortLabel}`}
														onMouseEnter={(e) =>
															showVigilanteTip(e, v)
														}
														onMouseLeave={
															hideInventoryTip
														}
													>
														<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-3xl">
															<div className="relative flex h-full w-full items-center justify-center">
																<VigilantePortrait
																	key={`${v.id}-${vigilantePortraitEpoch}`}
																	portraitSrc={
																		v.portraitSrc
																	}
																	tileIconClass={
																		vigilantePortraitIconClass
																	}
																/>
															</div>
														</div>

														<div
															className={`absolute -right-1 -bottom-1 z-10 flex size-6 shrink-0 items-center justify-center rounded-full border sm:size-7 ${st.badgeClass}`}
															aria-hidden
															title={st.shortLabel}
														>
															<StatusIcon
																className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${st.iconClass}`}
																strokeWidth={2.75}
															/>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								) : tab === "resources" ? (
									<div className={inventoryGridClass}>
										{resources.map((r) => (
											<div
												key={r.id}
												className="relative flex min-w-0 justify-center"
											>
												<div
													className="group relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-amber-900/45 bg-black/35 text-amber-200/85 transition-colors hover:bg-black/45 sm:h-14 sm:w-14 md:h-16 md:w-16"
													aria-label={r.name}
													onMouseEnter={(e) =>
														showResourceTip(e, r)
													}
													onMouseLeave={hideInventoryTip}
												>
													{resourceIcon(r.id)}

													<div
														className={`absolute -top-1 -left-1 flex size-6 shrink-0 items-center justify-center rounded-full border border-amber-900/60 bg-black/80 text-[10px] font-semibold tabular-nums leading-none ${
															r.qty > 0
																? "text-amber-100/90"
																: "text-amber-200/45"
														}`}
														aria-hidden
													>
														{r.qty}
													</div>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className={inventoryGridClass}>
										{buffs.map((b) => (
											<div
												key={b.id}
												className="relative flex min-w-0 justify-center"
											>
												<div
													className="group relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-amber-900/45 bg-black/35 text-amber-200/85 transition-colors hover:bg-black/45 sm:h-14 sm:w-14 md:h-16 md:w-16"
													aria-label={b.name}
													onMouseEnter={(e) =>
														showBuffTip(e, b)
													}
													onMouseLeave={hideInventoryTip}
												>
													{buffIcon(b.id)}

													<div
														className={`absolute -top-1 -left-1 flex size-6 shrink-0 items-center justify-center rounded-full border border-amber-900/60 bg-black/80 text-[10px] font-semibold tabular-nums leading-none ${
															b.qty > 0
																? "text-amber-100/90"
																: "text-amber-200/45"
														}`}
														aria-hidden
													>
														{b.qty}
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</div>

			{typeof document !== "undefined" &&
				hoverTip &&
				createPortal(
					<div
						role="tooltip"
						className="pointer-events-none fixed z-99999 max-w-[min(320px,calc(100vw-2rem))] min-w-0 rounded-xl border border-amber-900/45 bg-black/80 px-3 py-2 shadow-xl shadow-black/60 backdrop-blur-md"
						style={{
							left: tipPos.left,
							top: tipPos.top,
							transform: "translate(-50%, -100%)",
						}}
					>
						{hoverTip.kind === "v" && (
							<div className="min-w-0 text-[11px] leading-tight">
								<div className="font-semibold text-amber-100/95">
									{hoverTip.item.name}
								</div>
								<div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-amber-300/75">
									{vigilanteStatusUi(hoverTip.item.status).shortLabel}
								</div>
								<p className="mt-1 min-w-0 truncate text-[11px] text-amber-200/70">
									{vigilanteTooltipSubtitle(hoverTip.item.status)}
								</p>
							</div>
						)}
						{hoverTip.kind === "r" && (
							<div className="min-w-0 text-[11px] leading-tight">
								<div className="font-semibold text-amber-100/95">
									{hoverTip.item.name}
								</div>
								<p className="mt-1 min-w-0 truncate text-[11px] text-amber-200/70">
									{hoverTip.item.summary}
								</p>
							</div>
						)}
						{hoverTip.kind === "b" && (
							<div className="min-w-0 text-[11px] leading-tight">
								<div className="font-semibold text-amber-100/95">
									{hoverTip.item.name}
								</div>
								<p className="mt-1 min-w-0 truncate text-[11px] text-amber-200/70">
									{hoverTip.item.summary}
								</p>
							</div>
						)}
					</div>,
					document.body,
				)}
		</div>
	);
}
