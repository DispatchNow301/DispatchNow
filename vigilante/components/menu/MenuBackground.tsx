"use client";

import { useEffect, useRef } from "react";

export default function MenuBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationId = 0;
		let frame = 0;

		// Grain optimization: render a tiny noise tile and scale it up.
		// This avoids expensive full-screen getImageData/putImageData every frame.
		const grainCanvas = document.createElement("canvas");
		const grainCtx = grainCanvas.getContext("2d");
		const GRAIN_SIZE = 220;
		const GRAIN_FPS_DIVISOR = 6; // update grain every ~6 frames (~10fps @60hz)

		grainCanvas.width = GRAIN_SIZE;
		grainCanvas.height = GRAIN_SIZE;

		let grainPattern: CanvasPattern | null = null;
		const regenerateGrain = () => {
			if (!grainCtx) return;
			const img = grainCtx.createImageData(GRAIN_SIZE, GRAIN_SIZE);
			const d = img.data;
			for (let i = 0; i < d.length; i += 4) {
				// grayscale noise
				const v = 110 + Math.floor(Math.random() * 70);
				d[i] = v;
				d[i + 1] = v;
				d[i + 2] = v;
				d[i + 3] = Math.floor(Math.random() * 55); // alpha per pixel
			}
			grainCtx.putImageData(img, 0, 0);
			grainPattern = ctx.createPattern(grainCanvas, "repeat");
		};

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		const draw = () => {
			const { width, height } = canvas;
			ctx.clearRect(0, 0, width, height);

			const gradient = ctx.createLinearGradient(0, 0, 0, height);
			gradient.addColorStop(0, "#0a0a0b");
			gradient.addColorStop(0.4, "#0d0c0e");
			gradient.addColorStop(0.7, "#0a0808");
			gradient.addColorStop(1, "#050405");
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, width, height);

			const vignette = ctx.createRadialGradient(
				width / 2,
				height / 2,
				height * 0.2,
				width / 2,
				height / 2,
				height * 0.9
			);
			vignette.addColorStop(0, "transparent");
			vignette.addColorStop(0.6, "transparent");
			vignette.addColorStop(1, "rgba(0,0,0,0.72)");
			ctx.fillStyle = vignette;
			ctx.fillRect(0, 0, width, height);

			// Film grain overlay (fast): update occasionally, scale to full screen.
			if (!grainPattern || frame % GRAIN_FPS_DIVISOR === 0) {
				regenerateGrain();
			}
			if (grainPattern) {
				ctx.save();
				ctx.globalAlpha = 0.22;
				ctx.imageSmoothingEnabled = false;
				ctx.fillStyle = grainPattern;
				ctx.fillRect(0, 0, width, height);
				ctx.restore();
			}

			const streakY = height * 0.85 + Math.sin(frame * 0.02) * 8;
			const streakGradient = ctx.createLinearGradient(0, streakY - 90, 0, streakY + 90);
			streakGradient.addColorStop(0, "transparent");
			streakGradient.addColorStop(0.4, "rgba(180,140,80,0.03)");
			streakGradient.addColorStop(0.5, "rgba(200,160,90,0.065)");
			streakGradient.addColorStop(0.6, "rgba(180,140,80,0.03)");
			streakGradient.addColorStop(1, "transparent");
			ctx.fillStyle = streakGradient;
			ctx.fillRect(0, 0, width, height);

			frame++;
			animationId = requestAnimationFrame(draw);
		};

		resize();
		window.addEventListener("resize", resize);
		regenerateGrain();
		animationId = requestAnimationFrame(draw);

		return () => {
			window.removeEventListener("resize", resize);
			cancelAnimationFrame(animationId);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 w-full h-full object-cover pointer-events-none"
			aria-hidden
		/>
	);
}

