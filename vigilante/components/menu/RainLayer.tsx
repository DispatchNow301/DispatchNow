"use client";

import { useEffect, useRef } from "react";

const DROPS = 80;
const SPEED = 0.4;

export default function RainLayer() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const drops: { el: HTMLDivElement; speed: number }[] = [];
		for (let i = 0; i < DROPS; i++) {
			const drop = document.createElement("div");
			drop.className = "absolute w-px bg-white/10 rounded-full";
			drop.style.height = `${8 + Math.random() * 16}px`;
			drop.style.left = `${Math.random() * 100}%`;
			drop.style.top = `${Math.random() * 100}%`;
			drop.style.opacity = `${0.1 + Math.random() * 0.15}`;
			container.appendChild(drop);
			drops.push({ el: drop, speed: 0.2 + Math.random() * SPEED });
		}

		let animationId = 0;
		const animate = () => {
			for (const { el, speed } of drops) {
				const top = parseFloat(el.style.top) || 0;
				el.style.top = `${(top + speed) % 100}%`;
			}
			animationId = requestAnimationFrame(animate);
		};
		animationId = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(animationId);
			for (const { el } of drops) el.remove();
		};
	}, []);

	return <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden />;
}

