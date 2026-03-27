"use client";

import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState,
} from "react";
import { createPortal } from "react-dom";
import {
	vigilantes as vigilanteSheets,
	type VigilanteSheet,
} from "@/app/components/data/vigilante";
import { portraitToSrc } from "@/lib/vigilantePortrait";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Ban, Check, ChevronDown, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
	FaBolt,
	FaBroadcastTower,
	FaHeart,
	FaShieldAlt,
	FaBullseye,
	FaDollarSign,
	FaUser,
} from "react-icons/fa";
import type { ResourcePoolEntry } from "@/lib/resourcePool";
import { ResourceGearIcon } from "@/components/game/ResourceGearIcon";
import { SHOP_RESOURCES, SHOP_UPGRADES } from "@/lib/shopCatalog";

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
	/** When set, post-incident injury recovery — cannot deploy until this time (ms). */
	injuredUntilMs?: number;
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

function sheetStatusToGameStatus(s?: string): VigilanteStatus {
	const t = (s ?? "Available").toLowerCase();
	if (t.includes("injur")) return "injured";
	if (t.includes("unavail") || t.includes("offline") || t.includes("down")) {
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

const ROSTER_SLOTS = 5;

type VigilanteSlot =
	| { kind: "filled"; item: VigilanteItem }
	| { kind: "empty"; index: number };

/** Home-base roster: up to 5 owned vigilantes (sorted by id), rest empty slots. */
function buildHomeBaseVigilanteSlots(
	ownedIds: string[],
	sheets: VigilanteSheet[],
): VigilanteSlot[] {
	const byId = new Map(sheets.map((s) => [s.id, s]));
	const sortedIds = [...new Set(ownedIds)].sort((a, b) => a.localeCompare(b));
	const filled: VigilanteItem[] = [];
	for (const id of sortedIds) {
		const s = byId.get(id);
		if (s) filled.push(sheetToVigilanteItem(s));
		if (filled.length >= ROSTER_SLOTS) break;
	}
	const out: VigilanteSlot[] = filled.map((item) => ({
		kind: "filled",
		item,
	}));
	while (out.length < ROSTER_SLOTS) {
		out.push({ kind: "empty", index: out.length });
	}
	return out;
}

const TAB_ORDER: Record<InventoryTab, number> = {
	vigilantes: 0,
	resources: 1,
	buffs: 2,
};

/** Compact countdown for injured tooltip (no prose, no “ready”). */
function recoveryCountdownShort(untilMs: number, now: number): string {
	const s = Math.max(0, Math.ceil((untilMs - now) / 1000));
	const m = Math.floor(s / 60);
	const sec = s % 60;
	if (m >= 1) return `${m}m ${sec}s`;
	return `${sec}s`;
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
	/** When set, resource/buff quantities reflect pool − deployed (from map game state). */
	resourcePool?: Record<string, ResourcePoolEntry>;
	/**
	 * Roster on the map (home base). When set, the Vigilantes tab shows exactly 5
	 * slots: owned characters + grey empty slots until 5.
	 */
	ownedVigilanteIds?: string[];
	/** Post-incident injury: id → recovery time (ms). Drives injured status + deploy lock. */
	vigilanteInjuryUntil?: Record<string, number>;
	/**
	 * Buff ids unlocked (e.g. shop). Omitted = show full catalog (demo / legacy).
	 * When set, Buffs tab only lists purchased entries; stock still comes from `resourcePool`.
	 */
	purchasedUpgradeIds?: string[];
	/** Controlled active tab (for tab persistence across open/close). */
	tab?: InventoryTab;
	/** Called when user switches tabs. */
	onTabChange?: (tab: InventoryTab) => void;
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
		return <FaUser className={tileIconClass} aria-hidden />;
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

/** Derived from SHOP_RESOURCES — single source of truth for item names/descriptions.
 *  qty is always 0 here; live quantities always come from resourcePool in the game. */
const BASE_RESOURCES: ResourceItem[] = SHOP_RESOURCES.map((r) => ({
	id: r.id,
	name: r.name,
	summary: r.description,
	qty: 0,
	status: "ready" as const,
}));

export { BASE_RESOURCES };

function InventoryVigilanteDossierPane({
	sheet,
	onClose,
}: {
	sheet: VigilanteSheet;
	onClose: () => void;
}) {
	const portraitSrc = portraitToSrc(sheet.portrait);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);

	if (typeof document === "undefined") return null;

	return createPortal(
		<div className="fixed inset-0 z-[10020] flex items-center justify-center p-4">
			<motion.div
				role="presentation"
				aria-hidden
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.18 }}
				className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
				onClick={onClose}
			/>
			<motion.div
				id="inventory-vigilante-dossier"
				role="dialog"
				aria-modal
				aria-labelledby="inventory-dossier-title"
				initial={{ opacity: 0, scale: 0.96, y: 16 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
				className="relative z-10 flex min-h-0 max-h-[min(90vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-amber-900/45 bg-[#0a0908]/95 text-amber-100 shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-md"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex min-h-0 w-full flex-1 flex-col">
					<div className="flex shrink-0 items-start justify-between border-b border-amber-900/30 px-5 py-4">
						<div className="min-w-0">
							<div className="text-[11px] uppercase tracking-[0.28em] text-amber-400/70">
								Vigilante dossier
							</div>
							<h2
								id="inventory-dossier-title"
								className="mt-2 truncate text-2xl font-bold text-amber-100"
							>
								{sheet.alias}
							</h2>
							<div className="mt-1 text-sm text-amber-200/60">
								{sheet.name} • {sheet.role}
							</div>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="shrink-0 rounded-lg border border-amber-900/35 bg-black/30 p-2 text-amber-200/70 transition hover:bg-amber-950/20 hover:text-amber-100"
							aria-label="Close dossier"
						>
							<X className="h-4 w-4" />
						</button>
					</div>

					<div className="min-h-0 flex-1 overflow-y-auto vigilante-hide-scrollbar px-5 py-4">
						<div className="grid grid-cols-[108px_1fr] gap-4">
							<div className="relative h-[140px] overflow-hidden rounded-xl border border-amber-900/35 bg-black/35">
								{portraitSrc ? (
									<img
										src={portraitSrc}
										alt=""
										className="h-full w-full object-cover object-[center_top]"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center">
										<FaUser className="h-16 w-16 text-amber-200/35" />
									</div>
								)}
							</div>
							<div className="min-w-0 space-y-3">
								<div className="flex flex-wrap gap-2">
									{sheet.status ? (
										<span className="rounded-full border border-amber-900/35 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-amber-200/75">
											{sheet.status}
										</span>
									) : null}
									{typeof sheet.heat === "number" ? (
										<span className="rounded-full border border-red-900/35 bg-red-950/20 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-red-300/75">
											Heat {sheet.heat}
										</span>
									) : null}
									{typeof sheet.age === "number" ? (
										<span className="rounded-full border border-amber-900/35 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-amber-200/75">
											Age {sheet.age}
										</span>
									) : null}
								</div>
								<p className="text-sm leading-6 text-amber-100/75">
									{sheet.bio ?? "Backstory TBD."}
								</p>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-2 gap-3">
							{(
								[
									"combat",
									"stealth",
									"tactics",
									"nerve",
								] as const
							).map((stat) => (
								<div
									key={stat}
									className="rounded-xl border border-amber-900/30 bg-black/25 p-3"
								>
									<div className="text-[11px] uppercase tracking-[0.2em] text-amber-400/70">
										{stat}
									</div>
									<div className="mt-2 text-lg font-bold">
										{sheet.stats[stat]}
									</div>
								</div>
							))}
						</div>

						<div className="mt-6 rounded-xl border border-amber-900/30 bg-black/25 p-4">
							<div className="text-[11px] uppercase tracking-[0.24em] text-amber-400/70">
								Traits
							</div>
							<div className="mt-3 flex flex-wrap gap-2">
								{(sheet.traits ?? []).length > 0 ? (
									sheet.traits?.map((trait) => (
										<span
											key={trait}
											className="rounded-full border border-amber-900/30 bg-black/30 px-3 py-1 text-xs text-amber-100/80"
										>
											{trait}
										</span>
									))
								) : (
									<span className="text-sm text-amber-200/45">
										No listed traits.
									</span>
								)}
							</div>
						</div>

						{sheet.equipment && sheet.equipment.length > 0 ? (
							<div className="mt-6 rounded-xl border border-amber-900/30 bg-black/25 p-4">
								<div className="text-[11px] uppercase tracking-[0.24em] text-amber-400/70">
									Equipment
								</div>
								<ul className="mt-3 space-y-2 text-sm text-amber-100/75">
									{sheet.equipment.map((item) => (
										<li key={item}>• {item}</li>
									))}
								</ul>
							</div>
						) : null}
					</div>

					<div className="shrink-0 border-t border-amber-900/30 px-5 py-4">
						<button
							type="button"
							onClick={onClose}
							className="w-full rounded-xl border border-amber-900/35 bg-black/30 px-4 py-3 text-sm text-amber-200/80 transition hover:bg-amber-950/20"
						>
							Close
						</button>
					</div>
				</div>
			</motion.div>
		</div>,
		document.body,
	);
}

/** Derived from SHOP_UPGRADES — single source of truth for buff names/descriptions.
 *  qty is always 1 here; live quantities always come from resourcePool in the game. */
const BASE_BUFFS: BuffItem[] = SHOP_UPGRADES.map((u) => ({
	id: u.id,
	name: u.name,
	summary: u.description,
	qty: 1,
	status: "ready" as const,
}));

export default function Inventory({
	onHide,
	resourcePool,
	ownedVigilanteIds,
	vigilanteInjuryUntil,
	purchasedUpgradeIds,
	tab: controlledTab,
	onTabChange,
}: InventoryProps) {
	const [nowTick, setNowTick] = useState(() => Date.now());
	useEffect(() => {
		const id = window.setInterval(() => setNowTick(Date.now()), 1000);
		return () => clearInterval(id);
	}, []);

	// Controlled/uncontrolled tab pattern
	const [internalTab, setInternalTab] = useState<InventoryTab>("vigilantes");
	const isControlled = controlledTab !== undefined;
	const tab = isControlled ? controlledTab : internalTab;

	const setTab = (next: InventoryTab) => {
		if (isControlled && onTabChange) {
			onTabChange(next);
		} else if (!isControlled) {
			setInternalTab(next);
		}
	};

	const [slideDir, setSlideDir] = useState<1 | -1>(1);
	const [hoverTip, setHoverTip] = useState<InventoryHoverTip | null>(null);
	const [tipPos, setTipPos] = useState({ left: 0, top: 0 });
	/** Only bumps when navigating *to* the Vigilantes tab from another tab — unique AnimatePresence key (not roster edits). */
	const [vigilantePanelMountId, setVigilantePanelMountId] = useState(0);
	/** Bumps when re-entering Vigilantes or roster changes so portrait <img> nodes remount (avoids blank tiles). */
	const [vigilantePortraitEpoch, setVigilantePortraitEpoch] = useState(0);
	const [dossierSheet, setDossierSheet] = useState<VigilanteSheet | null>(
		null,
	);

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
			setVigilantePanelMountId((n) => n + 1);
			setVigilantePortraitEpoch((n) => n + 1);
		}
		setTab(next);
	};

	/** Home-base roster row, or catalog demo when `ownedVigilanteIds` is omitted. */
	const vigilanteSlots: VigilanteSlot[] = useMemo(() => {
		const base =
			ownedVigilanteIds !== undefined
				? buildHomeBaseVigilanteSlots(
						ownedVigilanteIds,
						vigilanteSheets,
					)
				: stableFiveFromSheets(vigilanteSheets).map((item) => ({
						kind: "filled" as const,
						item,
					}));
		if (!vigilanteInjuryUntil) return base;
		return base.map((slot) => {
			if (slot.kind !== "filled") return slot;
			const until = vigilanteInjuryUntil[slot.item.id];
			if (until != null && nowTick < until) {
				return {
					kind: "filled" as const,
					item: {
						...slot.item,
						status: "injured" as const,
						injuredUntilMs: until,
					},
				};
			}
			return slot;
		});
	}, [ownedVigilanteIds, vigilanteSheets, vigilanteInjuryUntil, nowTick]);

	useEffect(() => {
		if (ownedVigilanteIds !== undefined) {
			setVigilantePortraitEpoch((n) => n + 1);
		}
	}, [ownedVigilanteIds]);

	const resources: ResourceItem[] = useMemo(() => {
		if (!resourcePool) return BASE_RESOURCES;
		return BASE_RESOURCES.map((r) => {
			const p = resourcePool[r.id];
			const available = p ? Math.max(0, p.qty - p.deployed) : 0;
			const status: ResourceStatus =
				available <= 0 ? "cooldown" : "ready";
			return { ...r, qty: available, status };
		});
	}, [resourcePool]);

	const buffs: BuffItem[] = useMemo(() => {
		const catalog =
			purchasedUpgradeIds === undefined
				? BASE_BUFFS
				: BASE_BUFFS.filter((b) => purchasedUpgradeIds.includes(b.id));
		if (!resourcePool) return catalog;
		return catalog.map((b) => {
			const p = resourcePool[b.id];
			const available = p ? Math.max(0, p.qty - p.deployed) : b.qty;
			const status: ResourceStatus =
				available <= 0 ? "cooldown" : "ready";
			return { ...b, qty: available, status };
		});
	}, [resourcePool, purchasedUpgradeIds]);

	const tileIconClass = "w-[1.25rem] h-[1.25rem] sm:w-6 sm:h-6 md:w-7 md:h-7";

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

	const showBuffTip = (e: React.MouseEvent<HTMLElement>, item: BuffItem) => {
		const el = e.currentTarget;
		const r = el.getBoundingClientRect();
		setTipPos({ left: r.left + r.width / 2, top: r.top - 10 });
		setHoverTip({ kind: "b", item, el });
	};

	const hideInventoryTip = () => setHoverTip(null);

	const buffIcon = (id: BuffItem["id"]) => {
		const cls = tileIconClass;
		if (id === "b1") return <FaBolt className={cls} aria-hidden />;
		if (id === "b2")
			return <FaBroadcastTower className={cls} aria-hidden />;
		if (id === "b3") return <FaHeart className={cls} aria-hidden />;
		if (id === "b4") return <FaBullseye className={cls} aria-hidden />;
		if (id === "b5") return <FaShieldAlt className={cls} aria-hidden />;
		if (id === "b6") return <FaShieldAlt className={cls} aria-hidden />;
		if (id === "b7") return <FaDollarSign className={cls} aria-hidden />;
		return <FaUser className={cls} aria-hidden />;
	};

	return (
		<>
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
									// Same key "vigilantes" on every re-entry lets Framer reuse the panel;
									// opacity/transform can stick wrong so portraits vanish. Mount id only
									// bumps on tab navigation, not on roster updates (see portrait epoch).
									key={
										tab === "vigilantes"
											? `vigilantes-${vigilantePanelMountId}`
											: tab
									}
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
											{vigilanteSlots.map((slot) => {
												if (slot.kind === "empty") {
													return (
														<div
															key={`roster-empty-${slot.index}`}
															className="relative flex min-w-0 items-center justify-center"
														>
															<div
																className={`group relative flex items-center justify-center ${vigilanteTileClass} cursor-default border-dashed border-zinc-600/50 bg-zinc-950/40 opacity-55 grayscale hover:opacity-70`}
																aria-label="Empty roster slot"
															>
																<FaUser
																	className={`${vigilantePortraitIconClass} text-zinc-500/80`}
																	aria-hidden
																/>
															</div>
														</div>
													);
												}
												const v = slot.item;
												const st = vigilanteStatusUi(
													v.status,
												);
												const StatusIcon = st.Icon;
												return (
													<div
														key={v.id}
														className="relative flex min-w-0 items-center justify-center"
													>
														<button
															type="button"
															className={`group relative m-0 flex items-center justify-center p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/35 ${vigilanteTileClass} ${VIGILANTE_TILE_NEUTRAL}`}
															aria-label={`${v.name}, ${st.shortLabel}. Open dossier.`}
															onMouseEnter={(e) =>
																showVigilanteTip(
																	e,
																	v,
																)
															}
															onMouseLeave={
																hideInventoryTip
															}
															onClick={() => {
																hideInventoryTip();
																const full =
																	vigilanteSheets.find(
																		(s) =>
																			s.id ===
																			v.id,
																	);
																if (full)
																	setDossierSheet(
																		full,
																	);
															}}
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
																title={
																	st.shortLabel
																}
															>
																<StatusIcon
																	className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${st.iconClass}`}
																	strokeWidth={
																		2.75
																	}
																/>
															</div>
														</button>
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
															showResourceTip(
																e,
																r,
															)
														}
														onMouseLeave={
															hideInventoryTip
														}
													>
														<ResourceGearIcon
															resourceId={r.id}
															className={
																tileIconClass
															}
														/>

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
														onMouseLeave={
															hideInventoryTip
														}
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
							{hoverTip.kind === "v" &&
								(() => {
									const item = hoverTip.item;
									const showRecovery =
										item.status === "injured" &&
										item.injuredUntilMs != null &&
										nowTick < item.injuredUntilMs;
									return (
										<div className="flex min-w-0 max-w-[min(260px,calc(100vw-2rem))] flex-col gap-0.5">
											<span className="min-w-0 truncate font-semibold text-amber-100/95 text-xs sm:text-[13px] leading-snug">
												{item.name}
												<span className="sr-only">
													{`, ${vigilanteStatusUi(item.status).shortLabel}`}
												</span>
											</span>
											{showRecovery ? (
												<div className="text-[10px] tabular-nums text-amber-200/60">
													{recoveryCountdownShort(
														item.injuredUntilMs!,
														nowTick,
													)}
												</div>
											) : null}
										</div>
									);
								})()}
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
			{dossierSheet ? (
				<InventoryVigilanteDossierPane
					sheet={dossierSheet}
					onClose={() => setDossierSheet(null)}
				/>
			) : null}
		</>
	);
}
