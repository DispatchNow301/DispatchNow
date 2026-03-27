// File: components/minigames/InventorySorterModal.tsx
// Purpose: show a rules screen before starting the inventory sorter minigame.

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, RotateCw, X, XCircle } from "lucide-react";
import { ResourceGearIcon } from "@/components/game/ResourceGearIcon";

type ItemIconKey =
	| "r1"
	| "r2"
	| "r3"
	| "r4"
	| "r5"
	| "r6"
	| "r7"
	| "r8"
	| "r9";

type InventoryItem = {
	id: string;
	name: string;
	width: number;
	height: number;
	icon: ItemIconKey;
	colorClass: string;
};

type PlacedItem = {
	itemId: string;
	x: number;
	y: number;
	rotated: boolean;
};

type HoverCell = {
	x: number;
	y: number;
} | null;

type RewardPayload = {
	credits: number;
	items: Array<{ type: string; quantity: number }>;
};

type ShapeOption = {
	width: number;
	height: number;
};

type ResourceTemplate = {
	name: string;
	icon: ItemIconKey;
	colorClass: string;
	width: number;
	height: number;
};

type ModalPhase = "rules" | "playing" | "reward";
type RewardMode = "none" | "random-resource";

export type InventorySorterModalProps = {
	open: boolean;
	onClose: () => void;
	onWin?: (reward: RewardPayload) => void;
	title?: string;
	subtitle?: string;
	rewardMode?: RewardMode;
};

const GRID_COLS = 4;
const GRID_ROWS = 4;
const CELL_SIZE = 68;
const CELL_GAP = 6;
const GRID_PADDING = 14;
const GRID_PIXEL_WIDTH =
	GRID_COLS * CELL_SIZE + (GRID_COLS - 1) * CELL_GAP + GRID_PADDING * 2;
const ROUND_DURATION_MS = 30_000;

const PANEL_CLASS =
	"rounded-xl border border-amber-900/40 bg-black/35 backdrop-blur-md shadow-xl shadow-black/40";
const BUTTON_CLASS =
	"rounded-lg border border-amber-900/50 bg-black/40 text-amber-200/80 transition-all duration-200 hover:bg-amber-950/20 hover:border-amber-700/40 hover:text-amber-100 cursor-pointer";

const RESOURCE_TEMPLATES: ResourceTemplate[] = [
	{
		name: "First Aid Kit",
		icon: "r1",
		colorClass: "bg-red-950/50 text-red-300 border-red-800/60",
		width: 2,
		height: 2,
	},
	{
		name: "Fire Extinguisher",
		icon: "r2",
		colorClass: "bg-orange-950/50 text-orange-300 border-orange-800/60",
		width: 2,
		height: 1,
	},
	{
		name: "Walkie-Talkie",
		icon: "r3",
		colorClass: "bg-sky-950/50 text-sky-300 border-sky-800/60",
		width: 2,
		height: 1,
	},
	{
		name: "Handcuffs",
		icon: "r4",
		colorClass: "bg-slate-900/80 text-slate-200 border-slate-700/60",
		width: 1,
		height: 2,
	},
	{
		name: "Surveillance Drone",
		icon: "r5",
		colorClass: "bg-indigo-950/50 text-indigo-300 border-indigo-800/60",
		width: 1,
		height: 2,
	},
	{
		name: "Protective Gear",
		icon: "r6",
		colorClass: "bg-emerald-950/50 text-emerald-300 border-emerald-800/60",
		width: 1,
		height: 1,
	},
	{
		name: "Barricade Kit",
		icon: "r7",
		colorClass: "bg-amber-950/50 text-amber-200 border-amber-800/60",
		width: 1,
		height: 1,
	},
	{
		name: "EpiPen",
		icon: "r8",
		colorClass: "bg-cyan-950/50 text-cyan-300 border-cyan-800/60",
		width: 1,
		height: 1,
	},
	{
		name: "Rescue Tool",
		icon: "r9",
		colorClass: "bg-zinc-900/80 text-zinc-200 border-zinc-700/60",
		width: 1,
		height: 1,
	},
];

const RANDOM_RESOURCE_REWARD_TEXT =
	"Random resource from the 9 shared inventory items.";

function createRewardFromIcon(icon: ItemIconKey): RewardPayload {
	return {
		credits: 0,
		items: [{ type: icon, quantity: 1 }],
	};
}

function pickRandomRewardIcon(): ItemIconKey {
	return RESOURCE_TEMPLATES[
		Math.floor(Math.random() * RESOURCE_TEMPLATES.length)
	].icon;
}

