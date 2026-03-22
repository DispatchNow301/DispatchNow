"use client";

import { useEffect, useId, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import {
	ROLL_CREW_CORRELATION_STRENGTH,
	type DispatchRollBreakdown,
} from "@/lib/incidentRoll";

function ChanceRollCube({ active }: { active: boolean }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!active || !canvasRef.current) return;
		const canvas = canvasRef.current;
		let w = canvas.clientWidth;
		let h = canvas.clientHeight;
		if (w < 10) w = 200;
		if (h < 10) h = 112;

		const renderer = new THREE.WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true,
		});
		renderer.setSize(w, h);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 50);
		camera.position.z = 2.45;

		const geo = new THREE.BoxGeometry(0.72, 0.72, 0.72);
		const mat = new THREE.MeshStandardMaterial({
			color: 0xc9a068,
			metalness: 0.38,
			roughness: 0.42,
		});
		const cube = new THREE.Mesh(geo, mat);
		scene.add(cube);

		const key = new THREE.DirectionalLight(0xfff2dd, 1.15);
		key.position.set(2.2, 3.5, 2.8);
		scene.add(key);
		scene.add(new THREE.AmbientLight(0x2a3544, 0.5));

		let rafId = 0;
		const tick = () => {
			cube.rotation.x += 0.052;
			cube.rotation.y += 0.078;
			renderer.render(scene, camera);
			rafId = requestAnimationFrame(tick);
		};
		rafId = requestAnimationFrame(tick);

		const onResize = () => {
			if (!canvasRef.current) return;
			let cw = canvasRef.current.clientWidth;
			let ch = canvasRef.current.clientHeight;
			if (cw < 10) cw = 200;
			if (ch < 10) ch = 112;
			camera.aspect = cw / ch;
			camera.updateProjectionMatrix();
			renderer.setSize(cw, ch);
		};
		window.addEventListener("resize", onResize);

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener("resize", onResize);
			geo.dispose();
			mat.dispose();
			renderer.dispose();
		};
	}, [active]);

	return (
		<canvas
			ref={canvasRef}
			className="mx-auto h-28 w-full max-w-[220px]"
			aria-hidden
		/>
	);
}

function RollStrip({
	rolled,
	adjustedPercent,
}: {
	rolled: number;
	adjustedPercent: number;
}) {
	const stripId = useId();
	const target = Math.min(100, Math.max(0, adjustedPercent));
	const rollPos = Math.min(100, Math.max(0, rolled));

	return (
		<div className="space-y-1.5">
			<div className="flex justify-between text-[10px] text-amber-200/45">
				<span>0</span>
				<span className="max-w-[58%] text-center text-amber-200/65">
					green = success (roll must stay &lt; threshold)
				</span>
				<span>100</span>
			</div>
			<div
				className="relative h-3 w-full overflow-hidden rounded-full border border-amber-900/50 bg-rose-950/70"
				role="img"
				aria-labelledby={stripId}
			>
				<p id={stripId} className="sr-only">
					Chance strip from 0 to 100. Green zone from 0 to {target}
					percent. Your roll is {rollPos.toFixed(1)}.
				</p>
				<div
					className="absolute inset-y-0 left-0 bg-linear-to-r from-emerald-700/55 to-emerald-600/35"
					style={{ width: `${target}%` }}
				/>
				<motion.div
					className="absolute top-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-100 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.45)]"
					initial={{ left: "0%" }}
					animate={{ left: `${rollPos}%` }}
					transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
				/>
			</div>
		</div>
	);
}

