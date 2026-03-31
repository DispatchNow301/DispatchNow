"use client";

import React, { useEffect, useRef, useState, useCallback, Key } from "react";

// ── Layout ───────────────────────────────────────────────────────────
const BAR_H = 550;
const BAR_W = 100;
const CVS_W = BAR_W;
const CVS_H = BAR_H;
const RECT_H = 150;
const FIRE_PX = 70;

// ── Physics ──────────────────────────────────────────────────────────
const GRAVITY = 0.07;
const LIFT = -0.08;
const BOUNCE = 0.3;
const MAX_VEL = 6;

interface FireBall {
	y: number;
	vy: number;
	health: number;
	born: number;
	deadAt: number | null;
}

interface Ember {
	x: number;
	y: number;
	vy: number;
	alpha: number;
	size: number;
}

interface GameState {
	rectY: number;
	rectVY: number;
	pressing: boolean;
	fires: FireBall[];
	embers: Ember[];
	progress: number;
	lastTime: number;
	lastSpread: number;
	lastEmpty: number | null;
	done: boolean;
}

function makeFire(baseSpeed: number, nearY?: number, health = 1.0): FireBall {
	const y =
		nearY !== undefined
			? Math.max(
					0,
					Math.min(
						BAR_H - FIRE_PX,
						nearY + (Math.random() - 0.5) * 80,
					),
				)
			: Math.random() * (BAR_H - FIRE_PX);
	const speed = baseSpeed * (0.7 + Math.random() * 0.7);
	return {
		y,
		vy: Math.random() < 0.5 ? speed : -speed,
		health,
		born: performance.now(),
		deadAt: null,
	};
}

function drawRoundRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number,
) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (typeof (ctx as any).roundRect === "function") {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(ctx as any).roundRect(x, y, w, h, r);
	} else {
		const c = Math.min(r, w / 2, h / 2);
		ctx.moveTo(x + c, y);
		ctx.lineTo(x + w - c, y);
		ctx.arcTo(x + w, y, x + w, y + h, c);
		ctx.lineTo(x + w, y + h - c);
		ctx.arcTo(x + w, y + h, x, y + h, c);
		ctx.lineTo(x + c, y + h);
		ctx.arcTo(x, y + h, x, y, c);
		ctx.lineTo(x, y + c);
		ctx.arcTo(x, y, x + w, y, c);
		ctx.closePath();
	}
}

interface Props {
	difficulty?: number;
	onSuccess?: () => void;
	onFailure?: () => void;
}