// Return the active item footprint after rotation.
function getItemFootprint(item: InventoryItem, rotated: boolean) {
	return rotated
		? { width: item.height, height: item.width }
		: { width: item.width, height: item.height };
}

// Check whether two rectangles overlap.
function rectanglesOverlap(
	a: { x: number; y: number; width: number; height: number },
	b: { x: number; y: number; width: number; height: number },
) {
	return !(
		a.x + a.width <= b.x ||
		b.x + b.width <= a.x ||
		a.y + a.height <= b.y ||
		b.y + b.height <= a.y
	);
}

// Validate whether an item can be placed at a position.
function canPlaceItem(
	item: InventoryItem,
	rotated: boolean,
	x: number,
	y: number,
	placed: PlacedItem[],
	items: InventoryItem[],
	ignoreItemId?: string,
) {
	const footprint = getItemFootprint(item, rotated);

	if (x < 0 || y < 0) return false;
	if (x + footprint.width > GRID_COLS) return false;
	if (y + footprint.height > GRID_ROWS) return false;

	const currentRect = { x, y, width: footprint.width, height: footprint.height };

	for (const entry of placed) {
		if (entry.itemId === ignoreItemId) continue;

		const otherItem = items.find((candidate) => candidate.id === entry.itemId);
		if (!otherItem) continue;

		const otherFootprint = getItemFootprint(otherItem, entry.rotated);
		const otherRect = {
			x: entry.x,
			y: entry.y,
			width: otherFootprint.width,
			height: otherFootprint.height,
		};

		if (rectanglesOverlap(currentRect, otherRect)) return false;
	}

	return true;
}

// Format milliseconds as M:SS.
function formatDuration(ms: number) {
	const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const remain = totalSeconds % 60;
	return `${minutes}:${remain.toString().padStart(2, "0")}`;
}

// Return a shuffled copy of an array.
function shuffleArray<T>(values: T[]) {
	const next = [...values];
	for (let i = next.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[next[i], next[j]] = [next[j], next[i]];
	}
	return next;
}

// Find all valid placements for a shape on the helper grid.
function getPlacementsForShape(shape: ShapeOption, occupied: boolean[][]) {
	const placements: Array<{ x: number; y: number }> = [];

	for (let y = 0; y <= GRID_ROWS - shape.height; y += 1) {
		for (let x = 0; x <= GRID_COLS - shape.width; x += 1) {
			let blocked = false;

			for (let dy = 0; dy < shape.height; dy += 1) {
				for (let dx = 0; dx < shape.width; dx += 1) {
					if (occupied[y + dy][x + dx]) {
						blocked = true;
						break;
					}
				}
				if (blocked) break;
			}

			if (!blocked) placements.push({ x, y });
		}
	}

	return placements;
}

// Mark cells as occupied in the helper grid.
function markOccupied(
	occupied: boolean[][],
	x: number,
	y: number,
	width: number,
	height: number,
) {
	for (let dy = 0; dy < height; dy += 1) {
		for (let dx = 0; dx < width; dx += 1) {
			occupied[y + dy][x + dx] = true;
		}
	}
}

// Build a solvable round that uses the shared resource sizes.
// Non-square items may be rotated during generation to create variety.
function createPuzzleRound(): InventoryItem[] {
	for (let attempt = 0; attempt < 500; attempt += 1) {
		const occupied = Array.from({ length: GRID_ROWS }, () =>
			Array.from({ length: GRID_COLS }, () => false),
		);

		const templates = shuffleArray(RESOURCE_TEMPLATES);
		const generatedItems: InventoryItem[] = [];
		let failed = false;

		for (let index = 0; index < templates.length; index += 1) {
			const template = templates[index];

			const candidateShapes: ShapeOption[] =
				template.width === template.height
					? [{ width: template.width, height: template.height }]
					: shuffleArray([
						{ width: template.width, height: template.height },
						{ width: template.height, height: template.width },
					]);

			let placed = false;

			for (const shape of candidateShapes) {
				const placements = getPlacementsForShape(shape, occupied);

				if (placements.length === 0) continue;

				const chosenPlacement =
					placements[Math.floor(Math.random() * placements.length)];

				markOccupied(
					occupied,
					chosenPlacement.x,
					chosenPlacement.y,
					shape.width,
					shape.height,
				);

				generatedItems.push({
					id: `round_${attempt}_${index}_${Date.now()}_${Math.random()
						.toString(16)
						.slice(2)}`,
					name: template.name,
					width: shape.width,
					height: shape.height,
					icon: template.icon,
					colorClass: template.colorClass,
				});

				placed = true;
				break;
			}

			if (!placed) {
				failed = true;
				break;
			}
		}

		if (!failed && generatedItems.length === RESOURCE_TEMPLATES.length) {
			return shuffleArray(generatedItems);
		}
	}

	return RESOURCE_TEMPLATES.map((template, index) => ({
		id: `fallback_${index}_${Date.now()}`,
		name: template.name,
		width: template.width,
		height: template.height,
		icon: template.icon,
		colorClass: template.colorClass,
	}));
}