function RollBreakdownPanel({
	breakdown,
	beforeLuckPercent,
	adjustedPercent,
}: {
	breakdown: DispatchRollBreakdown;
	beforeLuckPercent: number;
	adjustedPercent: number;
}) {
	const fmt = (n: number) => n.toFixed(2);
	const {
		baseChancePercent,
		resourceMultiplier,
		buffMultiplier,
		vigilanteMultiplier,
		avgArchetypeFit,
		luckDeltaPercent,
	} = breakdown;
	const staffingSupportMultiplier = breakdown.staffingSupportMultiplier ?? 1;
	const gearPresenceMultiplier = breakdown.gearPresenceMultiplier ?? 1;
	const rollBlend = Math.min(
		1,
		ROLL_CREW_CORRELATION_STRENGTH * avgArchetypeFit,
	);
	const luckStr =
		luckDeltaPercent === 0
			? "0"
			: luckDeltaPercent > 0
				? `+${luckDeltaPercent}`
				: `${luckDeltaPercent}`;

	return (
		<div className="rounded-lg border border-amber-900/40 bg-black/40 px-3 py-2.5 text-left">
			<p className="text-[10px] font-medium uppercase tracking-[0.14em] text-amber-500/70">
				How we got this target
			</p>
			<p className="mt-1.5 font-mono text-[10px] leading-relaxed text-amber-100/90 tabular-nums">
				<span className="text-amber-200/60">base</span>{" "}
				{baseChancePercent}%{" "}
				<span className="text-amber-200/45">×</span> gear{" "}
				{fmt(resourceMultiplier)}{" "}
				<span className="text-amber-200/45">×</span> buffs{" "}
				{fmt(buffMultiplier)}{" "}
				<span className="text-amber-200/45">×</span> crew{" "}
				{fmt(vigilanteMultiplier)}
			</p>
			<p className="mt-1 font-mono text-[10px] leading-relaxed text-amber-100/90 tabular-nums">
				<span className="text-amber-200/45">×</span> staffing{" "}
				{fmt(staffingSupportMultiplier)}{" "}
				<span className="text-amber-200/50">(ref. 2 people = 1.00)</span>
				{" "}
				<span className="text-amber-200/45">×</span> kit presence{" "}
				{fmt(gearPresenceMultiplier)}
			</p>
			<p className="mt-1.5 font-mono text-[10px] leading-relaxed text-amber-200/80 tabular-nums">
				→ {beforeLuckPercent}% before luck · luck {luckStr} →{" "}
				<span className="font-semibold text-emerald-300/95">
					{adjustedPercent}%
				</span>{" "}
				<span className="text-amber-200/55">final threshold</span>
			</p>
			<p className="mt-2 font-mono text-[10px] leading-relaxed text-amber-200/75 tabular-nums">
				Crew archetype fit {(avgArchetypeFit * 100).toFixed(0)}%
				<span className="text-amber-200/45"> (stats vs this type)</span>
				{" · "}
				<span className="text-amber-200/55">
					roll mix {(100 - rollBlend * 100).toFixed(0)}% chaos /{" "}
					{(rollBlend * 100).toFixed(0)}% tight execution
				</span>
			</p>
			<p className="mt-2 text-[9px] leading-snug text-amber-200/50">
				Base is from when the incident spawned. Multiply gear × buffs × crew
				fit × staffing × kit presence, round, then a small luck tweak →{" "}
				<span className="font-semibold text-amber-200/65">
					threshold (roll under this)
				</span>
				. The 0–100 resolution draw is{" "}
				<span className="text-amber-200/65">not</span> pure noise: higher
				fit pulls it toward low “execution” rolls (still not deterministic).{" "}
				<span className="text-amber-300/55">
					Unlike “meet or beat a DC,” a lower draw is better here.
				</span>
			</p>
		</div>
	);
}

/** Makes roll-under explicit: many players read “70%” as “roll ≥ 70”. */
function RollVerdictLine({
	rolled,
	adjustedPercent,
	success,
}: {
	rolled: number;
	adjustedPercent: number;
	success: boolean;
}) {
	const cmp = success ? "<" : "≥";
	const margin = success
		? adjustedPercent - rolled
		: rolled - adjustedPercent;

	return (
		<div className="mt-2 rounded-lg border border-amber-800/40 bg-amber-950/30 px-3 py-2.5 text-left">
			<p className="text-[10px] font-medium uppercase tracking-[0.12em] text-amber-500/70">
				How your roll is read
			</p>
			<p className="mt-1 font-mono text-[12px] leading-snug text-amber-50/95 tabular-nums">
				{rolled.toFixed(1)} {cmp} {adjustedPercent}{" "}
				<span className="text-amber-200/55">→</span>{" "}
				<span
					className={
						success ? "font-semibold text-emerald-400" : "font-semibold text-rose-400"
					}
				>
					{success ? "Success" : "Failure"}
				</span>
			</p>
			<p className="mt-1.5 text-[10px] leading-snug text-amber-200/55">
				{success ? (
					<>
						<span className="text-emerald-400/90">
							{margin.toFixed(1)} pts of room
						</span>{" "}
						under the threshold — a low draw is good here, not bad.
					</>
				) : (
					<>
						Missed by{" "}
						<span className="text-rose-400/90">
							{margin.toFixed(1)} pts
						</span>
						. You needed a roll{" "}
						<span className="font-semibold text-amber-100/80">
							strictly below {adjustedPercent}
						</span>
						.
					</>
				)}
			</p>
		</div>
	);
}

type Props = {
	rolled: number;
	adjustedPercent: number;
	success: boolean;
	/** After multipliers, before ±luck jitter */
	beforeLuckPercent: number;
	breakdown: DispatchRollBreakdown;
	/** e.g. &quot;Allergic reaction · Medical&quot; */
	contextLabel: string;
	/** Rolling: only the sim. Outcome: gear message + continue. */
	phase: "rolling" | "outcome";
	/** Whether resources were staged on this dispatch (for gear copy). */
	hadDeployedGear: boolean;
	onContinue: () => void;
};

