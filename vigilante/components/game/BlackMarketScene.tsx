"use client";

import { useEffect, useRef, useState } from "react";
import { ResourceGearIcon } from "@/components/game/ResourceGearIcon";
import {
	SHOP_RESOURCES,
	SHOP_UPGRADES,
	type ShopItem,
} from "@/lib/shopCatalog";

type ItemCategory = "resource" | "upgrade";

export type MarketPurchasePayload =
	| { category: "resource"; itemId: string; cost: number }
	| { category: "upgrade"; itemId: string; cost: number };

/* ── Hash-based upgrade color ── */
function upgradeColor(name: string): { color: string; bg: string; border: string; glow: string } {
	let h = 0;
	for (let i = 0; i < name.length; i++) h = (Math.imul(37, h) + name.charCodeAt(i)) | 0;
	const hue = ((h >>> 0) % 360);
	return {
		color:  `hsl(${hue}, 90%, 72%)`,
		bg:     `hsla(${hue}, 70%, 20%, 0.12)`,
		border: `hsla(${hue}, 80%, 60%, 0.28)`,
		glow:   `hsla(${hue}, 80%, 60%, 0.22)`,
	};
}

/* ── Lerp ── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ── Canvas background ── */
function useMarketCanvas(size: { w: number; h: number }, targetT: number) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const curT = useRef(targetT);
	const tgtT = useRef(targetT);

	useEffect(() => { tgtT.current = targetT; }, [targetT]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let raf = 0, frame = 0;

		const draw = () => {
			curT.current = lerp(curT.current, tgtT.current, 0.08);
			const t = curT.current;
			const { w, h } = size;
			canvas.width = w; canvas.height = h;
			ctx.clearRect(0, 0, w, h);
			ctx.fillStyle = "#050810";
			ctx.fillRect(0, 0, w, h);

			const pulse = 0.5 + Math.sin(frame * 0.018) * 0.5;
			const ar = Math.round(lerp(15, 10, t)), ag = Math.round(lerp(50, 40, t)), ab = Math.round(lerp(25, 60, t));
			ctx.fillStyle = `rgba(${ar},${ag},${ab},${lerp(0.12, 0.14, t) + pulse * 0.06})`;
			ctx.fillRect(0, 0, w, h);

			ctx.save();
			ctx.strokeStyle = `rgba(${Math.round(lerp(50,50,t))},${Math.round(lerp(190,180,t))},${Math.round(lerp(70,220,t))},${lerp(0.07,0.085,t)})`;
			ctx.lineWidth = 1;
			for (let x = 0; x <= w; x += 48) { ctx.beginPath(); ctx.moveTo(x+.5,0); ctx.lineTo(x+.5,h); ctx.stroke(); }
			for (let y = 0; y <= h; y += 48) { ctx.beginPath(); ctx.moveTo(0,y+.5); ctx.lineTo(w,y+.5); ctx.stroke(); }
			ctx.restore();

			ctx.save();
			ctx.globalAlpha = 0.045;
			const sr = Math.round(lerp(0,80,t)), sg = Math.round(lerp(255,220,t)), sb = Math.round(lerp(80,255,t));
			ctx.fillStyle = `rgba(${sr},${sg},${sb},1)`;
			for (let y = frame % 3; y < h; y += 3) ctx.fillRect(0, y, w, 1);
			ctx.restore();

			const vg = ctx.createRadialGradient(w/2,h/2,h*.3,w/2,h/2,h*.9);
			vg.addColorStop(0,"rgba(0,0,0,0)"); vg.addColorStop(1,"rgba(0,0,0,0.85)");
			ctx.fillStyle = vg; ctx.fillRect(0,0,w,h);

			frame++; raf = requestAnimationFrame(draw);
		};
		raf = requestAnimationFrame(draw);
		return () => cancelAnimationFrame(raf);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [size]);

	return canvasRef;
}

type Props = {
	onClose: () => void;
	credits: number;
	resourcePool: Record<string, { qty: number; deployed: number }>;
	purchasedUpgradeIds: string[];
	onPurchase: (payload: MarketPurchasePayload) => Promise<void>;
};

