"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

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
	const target = Math.min(100, Math.max(0, adjustedPercent));
	const rollPos = Math.min(100, Math.max(0, rolled));

	return (
		<div className="space-y-2">
			<div className="relative h-4 w-full overflow-hidden rounded-full border border-amber-900/50 bg-rose-950/70">
				<div
					className="absolute inset-y-0 left-0 bg-linear-to-r from-emerald-700/70 to-emerald-500/45"
					style={{ width: `${target}%` }}
				/>
				<motion.div
					className="absolute top-1/2 z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-100 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.45)]"
					initial={{ left: "0%" }}
					animate={{ left: `${rollPos}%` }}
					transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
				/>
			</div>
		</div>
	);
}

type Props = {
	rolled: number;
	adjustedPercent: number;
	success: boolean;
	contextLabel: string;
	phase: "rolling" | "outcome";
	onContinue: () => void;
};

/**
 * Clean chance roll overlay:
 * - Animated 3D cube
 * - Chance %
 * - Success / Failure
 * - Continue button
 */
export default function IncidentChanceRollOverlay({
	rolled,
	adjustedPercent,
	success,
	contextLabel,
	phase,
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
					Chance Roll
				</p>

				<p className="mt-2 text-[11px] leading-snug text-amber-200/55">
					{contextLabel}
				</p>

				<div className="mt-4">
					<ChanceRollCube active />
				</div>

				<div className="mt-4">
					<p className="text-[11px] uppercase tracking-[0.18em] text-amber-200/45">
						Chance
					</p>
					<div className="mt-1 text-5xl font-black tracking-tight text-amber-50 tabular-nums">
						{adjustedPercent}%
					</div>
				</div>

				<div className="mt-5">
					<RollStrip
						rolled={rolled}
						adjustedPercent={adjustedPercent}
					/>
				</div>

				<div className="mt-6">
					<div
						className={`rounded-xl border px-4 py-4 text-2xl font-black tracking-[0.18em] ${
							success
								? "border-emerald-800/40 bg-emerald-950/25 text-emerald-300"
								: "border-rose-900/40 bg-rose-950/20 text-rose-300"
						}`}
					>
						{success ? "SUCCESS" : "FAILURE"}
					</div>
				</div>

				{!isRolling && (
					<button
						type="button"
						onClick={onContinue}
						className="mt-5 w-full cursor-pointer rounded-lg border border-amber-600/50 bg-amber-950/35 py-3 text-sm font-medium text-amber-50 transition hover:bg-amber-900/30"
					>
						Continue
					</button>
				)}
			</motion.div>
		</div>
	);
}