export default function InventorySorterModal({
	open,
	onClose,
	onWin,
	title = "Inventory Sorter",
	subtitle = "Organize the emergency locker to recover extra supplies before time runs out.",
	rewardMode = "none",
}: InventorySorterModalProps) {
	const [mounted, setMounted] = useState(false);
	const [phase, setPhase] = useState<ModalPhase>("rules");
	const [roundItems, setRoundItems] = useState<InventoryItem[]>([]);
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
	const [rotatedItemIds, setRotatedItemIds] = useState<Record<string, boolean>>(
		{},
	);
	const [hoverCell, setHoverCell] = useState<HoverCell>(null);
	const [startedAt, setStartedAt] = useState<number>(() => Date.now());
	const [now, setNow] = useState<number>(() => Date.now());
	const [completed, setCompleted] = useState(false);
	const [failed, setFailed] = useState(false);
	const [reward, setReward] = useState<RewardPayload | null>(null);
	const [drawPreviewIcon, setDrawPreviewIcon] = useState<ItemIconKey | null>(null);
	const [isDrawingReward, setIsDrawingReward] = useState(false);
	const drawIntervalRef = useRef<number | null>(null);

	const clearDrawTimer = useCallback(() => {
		if (drawIntervalRef.current !== null) {
			window.clearInterval(drawIntervalRef.current);
			drawIntervalRef.current = null;
		}
	}, []);

	// Reset all state and start a fresh puzzle round.
	const startNewRound = useCallback(() => {
		const nextItems = createPuzzleRound();
		setRoundItems(nextItems);
		setSelectedItemId(nextItems[0]?.id ?? null);
		setPlacedItems([]);
		setRotatedItemIds({});
		setHoverCell(null);
		setStartedAt(Date.now());
		setNow(Date.now());
		setCompleted(false);
		setFailed(false);
		setReward(null);
		setDrawPreviewIcon(null);
		setIsDrawingReward(false);
	}, []);

	// Enter the playable phase from the rules page.
	const handleStartMission = useCallback(() => {
		startNewRound();
		setPhase("playing");
	}, [startNewRound]);

	// Enable portal rendering after mount.
	useEffect(() => {
		setMounted(true);
	}, []);

	// Lock body scroll while the modal is open.
	useEffect(() => {
		if (!open) return;

		const original = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = original;
		};
	}, [open]);

	// Reset back to the rules page whenever the modal opens.
	useEffect(() => {
		if (!open) return;

		clearDrawTimer();
		setPhase("rules");
		setRoundItems([]);
		setSelectedItemId(null);
		setPlacedItems([]);
		setRotatedItemIds({});
		setHoverCell(null);
		setCompleted(false);
		setFailed(false);
		setReward(null);
		setDrawPreviewIcon(null);
		setIsDrawingReward(false);
	}, [open, clearDrawTimer]);

	useEffect(() => {
		return () => {
			clearDrawTimer();
		};
	}, [clearDrawTimer]);

	// Update the countdown while the round is active.
	useEffect(() => {
		if (!open || phase !== "playing" || completed || failed) return;

		const timer = window.setInterval(() => {
			setNow(Date.now());
		}, 250);

		return () => window.clearInterval(timer);
	}, [open, phase, completed, failed]);

	// Resolve the currently selected item.
	const selectedItem = useMemo(
		() => roundItems.find((item) => item.id === selectedItemId) ?? null,
		[roundItems, selectedItemId],
	);

	// Compute the list of items not yet placed.
	const unplacedItems = useMemo(() => {
		const placedIds = new Set(placedItems.map((entry) => entry.itemId));
		return roundItems.filter((item) => !placedIds.has(item.id));
	}, [placedItems, roundItems]);

	// Derive timer and rotation values.
	const elapsedMs = now - startedAt;
	const remainingMs = Math.max(0, ROUND_DURATION_MS - elapsedMs);
	const selectedRotated = selectedItem
		? Boolean(rotatedItemIds[selectedItem.id])
		: false;

	// Validate the current hover preview.
	const hoverPlacementValid = useMemo(() => {
		if (phase !== "playing" || !selectedItem || !hoverCell) return false;

		return canPlaceItem(
			selectedItem,
			selectedRotated,
			hoverCell.x,
			hoverCell.y,
			placedItems,
			roundItems,
			selectedItem.id,
		);
	}, [phase, selectedItem, hoverCell, selectedRotated, placedItems, roundItems]);

	// Mark the round as failed when time runs out.
	useEffect(() => {
		if (!open || phase !== "playing" || completed || failed) return;
		if (remainingMs > 0) return;
		setFailed(true);
	}, [open, phase, completed, failed, remainingMs]);

	// Support keyboard shortcuts for rotate and close.
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (!open) return;

			if (event.key.toLowerCase() === "r") {
				event.preventDefault();
				if (phase !== "playing" || !selectedItem || completed || failed) return;

				setRotatedItemIds((current) => ({
					...current,
					[selectedItem.id]: !current[selectedItem.id],
				}));
			}

			if (event.key === "Escape") {
				event.preventDefault();
				onClose();
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, phase, selectedItem, completed, failed, onClose]);

	// Place the selected item onto the hovered grid cell.
	function handlePlaceSelected() {
		if (phase !== "playing" || !selectedItem || !hoverCell || completed || failed) {
			return;
		}

		const isValid = canPlaceItem(
			selectedItem,
			selectedRotated,
			hoverCell.x,
			hoverCell.y,
			placedItems,
			roundItems,
			selectedItem.id,
		);

		if (!isValid) return;

		setPlacedItems((current) => {
			const next = current.filter((entry) => entry.itemId !== selectedItem.id);

			return [
				...next,
				{
					itemId: selectedItem.id,
					x: hoverCell.x,
					y: hoverCell.y,
					rotated: selectedRotated,
				},
			];
		});

		const remaining = unplacedItems.filter((item) => item.id !== selectedItem.id);
		setSelectedItemId(remaining[0]?.id ?? null);
	}

	// Pick up a placed item back into selection.
	function handlePickupPlaced(itemId: string) {
		if (phase !== "playing" || completed || failed) return;
		setPlacedItems((current) => current.filter((entry) => entry.itemId !== itemId));
		setSelectedItemId(itemId);
	}

	// Submit the round after all items are placed.
	function handleSubmit() {
		if (phase !== "playing" || completed || failed) return;
		if (placedItems.length !== roundItems.length || roundItems.length === 0) {
			return;
		}

		setCompleted(true);
		setPhase("reward");
	}

	function handleDrawReward() {
		if (rewardMode !== "random-resource") return;
		if (isDrawingReward || reward) return;

		setIsDrawingReward(true);

		let spins = 0;
		drawIntervalRef.current = window.setInterval(() => {
			const icon = pickRandomRewardIcon();
			setDrawPreviewIcon(icon);
			spins += 1;

			if (spins >= 14) {
				clearDrawTimer();
				const finalIcon = pickRandomRewardIcon();
				setDrawPreviewIcon(finalIcon);
				setReward(createRewardFromIcon(finalIcon));
				setIsDrawingReward(false);
			}
		}, 100);
	}

	function handleClaimReward() {
		if (!reward) return;
		onWin?.(reward);
		onClose();
	}

	if (!mounted || !open) return null;

	return createPortal(
		<div
			className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-2 sm:p-3"
			onClick={(event) => {
				if (event.target === event.currentTarget) onClose();
			}}
			role="dialog"
			aria-modal="true"
			aria-label="Inventory Sorter minigame"
		>
			<div
				className="flex max-h-[82vh] flex-col overflow-hidden rounded-xl border border-amber-900/50 bg-[#0d0c0e] shadow-2xl shadow-black/50"
				style={{ width: "min(1220px, calc(100vw - 16px))" }}
			>
				<div className="flex items-center justify-between border-b border-amber-900/30 px-3 py-2 sm:px-4 sm:py-3">
					<div>
						<div
							className="text-lg font-bold tracking-tight text-amber-100 sm:text-xl lg:text-2xl"
							style={{
								fontFamily: "Georgia, 'Times New Roman', serif",
								color: "#e4d5b7",
								textShadow:
									"0 0 20px rgba(180,140,80,0.15), 0 2px 4px rgba(0,0,0,0.5)",
							}}
						>
							{title}
						</div>
						<p className="mt-0.5 text-xs text-amber-200/55 sm:text-sm">
							{subtitle}
						</p>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="rounded-lg border border-amber-900/50 bg-black/40 p-2 text-amber-200/70 transition-colors hover:border-amber-700/40 hover:bg-amber-950/20 hover:text-amber-100"
						aria-label="Close minigame"
					>
						<X className="h-4 w-4 sm:h-5 sm:w-5" />
					</button>
				</div>

				<div className="overflow-y-auto p-2">
					{phase === "rules" ? (
						<section className={`${PANEL_CLASS} p-4 sm:p-6`}>
							<div className="mx-auto max-w-3xl">
								<div className="text-[10px] uppercase tracking-[0.22em] text-amber-400/70">
									Mission Brief
								</div>
								<h2 className="mt-2 text-2xl font-semibold text-amber-100">
									Inventory Sorter Rules
								</h2>
								<div className="mt-5 grid gap-4 md:grid-cols-2">
									<div className="rounded-xl border border-amber-900/35 bg-black/30 p-4">
										<div className="text-sm font-semibold text-amber-100">
											Mission Overview
										</div>
										<p className="mt-3 text-sm leading-6 text-amber-200/75">
											Fit all 9 items into the 4 x 4 locker grid before time runs out, keeping every item inside the board with no overlap.
										</p>
									</div>

									<div className="rounded-xl border border-amber-900/35 bg-black/30 p-4">
										<div className="text-sm font-semibold text-amber-100">
											Item Sizes
										</div>
										<div className="mt-3 flex flex-wrap gap-2">
											{RESOURCE_TEMPLATES.map((item) => (
												<div
													key={item.icon}
													className="inline-flex items-center gap-2 rounded-lg border border-amber-900/35 bg-black/35 px-3 py-2 text-xs text-amber-200/80"
												>
													<div
														className={`flex h-6 w-6 items-center justify-center rounded-md border ${item.colorClass}`}
													>
														<ResourceGearIcon
															resourceId={item.icon}
															className="h-3.5 w-3.5"
														/>
													</div>
													<span className="rounded-md border border-amber-900/35 bg-black/40 px-1.5 py-0.5 text-[10px] text-amber-300/80">
														{item.width} x {item.height}
													</span>
												</div>
											))}
										</div>
										<p className="mt-3 text-xs text-amber-200/60">
											Long items can be rotated during play.
										</p>
									</div>
								</div>

								<div className="mt-5 rounded-xl border border-amber-900/35 bg-black/30 p-4">
									<div className="text-sm font-semibold text-amber-100">
										Rewards
									</div>
									<p className="mt-3 text-sm leading-6 text-amber-200/75">
										{rewardMode === "random-resource"
											? RANDOM_RESOURCE_REWARD_TEXT
											: "No reward for the tab-launched practice version."}
									</p>
								</div>

								<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
									<button
										type="button"
										onClick={onClose}
										className={`${BUTTON_CLASS} px-4 py-2 text-sm`}
									>
										Back
									</button>
									<button
										type="button"
										onClick={handleStartMission}
										className="rounded-lg border border-amber-700/50 bg-amber-950/20 px-4 py-2 text-sm font-medium text-amber-100 transition-colors hover:bg-amber-900/30"
									>
										Start Mission
									</button>
								</div>
							</div>
						</section>
					) : phase === "playing" ? (
						<div className="grid items-start gap-3">
							<section className={`${PANEL_CLASS} min-w-0 p-3`}>
								<div className="mb-2">
									<div className="text-[10px] uppercase tracking-[0.22em] text-amber-400/70">
										Run Summary
									</div>
									<div className="mt-1 text-sm font-semibold text-amber-100">
										Supply Recovery
									</div>
								</div>

								<div className="overflow-x-auto">
									<div
										className="gap-2"
										style={{
											display: "grid",
											gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
											minWidth: 760,
										}}
									>
										<div className="rounded-lg border border-amber-900/40 bg-black/30 px-3 py-2">
											<div className="text-[10px] uppercase tracking-[0.18em] text-amber-400/70">
												Time Left
											</div>
											<div className="mt-1 text-xl font-semibold text-amber-100">
												{formatDuration(remainingMs)}
											</div>
										</div>

										<div className="rounded-lg border border-amber-900/40 bg-black/30 px-3 py-2">
											<div className="text-[10px] uppercase tracking-[0.18em] text-amber-400/70">
												Selected Item
											</div>
											<div className="mt-1 text-xs text-amber-100/85">
												{selectedItem ? selectedItem.name : "None"}
											</div>
										</div>

										<div className="rounded-lg border border-amber-900/40 bg-black/30 px-3 py-2">
											<div className="text-[10px] uppercase tracking-[0.18em] text-amber-400/70">
												Reward Preview
											</div>
											<div className="mt-1 text-xs text-amber-200/70">
												{rewardMode === "random-resource"
													? "Random resource from the 9"
													: "No reward"}
											</div>
										</div>

										<div className="rounded-lg border border-amber-900/40 bg-black/30 px-3 py-2">
											<div className="text-[10px] uppercase tracking-[0.18em] text-amber-400/70">
												Status
											</div>
											<div className="mt-1.5 flex items-center gap-2 text-xs">
												{completed ? (
													<>
														<CheckCircle2 className="h-4 w-4 text-emerald-400" />
														<span className="text-emerald-300">
															Submitted successfully
														</span>
													</>
												) : failed ? (
													<>
														<XCircle className="h-4 w-4 text-red-400" />
														<span className="text-red-300">Time expired</span>
													</>
												) : placedItems.length === roundItems.length &&
													roundItems.length > 0 ? (
													<>
														<CheckCircle2 className="h-4 w-4 text-amber-300" />
														<span className="text-amber-200/90">
															Ready to submit
														</span>
													</>
												) : (
													<>
														<XCircle className="h-4 w-4 text-amber-300" />
														<span className="text-amber-200/80">In progress</span>
													</>
												)}
											</div>
										</div>
									</div>
								</div>
							</section>

							<section className={`${PANEL_CLASS} min-w-0 p-3`}>
								<div className="overflow-x-auto">
									<div
										className="items-start gap-4"
										style={{
											display: "grid",
											gridTemplateColumns: "320px minmax(0, 1fr)",
											minWidth: 1020,
										}}
									>
										<div className="min-w-0">
											<div className="mb-3 flex items-center justify-between">
												<div>
													<div className="text-[10px] uppercase tracking-[0.22em] text-amber-400/70">
														Resources
													</div>
													<div className="mt-1 text-sm font-semibold text-amber-100">
														Available Items
													</div>
												</div>

												<span className="rounded-full border border-amber-900/50 px-2 py-0.5 text-[11px] text-amber-200/70">
													{placedItems.length}/{roundItems.length}
												</span>
											</div>

											<div className="grid grid-cols-2 gap-2">
												{roundItems.map((item) => {
													const isPlaced = placedItems.some(
														(entry) => entry.itemId === item.id,
													);
													const isSelected = selectedItemId === item.id;
													const rotated = Boolean(rotatedItemIds[item.id]);
													const footprint = getItemFootprint(item, rotated);

													return (
														<button
															key={item.id}
															type="button"
															disabled={isPlaced || completed || failed}
															onClick={() => setSelectedItemId(item.id)}
															className={`w-full rounded-lg border p-2.5 text-left transition-all duration-200 ${isPlaced
																? "cursor-not-allowed border-zinc-800 bg-zinc-950/40 text-zinc-500"
																: isSelected
																	? "border-amber-700/50 bg-amber-950/20 text-amber-100"
																	: "border-amber-900/50 bg-black/40 text-amber-200/80 hover:border-amber-700/40 hover:bg-amber-950/20 hover:text-amber-100 cursor-pointer"
																}`}
														>
															<div className="flex items-center gap-2.5">
																<div
																	className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${item.colorClass}`}
																>
																	<ResourceGearIcon
																		resourceId={item.icon}
																		className="h-4 w-4"
																	/>
																</div>

																<div className="min-w-0 flex-1">
																	<div className="truncate text-sm font-medium">
																		{item.name}
																	</div>
																	<div className="mt-0.5 text-[11px] text-amber-200/55">
																		Size: {footprint.width} x {footprint.height}
																	</div>
																</div>
															</div>
														</button>
													);
												})}
											</div>
										</div>

										<div className="min-w-0">
											<div className="mb-3 flex items-center justify-between gap-3">
												<div>
													<div className="text-[10px] uppercase tracking-[0.22em] text-amber-400/70">
														Locker Grid
													</div>
													<div className="mt-1 text-sm font-semibold text-amber-100">
														4 x 4 Storage
													</div>
												</div>

												<button
													type="button"
													onClick={() => {
														if (!selectedItem || completed || failed) return;
														setRotatedItemIds((current) => ({
															...current,
															[selectedItem.id]: !current[selectedItem.id],
														}));
													}}
													disabled={!selectedItem || completed || failed}
													className={`${BUTTON_CLASS} inline-flex items-center gap-2 px-2.5 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40`}
												>
													<RotateCw className="h-3.5 w-3.5" />
													Rotate (R)
												</button>
											</div>

											<div className="flex w-full justify-center py-1">
												<div
													className="relative overflow-hidden rounded-2xl border border-amber-900/30 bg-black/30"
													style={{ width: GRID_PIXEL_WIDTH }}
												>
													<div
														className="pointer-events-none absolute inset-0"
														style={{
															background:
																"radial-gradient(520px circle at 20% 30%, rgba(200,160,90,0.04), transparent 45%), radial-gradient(420px circle at 80% 60%, rgba(200,160,90,0.03), transparent 40%)",
														}}
														aria-hidden
													/>

													<div
														className="relative grid"
														style={{
															gap: `${CELL_GAP}px`,
															padding: `${GRID_PADDING}px`,
															gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`,
															gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_SIZE}px)`,
														}}
													>
														{Array.from({ length: GRID_ROWS }).map((_, row) =>
															Array.from({ length: GRID_COLS }).map(
																(__, col) => {
																	const isPreviewCell = (() => {
																		if (!selectedItem || !hoverCell) {
																			return false;
																		}

																		const footprint = getItemFootprint(
																			selectedItem,
																			selectedRotated,
																		);

																		return (
																			col >= hoverCell.x &&
																			col <
																			hoverCell.x + footprint.width &&
																			row >= hoverCell.y &&
																			row <
																			hoverCell.y + footprint.height
																		);
																	})();

																	return (
																		<button
																			key={`${row}-${col}`}
																			type="button"
																			onMouseEnter={() =>
																				setHoverCell({
																					x: col,
																					y: row,
																				})
																			}
																			onFocus={() =>
																				setHoverCell({
																					x: col,
																					y: row,
																				})
																			}
																			onClick={handlePlaceSelected}
																			disabled={completed || failed}
																			className={`rounded-lg border text-[10px] transition-colors ${isPreviewCell
																				? hoverPlacementValid
																					? "border-emerald-500/60 bg-emerald-500/10"
																					: "border-red-500/60 bg-red-500/10"
																				: "border-amber-900/30 bg-black/20 hover:border-amber-700/40"
																				} disabled:cursor-not-allowed`}
																			style={{
																				width: CELL_SIZE,
																				height: CELL_SIZE,
																			}}
																		/>
																	);
																},
															),
														)}

														{placedItems.map((entry) => {
															const item = roundItems.find(
																(candidate) => candidate.id === entry.itemId,
															);
															if (!item) return null;

															const footprint = getItemFootprint(
																item,
																entry.rotated,
															);
															const isSelectedPlaced =
																selectedItemId === item.id;

															return (
																<button
																	key={item.id}
																	type="button"
																	onClick={() => handlePickupPlaced(item.id)}
																	className={`absolute flex items-center justify-center rounded-xl border p-1.5 text-center shadow-lg shadow-black/30 transition-transform hover:scale-[1.02] cursor-pointer ${item.colorClass
																		} ${isSelectedPlaced
																			? "ring-2 ring-amber-400/70"
																			: ""
																		}`}
																	style={{
																		left:
																			GRID_PADDING +
																			entry.x * (CELL_SIZE + CELL_GAP),
																		top:
																			GRID_PADDING +
																			entry.y * (CELL_SIZE + CELL_GAP),
																		width:
																			footprint.width * CELL_SIZE +
																			(footprint.width - 1) * CELL_GAP,
																		height:
																			footprint.height * CELL_SIZE +
																			(footprint.height - 1) * CELL_GAP,
																	}}
																>
																	<div className="flex flex-col items-center justify-center gap-1">
																		<ResourceGearIcon
																			resourceId={item.icon}
																			className="h-5 w-5"
																		/>
																		<span className="text-[9px] font-medium leading-tight">
																			{item.name}
																		</span>
																	</div>
																</button>
															);
														})}
													</div>
												</div>
											</div>

											<div className="mt-3 text-center text-[11px] text-amber-200/60">
												Place all nine resource icons, then submit.
											</div>
										</div>
									</div>
								</div>

								<div className="mt-3 overflow-x-auto">
									<div
										className="gap-2"
										style={{
											display: "grid",
											gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
											minWidth: 480,
										}}
									>
										<button
											type="button"
											onClick={handleSubmit}
											disabled={
												completed ||
												failed ||
												placedItems.length !== roundItems.length ||
												roundItems.length === 0
											}
											className="w-full rounded-lg border border-amber-700/50 bg-amber-950/20 px-3 py-2 text-xs font-medium text-amber-200 transition-colors hover:bg-amber-900/30 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
										>
											Submit
										</button>

										<button
											type="button"
											onClick={startNewRound}
											className={`${BUTTON_CLASS} w-full px-3 py-2 text-xs`}
										>
											New Round
										</button>

										<button
											type="button"
											onClick={onClose}
											className={`${BUTTON_CLASS} w-full px-3 py-2 text-xs`}
										>
											Leave
										</button>
									</div>
								</div>
							</section>
						</div>
					) : (
						<section className={`${PANEL_CLASS} p-4 sm:p-6`}>
							<div className="mx-auto max-w-3xl">
								<div className="text-[10px] uppercase tracking-[0.22em] text-amber-400/70">
									Mission Result
								</div>
								<h2 className="mt-2 text-2xl font-semibold text-amber-100">
									{rewardMode === "random-resource"
										? "Reward Draw"
										: "Practice Complete"}
								</h2>
								<p className="mt-3 text-sm leading-6 text-amber-200/75">
									{rewardMode === "random-resource"
										? "You cleared the sorter. Draw one random resource reward before leaving."
										: "This run was started from the tab version, so no reward is granted."}
								</p>

								{rewardMode === "random-resource" ? (
									<>
										<div className="mt-5 grid gap-4 md:grid-cols-3">
											{RESOURCE_TEMPLATES.map((item) => {
												const isActive = drawPreviewIcon === item.icon;

												return (
													<div
														key={item.icon}
														className={`rounded-xl border p-4 transition-all ${isActive
																? "border-amber-400 bg-amber-950/25 shadow-lg shadow-amber-900/20"
																: "border-amber-900/35 bg-black/30"
															}`}
													>
														<div className="flex items-center gap-3">
															<div
																className={`flex h-10 w-10 items-center justify-center rounded-lg border ${item.colorClass}`}
															>
																<ResourceGearIcon
																	resourceId={item.icon}
																	className="h-5 w-5"
																/>
															</div>
															<div>
																<div className="text-sm font-medium text-amber-100">
																	{item.name}
																</div>
																<div className="text-xs text-amber-200/60">
																	1 item
																</div>
															</div>
														</div>
													</div>
												);
											})}
										</div>

										<div className="mt-5 rounded-xl border border-amber-900/35 bg-black/30 p-4">
											{reward ? (
												<div>
													<div className="text-sm font-semibold text-amber-100">
														Reward Ready
													</div>
													<div className="mt-1 text-sm text-amber-200/70">
														You received {RESOURCE_TEMPLATES.find((item) => item.icon === reward.items[0]?.type)?.name}.
													</div>
												</div>
											) : isDrawingReward ? (
												<div className="text-sm text-amber-200/70">Drawing reward...</div>
											) : (
												<div className="text-sm text-amber-200/70">{RANDOM_RESOURCE_REWARD_TEXT}</div>
											)}
										</div>

										<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
											<button
												type="button"
												onClick={onClose}
												className={`${BUTTON_CLASS} px-4 py-2 text-sm`}
											>
												Leave
											</button>

											{reward ? (
												<button
													type="button"
													onClick={handleClaimReward}
													className="rounded-lg border border-amber-700/50 bg-amber-950/20 px-4 py-2 text-sm font-medium text-amber-200 transition-colors hover:bg-amber-900/30"
												>
													Claim Reward
												</button>
											) : (
												<button
													type="button"
													onClick={handleDrawReward}
													disabled={isDrawingReward}
													className="rounded-lg border border-amber-700/50 bg-amber-950/20 px-4 py-2 text-sm font-medium text-amber-200 transition-colors hover:bg-amber-900/30 disabled:cursor-not-allowed disabled:opacity-40"
												>
													{isDrawingReward ? "Drawing..." : "Draw Reward"}
												</button>
											)}
										</div>
									</>
								) : (
									<div className="mt-6 flex justify-end">
										<button
											type="button"
											onClick={onClose}
											className={`${BUTTON_CLASS} px-4 py-2 text-sm`}
										>
											Close
										</button>
									</div>
								)}
							</div>
						</section>
					)}
				</div>
			</div>
		</div>,
		document.body,
	);
}
