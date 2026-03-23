"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapMarker, MarkerKind } from "../../lib/gameTypes";

type Props = {
	saveKey: string;
};

type Viewport = {
	zoom: number; // 1 = normal, <1 zoomed out
};

const BASE = { x: 0.5, y: 0.62 };

function clamp01(v: number) {
	return Math.max(0, Math.min(1, v));
}

function rnd(min: number, max: number) {
	return min + Math.random() * (max - min);
}

function newId(prefix: string) {
	return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function kindLabel(kind: MarkerKind) {
	if (kind === "incident") return "Incident";
	if (kind === "theft") return "Theft";
	return "Hire";
}

function kindColor(kind: MarkerKind) {
	if (kind === "incident") return "rgba(255,120,120,0.95)";
	if (kind === "theft") return "rgba(255,210,120,0.95)";
	return "rgba(180,210,255,0.95)";
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
	return Math.hypot(a.x - b.x, a.y - b.y);
}

function mapToScreen(
	p: { x: number; y: number },
	w: number,
	h: number,
	vp: Viewport,
): { x: number; y: number } {
	// zoom around center; zoom < 1 => show more area
	const cx = 0.5;
	const cy = 0.5;
	const zx = (p.x - cx) / vp.zoom + cx;
	const zy = (p.y - cy) / vp.zoom + cy;
	return { x: zx * w, y: zy * h };
}

function screenToMap(
	p: { x: number; y: number },
	w: number,
	h: number,
	vp: Viewport,
): { x: number; y: number } {
	const cx = 0.5;
	const cy = 0.5;
	const mx = p.x / w;
	const my = p.y / h;
	const zx = (mx - cx) * vp.zoom + cx;
	const zy = (my - cy) * vp.zoom + cy;
	return { x: zx, y: zy };
}

type GameState = {
	zoomUnlock: number; // 0..1
	markers: MapMarker[];
	selectedId: string | null;
};

function initialState(): GameState {
	const now = Date.now();
	return {
		zoomUnlock: 0,
		selectedId: null,
		markers: [
			{
				id: "base-hire",
				kind: "hire",
				x: BASE.x,
				y: BASE.y,
				title: "Home Base",
				details:
					"A familiar voice offers new hires. Click to run a background check.",
				createdAt: now,
			},
		],
	};
}

function loadState(saveKey: string): GameState {
	try {
		const raw = localStorage.getItem(saveKey);
		if (!raw) return initialState();
		const parsed = JSON.parse(raw) as Partial<GameState>;
		if (!Array.isArray(parsed.markers)) return initialState();
		return {
			zoomUnlock:
				typeof parsed.zoomUnlock === "number" ? parsed.zoomUnlock : 0,
			selectedId:
				typeof parsed.selectedId === "string"
					? parsed.selectedId
					: null,
			markers: parsed.markers as MapMarker[],
		};
	} catch {
		return initialState();
	}
}

function saveState(saveKey: string, state: GameState) {
	localStorage.setItem(saveKey, JSON.stringify(state));
}

export default function MapScene({ saveKey }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const wrapRef = useRef<HTMLDivElement>(null);

	const [state, setState] = useState<GameState>(() => loadState(saveKey));
	const [size, setSize] = useState({ w: 800, h: 600 });

	useEffect(() => {
		setState(loadState(saveKey));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [saveKey]);

	useEffect(() => {
		saveState(saveKey, state);
	}, [saveKey, state]);

	const viewport: Viewport = useMemo(() => {
		// locked zoom = closer; unlock => zoom out
		const minZoom = 1.15;
		const maxZoomOut = 0.8;
		const t = clamp01(state.zoomUnlock);
		const zoom = minZoom + (maxZoomOut - minZoom) * t;
		return { zoom };
	}, [state.zoomUnlock]);

	// Keep canvas sized to container
	useEffect(() => {
		const el = wrapRef.current;
		if (!el) return;
		const ro = new ResizeObserver((entries) => {
			const cr = entries[0]?.contentRect;
			if (!cr) return;
			setSize({
				w: Math.max(320, Math.floor(cr.width)),
				h: Math.max(320, Math.floor(cr.height)),
			});
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	// Dynamic incident/theft generation + expiry cleanup
	useEffect(() => {
		const interval = window.setInterval(() => {
			setState((s) => {
				const now = Date.now();
				// remove expired markers (never remove hire marker)
				const filtered = s.markers.filter(
					(m) =>
						m.kind === "hire" || !m.expiresAt || m.expiresAt > now,
				);

				let next = { ...s, markers: filtered };

				const activeCount = filtered.filter(
					(m) => m.kind !== "hire",
				).length;
				const spawnChance = activeCount < 5 ? 0.55 : 0.25;
				if (Math.random() < spawnChance) {
					const kind: MarkerKind =
						Math.random() < 0.72 ? "incident" : "theft";
					// spawn farther away as zoom unlock increases
					const radius = 0.08 + next.zoomUnlock * 0.32;
					let x = clamp01(BASE.x + rnd(-radius, radius));
					let y = clamp01(BASE.y + rnd(-radius, radius));
					// avoid too close to base
					if (distance({ x, y }, BASE) < 0.06) {
						x = clamp01(BASE.x + (x > BASE.x ? 0.08 : -0.08));
						y = clamp01(BASE.y + (y > BASE.y ? 0.08 : -0.08));
					}

					const ttlMs = kind === "incident" ? 90_000 : 70_000;
					const marker: MapMarker = {
						id: newId(kind),
						kind,
						x,
						y,
						title:
							kind === "incident"
								? "Incoming Call"
								: "Theft Opportunity",
						details:
							kind === "incident"
								? "A report just came in. Send the right crew before it escalates."
								: "A soft target. Risky, but it could fill your inventory.",
						createdAt: now,
						expiresAt: now + ttlMs,
					};
					next = { ...next, markers: [...filtered, marker] };
				}

				// If selected marker expired, clear selection
				if (
					next.selectedId &&
					!next.markers.some((m) => m.id === next.selectedId)
				) {
					next = { ...next, selectedId: null };
				}

				return next;
			});
		}, 4500);

		return () => window.clearInterval(interval);
	}, []);

	// Draw loop
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let raf = 0;
		let frame = 0;

		const drawGrid = (w: number, h: number) => {
			ctx.save();
			ctx.globalAlpha = 0.6;
			ctx.strokeStyle = "rgba(255,255,255,0.06)";
			ctx.lineWidth = 1;
			const step = Math.max(26, Math.floor(60 * (1 / viewport.zoom)));
			for (let x = 0; x <= w; x += step) {
				ctx.beginPath();
				ctx.moveTo(x + 0.5, 0);
				ctx.lineTo(x + 0.5, h);
				ctx.stroke();
			}
			for (let y = 0; y <= h; y += step) {
				ctx.beginPath();
				ctx.moveTo(0, y + 0.5);
				ctx.lineTo(w, y + 0.5);
				ctx.stroke();
			}
			ctx.restore();
		};

		const drawFog = (w: number, h: number) => {
			// simulate "locked map": vignette + tighter spotlight when zoomUnlock is low
			const t = clamp01(state.zoomUnlock);
			const strength = 0.78 - t * 0.38;
			const r = (0.35 + t * 0.35) * Math.min(w, h);
			const base = mapToScreen(BASE, w, h, viewport);

			const g = ctx.createRadialGradient(
				base.x,
				base.y,
				r * 0.4,
				base.x,
				base.y,
				r,
			);
			g.addColorStop(0, `rgba(0,0,0,0)`);
			g.addColorStop(0.65, `rgba(0,0,0,${strength})`);
			g.addColorStop(1, `rgba(0,0,0,0.92)`);
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, w, h);
		};

		const draw = () => {
			const w = size.w;
			const h = size.h;
			canvas.width = w;
			canvas.height = h;

			// base background
			ctx.clearRect(0, 0, w, h);
			const bg = ctx.createLinearGradient(0, 0, 0, h);
			bg.addColorStop(0, "#0b0b0d");
			bg.addColorStop(1, "#070608");
			ctx.fillStyle = bg;
			ctx.fillRect(0, 0, w, h);

			// subtle animated glow
			const pulse = 0.5 + Math.sin(frame * 0.03) * 0.5;
			ctx.fillStyle = `rgba(200,160,90,${0.02 + pulse * 0.01})`;
			ctx.fillRect(0, 0, w, h);

			drawGrid(w, h);

			// draw line from base to selected marker (or nearest active marker if none selected)
			const base = mapToScreen(BASE, w, h, viewport);
			const selected =
				(state.selectedId &&
					state.markers.find((m) => m.id === state.selectedId)) ||
				state.markers.find((m) => m.kind === "incident") ||
				state.markers.find((m) => m.kind === "theft") ||
				null;

			if (selected && selected.kind !== "hire") {
				const dest = mapToScreen(selected, w, h, viewport);
				ctx.save();
				ctx.strokeStyle = "rgba(200,160,90,0.45)";
				ctx.lineWidth = 2;
				ctx.setLineDash([6, 8]);
				ctx.lineDashOffset = -frame * 0.9;
				ctx.beginPath();
				ctx.moveTo(base.x, base.y);
				ctx.lineTo(dest.x, dest.y);
				ctx.stroke();
				ctx.restore();
			}

			// markers
			for (const m of state.markers) {
				const p = mapToScreen(m, w, h, viewport);
				const selected = m.id === state.selectedId;

				ctx.save();
				const r = m.kind === "hire" ? 10 : 8;
				const c = kindColor(m.kind);
				ctx.fillStyle = c;
				ctx.shadowColor = c;
				ctx.shadowBlur = selected ? 18 : 10;
				ctx.beginPath();
				ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
				ctx.fill();

				// inner dot
				ctx.shadowBlur = 0;
				ctx.fillStyle = "rgba(0,0,0,0.45)";
				ctx.beginPath();
				ctx.arc(p.x, p.y, Math.max(2, r - 5), 0, Math.PI * 2);
				ctx.fill();

				// selection ring
				if (selected) {
					ctx.strokeStyle = "rgba(255,255,255,0.35)";
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.arc(p.x, p.y, r + 6, 0, Math.PI * 2);
					ctx.stroke();
				}

				ctx.restore();
			}

			drawFog(w, h);

			frame++;
			raf = requestAnimationFrame(draw);
		};

		raf = requestAnimationFrame(draw);
		return () => cancelAnimationFrame(raf);
	}, [
		size.w,
		size.h,
		state.markers,
		state.selectedId,
		state.zoomUnlock,
		viewport,
	]);

	const selectedMarker = useMemo(() => {
		return state.selectedId
			? (state.markers.find((m) => m.id === state.selectedId) ?? null)
			: null;
	}, [state.markers, state.selectedId]);

	const onClickCanvas = (e: React.MouseEvent) => {
		const rect = (
			e.currentTarget as HTMLCanvasElement
		).getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const mp = screenToMap({ x, y }, rect.width, rect.height, viewport);
		let hit: MapMarker | null = null;
		let best = Infinity;
		for (const m of state.markers) {
			const d = Math.hypot(mp.x - m.x, mp.y - m.y);
			const thresh = m.kind === "hire" ? 0.03 : 0.025;
			if (d < thresh && d < best) {
				best = d;
				hit = m;
			}
		}

		setState((s) => ({ ...s, selectedId: hit ? hit.id : null }));
	};

	const resolveSelected = () => {
		if (!selectedMarker) return;
		if (selectedMarker.kind === "hire") {
			// placeholder "minigame"
			setState((s) => ({
				...s,
				selectedId: selectedMarker.id,
				zoomUnlock: clamp01(s.zoomUnlock + 0.02),
			}));
			return;
		}

		setState((s) => {
			const remaining = s.markers.filter(
				(m) => m.id !== selectedMarker.id,
			);
			return {
				...s,
				markers: remaining,
				selectedId: null,
				zoomUnlock: clamp01(
					s.zoomUnlock +
						(selectedMarker.kind === "incident" ? 0.08 : 0.06),
				),
			};
		});
	};

	return (
		<div className="relative w-full h-[calc(100vh-7rem)] rounded-2xl border border-amber-900/30 bg-black/30 overflow-hidden">
			<div ref={wrapRef} className="absolute inset-0">
				<canvas
					ref={canvasRef}
					onClick={onClickCanvas}
					className="absolute inset-0 w-full h-full cursor-crosshair"
					aria-label="City map"
				/>
			</div>

			<div className="absolute left-4 top-4 z-10">
				<div className="rounded-xl border border-amber-900/40 bg-black/35 backdrop-blur-md px-4 py-3 text-amber-200/70 w-[320px] max-w-[80vw]">
					<div className="text-[11px] uppercase tracking-[0.22em] text-amber-400/70">
						Map
					</div>
					<div className="mt-1 text-sm">
						<span className="text-amber-200/80">Zoom unlock:</span>{" "}
						{Math.round(state.zoomUnlock * 100)}%
					</div>
					<div className="mt-1 text-xs text-amber-200/50">
						Markers appear over time. Click a marker to view
						details.
					</div>
				</div>
			</div>

			<div className="absolute right-4 top-4 z-10">
				<div className="rounded-xl border border-amber-900/40 bg-black/35 backdrop-blur-md px-4 py-3 w-[360px] max-w-[85vw] text-left">
					{selectedMarker ? (
						<>
							<div className="text-[11px] uppercase tracking-[0.22em] text-amber-400/70">
								{kindLabel(selectedMarker.kind)}
							</div>
							<div className="mt-1 text-base font-semibold text-amber-100">
								{selectedMarker.title}
							</div>
							<p className="mt-2 text-sm text-amber-200/60">
								{selectedMarker.details}
							</p>
							{selectedMarker.expiresAt && (
								<p className="mt-2 text-xs text-amber-200/40">
									Expires in{" "}
									{Math.max(
										0,
										Math.ceil(
											(selectedMarker.expiresAt -
												Date.now()) /
												1000,
										),
									)}
									s
								</p>
							)}
							<div className="mt-3 flex gap-2">
								<button
									type="button"
									onClick={resolveSelected}
									className="flex-1 py-2.5 rounded-lg border border-amber-700/50 bg-amber-950/20 text-amber-200 font-medium hover:bg-amber-900/30 transition-colors cursor-pointer"
								>
									{selectedMarker.kind === "hire"
										? "Start Hire Check"
										: "Resolve"}
								</button>
								<button
									type="button"
									onClick={() =>
										setState((s) => ({
											...s,
											selectedId: null,
										}))
									}
									className="px-3 py-2.5 rounded-lg border border-amber-900/40 bg-black/30 text-amber-200/70 hover:bg-amber-950/20 transition-colors cursor-pointer"
								>
									Close
								</button>
							</div>
						</>
					) : (
						<>
							<div className="text-[11px] uppercase tracking-[0.22em] text-amber-400/70">
								No Selection
							</div>
							<div className="mt-1 text-sm text-amber-200/60">
								Click a marker to view details.
							</div>
							<div className="mt-3 grid grid-cols-3 gap-2 text-xs text-amber-200/50">
								<div className="flex items-center gap-2">
									<span
										className="inline-block w-2.5 h-2.5 rounded-full"
										style={{
											background: kindColor("incident"),
										}}
									/>
									Incidents
								</div>
								<div className="flex items-center gap-2">
									<span
										className="inline-block w-2.5 h-2.5 rounded-full"
										style={{
											background: kindColor("theft"),
										}}
									/>
									Theft
								</div>
								<div className="flex items-center gap-2">
									<span
										className="inline-block w-2.5 h-2.5 rounded-full"
										style={{
											background: kindColor("hire"),
										}}
									/>
									Base
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