export default function BlackMarketScene({
	onClose,
	credits = 0,
	resourcePool = {},
	purchasedUpgradeIds = [],
	onPurchase,
}: Props) {
	const wrapRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({ w: 800, h: 600 });
	const [activeCategory, setActiveCategory] = useState<ItemCategory>("resource");
	const [flash, setFlash] = useState<string | null>(null);
	const [notification, setNotification] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const isUpgrades = activeCategory === "upgrade";
	const canvasRef = useMarketCanvas(size, isUpgrades ? 1 : 0);

	const getResourceCount = (id: string) => resourcePool[id]?.qty ?? 0;
	const isUpgradeOwned = (id: string) => purchasedUpgradeIds.includes(id);

	useEffect(() => {
		const el = wrapRef.current;
		if (!el) return;
		const ro = new ResizeObserver((entries) => {
			const cr = entries[0]?.contentRect;
			if (cr) setSize({ w: Math.max(320, Math.floor(cr.width)), h: Math.max(320, Math.floor(cr.height)) });
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	const buy = async (item: ShopItem) => {
		if (saving) return;
		if (item.category === "upgrade" && isUpgradeOwned(item.id)) return;
		if (credits < item.cost) {
			setNotification("Insufficient funds.");
			setTimeout(() => setNotification(null), 1800);
			return;
		}
		setSaving(true);
		try {
			await onPurchase({ category: item.category, itemId: item.id, cost: item.cost });
			setFlash(item.id);
			setNotification(`Acquired: ${item.name}`);
			setTimeout(() => setFlash(null), 600);
			setTimeout(() => setNotification(null), 1800);
		} catch (err) {
			console.error("[BlackMarket] Purchase failed:", err);
			setNotification("Purchase failed. Try again.");
			setTimeout(() => setNotification(null), 2200);
		} finally {
			setSaving(false);
		}
	};

	// CSS theme vars
	const dur = "duration-500";
	const outerBorder  = isUpgrades ? "border-cyan-900/30"  : "border-green-900/30";
	const panelBorder  = isUpgrades ? "border-cyan-900/40"  : "border-green-900/40";
	const accentLabel  = isUpgrades ? "text-cyan-500/55"    : "text-green-500/55";
	const headerText   = isUpgrades ? "text-cyan-100/90"    : "text-green-100/90";
	const quoteText    = isUpgrades ? "text-cyan-200/35"    : "text-green-200/35";
	const balanceText  = isUpgrades ? "text-cyan-300"       : "text-green-300";
	const toastStyle   = isUpgrades ? "border-cyan-700/50 text-cyan-300" : "border-green-700/50 text-green-300";

	return (
		<div
			className={`fixed inset-0 z-[1100] border bg-black/80 overflow-hidden transition-colors ${dur} ${outerBorder}`}
			style={{ fontFamily: "'JetBrains Mono', 'Fira Mono', monospace" }}
		>
			<div ref={wrapRef} className="absolute inset-0">
				<canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />
			</div>

			{/* ── Header: label + tabs + balance (inline) ── */}
			<div className="absolute left-4 top-4 z-10">
				<div className={`rounded-xl border bg-black/40 backdrop-blur-md px-4 py-3 transition-colors ${dur} ${panelBorder}`}>
					<div className="flex items-center gap-4 flex-wrap">
						{/* Title */}
						<div className="shrink-0">
							<div className={`text-[10px] uppercase tracking-[0.28em] transition-colors ${dur} ${accentLabel}`}>
								⚠ Restricted Access
							</div>
							<div className={`mt-0.5 text-base font-bold transition-colors ${dur} ${headerText}`}>
								Black Market
							</div>
						</div>

						<div className={`h-8 w-px transition-colors ${dur} ${isUpgrades ? "bg-cyan-800/30" : "bg-green-800/30"}`} />

						{/* Tabs */}
						<div className="flex gap-2">
							{(["resource", "upgrade"] as const).map((cat) => {
								const active = activeCategory === cat;
								const up = cat === "upgrade";
								return (
									<button
										key={cat}
										type="button"
										onClick={() => setActiveCategory(cat)}
										className={`text-[12px] uppercase tracking-[0.22em] font-semibold px-5 py-2 rounded-lg border transition-all ${dur} cursor-pointer ${
											active
												? up ? "border-cyan-600/70 bg-cyan-950/50 text-cyan-200"
												     : "border-green-600/70 bg-green-950/50 text-green-200"
												: up ? "border-cyan-900/30 bg-black/20 text-cyan-200/35 hover:text-cyan-200/65 hover:border-cyan-800/45"
												     : "border-green-900/30 bg-black/20 text-green-200/35 hover:text-green-200/65 hover:border-green-800/45"
										}`}
									>
										{cat === "resource" ? "Resources" : "Upgrades"}
									</button>
								);
							})}
						</div>

						<div className={`h-8 w-px transition-colors ${dur} ${isUpgrades ? "bg-cyan-800/30" : "bg-green-800/30"}`} />

						{/* Balance — sits in-line with header panel */}
						<div className="shrink-0">
							<div className={`text-[10px] uppercase tracking-[0.22em] transition-colors ${dur} ${accentLabel}`}>
								Balance
							</div>
							<div className={`mt-0.5 text-xl font-bold transition-colors ${dur} ${balanceText}`}>
								₵ {credits.toLocaleString()}
							</div>
						</div>
					</div>

					<p className={`mt-2 text-[11px] italic transition-colors ${dur} ${quoteText}`}>
						"Don't ask. Don't tell. Pay up."
					</p>
				</div>
			</div>

			{saving && (
				<div className="absolute left-4 bottom-4 z-20">
					<div className={`text-[10px] uppercase tracking-[0.2em] ${isUpgrades ? "text-cyan-400/50" : "text-green-400/50"}`}>
						Saving…
					</div>
				</div>
			)}

			{notification && (
				<div className={`absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-lg border bg-black/75 backdrop-blur-md px-4 py-2 text-xs tracking-[0.14em] whitespace-nowrap ${toastStyle}`}>
					{notification}
				</div>
			)}

			{/* ── Item grid ── */}
			<div className="absolute inset-x-0 bottom-0 top-[120px] overflow-y-auto px-4 pb-6 z-10 pt-2">
				{isUpgrades ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{SHOP_UPGRADES.map((item) => {
							const col = upgradeColor(item.name);
							const maxed = isUpgradeOwned(item.id);
							const canAfford = credits >= item.cost;
							const isFlashing = flash === item.id;

							return (
								<div
									key={item.id}
									className={`relative rounded-xl border backdrop-blur-sm transition-all duration-300 p-5 ${maxed ? "opacity-80" : isFlashing ? "scale-[1.01]" : "hover:scale-[1.01]"}`}
									style={{
										borderColor: maxed ? "rgba(255,255,255,0.06)" : col.border,
										background:  maxed ? "rgba(0,0,0,0.18)" : col.bg,
										boxShadow:   maxed ? "none" : `0 0 28px 0 ${col.glow}`,
									}}
								>
									<div
										className="text-base font-bold mb-2"
										style={{ color: maxed ? "rgba(255,255,255,0.25)" : col.color }}
									>
										{item.name}
										{maxed && (
											<span className="ml-3 text-[10px] uppercase tracking-[0.18em] text-white/25">
												Owned
											</span>
										)}
									</div>

									<p
										className="text-xs leading-relaxed mb-5"
										style={{ color: maxed ? "rgba(255,255,255,0.2)" : "rgba(210,240,255,0.60)" }}
									>
										{item.description}
									</p>

									<div className="flex items-center justify-between gap-3">
										<span
											className="text-lg font-bold"
											style={{ color: maxed ? "rgba(255,255,255,0.18)" : canAfford ? col.color : "rgba(255,255,255,0.22)" }}
										>
											₵ {item.cost.toLocaleString()}
										</span>
										{!maxed && (
											<button
												type="button"
												onClick={() => buy(item)}
												disabled={!canAfford || saving}
												className="text-[12px] uppercase tracking-[0.16em] font-bold px-5 py-2.5 rounded-lg border transition-all cursor-pointer"
												style={
													canAfford && !saving
														? { color: "#050810", background: col.color, borderColor: col.color }
														: { color: "rgba(255,255,255,0.18)", background: "rgba(0,0,0,0.25)", borderColor: "rgba(255,255,255,0.08)", cursor: "not-allowed" }
												}
											>
												{canAfford ? "Acquire" : "No Funds"}
											</button>
										)}
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="flex flex-col gap-5">
						{SHOP_RESOURCES.map((resource) => {
							const count = getResourceCount(resource.id);
							const canAfford = credits >= resource.cost;
							const isFlashing = flash === resource.id;

							return (
								<div
									key={resource.id}
									className={`relative rounded-xl border transition-all duration-150 backdrop-blur-sm px-7 py-6 flex items-center gap-7 ${
										isFlashing
											? "border-green-500/55 bg-green-950/25"
											: "border-green-900/35 bg-black/30 hover:border-green-800/50 hover:bg-green-950/10"
									}`}
								>
									<div className="shrink-0 w-16 h-16 rounded-xl border border-green-800/40 bg-green-950/30 flex items-center justify-center">
										<ResourceGearIcon resourceId={resource.id} className="text-2xl" />
									</div>

									<div className="flex-1 min-w-0">
										<div className="text-lg font-bold text-green-100/90 mb-1">{resource.name}</div>
										<p className="text-sm text-green-200/50 leading-relaxed">{resource.description}</p>
									</div>

									<div className="shrink-0 flex items-center gap-6">
										<div className="text-right">
											<div className={`text-xl font-bold ${canAfford ? "text-green-300/90" : "text-green-200/28"}`}>
												₵ {resource.cost.toLocaleString()}
											</div>
											{count > 0 && (
												<div className="text-xs text-green-400/50 tracking-wide mt-0.5">×{count} held</div>
											)}
										</div>
										<button
											type="button"
											onClick={() => buy(resource)}
											disabled={!canAfford || saving}
											className={`text-sm uppercase tracking-[0.14em] font-semibold px-6 py-3 rounded-lg border transition-all ${
												canAfford && !saving
													? "border-green-400/70 bg-green-500/20 text-green-200 hover:bg-green-500/35 hover:border-green-400/90 cursor-pointer"
													: "border-green-900/20 bg-black/20 text-green-200/20 cursor-not-allowed"
											}`}
										>
											{canAfford ? "Acquire" : "No Funds"}
										</button>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}