export default function FireMinigame({ difficulty = 0, onSuccess, onFailure }: Props) {
	const onSuccessRef = useRef(onSuccess);
	const onFailureRef = useRef(onFailure);
	onSuccessRef.current = onSuccess;
	onFailureRef.current = onFailure;
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const emojiCanvasRef = useRef<HTMLCanvasElement | null>(null);

	const DIFFICULTY = difficulty;

	// ── Progress (per ms × fires) ────────────────────────────────────────
	const GAIN_PER_FIRE = 0.0001;
	const DRAIN_PER_FIRE = 0.00005 + DIFFICULTY * 0.0000035;

	// ── Fire spread ──────────────────────────────────────────────────────
	const SPREAD_MS = 1_500;
	const MAX_FIRES = 4;
	const BASE_SPEED = 0.2 + DIFFICULTY * 0.01;

	// ── Fire erratic movement ────────────────────────────────────────────
	const ERRATIC = 0.2 + DIFFICULTY * 0.03;
	const ERRATIC_STRENGTH = 0.4 + DIFFICULTY * 0.02;

	// ── Fire health ──────────────────────────────────────────────────────
	const FIRE_HEALTH_DRAIN = 0.0006;
	const RESPAWN_MS = 600 - DIFFICULTY * 50;

	// ── Ember particles ──────────────────────────────────────────────────
	const EMBER_SPAWN_RATE = 0.15;
	const EMBER_SPEED = 0.4;

	const gs = useRef<GameState>({
		rectY: BAR_H / 2 - RECT_H / 2,
		rectVY: 0,
		pressing: false,
		fires: [makeFire(BASE_SPEED)],
		embers: [],
		progress: 0.5,
		lastTime: performance.now(),
		lastSpread: performance.now(),
		lastEmpty: null,
		done: false,
	});

	const [phase, setPhase] = useState<"ready" | "playing">("ready");
	const [uiProgress, setUiProgress] = useState(0.5);
	const [result, setResult] = useState<"win" | "lose" | null>(null);
	const rafId = useRef<number | undefined>(undefined);

	const press = useCallback(() => {
		gs.current.pressing = true;
	}, []);
	const release = useCallback(() => {
		gs.current.pressing = false;
	}, []);

	// ── Game loop ─────────────────────────────────────────────────────
	useEffect(() => {
		if (phase !== "playing") return;

		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const ec = document.createElement("canvas");
		ec.width = FIRE_PX * 2;
		ec.height = FIRE_PX * 2;
		emojiCanvasRef.current = ec;

		gs.current.lastTime = performance.now();
		gs.current.lastSpread = performance.now();

		const loop = (now: number) => {
			const s = gs.current;
			if (s.done) return;

			const dt = Math.min(now - s.lastTime, 50);
			s.lastTime = now;

			// Rectangle physics
			s.rectVY += s.pressing ? LIFT : GRAVITY;
			s.rectVY = Math.max(-MAX_VEL, Math.min(MAX_VEL, s.rectVY));
			s.rectY += s.rectVY;
			if (s.rectY <= 0) {
				s.rectY = 0;
				s.rectVY = Math.abs(s.rectVY) * BOUNCE;
			}
			if (s.rectY + RECT_H >= BAR_H) {
				s.rectY = BAR_H - RECT_H;
				s.rectVY = -Math.abs(s.rectVY) * BOUNCE;
			}

			// Fire movement
			for (const f of s.fires) {
				f.y += f.vy;
				if (f.y <= 0) {
					f.y = 0;
					f.vy = Math.abs(f.vy) * (0.65 + Math.random() * 0.5);
				}
				if (f.y + FIRE_PX >= BAR_H) {
					f.y = BAR_H - FIRE_PX;
					f.vy = -Math.abs(f.vy) * (0.65 + Math.random() * 0.5);
				}
				if (Math.random() < ERRATIC) {
					f.vy += (Math.random() - 0.5) * ERRATIC_STRENGTH * 2;
					f.vy = Math.max(-6, Math.min(6, f.vy));
				}
			}

			// Fire spreading
			const livingFires = s.fires.filter((f) => f.deadAt === null);
			if (
				now - s.lastSpread > SPREAD_MS &&
				livingFires.length < MAX_FIRES
			) {
				const parent =
					livingFires[Math.floor(Math.random() * livingFires.length)];
				if (parent) s.fires.push(makeFire(BASE_SPEED, parent.y, parent.health));
				s.lastSpread = now;
			}

			// Coverage + health drain
			const rectTop = s.rectY;
			const rectBot = s.rectY + RECT_H;
			let covered = 0;
			for (const f of s.fires) {
				if (f.deadAt !== null) continue;
				const mid = f.y + FIRE_PX / 2;
				if (mid >= rectTop && mid <= rectBot) {
					covered++;
					f.health -= FIRE_HEALTH_DRAIN * dt;
				}
			}
			for (const f of s.fires) {
				if (f.health <= 0 && f.deadAt === null) f.deadAt = now;
			}
			const FADE_OUT_MS = 200;
			s.fires = s.fires.filter(
				(f) => f.deadAt === null || now - f.deadAt < FADE_OUT_MS,
			);

			// Respawn
			if (s.fires.filter((f) => f.deadAt === null).length === 0) {
				if (s.lastEmpty === null) s.lastEmpty = now;
				else if (now - s.lastEmpty >= RESPAWN_MS) {
					s.fires.push(makeFire(BASE_SPEED));
					s.lastEmpty = null;
					s.lastSpread = now;
				}
			} else {
				s.lastEmpty = null;
			}

			// Progress
			const livingCount = s.fires.filter((f) => f.deadAt === null).length;
			const uncovered = livingCount - covered;
			if (livingCount > 0) {
				s.progress +=
					(GAIN_PER_FIRE * covered - DRAIN_PER_FIRE * uncovered) * dt;
				s.progress = Math.max(0, Math.min(1, s.progress));
			}
			setUiProgress(s.progress);

			if (s.progress >= 1) {
				s.done = true;
				setResult("win");
				return;
			}
			if (s.progress <= 0) {
				s.done = true;
				setResult("lose");
				return;
			}

			// Embers
			if (Math.random() < EMBER_SPAWN_RATE) {
				s.embers.push({
					x: Math.random() * CVS_W,
					y: CVS_H,
					vy: -(EMBER_SPEED * (0.4 + Math.random() * 0.8)),
					alpha: 0.3 + Math.random() * 0.4,
					size: 0.6 + Math.random() * 1.6,
				});
			}
			for (const e of s.embers) {
				e.y += e.vy * dt;
				e.alpha -= 0.0004 * dt;
			}
			s.embers = s.embers.filter((e) => e.alpha > 0 && e.y > 0);

			// ── Draw ──────────────────────────────────────────────────────
			ctx.clearRect(0, 0, CVS_W, CVS_H);

			ctx.fillStyle = "#0d0d0d";
			ctx.beginPath();
			drawRoundRect(ctx, 0, 0, CVS_W, CVS_H, 10);
			ctx.fill();

			ctx.fillStyle = "rgba(0,0,0,0.07)";
			for (let yy = 0; yy < BAR_H; yy += 4) ctx.fillRect(0, yy, CVS_W, 1);

			for (const e of s.embers) {
				ctx.save();
				ctx.globalAlpha = e.alpha;
				ctx.fillStyle = "#ff6010";
				ctx.beginPath();
				ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
				ctx.fill();
				ctx.restore();
			}

			ctx.fillStyle = "rgba(45,140,220,0.55)";
			ctx.strokeStyle = "rgba(120,210,255,0.75)";
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			drawRoundRect(ctx, 4, s.rectY + 2, CVS_W - 8, RECT_H - 4, 7);
			ctx.fill();
			ctx.beginPath();
			drawRoundRect(ctx, 4, s.rectY + 2, CVS_W - 8, RECT_H - 4, 7);
			ctx.stroke();

			ctx.save();
			ctx.globalAlpha = 0.55;
			ctx.fillStyle = "#bfefff";
			ctx.font = "bold 15px monospace";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("WATER", CVS_W / 2, s.rectY + RECT_H / 2);
			ctx.restore();

			const ectx = ec.getContext("2d");
			if (ectx) {
				for (const f of s.fires) {
					const scale = 0.5 + f.health * 0.5;
					const px = Math.round(FIRE_PX * scale);

					ectx.clearRect(0, 0, ec.width, ec.height);
					ectx.font = `${px}px serif`;
					ectx.textAlign = "center";
					ectx.textBaseline = "top";
					ectx.fillText("\uD83D\uDD25", ec.width / 2, 0);

					const fadeIn = Math.min(1, (now - f.born) / 300);
					const fadeOut =
						f.deadAt !== null ? 1 - (now - f.deadAt) / 400 : 1;
					ctx.globalAlpha = fadeIn * Math.max(0, fadeOut);

					const destX = CVS_W / 2 - ec.width / 2;
					const destY = f.y + (FIRE_PX - px) / 2;
					ctx.drawImage(ec, destX, destY);
					ctx.globalAlpha = 1;
				}
			}

			rafId.current = requestAnimationFrame(loop);
		};

		rafId.current = requestAnimationFrame(loop);
		return () => {
			if (rafId.current) cancelAnimationFrame(rafId.current);
		};
	}, [phase]);

	useEffect(() => {
		if (!result) return;
		const t = setTimeout(() => {
			if (result === "win") onSuccessRef.current?.();
			else onFailureRef.current?.();
		}, 1800);
		return () => clearTimeout(t);
	}, [result]);

	useEffect(() => {
		if (phase === "playing") return;
		
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === " " || e.key === "Enter") {
				e.preventDefault();
				press();
			}
		};

		const onKeyUp = (e: KeyboardEvent) => {
			if (e.key === " " || e.key === "Enter") {
				release();
			}
		};

		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
		}
	}, [phase, press, release]);

	const meterColor =
		uiProgress > 0.6 ? "#d97706" : uiProgress > 0.3 ? "#b45309" : "#b91c1c";

	return (
		<>
			<style>{`
        @keyframes fire-incident-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(185,28,28,0.35); }
          60%  { box-shadow: 0 0 0 10px rgba(185,28,28,0); }
          100% { box-shadow: 0 0 0 12px rgba(185,28,28,0); }
        }
        .fire-incident-icon-pulse {
          animation: fire-incident-pulse 2.2s cubic-bezier(0.25,0.1,0.25,1) infinite;
        }
      `}</style>

			{/* Backdrop */}
			<div
				className="fixed inset-0 z-[3000] flex items-center justify-center select-none"
				style={{ background: "rgba(0,0,0,0.80)" }}
				onMouseDown={phase === "playing" ? press : undefined}
				onMouseUp={phase === "playing" ? release : undefined}
				onTouchStart={phase === "playing" ? press : undefined}
				onTouchEnd={phase === "playing" ? release : undefined}
				aria-label={phase === "playing" ? "Fire containment game. Hold Space to push the water bar up, release to drop." : undefined}
			>
				{/* Panel */}
				<div
					className="flex flex-col rounded-xl shadow-xl shadow-black/60"
					style={{
						background: "rgba(0,0,0,0.55)",
						border: "1px solid rgba(120,53,15,0.40)",
						backdropFilter: "blur(12px)",
						WebkitBackdropFilter: "blur(12px)",
					}}
				>
					{/* ── Header ── */}
					<div
						className="flex items-center gap-3 px-4 py-3"
						style={{
							borderBottom: "1px solid rgba(120,53,15,0.40)",
						}}
					>
						<div
							className={`h-6 w-6 rounded-full border border-red-900 bg-red-900/30 flex items-center justify-center text-[12px] font-bold text-red-300 flex-shrink-0${phase === "playing" ? " fire-incident-icon-pulse" : ""}`}
						>
							!
						</div>
						<div
							className="text-xs font-semibold uppercase tracking-[0.18em]"
							style={{ color: "rgba(252,211,77,0.80)" }}
						>
							Fire Incident
						</div>
					</div>

					{/* ── READY SCREEN ── */}
					{phase === "ready" && (
						<div
							className="flex flex-col gap-5 px-4 py-4"
							style={{ width: 320 }}
						>
							{/* Preview diagram */}
							<div className="flex gap-4 items-center justify-center">
								<div className="flex flex-col items-center gap-1">
									<span
										className="text-[9px] uppercase tracking-[0.18em]"
										style={{
											color: "rgba(180,140,60,0.5)",
										}}
									>
										contain
									</span>
									<div
										style={{
											width: 10,
											height: 72,
											background: "#0d0d0d",
											border: "1px solid rgba(120,53,15,0.50)",
											borderRadius: 99,
											overflow: "hidden",
											display: "flex",
											flexDirection: "column-reverse",
										}}
									>
										<div
											style={{
												height: "50%",
												background: "#b45309",
												borderRadius: 99,
											}}
										/>
									</div>
								</div>

								<div
									style={{
										position: "relative",
										width: 40,
										height: 72,
										background: "#0d0d0d",
										border: "1px solid rgba(120,53,15,0.40)",
										borderRadius: 6,
										overflow: "hidden",
									}}
								>
									<div
										style={{
											position: "absolute",
											left: "50%",
											top: "14%",
											transform: "translateX(-50%)",
											fontSize: 16,
											lineHeight: 1,
										}}
									>
										🔥
									</div>
									<div
										style={{
											position: "absolute",
											left: 3,
											right: 3,
											top: "46%",
											height: 20,
											background: "rgba(45,140,220,0.50)",
											border: "1px solid rgba(120,210,255,0.55)",
											borderRadius: 3,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<span
											style={{
												fontSize: 6,
												color: "#bfefff",
												opacity: 0.65,
												fontFamily: "monospace",
											}}
										>
											WATER
										</span>
									</div>
								</div>
							</div>

							{/* Summary text — mimics incident summary style */}
							<div
								className="text-[11px] leading-relaxed"
								style={{ color: "rgba(252,211,77,0.60)" }}
							>
								Reports of smoke near a tenement block.
								Neighbors say they heard shouting.
							</div>

							{/* Instructions */}
							<div className="flex flex-col gap-2.5">
								{[
									{
										label: "HOLD",
										col: "rgba(217,119,6,0.90)",
										text: "Click/hold or press/hold Space to push the water bar upward.",
									},
									{
										label: "RELEASE",
										col: "rgba(96,165,250,0.90)",
										text: "Let go or release Spaceto drop it. It bounces off the edges.",
									},
									{
										label: "COVER",
										col: "rgba(74,222,128,0.90)",
										text: "Keep fires inside the bar to extinguish them. Meter fills while covered, drains while exposed.",
									},
									{
										label: "SPREAD",
										col: "rgba(248,113,113,0.90)",
										text: "Fires split and multiply over time. Don't let the meter empty.",
									},
								].map(({ label, col, text }) => (
									<div
										key={label}
										className="flex items-start gap-2.5"
									>
										<span
											className="text-[10px] font-bold uppercase tracking-[0.14em] flex-shrink-0 pt-0.5"
											style={{ color: col, minWidth: 52 }}
										>
											{label}
										</span>
										<span
											className="text-[11px] leading-snug"
											style={{
												color: "rgba(252,211,77,0.55)",
											}}
										>
											{text}
										</span>
									</div>
								))}
							</div>

							{/* Timer bar decoration */}
							<div
								className="h-[3px] w-full rounded-full overflow-hidden"
								style={{ background: "rgba(120,53,15,0.40)" }}
							>
								<div
									className="h-full rounded-full"
									style={{
										width: "70%",
										background: "rgba(217,119,6,0.70)",
									}}
								/>
							</div>

							{/* CTA button */}
							<button
								onClick={() => setPhase("playing")}
								className="w-full py-2.5 rounded-lg text-xs font-semibold uppercase tracking-[0.18em] cursor-pointer transition-all"
								style={{
									background: "rgba(127,29,29,0.50)",
									border: "1px solid rgba(153,27,27,0.65)",
									color: "rgba(252,165,165,0.90)",
								}}
								onMouseEnter={(e) => {
									const b =
										e.currentTarget as HTMLButtonElement;
									b.style.borderColor =
										"rgba(220,38,38,0.80)";
									b.style.color = "rgba(254,202,202,1)";
									b.style.background = "rgba(153,27,27,0.55)";
								}}
								onMouseLeave={(e) => {
									const b =
										e.currentTarget as HTMLButtonElement;
									b.style.borderColor =
										"rgba(153,27,27,0.65)";
									b.style.color = "rgba(252,165,165,0.90)";
									b.style.background = "rgba(127,29,29,0.50)";
								}}
							>
								Respond to Incident
							</button>
						</div>
					)}

					{/* ── PLAYING SCREEN ── */}
					{phase === "playing" && (
						<div className="flex gap-4 items-stretch px-4 py-4">
							{/* Containment meter */}
							<div className="flex flex-col items-center gap-2">
								<span
									className="text-[9px] uppercase tracking-[0.18em]"
									style={{ color: "rgba(180,140,60,0.5)" }}
								>
									Contain
								</span>
								<div
									className="flex-1 w-3 rounded-full overflow-hidden flex flex-col-reverse"
									style={{
										background: "rgba(12,10,9,0.9)",
										border: "1px solid rgba(120,53,15,0.50)",
										minHeight: BAR_H,
									}}
								>
									<div
										className="w-full rounded-full"
										style={{
											height: `${uiProgress * 100}%`,
											background: meterColor,
											transition: "background 0.3s",
										}}
									/>
								</div>
							</div>

							{/* Game canvas */}
							<canvas
								ref={canvasRef}
								width={CVS_W}
								height={CVS_H}
								style={{
									width: CVS_W,
									height: CVS_H,
									cursor: "pointer",
									touchAction: "none",
									borderRadius: 8,
									border: "1px solid rgba(120,53,15,0.40)",
									display: "block",
								}}
							/>
						</div>
					)}

					{/* ── Result banner ── */}
					{result && (
						<div
							className="px-4 py-3 flex items-center gap-2.5"
							style={{
								borderTop: "1px solid rgba(120,53,15,0.40)",
							}}
						>
							<div
								className="h-5 w-5 rounded-full border flex items-center justify-center text-[11px] font-bold flex-shrink-0"
								style={{
									borderColor:
										result === "win"
											? "rgba(21,128,61,0.7)"
											: "rgba(153,27,27,0.7)",
									background:
										result === "win"
											? "rgba(21,128,61,0.25)"
											: "rgba(153,27,27,0.25)",
									color:
										result === "win"
											? "rgba(134,239,172,0.9)"
											: "rgba(252,165,165,0.9)",
								}}
							>
								{result === "win" ? "✓" : "✕"}
							</div>
							<span
								className="text-xs font-semibold uppercase tracking-[0.18em]"
								style={{
									color:
										result === "win"
											? "rgba(134,239,172,0.90)"
											: "rgba(252,165,165,0.90)",
								}}
							>
								{result === "win"
									? "Fire Contained"
									: "Out of Control"}
							</span>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