/**
 * Full-screen chance roll: spinning 3D cube + 0–100 strip; outcome phase explains gear.
 */
export default function IncidentChanceRollOverlay({
	rolled,
	adjustedPercent,
	beforeLuckPercent,
	breakdown,
	contextLabel,
	success,
	phase,
	hadDeployedGear,
	onContinue,
}: Props) {
	const isRolling = phase === "rolling";

	return (
		<div
			className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/65 p-4 backdrop-blur-[2px]"
			role="dialog"
			aria-modal
			aria-label="Chance roll"
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.96 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.25 }}
				className="w-full max-w-md rounded-2xl border border-amber-800/45 bg-[#080706]/95 px-5 py-5 text-center shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
			>
				<p className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-500/75">
					Chance roll
				</p>
				<p className="mt-2 text-[11px] leading-snug text-amber-200/65">
					{contextLabel}
				</p>
				<div className="mt-3 text-left">
					<RollBreakdownPanel
						breakdown={breakdown}
						beforeLuckPercent={beforeLuckPercent}
						adjustedPercent={adjustedPercent}
					/>
				</div>
				{isRolling ? (
					<p className="mt-3 text-xs leading-snug text-amber-200/70">
						<span className="text-amber-100/95">Roll-under check:</span> we
						draw 0–100. Success means the number is{" "}
						<span className="font-semibold text-emerald-300/90">
							strictly less
						</span>{" "}
						than the threshold (green zone).{" "}
						<span className="text-amber-200/55">
							A small number is a good draw, not a bad one.
						</span>
					</p>
				) : (
					<p className="mt-3 text-xs leading-snug text-amber-200/70">
						Roll locked in — see how it compares below. Gear outcome after
						that.
					</p>
				)}

				<div className="mt-3">
					<ChanceRollCube active />
				</div>

				<div className="mt-4 space-y-2">
					<div className="flex flex-wrap items-baseline justify-center gap-x-1.5 gap-y-0.5 text-sm">
						<span className="text-amber-200/60">Threshold (roll under)</span>
						<span className="font-bold tabular-nums text-amber-100">
							{adjustedPercent}%
						</span>
						<span className="text-[11px] text-amber-200/45">
							not “at least”
						</span>
					</div>

					<RollStrip rolled={rolled} adjustedPercent={adjustedPercent} />

					<div className="pt-1">
						<span className="text-[10px] uppercase tracking-[0.14em] text-amber-200/45">
							Your roll
						</span>
						<div className="mt-0.5 text-2xl font-bold tabular-nums tracking-tight text-amber-50">
							{rolled.toFixed(1)}
						</div>
						<RollVerdictLine
							rolled={rolled}
							adjustedPercent={adjustedPercent}
							success={success}
						/>
					</div>

					{isRolling ? (
						<div className="rounded-lg border border-amber-900/50 bg-black/30 px-3 py-2 text-xs text-amber-200/65">
							Resolving dispatch…
						</div>
					) : (
						<>
							<div
								className={`rounded-lg border px-3 py-2.5 text-left text-xs leading-snug ${
									success
										? "border-emerald-800/40 bg-emerald-950/25 text-emerald-200/90"
										: "border-rose-900/40 bg-rose-950/20 text-rose-200/85"
								}`}
							>
								{success ? (
									hadDeployedGear ? (
										<>
											<span className="font-semibold text-emerald-100/95">
												Returning gear
											</span>{" "}
											— staged equipment is being added
											back to your pool now.
										</>
									) : (
										<>
											<span className="font-semibold text-emerald-100/95">
												Crew-only dispatch.
											</span>{" "}
											No gear was staged, so there is
											nothing to return.
										</>
									)
								) : hadDeployedGear ? (
									<>
										<span className="font-semibold text-rose-100/95">
											Gear not recovered.
										</span>{" "}
										Staged equipment stays lost: it is
										removed from your inventory (not
										returned to the pool).
									</>
								) : (
									<>
										<span className="font-semibold text-rose-100/95">
											No gear at risk.
										</span>{" "}
										Nothing was staged, so no equipment was
										lost.
									</>
								)}
							</div>
							<button
								type="button"
								onClick={onContinue}
								className="mt-1 w-full cursor-pointer rounded-lg border border-amber-600/50 bg-amber-950/35 py-2.5 text-sm font-medium text-amber-50 transition hover:bg-amber-900/30"
							>
								Continue
							</button>
						</>
					)}
				</div>
			</motion.div>
		</div>
	);
}
